import { chromium } from '@playwright/test';
import fs from 'fs';

// Complete 47 application routes as defined in App.tsx & siteConfig
const allRoutes = [
  // 1. Core Public Pages (12)
  { path: '/', name: 'Homepage', type: 'Public Core' },
  { path: '/about', name: 'About Codex', type: 'Public Core' },
  { path: '/services', name: 'Services Directory', type: 'Public Core' },
  { path: '/technologies', name: 'Technologies Directory', type: 'Public Core' },
  { path: '/plans', name: 'Pricing & Plans', type: 'Public Core' },
  { path: '/careers', name: 'Careers Directory', type: 'Public Core' },
  { path: '/success-stories', name: 'Success Stories Directory', type: 'Public Core' },
  { path: '/live-placements', name: 'Live Placements', type: 'Public Core' },
  { path: '/refer-earn', name: 'Refer & Earn', type: 'Public Core' },
  { path: '/resources', name: 'Resources Directory', type: 'Public Core' },
  { path: '/insights', name: 'Insights Blog', type: 'Public Core' },
  { path: '/contact', name: 'Contact Us', type: 'Public Core' },

  // 2. Service & Course Detail Pages (2)
  { path: '/services/job-placement', name: 'Service: Job Placement', type: 'Service Detail' },
  { path: '/services/it-training/cloud-aws-azure', name: 'Course: Cloud AWS/Azure', type: 'Course Detail' },

  // 3. Dynamic Detail Pages (4)
  { path: '/careers/senior-technical-recruiter', name: 'Career: Senior Technical Recruiter', type: 'Career Detail' },
  { path: '/success-stories/priya-sharma-f1-opt-fintech', name: 'Story: Priya Sharma (F1-OPT)', type: 'Story Detail' },
  { path: '/insights/ats-proof-resume-12-fixes', name: 'Insight: ATS-Proof Resume', type: 'Insight Detail' },
  { path: '/faq', name: 'FAQ Page', type: 'Public Core' },

  // 4. Resource Sub-Pages (4)
  { path: '/resources/salary-guide', name: 'Resource: Salary Guide', type: 'Resource Detail' },
  { path: '/resources/resume-templates', name: 'Resource: Resume Templates', type: 'Resource Detail' },
  { path: '/resources/interview-question-bank', name: 'Resource: Interview Question Bank', type: 'Resource Detail' },
  { path: '/resources/webinars', name: 'Resource: Webinars', type: 'Resource Detail' },

  // 5. Legal & Compliance Pages (5)
  { path: '/privacy-policy', name: 'Privacy Policy', type: 'Legal' },
  { path: '/terms-and-conditions', name: 'Terms of Service', type: 'Legal' },
  { path: '/cookie-policy', name: 'Cookie Policy', type: 'Legal' },
  { path: '/refund-policy', name: 'Refund Policy', type: 'Legal' },
  { path: '/accessibility-statement', name: 'Accessibility Statement', type: 'Legal' },

  // 6. Utility & Developer Pages (4)
  { path: '/thank-you', name: 'Thank You Submission', type: 'Utility' },
  { path: '/dev/components', name: 'Developer Components', type: 'Developer' },
  { path: '/dev/motion', name: 'Developer Motion Showcase', type: 'Developer' },
  { path: '/404-test-page', name: '404 Error Fallback', type: 'Utility' },

  // 7. Route Redirects & Legacy Aliases (4)
  { path: '/how-it-works', name: 'Redirect: How It Works -> /about', type: 'Redirect' },
  { path: '/employers', name: 'Redirect: Employers -> /contact', type: 'Redirect' },
  { path: '/tools', name: 'Redirect: /tools -> /services', type: 'Redirect' },
  { path: '/industries', name: 'Redirect: /industries -> /services', type: 'Redirect' },

  // 8. Admin Suite Pages (12)
  { path: '/admin/login', name: 'Admin Login', type: 'Admin Auth' },
  { path: '/admin', name: 'Admin Dashboard', type: 'Admin Suite' },
  { path: '/admin/submissions', name: 'Admin Submissions', type: 'Admin Suite' },
  { path: '/admin/leads', name: 'Admin Leads', type: 'Admin Suite' },
  { path: '/admin/contacts', name: 'Admin Contacts', type: 'Admin Suite' },
  { path: '/admin/employer-requests', name: 'Admin Employer Requests', type: 'Admin Suite' },
  { path: '/admin/applications', name: 'Admin Applications', type: 'Admin Suite' },
  { path: '/admin/referrals', name: 'Admin Referrals', type: 'Admin Suite' },
  { path: '/admin/subscribers', name: 'Admin Subscribers', type: 'Admin Suite' },
  { path: '/admin/enrollments', name: 'Admin Enrollments', type: 'Admin Suite' },
  { path: '/admin/content', name: 'Admin Content Editor', type: 'Admin Suite' },
  { path: '/admin/settings', name: 'Admin Settings', type: 'Admin Suite' },
];

