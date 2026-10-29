import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:4173/', { waitUntil: 'load' });
  await page.waitForTimeout(500);

  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(300);

  const homeStoredBeforeNav = await page.evaluate(() => sessionStorage.getItem('scroll_pos_/'));
  console.log('Stored for "/" before clicking /about:', homeStoredBeforeNav);

  await page.click('a[href="/about"]');
  await page.waitForTimeout(500);

  const homeStoredAfterNav = await page.evaluate(() => sessionStorage.getItem('scroll_pos_/'));
  console.log('Stored for "/" after navigating to /about:', homeStoredAfterNav);

  await page.goBack();
  await page.waitForTimeout(500);

  const homeScrollAfter = await page.evaluate(() => window.scrollY);
  console.log('Home scroll after back:', homeScrollAfter);

  await browser.close();
})();
