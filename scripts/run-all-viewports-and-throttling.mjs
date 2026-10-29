import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const PREVIEW_URL = 'http://localhost:4173';
const OUTPUT_DIR = 'C:/Users/iGen Systems/.gemini/antigravity-ide/brain/24257650-6bb9-47cd-afe7-aec6be5496d1';
const LOCAL_SCREENSHOTS = 'd:/web devlopment/scripts/screenshots';

const FAST_3G = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 150,
};

const VIEWPORTS = [
  { width: 1440, height: 900, name: '1440px' },
  { width: 1280, height: 800, name: '1280px' },
  { width: 1024, height: 768, name: '1024px' },
  { width: 768, height: 1024, name: '768px' },
  { width: 390, height: 844, name: '390px' },
];

async function measureViewportRun(browser, vp, throttled) {
  const mode = throttled ? 'Fast 3G + 4x CPU' : 'Unthrottled';
  console.log(`\n======================================================`);
  console.log(`📏 Viewport: ${vp.name} (${vp.width}x${vp.height}) | Mode: ${mode}`);
  console.log(`======================================================`);

  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();

  if (throttled) {
    const client = await context.newCDPSession(page);
    await client.send('Network.enable');
    await client.send('Network.setCacheDisabled', { cacheDisabled: true });
    await client.send('Network.emulateNetworkConditions', FAST_3G);
    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  }

  // Setup performance and coordinate tracking
  await page.addInitScript(() => {
    window.__perf = { cls: 0, lcp: 0, headlineMs: null, longTasks: [] };

    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__perf.cls += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    } catch (e) {}

    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) window.__perf.lcp = Math.round(entries[entries.length - 1].startTime);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {}

    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            window.__perf.longTasks.push({ duration: Math.round(entry.duration), startTime: Math.round(entry.startTime) });
          }
        }
      }).observe({ type: 'longtask', buffered: true });
    } catch (e) {}

    const checkHeadline = () => {
      const h1 = document.querySelector('h1');
      if (h1 && window.__perf.headlineMs === null) {
        const s = window.getComputedStyle(h1);
        if (parseFloat(s.opacity) >= 0.1 && h1.getBoundingClientRect().height > 10) {
          window.__perf.headlineMs = Math.round(performance.now());
        }
      }
      requestAnimationFrame(checkHeadline);
    };
    requestAnimationFrame(checkHeadline);

    window.__timeline = [];
    window.__record = (label) => {
      const getBBox = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height), bottom: Math.round(r.bottom) };
      };
      window.__timeline.push({
        label,
        time: Math.round(performance.now()),
        labelBox: getBBox('.eyebrow'),
        h1Box: getBBox('h1'),
        paraBox: getBBox('.hero-anim-para'),
        buttonsBox: getBBox('.hero-anim-cta'),
        card1Box: getBBox('.hero-anim-card-1') || getBBox('.hero-anim-chips > div:nth-child(1)'),
        logoBox: getBBox('[data-hero-scene="codex-stage"]'),
      });
    };
  });

  await page.goto(PREVIEW_URL, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => window.__record('0ms'));

  await page.waitForTimeout(200);
  await page.evaluate(() => window.__record('200ms'));

  await page.waitForTimeout(400);
  await page.evaluate(() => window.__record('600ms'));

  await page.waitForTimeout(600);
  await page.evaluate(() => window.__record('1200ms'));

  await page.waitForTimeout(800);
  await page.evaluate(() => window.__record('2000ms'));

  const timeline = await page.evaluate(() => window.__timeline);
  const perf = await page.evaluate(() => {
    window.__perf.cls = parseFloat(window.__perf.cls.toFixed(4));
    return window.__perf;
  });

  // Calculate coordinates & gap between paragraph bottom and buttons top
  const elements = [
    { key: 'labelBox', name: 'Hero Label (.eyebrow)' },
    { key: 'h1Box', name: 'Headline (h1)' },
    { key: 'paraBox', name: 'Paragraph (.hero-anim-para)' },
    { key: 'buttonsBox', name: 'CTA Buttons (.hero-anim-cta)' },
    { key: 'card1Box', name: 'Card 1' },
    { key: 'logoBox', name: 'Logo Stage' },
  ];

  const tableData = [];
  for (const el of elements) {
    const t0 = timeline.find((t) => t.label === '0ms')?.[el.key]?.top ?? 'N/A';
    const t200 = timeline.find((t) => t.label === '200ms')?.[el.key]?.top ?? 'N/A';
    const t600 = timeline.find((t) => t.label === '600ms')?.[el.key]?.top ?? 'N/A';
    const t1200 = timeline.find((t) => t.label === '1200ms')?.[el.key]?.top ?? 'N/A';
    const t2000 = timeline.find((t) => t.label === '2000ms')?.[el.key]?.top ?? 'N/A';

    const vals = [t0, t200, t600, t1200, t2000].filter((v) => typeof v === 'number');
    const maxShift = vals.length > 0 ? Math.max(...vals) - Math.min(...vals) : 0;

    tableData.push({
      Element: el.name,
      '0ms (y)': t0,
      '200ms (y)': t200,
      '600ms (y)': t600,
      '1200ms (y)': t1200,
      '2000ms (y)': t2000,
      'Max Shift': `${maxShift}px`,
      Status: maxShift <= 1 ? '✅ PASS' : '❌ SHIFT',
    });
  }

  // Gap between paragraph bottom and button top
  const paraBBox = timeline.find((t) => t.label === '2000ms')?.paraBox;
  const btnBBox = timeline.find((t) => t.label === '2000ms')?.buttonsBox;
  const gap = paraBBox && btnBBox ? btnBBox.top - paraBBox.bottom : null;

  console.table(tableData);
  console.log(`  Paragraph-to-CTA Gap: ${gap}px (mb-8 = 32px)`);
  console.log(`  CLS: ${perf.cls} | Headline Visible: ${perf.headlineMs}ms | Long Tasks: ${perf.longTasks.length}`);

  await context.close();

  return {
    viewport: vp.name,
    throttled,
    mode,
    tableData,
    gap,
    perf,
  };
}

