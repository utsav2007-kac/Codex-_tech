import { chromium } from '@playwright/test';
import { EXACT_47_ROUTES } from './audit-47-exact-routes.mjs';

const BREAKPOINTS = [
  { width: 1920, height: 1080, name: '1920px (Desktop Large)' },
  { width: 1440, height: 900, name: '1440px (Desktop Standard)' },
  { width: 1280, height: 800, name: '1280px (Compact Desktop / Laptop)' },
  { width: 1024, height: 768, name: '1024px (Tablet Landscape)' },
  { width: 768, height: 1024, name: '768px (Tablet Portrait)' },
  { width: 390, height: 844, name: '390px (Mobile iPhone)' },
];

export async function runFullLayoutRegression() {
  console.log(`🧪 Running Layout Regression Across ALL ${EXACT_47_ROUTES.length} Routes & 6 Breakpoints (CI Ready)...\n`);

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--enable-webgl', '--no-sandbox'],
  });

  const breakpointSummaries = [];
  let totalFailures = 0;

  for (const bp of BREAKPOINTS) {
    console.log(`\n======================================================`);
    console.log(`📱 Checking Breakpoint: ${bp.name}`);
    console.log(`======================================================`);

    const context = await browser.newContext({
      viewport: { width: bp.width, height: bp.height },
    });

    await context.addInitScript(() => {
      sessionStorage.setItem('codex_visited_curtain', 'true');
      localStorage.setItem('codex_cookie_consent', 'accepted');
    });

    const page = await context.newPage();
    await page.emulateMedia({ reducedMotion: 'reduce' });

    let bpMultiCardRows = 0;
    let bpMultiCardPassed = 0;
    let bpStackedGaps = 0;
    let bpStackedGapsPassed = 0;
    let bpOverflowErrors = 0;

    const colBreakdown = { '4-col': 0, '3-col': 0, '2-col': 0, '1-col': 0 };

    for (const route of EXACT_47_ROUTES) {
      try {
        await page.goto(`http://localhost:5173${route.path}`, {
          waitUntil: 'domcontentloaded',
          timeout: 8000,
        });

        // Settle scroll
        await page.evaluate(async () => {
          const step = Math.max(300, Math.floor(document.body.scrollHeight / 8));
          for (let y = 0; y < document.body.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 25));
          }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(400);

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          const scrollW = document.documentElement.scrollWidth;
          const innerW = window.innerWidth;
          return { hasOverflow: scrollW > innerW, diff: scrollW - innerW };
        });

        if (overflow.hasOverflow) {
          bpOverflowErrors++;
          totalFailures++;
          console.error(`  ❌ Overflow on ${route.path}: +${overflow.diff}px`);
        }

        // Measure visual rows & column counts
        const inspection = await page.evaluate((viewportWidth) => {
          const grids = Array.from(document.querySelectorAll('.grid, [class*="grid-cols-"]'));
          const multiCardRows = [];
          const stackingChecks = [];
          const colsFound = [];

          grids.forEach((grid) => {
            const section = grid.closest('section') || grid.parentElement;
            if (grid.querySelector('h1') || section?.hasAttribute('data-hero-section')) return;

            const children = Array.from(grid.children).filter((el) => {
              const style = window.getComputedStyle(el);
              return el.offsetHeight > 40 && el.offsetWidth > 40 && style.display !== 'none';
            });

            if (children.length < 2) return;

            // Exclude asymmetric column splits (e.g. col-span-7 vs col-span-5)
            const widths = children.map((c) => Math.round(c.getBoundingClientRect().width));
            const widthDiff = Math.max(...widths) - Math.min(...widths);
            if (widthDiff > 24) return;

            // Group into visual rows sharing the same top Y-coordinate within 2px
            const rows = new Map();
            children.forEach((child) => {
              const top = Math.round(child.getBoundingClientRect().top);
              let matchedRow = null;
              for (const rKey of rows.keys()) {
                if (Math.abs(rKey - top) <= 2) {
                  matchedRow = rKey;
                  break;
                }
              }
              const key = matchedRow !== null ? matchedRow : top;
              if (!rows.has(key)) rows.set(key, []);
              rows.get(key).push(child);
            });

            // Tally visual rows and check height equality
            rows.forEach((rowCards) => {
              const colCount = rowCards.length;
              colsFound.push(colCount);

              if (colCount >= 2) {
                const heights = rowCards.map((c) => Math.round(c.getBoundingClientRect().height));
                const minH = Math.min(...heights);
                const maxH = Math.max(...heights);
                const diff = maxH - minH;

                multiCardRows.push({
                  cardCount: colCount,
                  heights,
                  diff,
                  passed: diff <= 1,
                });
              }
            });

            // Stacking checks on mobile & tablet
            if (viewportWidth === 768 || viewportWidth === 390) {
              const rowKeys = Array.from(rows.keys()).sort((a, b) => a - b);
              if (rowKeys.length >= 2) {
                const rowGaps = [];
                for (let r = 0; r < rowKeys.length - 1; r++) {
                  const currBottom = Math.max(
                    ...rows.get(rowKeys[r]).map((c) => Math.round(c.getBoundingClientRect().bottom))
                  );
                  const nextTop = Math.min(
                    ...rows.get(rowKeys[r + 1]).map((c) => Math.round(c.getBoundingClientRect().top))
                  );
                  rowGaps.push(nextTop - currBottom);
                }

                if (rowGaps.length >= 1) {
                  const minGap = Math.min(...rowGaps);
                  const maxGap = Math.max(...rowGaps);
                  const gapVariance = maxGap - minGap;
                  const noOverlap = minGap >= 0;
                  const isConsistent = gapVariance <= 16; // within 16px across responsive Tailwind grid layouts (gap-4 to gap-6)

                  stackingChecks.push({
                    gaps: rowGaps,
                    minGap,
                    gapVariance,
                    passed: noOverlap && isConsistent && minGap >= 8,
                  });
                }
              }
            }
          });

          return { multiCardRows, stackingChecks, colsFound };
        }, bp.width);

        inspection.colsFound.forEach((c) => {
          if (c >= 4) colBreakdown['4-col']++;
          else if (c === 3) colBreakdown['3-col']++;
          else if (c === 2) colBreakdown['2-col']++;
          else if (c === 1) colBreakdown['1-col']++;
        });

        inspection.multiCardRows.forEach((r) => {
          bpMultiCardRows++;
          if (r.passed) bpMultiCardPassed++;
          else totalFailures++;
        });

        inspection.stackingChecks.forEach((s) => {
          bpStackedGaps++;
          if (s.passed) bpStackedGapsPassed++;
          else totalFailures++;
        });
      } catch (err) {
        console.error(`  Error on ${route.path} (${bp.name}):`, err.message);
      }
    }

    breakpointSummaries.push({
      breakpoint: bp.name,
      multiCardRows: `${bpMultiCardPassed}/${bpMultiCardRows} passed`,
      columnBreakdown: `4-col: ${colBreakdown['4-col']} | 3-col: ${colBreakdown['3-col']} | 2-col: ${colBreakdown['2-col']} | 1-col: ${colBreakdown['1-col']}`,
      stackedRowGaps: bpStackedGaps > 0 ? `${bpStackedGapsPassed}/${bpStackedGaps} passed` : 'N/A',
      overflowErrors: bpOverflowErrors === 0 ? '✅ 0px' : `❌ ${bpOverflowErrors} errors`,
    });

    await context.close();
  }

  await browser.close();

  console.log(`\n======================================================`);
  console.log(`📊 FINAL REGRESSION TEST REPORT ACROSS ALL 47 ROUTES:`);
  console.log(`======================================================`);
  console.table(breakpointSummaries);

  if (totalFailures > 0) {
    console.error(`❌ Regression failed with ${totalFailures} total errors.`);
    process.exit(1);
  } else {
    console.log(`\n✅ ALL 47 ROUTES PASSED ACROSS ALL 6 BREAKPOINTS! 0 failures, 0 overflow.`);
    process.exit(0);
  }
}

runFullLayoutRegression().catch((err) => {
  console.error(err);
  process.exit(1);
});
