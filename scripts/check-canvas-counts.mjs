import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl'] });

  // 1. Desktop 1440px
  const pageDesk = await browser.newPage();
  await pageDesk.setViewportSize({ width: 1440, height: 900 });
  await pageDesk.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await pageDesk.waitForTimeout(1000);
  const homeDeskCanvases = await pageDesk.$$eval('canvas', els => els.length);
  console.log('Home 1440px canvas count:', homeDeskCanvases);

  // 2. Subpage 1440px
  await pageDesk.goto('http://localhost:5173/about', { waitUntil: 'networkidle' });
  await pageDesk.waitForTimeout(1000);
  const aboutDeskCanvases = await pageDesk.$$eval('canvas', els => els.length);
  console.log('About 1440px canvas count:', aboutDeskCanvases);

  // 3. Return to Home
  await pageDesk.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await pageDesk.waitForTimeout(1000);
  const returnHomeCanvases = await pageDesk.$$eval('canvas', els => els.length);
  console.log('Return to Home canvas count:', returnHomeCanvases);
  await pageDesk.close();

  // 4. Mobile 390px
  const pageMob = await browser.newPage();
  await pageMob.setViewportSize({ width: 390, height: 844 });
  await pageMob.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await pageMob.waitForTimeout(1000);
  const mobCanvases = await pageMob.$$eval('canvas', els => els.length);
  console.log('Home 390px (Mobile) canvas count:', mobCanvases);
  await pageMob.close();

  await browser.close();
}

main().catch(console.error);
