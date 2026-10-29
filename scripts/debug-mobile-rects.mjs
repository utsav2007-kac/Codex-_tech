import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  await page.addInitScript(() => {
    window.__checks = [];
    const record = (label) => {
      const h1 = document.querySelector('h1');
      const eyebrow = document.querySelector('.eyebrow');
      const para = document.querySelector('.hero-anim-para');
      const line1 = document.querySelector('.hero-anim-line-1');
      const line2 = document.querySelector('.hero-anim-line-2');
      window.__checks.push({
        label,
        time: Math.round(performance.now()),
        eyebrow: eyebrow ? { top: eyebrow.getBoundingClientRect().top, height: eyebrow.getBoundingClientRect().height } : null,
        h1: h1 ? { top: h1.getBoundingClientRect().top, height: h1.getBoundingClientRect().height } : null,
        line1: line1 ? { top: line1.getBoundingClientRect().top, height: line1.getBoundingClientRect().height } : null,
        line2: line2 ? { top: line2.getBoundingClientRect().top, height: line2.getBoundingClientRect().height } : null,
        para: para ? { top: para.getBoundingClientRect().top, height: para.getBoundingClientRect().height } : null,
      });
    };

    document.addEventListener('DOMContentLoaded', () => record('DOMContentLoaded'));
  });

  await page.goto('http://localhost:4173/', { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  const checks = await page.evaluate(() => {
    const record = (label) => {
      const h1 = document.querySelector('h1');
      const eyebrow = document.querySelector('.eyebrow');
      const para = document.querySelector('.hero-anim-para');
      const line1 = document.querySelector('.hero-anim-line-1');
      const line2 = document.querySelector('.hero-anim-line-2');
      return {
        label,
        time: Math.round(performance.now()),
        eyebrow: eyebrow ? { top: eyebrow.getBoundingClientRect().top, height: eyebrow.getBoundingClientRect().height } : null,
        h1: h1 ? { top: h1.getBoundingClientRect().top, height: h1.getBoundingClientRect().height } : null,
        line1: line1 ? { top: line1.getBoundingClientRect().top, height: line1.getBoundingClientRect().height } : null,
        line2: line2 ? { top: line2.getBoundingClientRect().top, height: line2.getBoundingClientRect().height } : null,
        para: para ? { top: para.getBoundingClientRect().top, height: para.getBoundingClientRect().height } : null,
      };
    };
    window.__checks.push(record('Settled 1500ms'));
    return window.__checks;
  });

  console.log('Mobile 390px Element Rects:');
  console.table(checks.map(c => ({
    label: c.label,
    time: c.time,
    eyebrowTop: c.eyebrow?.top,
    h1Top: c.h1?.top,
    h1Height: c.h1?.height,
    line1Top: c.line1?.top,
    line2Top: c.line2?.top,
    paraTop: c.para?.top,
  })));

  await browser.close();
})();
