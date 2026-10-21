import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const outDir = 'd:/web devlopment/agent/screens/audit';
const artifactDir = 'C:/Users/iGen Systems/.gemini/antigravity-ide/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/audit_screens';

async function captureHeroEdges() {
  console.log('📸 Capturing Hero Right Edge & Feathering Screenshots at 1440px and 1920px...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl'] });

  for (const width of [1440, 1920]) {
    const page = await browser.newPage();
    await page.setViewportSize({ width, height: 900 });
    await page.goto('http://localhost:5173/');
    await page.waitForTimeout(1500);

    const stage = await page.$('[data-hero-scene="codex-stage"]');
    if (stage) {
      const box = await stage.boundingBox();
      if (box) {
        // Crop focusing on the right half of the 3D stage and the area to its right
        const clipRegion = {
          x: Math.max(0, box.x + box.width * 0.4),
          y: Math.max(0, box.y - 20),
          width: Math.min(width - (box.x + box.width * 0.4), box.width * 0.8 + 100),
          height: box.height + 60
        };

        const filename = `hero-right-edge-${width}.png`;
        const localPath = path.join(outDir, filename);
        const artPath = path.join(artifactDir, filename);

        await page.screenshot({ path: localPath, clip: clipRegion });
        fs.copyFileSync(localPath, artPath);
        console.log(`Saved right edge proof: ${filename} (Clip width: ${Math.round(clipRegion.width)}px)`);
      }
    }
    await page.close();
  }

  await browser.close();
  console.log('✅ Hero right edge screenshots captured!');
}

captureHeroEdges().catch(console.error);
