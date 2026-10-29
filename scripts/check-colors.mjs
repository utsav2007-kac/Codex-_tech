import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:4173/assets/codex-3d-monogram.png');
  const res = await page.evaluate(() => {
    const img = document.querySelector('img');
    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    
    // Find dominant color buckets
    const colors = {};
    for (let i = 0; i < d.length; i += 16) {
      const a = d[i+3];
      if (a < 50) continue;
      const r = Math.round(d[i] / 20) * 20;
      const g = Math.round(d[i+1] / 20) * 20;
      const b = Math.round(d[i+2] / 20) * 20;
      const key = r + ',' + g + ',' + b;
      colors[key] = (colors[key] || 0) + 1;
    }
    const sorted = Object.entries(colors).sort((a,b) => b[1] - a[1]).slice(0, 25);
    return { width: c.width, height: c.height, topColors: sorted };
  });
  console.log(JSON.stringify(res, null, 2));
  await browser.close();
})();
