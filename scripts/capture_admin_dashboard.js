const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.setViewportSize({ width: 1440, height: 900 });

  // 1. Go to /admin/login
  await page.goto('http://localhost:5173/admin/login');
  await page.waitForLoadState('networkidle');

  // Fill login
  await page.fill('input[type="email"]', 'admin@codex.com');
  await page.fill('input[type="password"]', 'admin@123');
  await page.click('button[type="submit"]');

  // Wait for navigation to /admin
  await page.waitForURL('**/admin');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000); // Wait for stats fetch

  const screenshotPath = 'C:/Users/iGen Systems/.gemini/antigravity/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/admin_dashboard_with_data.png';
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('Admin Dashboard screenshot saved to:', screenshotPath);

  // Check card text
  const bodyText = await page.innerText('body');
  console.log('Page has Consultation Leads 11:', bodyText.includes('11'));
  console.log('Page has Contact Messages 23:', bodyText.includes('23'));

  await browser.close();
}

main().catch(console.error);

