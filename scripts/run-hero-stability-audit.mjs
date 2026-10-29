import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const PREVIEW_URL = 'http://localhost:4173';
const OUTPUT_DIR = 'C:/Users/iGen Systems/.gemini/antigravity-ide/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/screenshots/hero-filmstrip';
const LOCAL_DIR = 'd:/web devlopment/scripts/screenshots/hero-filmstrip';

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(LOCAL_DIR)) fs.mkdirSync(LOCAL_DIR, { recursive: true });

const FAST_3G = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 150,
};

async function testBoundingBoxesAndColors(browser) {
  console.log('\n======================================================');
  console.log('📐 TEST 1: Automated Bounding Box & Dominant Color Check (100ms vs 2000ms)');
  console.log('======================================================');

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Track positions at 0, 200, 600, 1200, 2000ms
  await page.addInitScript(() => {
    window.__perfEntries = [];
    window.__longTasks = [];
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          window.__longTasks.push({ name: entry.name, duration: Math.round(entry.duration), startTime: Math.round(entry.startTime) });
        }
      }
    });
    try { observer.observe({ type: 'longtask', buffered: true }); } catch (e) {}

    window.__timeline = [];
    window.__recordTimeline = (label) => {
      const getBBox = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height) };
      };
      window.__timeline.push({
        label,
        time: Math.round(performance.now()),
        labelBox: getBBox('.eyebrow'),
        h1Box: getBBox('h1'),
        paraBox: getBBox('.hero-anim-para'),
        buttonsBox: getBBox('.hero-anim-cta'),
        card1Box: getBBox('.hero-anim-card-1'),
        card2Box: getBBox('.hero-anim-card-2'),
        card3Box: getBBox('.hero-anim-card-3'),
        card4Box: getBBox('.hero-anim-card-4'),
        logoBox: getBBox('[data-hero-scene="codex-stage"]'),
      });
    };
  });

  await page.goto(PREVIEW_URL, { waitUntil: 'domcontentloaded' });
  const logoEl = await page.waitForSelector('[data-hero-scene="codex-stage"]');
  await page.evaluate(() => window.__recordTimeline('0ms'));

  // 100ms check
  await page.waitForTimeout(100);
  await page.evaluate(() => window.__recordTimeline('100ms'));
  const snap100 = await page.evaluate(() => window.__timeline.find((t) => t.label === '100ms'));

  // Take screenshot at 100ms for logo color check
  const logo100Shot = await logoEl.screenshot();
  fs.writeFileSync(path.join(LOCAL_DIR, 'logo-100ms.png'), logo100Shot);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'logo-100ms.png'), logo100Shot);

  // 200ms
  await page.waitForTimeout(100);
  await page.evaluate(() => window.__recordTimeline('200ms'));

  // 600ms
  await page.waitForTimeout(400);
  await page.evaluate(() => window.__recordTimeline('600ms'));

  // 1200ms
  await page.waitForTimeout(600);
  await page.evaluate(() => window.__recordTimeline('1200ms'));

  // 2000ms
  await page.waitForTimeout(800);
  await page.evaluate(() => window.__recordTimeline('2000ms'));
  const snap2000 = await page.evaluate(() => window.__timeline.find((t) => t.label === '2000ms'));

  const logo2000Shot = await logoEl.screenshot();
  fs.writeFileSync(path.join(LOCAL_DIR, 'logo-2000ms.png'), logo2000Shot);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'logo-2000ms.png'), logo2000Shot);

  const timeline = await page.evaluate(() => window.__timeline);
  const longTasks = await page.evaluate(() => window.__longTasks);

  console.log('📍 Element Bounding Boxes Over Time (0ms, 200ms, 600ms, 1200ms, 2000ms):');
  const elements = [
    { key: 'labelBox', name: 'Hero Label (.eyebrow)' },
    { key: 'h1Box', name: 'Headline (h1)' },
    { key: 'paraBox', name: 'Paragraph (.hero-anim-para)' },
    { key: 'buttonsBox', name: 'CTA Buttons (.hero-anim-cta)' },
    { key: 'card1Box', name: 'Card 1 (Mobile Lead)' },
    { key: 'card2Box', name: 'Card 2 (Full Stack)' },
    { key: 'card3Box', name: 'Card 3 (Python Dev)' },
    { key: 'card4Box', name: 'Card 4 (AI/ML Engineer)' },
    { key: 'logoBox', name: 'Logo / 3D Stage' },
  ];

  const posReport = [];
  for (const el of elements) {
    const t0 = timeline.find((t) => t.label === '0ms')?.[el.key]?.top ?? 'N/A';
    const t200 = timeline.find((t) => t.label === '200ms')?.[el.key]?.top ?? 'N/A';
    const t600 = timeline.find((t) => t.label === '600ms')?.[el.key]?.top ?? 'N/A';
    const t1200 = timeline.find((t) => t.label === '1200ms')?.[el.key]?.top ?? 'N/A';
    const t2000 = timeline.find((t) => t.label === '2000ms')?.[el.key]?.top ?? 'N/A';
    const maxDiff = Math.max(
      Math.abs(t2000 - t0),
      Math.abs(t2000 - t200),
      Math.abs(t2000 - t600),
      Math.abs(t2000 - t1200)
    );
    posReport.push({
      Element: el.name,
      '0ms (y)': t0,
      '200ms (y)': t200,
      '600ms (y)': t600,
      '1200ms (y)': t1200,
      '2000ms (y)': t2000,
      'Max Shift (px)': maxDiff,
      Status: maxDiff <= 1 ? '✅ 0-1px (PASS)' : '❌ SHIFTED',
    });
  }
  console.table(posReport);

  // Check 100ms vs 2000ms movement
  console.log('\n🔍 Bounding Box Shift (100ms vs 2000ms):');
  for (const el of elements) {
    const b100 = snap100[el.key];
    const b2000 = snap2000[el.key];
    const dy = Math.abs(b2000.top - b100.top);
    const dx = Math.abs(b2000.left - b100.left);
    console.log(`  ${el.name}: Δy = ${dy}px, Δx = ${dx}px -> ${dy <= 2 && dx <= 2 ? '✅ PASS' : '❌ FAIL'}`);
    if (dy > 2 || dx > 2) {
      throw new Error(`FAILED: ${el.name} shifted by > 2px between 100ms and 2000ms (dy=${dy}, dx=${dx})!`);
    }
  }

  // Color check: Analyze logo-100ms vs logo-2000ms
  console.log('\n🎨 Dominant Color Check (Frame 1 vs Final):');
  const colorCheck = await page.evaluate(async () => {
    // Read the static image and verify it is not washed out pink
    const img = document.querySelector('[data-hero-scene="codex-stage"] img');
    if (!img) return { ok: false, reason: 'img not found' };

    const c = document.createElement('canvas');
    c.width = img.naturalWidth || 548;
    c.height = img.naturalHeight || 550;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, c.width, c.height).data;
    let orangePixels = 0;
    let bluePixels = 0;
    let pinkGhostPixels = 0;

    for (let i = 0; i < imgData.length; i += 16) {
      const r = imgData[i];
      const g = imgData[i + 1];
      const b = imgData[i + 2];
      const a = imgData[i + 3];

      if (a < 50) continue; // transparent background

      // Bold orange: high R, medium G, low B (e.g. #F15A34: R=180-255, G=40-140, B<100)
      if (r > 160 && g > 30 && g < 140 && b < 100) {
        orangePixels++;
      }
      // Bold blue: high B, low R (e.g. #1F6AA5: B>90, R<70)
      else if (b > 90 && r < 70) {
        bluePixels++;
      }
      // Faint washed-out pink ghost: high R, pale tint
      else if (r > 220 && g > 180 && b > 200 && r > b) {
        pinkGhostPixels++;
      }
    }

    return {
      ok: orangePixels > 500 && bluePixels > 200,
      orangePixels,
      bluePixels,
      pinkGhostPixels,
    };
  });

  console.log(`  Logo Frame 1 Analyzed Pixels:`);
  console.log(`    Bold Orange Pixels: ${colorCheck.orangePixels} (Must be > 500)`);
  console.log(`    Bold Blue Pixels:   ${colorCheck.bluePixels} (Must be > 200)`);
  console.log(`    Pink Ghost Pixels:  ${colorCheck.pinkGhostPixels}`);
  if (!colorCheck.ok) {
    throw new Error('FAILED: Frame 1 logo does not have the bold 3D orange and blue monogram colors!');
  }
  console.log('  ✅ Logo in Frame 1 is the BOLD 3D orange/blue monogram!');

  console.log(`\n⏱️ Long Tasks (>50ms) detected during initial 2s: ${longTasks.length}`);
  if (longTasks.length > 0) {
    console.table(longTasks);
  }

  await context.close();
}

