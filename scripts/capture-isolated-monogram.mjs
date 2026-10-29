import { chromium } from '@playwright/test';
import fs from 'fs';

async function captureIsolatedMonogram() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-hero-scene="codex-stage"] canvas');
  await page.waitForTimeout(1000);

  // Hide overlapping DOM cards and SVG lines/orbits so we get ONLY the pure 3D monogram
  await page.evaluate(() => {
    const stage = document.querySelector('[data-hero-scene="codex-stage"]');
    if (!stage) return;
    const cards = stage.querySelectorAll('.hero-anim-card-1, .hero-anim-card-2, .hero-anim-card-3, .hero-anim-card-4');
    cards.forEach((c) => (c.style.visibility = 'hidden'));
    const svgs = stage.querySelectorAll('svg');
    svgs.forEach((s) => (s.style.visibility = 'hidden'));
  });

  await page.waitForTimeout(100);

  const canvas = await page.$('[data-hero-scene="codex-stage"] canvas');
  const buf = await canvas.screenshot({ omitBackground: true });
  fs.writeFileSync('d:/web devlopment/client/public/assets/codex-3d-monogram.png', buf);
  console.log('Saved isolated codex-3d-monogram.png:', buf.length, 'bytes');

  await browser.close();
}

captureIsolatedMonogram().catch(console.error);
