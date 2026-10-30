import { chromium } from 'playwright';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/iGen Systems/.gemini/antigravity/brain/24257650-6bb9-47cd-afe7-aec6be5496d1';

async function run() {
  console.log('Starting Playwright browser verification...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173/...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // 1. Verify Dual3DScrollShowcase (Image 1 fix)
  console.log('1. Verifying Dual3DScrollShowcase...');
  const motionGrid = page.locator('#enterprise-showcase');
  await motionGrid.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const gridText = await motionGrid.innerText();
  const hasOldDebugBadge = gridText.includes('BIDIRECTIONAL 3D MOTION GRID');
  const hasOldSubtitle = gridText.includes('Streams react in real time');
  const hasStream01 = gridText.includes('STREAM 01');
  const hasStream02 = gridText.includes('STREAM 02');

  console.log('Dual3DScrollShowcase checks:');
  console.log(' - Debug badge removed:', !hasOldDebugBadge ? 'PASS' : 'FAIL');
  console.log(' - Subtitle removed:', !hasOldSubtitle ? 'PASS' : 'FAIL');
  console.log(' - Stream labels removed:', !hasStream01 && !hasStream02 ? 'PASS' : 'FAIL');

  await motionGrid.screenshot({
    path: path.join(ARTIFACTS_DIR, 'evidence_image1_dual_stream_fixed.png'),
  });

  // 2. Verify WorkforceTalentEcosystem (Image 2 & 3 fix)
  console.log('2. Verifying WorkforceTalentEcosystem (Wandata architecture)...');
  const ecosystem = page.locator('#workforce-talent-ecosystem');
  await ecosystem.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  const ecoText = await ecosystem.innerText();
  console.log('WorkforceTalentEcosystem checks:');
  console.log(' - "Who Codex Tech-IT Is Built For" present:', ecoText.includes('Who Codex Tech-IT') ? 'PASS' : 'FAIL');
  console.log(' - 4 Cards present (Students, Experienced, Switchers, International):',
    ecoText.includes('Students & Fresh Graduates') &&
    ecoText.includes('Experienced Professionals') &&
    ecoText.includes('Career Switchers') &&
    ecoText.includes('International Talent') ? 'PASS' : 'FAIL'
  );
  console.log(' - Dark Split Ribbon present:', ecoText.includes('Looking for your next US opportunity?') ? 'PASS' : 'FAIL');
  console.log(' - Career Readiness Diagnostic present (84 score):', ecoText.includes('84') ? 'PASS' : 'FAIL');
  console.log(' - From talent to opportunity pipeline present:', (ecoText.includes('From talent') && ecoText.includes('to opportunity')) ? 'PASS' : 'FAIL');

  await ecosystem.screenshot({
    path: path.join(ARTIFACTS_DIR, 'evidence_image3_workforce_ecosystem.png'),
  });

  // 3. Verify GlobalHubShowcase in Footer (Image 4 fix)
  console.log('3. Verifying GlobalHubShowcase in Footer...');
  const footerHubs = page.locator('#global-hub-showcase');
  await footerHubs.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  const hubsText = await footerHubs.innerText();
  console.log('GlobalHubShowcase checks:');
  console.log(' - India Delivery Hub present:', hubsText.includes('India') ? 'PASS' : 'FAIL');
  console.log(' - United States Headquarters present:', hubsText.includes('United States') ? 'PASS' : 'FAIL');
  console.log(' - Scraped New York Address present:', hubsText.includes('447 Broadway') ? 'PASS' : 'FAIL');
  console.log(' - Scraped Ahmedabad Address present:', hubsText.includes('Shivalik Shilp') ? 'PASS' : 'FAIL');
  console.log(' - Scraped Tagline / Transatlantic Bridge present:', hubsText.includes('Transatlantic Talent Bridge') ? 'PASS' : 'FAIL');

  await footerHubs.screenshot({
    path: path.join(ARTIFACTS_DIR, 'evidence_image4_footer_global_hubs.png'),
  });

  // Test interactive tab switch to Goa
  const goaTab = footerHubs.locator('button:has-text("Goa (Branch)")');
  if (await goaTab.count() > 0) {
    await goaTab.click();
    await page.waitForTimeout(500);
    const updatedHubsText = await footerHubs.innerText();
    console.log(' - Switched to Goa tab successfully:', updatedHubsText.includes("Gera's Imperium Grand") ? 'PASS' : 'FAIL');
    await footerHubs.screenshot({
      path: path.join(ARTIFACTS_DIR, 'evidence_image4_footer_goa_tab.png'),
    });
  }

  // 4. Full Page screenshot
  console.log('4. Capturing full page overview...');
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'evidence_homepage_full_review.png'),
    fullPage: false,
  });

  await browser.close();
  console.log('Browser verification completed successfully! All artifacts generated.');
}

run().catch((err) => {
  console.error('Browser verification failed:', err);
  process.exit(1);
});
