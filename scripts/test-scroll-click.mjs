import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:4173/', { waitUntil: 'load' });
  await page.waitForTimeout(600);

  console.log('1. Scrolling Home to 600px...');
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(400);
  console.log('Home initial scrollY:', await page.evaluate(() => window.scrollY));

  console.log('2. Navigating to /about via router navigate...');
  await page.evaluate(() => {
    // Click without Playwright auto-scrolling
    const link = document.querySelector('a[href="/about"]');
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  });
  await page.waitForTimeout(600);
  console.log('/about scrollY:', await page.evaluate(() => window.scrollY));

  console.log('3. Pressing Back...');
  await page.goBack();
  await page.waitForTimeout(600);
  console.log('Home scroll after Back navigation:', await page.evaluate(() => window.scrollY));

  console.log('4. Scrolling to 600px and reloading...');
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(300);
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(600);
  console.log('Home scroll after reload at 600px:', await page.evaluate(() => window.scrollY));

  await browser.close();
})();