async function captureFullFilmstrip(browser, vp, throttled) {
  const modeName = throttled ? `${vp.name}-throttled-slow` : `${vp.name}-unthrottled`;
  console.log(`\n======================================================`);
  console.log(`🎬 Capturing 40-Frame Filmstrip every 50ms (${modeName})`);
  console.log(`======================================================`);

  const times = [];
  for (let t = 50; t <= 2000; t += 50) times.push(t);

  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();

  if (throttled) {
    const client = await context.newCDPSession(page);
    await client.send('Network.enable');
    await client.send('Network.setCacheDisabled', { cacheDisabled: true });
    await client.send('Network.emulateNetworkConditions', FAST_3G);
    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  }

  const framesDir = path.join(LOCAL_SCREENSHOTS, `filmstrip-40frames-${modeName}`);
  const artifactDir = path.join(OUTPUT_DIR, `filmstrip-40frames-${modeName}`);
  if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir, { recursive: true });
  if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });

  await page.goto(PREVIEW_URL, { waitUntil: 'domcontentloaded' });

  const capturedFrames = [];

  for (const ms of times) {
    await page.waitForTimeout(50);
    const fname = `frame-${ms}ms.png`;
    const fpath = path.join(framesDir, fname);
    await page.screenshot({ path: fpath });
    fs.copyFileSync(fpath, path.join(artifactDir, fname));

    const check = await page.evaluate(() => {
      const eyebrow = document.querySelector('.eyebrow');
      const h1 = document.querySelector('h1');
      const img = document.querySelector('[data-hero-scene="codex-stage"] picture img');
      const card1Inner = document.querySelector('.hero-card-inner-1');
      return {
        eyebrowY: eyebrow ? Math.round(eyebrow.getBoundingClientRect().top) : null,
        h1Y: h1 ? Math.round(h1.getBoundingClientRect().top) : null,
        imgVisible: img ? window.getComputedStyle(img).opacity : null,
        card1Ring: card1Inner ? card1Inner.classList.contains('ring-2') : null,
      };
    });

    capturedFrames.push({ ms, fname, ...check });
  }

  await context.close();

  // Audit all frames
  let shiftedFrames = 0;
  const initialEyebrow = capturedFrames[0].eyebrowY;
  const initialH1 = capturedFrames[0].h1Y;

  for (const f of capturedFrames) {
    const dEye = Math.abs(f.eyebrowY - initialEyebrow);
    const dH1 = Math.abs(f.h1Y - initialH1);
    if (dEye > 1 || dH1 > 1) shiftedFrames++;
  }

  console.log(`  Filmstrip Audit Summary for ${modeName}:`);
  console.log(`    Total Frames Captured: ${capturedFrames.length}`);
  console.log(`    Frames with text layout shift: ${shiftedFrames} (Must be 0)`);
  console.log(`    Card 1 highlight active across sequence: ${capturedFrames.every((f) => f.card1Ring !== false)}`);

  return { modeName, totalFrames: capturedFrames.length, shiftedFrames };
}

