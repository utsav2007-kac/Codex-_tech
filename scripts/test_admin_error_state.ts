import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Intercept /api/admin/stats to simulate an API failure
  await page.route('**/api/admin/stats', route => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Internal Database Connection Timeout' }
      })
    });
  });

  console.log('Navigating to http://localhost:5173/login');
  await page.goto('http://localhost:5173/login');
  await page.waitForLoadState('networkidle');

  await page.fill('input[type="email"]', 'admin@codex.com');
  await page.fill('input[type="password"]', 'admin@123');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/admin**', { timeout: 10000 });
  await page.waitForTimeout(2000);

  const screenshotPath = 'C:/Users/iGen Systems/.gemini/antigravity/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/local_admin_error_state.png';
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('Screenshot of error state saved to:', screenshotPath);

  // Assert error banner is visible
  const errorText = await page.locator('.bg-rose-50').innerText();
  console.log('Error banner text:\n', errorText);

  // Assert NO cards are displayed (zeros prevented!)
  const cardCount = await page.locator('.grid a').count();
  console.log('Cards displayed during error:', cardCount);
  if (cardCount === 0) {
    console.log('SUCCESS: No zero cards were displayed during API failure!');
  } else {
    console.error('FAILURE: Zero cards were displayed during error!');
    process.exit(1);
  }

  await browser.close();
}

main().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});

