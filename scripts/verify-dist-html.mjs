import fs from 'fs';

const html = fs.readFileSync('client/dist/index.html', 'utf-8');
console.log('File size:', html.length, 'bytes');
console.log('Contains "We Deliver Jobs":', html.includes('We Deliver Jobs'));
console.log('Contains "Faster.":', html.includes('Faster.'));
console.log('Contains literal {\' \'}:', html.includes("{' '}") || html.includes("{ ' ' }"));
console.log('Contains logo width/height attributes:', html.includes('width="168"') && html.includes('height="48"'));
console.log('Contains render-blocking CSS in head:', html.includes('<link rel="stylesheet" href="/assets/index-'));
console.log('Contains critical theme CSS:', html.includes('id="critical-theme-css"'));
console.log('Contains font preload:', html.includes('as="font"'));
