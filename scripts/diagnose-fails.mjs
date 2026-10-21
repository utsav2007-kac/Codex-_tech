import { chromium } from '@playwright/test';

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

async function diagnose() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  const routes = ['/about', '/services/job-placement', '/careers', '/contact'];
  for (const route of routes) {
    await page.goto('http://localhost:5173' + route);
    await page.waitForTimeout(500);

  const fails = await page.evaluate(() => {
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
            if (alpha === 1) break; // opaque bottom reached
          }
        }
        cur = cur.parentElement;
      }
      if (layers.length === 0 || layers[0].a < 1) {
        layers.unshift({ r: 255, g: 255, b: 255, a: 1 }); // default white canvas backing
      }
      // Composite layers from bottom to top
      let comp = { r: layers[0].r, g: layers[0].g, b: layers[0].b };
      for (let i = 1; i < layers.length; i++) {
        const top = layers[i];
        comp.r = Math.round(top.r * top.a + comp.r * (1 - top.a));
        comp.g = Math.round(top.g * top.a + comp.g * (1 - top.a));
        comp.b = Math.round(top.b * top.a + comp.b * (1 - top.a));
      }
      return `rgb(${comp.r}, ${comp.g}, ${comp.b})`;
    }

    const els = Array.from(document.querySelectorAll('h1, h2, h3, h4, p, span, a, button, .eyebrow'));
    const res = [];
    for (const el of els) {
      const text = (el.textContent || '').trim();
      if (!text || text.length < 2 || el.offsetParent === null) continue;
      const style = window.getComputedStyle(el);
      const fg = style.color;
      const bg = getEffectiveBg(el);
      const isGradient = style.webkitTextFillColor === 'transparent';
      const fontSize = parseFloat(style.fontSize);
      const isLarge = fontSize >= 24 || (fontSize >= 18.66 && (style.fontWeight === 'bold' || parseInt(style.fontWeight) >= 600));

      res.push({
        text: text.slice(0, 50),
        className: el.className,
        tagName: el.tagName,
        fg,
        bg,
        fontSize,
        isLarge,
        isGradient
      });
    }
    return res;
  });

  const failureMap = new Map();
  for (const item of fails) {
    let fgRgb = parseRgb(item.fg);
    let bgRgb = parseRgb(item.bg);
    if (item.isGradient) fgRgb = [209, 67, 22, 1];

    const ratio = getContrast(getLuminance(...fgRgb.slice(0, 3)), getLuminance(...bgRgb.slice(0, 3)));
    const req = item.isLarge ? 3.0 : 4.5;
    if (ratio < req) {
      const key = `${item.className} | ${item.fg} on ${item.bg}`;
      if (!failureMap.has(key)) {
        failureMap.set(key, { ...item, ratio: Math.round(ratio * 100) / 100, count: 1 });
      } else {
        failureMap.get(key).count++;
      }
    }
  }

    console.log(`\nRoute: ${route} - Found ${failureMap.size} failing styling patterns:`);
    if (failureMap.size > 0) {
      console.table(Array.from(failureMap.values()).map(v => ({
        text: v.text,
        ratio: v.ratio,
        className: v.className.slice(0, 40),
        fg: v.fg,
        bg: v.bg,
        count: v.count
      })));
    }
  }

  await browser.close();
}

diagnose();
