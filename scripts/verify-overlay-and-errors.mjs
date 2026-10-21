import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl'] });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  const errors = [];
  const warnings = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
    if (msg.type() === 'warning') warnings.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const overlayExists = await page.evaluate(() => {
    return !!document.querySelector('vite-error-overlay');
  });

  console.log('--- ROOT PAGE AUDIT ---');
  console.log('Vite Error Overlay DOM Element Present:', overlayExists);
  console.log('Console Errors:', errors);
  console.log('Console Warnings:', warnings);

  // Check subpages
  const routesToTest = ['/about', '/services', '/careers', '/plans', '/contact'];
  for (const r of routesToTest) {
    const routeErrors = [];
    page.on('console', msg => { if (msg.type() === 'error') routeErrors.push(msg.text()); });
    await page.goto('http://localhost:5173' + r, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const subOverlay = await page.evaluate(() => !!document.querySelector('vite-error-overlay'));
    console.log(`Route ${r}: overlay=${subOverlay}, errors=${routeErrors.length}`);
  }

  await browser.close();
}

main().catch(console.error);
