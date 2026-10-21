import { chromium } from '@playwright/test';

async function runClippingAudit() {
  console.log('📐 Starting Comprehensive Clipping & Overflow Inspection...');

  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl'] });

  const viewports = [
    { width: 1920, height: 1080, name: '1920px' },
    { width: 1440, height: 900, name: '1440px' },
    { width: 768, height: 1024, name: '768px' },
    { width: 390, height: 844, name: '390px' }
  ];

  const routes = [
    '/',
    '/about',
    '/services/job-placement',
    '/careers',
    '/contact'
  ];

  const results = [];

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const route of routes) {
      await page.goto('http://localhost:5173' + route);
      await page.waitForTimeout(500);

      const inspection = await page.evaluate((isHome) => {
        const bodyScrollWidth = document.body.scrollWidth;
        const htmlScrollWidth = document.documentElement.scrollWidth;
        const innerWidth = window.innerWidth;
        const hasHorizontalOverflow = htmlScrollWidth > innerWidth || bodyScrollWidth > innerWidth;

        // Check 3D hero stage soft fade mask if on home route
        let heroFadeMaskDetected = false;
        if (isHome) {
          const heroCanvasWrapper = document.querySelector('[data-hero-scene="codex-stage"] > div');
          if (heroCanvasWrapper) {
            const style = window.getComputedStyle(heroCanvasWrapper);
            const mask = style.maskImage || style.webkitMaskImage || '';
            heroFadeMaskDetected = mask.includes('linear-gradient') || mask.includes('gradient');
          }
        }

        // Find clipped text or contents
        const allElements = Array.from(document.querySelectorAll('h1, h2, h3, h4, p, a, button, section, div.container-custom'));
        const clipped = [];
        for (const el of allElements) {
          if (el.offsetParent === null) continue;
          const style = window.getComputedStyle(el);
          // Check if text is clipped unintentionally (excluding intentional marquee / carousel)
          if (style.overflow === 'hidden' || style.overflowX === 'hidden' || style.overflow === 'clip') {
            const isMarquee = el.closest('.marquee') || el.closest('[data-marquee]');
            if (!isMarquee && el.scrollWidth > el.clientWidth + 5 && el.clientWidth > 0) {
              clipped.push({
                tag: el.tagName,
                cls: el.className.slice(0, 30),
                scrollWidth: el.scrollWidth,
                clientWidth: el.clientWidth
              });
            }
          }
        }

        return {
          hasHorizontalOverflow,
          htmlScrollWidth,
          innerWidth,
          heroFadeMaskDetected,
          clippedCount: clipped.length,
          clippedSamples: clipped.slice(0, 3)
        };
      }, route === '/');

      results.push({
        viewport: vp.name,
        route,
        overflow: inspection.hasHorizontalOverflow ? `❌ ${inspection.htmlScrollWidth}px > ${inspection.innerWidth}px` : '✅ 0px (No overflow)',
        heroFadeMask: route === '/' ? (inspection.heroFadeMaskDetected ? '✅ Smooth gradient fade' : '❌ Hard edge') : 'N/A',
        clippedElements: inspection.clippedCount === 0 ? '✅ 0 clipped' : `⚠️ ${inspection.clippedCount} clipped`
      });
    }
    await page.close();
  }

  console.table(results);
  await browser.close();
  return results;
}

runClippingAudit().catch(console.error);
