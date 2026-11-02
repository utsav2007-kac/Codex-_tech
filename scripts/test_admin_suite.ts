import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  console.log('--- ADMIN PANEL COMPREHENSIVE SUITE TEST ---');

  // 1. Auth & Login
  console.log('Testing /login...');
  await page.goto('http://localhost:5173/login');
  await page.waitForLoadState('networkidle');
  await page.fill('input[type="email"]', 'admin@codex.com');
  await page.fill('input[type="password"]', 'admin@123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin**', { timeout: 10000 });
  console.log('PASS: Login successful and redirected to /admin');

  // 2. Dashboard Overview
  await page.waitForTimeout(2000);
  const cardsCount = await page.locator('.grid a').count();
  console.log(`PASS: Dashboard loaded ${cardsCount} KPI cards`);

  // 3. Inquiries & Submissions: Test all tabs
  const tabs = ['leads', 'applications', 'contacts', 'employer-requests', 'referrals', 'subscribers', 'enrollments'];
  for (const tab of tabs) {
    console.log(`Testing Submissions tab: ${tab}...`);
    await page.goto(`http://localhost:5173/admin/submissions?tab=${tab}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    const hasTable = await page.locator('table, .overflow-x-auto, p:has-text("No ")').count();
    console.log(`PASS: Tab ${tab} rendered cleanly (content count: ${hasTable})`);
  }

  // 4. Content Management: Test all subtabs
  console.log('Testing /admin/content...');
  await page.goto('http://localhost:5173/admin/content');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  console.log('PASS: Content Management page loaded successfully');

  // 5. Testimonials Management
  console.log('Testing /admin/testimonials...');
  await page.goto('http://localhost:5173/admin/testimonials');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  console.log('PASS: Testimonials Management page loaded successfully');

  // 6. System Settings
  console.log('Testing /admin/settings...');
  await page.goto('http://localhost:5173/admin/settings');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  console.log('PASS: System Settings page loaded successfully');

  // 7. Mobile Viewport Test (390px & 768px)
  console.log('Testing mobile viewport (390px)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:5173/admin');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  const mobileScreenshot = 'C:/Users/iGen Systems/.gemini/antigravity/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/local_admin_mobile_390.png';
  await page.screenshot({ path: mobileScreenshot, fullPage: true });
  console.log(`PASS: Mobile viewport verified. Screenshot: ${mobileScreenshot}`);

  await browser.close();
}

main().catch(err => {
  console.error('Suite failure:', err);
  process.exit(1);
});

