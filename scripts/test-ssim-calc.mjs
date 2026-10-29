import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1600);

  const res = await page.evaluate(() => {
    const img = document.querySelector('[data-hero-scene="codex-stage"] picture img');
    const canvas = document.querySelector('[data-hero-scene="codex-stage"] canvas');
    const w = 548, h = 550;
    const c1 = document.createElement('canvas'); c1.width = w; c1.height = h;
    const ctx1 = c1.getContext('2d'); ctx1.drawImage(img, 0, 0, w, h);
    const d1 = ctx1.getImageData(0, 0, w, h).data;

    const c2 = document.createElement('canvas'); c2.width = w; c2.height = h;
    const ctx2 = c2.getContext('2d'); ctx2.drawImage(canvas, 0, 0, w, h);
    const d2 = ctx2.getImageData(0, 0, w, h).data;

    const total = w * h;
    const C1 = (0.01 * 255) ** 2, C2 = (0.03 * 255) ** 2;
    let sum1 = 0, sum2 = 0;
    const g1 = new Float64Array(total), g2 = new Float64Array(total);
    for (let i = 0; i < total; i++) {
      const idx = i * 4;
      // Perceptual luminance on white background
      g1[i] = (d1[idx]*0.299 + d1[idx+1]*0.587 + d1[idx+2]*0.114) * (d1[idx+3]/255) + (255 - d1[idx+3]);
      g2[i] = (d2[idx]*0.299 + d2[idx+1]*0.587 + d2[idx+2]*0.114) * (d2[idx+3]/255) + (255 - d2[idx+3]);
      sum1 += g1[i]; sum2 += g2[i];
    }
    const mu1 = sum1 / total, mu2 = sum2 / total;
    let v1 = 0, v2 = 0, cov = 0;
    for (let i = 0; i < total; i++) {
      const d_1 = g1[i] - mu1, d_2 = g2[i] - mu2;
      v1 += d_1*d_1; v2 += d_2*d_2; cov += d_1*d_2;
    }
    v1 /= total; v2 /= total; cov /= total;
    const globalSSIM = ((2 * mu1 * mu2 + C1) * (2 * cov + C2)) / ((mu1*mu1 + mu2*mu2 + C1) * (v1 + v2 + C2));

    // Also compute directly on the 4 RGBA channels
    let rDiff = 0, gDiff = 0, bDiff = 0, aDiff = 0;
    for (let i = 0; i < total; i++) {
      const idx = i * 4;
      rDiff += Math.abs(d1[idx] - d2[idx]);
      gDiff += Math.abs(d1[idx+1] - d2[idx+1]);
      bDiff += Math.abs(d1[idx+2] - d2[idx+2]);
      aDiff += Math.abs(d1[idx+3] - d2[idx+3]);
    }

    return {
      globalSSIM,
      meanChannelDiff: (rDiff + gDiff + bDiff + aDiff) / (4 * total),
      channelDiffs: {
        r: rDiff / total,
        g: gDiff / total,
        b: bDiff / total,
        a: aDiff / total,
      }
    };
  });

  console.log('FIDELITY RESULTS:', JSON.stringify(res, null, 2));
  await browser.close();
})();
