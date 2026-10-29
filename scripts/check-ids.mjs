import fs from 'fs';

async function check() {
  const filePath = 'd:/web devlopment/client/dist/insights/ats-resume-optimization-guide-2026/index.html';
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist:', filePath);
    return;
  }
  const html = fs.readFileSync(filePath, 'utf-8');
  const matches = [...html.matchAll(/<(h[23])[^>]*id="([^"]*)"[^>]*>(.*?)<\/\1>/gi)];
  console.log(`Heading IDs found in ${filePath} (${matches.length}):`);
  matches.forEach(m => console.log(`  <${m[1]} id="${m[2]}">${m[3].replace(/<[^>]*>/g, '')}`));
}
check();
