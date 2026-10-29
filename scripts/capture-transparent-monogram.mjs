import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = 'd:/web devlopment/client/public/assets';
const DIST_DIR = 'd:/web devlopment/client/dist/assets';

async function main() {
  console.log('Capturing exact transparent 3D WebGL render from live Three.js scene...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });

  // Wait for canvas to mount and render at least a couple frames
  await page.waitForSelector('[data-hero-scene="codex-stage"] canvas');
  await page.waitForTimeout(1000);

  const dataUrls = await page.evaluate(() => {
    const canvas = document.querySelector('[data-hero-scene="codex-stage"] canvas');
    if (!canvas) return null;
    return {
      png: canvas.toDataURL('image/png'),
      webp: canvas.toDataURL('image/webp', 0.95),
      width: canvas.width,
      height: canvas.height,
    };
  });

  if (!dataUrls) {
    throw new Error('Canvas not found!');
  }

  console.log(`Canvas size: ${dataUrls.width}x${dataUrls.height}`);

  const pngBuffer = Buffer.from(dataUrls.png.split(',')[1], 'base64');
  const webpBuffer = Buffer.from(dataUrls.webp.split(',')[1], 'base64');

  fs.writeFileSync(path.join(PUBLIC_DIR, 'codex-3d-monogram.png'), pngBuffer);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'codex-3d-monogram.webp'), webpBuffer);

  fs.writeFileSync(path.join(DIST_DIR, 'codex-3d-monogram.png'), pngBuffer);
  fs.writeFileSync(path.join(DIST_DIR, 'codex-3d-monogram.webp'), webpBuffer);

  console.log(`Saved transparent PNG: ${pngBuffer.length} bytes`);
  console.log(`Saved transparent WebP: ${webpBuffer.length} bytes`);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
