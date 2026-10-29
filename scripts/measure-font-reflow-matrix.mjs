import { chromium } from '@playwright/test';
import fs from 'fs';

const PREVIEW_URL = 'http://localhost:4173';
const VIEWPORTS = [
  { width: 1440, height: 900, name: '1440px' },
  { width: 1280, height: 800, name: '1280px' },
  { width: 1024, height: 768, name: '1024px' },
  { width: 768, height: 1024, name: '768px' },
  { width: 390, height: 844, name: '390px' },
];

async function measureFontReflowForViewport(browser, vp) {
  console.log(`\n======================================================`);
  console.log(`📏 Measuring Font Reflow for Viewport: ${vp.name} (${vp.width}x${vp.height})`);
  console.log(`======================================================`);

  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();
  const client = await context.newCDPSession(page);

  // Disable network cache so fonts are fetched afresh
  await client.send('Network.enable');
  await client.send('Network.setCacheDisabled', { cacheDisabled: true });

  // Add script to capture paragraph metrics at the very first HTML paint before fonts load
  await page.addInitScript(() => {
    window.__fontMetrics = {
      before: null,
      after: null,
    };

    const getMetrics = () => {
      const p = document.querySelector('.hero-anim-para');
      const h1 = document.querySelector('h1');
      if (!p) return null;

      const rect = p.getBoundingClientRect();
      const style = window.getComputedStyle(p);
      const lineHeight = parseFloat(style.lineHeight) || 24;
      const lineCount = Math.round(rect.height / lineHeight);

      const h1Rect = h1 ? h1.getBoundingClientRect() : null;

      return {
        paraHeight: parseFloat(rect.height.toFixed(2)),
        paraLineCount: lineCount,
        lineHeight: parseFloat(lineHeight.toFixed(2)),
        h1Height: h1Rect ? parseFloat(h1Rect.height.toFixed(2)) : null,
      };
    };

    // Capture before font loads (on DOMContentLoaded before fonts are loaded)
    document.addEventListener('DOMContentLoaded', () => {
      if (!window.__fontMetrics.before) {
        window.__fontMetrics.before = getMetrics();
      }
    });
  });

  await page.goto(PREVIEW_URL, { waitUntil: 'domcontentloaded' });

  // Read the immediate before metric
  const beforeMetric = await page.evaluate(() => {
    if (!window.__fontMetrics.before) {
      const p = document.querySelector('.hero-anim-para');
      const h1 = document.querySelector('h1');
      if (!p) return null;
      const rect = p.getBoundingClientRect();
      const style = window.getComputedStyle(p);
      const lineHeight = parseFloat(style.lineHeight) || 24;
      return {
        paraHeight: parseFloat(rect.height.toFixed(2)),
        paraLineCount: Math.round(rect.height / lineHeight),
        lineHeight: parseFloat(lineHeight.toFixed(2)),
        h1Height: h1 ? parseFloat(h1.getBoundingClientRect().height.toFixed(2)) : null,
      };
    }
    return window.__fontMetrics.before;
  });

  // Wait for all fonts to settle
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);

  const afterMetric = await page.evaluate(() => {
    const p = document.querySelector('.hero-anim-para');
    const h1 = document.querySelector('h1');
    if (!p) return null;
    const rect = p.getBoundingClientRect();
    const style = window.getComputedStyle(p);
    const lineHeight = parseFloat(style.lineHeight) || 24;
    return {
      paraHeight: parseFloat(rect.height.toFixed(2)),
      paraLineCount: Math.round(rect.height / lineHeight),
      lineHeight: parseFloat(lineHeight.toFixed(2)),
      h1Height: h1 ? parseFloat(h1.getBoundingClientRect().height.toFixed(2)) : null,
    };
  });

  const deltaHeight = Math.abs(afterMetric.paraHeight - beforeMetric.paraHeight);
  const deltaLines = Math.abs(afterMetric.paraLineCount - beforeMetric.paraLineCount);

  console.log(`Results for ${vp.name}:`);
  console.log(`  Before Font Load (Fallback Arial): Height = ${beforeMetric.paraHeight}px, Lines = ${beforeMetric.paraLineCount}`);
  console.log(`  After Font Load (Inter Loaded):    Height = ${afterMetric.paraHeight}px, Lines = ${afterMetric.paraLineCount}`);
  console.log(`  Delta Height: ${deltaHeight.toFixed(2)}px (Target: <= 1px)`);
  console.log(`  Delta Lines:  ${deltaLines} (Target: 0 lines)`);

  await context.close();

  return {
    viewport: vp.name,
    before: beforeMetric,
    after: afterMetric,
    deltaHeight: parseFloat(deltaHeight.toFixed(2)),
    deltaLines,
    pass: deltaLines === 0 && deltaHeight <= 2,
  };
}

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];

  for (const vp of VIEWPORTS) {
    const res = await measureFontReflowForViewport(browser, vp);
    results.push(res);
  }

  console.log('\n======================================================');
  console.log('📊 FONT REFLOW MULTI-VIEWPORT SUMMARY TABLE');
  console.log('======================================================');
  console.table(
    results.map((r) => ({
      Viewport: r.viewport,
      'Height Before (px)': r.before.paraHeight,
      'Height After (px)': r.after.paraHeight,
      'Lines Before': r.before.paraLineCount,
      'Lines After': r.after.paraLineCount,
      'Δ Height (px)': `${r.deltaHeight}px`,
      'Δ Lines': r.deltaLines,
      Status: r.pass ? '✅ PASS' : '❌ REFLOW',
    }))
  );

  fs.writeFileSync('d:/web devlopment/scripts/font-reflow-results.json', JSON.stringify(results, null, 2));

  await browser.close();
}

main().catch(console.error);
