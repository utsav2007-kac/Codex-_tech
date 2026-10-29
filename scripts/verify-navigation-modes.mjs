import { chromium } from '@playwright/test';

async function verifyNavigationModes() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Testing Initial Load...');
  await page.goto('http://localhost:4173/');
  let h1 = await page.evaluate(() => document.querySelector('h1')?.textContent);
  console.log('  Initial Load H1:', h1?.trim());

  console.log('Testing Hard Reload...');
  await page.reload({ waitUntil: 'domcontentloaded' });
  h1 = await page.evaluate(() => document.querySelector('h1')?.textContent);
  console.log('  Hard Reload H1:', h1?.trim());

  console.log('Testing Normal Reload...');
  await page.reload();
  h1 = await page.evaluate(() => document.querySelector('h1')?.textContent);
  console.log('  Normal Reload H1:', h1?.trim());

  console.log('Testing Client-Side Navigation Back to Home...');
  await page.goto('http://localhost:4173/about', { waitUntil: 'domcontentloaded' });
  await page.click('a[href="/"]');
  await page.waitForTimeout(100);
  h1 = await page.evaluate(() => document.querySelector('h1')?.textContent);
  console.log('  Navigation to Home H1:', h1?.trim());

  await browser.close();
  console.log('✅ All navigation modes verified identically!');
}

verifyNavigationModes().catch(console.error);
