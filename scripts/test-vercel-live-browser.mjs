import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\iGen Systems\\.gemini\\antigravity\\brain\\24257650-6bb9-47cd-afe7-aec6be5496d1';

async function testLiveSite() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to live Vercel site: https://codex-tech-4aic.vercel.app/contact ...');
  await page.goto('https://codex-tech-4aic.vercel.app/contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const formSection = await page.$('#contact-form-section');
  if (formSection) {
    await formSection.scrollIntoViewIfNeeded();
  }

  console.log('Filling form fields on live Vercel site...');
  await page.fill('input[placeholder="Jane Smith"]', 'Utsav Live Vercel User');
  await page.fill('input[placeholder="jane@example.com"]', 'utsav.vercel@gmail.com');
  await page.fill('input[placeholder="+1 (555) 000-0000"]', '+91 98765 43210');
  await page.fill('input[placeholder="e.g. Hiring Consultation / Career Placement"]', 'Production Vercel Form Verification');
  await page.fill('textarea[placeholder*="Please describe"]', 'Hello Utsav, this message was submitted directly through the LIVE Vercel website https://codex-tech-4aic.vercel.app/contact! All systems are 100% working.');

  console.log('Clicking Submit button on live Vercel...');
  await page.click('button:has-text("Send Inquiry Message")');

  console.log('Waiting for success confirmation on live Vercel...');
  await page.waitForSelector('text=Message Received!', { timeout: 25000 });
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'vercel_live_contact_success.png'),
    fullPage: false,
  });

  console.log('🎉 LIVE VERCEL SUBMISSION VERIFIED WITH SCREENSHOT!');
  await browser.close();
}

testLiveSite().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});

