import { chromium } from '@playwright/test';

async function testAdmin() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  // Login via API and set token
  const res = await page.request.post('http://127.0.0.1:5000/api/admin/login', {
    data: { email: 'admin@codextechit.com', password: 'CodexAdmin2026' }
  });
  const data = await res.json();
  const token = data.data?.token;
  const user = data.data?.user;

  await page.goto('http://localhost:5000/admin/login', { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ token, user }) => {
    localStorage.setItem('codex_admin_token', token);
    localStorage.setItem('codex_admin_user', JSON.stringify(user));
  }, { token, user });

  await page.goto('http://localhost:5000/admin/content', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const url = page.url();
  console.log('Final URL:', url);

  const headings = await page.$$eval('h1, h2, h3', els => els.map(e => ({ tag: e.tagName, text: e.textContent?.trim() })));
  console.log('Headings:', headings);

  const buttons = await page.$$eval('button', els => els.map(e => e.textContent?.trim()));
  console.log('Buttons:', buttons);

  await browser.close();
}

testAdmin().catch(console.error);
