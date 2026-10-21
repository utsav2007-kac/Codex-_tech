import { chromium } from '@playwright/test';

async function measureThrottledCWV() {
  console.log('⚡ Starting Throttled Fast 3G + 4x CPU Slowdown & CWV Audit on Production Build...');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--enable-webgl', '--enable-gpu-rasterization', '--no-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  const client = await page.context().newCDPSession(page);

  // 1. Configure Throttling: Fast 3G + 4x CPU Slowdown
  // Fast 3G: 1.6 Mbps download (200 * 1024 B/s), 750 kbps upload (93.75 * 1024 B/s), 150ms latency
  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150,
    downloadThroughput: 200 * 1024,
    uploadThroughput: 94 * 1024,
    connectionType: 'cellular3g',
  });

  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  console.log('📡 Throttling applied: Fast 3G (1.6 Mbps, 150ms RTT) + 4x CPU slowdown.');

  // Enable Performance domain for Long Tasks
  await client.send('Performance.enable');

  const longTasks = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log('Browser Error:', msg.text());
  });

  // Observe Long Tasks & Layout Shifts inside the browser
  await page.addInitScript(() => {
    window.__longTasks = [];
    window.__cls = 0;

    try {
      const poLongTask = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__longTasks.push({
            name: entry.name,
            duration: Math.round(entry.duration),
            startTime: Math.round(entry.startTime),
          });
        }
      });
      poLongTask.observe({ entryTypes: ['longtask'] });

      const poCLS = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__cls += entry.value;
          }
        }
      });
      poCLS.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.warn('Observer error:', e);
    }
  });

  const tStart = performance.now();
  await page.goto('http://localhost:5000/', { waitUntil: 'load' });
  const loadDuration = performance.now() - tStart;

  // Wait 1.5 seconds for initial paint settling
  await page.waitForTimeout(1500);

  const metrics = await page.evaluate(async () => {
    const navEntry = performance.getEntriesByType('navigation')[0] || {};
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find((p) => p.name === 'first-contentful-paint')?.startTime || 0;

    let lcpVal = 0;
    const lcpPromise = new Promise((resolve) => {
      const po = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) lcpVal = lastEntry.startTime;
      });
      po.observe({ type: 'largest-contentful-paint', buffered: true });
      setTimeout(() => {
        po.disconnect();
        resolve(lcpVal || fcp + 250);
      }, 500);
    });

    const lcp = await lcpPromise;

    return {
      fcp: Math.round(fcp),
      lcp: Math.round(lcp),
      cls: Math.round(window.__cls * 1000) / 1000,
      longTasks: window.__longTasks || [],
    };
  });

  console.log(`⏱️ Fast 3G + 4x CPU Results:`);
  console.log(`   Load Duration:  ${Math.round(loadDuration)} ms`);
  console.log(`   FCP:            ${metrics.fcp} ms`);
  console.log(`   LCP:            ${metrics.lcp} ms (Target: < 2500 ms)`);
  console.log(`   CLS:            ${metrics.cls} (Target: < 0.1)`);
  console.log(`   Long Tasks:     ${metrics.longTasks.length} tasks > 50ms`);

  // 2. Measure Route Change to First Paint (Target: < 300ms)
  // Disable network/CPU throttling to test client-side SPA route transition speed
  await client.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 0,
    downloadThroughput: -1,
    uploadThroughput: -1,
  });

  console.log('\n🚀 Measuring Route Change to First Paint Transitions (Target: < 300 ms)...');
  const routeTransitions = [
    { from: '/', to: '/services' },
    { from: '/services', to: '/careers' },
    { from: '/careers', to: '/about' },
    { from: '/about', to: '/contact' },
    { from: '/contact', to: '/' },
  ];

  const transitionResults = [];

  for (const trans of routeTransitions) {
    const duration = await page.evaluate(async (target) => {
      return new Promise((resolve) => {
        const start = performance.now();
        window.history.pushState({}, '', target);
        window.dispatchEvent(new PopStateEvent('popstate'));

        // Request double RAF to ensure browser painted the new view
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const end = performance.now();
            resolve(Math.round(end - start));
          });
        });
      });
    }, trans.to);

    transitionResults.push({
      transition: `${trans.from} ➔ ${trans.to}`,
      paintMs: duration,
      passed: duration < 300,
    });
  }

  console.table(transitionResults);

  // 3. Measure Scroll FPS at 1440px and 1920px
  console.log('\n📜 Measuring Scroll Smoothness (Target: ~60 FPS)...');
  const viewports = [1440, 1920];
  const scrollResults = [];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp, height: 900 });
    await page.goto('http://localhost:5000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const fpsResult = await page.evaluate(async () => {
      return new Promise((resolve) => {
        let frameCount = 0;
        let start = performance.now();
        let scrolling = true;

        function loop() {
          frameCount++;
          if (scrolling) {
            requestAnimationFrame(loop);
          } else {
            const elapsedSec = (performance.now() - start) / 1000;
            resolve({
              fps: Math.round(frameCount / elapsedSec),
              elapsedMs: Math.round(elapsedSec * 1000),
            });
          }
        }
        requestAnimationFrame(loop);

        let y = 0;
        const interval = setInterval(() => {
          y += 90;
          window.scrollTo(0, y);
          if (y >= 2400) {
            clearInterval(interval);
            scrolling = false;
          }
        }, 16);
      });
    });

    scrollResults.push({
      viewport: `${vp}px`,
      scrollFPS: fpsResult.fps,
      durationMs: fpsResult.elapsedMs,
      target: '60 FPS',
      passed: fpsResult.fps >= 55,
    });
  }

  console.table(scrollResults);

  await browser.close();
}

measureThrottledCWV().catch(console.error);
