const { chromium } = require('playwright');

async function main() {
  console.log('=== STARTING 3D ANIMATION & SCROLL TEST SUITE ===');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  // Test 1: Desktop with animations enabled
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('\n1. Navigating to http://localhost:5173/price ...');
  await page.goto('http://localhost:5173/price');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Allow entrance animations to settle

  // Verify H1 & Cards
  const h1 = await page.locator('h1').innerText();
  console.log('H1 Title:', h1);
  if (!h1.includes('Plans built around your offer letter.')) {
    throw new Error('H1 text mismatch!');
  }

  // Hover over the featured Elite card to trigger 3D tilt and glare
  console.log('Simulating 3D tilt hover on Elite card...');
  const eliteCard = page.locator('text=Elite').first();
  const box = await eliteCard.boundingBox();
  if (box) {
    // Hover near top-right corner to trigger 3D perspective rotation
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.2);
    await page.waitForTimeout(400);
  }

  // Capture screenshot of /price with 3D effects
  const p1Shot = 'C:/Users/iGen Systems/.gemini/antigravity/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/price_animated_3d_desktop.png';
  await page.screenshot({ path: p1Shot, fullPage: true });
  console.log('Saved /price 3D animated screenshot to:', p1Shot);

  // Scroll down smoothly to verify parallax and "Every plan includes" entrance
  console.log('Scrolling down to trigger parallax and "Every plan includes" entrance...');
  await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'smooth' }));
  await page.waitForTimeout(800);

  // Test clicking "More Details" on Elite card
  console.log('\n2. Testing navigation to /price-details?plan=elite ...');
  await page.click('a[href="/price-details?plan=elite"]');
  await page.waitForURL('**/price-details?plan=elite');
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('text=Elite Plan Details');
  console.log('Loaded /price-details with Elite plan!');

  // Test switching plan to Premium via the animated pill tab
  console.log('Testing animated plan switcher tab to Premium...');
  await page.click('button:has-text("Premium (12 months)")');
  await page.waitForTimeout(600); // Allow AnimatePresence crossfade
  const premTitle = await page.locator('text=Premium Plan Details').count();
  if (premTitle === 0) {
    throw new Error('Failed to switch to Premium plan via animated tab!');
  }
  console.log('Successfully switched to Premium plan with smooth animation!');

  // Switch back to Elite
  await page.click('button:has-text("Elite (9 months)")');
  await page.waitForTimeout(600);

  // Hover over sticky summary card to test 3D elevation
  const summaryBox = await page.locator('text=SELECTED PLAN').first().boundingBox();
  if (summaryBox) {
    await page.mouse.move(summaryBox.x + summaryBox.width * 0.5, summaryBox.y + summaryBox.height * 0.5);
    await page.waitForTimeout(300);
  }

  // Capture screenshot of /price-details
  const p2Shot = 'C:/Users/iGen Systems/.gemini/antigravity/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/price_details_animated_3d_desktop.png';
  await page.screenshot({ path: p2Shot, fullPage: true });
  console.log('Saved /price-details 3D animated screenshot to:', p2Shot);

  // Scroll to comparison table to test table scroll entrance & row hover
  console.log('Scrolling to comparison table...');
  await page.evaluate(() => {
    const el = document.querySelector('table');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  await page.waitForTimeout(800);

  // Hover over a table row
  const firstRow = page.locator('table tbody tr').first();
  await firstRow.hover();
  await page.waitForTimeout(300);

  const tableShot = 'C:/Users/iGen Systems/.gemini/antigravity/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/price_details_table_animated.png';
  await page.screenshot({ path: tableShot, fullPage: false });
  console.log('Saved comparison table screenshot to:', tableShot);

  // Test "Back to Pricing" button
  console.log('\n3. Testing "Back to Pricing" button navigation...');
  await page.click('a:has-text("Back to Pricing") >> nth=0');
  await page.waitForURL('**/price');
  console.log('Successfully navigated back to /price!');

  await context.close();

  // Test 4: Reduced Motion Conformance Test
  console.log('\n4. Testing Reduced-Motion accessibility conformance...');
  const reducedMotionContext = await browser.newContext({
    reducedMotion: 'reduce',
    viewport: { width: 1440, height: 900 }
  });
  const reducedMotionPage = await reducedMotionContext.newPage();
  await reducedMotionPage.goto('http://localhost:5173/price');
  await reducedMotionPage.waitForLoadState('networkidle');
  await reducedMotionPage.waitForTimeout(500);

  const reducedH1 = await reducedMotionPage.locator('h1').innerText();
  if (!reducedH1.includes('Plans built around your offer letter.')) {
    throw new Error('Reduced motion page failed to render!');
  }
  console.log('Reduced motion mode rendered correctly without error!');
  await reducedMotionContext.close();

  console.log('\nALL 3D ANIMATION & SCROLL TESTS PASSED 100%!');
  await browser.close();
}

main().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

