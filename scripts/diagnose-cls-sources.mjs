import { chromium } from '@playwright/test';

async function auditCLS(viewport, name) {
  console.log(`\n======================================================`);
  console.log(`🔍 Diagnosing Layout Shifts for: ${name} (${viewport.width}x${viewport.height})`);
  console.log(`======================================================`);

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();

  await page.addInitScript(() => {
    window.__layoutShifts = [];
    try {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            const sources = (entry.sources || []).map((s) => {
              let nodeDesc = 'unknown';
              if (s.node) {
                const el = s.node;
                nodeDesc = `${el.tagName || 'ELEMENT'}.${(el.className || '').toString().slice(0, 50)} id="${el.id || ''}" text="${(el.textContent || '').slice(0, 30).trim()}"`;
              }
              return {
                node: nodeDesc,
                prevRect: s.previousRect ? { top: s.previousRect.top, height: s.previousRect.height, left: s.previousRect.left, width: s.previousRect.width } : null,
                currRect: s.currentRect ? { top: s.currentRect.top, height: s.currentRect.height, left: s.currentRect.left, width: s.currentRect.width } : null,
              };
            });
            window.__layoutShifts.push({
              value: entry.value,
              startTime: Math.round(entry.startTime),
              sources,
            });
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.error(e);
    }
  });

  await page.goto('http://localhost:4173/', { waitUntil: 'load' });
  await page.waitForTimeout(2500);

  const shifts = await page.evaluate(() => window.__layoutShifts);
  const totalCls = shifts.reduce((acc, s) => acc + s.value, 0);

  console.log(`Total CLS: ${totalCls.toFixed(5)} (${shifts.length} shift entries)`);
  for (let i = 0; i < shifts.length; i++) {
    const s = shifts[i];
    console.log(`\nShift #${i + 1} at ${s.startTime}ms, value = ${s.value.toFixed(5)}:`);
    for (const src of s.sources) {
      console.log(`  Source Node: ${src.node}`);
      console.log(`    prevRect:`, src.prevRect);
      console.log(`    currRect:`, src.currRect);
    }
  }

  await browser.close();
}

async function main() {
  await auditCLS({ width: 1440, height: 900 }, 'Desktop 1440px');
  await auditCLS({ width: 390, height: 844 }, 'Mobile 390px');
}

main().catch(console.error);
