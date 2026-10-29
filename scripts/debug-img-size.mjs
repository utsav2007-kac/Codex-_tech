import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4173/', { waitUntil: 'load' });
  const debug = await page.evaluate(() => {
    const img = document.querySelector('[data-hero-scene="codex-stage"] picture img');
    if (!img) return 'not found';
    const s = window.getComputedStyle(img);
    const p = img.parentElement;
    const gp = p ? p.parentElement : null;
    const ggp = gp ? gp.parentElement : null;
    const matchedRules = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText && img.matches(rule.selectorText)) {
            matchedRules.push({ selector: rule.selectorText, cssText: rule.cssText });
          }
        }
      } catch (e) {}
    }

    return {
      matchedRules,
      img: {
        src: img.src,
        alt: img.alt,
        width: s.width,
        height: s.height,
        className: img.className,
        rect: img.getBoundingClientRect(),
      },
    };
  });
  console.log(JSON.stringify(debug, null, 2));
  await browser.close();
})();
