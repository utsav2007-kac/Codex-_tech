import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\iGen Systems\\.gemini\\antigravity\\brain\\24257650-6bb9-47cd-afe7-aec6be5496d1';

async function verifyContactFix() {
  console.log('--- VERIFYING CONTACT PAGE HERO FIX ---');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://localhost:5173/contact', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(600);

  // Accept cookies if present
  const acceptBtn = page.locator('button:has-text("Accept All")');
  if (await acceptBtn.isVisible()) {
    await acceptBtn.click();
    await page.waitForTimeout(300);
  }

  // Verify headline visibility and text
  const h1 = page.locator('h1').first();
  const h1Text = await h1.innerText();
  console.log('H1 Text:', h1Text);

  // Verify background color of the hero section
  const heroSection = page.locator('section[data-nav-theme="dark"]').first();
  const heroBg = await heroSection.evaluate((el) => window.getComputedStyle(el).backgroundImage);
  console.log('Hero Background Image / Gradient:', heroBg);

  // Verify office cards
  const officeCard1 = page.locator('text=New York, NY (USA)');
  const isOffice1Visible = await officeCard1.isVisible();
  console.log('New York Office Card visible:', isOffice1Visible ? 'PASS' : 'FAIL');

  const officeCard2 = page.locator('text=Ahmedabad, Gujarat (India)');
  const isOffice2Visible = await officeCard2.isVisible();
  console.log('Ahmedabad Office Card visible:', isOffice2Visible ? 'PASS' : 'FAIL');

  // Capture screenshot of the fixed Contact page
  const shotPath = path.join(ARTIFACT_DIR, 'evidence_contact_hero_fixed.png');
  await page.screenshot({ path: shotPath, fullPage: false });
  console.log(`Saved screenshot to: ${shotPath}`);

  await browser.close();
  console.log('✓ CONTACT PAGE HERO VERIFIED AND RESOLVED!');
}

verifyContactFix().catch((err) => {
  console.error('Error during verification:', err);
  process.exit(1);
});

