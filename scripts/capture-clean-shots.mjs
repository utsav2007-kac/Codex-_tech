import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\iGen Systems\\.gemini\\antigravity\\brain\\24257650-6bb9-47cd-afe7-aec6be5496d1';

async function captureClean() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Accept cookies so banner is gone
  const acceptBtn = page.locator('button:has-text("Accept All")');
  if (await acceptBtn.isVisible()) {
    await acceptBtn.click();
    await page.waitForTimeout(400);
  }

  // 1. Dual3DScrollShowcase clean screenshot
  const showcase = page.locator('#enterprise-showcase');
  await showcase.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await showcase.screenshot({ path: path.join(ARTIFACT_DIR, 'evidence_dark_dual_showcase_clean.png') });

  // 2. DataVisualizations clean screenshot
  const dataSection = page.locator('#performance-numbers');
  await dataSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await dataSection.screenshot({ path: path.join(ARTIFACT_DIR, 'evidence_dark_data_visualizations_clean.png') });

  await browser.close();
  console.log('Clean screenshots captured successfully.');
}

captureClean();

