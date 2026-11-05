import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('=== TEST 1: VERIFY /price (PAGE ONE ONLY) ===');
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://localhost:5173/price');
  await page.waitForLoadState('networkidle');

  // Verify Headline
  const h1Text = await page.locator('h1').innerText();
  console.log('Page 1 H1:', h1Text);
  if (!h1Text.includes('Plans built around your offer letter.')) {
    throw new Error('Headline mismatch on /price!');
  }

  // Verify 3 Cards
  const cards = await page.locator('h3').allInnerTexts();
  console.log('Cards found on /price:', cards);
  if (!cards.includes('Basic') || !cards.includes('Elite') || !cards.includes('Premium')) {
    throw new Error('Cards missing on /price!');
  }

  // Verify "Every plan includes" box
  const everyPlanText = await page.locator('text=Every plan includes').count();
  if (everyPlanText === 0) {
    throw new Error('"Every plan includes" box is missing on /price!');
  }

  // VERIFY STRICT SEPARATION: Comparison table MUST NOT exist on /price
  const comparisonTableHeading = await page.locator('text=What each plan includes').count();
  console.log('Comparison table heading count on /price (MUST BE 0):', comparisonTableHeading);
  if (comparisonTableHeading !== 0) {
    throw new Error('Comparison table should NOT be on /price! It must be strictly on /price-details!');
  }

  // Capture Screenshot of /price desktop
  const page1Desktop = 'C:/Users/iGen Systems/.gemini/antigravity/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/page1_price_homepage_theme_desktop.png';
  await page.screenshot({ path: page1Desktop, fullPage: true });
  console.log('Page 1 Desktop Screenshot saved:', page1Desktop);

  // Mobile screenshot of /price
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:5173/price');
  await page.waitForLoadState('networkidle');
  const page1Mobile = 'C:/Users/iGen Systems/.gemini/antigravity/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/page1_price_homepage_theme_mobile.png';
  await page.screenshot({ path: page1Mobile, fullPage: true });
  console.log('Page 1 Mobile Screenshot saved:', page1Mobile);

  await page.setViewportSize({ width: 1280, height: 900 });

  // === TEST 2: VERIFY BASIC "MORE DETAILS" BUTTON ===
  console.log('\n=== TEST 2: CLICK BASIC "MORE DETAILS" ===');
  await page.goto('http://localhost:5173/price');
  await page.waitForLoadState('networkidle');
  await page.click('a[href="/price-details?plan=basic"]');
  await page.waitForURL('**/price-details?plan=basic');
  await page.waitForSelector('text=Basic Plan Details');
  const basicH1 = await page.locator('h1').innerText();
  console.log('Basic Plan Details H1:', basicH1);
  if (!basicH1.includes('Basic Plan Details')) {
    throw new Error('Did not load Basic Plan Details!');
  }

  // Verify Basic details content
  const basicBody = await page.innerText('body');
  if (!basicBody.includes('$1,500') || !basicBody.includes('6 months')) {
    throw new Error('Basic pricing values missing!');
  }
  const basicScreenshot = 'C:/Users/iGen Systems/.gemini/antigravity/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/page2_details_basic_desktop.png';
  await page.screenshot({ path: basicScreenshot, fullPage: true });
  console.log('Basic details screenshot saved:', basicScreenshot);

  // === TEST 3: CLICK ELITE "MORE DETAILS" ===
  console.log('\n=== TEST 3: CLICK ELITE "MORE DETAILS" ===');
  await page.goto('http://localhost:5173/price');
  await page.waitForLoadState('networkidle');
  await page.click('a[href="/price-details?plan=elite"]');
  await page.waitForURL('**/price-details?plan=elite');
  await page.waitForSelector('text=Elite Plan Details');
  const eliteH1 = await page.locator('h1').innerText();
  console.log('Elite Plan Details H1:', eliteH1);
  if (!eliteH1.includes('Elite Plan Details')) {
    throw new Error('Did not load Elite Plan Details!');
  }
  const eliteBody = await page.innerText('body');
  if (!eliteBody.includes('$2,500') || !eliteBody.includes('9 months') || !eliteBody.includes('Refund Eligible')) {
    throw new Error('Elite pricing values missing!');
  }
  const eliteScreenshot = 'C:/Users/iGen Systems/.gemini/antigravity/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/page2_details_elite_desktop.png';
  await page.screenshot({ path: eliteScreenshot, fullPage: true });
  console.log('Elite details screenshot saved:', eliteScreenshot);

  // === TEST 4: CLICK PREMIUM "MORE DETAILS" ===
  console.log('\n=== TEST 4: CLICK PREMIUM "MORE DETAILS" ===');
  await page.goto('http://localhost:5173/price');
  await page.waitForLoadState('networkidle');
  await page.click('a[href="/price-details?plan=premium"]');
  await page.waitForURL('**/price-details?plan=premium');
  await page.waitForSelector('text=Premium Plan Details');
  const premiumH1 = await page.locator('h1').innerText();
  console.log('Premium Plan Details H1:', premiumH1);
  if (!premiumH1.includes('Premium Plan Details')) {
    throw new Error('Did not load Premium Plan Details!');
  }
  const premiumBody = await page.innerText('body');
  if (!premiumBody.includes('$3,000') || !premiumBody.includes('$10,000') || !premiumBody.includes('12 months')) {
    throw new Error('Premium pricing values missing!');
  }
  const premiumScreenshot = 'C:/Users/iGen Systems/.gemini/antigravity/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/page2_details_premium_desktop.png';
  await page.screenshot({ path: premiumScreenshot, fullPage: true });
  console.log('Premium details screenshot saved:', premiumScreenshot);

  // === TEST 5: VERIFY COMPARISON TABLE EXISTS ON /price-details ===
  console.log('\n=== TEST 5: VERIFY COMPARISON TABLE ON /price-details ===');
  const detailsComparisonTableCount = await page.locator('text=What each plan includes').count();
  console.log('Comparison table count on /price-details (MUST BE >= 1):', detailsComparisonTableCount);
  if (detailsComparisonTableCount === 0) {
    throw new Error('Comparison table missing on /price-details!');
  }

  // === TEST 6: CLICK "BACK TO PRICING" ===
  console.log('\n=== TEST 6: CLICK "BACK TO PRICING" ===');
  await page.click('a:has-text("Back to Pricing")');
  await page.waitForURL('**/price');
  console.log('Successfully returned to:', page.url());

  console.log('\nALL TWO-PAGE PRICING SYSTEM TESTS PASSED 100%!');
  await browser.close();
}

main().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

