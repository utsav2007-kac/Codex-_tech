import { chromium } from '@playwright/test';

async function testAdmin() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  page.on('response', res => {
    if (res.url().includes('/api/admin/login')) {
      console.log('API Login Response:', res.status());
      res.text().then(t => console.log('API Login Body:', t)).catch(() => {});
    }
  });

  await page.goto('http://localhost:5000/admin/login', { waitUntil: 'networkidle' });
  await page.waitForSelector('form input[type="email"]');
  await page.waitForTimeout(500);

  await page.fill('form input[type="email"]', 'admin@codextechit.com');
  await page.fill('form input[type="password"]', 'CodexAdmin2026');
  await page.click('form button[type="submit"]');

  await page.waitForURL('**/admin', { timeout: 10000 });
  console.log('Successfully navigated to Admin Dashboard! URL:', page.url());

  // Navigate to Content / Blog Manager
  await page.goto('http://localhost:5000/admin/content', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  console.log('Admin Content Page URL:', page.url());

  const h1Text = await page.textContent('h1');
  console.log('Admin Content H1:', h1Text);

  const newBtn = await page.$('button:has-text("New Article")');
  console.log('New Article button found:', !!newBtn);

  if (newBtn) {
    await newBtn.click();
    await page.waitForTimeout(800);
    const titleInput = await page.$('input[placeholder*="title" i], input[placeholder*="Title" i]');
    console.log('Editor title input found:', !!titleInput);
  }

  await browser.close();
}

testAdmin().catch(console.error);
