import { chromium } from '@playwright/test';
import fs from 'fs';

// All 47 actual routes from App.tsx (including core, dynamic, resources, legal, and admin)
const ALL_47_APP_ROUTES = [
  // 1. Core Public Pages (8)
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/services', name: 'Services' },
  { path: '/technologies', name: 'Technologies' },
  { path: '/plans', name: 'Plans' },
  { path: '/success-stories', name: 'SuccessStories' },
  { path: '/live-placements', name: 'LivePlacements' },
  { path: '/careers', name: 'Careers' },

  // 2. Services Dynamic Slugs (9)
  { path: '/services/job-placement', name: 'Service: Job Placement' },
  { path: '/services/recruitment-staffing', name: 'Service: Recruitment & Staffing' },
  { path: '/services/talent-acquisition', name: 'Service: Talent Acquisition' },
  { path: '/services/it-training', name: 'Service: Industry IT Training' },
  { path: '/services/background-verification', name: 'Service: Background Verification' },
  { path: '/services/payroll-taxes', name: 'Service: Payroll & Taxes' },
  { path: '/services/resume-linkedin-rebranding', name: 'Service: Resume & LinkedIn' },
  { path: '/services/interview-preparation', name: 'Service: Interview Preparation' },
  { path: '/services/custom-job-campaigns', name: 'Service: Custom Job Campaigns' },

  // 3. Course Dynamic Slug (1)
  { path: '/services/it-training/full-stack-java', name: 'Course: Full Stack Java' },

  // 4. Dynamic Detail Slugs (3)
  { path: '/careers/lead-cloud-solutions-architect', name: 'Career Detail: Lead Cloud Arch' },
  { path: '/success-stories/senior-cloud-architect-fintech', name: 'Story Detail: Senior Cloud Arch' },
  { path: '/insights/ats-resume-secrets-2026', name: 'Insight Detail: ATS Resume Secrets' },

  // 5. Engagement & Resources Hubs (7)
  { path: '/refer-earn', name: 'Refer & Earn' },
  { path: '/resources', name: 'Resources Hub' },
  { path: '/resources/salary-guide', name: 'Resource: Salary Guide' },
  { path: '/resources/resume-templates', name: 'Resource: Resume Templates' },
  { path: '/resources/interview-question-bank', name: 'Resource: Interview Questions' },
  { path: '/resources/webinars', name: 'Resource: Webinars' },
  { path: '/insights', name: 'Insights / Blog Hub' },

  // 6. Direct Utility & Legal (8)
  { path: '/faq', name: 'FAQ' },
  { path: '/contact', name: 'Contact Us' },
  { path: '/privacy-policy', name: 'Privacy Policy' },
  { path: '/terms-and-conditions', name: 'Terms & Conditions' },
  { path: '/cookie-policy', name: 'Cookie Policy' },
  { path: '/refund-policy', name: 'Refund Policy' },
  { path: '/accessibility-statement', name: 'Accessibility Statement' },
  { path: '/thank-you', name: 'Thank You' },

  // 7. Admin Suite (11)
  { path: '/admin/login', name: 'Admin: Login' },
  { path: '/admin', name: 'Admin: Dashboard' },
  { path: '/admin/submissions', name: 'Admin: Submissions' },
  { path: '/admin/leads', name: 'Admin: Leads' },
  { path: '/admin/contacts', name: 'Admin: Contacts' },
  { path: '/admin/employer-requests', name: 'Admin: Employer Requests' },
  { path: '/admin/applications', name: 'Admin: Applications' },
  { path: '/admin/referrals', name: 'Admin: Referrals' },
  { path: '/admin/subscribers', name: 'Admin: Subscribers' },
  { path: '/admin/enrollments', name: 'Admin: Enrollments' },
  { path: '/admin/content', name: 'Admin: Content' },
];

