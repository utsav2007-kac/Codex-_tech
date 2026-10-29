import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:4173/', { waitUntil: 'load' });
  await page.waitForSelector('[data-hero-scene="codex-stage"] canvas');
  await page.waitForTimeout(600);

  const res = await page.evaluate(async () => {
    const img = document.querySelector('[data-hero-scene="codex-stage"] picture img');
    const canvas = document.querySelector('[data-hero-scene="codex-stage"] canvas');
    if (!img || !canvas) return { error: 'elements not found' };

    const w = 548;
    const h = 550;

    const c1 = document.createElement('canvas');
    c1.width = w; c1.height = h;
    const ctx1 = c1.getContext('2d');
    ctx1.fillStyle = '#FFFFFF';
    ctx1.fillRect(0, 0, w, h);
    ctx1.drawImage(img, 0, 0, w, h);
    const d1 = ctx1.getImageData(0, 0, w, h).data;

    const c2 = document.createElement('canvas');
    c2.width = w; c2.height = h;
    const ctx2 = c2.getContext('2d');
    ctx2.fillStyle = '#FFFFFF';
    ctx2.fillRect(0, 0, w, h);
    ctx2.drawImage(canvas, 0, 0, w, h);
    const d2 = ctx2.getImageData(0, 0, w, h).data;

    // Windowed SSIM (8x8 blocks, stride 8)
    const blockSize = 8;
    const C1 = 6.5025;
    const C2 = 58.5225;

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
            // Luminance formula
            const l1 = 0.299 * d1[idx] + 0.587 * d1[idx + 1] + 0.114 * d1[idx + 2];
            const l2 = 0.299 * d2[idx] + 0.587 * d2[idx + 1] + 0.114 * d2[idx + 2];
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
        for (let i = 0; i < N; i++) {
          const d_1 = vals1[i] - mu1;
          const d_2 = vals2[i] - mu2;
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

    return { windowedSSIM: parseFloat(windowedSSIM.toFixed(4)), blockCount };
  });

  console.log('Windowed SSIM on composited viewport pixels:', res);
  await browser.close();
})();
