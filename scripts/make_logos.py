from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs('d:/web devlopment/client/public/assets', exist_ok=True)

def render_logo(is_dark=False, filename="logo.png"):
    img = Image.new("RGBA", (840, 200), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Monogram center: x=100, y=100
    # C arc
    c_color = (255, 255, 255, 255) if is_dark else (31, 106, 165, 255) # Blue-600
    orange = (241, 90, 52, 255) # Orange-500
    white = (255, 255, 255, 255)
    text_color = (255, 255, 255, 255) if is_dark else (31, 106, 165, 255)
    tag_color = (148, 163, 184, 255) if is_dark else (71, 85, 105, 255)

    # Draw C shape
    bbox = [30, 30, 160, 160]
    draw.arc(bbox, start=50, end=310, fill=c_color, width=18)

    # Draw X person head
    draw.ellipse([110, 40, 142, 72], fill=orange)

    # Draw X crossed lines
    draw.line([85, 145, 145, 85], fill=orange, width=16)
    draw.line([85, 85, 145, 145], fill=c_color, width=16)
    draw.ellipse([108, 108, 122, 122], fill=(11, 27, 46, 255) if is_dark else white)

    try:
        font_large = ImageFont.truetype("arialbd.ttf", 68)
        font_tag = ImageFont.truetype("arialbd.ttf", 22)
    except:
        font_large = ImageFont.load_default()
        font_tag = ImageFont.load_default()

    # Draw CODEX (Orange)
    draw.text((200, 48), "CODEX", font=font_large, fill=orange)
    # Draw TECH-IT
    draw.text((490, 48), "TECH-IT", font=font_large, fill=text_color)
    # Draw TAGLINE
    draw.text((205, 138), "WE DELIVER JOBS FASTER", font=font_tag, fill=tag_color)

    img.save(f"d:/web devlopment/client/public/assets/{filename}", "PNG")
    print(f"Rendered {filename}")

render_logo(False, "logo.png")
render_logo(True, "logo-white.png")
