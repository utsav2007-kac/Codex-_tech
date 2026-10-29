import { chromium } from '@playwright/test';
import fs from 'fs';

async function convertToWebP() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  const pngBase64 = fs.readFileSync('d:/web devlopment/client/public/assets/codex-3d-monogram.png').toString('base64');
  
  const webpDataUrl = await page.evaluate(async (b64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(c.toDataURL('image/webp', 0.95));
      };
      img.src = 'data:image/png;base64,' + b64;
    });
  }, pngBase64);

  const base64Data = webpDataUrl.replace(/^data:image\/webp;base64,/, '');
  fs.writeFileSync('d:/web devlopment/client/public/assets/codex-3d-monogram.webp', base64Data, 'base64');
  console.log('Saved codex-3d-monogram.webp, size:', fs.statSync('d:/web devlopment/client/public/assets/codex-3d-monogram.webp').size, 'bytes');

  await browser.close();
}

convertToWebP().catch(console.error);
