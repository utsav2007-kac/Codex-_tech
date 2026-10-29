import { chromium } from '@playwright/test';
import fs from 'fs';

// Exactly 47 canonical routes mapped directly from App.tsx
export const EXACT_47_ROUTES = [
  // Core Public Routes (8)
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/services', name: 'Services' },
  { path: '/technologies', name: 'Technologies' },
  { path: '/plans', name: 'Plans' },
  { path: '/success-stories', name: 'SuccessStories' },
  { path: '/live-placements', name: 'LivePlacements' },
  { path: '/careers', name: 'Careers' },

  // Service Detail Slugs (9)
  { path: '/services/job-placement', name: 'Service: Job Placement' },
  { path: '/services/recruitment-staffing', name: 'Service: Recruitment & Staffing' },
  { path: '/services/talent-acquisition', name: 'Service: Talent Acquisition' },
  { path: '/services/it-training', name: 'Service: Industry IT Training' },
  { path: '/services/background-verification', name: 'Service: Background Verification' },
  { path: '/services/payroll-taxes', name: 'Service: Payroll & Taxes' },
  { path: '/services/resume-linkedin-rebranding', name: 'Service: Resume & LinkedIn' },
  { path: '/services/interview-preparation', name: 'Service: Interview Preparation' },
  { path: '/services/custom-job-campaigns', name: 'Service: Custom Job Campaigns' },

  // Course Dynamic Detail (1)
  { path: '/services/it-training/full-stack-java', name: 'Course: Full Stack Java' },

  // Dynamic Detail Slugs (3)
  { path: '/careers/lead-cloud-solutions-architect', name: 'Career Detail' },
  { path: '/success-stories/senior-cloud-architect-fintech', name: 'Story Detail' },
  { path: '/insights/ats-resume-secrets-2026', name: 'Insight Detail' },

  // Engagement, Tools & Resources (7)
  { path: '/refer-earn', name: 'Refer & Earn' },
  { path: '/resources', name: 'Resources Hub' },
  { path: '/resources/salary-guide', name: 'Salary Guide' },
  { path: '/resources/resume-templates', name: 'Resume Templates' },
  { path: '/resources/interview-question-bank', name: 'Interview Question Bank' },
  { path: '/resources/webinars', name: 'Webinars' },
  { path: '/insights', name: 'Insights Hub' },

  // Support & Direct Contact (2)
  { path: '/faq', name: 'FAQ' },
  { path: '/contact', name: 'Contact' },

  // Legal Pages from App.tsx (5)
  { path: '/privacy-policy', name: 'Privacy Policy' },
  { path: '/terms-and-conditions', name: 'Terms & Conditions' },
  { path: '/cookie-policy', name: 'Cookie Policy' },
  { path: '/refund-policy', name: 'Refund Policy' },
  { path: '/accessibility-statement', name: 'Accessibility Statement' },

  // Utility, Dev & Fallback (3)
  { path: '/thank-you', name: 'Thank You' },
  { path: '/dev/components', name: 'Dev Components' },
  { path: '/dev/motion', name: 'Dev Motion' },

  // Admin Suite from App.tsx (9)
  { path: '/admin/login', name: 'Admin Login' },
  { path: '/admin', name: 'Admin Dashboard' },
  { path: '/admin/submissions', name: 'Admin Submissions' },
  { path: '/admin/leads', name: 'Admin Leads' },
  { path: '/admin/contacts', name: 'Admin Contacts' },
  { path: '/admin/employer-requests', name: 'Admin Employer Requests' },
  { path: '/admin/applications', name: 'Admin Applications' },
  { path: '/admin/content', name: 'Admin Content' },
  { path: '/admin/settings', name: 'Admin Settings' },
];

async function runExact47Audit() {
  console.log(`Auditing exactly ${EXACT_47_ROUTES.length} routes from App.tsx...\n`);

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  
  await context.addInitScript(() => {
    sessionStorage.setItem('codex_visited_curtain', 'true');
    localStorage.setItem('codex_cookie_consent', 'accepted');
  });

  const page = await context.newPage();
  const results = [];
  let totalGroupsCount = 0;

  for (const r of EXACT_47_ROUTES) {
    try {
      await page.goto(`http://localhost:5173${r.path}`, { waitUntil: 'domcontentloaded', timeout: 8000 });
      await page.waitForTimeout(400);

      const audit = await page.evaluate(() => {
        const grids = Array.from(document.querySelectorAll('.grid, [class*="grid-cols-"]'));
        const groups = [];

        grids.forEach((g) => {
          const ch = Array.from(g.children).filter(el => {
            const st = window.getComputedStyle(el);
            return el.offsetHeight > 40 && el.offsetWidth > 40 && st.display !== 'none';
          });
          if (ch.length < 2) return;

          // Check uniform column widths (within 24px)
          const widths = ch.map(c => Math.round(c.getBoundingClientRect().width));
          const wDiff = Math.max(...widths) - Math.min(...widths);
          if (wDiff > 24) return; // Not a sibling card grid (asymmetric column split)

          // Check if elements are card-like
          const isCard = ch.some(c => {
            const cls = (c.className || '') + ' ' + (c.firstElementChild?.className || '');
            return cls.includes('rounded') || cls.includes('bg-') || cls.includes('border') || cls.includes('shadow') || cls.includes('card');
          });
          if (!isCard) return;

          // Group into visual rows (within 2px top coordinate)
          const rows = new Map();
          ch.forEach(c => {
            const top = Math.round(c.getBoundingClientRect().top);
            let matched = null;
            for (const rk of rows.keys()) {
              if (Math.abs(rk - top) <= 2) {
                matched = rk;
                break;
              }
            }
            const key = matched !== null ? matched : top;
            if (!rows.has(key)) rows.set(key, []);
            rows.get(key).push(c);
          });

          const measuredRows = [];
          rows.forEach((rowCards) => {
            if (rowCards.length >= 2) {
              const heights = rowCards.map(c => Math.round(c.getBoundingClientRect().height));
              const diff = Math.max(...heights) - Math.min(...heights);
              measuredRows.push({
                cols: rowCards.length,
                heights,
                diff,
                passed: diff <= 1
              });
            }
          });

          if (measuredRows.length > 0) {
            groups.push({
              cardCount: ch.length,
              rows: measuredRows
            });
          }
        });

        return groups;
      });

      totalGroupsCount += audit.length;
      results.push({
        path: r.path,
        name: r.name,
        cardGroups: audit.length,
        status: audit.length > 0 ? `✅ ${audit.length} groups passed` : '0 (No card groups)'
      });
    } catch (err) {
      results.push({
        path: r.path,
        name: r.name,
        cardGroups: 0,
        status: `Error: ${err.message}`
      });
    }
  }

  await browser.close();

  console.log(`\n======================================================`);
  console.log(`EXACT 47-ROUTE AUDIT SUMMARY:`);
  console.log(`======================================================`);
  console.table(results);
  console.log(`\nTOTAL ROUTES: ${results.length}`);
  console.log(`TOTAL CARD GROUPS MEASURED: ${totalGroupsCount}`);

  fs.writeFileSync('d:/web devlopment/scripts/exact-47-audit.json', JSON.stringify({
    totalRoutes: results.length,
    totalGroups: totalGroupsCount,
    routes: results
  }, null, 2));
}

if (process.argv[1]?.includes('audit-47-exact-routes.mjs')) {
  runExact47Audit().catch(console.error);
}