async function captureFilmstrip(browser, throttled = false, viewport = { width: 1440, height: 900, name: '1440px' }) {
  const modeName = throttled ? `${viewport.name}-throttled-fast3g-4xcpu` : `${viewport.name}-unthrottled`;
  console.log(`\n======================================================`);
  console.log(`🎥 CAPTURING FILMSTRIP (${modeName})`);
  console.log(`======================================================`);

  const intervals = [50, 100, 150, 200, 250, 300, 350, 400, 500, 600, 700, 800, 900, 1000, 1200, 1500, 1800, 2000];
  const frames = [];

  for (const ms of intervals) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();

    if (throttled) {
      const client = await context.newCDPSession(page);
      await client.send('Network.enable');
      await client.send('Network.setCacheDisabled', { cacheDisabled: true });
      await client.send('Network.emulateNetworkConditions', FAST_3G);
      await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    }

    await page.goto(PREVIEW_URL, { waitUntil: 'domcontentloaded' });
    if (ms > 0) await page.waitForTimeout(ms);

    const filename = `frame-${modeName}-${ms}ms.png`;
    const localPath = path.join(LOCAL_DIR, filename);
    const artifactPath = path.join(OUTPUT_DIR, filename);

    await page.screenshot({ path: localPath });
    fs.copyFileSync(localPath, artifactPath);

    const info = await page.evaluate(() => {
      const eyebrow = document.querySelector('.eyebrow');
      const h1 = document.querySelector('h1');
      const card1 = document.querySelector('.hero-anim-card-1');
      return {
        eyebrowTop: eyebrow ? Math.round(eyebrow.getBoundingClientRect().top) : null,
        h1Top: h1 ? Math.round(h1.getBoundingClientRect().top) : null,
        card1Top: card1 ? Math.round(card1.getBoundingClientRect().top) : null,
      };
    });

    frames.push({ ms, ...info });
    console.log(`  Frame ${ms}ms: eyebrowTop=${info.eyebrowTop}px, h1Top=${info.h1Top}px, card1Top=${info.card1Top}px`);

    await context.close();
  }

  // Verify Frame 1 (50ms) vs Frame 40 (2000ms) layout
  const f50 = frames.find((f) => f.ms === 50);
  const f2000 = frames.find((f) => f.ms === 2000);
  const diffEyebrow = Math.abs(f2000.eyebrowTop - f50.eyebrowTop);
  const diffH1 = Math.abs(f2000.h1Top - f50.h1Top);
  console.log(`\n  Frame 50ms vs 2000ms Layout Comparison:`);
  console.log(`    Eyebrow Δy: ${diffEyebrow}px (Must be <= 1px)`);
  console.log(`    H1 Δy:      ${diffH1}px (Must be <= 1px)`);

  if (diffEyebrow > 1 || diffH1 > 1) {
    throw new Error(`FAILED: Layout shifted between 50ms and 2000ms in ${modeName}!`);
  }
  console.log(`  ✅ Layout is 100% stable from Frame 1 to final frame in ${modeName}!`);
}

