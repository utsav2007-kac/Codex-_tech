import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const PREVIEW_URL = 'http://localhost:4173';
const OUTPUT_DIR = 'C:/Users/iGen Systems/.gemini/antigravity-ide/brain/24257650-6bb9-47cd-afe7-aec6be5496d1';
const LOCAL_DIR = 'd:/web devlopment/scripts/screenshots/logo-handoff';

if (!fs.existsSync(LOCAL_DIR)) fs.mkdirSync(LOCAL_DIR, { recursive: true });

async function main() {
  console.log('🔬 MEASURING LOGO HANDOFF & CROSS-FADE FIDELITY');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Track the exact time when liveReady flips
  await page.addInitScript(() => {
    window.__crossFadeEvents = [];
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          const el = m.target;
          if (el.classList && el.classList.contains('transition-opacity')) {
            window.__crossFadeEvents.push({
              time: Math.round(performance.now()),
              className: el.className,
              opacity: window.getComputedStyle(el).opacity,
            });
          }
        }
      }
    });
    document.addEventListener('DOMContentLoaded', () => {
      const stage = document.querySelector('[data-hero-scene="codex-stage"]');
      if (stage) {
        observer.observe(stage, { attributes: true, subtree: true });
      }
    });
  });

  await page.goto(PREVIEW_URL, { waitUntil: 'load' });

  // 1. Capture pure static logo before canvas renders (at 400ms)
  await page.waitForTimeout(400);
  const staticLogoElement = await page.$('[data-hero-scene="codex-stage"] picture img');
  const staticBBox = await staticLogoElement.boundingBox();
  const staticScreenshot = await staticLogoElement.screenshot();
  fs.writeFileSync(path.join(LOCAL_DIR, 'logo-static-prefade.png'), staticScreenshot);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'logo-static-prefade.png'), staticScreenshot);

  // 2. Wait for live canvas to mount and render
  await page.waitForSelector('[data-hero-scene="codex-stage"] canvas');
  
  // Wait for cross-fade to complete
  await page.waitForTimeout(1600);

  const canvasElement = await page.$('[data-hero-scene="codex-stage"] canvas');
  const canvasBBox = await canvasElement.boundingBox();
  const liveScreenshot = await canvasElement.screenshot();
  fs.writeFileSync(path.join(LOCAL_DIR, 'logo-live-postfade.png'), liveScreenshot);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'logo-live-postfade.png'), liveScreenshot);

  console.log('\n📐 Bounding Box Comparison:');
  console.log('  Static Img Bounding Box:  ', staticBBox);
  console.log('  Live Canvas Bounding Box: ', canvasBBox);

  // 3. Capture 5 frames around the cross-fade:
  // We reload and capture at 1200ms, 1350ms, 1500ms, 1650ms, 1800ms
  console.log('\n🎞️ Capturing 5 Frames Around Cross-Fade:');
  const handoffTimes = [1200, 1350, 1500, 1650, 1800];
  const handoffFrames = [];

  for (let i = 0; i < handoffTimes.length; i++) {
    const t = handoffTimes[i];
    const p = await context.newPage();
    await p.goto(PREVIEW_URL, { waitUntil: 'load' });
    await p.waitForTimeout(t);
    const stageEl = await p.$('[data-hero-scene="codex-stage"]');
    const shot = await stageEl.screenshot();
    const fname = `handoff-frame-${i + 1}-${t}ms.png`;
    fs.writeFileSync(path.join(LOCAL_DIR, fname), shot);
    fs.writeFileSync(path.join(OUTPUT_DIR, fname), shot);
    handoffFrames.push({ time: t, file: fname });
    console.log(`  Saved ${fname} at ${t}ms`);
    await p.close();
  }

  // 4. Calculate pixel difference and mean color difference between static and live
  const diffResult = await page.evaluate(async () => {
    const img = document.querySelector('[data-hero-scene="codex-stage"] picture img');
    const canvas = document.querySelector('[data-hero-scene="codex-stage"] canvas');
    if (!img || !canvas) return { error: 'elements not found' };

    const c1 = document.createElement('canvas');
    c1.width = 548;
    c1.height = 550;
    const ctx1 = c1.getContext('2d');
    ctx1.drawImage(img, 0, 0, 548, 550);
    const d1 = ctx1.getImageData(0, 0, 548, 550).data;

    const c2 = document.createElement('canvas');
    c2.width = 548;
    c2.height = 550;
    const ctx2 = c2.getContext('2d');
    ctx2.drawImage(canvas, 0, 0, 548, 550);
    const d2 = ctx2.getImageData(0, 0, 548, 550).data;

    let totalDiff = 0;
    let nonTransparentPixels = 0;
    let maxChannelDiff = 0;

    for (let i = 0; i < d1.length; i += 4) {
      const a1 = d1[i + 3];
      const a2 = d2[i + 3];

      if (a1 < 30 && a2 < 30) continue; // transparent background

      nonTransparentPixels++;
      const dr = Math.abs(d1[i] - d2[i]);
      const dg = Math.abs(d1[i + 1] - d2[i + 1]);
      const db = Math.abs(d1[i + 2] - d2[i + 2]);
      const da = Math.abs(a1 - a2);

      const pxDiff = (dr + dg + db + da) / 4;
      totalDiff += pxDiff;
      if (pxDiff > maxChannelDiff) maxChannelDiff = pxDiff;
    }

    const meanDiff = nonTransparentPixels > 0 ? totalDiff / nonTransparentPixels : 0;
    // Normalized similarity (0 to 1, where 1 is 100% identical)
    const similarity = Math.max(0, 1 - meanDiff / 255);

    return {
      nonTransparentPixels,
      meanChannelDiff: parseFloat(meanDiff.toFixed(2)),
      similarityPercentage: parseFloat((similarity * 100).toFixed(2)),
      maxChannelDiff: Math.round(maxChannelDiff),
    };
  });

  console.log('\n📊 Pixel & Lighting Difference Analysis:');
  console.log(`  Non-transparent pixels analyzed: ${diffResult.nonTransparentPixels}`);
  console.log(`  Mean Channel Difference (0-255 scale): ${diffResult.meanChannelDiff}`);
  console.log(`  Visual Similarity Score: ${diffResult.similarityPercentage}%`);
  console.log(`  Max Channel Difference: ${diffResult.maxChannelDiff}`);

  fs.writeFileSync(
    'd:/web devlopment/scripts/logo-handoff-results.json',
    JSON.stringify({ staticBBox, canvasBBox, diffResult, handoffFrames }, null, 2)
  );

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
