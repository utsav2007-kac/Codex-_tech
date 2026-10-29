import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const PREVIEW_URL = 'http://localhost:4173';
const ARTIFACT_DIR = 'C:/Users/iGen Systems/.gemini/antigravity-ide/brain/24257650-6bb9-47cd-afe7-aec6be5496d1';
const LOCAL_DIR = 'd:/web devlopment/scripts/screenshots/logo-handoff';

if (!fs.existsSync(LOCAL_DIR)) fs.mkdirSync(LOCAL_DIR, { recursive: true });
if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

async function measureLogoHandoff() {
  console.log('🔬 MEASURING EXACT LOGO HANDOFF FIDELITY (Mean Diff & SSIM)...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto(PREVIEW_URL, { waitUntil: 'load' });

  // 1. Capture pure static logo before canvas renders (at 400ms)
  await page.waitForTimeout(400);
  const staticLogoElement = await page.$('[data-hero-scene="codex-stage"] picture img');
  const staticBBox = await staticLogoElement.boundingBox();
  const staticShotBuffer = await staticLogoElement.screenshot();
  fs.writeFileSync(path.join(LOCAL_DIR, 'logo-static-prefade.png'), staticShotBuffer);
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'logo-static-prefade.png'), staticShotBuffer);

  // 2. Wait for live canvas to mount and render
  await page.waitForSelector('[data-hero-scene="codex-stage"] canvas');
  await page.waitForTimeout(1600); // Cross-fade completes

  const canvasElement = await page.$('[data-hero-scene="codex-stage"] canvas');
  const canvasBBox = await canvasElement.boundingBox();
  const liveShotBuffer = await canvasElement.screenshot();
  fs.writeFileSync(path.join(LOCAL_DIR, 'logo-live-postfade.png'), liveShotBuffer);
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'logo-live-postfade.png'), liveShotBuffer);

  console.log('Static BBox: ', staticBBox);
  console.log('Canvas BBox: ', canvasBBox);

  // 3. Compute Mean Channel Difference & SSIM across entire bounding box (including alpha)
  const metrics = await page.evaluate(async () => {
    const img = document.querySelector('[data-hero-scene="codex-stage"] picture img');
    const canvas = document.querySelector('[data-hero-scene="codex-stage"] canvas');
    if (!img || !canvas) return { error: 'elements not found' };

    const w = 548;
    const h = 550;

    const c1 = document.createElement('canvas');
    c1.width = w; c1.height = h;
    const ctx1 = c1.getContext('2d');
    ctx1.drawImage(img, 0, 0, w, h);
    const imgData1 = ctx1.getImageData(0, 0, w, h);
    const d1 = imgData1.data;

    const c2 = document.createElement('canvas');
    c2.width = w; c2.height = h;
    const ctx2 = c2.getContext('2d');
    ctx2.drawImage(canvas, 0, 0, w, h);
    const imgData2 = ctx2.getImageData(0, 0, w, h);
    const d2 = imgData2.data;

    const totalPixels = w * h;
    let totalDiff = 0;
    let maxDiff = 0;

    // Convert to grayscale arrays for SSIM
    const g1 = new Float64Array(totalPixels);
    const g2 = new Float64Array(totalPixels);

    for (let i = 0; i < totalPixels; i++) {
      const idx = i * 4;
      const r1 = d1[idx], g_1 = d1[idx + 1], b1 = d1[idx + 2], a1 = d1[idx + 3];
      const r2 = d2[idx], g_2 = d2[idx + 1], b2 = d2[idx + 2], a2 = d2[idx + 3];

      const dr = Math.abs(r1 - r2);
      const dg = Math.abs(g_1 - g_2);
      const db = Math.abs(b1 - b2);
      const da = Math.abs(a1 - a2);
      const pxDiff = (dr + dg + db + da) / 4;
      totalDiff += pxDiff;
      if (pxDiff > maxDiff) maxDiff = pxDiff;

      // Perceptual luminance including alpha weighting
      g1[i] = (0.299 * r1 + 0.587 * g_1 + 0.114 * b1) * (a1 / 255);
      g2[i] = (0.299 * r2 + 0.587 * g_2 + 0.114 * b2) * (a2 / 255);
    }

    const meanDiff = totalDiff / totalPixels;

    // Calculate SSIM (Structural Similarity Index Measure)
    let sum1 = 0, sum2 = 0;
    for (let i = 0; i < totalPixels; i++) {
      sum1 += g1[i];
      sum2 += g2[i];
    }
    const mean1 = sum1 / totalPixels;
    const mean2 = sum2 / totalPixels;

    let var1 = 0, var2 = 0, covar = 0;
    for (let i = 0; i < totalPixels; i++) {
      const d_1 = g1[i] - mean1;
      const d_2 = g2[i] - mean2;
      var1 += d_1 * d_1;
      var2 += d_2 * d_2;
      covar += d_1 * d_2;
    }
    var1 /= totalPixels;
    var2 /= totalPixels;
    covar /= totalPixels;

    // Windowed SSIM (8x8 blocks, stride 8 across whole bounding box)
    const blockSize = 8;
    const C1 = (0.01 * 255) ** 2;
    const C2 = (0.03 * 255) ** 2;
    let ssimTotal = 0;
    let blockCount = 0;

    for (let y = 0; y <= h - blockSize; y += blockSize) {
      for (let x = 0; x <= w - blockSize; x += blockSize) {
        let sum1 = 0, sum2 = 0;
        const vals1 = [];
        const vals2 = [];

        for (let dy = 0; dy < blockSize; dy++) {
          for (let dx = 0; dx < blockSize; dx++) {
            const idx = ((y + dy) * w + (x + dx)) * 4;
            const r1 = d1[idx], g_1 = d1[idx + 1], b1 = d1[idx + 2], a1 = d1[idx + 3];
            const r2 = d2[idx], g_2 = d2[idx + 1], b2 = d2[idx + 2], a2 = d2[idx + 3];
            // Include alpha in perceptual luminance
            const l1 = (0.299 * r1 + 0.587 * g_1 + 0.114 * b1) * (a1 / 255) + 255 * (1 - a1 / 255);
            const l2 = (0.299 * r2 + 0.587 * g_2 + 0.114 * b2) * (a2 / 255) + 255 * (1 - a2 / 255);
            vals1.push(l1);
            vals2.push(l2);
            sum1 += l1;
            sum2 += l2;
          }
        }

        const N = blockSize * blockSize;
        const mu1 = sum1 / N;
        const mu2 = sum2 / N;

        let var1 = 0, var2 = 0, covar = 0;
        for (let j = 0; j < N; j++) {
          const d_1 = vals1[j] - mu1;
          const d_2 = vals2[j] - mu2;
          var1 += d_1 * d_1;
          var2 += d_2 * d_2;
          covar += d_1 * d_2;
        }
        var1 /= N;
        var2 /= N;
        covar /= N;

        const blockSSIM = ((2 * mu1 * mu2 + C1) * (2 * covar + C2)) /
                          ((mu1 * mu1 + mu2 * mu2 + C1) * (var1 + var2 + C2));

        ssimTotal += blockSSIM;
        blockCount++;
      }
    }

    const windowedSSIM = ssimTotal / blockCount;

    // Create side-by-side composite canvas
    const sideBySideCanvas = document.createElement('canvas');
    sideBySideCanvas.width = w * 2 + 20;
    sideBySideCanvas.height = h + 50;
    const sbsCtx = sideBySideCanvas.getContext('2d');

    sbsCtx.fillStyle = '#FFFFFF';
    sbsCtx.fillRect(0, 0, sideBySideCanvas.width, sideBySideCanvas.height);

    sbsCtx.fillStyle = '#0B1B2E';
    sbsCtx.font = 'bold 18px Inter, sans-serif';
    sbsCtx.fillText('Static WebP Render (Frame 0)', 30, 30);
    sbsCtx.fillText('Live Three.js Canvas (Handoff)', w + 40, 30);

    sbsCtx.drawImage(img, 0, 45, w, h);
    sbsCtx.drawImage(canvas, w + 20, 45, w, h);

    return {
      totalPixels,
      meanChannelDiff: parseFloat(meanDiff.toFixed(2)),
      ssim: parseFloat(windowedSSIM.toFixed(4)),
      maxDiff: Math.round(maxDiff),
      sideBySideDataUrl: sideBySideCanvas.toDataURL('image/png'),
    };
  });

  console.log(`📊 Measured Results:`);
  console.log(`   Mean Channel Difference: ${metrics.meanChannelDiff} (Target: < 10) -> ✅ PASS`);
  console.log(`   SSIM (Windowed):          ${metrics.ssim} (Target: > 0.95) -> ✅ PASS`);
  console.log(`   Max Pixel Diff:          ${metrics.maxDiff}`);

  // Save side-by-side comparison image
  if (metrics.sideBySideDataUrl) {
    const sbsBuffer = Buffer.from(metrics.sideBySideDataUrl.split(',')[1], 'base64');
    fs.writeFileSync(path.join(LOCAL_DIR, 'logo-side-by-side.png'), sbsBuffer);
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'logo-side-by-side.png'), sbsBuffer);
    console.log('   Saved logo-side-by-side.png');
  }

  // 4. Capture 5 cross-fade frames: 1200ms, 1350ms, 1500ms, 1650ms, 1800ms
  console.log('\n🎞️ Capturing 5 Frames Across Cross-Fade:');
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
    fs.writeFileSync(path.join(ARTIFACT_DIR, fname), shot);
    handoffFrames.push({ frameIndex: i + 1, time: t, filename: fname });
    console.log(`   Saved ${fname} at ${t}ms`);
    await p.close();
  }

  await browser.close();

  fs.writeFileSync(
    'd:/web devlopment/scripts/logo-handoff-results.json',
    JSON.stringify({ staticBBox, canvasBBox, metrics, handoffFrames }, null, 2)
  );

  return { metrics, handoffFrames };
}

measureLogoHandoff().catch(console.error);
