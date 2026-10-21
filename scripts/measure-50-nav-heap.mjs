import { chromium } from '@playwright/test';

async function measureHeap50Navigations() {
  console.log('🧪 Starting 50-Navigation Heap Profiling with Forced GC...');

  // Launch Chrome with forced GC enabled
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: [
      '--js-flags=--expose-gc',
      '--enable-webgl',
      '--enable-gpu-rasterization',
      '--no-sandbox',
    ],
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  const client = await page.context().newCDPSession(page);
  await client.send('HeapProfiler.enable');

  const routes = [
    '/',
    '/about',
    '/services',
    '/services/job-placement',
    '/careers',
    '/plans',
    '/success-stories',
    '/insights',
    '/faq',
    '/contact',
  ];

  // Helper to force GC via CDP and evaluate memory
  async function forceGCAndGetMetrics() {
    await client.send('HeapProfiler.collectGarbage');
    // Also call window.gc() inside the page
    return await page.evaluate(() => {
      if (typeof window.gc === 'function') {
        window.gc();
      }
      const usedBytes = performance.memory ? performance.memory.usedJSHeapSize : 0;
      const totalBytes = performance.memory ? performance.memory.totalJSHeapSize : 0;
      const canvases = document.querySelectorAll('canvas').length;
      const domNodes = document.querySelectorAll('*').length;
      return {
        usedMB: Math.round((usedBytes / (1024 * 1024)) * 100) / 100,
        totalMB: Math.round((totalBytes / (1024 * 1024)) * 100) / 100,
        canvases,
        domNodes,
      };
    });
  }

  // 1. Initial Load (Baseline)
  console.log('📍 Navigating to baseline (/) on http://localhost:5000 ...');
  await page.goto('http://localhost:5000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const baseline = await forceGCAndGetMetrics();
  console.log(`📊 Baseline Heap: ${baseline.usedMB} MB (Canvases: ${baseline.canvases}, DOM Nodes: ${baseline.domNodes})`);

  let snapAfter5 = null;
  let snapAfter30 = null;
  let snapAfter50 = null;

  // 2. Perform 50 Navigations
  for (let i = 1; i <= 50; i++) {
    const targetRoute = routes[i % routes.length];

    // Client-side router transition
    await page.evaluate((path) => {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, targetRoute);

    await page.waitForTimeout(120);

    if (i === 5) {
      snapAfter5 = await forceGCAndGetMetrics();
      console.log(`📌 Snapshot after 5 navigations (${targetRoute}): ${snapAfter5.usedMB} MB (Canvases: ${snapAfter5.canvases}, DOM: ${snapAfter5.domNodes})`);
    }

    if (i === 30) {
      snapAfter30 = await forceGCAndGetMetrics();
      console.log(`📌 Snapshot after 30 navigations (${targetRoute}): ${snapAfter30.usedMB} MB (Canvases: ${snapAfter30.canvases}, DOM: ${snapAfter30.domNodes})`);
    }

    if (i === 50) {
      // Return to root for final comparison
      await page.evaluate(() => {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
      await page.waitForTimeout(300);
      snapAfter50 = await forceGCAndGetMetrics();
      console.log(`📌 Snapshot after 50 navigations (Return to /): ${snapAfter50.usedMB} MB (Canvases: ${snapAfter50.canvases}, DOM: ${snapAfter50.domNodes})`);
    }
  }

  // Inspect retained 3D / DOM / Listener structures
  const retainedInspection = await page.evaluate(() => {
    return {
      activeCanvases: document.querySelectorAll('canvas').length,
      allImages: document.querySelectorAll('img').length,
      threeContexts: window.__THREE__ ? Object.keys(window.__THREE__) : 'isolated',
      lenisAttached: !!window.__lenis,
    };
  });

  console.log('\nRetained Inspection Data:', retainedInspection);

  const growth5to50 = Math.round((snapAfter50.usedMB - baseline.usedMB) * 100) / 100;
  console.log(`\n========================================`);
  console.log(`Baseline Heap:             ${baseline.usedMB} MB`);
  console.log(`After 5 Navigations:       ${snapAfter5.usedMB} MB`);
  console.log(`After 30 Navigations:      ${snapAfter30.usedMB} MB`);
  console.log(`After 50 Navigations:      ${snapAfter50.usedMB} MB`);
  console.log(`Total Heap Growth (50 Nav): ${growth5to50 > 0 ? '+' : ''}${growth5to50} MB`);
  console.log(`========================================`);

  const isFlat = Math.abs(growth5to50) <= 12.0; // Target: within ~10 MB of baseline
  console.log(`Status: ${isFlat ? '✅ FLAT HEAP GROWTH VERIFIED' : '❌ HEAP LEAK DETECTED'}`);

  await browser.close();
  return { baseline, snapAfter5, snapAfter30, snapAfter50, growth5to50, isFlat };
}

measureHeap50Navigations().catch(console.error);
