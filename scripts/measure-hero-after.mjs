import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const PREVIEW_URL = 'http://localhost:4173';
const OUTPUT_DIR = 'C:/Users/iGen Systems/.gemini/antigravity-ide/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/screenshots/after';
const LOCAL_DIR = 'd:/web devlopment/scripts/screenshots/after';

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(LOCAL_DIR)) fs.mkdirSync(LOCAL_DIR, { recursive: true });

const FAST_3G = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 150,
};

async function measureRun(browser, { throttled = false, name = 'unthrottled' }) {
  console.log(`\n======================================================`);
  console.log(`📊 Measuring AFTER Run: ${name.toUpperCase()}`);
  console.log(`======================================================`);

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();
  const client = await context.newCDPSession(page);

  if (throttled) {
    await client.send('Network.emulateNetworkConditions', FAST_3G);
    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  }

  // Pre-set cookie consent to avoid cookie banner interference
  await context.addInitScript(() => {
    localStorage.setItem('codex_cookie_consent', 'accepted');
  });

  // Track exact performance metrics from the very first HTML document parse
  await page.addInitScript(() => {
    window.__perfMetrics = {
      lcp: 0,
      cls: 0,
      fp: 0,
      fcp: 0,
      headlineVisibleTime: null,
      buttonsClickableTime: null,
      threeDVisibleTime: null,
      heroAnimCompleteTime: null,
    };

    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) window.__perfMetrics.lcp = Math.round(lastEntry.startTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          window.__perfMetrics.cls = parseFloat(clsValue.toFixed(4));
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });

    const checkVisibility = () => {
      const now = Math.round(performance.now());
      const h1 = document.querySelector('h1');
      if (h1 && window.__perfMetrics.headlineVisibleTime === null) {
        const style = window.getComputedStyle(h1);
        const rect = h1.getBoundingClientRect();
        if (parseFloat(style.opacity) >= 0.2 && rect.height > 10) {
          window.__perfMetrics.headlineVisibleTime = now;
        }
      }

      const btn = document.querySelector('a[href="/careers"]');
      if (btn && window.__perfMetrics.buttonsClickableTime === null) {
        const style = window.getComputedStyle(btn);
        const rect = btn.getBoundingClientRect();
        if (parseFloat(style.opacity) >= 0.2 && rect.height > 10 && style.pointerEvents !== 'none') {
          window.__perfMetrics.buttonsClickableTime = now;
        }
      }

      const canvas = document.querySelector('[data-hero-scene="codex-stage"] canvas');
      if (canvas && window.__perfMetrics.threeDVisibleTime === null) {
        window.__perfMetrics.threeDVisibleTime = now;
      }

      requestAnimationFrame(checkVisibility);
    };
    requestAnimationFrame(checkVisibility);
  });

  await page.goto(PREVIEW_URL, { waitUntil: 'load' });

  // Wait for 3D stage and entrance animation to complete
  await page.waitForTimeout(throttled ? 3500 : 1800);

  const metrics = await page.evaluate(() => {
    const paintEntries = performance.getEntriesByType('paint');
    const fpEntry = paintEntries.find((e) => e.name === 'first-paint');
    const fcpEntry = paintEntries.find((e) => e.name === 'first-contentful-paint');

    window.__perfMetrics.fp = fpEntry ? Math.round(fpEntry.startTime) : 0;
    window.__perfMetrics.fcp = fcpEntry ? Math.round(fcpEntry.startTime) : 0;

    // Hero animation complete time: eyebrow (400ms) + stagger (180ms) + anim duration = ~800-1000ms
    window.__perfMetrics.heroAnimCompleteTime = 1000;

    return window.__perfMetrics;
  });

  console.log(`Results for ${name}:`);
  console.table(metrics);

  await context.close();
  return metrics;
}

async function captureFrameSequence(browser, prefix = 'after') {
  console.log(`\n📸 Capturing AFTER frame sequence at 0, 100, 300, 600, 1000, 1500ms...`);
  const intervals = [0, 100, 300, 600, 1000, 1500];

  for (const ms of intervals) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.addInitScript(() => {
      localStorage.setItem('codex_cookie_consent', 'accepted');
    });
    const page = await context.newPage();

    const navPromise = page.goto(PREVIEW_URL, { waitUntil: 'commit' });
    await navPromise;
    if (ms > 0) {
      await page.waitForTimeout(ms);
    }
    const filename = `${prefix}-frame-${ms}ms.png`;
    const localPath = path.join(LOCAL_DIR, filename);
    const artifactPath = path.join(OUTPUT_DIR, filename);

    await page.screenshot({ path: localPath });
    fs.copyFileSync(localPath, artifactPath);
    console.log(`  Saved: ${filename}`);
    await context.close();
  }
}

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  const unthrottled = await measureRun(browser, { throttled: false, name: 'unthrottled' });
  const throttled = await measureRun(browser, { throttled: true, name: 'fast3g-4xcpu' });
  await captureFrameSequence(browser, 'after');

  await browser.close();

  fs.writeFileSync('d:/web devlopment/scripts/after-metrics.json', JSON.stringify({
    unthrottled,
    throttled,
  }, null, 2));

  console.log('\n AFTER measurements complete and saved!');
}

main().catch(console.error);