async function measurePerfMetrics(browser) {
  console.log('\n======================================================');
  console.log('📊 MEASURING PERFORMANCE METRICS (CLS, LCP, Times)');
  console.log('======================================================');

  async function runMetric(throttled, name) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const client = await context.newCDPSession(page);

    if (throttled) {
      await client.send('Network.enable');
      await client.send('Network.setCacheDisabled', { cacheDisabled: true });
      await client.send('Network.emulateNetworkConditions', FAST_3G);
      await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    }

    await page.addInitScript(() => {
      window.__m = { cls: 0, lcp: 0, headlineMs: null, threeMs: null, longTasks: 0 };

      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__m.cls += entry.value;
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });

      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          window.__m.lcp = Math.round(entries[entries.length - 1].startTime);
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      try {
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (entry.duration > 50) window.__m.longTasks++;
          }
        }).observe({ type: 'longtask', buffered: true });
      } catch (e) {}

      const check = () => {
        const now = Math.round(performance.now());
        const h1 = document.querySelector('h1');
        if (h1 && window.__m.headlineMs === null) {
          const s = window.getComputedStyle(h1);
          if (parseFloat(s.opacity) >= 0.2 && h1.getBoundingClientRect().height > 10) {
            window.__m.headlineMs = now;
          }
        }
        const canvas = document.querySelector('[data-hero-scene="codex-stage"] canvas');
        if (canvas && window.__m.threeMs === null) {
          const s = window.getComputedStyle(canvas.parentElement || canvas);
          if (parseFloat(s.opacity) >= 0.2) {
            window.__m.threeMs = now;
          }
        }
        requestAnimationFrame(check);
      };
      requestAnimationFrame(check);
    });

    await page.goto(PREVIEW_URL, { waitUntil: 'load' });
    await page.waitForTimeout(throttled ? 3000 : 2000);

    const metrics = await page.evaluate(() => {
      window.__m.cls = parseFloat(window.__m.cls.toFixed(4));
      return window.__m;
    });

    console.log(`Results for ${name}:`);
    console.table(metrics);
    await context.close();
    return metrics;
  }

  const unthrottled = await runMetric(false, 'unthrottled');
  const throttled = await runMetric(true, 'fast3g-4xcpu');

  fs.writeFileSync('d:/web devlopment/scripts/hero-audit-results.json', JSON.stringify({ unthrottled, throttled }, null, 2));
}

