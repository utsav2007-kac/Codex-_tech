import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const PREVIEW_URL = 'http://localhost:4173';
const OUTPUT_DIR = 'C:/Users/iGen Systems/.gemini/antigravity-ide/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/screenshots/baseline';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Fast 3G preset: 1.6 Mbps download, 750 kbps upload, 150ms RTT
const FAST_3G = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 150,
};

async function measureRun(browser, { throttled = false, name = 'unthrottled' }) {
  console.log(`\n======================================================`);
  console.log(`📊 Measuring Baseline Run: ${name.toUpperCase()}`);
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

  // Set up performance observers before navigation
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

    // LCP
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) window.__perfMetrics.lcp = Math.round(lastEntry.startTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // CLS
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          window.__perfMetrics.cls = parseFloat(clsValue.toFixed(4));
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });

    // Watch for headline visibility
    const startNav = performance.now();
    const checkVisibility = () => {
      const now = Math.round(performance.now());
      const h1 = document.querySelector('h1');
      if (h1 && window.__perfMetrics.headlineVisibleTime === null) {
        const style = window.getComputedStyle(h1);
        const rect = h1.getBoundingClientRect();
        // check if parent or curtain covers it
        const curtain = document.querySelector('[class*="bg-navy-900"]');
        const isCurtainPresent = curtain && window.getComputedStyle(curtain).display !== 'none' && window.getComputedStyle(curtain).opacity !== '0';
        if (parseFloat(style.opacity) >= 0.5 && rect.height > 10 && !isCurtainPresent) {
          window.__perfMetrics.headlineVisibleTime = now;
        }
      }

      const btn = document.querySelector('a[href="/careers"]');
      if (btn && window.__perfMetrics.buttonsClickableTime === null) {
        const style = window.getComputedStyle(btn);
        const rect = btn.getBoundingClientRect();
        if (parseFloat(style.opacity) >= 0.5 && rect.height > 10 && style.pointerEvents !== 'none') {
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

  const navStart = Date.now();
  await page.goto(PREVIEW_URL, { waitUntil: 'load' });

  // Frame sequence capture at exact milestones: 0, 100, 300, 600, 1000, 1500ms
  // Wait until full hero animation stabilizes
  await page.waitForTimeout(2000);

  const metrics = await page.evaluate(() => {
    const paintEntries = performance.getEntriesByType('paint');
    const fpEntry = paintEntries.find((e) => e.name === 'first-paint');
    const fcpEntry = paintEntries.find((e) => e.name === 'first-contentful-paint');

    window.__perfMetrics.fp = fpEntry ? Math.round(fpEntry.startTime) : 0;
    window.__perfMetrics.fcp = fcpEntry ? Math.round(fcpEntry.startTime) : 0;

    return window.__perfMetrics;
  });

  console.log(`Results for ${name}:`);
  console.table(metrics);

  await context.close();
  return metrics;
}

async function captureFrameSequence(browser, prefix = 'baseline') {
  console.log(`\n📸 Capturing frame sequence at 0, 100, 300, 600, 1000, 1500ms...`);
  const intervals = [0, 100, 300, 600, 1000, 1500];

  for (const ms of intervals) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    
    // We capture each point in time after navigation start
    const navPromise = page.goto(PREVIEW_URL, { waitUntil: 'commit' });
    await navPromise;
    if (ms > 0) {
      await page.waitForTimeout(ms);
    }
    const filename = `${prefix}-frame-${ms}ms.png`;
    await page.screenshot({ path: path.join(OUTPUT_DIR, filename) });
    console.log(`  Saved: ${filename}`);
    await context.close();
  }
}

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  const unthrottled = await measureRun(browser, { throttled: false, name: 'unthrottled' });
  const throttled = await measureRun(browser, { throttled: true, name: 'fast3g-4xcpu' });
  await captureFrameSequence(browser, 'baseline');

  await browser.close();

  fs.writeFileSync('d:/web devlopment/scripts/baseline-metrics.json', JSON.stringify({
    unthrottled,
    throttled,
  }, null, 2));

  console.log('\n Baseline measurements complete and saved!');
}

main().catch(console.error);
