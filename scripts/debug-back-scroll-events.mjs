import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.addInitScript(() => {
    window.addEventListener('scroll', () => {
      console.log(`[SCROLL EVENT] scrollY=${window.scrollY}, path=${window.location.pathname}`);
    }, { passive: true });
  });

  page.on('console', (msg) => console.log('BROWSER:', msg.text()));

  await page.goto('http://localhost:4173/', { waitUntil: 'load' });
  await page.waitForTimeout(600);

  console.log('--- Scrolling to 600px ---');
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(400);

  console.log('--- Clicking /about ---');
  await page.click('a[href="/about"]');
  await page.waitForTimeout(600);

  console.log('--- Going Back ---');
  await page.goBack();
  await page.waitForTimeout(1000);

  console.log('Final scrollY:', await page.evaluate(() => window.scrollY));

  await browser.close();
})();