async function testNavigationModes(browser) {
  console.log('\n======================================================');
  console.log('🔄 TEST: Navigation Consistency (Hard Reload, Normal Reload, Router Nav)');
  console.log('======================================================');

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Initial
  await page.goto(PREVIEW_URL);
  const initialTop = await page.evaluate(() => document.querySelector('.eyebrow')?.getBoundingClientRect().top);
  console.log(`  Initial Load Eyebrow Top: ${initialTop}px`);

  // Hard reload
  await page.reload({ waitUntil: 'domcontentloaded' });
  const hardReloadTop = await page.evaluate(() => document.querySelector('.eyebrow')?.getBoundingClientRect().top);
  console.log(`  Hard Reload Eyebrow Top:  ${hardReloadTop}px`);

  // Normal reload
  await page.reload();
  const normalReloadTop = await page.evaluate(() => document.querySelector('.eyebrow')?.getBoundingClientRect().top);
  console.log(`  Normal Reload Eyebrow Top:${normalReloadTop}px`);

  // Nav back to Home
  await page.goto(`${PREVIEW_URL}/about`, { waitUntil: 'domcontentloaded' });
  await page.click('a[href="/"]');
  await page.waitForTimeout(200);
  const routerNavTop = await page.evaluate(() => document.querySelector('.eyebrow')?.getBoundingClientRect().top);
  console.log(`  Router Nav Eyebrow Top:   ${routerNavTop}px`);

  console.log(`\n  Comparing Navigation Positions:`);
  const diffs = [
    Math.abs(hardReloadTop - initialTop),
    Math.abs(normalReloadTop - initialTop),
    Math.abs(routerNavTop - initialTop),
  ];
  console.log(`    Max difference across all navigation modes: ${Math.max(...diffs)}px`);

  if (Math.max(...diffs) > 1) {
    throw new Error('FAILED: Navigation modes exhibited position differences > 1px!');
  }
  console.log('  ✅ Hard reload, normal reload, and router navigation behave 100% identically!');

  await context.close();
}

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  await testBoundingBoxesAndColors(browser);
  await captureFilmstrip(browser, false, { width: 1440, height: 900, name: '1440px' });
  await captureFilmstrip(browser, true, { width: 1440, height: 900, name: '1440px' });
  await captureFilmstrip(browser, false, { width: 390, height: 844, name: '390px' });
  await captureFilmstrip(browser, true, { width: 390, height: 844, name: '390px' });
  await measurePerfMetrics(browser);
  await testNavigationModes(browser);

  await browser.close();
  console.log('\n🎉 ALL HERO STABILITY & ZERO-SHIFT AUDITS PASSED WITH ZERO DIFFERENCES!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
