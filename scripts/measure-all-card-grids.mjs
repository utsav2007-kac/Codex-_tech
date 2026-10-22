import { chromium } from '@playwright/test';

const ROUTES = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/services', name: 'Services' },
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
  { width: 1024, height: 768, name: '1024px (Tablet Landscape)' },
  { width: 768, height: 1024, name: '768px (Tablet Portrait)' },
  { width: 390, height: 844, name: '390px (Mobile)' },
];

async function measureGrids() {
  console.log('🔍 Scanning Codex Tech-IT card grids for height mismatches across 5 breakpoints...\n');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--enable-webgl', '--no-sandbox'],
  });

  const results = [];

  for (const bp of BREAKPOINTS) {
    console.log(`\n================== BREAKPOINT: ${bp.name} (${bp.width}x${bp.height}) ==================`);
    const context = await browser.newContext({
      viewport: { width: bp.width, height: bp.height },
    });

    await context.addInitScript(() => {
      sessionStorage.setItem('codex_visited_curtain', 'true');
      localStorage.setItem('codex_cookie_consent', 'accepted');
    });

    const page = await context.newPage();

    for (const route of ROUTES) {
      try {
        await page.goto(`http://localhost:5173${route.path}`, { waitUntil: 'domcontentloaded', timeout: 8000 });
        await page.waitForTimeout(600);

        // Find all grid and card containers
        const gridData = await page.evaluate(({ routeName, bpWidth }) => {
          const grids = Array.from(document.querySelectorAll('.grid, [class*="grid-cols-"]'));
          const findings = [];

          grids.forEach((grid, gIdx) => {
            // Find section or heading context
            const section = grid.closest('section') || grid.closest('div[class*="py-"]') || grid.parentElement;
            const heading = section ? section.querySelector('h1, h2, h3') : null;
            const sectionName = heading ? heading.innerText.trim().replace(/\n/g, ' ').substring(0, 40) : `Grid #${gIdx + 1}`;

            // Hero section 2-column layout (contains the page h1) is a layout split, not a card grid
            if (grid.querySelector('h1') || section?.hasAttribute('data-hero-section')) return;

            // Look for card children (either direct children or direct motion wrappers)
            const children = Array.from(grid.children).filter((el) => {
              // Ignore empty or layout-only placeholders
              return el.offsetHeight > 40 && el.offsetWidth > 40;
            });

            if (children.length < 2) return;

            // Group sibling cards by row (similar top offset within 14px)
            const rows = {};
            children.forEach((child, cIdx) => {
              const rect = child.getBoundingClientRect();
              // Find matching row key
              let matchedRowKey = null;
              for (const rKey of Object.keys(rows)) {
                if (Math.abs(Number(rKey) - rect.top) < 14) {
                  matchedRowKey = rKey;
                  break;
                }
              }
              if (!matchedRowKey) {
                matchedRowKey = String(Math.round(rect.top));
                rows[matchedRowKey] = [];
              }
              // Also find inner card height if wrapped
              const innerCard = child.querySelector('.glass-card, [class*="rounded-"], .p-6, .p-7, .p-8, [class*="border"]') || child;
              const innerRect = innerCard.getBoundingClientRect();

              rows[matchedRowKey].push({
                index: cIdx + 1,
                width: Math.round(rect.width * 10) / 10,
                wrapperHeight: Math.round(rect.height * 10) / 10,
                cardHeight: Math.round(innerRect.height * 10) / 10,
                textSnippet: (child.innerText || '').slice(0, 30).replace(/\n/g, ' '),
              });
            });

            // Check each row with 2+ cards
            Object.entries(rows).forEach(([rowTop, items]) => {
              if (items.length >= 2) {
                // Ensure these are sibling cards (i.e. uniform grid columns, not asymmetric layout splits like col-span-7 vs col-span-5)
                const widths = items.map((i) => i.width);
                const minW = Math.min(...widths);
                const maxW = Math.max(...widths);
                // Sibling cards in a responsive grid row have equal width (within 24px)
                const isSiblingCardRow = (maxW - minW) <= 24;
                if (!isSiblingCardRow) return;

                const cardHeights = items.map((i) => i.cardHeight);
                const wrapperHeights = items.map((i) => i.wrapperHeight);
                const minH = Math.min(...cardHeights);
                const maxH = Math.max(...cardHeights);
                const diff = Math.round((maxH - minH) * 10) / 10;

                findings.push({
                  section: sectionName,
                  route: routeName,
                  cardCount: items.length,
                  cardHeights,
                  wrapperHeights,
                  minHeight: minH,
                  maxHeight: maxH,
                  diff,
                  hasMismatch: diff > 1.0,
                  items,
                });
              }
            });
          });

          return findings;
        }, { routeName: route.name, bpWidth: bp.width });

        for (const f of gridData) {
          results.push({
            breakpoint: bp.width,
            route: f.route,
            section: f.section,
            cardCount: f.cardCount,
            cardHeights: f.cardHeights.join(', '),
            diff: `${f.diff}px`,
            status: f.hasMismatch ? 'FAIL (UNEVEN)' : 'PASS (EQUAL)',
            items: f.items,
          });
        }
      } catch (err) {
        console.error(`Error on ${route.path} at ${bp.width}px:`, err.message);
      }
    }

    await context.close();
  }

  await browser.close();

  const failures = results.filter((r) => r.status.startsWith('FAIL'));
  console.log(`\nTotal Card Rows Audited: ${results.length}`);
  console.log(`Uneven Card Rows Found (diff > 1px): ${failures.length}\n`);

  if (failures.length > 0) {
    console.log('--- REMAINING UNEVEN CARD ROWS ---');
    failures.forEach((f, i) => {
      console.log(`[${i + 1}] BP ${f.breakpoint}px | Route: ${f.route} | Section: "${f.section}" | Cards: ${f.cardCount} | Heights: [${f.cardHeights}] | Diff: ${f.diff}`);
    });
  }

  import('fs').then(fs => {
    fs.writeFileSync('scripts/audit-results.json', JSON.stringify({ total: results.length, failuresCount: failures.length, failures, all: results }, null, 2));
    console.log('\nAudit written to scripts/audit-results.json');
  });

  return results;
}

measureGrids().catch(console.error);
