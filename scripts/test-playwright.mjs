import { chromium } from '@playwright/test';

async function test() {
  try {
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:5173/services/job-placement');
    const title = await page.title();
    console.log('Page Title with installed Chrome:', title);
    await browser.close();
  } catch (err) {
    console.error('Chrome launch error:', err);
  }
}
test();
