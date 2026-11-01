import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\iGen Systems\\.gemini\\antigravity\\brain\\24257650-6bb9-47cd-afe7-aec6be5496d1';

async function capture() {
  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
  });

  // 1. Desktop Contact Page
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktopPage.goto('http://localhost:5173/contact', { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1000);
  
  // Scroll down to contact form section
  const formSection = await desktopPage.$('#contact-form-section');
  if (formSection) {
    await formSection.scrollIntoViewIfNeeded();
  }
  await desktopPage.waitForTimeout(500);

  await desktopPage.screenshot({
    path: path.join(ARTIFACT_DIR, 'contact_form_desktop.png'),
    fullPage: false,
  });
  console.log('Saved contact_form_desktop.png');

  // Fill in form and submit to capture success state
  await desktopPage.fill('input[placeholder="Jane Smith"]', 'Alex Morgan');
  await desktopPage.fill('input[placeholder="jane@example.com"]', 'alex.morgan@enterprise.io');
  await desktopPage.fill('input[placeholder="+1 (555) 000-0000"]', '+1 (555) 234-5678');
  await desktopPage.fill('input[placeholder="e.g. Hiring Consultation / Career Placement"]', 'Staffing Engineering Pod (React / Node / Go)');
  await desktopPage.fill('textarea[placeholder*="Please describe"]', 'We are looking to scale our platform team with 2 senior full stack engineers within the next 3 weeks.');

  await desktopPage.click('button:has-text("Send Inquiry Message")');
  await desktopPage.waitForSelector('text=Message Received!', { timeout: 10000 });
  await desktopPage.waitForTimeout(500);

  await desktopPage.screenshot({
    path: path.join(ARTIFACT_DIR, 'contact_form_success.png'),
    fullPage: false,
  });
  console.log('Saved contact_form_success.png');
  await desktopPage.close();

  // 2. Mobile Contact Page
  const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await mobilePage.goto('http://localhost:5173/contact', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  const mobileForm = await mobilePage.$('#contact-form-section');
  if (mobileForm) {
    await mobileForm.scrollIntoViewIfNeeded();
  }
  await mobilePage.waitForTimeout(500);

  await mobilePage.screenshot({
    path: path.join(ARTIFACT_DIR, 'contact_form_mobile.png'),
    fullPage: false,
  });
  console.log('Saved contact_form_mobile.png');
  await mobilePage.close();

  // 3. Admin Settings Page
  const adminPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  // Login first
  await adminPage.goto('http://localhost:5173/admin/login', { waitUntil: 'networkidle' });
  await adminPage.fill('input[type="email"]', 'admin@codextechit.com');
  await adminPage.fill('input[type="password"]', 'CodexAdmin2026');
  await adminPage.click('button[type="submit"]');
  await adminPage.waitForURL('**/admin/**', { timeout: 10000 });
  await adminPage.waitForTimeout(1000);

  // Navigate to settings
  await adminPage.goto('http://localhost:5173/admin/settings', { waitUntil: 'networkidle' });
  await adminPage.waitForTimeout(1000);

  await adminPage.screenshot({
    path: path.join(ARTIFACT_DIR, 'admin_settings_email.png'),
    fullPage: false,
  });
  console.log('Saved admin_settings_email.png');
  await adminPage.close();

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
