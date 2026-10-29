async function verify() {
  const url = 'http://localhost:5000/insights/ats-resume-optimization-guide-2026';
  const res = await fetch(url);
  console.log('HTTP Status:', res.status);
  console.log('Headers:');
  for (const [k, v] of res.headers.entries()) {
    console.log(`  ${k}: ${v}`);
  }
  
  const html = await res.text();
  console.log('\n--- Title ---');
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
  console.log(titleMatch ? titleMatch[1] : 'No title');

  console.log('\n--- JSON-LD Schema Blocks ---');
  const schemaRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let match;
  let count = 0;
  while ((match = schemaRegex.exec(html)) !== null) {
    count++;
    console.log(`\n[Block ${count}]:`);
    try {
      const parsed = JSON.parse(match[1]);
      console.log(JSON.stringify(parsed, null, 2));
    } catch {
      console.log(match[1]);
    }
  }

  console.log('\n--- 404 Response Verification ---');
  const res404 = await fetch('http://localhost:5000/insights/non-existent-slug-404-test');
  console.log('404 Request Status:', res404.status);
  const text404 = await res404.text();
  console.log('404 Contains Article Not Found / 404 UI:', text404.includes('Article Not Found') || text404.includes('404'));
}

verify().catch(console.error);
