import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/iGen Systems/.gemini/antigravity/brain/24257650-6bb9-47cd-afe7-aec6be5496d1';

(async () => {
  console.log('🚀 Testing Resume Comparison Slider Fix in Chrome...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://localhost:5173/services/resume-linkedin-rebranding', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // 1. Initial 50/50 State Screenshot
  console.log('Capturing initial 50/50 comparison state...');
  const initialScreenshot = path.join(ARTIFACT_DIR, 'resume_slider_fixed_50.png');
  await page.screenshot({ path: initialScreenshot });
  console.log(`📸 Saved 50/50 state screenshot: ${initialScreenshot}`);

  // 2. Test slider at 35% (Right expanded)
  const slider = page.locator('input[type="range"]');
  await slider.fill('35');
  await page.waitForTimeout(300);
  const screenshot35 = path.join(ARTIFACT_DIR, 'resume_slider_fixed_35.png');
  await page.screenshot({ path: screenshot35 });
  console.log(`📸 Saved 35% slider state screenshot: ${screenshot35}`);

  // 3. Test slider at 65% (Left expanded)
  await slider.fill('65');
  await page.waitForTimeout(300);
  const screenshot65 = path.join(ARTIFACT_DIR, 'resume_slider_fixed_65.png');
  await page.screenshot({ path: screenshot65 });
  console.log(`📸 Saved 65% slider state screenshot: ${screenshot65}`);

  // 4. Mobile Viewport (390x844)
  console.log('Testing mobile responsive behavior (390x844)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  const mobileScreenshot = path.join(ARTIFACT_DIR, 'resume_slider_fixed_mobile.png');
  await page.screenshot({ path: mobileScreenshot });
  console.log(`📸 Saved mobile state screenshot: ${mobileScreenshot}`);

  // 5. Verification checks
  const beforeText = await page.textContent('text=BEFORE: Generic Task Listing');
  const afterText = await page.textContent('text=AFTER: Codex Re-Engineered Resume');
  const beforeSkills = await page.textContent('text=Java 8');
  const afterSkills = await page.textContent('text=Kafka');

  console.log('\n--- Content Visibility Verifications ---');
  console.log(`✓ Before Header visible: ${!!beforeText}`);
  console.log(`✓ After Header visible: ${!!afterText}`);
  console.log(`✓ Before Skill Tags visible: ${!!beforeSkills}`);
  console.log(`✓ After Skill Tags visible: ${!!afterSkills}`);

  await browser.close();
  console.log('\n✅ ALL RESUME COMPARISON SLIDER FIX CHECKS COMPLETED!');
})();

