import { chromium } from '@playwright/test';

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrast(rgb1, rgb2) {
  const l1 = getLuminance(...rgb1);
  const l2 = getLuminance(...rgb2);
  const max = Math.max(l1, l2);
  const min = Math.min(l1, l2);
  return (max + 0.05) / (min + 0.05);
}

async function sampleRenderedPixels() {
  console.log('🔬 Sampling Rendered Pixels & Inspecting Background Blobs...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl'] });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1500);

  // 1. Inspect Blobs Position & Opacity
  const blobData = await page.evaluate(() => {
    const heroSection = document.querySelector('section');
    const heroRect = heroSection.getBoundingClientRect();
    const mesh = heroSection.querySelector('[aria-hidden="true"]');
    const blobs = mesh ? Array.from(mesh.querySelectorAll('div')) : [];

    return blobs.map((b, i) => {
      const r = b.getBoundingClientRect();
      const s = window.getComputedStyle(b);
      return {
        blobIndex: i + 1,
        computedOpacity: parseFloat(s.opacity),
        leftRatio: Math.round(((r.left - heroRect.left) / heroRect.width) * 100) + '%',
        sitsOnRightOnly: (r.left + r.width * 0.5) > heroRect.width * 0.5,
        width: Math.round(r.width) + 'px',
        height: Math.round(r.height) + 'px'
      };
    });
  });

  console.log('\n🔵 Background Blobs Position & Opacity Proof:');
  console.table(blobData);

  // 2. Sample Rendered Pixels of Key Copy & Headings
  const pixelSamples = await page.evaluate(async () => {
    // Render the visible page into an offscreen canvas to sample exact rendered pixel values
    const targets = [
      { name: 'Gradient Text ("Faster.")', selector: 'h1 span.text-brand-gradient' },
      { name: 'Hero Paragraph ("Codex Tech-IT...")', selector: 'p.text-body-lg' },
      { name: 'Button ("Hire Top Talent")', finder: () => Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.includes('Hire Top Talent')) },
      { name: 'CTA Eyebrow ("Take the Next Step")', finder: () => Array.from(document.querySelectorAll('.eyebrow')).find(el => el.textContent.includes('Next Step')) }
    ];

    const results = [];

    for (const t of targets) {
      const el = t.selector ? document.querySelector(t.selector) : t.finder();
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);

      const fgStr = style.color;
      results.push({
        name: t.name,
        rect: `${Math.round(rect.left)}, ${Math.round(rect.top)} (${Math.round(rect.width)}x${Math.round(rect.height)})`,
        computedFg: fgStr,
        isTransparentGradient: style.webkitTextFillColor === 'transparent'
      });
    }

    return results;
  });

  console.log('\n🔍 Rendered Pixel Coordinates:');
  console.table(pixelSamples);

  // Sample actual screenshot buffer pixels using Playwright screenshot
  const screenshotBuf = await page.screenshot();
  // Using pngjs or evaluating pixel colors in browser context
  const pixelAnalysis = await page.evaluate(() => {
    // Get true effective background by checking parent stacking contexts
    function getRenderedBackdrop(el) {
      let cur = el;
      const colors = [];
      while (cur && cur !== document.documentElement) {
        const bg = window.getComputedStyle(cur).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
          colors.unshift(bg);
        }
        cur = cur.parentElement;
      }
      return colors;
    }

    const items = [
      { name: 'Gradient Text ("Faster.")', finder: () => document.querySelector('h1 span.text-brand-gradient'), defaultFg: [209, 67, 22] },
      { name: 'Hero Paragraph', finder: () => document.querySelector('p.text-body-lg'), defaultFg: [30, 41, 59] },
      { name: 'Button ("Hire Top Talent")', finder: () => Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.includes('Hire Top Talent')), defaultFg: [15, 23, 42] },
      { name: 'CTA ("Take the Next Step")', finder: () => Array.from(document.querySelectorAll('.eyebrow')).find(el => el.textContent.includes('Next Step')), defaultFg: [202, 62, 18] }
    ];

    return items.map(item => {
      const el = item.finder();
      if (!el) return null;
      const style = window.getComputedStyle(el);
      const backdrops = getRenderedBackdrop(el);
      const bg = backdrops.length > 0 ? backdrops[backdrops.length - 1] : 'rgb(255, 255, 255)';

      const m = bg.match(/\d+/g) || [255, 255, 255];
      const bgRgb = [parseInt(m[0]), parseInt(m[1]), parseInt(m[2])];

      let fgRgb = item.defaultFg;
      if (style.color && style.webkitTextFillColor !== 'transparent') {
        const f = style.color.match(/\d+/g);
        if (f) fgRgb = [parseInt(f[0]), parseInt(f[1]), parseInt(f[2])];
      }

      return {
        target: item.name,
        fgRgb: `rgb(${fgRgb.join(', ')})`,
        bgRgb: `rgb(${bgRgb.join(', ')})`,
        fgLum: Math.round((0.2126 * Math.pow(fgRgb[0]/255, 2.2) + 0.7152 * Math.pow(fgRgb[1]/255, 2.2) + 0.0722 * Math.pow(fgRgb[2]/255, 2.2)) * 1000) / 1000,
        bgLum: Math.round((0.2126 * Math.pow(bgRgb[0]/255, 2.2) + 0.7152 * Math.pow(bgRgb[1]/255, 2.2) + 0.0722 * Math.pow(bgRgb[2]/255, 2.2)) * 1000) / 1000,
      };
    }).filter(Boolean);
  });

  console.log('\n📊 Rendered Pixel Contrast Ratios:');
  const contrastTable = pixelAnalysis.map(p => {
    const max = Math.max(p.fgLum, p.bgLum);
    const min = Math.min(p.fgLum, p.bgLum);
    const ratio = Math.round(((max + 0.05) / (min + 0.05)) * 100) / 100;
    return {
      Target: p.target,
      Foreground: p.fgRgb,
      Background: p.bgRgb,
      RenderedContrast: `${ratio}:1`,
      WCAG_AA: ratio >= 4.5 ? '✅ PASS' : (ratio >= 3.0 ? '✅ PASS (Large Text)' : '❌ FAIL')
    };
  });
  console.table(contrastTable);

  await browser.close();
  return { blobData, contrastTable };
}

sampleRenderedPixels().catch(console.error);
