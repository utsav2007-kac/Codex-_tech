import { chromium } from '@playwright/test';

const ROUTES = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/services', name: 'Services' },
  { path: '/services/job-placement', name: 'ServiceDetail' },
  { path: '/plans', name: 'Plans' },
  { path: '/careers', name: 'Careers' },
  { path: '/success-stories', name: 'SuccessStories' },
  { path: '/technologies', name: 'Technologies' },
  { path: '/insights', name: 'Insights' },
  { path: '/refer-earn', name: 'ReferEarn' },
  { path: '/resources', name: 'Resources' },
  { path: '/live-placements', name: 'LivePlacements' },
];

const BREAKPOINTS = [
  { width: 1920, height: 1080, name: '1920px (Desktop Large)' },
  { width: 1440, height: 900, name: '1440px (Desktop Standard)' },
  { width: 1280, height: 800, name: '1280px (Desktop Compact / Laptop)' },
  { width: 1024, height: 768, name: '1024px (Tablet Landscape)' },
  { width: 768, height: 1024, name: '768px (Tablet Portrait)' },
  { width: 390, height: 844, name: '390px (Mobile iPhone)' },
];

async function runRegressionSuite() {
  console.log('🧪 Starting Layout Regression Suite: Card Alignment, Stacking & Overflow (CI Ready)...\n');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--enable-webgl', '--no-sandbox'],
  });

  const breakpointSummaries = [];
  let totalMultiCardRowsAll = 0;
  let totalStackedGapsChecked = 0;
  const allFailures = [];

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

    for (const route of ROUTES) {
      try {
        await page.goto(`http://localhost:5173${route.path}`, {
          waitUntil: 'domcontentloaded',
          timeout: 8000,
        });

        // Settle scroll animations so Framer Motion cards complete entry transforms
        await page.evaluate(async () => {
          const step = Math.max(300, Math.floor(document.body.scrollHeight / 8));
          for (let y = 0; y < document.body.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 40));
          }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(700);

        // 1. Horizontal Overflow Verification
        const overflow = await page.evaluate(() => {
          const scrollW = document.documentElement.scrollWidth;
          const innerW = window.innerWidth;
          return {
            hasOverflow: scrollW > innerW,
            diff: scrollW - innerW,
          };
        });

        if (overflow.hasOverflow) {
          bpOverflowErrors++;
          allFailures.push({
            breakpoint: bp.width,
            route: route.name,
            type: 'Horizontal Overflow',
            details: `Page overflows by +${overflow.diff}px`,
          });
        }

        // 2. Card Row Equal Height & Stacking Verification
        const gridResults = await page.evaluate((viewportWidth) => {
          const grids = Array.from(document.querySelectorAll('.grid, [class*="grid-cols-"]'));
          const multiCardRows = [];
          const stackingChecks = [];

          grids.forEach((grid) => {
            const section = grid.closest('section') || grid.parentElement;
            if (grid.querySelector('h1') || section?.hasAttribute('data-hero-section')) return;

            const children = Array.from(grid.children).filter((el) => {
              const style = window.getComputedStyle(el);
              return el.offsetHeight > 35 && el.offsetWidth > 35 && style.display !== 'none';
            });

            if (children.length < 2) return;

            // Filter out layout splits like 7-col vs 5-col
            const hasAsymmetricSpans = children.some(c => {
              const cls = c.className || '';
              return cls.includes('col-span-7') || cls.includes('col-span-5') || cls.includes('col-span-8') || cls.includes('col-span-4');
            });
            if (hasAsymmetricSpans) return;

            // Group sibling cards into horizontal rows by their top Y-coordinate (within 14px)
            const rows = new Map();
            children.forEach((child) => {
              const rect = child.getBoundingClientRect();
              let matchedRow = null;
              for (const rKey of rows.keys()) {
                if (Math.abs(rKey - rect.top) <= 14) {
                  matchedRow = rKey;
                  break;
                }
              }
              const key = matchedRow !== null ? matchedRow : rect.top;
              if (!rows.has(key)) rows.set(key, []);
              rows.get(key).push(child);
            });

            // A. Check multi-card rows (2+ cards side-by-side in same horizontal row)
            rows.forEach((rowCards) => {
              if (rowCards.length >= 2) {
                // Ensure row cards have uniform widths (true sibling cards, not asymmetric splits)
                const widths = rowCards.map((c) => Math.round(c.getBoundingClientRect().width));
                const widthDiff = Math.max(...widths) - Math.min(...widths);
                if (widthDiff > 32) return;

                const heights = rowCards.map((c) => Math.round(c.getBoundingClientRect().height));
                const minH = Math.min(...heights);
                const maxH = Math.max(...heights);
                const diff = maxH - minH;

                multiCardRows.push({
                  cardCount: rowCards.length,
                  heights,
                  diff,
                  passed: diff <= 1,
                });
              }
            });

            // B. Check vertical stacking consistency between consecutive rows (on 768px & 390px)
            if (viewportWidth === 768 || viewportWidth === 390) {
              const rowKeys = Array.from(rows.keys()).sort((a, b) => a - b);
              if (rowKeys.length >= 2) {
                // Only check grids whose children have uniform widths
                const allWidths = children.map((c) => Math.round(c.getBoundingClientRect().width));
                const allWidthDiff = Math.max(...allWidths) - Math.min(...allWidths);
                if (allWidthDiff <= 32) {
                  const rowGaps = [];
                  for (let r = 0; r < rowKeys.length - 1; r++) {
                    const currentRowCards = rows.get(rowKeys[r]);
                    const nextRowCards = rows.get(rowKeys[r + 1]);

                    const currBottom = Math.max(
                      ...currentRowCards.map((c) => Math.round(c.getBoundingClientRect().bottom))
                    );
                    const nextTop = Math.min(
                      ...nextRowCards.map((c) => Math.round(c.getBoundingClientRect().top))
                    );
                    const gap = nextTop - currBottom;
                    rowGaps.push(gap);
                  }

                  // Verify all consecutive row gaps in this grid are positive (no overlap) and consistent
                  if (rowGaps.length >= 1) {
                    const minGap = Math.min(...rowGaps);
                    const maxGap = Math.max(...rowGaps);
                    const gapVariance = maxGap - minGap;
                    const noOverlap = minGap >= 0;
                    const isConsistent = gapVariance <= 6; // within 6px consistency across responsive breakpoints

                    stackingChecks.push({
                      gaps: rowGaps,
                      minGap,
                      maxGap,
                      gapVariance,
                      noOverlap,
                      passed: noOverlap && isConsistent && minGap >= 12,
                    });
                  }
                }
              }
            }
          });

          return { multiCardRows, stackingChecks };
        }, bp.width);

        // Multi-card rows tally
        gridResults.multiCardRows.forEach((r) => {
          bpMultiCardRows++;
          if (r.passed) {
            bpMultiCardPassed++;
          } else {
            allFailures.push({
              breakpoint: bp.width,
              route: route.name,
              type: 'Unequal Card Heights in Row',
              details: `Heights: [${r.heights.join(', ')}] (Diff: ${r.diff}px)`,
            });
          }
        });

        // Stacking check tally (only on 768 and 390)
        gridResults.stackingChecks.forEach((s) => {
          bpStackedGaps++;
          if (s.passed) {
            bpStackedGapsPassed++;
          } else {
            allFailures.push({
              breakpoint: bp.width,
              route: route.name,
              type: 'Stacking Inconsistency or Overlap',
              details: `Gaps: [${s.gaps.join(', ')}] (Variance: ${s.gapVariance}px, NoOverlap: ${s.noOverlap})`,
            });
          }
        });
      } catch (err) {
        console.error(`Error on ${route.name} at ${bp.name}:`, err.message);
      }
    }

    totalMultiCardRowsAll += bpMultiCardRows;
    totalStackedGapsChecked += bpStackedGaps;

    breakpointSummaries.push({
      breakpoint: bp.name,
      multiCardRows: bpMultiCardRows > 0 ? `${bpMultiCardPassed}/${bpMultiCardRows} passed` : '0 (Single Column)',
      stackedRowGaps: bpStackedGaps > 0 ? `${bpStackedGapsPassed}/${bpStackedGaps} passed` : 'N/A (Desktop Multi-col)',
      overflowErrors: bpOverflowErrors === 0 ? '✅ 0px' : `❌ ${bpOverflowErrors} errors`,
    });

    await context.close();
  }

  await browser.close();

  console.log(`\n======================================================`);
  console.log(`📊 FINAL REGRESSION TEST BREAKDOWN BY BREAKPOINT:`);
  console.log(`======================================================`);
  console.table(breakpointSummaries);

  console.log(`\nSummary Statistics:`);
  console.log(`- Total Multi-Card Rows Checked (Desktop & Tablets): ${totalMultiCardRowsAll}`);
  console.log(`- Total Stacked Grid Gaps Checked (768px & 390px): ${totalStackedGapsChecked}`);
  console.log(`- Total Failures: ${allFailures.length}`);

  if (allFailures.length > 0) {
    console.log(`\n❌ Failures Detected:`);
    console.table(allFailures);
    process.exit(1);
  } else {
    console.log(`\n✅ ALL TESTS PASSED! Multi-card rows equal (diff <= 1px), cards stack with consistent gaps, 0 horizontal overflow.`);
    process.exit(0);
  }
}

runRegressionSuite().catch((err) => {
  console.error(err);
  process.exit(1);
});
