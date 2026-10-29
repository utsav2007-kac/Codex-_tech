import { chromium } from '@playwright/test';
import fs from 'fs';

async function testScreenshot() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-hero-scene="codex-stage"] canvas');
  await page.waitForTimeout(1500);

  const canvas = await page.$('[data-hero-scene="codex-stage"] canvas');
  const buf = await canvas.screenshot({ omitBackground: true });
  fs.writeFileSync('d:/web devlopment/client/public/assets/codex-3d-monogram.png', buf);
  console.log('Canvas screenshot size:', buf.length, 'bytes');

  await browser.close();
}

testScreenshot();
