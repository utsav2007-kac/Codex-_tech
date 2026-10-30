import urllib.request, ssl, re, json
from html.parser import HTMLParser

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = [
    'https://codextech-it.com/',
    'https://codextech-it.com/about-us',
    'https://codextech-it.com/services',
    'https://codextech-it.com/faqs',
    'https://codextech-it.com/refer-and-earn',
    'https://codextech-it.com/contact'
]

results = {}

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
        self.ignore = False
    def handle_starttag(self, tag, attrs):
        if tag in ['script', 'style']:
            self.ignore = True
    def handle_endtag(self, tag):
        if tag in ['script', 'style']:
            self.ignore = False
    def handle_data(self, data):
        if not self.ignore:
            cleaned = data.strip()
            if cleaned:
                self.text.append(cleaned)

for u in urls:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            raw = resp.read().decode('utf-8', errors='ignore')
            parser = TextExtractor()
            parser.feed(raw)
            results[u] = "\n".join(parser.text)
            print(f"Scraped {u}: {len(results[u])} chars")
    except Exception as e:
        print(f"Error {u}: {e}")

with open('old_site_extracted.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)
print("Saved to old_site_extracted.json")

