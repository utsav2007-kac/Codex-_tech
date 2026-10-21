import http from 'http';

function fetchPage(path) {
  return new Promise((resolve) => {
    http.get('http://localhost:5000' + path, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ path, status: res.statusCode, body }));
    });
  });
}

async function run() {
  console.log('🔍 Testing Dynamic SEO Pre-Rendering & Static Metadata...\n');
  const routes = ['/', '/services', '/careers', '/robots.txt', '/sitemap.xml'];

  for (const path of routes) {
    const res = await fetchPage(path);
    console.log(`=== Route: ${path} [HTTP ${res.status}] ===`);
    if (path.endsWith('.txt') || path.endsWith('.xml')) {
      console.log(res.body.slice(0, 300).trim());
    } else {
      const titleMatch = res.body.match(/<title>([^<]+)<\/title>/);
      const descMatch = res.body.match(/<meta name="description" content="([^"]+)"/);
      const canonicalMatch = res.body.match(/<link rel="canonical" href="([^"]+)"/);
      const ogTitleMatch = res.body.match(/<meta property="og:title" content="([^"]+)"/);
      const ogDescMatch = res.body.match(/<meta property="og:description" content="([^"]+)"/);
      const ogUrlMatch = res.body.match(/<meta property="og:url" content="([^"]+)"/);

      console.log('Title:       ', titleMatch ? titleMatch[1] : '❌ MISSING');
      console.log('Description: ', descMatch ? descMatch[1] : '❌ MISSING');
      console.log('Canonical:   ', canonicalMatch ? canonicalMatch[1] : '❌ MISSING');
      console.log('OG Title:    ', ogTitleMatch ? ogTitleMatch[1] : '❌ MISSING');
      console.log('OG Desc:     ', ogDescMatch ? ogDescMatch[1] : '❌ MISSING');
      console.log('OG URL:      ', ogUrlMatch ? ogUrlMatch[1] : '❌ MISSING');
    }
    console.log('--------------------------------------------------\n');
  }
}

run();
