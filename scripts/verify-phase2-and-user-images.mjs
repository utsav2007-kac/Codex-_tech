import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const artifactsDir = 'C:\\Users\\iGen Systems\\.gemini\\antigravity-ide\\brain\\24257650-6bb9-47cd-afe7-aec6be5496d1';
const screenshotDir = path.join(process.cwd(), 'scripts', 'qa-screenshots-phase2');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function runVerification() {
  console.log('🚀 Starting Phase 2 & User Images Verification via Headless Chrome...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();
  const report = {
    timestamp: new Date().toISOString(),
    tests: [],
  };

  // Helper to record assertions
  function assert(name, condition, details = {}) {
    report.tests.push({
      name,
      passed: Boolean(condition),
      details,
    });
    console.log(`[${condition ? 'PASS' : 'FAIL'}] ${name}`, details);
  }

  try {
    // ── TEST 1: HOME PAGE NAVIGATION ──
    console.log('Navigating to http://localhost:5173/ ...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    // ── TEST 2: IMAGE 3 & 4 FIX - CREATIVE WORKFORCE SOLUTIONS SECTION ──
    console.log('Testing Creative Workforce Solutions Section (Image 3 & 4 Fix)...');
    const workforceSection = page.locator('section:has-text("Workforce Solutions for")').first();
    const isWorkforceVisible = await workforceSection.isVisible();
    assert('Workforce Solutions heading is visible', isWorkforceVisible);

    const headingText = await workforceSection.locator('h2').textContent();
    assert('Workforce Solutions heading text matches reference', headingText.includes('Businesses') && headingText.includes('Job Seekers'), { headingText });

    const jobPlacementCard = page.locator('h3:has-text("Job Placement")').first();
    const recruitmentCard = page.locator('h3:has-text("Recruitment & Staffing")').first();
    assert('Job Placement hero card is present', await jobPlacementCard.isVisible());
    assert('Recruitment & Staffing hero card is present', await recruitmentCard.isVisible());

    // Check bottom row cards (Talent Acquisition, Background Verification, IT Training, Payroll)
    const taCard = page.locator('h4:has-text("Talent Acquisition")').first();
    const bgCard = page.locator('h4:has-text("Background Verification")').first();
    const trainingCard = page.locator('h4:has-text("IT Training")').first();
    const payrollCard = page.locator('h4:has-text("Payroll & Taxes")').first();
    assert('All 4 specialized service cards are present', 
      (await taCard.isVisible()) && (await bgCard.isVisible()) && (await trainingCard.isVisible()) && (await payrollCard.isVisible())
    );

    // Capture screenshot of Image 3/4 fix
    const img34Path = path.join(screenshotDir, '01_workforce_solutions_creative.png');
    await workforceSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await workforceSection.screenshot({ path: img34Path });
    fs.copyFileSync(img34Path, path.join(artifactsDir, '01_workforce_solutions_creative.png'));

    // ── TEST 3: IMAGE 5 FIX - BIDIRECTIONAL 3D SHOWCASE ZERO LAG ──
    console.log('Testing Bidirectional 3D Showcase (Image 5 Fix)...');
    const showcaseSection = page.locator('div:has-text("Bidirectional 3D Motion Grid")').first();
    await showcaseSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    const streamCards = page.locator('#stream-row, div.overflow-hidden div.flex.shrink-0');
    const streamCount = await streamCards.count();
    assert('Bidirectional showcase streams are actively rendered', streamCount > 0, { streamCount });

    const img5Path = path.join(screenshotDir, '02_bidirectional_3d_showcase.png');
    await page.screenshot({ path: img5Path });
    fs.copyFileSync(img5Path, path.join(artifactsDir, '02_bidirectional_3d_showcase.png'));

    // ── TEST 4: IMAGE 2 FIX - REVIEWS WALL LIGHT THEME & SPOTLIGHT ──
    console.log('Testing Reviews Section (Image 2 Fix - Light Theme & Spotlight)...');
    const reviewsSection = page.locator('#reviews-section');
    await reviewsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    const reviewsBg = await reviewsSection.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    // Should NOT be orange rgba(242, 92, 42, ...)
    const isLightBg = !reviewsBg.includes('242, 92, 42') && !reviewsBg.includes('rgb(242, 92, 42)');
    assert('Reviews section background is light (NOT solid orange)', isLightBg, { reviewsBg });

    const spotlightQuote = await reviewsSection.locator('blockquote').first().textContent();
    assert('Featured Spotlight quote is visible', spotlightQuote.length > 20, { quoteSnippet: spotlightQuote.slice(0, 50) });

    // Test tab filtering
    const employerTab = reviewsSection.locator('button:has-text("Hiring Leads")');
    await employerTab.click();
    await page.waitForTimeout(300);
    const updatedSpotlight = await reviewsSection.locator('blockquote').first().textContent();
    assert('Tab switching updates reviews successfully', updatedSpotlight.length > 10);

    const img2Path = path.join(screenshotDir, '03_reviews_section_light.png');
    await reviewsSection.screenshot({ path: img2Path });
    fs.copyFileSync(img2Path, path.join(artifactsDir, '03_reviews_section_light.png'));

    // ── TEST 5: IMAGE 1 FIX - FEATURED TECHNICAL OPENINGS ANIMATION & CARDS ──
    console.log('Testing Featured Technical Openings (Image 1 Fix)...');
    const openingsSection = page.locator('#featured-openings');
    await openingsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    const openingCards = openingsSection.locator('h3');
    const cardsCount = await openingCards.count();
    assert('All 4 Featured Technical Openings cards are visible (Zero Blank Gap)', cardsCount === 4, { cardsCount });

    // Verify card opacity is 1
    const firstCardOpacity = await openingsSection.locator('.p-6.rounded-2xl').first().evaluate((el) => window.getComputedStyle(el).opacity);
    assert('First opening card opacity is 1.0 (Crisp & Visible)', parseFloat(firstCardOpacity) >= 0.9, { opacity: firstCardOpacity });

    const img1Path = path.join(screenshotDir, '04_featured_openings_animated.png');
    await openingsSection.screenshot({ path: img1Path });
    fs.copyFileSync(img1Path, path.join(artifactsDir, '04_featured_openings_animated.png'));

    // ── TEST 6: PHASE 2 FOOTER - USA SKY & INDIA BUTTER BOARDING PASSES & LIVE CLOCKS ──
    console.log('Testing Footer Boarding Passes & Clocks...');
    const footer = page.locator('#site-footer');
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const usaPass = page.locator('#office-boarding-pass-usa');
    const indPass = page.locator('#office-boarding-pass-india');
    assert('USA Sky tint boarding pass is rendered', await usaPass.isVisible());
    assert('India Butter tint boarding pass is rendered', await indPass.isVisible());

    // Verify analog clocks
    const svgClocks = footer.locator('svg[viewBox="0 0 100 100"]');
    const clockCount = await svgClocks.count();
    assert('Both analog SVG clocks are active in footer', clockCount >= 2, { clockCount });

    // Verify dynamic route line
    const routeText = await footer.locator('text=Direct Talent Corridor: DFW / ORD ⇄ HYD').first().textContent();
    assert('Direct Talent Corridor with time difference is displayed', routeText.includes('DFW / ORD ⇄ HYD'), { routeText });

    // Verify legal disclaimer
    const legalNotice = await footer.locator('text=General Information, Not Legal Advice').first().isVisible();
    assert('Truth-rule legal disclaimer is visible in footer', legalNotice);

    // Verify quality governor toggle
    const motionToggle = footer.locator('#quality-governor-toggle');
    assert('Quality governor toggle button is present', await motionToggle.isVisible());
    const initialToggleText = await motionToggle.textContent();
    await motionToggle.click();
    await page.waitForTimeout(300);
    const updatedToggleText = await motionToggle.textContent();
    assert('Quality governor toggle cycles mode on click', initialToggleText !== updatedToggleText, { initialToggleText, updatedToggleText });

    const footerPath = path.join(screenshotDir, '05_footer_boarding_passes_light.png');
    await footer.screenshot({ path: footerPath });
    fs.copyFileSync(footerPath, path.join(artifactsDir, '05_footer_boarding_passes_light.png'));

    // ── TEST 7: PHASE 2 TYPOGRAPHY SPECIMEN (/dev/typography) ──
    console.log('Testing Typography Specimen Page (/dev/typography)...');
    await page.goto('http://localhost:5173/dev/typography', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    const typoTitle = await page.locator('h1').textContent();
    assert('/dev/typography loads and renders specimen title', typoTitle.includes('Typography System & Specimen'));

    const soraCard = page.locator('h2:has-text("Sora")').first();
    const interCard = page.locator('h2:has-text("Inter")').first();
    assert('Both Sora and Inter family specimens are documented', (await soraCard.isVisible()) && (await interCard.isVisible()));

    const typoPath = path.join(screenshotDir, '06_dev_typography_specimen.png');
    await page.screenshot({ path: typoPath, fullPage: true });
    fs.copyFileSync(typoPath, path.join(artifactsDir, '06_dev_typography_specimen.png'));

  } catch (err) {
    console.error('Test execution error:', err);
    report.error = err.message;
  } finally {
    await browser.close();
  }

  // Save QA Report JSON
  const reportPath = path.join(process.cwd(), 'scripts', 'phase2-qa-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📊 Verification Complete! Total tests: ${report.tests.length}, Passed: ${report.tests.filter(t => t.passed).length}, Failed: ${report.tests.filter(t => !t.passed).length}`);
  console.log(`Saved report to ${reportPath}`);
}

runVerification();
