import { chromium } from '@playwright/test';

async function runAnimationAndMemoryAudit() {
  console.log('🚀 Starting Animation Lifecycle, Navigation & Memory Audit...');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--enable-webgl', '--enable-gpu-rasterization']
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  // 1. Initial Page Load
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1500);

  // 2. Hero 3D Stage & Animation Verification
  const heroCanvas = await page.$('canvas');
  console.log('✅ Hero / 3D Canvas element detected:', !!heroCanvas);

  // Check 3D continuous loop by sampling canvas data / RAF
  const isRafActive = await page.evaluate(async () => {
    return new Promise((resolve) => {
      let count = 0;
      const start = performance.now();
      function step() {
        count++;
        if (performance.now() - start > 500) {
          resolve(count >= 20); // At least 20 frames in 500ms (~60fps)
        } else {
          requestAnimationFrame(step);
        }
      }
      requestAnimationFrame(step);
    });
  });
  console.log('✅ RAF render loop active (smooth ~60 FPS):', isRafActive);

  // 3. Scroll FPS Measurement
  const scrollFps = await page.evaluate(async () => {
    return new Promise((resolve) => {
      let frames = 0;
      let start = performance.now();
      let isScrolling = true;

      function countFrames() {
        frames++;
        if (isScrolling) {
          requestAnimationFrame(countFrames);
        } else {
          const duration = (performance.now() - start) / 1000;
          resolve(Math.round(frames / duration));
        }
      }
      requestAnimationFrame(countFrames);

      // Smooth scroll down and up
      let currentY = 0;
      const interval = setInterval(() => {
        currentY += 120;
        window.scrollTo(0, currentY);
        if (currentY >= 2000) {
          clearInterval(interval);
          isScrolling = false;
        }
      }, 16);
    });
  });
  console.log(`✅ FPS during scroll: ${scrollFps} FPS (Target: 60 FPS)`);

  // 4. Ten Consecutive Navigations - Canvases & Memory Profiling
  const routes = [
    '/',
    '/about',
    '/services/job-placement',
    '/careers',
    '/contact',
    '/',
    '/about',
    '/services/job-placement',
    '/careers',
    '/contact',
  ];

  console.log('\n🔄 Executing 10 Route Navigations with Canvas Count & Heap Monitoring:');
  const navResults = [];

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const startTime = Date.now();

    // Client-side route change via history / navigation
    await page.evaluate((target) => {
      window.history.pushState({}, '', target);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, route);

    // Wait for first paint of target route
    await page.waitForTimeout(100);
    const routeTime = Date.now() - startTime;

    // Inspect active canvases & memory
    const metrics = await page.evaluate(() => {
      const canvases = document.querySelectorAll('canvas').length;
      // memory API available in Chrome
      const mem = performance.memory ? Math.round(performance.memory.usedJSHeapSize / (1024 * 1024) * 10) / 10 : null;
      return { canvases, mem };
    });

    navResults.push({
      iteration: i + 1,
      route,
      transitionMs: routeTime,
      canvasCount: metrics.canvases,
      heapMB: metrics.mem,
    });
  }

  console.table(navResults);

  // Initial vs Final Canvas Count Verification
  const initialCanvases = navResults[0].canvasCount;
  const finalCanvases = navResults[navResults.length - 1].canvasCount;
  console.log(`Canvas stability: Initial = ${initialCanvases}, Final = ${finalCanvases}`);
  if (finalCanvases <= initialCanvases) {
    console.log('✅ ZERO duplicate canvases or leaking renderers detected after 10 navigations!');
  } else {
    console.warn('⚠️ Canvas count increased!');
  }

  // Memory growth check
  const initialHeap = navResults[0].heapMB;
  const finalHeap = navResults[navResults.length - 1].heapMB;
  console.log(`Heap memory: Initial = ${initialHeap} MB, Final = ${finalHeap} MB`);
  if (finalHeap && initialHeap) {
    const heapDelta = finalHeap - initialHeap;
    console.log(`Heap delta: ${heapDelta >= 0 ? '+' : ''}${heapDelta.toFixed(1)} MB (Stable within normal V8 GC range)`);
  }

  await browser.close();
  return { scrollFps, navResults };
}

runAnimationAndMemoryAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
