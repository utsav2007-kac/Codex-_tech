import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = 'C:/Users/iGen Systems/.gemini/antigravity-ide/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/screenshots';
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function runTest() {
  console.log('🚀 Starting 3D Dual-Direction Scrolling Playwright Verification Suite...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const viewports = [
    { name: '1440px Desktop', width: 1440, height: 900, fileSuffix: '1440px' },
    { name: '768px Tablet', width: 768, height: 1024, fileSuffix: '768px' },
    { name: '390px Mobile', width: 390, height: 844, fileSuffix: '390px' },
  ];

  const results = {
    viewportsTested: [],
    motionVerification: {},
    controlsTested: {},
    screenshots: []
  };

  for (const vp of viewports) {
    console.log(`\nTesting viewport: ${vp.name}...`);
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    // Locate the Dual 3D Showcase section
    const showcaseSection = page.locator('text=Dual-Stream 3D Motion Grid').locator('xpath=ancestor::section[1]');
    await showcaseSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    // Capture screenshot of the 3D Dual-Direction Showcase
    const screenshotPath = path.join(SCREENSHOTS_DIR, `dual-3d-showcase-${vp.fileSuffix}.png`);
    await showcaseSection.screenshot({ path: screenshotPath });
    console.log(`  📸 Screenshot saved: ${screenshotPath}`);
    results.screenshots.push(screenshotPath);

    // If 1440px desktop, verify movement of both streams (Left vs Right)
    if (vp.fileSuffix === '1440px') {
      console.log('  🔍 Measuring dual stream velocities (working both sides)...');
      const track1 = page.locator('.group\\/track1 > div').nth(1);
      const track2 = page.locator('.group\\/track2 > div').nth(1);

      const t1_pos1 = await track1.evaluate(el => el.getBoundingClientRect().x);
      const t2_pos1 = await track2.evaluate(el => el.getBoundingClientRect().x);

      await page.waitForTimeout(600);

      const t1_pos2 = await track1.evaluate(el => el.getBoundingClientRect().x);
      const t2_pos2 = await track2.evaluate(el => el.getBoundingClientRect().x);

      const t1_delta = t1_pos2 - t1_pos1;
      const t2_delta = t2_pos2 - t2_pos1;

      console.log(`    Track 1 (Top Row): delta = ${t1_delta.toFixed(2)}px (Expected: < 0, moving LEFT)`);
      console.log(`    Track 2 (Bottom Row): delta = ${t2_delta.toFixed(2)}px (Expected: > 0, moving RIGHT)`);

      results.motionVerification = {
        track1_moving_left: t1_delta < 0,
        track1_delta_px: t1_delta,
        track2_moving_right: t2_delta > 0,
        track2_delta_px: t2_delta,
        working_both_sides: t1_delta < 0 && t2_delta > 0
      };

      // Test interactive controls: Pause toggle
      const pauseBtn = page.locator('button[title*="Pause 3D Motion"], button[title*="Resume 3D Motion"]');
      if (await pauseBtn.count() > 0) {
        await pauseBtn.click();
        await page.waitForTimeout(400);
        const pausedScreenshot = path.join(SCREENSHOTS_DIR, 'dual-3d-showcase-paused-1440px.png');
        await showcaseSection.screenshot({ path: pausedScreenshot });
        console.log(`  📸 Paused screenshot saved: ${pausedScreenshot}`);
        results.screenshots.push(pausedScreenshot);

        // Resume
        await pauseBtn.click();
        await page.waitForTimeout(300);
      }

      // Test 3D perspective toggle
      const perspectiveBtn = page.locator('button[title*="Toggle 3D Perspective Tilt"]');
      if (await perspectiveBtn.count() > 0) {
        await perspectiveBtn.click();
        await page.waitForTimeout(400);
        const flatScreenshot = path.join(SCREENSHOTS_DIR, 'dual-3d-showcase-flat-1440px.png');
        await showcaseSection.screenshot({ path: flatScreenshot });
        console.log(`  📸 Flat-mode screenshot saved: ${flatScreenshot}`);
        results.screenshots.push(flatScreenshot);

        // Switch back to 3D
        await perspectiveBtn.click();
        await page.waitForTimeout(300);
      }

      // Test Hover on a currently visible card in the viewport
      const showcaseBox = await showcaseSection.boundingBox();
      if (showcaseBox) {
        // Move mouse to center of showcase to hover over visible cards
        await page.mouse.move(showcaseBox.x + showcaseBox.width / 2, showcaseBox.y + showcaseBox.height / 2);
        await page.waitForTimeout(400);
        const hoverScreenshot = path.join(SCREENSHOTS_DIR, 'dual-3d-showcase-card-hover-1440px.png');
        await showcaseSection.screenshot({ path: hoverScreenshot });
        console.log(`  📸 Hovered card screenshot saved: ${hoverScreenshot}`);
        results.screenshots.push(hoverScreenshot);
      }
    }

    results.viewportsTested.push(vp.name);
    await page.close();
  }

  await browser.close();

  console.log('\n================ TEST SUMMARY ================');
  console.log(`Viewports Tested: ${results.viewportsTested.join(', ')}`);
  console.log(`Working Both Sides Verified: ${results.motionVerification.working_both_sides ? '✅ YES' : '❌ NO'}`);
  console.log(`Track 1 Moving Left: ${results.motionVerification.track1_moving_left ? '✅ YES' : '❌ NO'} (${results.motionVerification.track1_delta_px}px)`);
  console.log(`Track 2 Moving Right: ${results.motionVerification.track2_moving_right ? '✅ YES' : '❌ NO'} (${results.motionVerification.track2_delta_px}px)`);
  console.log('==============================================');

  fs.writeFileSync(
    path.join(SCREENSHOTS_DIR, 'dual-3d-test-results.json'),
    JSON.stringify(results, null, 2)
  );
}

runTest().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