async function runCoverageAudit() {
  console.log(`🔍 Auditing ALL ${allRoutes.length} Application Routes for Card Groups and Alignment...`);

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--enable-webgl', '--no-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  await context.addInitScript(() => {
    sessionStorage.setItem('codex_visited_curtain', 'true');
    localStorage.setItem('codex_cookie_consent', 'accepted');
  });

  const page = await context.newPage();

  const auditResults = [];
  const cardGroupDetails = [];
  const routesWithoutCardGroups = [];

  for (const route of allRoutes) {
    try {
      await page.goto(`http://localhost:5173${route.path}`, { waitUntil: 'load', timeout: 10000 });
      await page.waitForTimeout(400);

      const inspection = await page.evaluate((currentPath) => {
        // Collect candidate card containers
        const gridContainers = Array.from(document.querySelectorAll('.grid, [class*="grid-cols"]'));
        const groupsFound = [];

        gridContainers.forEach((grid, gIdx) => {
          // Find card items inside this grid
          const directCards = Array.from(grid.children).filter((c) => {
            const cls = (c.className || '') + ' ' + (c.firstElementChild?.className || '');
            const hasCardInner = !!c.querySelector('.glass-card, .rounded-3xl, .rounded-2xl, [class*="bg-white"], [class*="bg-slate-50"]');
            const hasCardClass =
              hasCardInner ||
              cls.includes('glass-card') ||
              cls.includes('rounded-3xl') ||
              cls.includes('rounded-2xl') ||
              cls.includes('bg-white') ||
              cls.includes('bg-slate-50') ||
              cls.includes('bg-gray-50');

            const isLayoutSplit =
              cls.includes('col-span-7') ||
              cls.includes('col-span-5') ||
              cls.includes('col-span-8') ||
              cls.includes('col-span-4');

            // Skip page hero column splits
            if (isLayoutSplit && c.querySelector('h1')) return false;

            return hasCardClass;
          });

          // Only consider multi-card sibling rows (2+ cards)
          if (directCards.length >= 2) {
            // Check if sibling widths are uniform (cards in equal columns)
            const widths = directCards.map((c) => Math.round(c.getBoundingClientRect().width));
            const widthDiff = Math.max(...widths) - Math.min(...widths);

            if (widthDiff <= 32) {
              // Group cards by their row (top Y position)
              const rowMap = new Map();
              directCards.forEach((c) => {
                const top = Math.round(c.getBoundingClientRect().top);
                // Group items within 12px vertical proximity
                let matchedRow = null;
                for (const existingTop of rowMap.keys()) {
                  if (Math.abs(existingTop - top) <= 12) {
                    matchedRow = existingTop;
                    break;
                  }
                }
                const key = matchedRow !== null ? matchedRow : top;
                if (!rowMap.has(key)) rowMap.set(key, []);
                rowMap.get(key).push(c);
              });

              // Measure each multi-card row
              rowMap.forEach((rowCards, rowY) => {
                if (rowCards.length >= 2) {
                  const heights = rowCards.map((c) => Math.round(c.getBoundingClientRect().height));
                  const minH = Math.min(...heights);
                  const maxH = Math.max(...heights);
                  const diff = maxH - minH;

                  // Find nearest preceding heading for identification
                  let headingText = 'Card Grid';
                  let curr = grid;
                  for (let d = 0; d < 3; d++) {
                    if (!curr) break;
                    const prevHeading = curr.closest('section')?.querySelector('h2, h3');
                    if (prevHeading) {
                      headingText = prevHeading.textContent.trim().slice(0, 40);
                      break;
                    }
                    curr = curr.parentElement;
                  }

                  groupsFound.push({
                    heading: headingText,
                    cardCount: rowCards.length,
                    heights: heights.join(', '),
                    heightDiff: diff,
                    isEqual: diff <= 1,
                  });
                }
              });
            }
          }
        });

        // Measure each footer grid independently
        const footerGrids = Array.from(document.querySelectorAll('footer .grid'));
        footerGrids.forEach((fGrid, fIdx) => {
          const cols = Array.from(fGrid.children);
          if (cols.length >= 2) {
            const heights = cols.map((c) => Math.round(c.getBoundingClientRect().height));
            const diff = Math.max(...heights) - Math.min(...heights);
            groupsFound.push({
              heading: fIdx === 0 ? 'Footer Newsletter & Brand Grid' : 'Footer Navigation Sitemapped Columns',
              cardCount: cols.length,
              heights: heights.join(', '),
              heightDiff: diff,
              isEqual: diff <= 1,
            });
          }
        });

        return {
          currentUrl: window.location.pathname,
          groupsFound,
        };
      }, route.path);

      if (inspection.groupsFound.length > 0) {
        auditResults.push({
          path: route.path,
          name: route.name,
          type: route.type,
          groupsCount: inspection.groupsFound.length,
          allEqual: inspection.groupsFound.every((g) => g.isEqual) ? 'PASS ✅' : 'FAIL ❌',
        });

        inspection.groupsFound.forEach((g) => {
          cardGroupDetails.push({
            route: route.path,
            section: g.heading,
            cardsInRow: g.cardCount,
            heightsPx: g.heights,
            diffPx: g.heightDiff,
            status: g.isEqual ? 'PASS ✅' : 'FAIL ❌',
          });
        });
      } else {
        routesWithoutCardGroups.push({
          path: route.path,
          name: route.name,
          type: route.type,
          reason: route.type === 'Redirect'
            ? 'Redirects immediately to target'
            : route.type === 'Legal'
            ? 'Long-form single column legal text document'
            : route.type === 'Admin Auth'
            ? 'Single centered login authentication box'
            : route.type === 'Utility'
            ? 'Single status hero card / message'
            : 'Single column layout or form',
        });
      }
    } catch (err) {
      console.error(`Error auditing ${route.path}:`, err.message);
    }
  }

  await browser.close();

  console.log(`\n======================================================`);
  console.log(`📊 ALL 47 ROUTES AUDIT SUMMARY:`);
  console.log(`======================================================`);
  console.log(`Total Routes Checked: ${allRoutes.length}`);
  console.log(`Routes with Card Groups: ${auditResults.length}`);
  console.log(`Routes without Card Groups: ${routesWithoutCardGroups.length}`);
  console.log(`Total Card Groups Measured: ${cardGroupDetails.length}`);
  const passCount = cardGroupDetails.filter((g) => g.status.startsWith('PASS')).length;
  console.log(`Equal-Height Passing Groups (diff <= 1px): ${passCount} / ${cardGroupDetails.length}`);

  console.log(`\n📋 Card Groups Measured Across the Entire Website:`);
  console.table(cardGroupDetails);

  console.log(`\n📋 Routes With No Card Groups:`);
  console.table(routesWithoutCardGroups);

  // Save audit report JSON
  fs.writeFileSync(
    'scripts/audit-47-routes-report.json',
    JSON.stringify(
      {
        totalRoutes: allRoutes.length,
        routesWithCards: auditResults.length,
        routesWithoutCards: routesWithoutCardGroups.length,
        totalCardGroupsMeasured: cardGroupDetails.length,
        passingGroups: passCount,
        cardGroups: cardGroupDetails,
        routesWithoutCardGroups,
      },
      null,
      2
    )
  );

  console.log('Saved scripts/audit-47-routes-report.json');
}

runCoverageAudit().catch(console.error);
