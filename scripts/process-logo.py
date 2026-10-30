import os
import base64
from PIL import Image
import numpy as np

src_path = r'C:\Users\iGen Systems\.gemini\antigravity\brain\24257650-6bb9-47cd-afe7-aec6be5496d1\.user_uploaded\media_1793257047444_e35b1c46.png'
assets_dir = r'd:\web devlopment\client\public\assets'

# 1. Backup existing assets if not backed up
for f in ['logo.svg', 'logo.png', 'logo-white.svg', 'logo-white.png']:
    orig = os.path.join(assets_dir, f)
    bak = os.path.join(assets_dir, f.replace('.', '-backup.'))
    if os.path.exists(orig) and not os.path.exists(bak):
        with open(orig, 'rb') as r, open(bak, 'wb') as w:
            w.write(r.read())
print('Backups verified.')

# 2. Process source logo
im = Image.open(src_path).convert('RGBA')
arr = np.array(im, dtype=np.float32)

# Bounding box of content: x: 117 to 895, y: 485 to 621
pad = 6
x0 = max(0, 117 - pad)
y0 = max(0, 485 - pad)
x1 = min(1024, 895 + pad)
y1 = min(1024, 621 + pad)

crop = arr[y0:y1, x0:x1].copy()
h, w, _ = crop.shape
print(f'Cropped dimensions: {w} x {h}')

# Clean alpha transparency
min_val = np.min(crop[:, :, :3], axis=2)
diff = 255.0 - min_val

alpha = np.zeros_like(diff)
mask_solid = diff >= 35.0
mask_edge = (diff > 1.0) & (diff < 35.0)

alpha[mask_solid] = 255.0
alpha[mask_edge] = (diff[mask_edge] / 35.0) * 255.0

result = crop.copy()
result[:, :, 3] = alpha

# Unmultiply edges
for c in range(3):
    a = alpha / 255.0
    safe_a = np.maximum(a, 0.001)
    unmult = (crop[:, :, c] - 255.0 * (1.0 - a)) / safe_a
    result[:, :, c] = np.where(alpha > 0, np.clip(unmult, 0, 255), 255)

logo_color = Image.fromarray(result.astype(np.uint8))
color_png_path = os.path.join(assets_dir, 'logo.png')
logo_color.save(color_png_path, 'PNG', optimize=True)
print('Saved:', color_png_path)

# 3. Create white logo for dark backgrounds
white_arr = np.zeros_like(result)
white_arr[:, :, 0] = 255
white_arr[:, :, 1] = 255
white_arr[:, :, 2] = 255
white_arr[:, :, 3] = alpha
logo_white = Image.fromarray(white_arr.astype(np.uint8))
white_png_path = os.path.join(assets_dir, 'logo-white.png')
logo_white.save(white_png_path, 'PNG', optimize=True)
print('Saved:', white_png_path)

# 4. Generate SVG wrappers with embedded base64
with open(color_png_path, 'rb') as f:
    b64_color = base64.b64encode(f.read()).decode('utf-8')

svg_color = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" fill="none">
  <image width="{w}" height="{h}" href="data:image/png;base64,{b64_color}"/>
</svg>'''

color_svg_path = os.path.join(assets_dir, 'logo.svg')
with open(color_svg_path, 'w', encoding='utf-8') as f:
    f.write(svg_color)
print('Saved:', color_svg_path)

with open(white_png_path, 'rb') as f:
    b64_white = base64.b64encode(f.read()).decode('utf-8')

svg_white = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" fill="none">
  <image width="{w}" height="{h}" href="data:image/png;base64,{b64_white}"/>
</svg>'''

white_svg_path = os.path.join(assets_dir, 'logo-white.svg')
with open(white_svg_path, 'w', encoding='utf-8') as f:
    f.write(svg_white)
print('Saved:', white_svg_path)

# Clean up test files if any
for t in ['test_logo_trans.png', 'test_comp_white.png', 'test_comp_dark.png', 'test_logo_white.png']:
    tp = os.path.join(assets_dir, t)
    if os.path.exists(tp):
        os.remove(tp)

print('All logo assets successfully updated!')

