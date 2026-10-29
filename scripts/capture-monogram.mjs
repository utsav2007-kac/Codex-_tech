import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function captureMonogram() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to preview to render 3D Monogram...');
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });

  // Wait for the 3D canvas element to mount
  await page.waitForSelector('[data-hero-scene="codex-stage"] canvas', { timeout: 10000 });
  await page.waitForTimeout(1000); // Allow R3F to compile shaders and render stable frame

  // Capture the canvas image data URL
  const dataUrl = await page.evaluate(async () => {
    const canvas = document.querySelector('[data-hero-scene="codex-stage"] canvas');
    if (!canvas) return null;
    return canvas.toDataURL('image/png');
  });

  if (!dataUrl || dataUrl.length < 100) {
    console.error('Failed to get canvas data URL, attempting element screenshot...');
    const canvasEl = await page.$('[data-hero-scene="codex-stage"] canvas');
    if (canvasEl) {
      const buf = await canvasEl.screenshot({ omitBackground: true });
      fs.writeFileSync('d:/web devlopment/client/public/assets/codex-3d-monogram.png', buf);
      console.log('Saved codex-3d-monogram.png via element screenshot');
    }
  } else {
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync('d:/web devlopment/client/public/assets/codex-3d-monogram.png', base64Data, 'base64');
    console.log('Saved codex-3d-monogram.png via canvas.toDataURL!');
  }

  await browser.close();
}

captureMonogram().catch(console.error);
