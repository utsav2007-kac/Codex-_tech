import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push({ text: msg.text(), location: msg.location() });
    }
  });
  page.on('pageerror', err => {
    errors.push({ message: err.message, stack: err.stack });
  });

  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('Errors caught:', JSON.stringify(errors, null, 2));
  await browser.close();
})();
