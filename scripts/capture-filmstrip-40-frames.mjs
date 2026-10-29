import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const PREVIEW_URL = 'http://localhost:4173';
const ARTIFACT_BASE = 'C:/Users/iGen Systems/.gemini/antigravity-ide/brain/24257650-6bb9-47cd-afe7-aec6be5496d1';

const FAST_3G = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 150,
};

// 40 frame timestamps: 0ms to 1950ms in 50ms steps
const TIMESTAMPS = Array.from({ length: 40 }, (_, i) => i * 50);

async function captureFilmstrip(browser, { width, height, name }) {
  console.log(`\n======================================================`);
  console.log(`🎬 Capturing 40 Slow-Run Frames for ${name} (${width}x${height})`);
  console.log(`======================================================`);

  const runDir = path.join(ARTIFACT_BASE, `filmstrip-${name}-slow`);
  if (!fs.existsSync(runDir)) fs.mkdirSync(runDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width, height },
  });

  const page = await context.newPage();
  const client = await context.newCDPSession(page);

  await client.send('Network.enable');
  await client.send('Network.setCacheDisabled', { cacheDisabled: true });
  await client.send('Network.emulateNetworkConditions', FAST_3G);
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  await context.addInitScript(() => {
    localStorage.setItem('codex_cookie_consent', 'accepted');
  });

  // Track start of navigation and capture real frames
  const frames = [];

  // Navigate to page
  const navPromise = page.goto(PREVIEW_URL, { waitUntil: 'load' });

  for (let i = 0; i < TIMESTAMPS.length; i++) {
    const ms = TIMESTAMPS[i];
    const prevMs = i > 0 ? TIMESTAMPS[i - 1] : 0;
    const waitDelta = ms - prevMs;
    if (waitDelta > 0) {
      await page.waitForTimeout(waitDelta);
    }

    const frameFile = `frame-${String(i).padStart(2, '0')}-${ms}ms.png`;
    const framePath = path.join(runDir, frameFile);
    await page.screenshot({ path: framePath });

    const status = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const para = document.querySelector('.hero-anim-para');
      const cta = document.querySelector('.hero-anim-cta');
      const logoImg = document.querySelector('[data-hero-scene="codex-stage"] img');

      const hasH1 = h1 && h1.getBoundingClientRect().height > 10;
      const hasPara = para && para.getBoundingClientRect().height > 10;
      const hasCta = cta && cta.getBoundingClientRect().height > 10;
      const hasLogo = logoImg && logoImg.getBoundingClientRect().height > 10;

      const itemsVisible = [hasH1, hasPara, hasCta, hasLogo].filter(Boolean).length;
      let state = 'BLANK';
      if (itemsVisible === 4) state = 'FULL CONTENT';
      else if (itemsVisible > 0) state = 'PARTLY CONTENT';

      return {
        state,
        hasH1,
        hasPara,
        hasCta,
        hasLogo,
        h1Top: hasH1 ? Math.round(h1.getBoundingClientRect().top) : null,
      };
    });

    frames.push({
      frameIndex: i + 1,
      ms,
      file: frameFile,
      fullPath: framePath,
      ...status,
    });
  }

  await navPromise;
  await context.close();

  const firstContent = frames.find(f => f.state !== 'BLANK');
  const blankAfter1s = frames.filter(f => f.ms >= 1000 && f.state === 'BLANK');

  console.log(`\nFilmstrip Results for ${name}:`);
  console.log(`  First Content Frame: Frame #${firstContent?.frameIndex} at ${firstContent?.ms}ms (${firstContent?.state})`);
  console.log(`  Blank Frames after 1s: ${blankAfter1s.length} (Target: 0)`);

  return { name, frames, firstContent, blankAfter1s };
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  const desktop = await captureFilmstrip(browser, { width: 1440, height: 900, name: '1440' });
  const mobile = await captureFilmstrip(browser, { width: 390, height: 844, name: '390' });

  await browser.close();

  // Save audit log JSON
  const auditReport = {
    generatedAt: new Date().toISOString(),
    desktop: {
      firstContentFrame: desktop.firstContent,
      blankAfter1sCount: desktop.blankAfter1s.length,
      frames: desktop.frames,
    },
    mobile: {
      firstContentFrame: mobile.firstContent,
      blankAfter1sCount: mobile.blankAfter1s.length,
      frames: mobile.frames,
    },
  };

  fs.writeFileSync(path.join(ARTIFACT_BASE, 'filmstrip-slow-audit.json'), JSON.stringify(auditReport, null, 2));
  console.log(`\n✅ Saved audit report to ${path.join(ARTIFACT_BASE, 'filmstrip-slow-audit.json')}`);
})();
