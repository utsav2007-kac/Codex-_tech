import urllib.request, ssl, re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request('https://codextech-it.com/about-us', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ctx) as r:
    html = r.read().decode('utf-8', errors='ignore')

matches = re.findall(r'<div class="testimonials_title">\s*<h5>-\s*([^,<]+),.*?<div class="testimonials_quote">\s*<p>(.*?)</p>', html, re.DOTALL)
print(f"Found {len(matches)} testimonials")
for name, quote in matches:
    clean_quote = re.sub(r'\s+', ' ', quote).strip().strip('"')
    print(f"NAME: {name.strip()}")
    print(f"QUOTE: {clean_quote}")
    print("---")

