import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

with open('old_site_home.html', 'r', encoding='utf-8') as f:
    text = f.read()

links = set(re.findall(r'href=[\'"]([^\'"]+)[\'"]', text))
internal_links = set()
for l in links:
    if 'codextech-it.com' in l or (l.startswith('/') and not l.startswith('//')):
        internal_links.add(l)

print("Found internal links:")
for l in sorted(internal_links):
    print(" ", l)

names = ['Raj Chauhan', 'Anjana Thomas', 'Ramandeep Kaur', 'Smit Patel', 'Shweta Singh', 'Sonia Rajput', 'Maharshi Bhardwaj']

# Fetch other pages to find testimonials and other content
for link in sorted(internal_links):
    url = link if link.startswith('http') else 'https://www.codextech-it.com' + link
    if any(ext in url for ext in ['.css', '.js', '.png', '.jpg', '.svg', '.ico', '.woff']):
        continue
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=8) as resp:
            page_content = resp.read().decode('utf-8', errors='ignore')
            for n in names:
                if n.lower() in page_content.lower():
                    print(f"FOUND {n} in {url}!")
                    idx = page_content.lower().find(n.lower())
                    print("Snippet:", page_content[max(0, idx-100):min(len(page_content), idx+400)])
    except Exception as e:
        print(f"Error fetching {url}: {e}")

