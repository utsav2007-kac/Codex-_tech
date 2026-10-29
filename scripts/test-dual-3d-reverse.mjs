import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = 'C:/Users/iGen Systems/.gemini/antigravity-ide/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/screenshots';
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function runReverseSuite() {
  console.log('🚀 Starting Bidirectional 3D (Normal & Reverse) Playwright Verification Suite...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // Locate the 3D Motion Grid section
  const showcaseSection = page.locator('text=Bidirectional 3D Motion Grid').locator('xpath=ancestor::section[1]');
  await showcaseSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  // 1. Capture Normal State Screenshot
  const normalShot = path.join(SCREENSHOTS_DIR, 'dual-3d-normal-mode-1440px.png');
  await showcaseSection.screenshot({ path: normalShot });
  console.log(`  📸 Normal Mode Screenshot: ${normalShot}`);

  // 2. Measure Normal Velocities
  console.log('\n  🔍 Measuring NORMAL STREAM MOTION...');
  const track1 = showcaseSection.locator('.overflow-hidden.flex.flex-nowrap').first().locator('> div');
  const track2 = showcaseSection.locator('.overflow-hidden.flex.flex-nowrap').nth(1).locator('> div');

  const t1_norm_start = await track1.evaluate(el => el.getBoundingClientRect().x);
  const t2_norm_start = await track2.evaluate(el => el.getBoundingClientRect().x);

  await page.waitForTimeout(600);

  const t1_norm_end = await track1.evaluate(el => el.getBoundingClientRect().x);
  const t2_norm_end = await track2.evaluate(el => el.getBoundingClientRect().x);

  const normal_delta_1 = t1_norm_end - t1_norm_start;
  const normal_delta_2 = t2_norm_end - t2_norm_start;

  console.log(`    Track 1 Normal: delta = ${normal_delta_1.toFixed(2)}px (Expected: < 0, moving LEFT)`);
  console.log(`    Track 2 Normal: delta = ${normal_delta_2.toFixed(2)}px (Expected: > 0, moving RIGHT)`);

  // 3. Click Reverse Flow Button
  console.log('\n  🔄 Toggling REVERSE FLOW...');
  const reverseBtn = showcaseSection.locator('button[title*="Reverse Stream Motion Direction"]');
  await reverseBtn.click();
  await page.waitForTimeout(400);

  // Capture Reverse State Screenshot
  const reverseShot = path.join(SCREENSHOTS_DIR, 'dual-3d-reverse-mode-1440px.png');
  await showcaseSection.screenshot({ path: reverseShot });
  console.log(`  📸 Reverse Mode Screenshot: ${reverseShot}`);

  // 4. Measure Reversed Velocities
  console.log('  🔍 Measuring REVERSED STREAM MOTION...');
  const t1_rev_start = await track1.evaluate(el => el.getBoundingClientRect().x);
  const t2_rev_start = await track2.evaluate(el => el.getBoundingClientRect().x);

  await page.waitForTimeout(600);

  const t1_rev_end = await track1.evaluate(el => el.getBoundingClientRect().x);
  const t2_rev_end = await track2.evaluate(el => el.getBoundingClientRect().x);

  const reverse_delta_1 = t1_rev_end - t1_rev_start;
  const reverse_delta_2 = t2_rev_end - t2_rev_start;

  console.log(`    Track 1 Reversed: delta = ${reverse_delta_1.toFixed(2)}px (Expected: > 0, reversed to RIGHT)`);
  console.log(`    Track 2 Reversed: delta = ${reverse_delta_2.toFixed(2)}px (Expected: < 0, reversed to LEFT)`);

  // 5. Test Responsiveness on 768px and 390px in Reverse Mode
  console.log('\n  📱 Testing Mobile & Tablet Viewports...');
  await page.setViewportSize({ width: 768, height: 1024 });
  await showcaseSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const tabletShot = path.join(SCREENSHOTS_DIR, 'dual-3d-reverse-mode-768px.png');
  await showcaseSection.screenshot({ path: tabletShot });
  console.log(`  📸 Tablet 768px Screenshot: ${tabletShot}`);

  await page.setViewportSize({ width: 390, height: 844 });
  await showcaseSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const mobileShot = path.join(SCREENSHOTS_DIR, 'dual-3d-reverse-mode-390px.png');
  await showcaseSection.screenshot({ path: mobileShot });
  console.log(`  📸 Mobile 390px Screenshot: ${mobileShot}`);

  await browser.close();

  const isNormalWorking = normal_delta_1 < 0 && normal_delta_2 > 0;
  const isReverseWorking = reverse_delta_1 > 0 && reverse_delta_2 < 0;

  console.log('\n================ VERIFICATION SUMMARY ================');
  console.log(`Normal Flow (Left & Right):   ${isNormalWorking ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Reverse Flow (Right & Left):  ${isReverseWorking ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Both Sides & Reverse Proven: ${isNormalWorking && isReverseWorking ? '✅ 100% VERIFIED' : '❌ FAILED'}`);
  console.log('======================================================');
}

runReverseSuite().catch(err => {
  console.error('❌ Error during test:', err);
  process.exit(1);
});
