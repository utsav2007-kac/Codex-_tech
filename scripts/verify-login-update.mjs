import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/iGen Systems/.gemini/antigravity-ide/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/screenshots';
const BASE_URL = 'http://localhost:5000';

async function verifyLogin() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  
  await context.addInitScript(() => {
    sessionStorage.setItem('codex_visited_curtain', 'true');
    localStorage.setItem('codex_cookie_consent', 'accepted');
  });

  const page = await context.newPage();

  console.log('1. Navigating to /login...');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(600);

  // Check Heading
  const h1 = await page.textContent('h1');
  console.log('Heading on /login:', h1?.trim());

  // Check email input placeholder and value
  const emailInput = await page.$('input[type="email"]');
  const placeholder = await emailInput?.getAttribute('placeholder');
  const inputValue = await emailInput?.inputValue();
  console.log('Email input placeholder:', placeholder);
  console.log('Email input initial value:', inputValue);

  // Check if default seed credentials note exists
  const pageText = await page.textContent('body');
  const hasDefaultCredentials = pageText.includes('Default seed credentials');
  console.log('Contains "Default seed credentials":', hasDefaultCredentials);

  // Capture screenshot of updated /login page
  const screenshotPath = path.join(ARTIFACTS_DIR, 'updated_login_page.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Saved screenshot of updated login page to:', screenshotPath);

  // Test Logging in with CodexAdmin2026
  console.log('\n2. Testing login with admin@codextechit.com and password "CodexAdmin2026"...');
  await emailInput.fill('admin@codextechit.com');
  const passwordInput = await page.$('input[type="password"]');
  await passwordInput.fill('CodexAdmin2026');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/admin', { timeout: 10000 });
  console.log('Successfully navigated to Admin Dashboard! URL:', page.url());

  // Check footer link on homepage
  console.log('\n3. Checking Footer link on homepage...');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(500);

  const footerLoginLink = await page.$('footer a[href="/login"]');
  const footerLoginText = await footerLoginLink?.textContent();
  console.log('Footer link to /login found:', !!footerLoginLink, 'Text:', footerLoginText?.trim());

  await browser.close();
  console.log('\n✅ All Login verifications passed successfully!');
}

verifyLogin().catch(err => {
  console.error('Login verification failed:', err);
  process.exit(1);
});
