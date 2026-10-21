import { chromium } from '@playwright/test';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/iGen Systems/.gemini/antigravity-ide/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/audit_screens';

async function capture() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl'] });
  
  for (const width of [1440, 1920]) {
    const page = await browser.newPage();
    await page.setViewportSize({ width, height: 900 });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // 1. After (Current Multi-directional radial mask)
    const heroRightBox = await page.evaluate(() => {
      const hero = document.querySelector('section');
      const rect = hero.getBoundingClientRect();
      return {
        x: rect.width * 0.5,
        y: 0,
        width: rect.width * 0.5,
        height: Math.min(rect.height, 900)
      };
    });

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, `hero-right-edge-${width}-after.png`),
      clip: heroRightBox
    });
    console.log(`Captured after screenshot at ${width}px`);

    // 2. Before (Simulate linear-gradient to bottom only, hard right cut)
    await page.evaluate(() => {
      const stage = document.querySelector('[data-hero-3d-stage]') || document.querySelector('canvas')?.parentElement?.parentElement;
      if (stage) {
        stage.style.maskImage = 'linear-gradient(to bottom, black 80%, transparent 100%)';
        stage.style.webkitMaskImage = 'linear-gradient(to bottom, black 80%, transparent 100%)';
      }
    });
    await page.waitForTimeout(500);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, `hero-right-edge-${width}-before.png`),
      clip: heroRightBox
    });
    console.log(`Captured before screenshot at ${width}px`);

    await page.close();
  }

  await browser.close();
  console.log('Hero right-edge comparison captures complete.');
}

capture().catch(console.error);
