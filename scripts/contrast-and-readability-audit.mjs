import { chromium } from '@playwright/test';

// Relative Luminance calculation per WCAG 2.1
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrast(lum1, lum2) {
  const l1 = Math.max(lum1, lum2);
  const l2 = Math.min(lum1, lum2);
  return (l1 + 0.05) / (l2 + 0.05);
}

function parseRgb(colorStr) {
  if (!colorStr) return [255, 255, 255, 1];
  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (match) {
    return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), match[4] !== undefined ? parseFloat(match[4]) : 1];
  }
  return [255, 255, 255, 1];
}

async function runContrastAudit() {
  console.log('🔍 Starting Readability & WCAG 2.1 Contrast Ratio Audit...');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--enable-webgl']
  });

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

  const report = [];

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const route of routes) {
      await page.goto('http://localhost:5173' + route);
      await page.waitForTimeout(500);

      const pageScan = await page.evaluate(() => {
        // Evaluate all text elements
        const textElements = Array.from(document.querySelectorAll('h1, h2, h3, h4, p, span, a, button, .eyebrow'));
        const issues = [];
        let totalScanned = 0;

        function getEffectiveBg(el) {
          let cur = el;
          const layers = [];
          while (cur && cur !== document.documentElement) {
            const style = window.getComputedStyle(cur);
            const bg = style.backgroundColor;
            if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
              const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
              if (m) {
                const alpha = m[4] !== undefined ? parseFloat(m[4]) : 1;
                layers.unshift({ r: parseInt(m[1]), g: parseInt(m[2]), b: parseInt(m[3]), a: alpha });
                if (alpha === 1) break;
              }
            }
            cur = cur.parentElement;
          }
          if (layers.length === 0 || layers[0].a < 1) {
            layers.unshift({ r: 255, g: 255, b: 255, a: 1 });
          }
          let comp = { r: layers[0].r, g: layers[0].g, b: layers[0].b };
          for (let i = 1; i < layers.length; i++) {
            const top = layers[i];
            comp.r = Math.round(top.r * top.a + comp.r * (1 - top.a));
            comp.g = Math.round(top.g * top.a + comp.g * (1 - top.a));
            comp.b = Math.round(top.b * top.a + comp.b * (1 - top.a));
          }
          return `rgb(${comp.r}, ${comp.g}, ${comp.b})`;
        }

        for (const el of textElements) {
          const text = (el.textContent || '').trim();
          if (!text || text.length < 2) continue;
          if (el.offsetParent === null) continue; // hidden

          totalScanned++;
          const style = window.getComputedStyle(el);
          const fg = style.color;
          const bg = getEffectiveBg(el);
          const fontSize = parseFloat(style.fontSize);
          const isLarge = fontSize >= 24 || (fontSize >= 18.66 && (style.fontWeight === 'bold' || parseInt(style.fontWeight) >= 600));

          // Check if it's gradient text
          const isGradient = style.webkitTextFillColor === 'transparent' || style.webkitBackgroundClip === 'text';

          issues.push({
            tag: el.tagName.toLowerCase(),
            text: text.slice(0, 40),
            fg,
            bg,
            fontSize,
            isLarge,
            isGradient,
            className: el.className
          });
        }
        return { totalScanned, items: issues };
      });

      // Compute contrast on node side
      let passCount = 0;
      let failCount = 0;
      const lowContrastSamples = [];

      for (const item of pageScan.items) {
        let fgRgb = parseRgb(item.fg);
        let bgRgb = parseRgb(item.bg);

        // If transparent gradient text, check brand gradient start (#D14316) vs background
        if (item.isGradient) {
          fgRgb = [209, 67, 22, 1]; // #D14316
        }

        const fgLum = getLuminance(fgRgb[0], fgRgb[1], fgRgb[2]);
        const bgLum = getLuminance(bgRgb[0], bgRgb[1], bgRgb[2]);
        const ratio = getContrast(fgLum, bgLum);

        const threshold = item.isLarge ? 3.0 : 4.5;
        if (ratio >= threshold) {
          passCount++;
        } else {
          failCount++;
          if (lowContrastSamples.length < 5) {
            lowContrastSamples.push({
              tag: item.tag,
              text: item.text,
              ratio: Math.round(ratio * 100) / 100,
              required: threshold,
              fg: item.fg,
              bg: item.bg,
              isGradient: item.isGradient
            });
          }
        }
      }

      report.push({
        viewport: vp.name,
        route,
        scanned: pageScan.totalScanned,
        passes: passCount,
        fails: failCount,
        passRate: Math.round((passCount / Math.max(1, pageScan.totalScanned)) * 100) + '%',
        samples: lowContrastSamples
      });
    }
    await page.close();
  }

  console.table(report.map(r => ({
    Viewport: r.viewport,
    Route: r.route,
    Scanned: r.scanned,
    Passes: r.passes,
    Fails: r.fails,
    Rate: r.passRate
  })));

  await browser.close();
  return report;
}

runContrastAudit().catch(console.error);
