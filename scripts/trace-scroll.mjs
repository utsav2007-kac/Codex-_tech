import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on('console', (msg) => console.log('BROWSER:', msg.text()));

  await page.goto('http://localhost:4173/', { waitUntil: 'load' });
  await page.waitForTimeout(1200);

  console.log('1. Setting scroll to 600px...');
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(300);
  console.log('Current scrollY:', await page.evaluate(() => window.scrollY));

  console.log('2. Navigating to /about...');
  await page.click('a[href="/about"]');
  await page.waitForTimeout(1000);
  console.log('/about scrollY:', await page.evaluate(() => window.scrollY));

  console.log('3. Going Back...');
  await page.goBack();
  await page.waitForTimeout(1200);
  console.log('Home after Back scrollY:', await page.evaluate(() => window.scrollY));

  console.log('4. Scrolling to 600px and reloading...');
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(300);
  console.log('Before reload scrollY:', await page.evaluate(() => window.scrollY));
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(1200);
  console.log('After reload scrollY:', await page.evaluate(() => window.scrollY));

  await browser.close();
})();