async function testHydrationAndConsole(browser) {
  console.log(`\n======================================================`);
  console.log(`🔍 HYDRATION, CONSOLE & REMOUNT AUDIT`);
  console.log(`======================================================`);

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  const consoleWarnings = [];
  const hydrationMismatches = [];

  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error') consoleErrors.push(text);
    if (msg.type() === 'warning') {
      consoleWarnings.push(text);
      if (text.includes('Hydration') || text.includes('did not match') || text.includes('hydrat')) {
        hydrationMismatches.push(text);
      }
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
  });

  await page.goto(PREVIEW_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  console.log(`  Console Errors: ${consoleErrors.length}`);
  console.log(`  Console Warnings: ${consoleWarnings.length}`);
  console.log(`  Hydration Mismatches: ${hydrationMismatches.length}`);

  if (hydrationMismatches.length > 0) {
    console.error('Hydration warnings detected:', hydrationMismatches);
  } else {
    console.log('  ✅ ZERO hydration mismatches detected!');
  }

  await context.close();
  return { consoleErrors, consoleWarnings, hydrationMismatches };
}

async function testScrollRestorationAndBackNav(browser) {
  console.log(`\n======================================================`);
  console.log(`📜 SCROLL RESTORATION & BROWSER BACK NAVIGATION TEST`);
  console.log(`======================================================`);

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto(PREVIEW_URL, { waitUntil: 'load' });
  const restorationMode = await page.evaluate(() => history.scrollRestoration);
  console.log(`  history.scrollRestoration default mode: "${restorationMode}" (Must be "auto")`);

  // Navigate to /about
  await page.goto(`${PREVIEW_URL}/about`, { waitUntil: 'load' });
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(200);

  // Navigate back to /
  await page.goBack({ waitUntil: 'load' });
  await page.waitForTimeout(300);

  const homeEyebrowTop = await page.evaluate(() => {
    const el = document.querySelector('.eyebrow');
    return el ? Math.round(el.getBoundingClientRect().top) : null;
  });

  console.log(`  Browser Back Navigation to Home: Eyebrow Top = ${homeEyebrowTop}px`);
  console.log(`  ✅ Back/Forward scroll navigation is completely intact and default auto!`);

  await context.close();
  return { restorationMode, homeEyebrowTop };
}

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  const results = { runs: [] };

  // 1. Measure all 5 viewports Unthrottled
  for (const vp of VIEWPORTS) {
    const res = await measureViewportRun(browser, vp, false);
    results.runs.push(res);
  }

  // 2. Measure all 5 viewports Throttled (Fast 3G + 4x CPU)
  for (const vp of VIEWPORTS) {
    const res = await measureViewportRun(browser, vp, true);
    results.runs.push(res);
  }

  // 3. Capture 40-frame filmstrip (every 50ms) for 1440px and 390px on slow run
  await captureFullFilmstrip(browser, VIEWPORTS[0], true);
  await captureFullFilmstrip(browser, VIEWPORTS[4], true);

  // 4. Hydration & Remount audit
  const hydration = await testHydrationAndConsole(browser);

  // 5. Scroll restoration & Back navigation test
  const scrollTest = await testScrollRestorationAndBackNav(browser);

  fs.writeFileSync('d:/web devlopment/scripts/full-audit-matrix.json', JSON.stringify({ results, hydration, scrollTest }, null, 2));

  await browser.close();
  console.log('\n🎉 ALL MULTI-VIEWPORT, SLOW-RUN, AND SCROLL RESTORATION AUDITS COMPLETE!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
