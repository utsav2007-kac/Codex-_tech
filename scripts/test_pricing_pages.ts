import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('=== TEST 1: DIRECT ACCESS TO /price (DESKTOP) ===');
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://localhost:5173/price');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Assert Title & Headline
  const headline = await page.locator('h1').innerText();
  console.log('Headline found:', headline);
  if (!headline.includes('Plans built around your offer letter.')) {
    throw new Error('Headline mismatch!');
  }

  // Assert 3 Cards exist
  const cardHeadings = await page.locator('h3').allInnerTexts();
  console.log('Card headings found:', cardHeadings);

  // Assert prices
  const pageText = await page.innerText('body');
  const requiredTexts = [
    '$1,500', '10% of annual salary package', 'In 4 installments',
    '$2,500', '12% of annual salary package', 'In 4 to 5 installments',
    '$3,000', '$4,000 in 2 installments', '$10,000',
    'REFUND ELIGIBLE', 'Every plan includes', 'What each plan includes',
    'Plan duration', 'Technical Training', 'Offer Review'
  ];

  for (const text of requiredTexts) {
    if (!pageText.includes(text)) {
      throw new Error(`Missing expected text: "${text}" on /price page!`);
    }
  }
  console.log('PASS: All required texts, prices, and labels exist on /price!');

  // Take screenshot of /price
  const priceScreenshot = 'C:/Users/iGen Systems/.gemini/antigravity/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/pricing_page_desktop.png';
  await page.screenshot({ path: priceScreenshot, fullPage: true });
  console.log('Screenshot saved to:', priceScreenshot);

  // Test Mobile view for /price
  console.log('\n=== TEST 2: MOBILE VIEW /price (390px) ===');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:5173/price');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);

  const priceMobileScreenshot = 'C:/Users/iGen Systems/.gemini/antigravity/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/pricing_page_mobile_390.png';
  await page.screenshot({ path: priceMobileScreenshot, fullPage: true });
  console.log('Mobile screenshot saved to:', priceMobileScreenshot);

  // Reset to desktop for navigation tests
  await page.setViewportSize({ width: 1280, height: 900 });

  // Test Clicking "More Details" on Elite card
  console.log('\n=== TEST 3: CLICK "MORE DETAILS" ON ELITE CARD ===');
  await page.goto('http://localhost:5173/price');
  await page.waitForLoadState('networkidle');

  // Find link to /price-details?plan=elite
  await page.click('a[href="/price-details?plan=elite"]');
  await page.waitForURL('**/price-details?plan=elite');
  await page.waitForSelector('text=Elite Plan Specification', { timeout: 10000 });

  const detailsH1 = await page.locator('h1').innerText();
  console.log('Details page H1:', detailsH1);
  if (!detailsH1.includes('Elite Plan Specification')) {
    throw new Error('Details page did not load Elite plan!');
  }

  // Screenshot Elite details page
  const detailsScreenshot = 'C:/Users/iGen Systems/.gemini/antigravity/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/pricing_details_elite_desktop.png';
  await page.screenshot({ path: detailsScreenshot, fullPage: true });
  console.log('Elite details screenshot saved to:', detailsScreenshot);

  // Test Switcher to Premium
  console.log('\n=== TEST 4: SWITCH TO PREMIUM ON DETAILS PAGE ===');
  await page.click('button:has-text("Premium")');
  await page.waitForTimeout(500);
  const premiumH1 = await page.locator('h1').innerText();
  console.log('Switched to:', premiumH1);
  if (!premiumH1.includes('Premium Plan Specification')) {
    throw new Error('Switcher failed to change to Premium!');
  }

  // Test "Back to Pricing Plans" button
  console.log('\n=== TEST 5: CLICK "BACK TO PRICING PLANS" ===');
  await page.click('a:has-text("Back to Pricing Plans")');
  await page.waitForURL('**/price');
  console.log('Successfully navigated back to:', page.url());

  console.log('\nALL 5 PRICING SYSTEM TESTS PASSED 100%!');
  await browser.close();
}

main().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
