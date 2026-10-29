// scripts/verify-curl.mjs
async function testCurl() {
  const blogRes = await fetch('http://localhost:5000/blog');
  const blogHtml = await blogRes.text();
  console.log('=== /blog Status:', blogRes.status, '===');
  const blogCanonical = (blogHtml.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  const blogTitle = (blogHtml.match(/<title>(.*?)<\/title>/) || [])[1];
  console.log('Canonical:', blogCanonical);
  console.log('Title:', blogTitle);
  console.log('Has "Blogs" header in HTML:', blogHtml.includes('Blogs'));

  const detailRes = await fetch('http://localhost:5000/blog/ats-resume-optimization-guide-2026');
  const detailHtml = await detailRes.text();
  console.log('\n=== /blog/ats-resume-optimization-guide-2026 Status:', detailRes.status, '===');
  const detailCanonical = (detailHtml.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  const detailOg = (detailHtml.match(/<meta property="og:url" content="([^"]+)"/) || [])[1];
  const detailTitle = (detailHtml.match(/<title>(.*?)<\/title>/) || [])[1];
  console.log('Canonical:', detailCanonical);
  console.log('OG URL:', detailOg);
  console.log('Title:', detailTitle);
  
  const jsonLdMatches = detailHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
  console.log('JSON-LD scripts count:', jsonLdMatches.length);
  for (const m of jsonLdMatches) {
    const raw = m.replace(/<\/?script[^>]*>/g, '');
    try {
      const parsed = JSON.parse(raw);
      console.log('  Type:', parsed['@type'], parsed['@type'] === 'BreadcrumbList' ? JSON.stringify(parsed.itemListElement) : '');
    } catch (e) {
      console.log('  Parse error:', e.message);
    }
  }

  const insightsRes = await fetch('http://localhost:5000/insights');
  const insightsHtml = await insightsRes.text();
  console.log('\n=== /insights Status:', insightsRes.status, '===');
  const insightsHasBlog = insightsHtml.includes('blog-prerendered-content') || insightsHtml.includes('ats-resume-optimization-guide-2026');
  console.log('Has blog content?:', insightsHasBlog);
  const insightsCanonical = (insightsHtml.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  console.log('Insights Canonical:', insightsCanonical);
}

testCurl().catch(console.error);
