import { chromium } from 'playwright';
import path from 'path';

async function main() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173/about (Dark theme)...');
  await page.goto('http://localhost:5173/about', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Take screenshot of navbar on dark theme
  const artifactDir = 'C:\\Users\\iGen Systems\\.gemini\\antigravity\\brain\\24257650-6bb9-47cd-afe7-aec6be5496d1';
  
  await page.screenshot({
    path: path.join(artifactDir, 'evidence_navbar_dark.png'),
    clip: { x: 0, y: 0, width: 1440, height: 180 },
  });
  console.log('Captured evidence_navbar_dark.png');

  // Take screenshot of the entire About page hero section showing the new enterprise mesh
  await page.screenshot({
    path: path.join(artifactDir, 'evidence_about_hero_redesign.png'),
    clip: { x: 0, y: 0, width: 1440, height: 750 },
  });
  console.log('Captured evidence_about_hero_redesign.png');

  // Verify text colors of nav links on dark theme
  const links = await page.$$eval('#home-navbar nav a, #home-navbar nav button', (els) =>
    els.map((el) => ({
      text: el.innerText.trim(),
      color: window.getComputedStyle(el).color,
    }))
  );
  console.log('Navbar links on Dark Theme:', JSON.stringify(links, null, 2));

  // Now navigate to http://localhost:5173/ (Light theme)
  console.log('Navigating to http://localhost:5173/ (Light theme)...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: path.join(artifactDir, 'evidence_navbar_light.png'),
    clip: { x: 0, y: 0, width: 1440, height: 180 },
  });
  console.log('Captured evidence_navbar_light.png');

  const lightLinks = await page.$$eval('#home-navbar nav a, #home-navbar nav button', (els) =>
    els.map((el) => ({
      text: el.innerText.trim(),
      color: window.getComputedStyle(el).color,
    }))
  );
  console.log('Navbar links on Light Theme:', JSON.stringify(lightLinks, null, 2));

  await browser.close();
  console.log('Verification completed successfully!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