async function measureDeepAudit() {
  console.log('🚀 Running Comprehensive Deep Audit on Real Content & Layout...\n');

  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  // ----------------------------------------------------
  // SECTION A: Measure Real Content on About & Home Pages
  // ----------------------------------------------------
  console.log('--- SECTION A: Measuring Real Cards on About & Home (1920px & 1440px) ---');
  {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.addInitScript(() => {
      sessionStorage.setItem('codex_visited_curtain', 'true');
      localStorage.setItem('codex_cookie_consent', 'accepted');
    });

    // 1. About Page: Real Milestones Cards
    await page.goto('http://localhost:5173/about', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    const milestonesData = await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Trajectory'));
      const section = heading?.closest('section');
      const cards = Array.from(section?.querySelectorAll('.grid > div') || []);

      return cards.map((c, i) => {
        const cardBox = c.getBoundingClientRect();
        const titleEl = c.querySelector('h3');
        const descEl = c.querySelector('p');
        const titleBox = titleEl?.getBoundingClientRect();
        const descBox = descEl?.getBoundingClientRect();

        return {
          index: i,
          titleText: titleEl?.innerText.trim(),
          cardHeight: Math.round(cardBox.height),
          titleTopRelative: Math.round((titleBox?.top || 0) - cardBox.top),
          titleBottomRelative: Math.round((titleBox?.bottom || 0) - cardBox.top),
          titleHeight: Math.round(titleBox?.height || 0),
          descTopRelative: Math.round((descBox?.top || 0) - cardBox.top),
          gapBetweenTitleAndDesc: Math.round((descBox?.top || 0) - (titleBox?.bottom || 0)),
        };
      });
    });

    console.log('REAL MILESTONES DATA AT 1920px:', JSON.stringify(milestonesData, null, 2));

    // 2. Home Page: Real "Wherever You Are, There's A Next Step" Cards
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    const nextStepData = await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.toLowerCase().includes('next step'));
      const section = heading?.closest('section');
      const cards = Array.from(section?.querySelectorAll('.grid > div') || []);

      return cards.map((c, i) => {
        const cardBox = c.getBoundingClientRect();
        const titleEl = c.querySelector('h3');
        const descEl = c.querySelector('p');
        const ctaEl = c.querySelector('a, button');
        const titleBox = titleEl?.getBoundingClientRect();
        const descBox = descEl?.getBoundingClientRect();
        const ctaBox = ctaEl?.getBoundingClientRect();

        return {
          index: i,
          titleText: titleEl?.innerText.trim(),
          cardHeight: Math.round(cardBox.height),
          titleTopRelative: Math.round((titleBox?.top || 0) - cardBox.top),
          titleHeight: Math.round(titleBox?.height || 0),
          descTopRelative: Math.round((descBox?.top || 0) - cardBox.top),
          ctaBottomRelative: Math.round((ctaBox?.bottom || 0) - cardBox.top),
        };
      });
    });

    console.log('REAL NEXT STEP DATA AT 1920px:', JSON.stringify(nextStepData, null, 2));
    await page.close();
  }

  // ----------------------------------------------------
  // SECTION B: Measure Adjacent Section Gap (Milestones & Pillars)
  // ----------------------------------------------------
  console.log('\n--- SECTION B: Measuring Real Inter-Section Spacing ---');
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:5173/about', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    const spacingData = await page.evaluate(() => {
      // Find Pillars section (Section 3) and Milestones section (Section 4)
      const pillarsHeading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Pillars'));
      const pillarsSection = pillarsHeading?.closest('section');
      const pillarsLastCard = pillarsSection?.querySelectorAll('.grid > *');
      const lastPillarCard = pillarsLastCard ? pillarsLastCard[pillarsLastCard.length - 1] : null;

      const milestonesHeading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Trajectory'));
      const milestonesSection = milestonesHeading?.closest('section');

      const lastCardBottom = lastPillarCard ? lastPillarCard.getBoundingClientRect().bottom : 0;
      const milestonesHeadingTop = milestonesHeading ? milestonesHeading.getBoundingClientRect().top : 0;
      const milestonesSectionTop = milestonesSection ? milestonesSection.getBoundingClientRect().top : 0;

      return {
        pillarsSectionPaddingBottom: window.getComputedStyle(pillarsSection).paddingBottom,
        milestonesSectionPaddingTop: window.getComputedStyle(milestonesSection).paddingTop,
        gapBetweenLastCardAndNextHeading: Math.round(milestonesHeadingTop - lastCardBottom),
        distanceBetweenSectionBoundaries: Math.round(milestonesSectionTop - (pillarsSection?.getBoundingClientRect().bottom || 0)),
      };
    });

    console.log('SPACING DATA (Pillars -> Milestones):', spacingData);
    await page.close();
  }

  // ----------------------------------------------------
  // SECTION C: Bounding Box Distance: Section Rail vs Nearest Card
  // ----------------------------------------------------
  console.log('\n--- SECTION C: Measuring Rail vs Nearest Card Clearance (1280, 1366, 1440, 1536px) ---');
  const railBreakpoints = [1280, 1366, 1440, 1536];
  const railMeasurements = [];

  for (const w of railBreakpoints) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const railDist = await page.evaluate((vpWidth) => {
      const rail = document.querySelector('nav[aria-label="Page scroll position"]');
      if (!rail) return { hasRail: false };

      const railBox = rail.getBoundingClientRect();
      const allCards = Array.from(document.querySelectorAll('.glass-card, [class*="rounded-2xl"], [class*="rounded-3xl"]'));
      
      let nearestCard = null;
      let minClearance = 9999;

      allCards.forEach(c => {
        const box = c.getBoundingClientRect();
        // Look at cards on the right side of the screen
        if (box.right > vpWidth * 0.5 && box.width > 50 && box.height > 50) {
          const clearance = railBox.left - box.right;
          if (clearance < minClearance) {
            minClearance = clearance;
            nearestCard = {
              cardRight: Math.round(box.right),
              tag: c.tagName,
              className: c.className.slice(0, 40)
            };
          }
        }
      });

      return {
        viewportWidth: vpWidth,
        hasRail: true,
        railLeft: Math.round(railBox.left),
        railRight: Math.round(railBox.right),
        railWidth: Math.round(railBox.width),
        nearestCardRight: nearestCard?.cardRight,
        clearancePx: Math.round(minClearance),
        passes16px: minClearance >= 16
      };
    }, w);

    railMeasurements.push(railDist);
    await page.close();
  }

  console.table(railMeasurements);

  // ----------------------------------------------------
  // SECTION D: Exact Route Audit for ALL 47 Routes
  // ----------------------------------------------------
  console.log(`\n--- SECTION D: Auditing All ${ALL_47_APP_ROUTES.length} Routes for Real Card Groups ---`);
  const routeAuditResults = [];

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(() => {
    sessionStorage.setItem('codex_visited_curtain', 'true');
    localStorage.setItem('codex_cookie_consent', 'accepted');
  });

  for (const r of ALL_47_APP_ROUTES) {
    try {
      await page.goto(`http://localhost:5173${r.path}`, { waitUntil: 'domcontentloaded', timeout: 8000 });
      await page.waitForTimeout(300);

      const audit = await page.evaluate(() => {
        const grids = Array.from(document.querySelectorAll('.grid, [class*="grid-cols-"]'));
        const cardGroups = [];

        grids.forEach((g) => {
          // Exclude hero sections or asymmetric 2-column layout splits
          const ch = Array.from(g.children).filter(el => {
            const st = window.getComputedStyle(el);
            return el.offsetHeight > 35 && el.offsetWidth > 35 && st.display !== 'none';
          });
          if (ch.length < 2) return;

          // Check if children are true card items (have uniform widths within 24px)
          const widths = ch.map(c => Math.round(c.getBoundingClientRect().width));
          const wDiff = Math.max(...widths) - Math.min(...widths);
          if (wDiff > 32) return; // Asymmetric layout split, not a card grid

          // Check if cards have card styling
          const isCardLike = ch.some(c => {
            const cls = (c.className || '') + ' ' + (c.firstElementChild?.className || '');
            return cls.includes('rounded') || cls.includes('bg-') || cls.includes('border') || cls.includes('shadow');
          });
          if (!isCardLike) return;

          // Group by top Y position (visual rows within 2px)
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

          // Measure each multi-card row
          const measuredRows = [];
          rows.forEach((rowCards, rY) => {
            if (rowCards.length >= 2) {
              const heights = rowCards.map(c => Math.round(c.getBoundingClientRect().height));
              const diff = Math.max(...heights) - Math.min(...heights);
              measuredRows.push({
                columns: rowCards.length,
                heights,
                diff,
                passed: diff <= 1
              });
            }
          });

          if (measuredRows.length > 0) {
            cardGroups.push({
              itemCount: ch.length,
              rows: measuredRows,
            });
          }
        });

        return cardGroups;
      });

      routeAuditResults.push({
        path: r.path,
        name: r.name,
        groupsCount: audit.length,
        groups: audit
      });
    } catch (err) {
      routeAuditResults.push({
        path: r.path,
        name: r.name,
        groupsCount: 0,
        error: err.message
      });
    }
  }

  await page.close();
  await browser.close();

  fs.writeFileSync('d:/web devlopment/scripts/deep-audit-results.json', JSON.stringify({
    milestonesData,
    nextStepData,
    railMeasurements,
    routeAuditResults
  }, null, 2));

  console.log('\n✅ Deep Audit complete. Saved results to scripts/deep-audit-results.json.');
}

measureDeepAudit().catch(console.error);
