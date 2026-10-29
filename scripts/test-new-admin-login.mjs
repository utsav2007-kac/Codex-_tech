import { chromium } from '@playwright/test';

const BASE_URL = 'http://localhost:5000';

async function testNewAdminLogin() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  
  await context.addInitScript(() => {
    sessionStorage.setItem('codex_visited_curtain', 'true');
    localStorage.setItem('codex_cookie_consent', 'accepted');
  });

  const page = await context.newPage();

  console.log('1. Navigating to /login...');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(500);

  console.log('2. Filling credentials: admin@codex.com / admin@123 ...');
  await page.fill('input[type="email"]', 'admin@codex.com');
  await page.fill('input[type="password"]', 'admin@123');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/admin', { timeout: 10000 });
  console.log('Successfully redirected to Admin Dashboard! URL:', page.url());

  const heading = await page.textContent('h1');
  console.log('Admin Dashboard Heading:', heading?.trim());

  await browser.close();
  console.log('✅ admin@codex.com / admin@123 login verification succeeded!');
}

testNewAdminLogin().catch(err => {
  console.error('Login test failed:', err);
  process.exit(1);
});
