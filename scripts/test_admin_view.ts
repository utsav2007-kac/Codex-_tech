import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173/login');
  await page.goto('http://localhost:5173/login');
  await page.waitForLoadState('networkidle');

  console.log('Filling login form');
  await page.fill('input[type="email"]', 'admin@codex.com');
  await page.fill('input[type="password"]', 'admin@123');
  await page.click('button[type="submit"]');

  console.log('Waiting for URL to change to /admin');
  await page.waitForURL('**/admin**', { timeout: 10000 });
  await page.waitForLoadState('networkidle');

  console.log('Current URL:', page.url());

  // Wait 3 seconds for stats fetch
  await page.waitForTimeout(3000);

  const screenshotPath = 'C:/Users/iGen Systems/.gemini/antigravity/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/local_admin_real_data.png';
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('Screenshot saved to:', screenshotPath);

  // Extract card numbers and headings
  const cards = await page.$$eval('.grid a', elements => elements.map(el => el.innerText.replace(/\n+/g, ' ')));
  console.log('Extracted Cards:\n', cards);

  const rows = await page.$$eval('tbody tr', elements => elements.map(el => el.innerText.replace(/\n+/g, ' | ')));
  console.log('Table Rows count:', rows.length);
  console.log('Top rows:\n', rows.slice(0, 4));

  await browser.close();
}

main().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
