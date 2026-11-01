import { chromium } from 'playwright';

async function testNav() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/admin/login');
  await page.fill('input[type="email"]', 'admin@codextechit.com');
  await page.fill('input[type="password"]', 'CodexAdmin2026');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  console.log('After login URL:', page.url());

  // Check localStorage
  const user = await page.evaluate(() => localStorage.getItem('codex_admin_user'));
  console.log('localStorage user:', user ? 'exists' : 'null');

  await page.goto('http://localhost:5173/admin/testimonials');
  await page.waitForTimeout(2000);
  console.log('Testimonials URL:', page.url());

  const buttons = await page.$$eval('button', (btns) => btns.map((b) => b.innerText.trim()).filter(Boolean));
  console.log('Buttons found:', buttons);

  const textContent = await page.evaluate(() => document.body.innerText.slice(0, 300));
  console.log('Page text preview:\n', textContent);

  await page.getByRole('button', { name: /Add Testimonial/i }).click();
  await page.waitForTimeout(1000);
  const modalHeader = await page.textContent('h3');
  console.log('Modal header after clicking:', modalHeader);

  await browser.close();
}

testNav().catch(console.error);
