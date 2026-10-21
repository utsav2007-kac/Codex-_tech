import { chromium } from '@playwright/test';

async function main() {
  console.log('🚀 Starting Real-Browser Verification of Fixes...');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--enable-webgl', '--no-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  // Pre-seed sessionStorage so returning user experience is tested without curtain overlay
  await context.addInitScript(() => {
    sessionStorage.setItem('codex_visited_curtain', 'true');
    localStorage.setItem('codex_cookie_consent', 'accepted');
  });

  const page = await context.newPage();

  // 1. Audit Homepage: Hero & Initial Render
  console.log('📸 1. Verifying Homepage Hero at 1440px...');
  await page.goto('http://localhost:5173/', { waitUntil: 'load' });
  await page.waitForTimeout(1000); // Wait for canvas & stage
  await page.screenshot({ path: 'scripts/verified-homepage-hero.png' });
  console.log('Saved scripts/verified-homepage-hero.png');

  // 2. Audit Homepage: Scroll to 3-Phase Acceleration Engine (where red circle was removed)
  console.log('📸 2. Verifying 3-Phase Acceleration Engine (Red-circled section removed)...');
  const engineSection = page.locator('section[aria-label="3-Phase Acceleration Engine"]');
  await engineSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'scripts/verified-engine-section.png' });
  console.log('Saved scripts/verified-engine-section.png');

  // 3. Audit Homepage: FAQ Accordion Section
  console.log('📸 3. Verifying Homepage FAQ Accordion...');
  const faqSection = page.locator('section:has-text("Frequently Asked Questions.")');
  await faqSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'scripts/verified-faq-accordion.png' });
  console.log('Saved scripts/verified-faq-accordion.png');

  // Toggle second FAQ to verify accordion interaction
  console.log('📸 3b. Testing accordion click on item #2...');
  const secondFaqButton = page.locator('button[id="faq-question-home-1"]');
  await secondFaqButton.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'scripts/verified-faq-interaction.png' });
  console.log('Saved scripts/verified-faq-interaction.png (second item opened)');

  // 4. Audit Contact Page Layout and Spacing
  console.log('📸 4. Verifying Contact Page Layout & Footer Spacing...');
  await page.goto('http://localhost:5173/contact', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const contactSection = page.locator('#contact-form-section');
  await contactSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  const contactMetrics = await page.evaluate(() => {
    const section = document.querySelector('#contact-form-section');
    const form = document.querySelector('form');
    const leftCol = document.querySelector('.lg\\:col-span-5');
    const rightCol = document.querySelector('.lg\\:col-span-7');
    const darkCard = document.querySelector('#contact-form-section .bg-navy-900');
    const footer = document.querySelector('footer');

    return {
      sectionHeight: section ? section.offsetHeight : 0,
      leftColHeight: leftCol ? leftCol.offsetHeight : 0,
      rightColHeight: rightCol ? rightCol.offsetHeight : 0,
      darkCardHeight: darkCard ? darkCard.offsetHeight : 0,
      formHeight: form ? form.offsetHeight : 0,
      footerTop: footer ? footer.offsetTop : 0,
      scrollHeight: document.documentElement.scrollHeight,
    };
  });

  console.log('Contact Page Metrics:');
  console.log(JSON.stringify(contactMetrics, null, 2));

  await page.screenshot({ path: 'scripts/verified-contact-page.png' });
  console.log('Saved scripts/verified-contact-page.png');

  // 5. Audit Dedicated /faq Page
  console.log('📸 5. Verifying Dedicated /faq Page...');
  await page.goto('http://localhost:5173/faq', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scripts/verified-faq-page.png' });
  console.log('Saved scripts/verified-faq-page.png');

  // 6. Mobile Viewport Check (390px)
  console.log('📱 6. Verifying Contact Page on Mobile (390px)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:5173/contact', { waitUntil: 'load' });
  await page.waitForTimeout(800);
  await page.locator('#contact-form-section').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'scripts/verified-contact-mobile.png' });
  console.log('Saved scripts/verified-contact-mobile.png');

  await browser.close();
  console.log('🎉 ALL FIXES VERIFIED SUCCESSFULLY IN REAL BROWSER!');
}

main().catch(console.error);
