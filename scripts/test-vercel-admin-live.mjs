import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\iGen Systems\\.gemini\\antigravity\\brain\\24257650-6bb9-47cd-afe7-aec6be5496d1';

async function run() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to live Vercel admin login: https://codex-tech-4aic.vercel.app/login ...');
  await page.goto('https://codex-tech-4aic.vercel.app/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  console.log('Filling admin credentials...');
  await page.fill('input[type="email"]', 'admin@codex.com');
  await page.fill('input[type="password"]', 'admin@123');

  console.log('Clicking Sign In to Dashboard button...');
  await page.click('button:has-text("Sign In to Dashboard")');

  console.log('Waiting for redirection to /admin dashboard...');
  await page.waitForURL('**/admin**', { timeout: 25000 });
  await page.waitForTimeout(2000);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'vercel_live_admin_dashboard.png'),
    fullPage: false,
  });

  console.log('🎉 LIVE VERCEL ADMIN LOGIN & DASHBOARD VERIFIED WITH SCREENSHOT!');
  await browser.close();
}

run().catch((err) => {
  console.error('Admin test failed:', err);
  process.exit(1);
});

