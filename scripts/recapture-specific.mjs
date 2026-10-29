import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/iGen Systems/.gemini/antigravity-ide/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/screenshots';

async function recapture() {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  for (const pageName of ['services', 'live-placements']) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('console', (msg) => console.log(`[${pageName}]`, msg.text()));
    await page.addInitScript(() => {
      sessionStorage.setItem('codex_visited_curtain', 'true');
      localStorage.setItem('codex_cookie_consent', 'accepted');
    });
    await page.goto(`http://localhost:5173/${pageName}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const filePath = path.join(ARTIFACT_DIR, `${pageName}-1440px.png`);
    await page.screenshot({ path: filePath });
    console.log(`Recaptured ${pageName}-1440px: ${fs.statSync(filePath).size} bytes`);
    await page.close();
  }

  // Recapture mobile drawer with newly added Refer & Earn link
  const mobPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobPage.addInitScript(() => {
    sessionStorage.setItem('codex_visited_curtain', 'true');
    localStorage.setItem('codex_cookie_consent', 'accepted');
  });
  await mobPage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await mobPage.click('button[aria-label="Toggle navigation menu"]');
  await mobPage.waitForTimeout(500);
  const mobPath = path.join(ARTIFACT_DIR, 'mobile-drawer-390px.png');
  await mobPage.screenshot({ path: mobPath });
  console.log(`Recaptured mobile drawer: ${fs.statSync(mobPath).size} bytes`);
  await mobPage.close();

  await browser.close();
}

recapture().catch((err) => {
  console.error(err);
  process.exit(1);
});
