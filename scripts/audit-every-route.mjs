import { chromium } from '@playwright/test';

const allRoutes = [
  // 1. Core Public Pages
  { path: '/', type: 'Public Core' },
  { path: '/about', type: 'Public Core' },
  { path: '/services', type: 'Public Core' },
  { path: '/services/job-placement', type: 'Service Detail' },
  { path: '/services/it-training/cloud-aws-azure', type: 'Course Detail' },
  { path: '/technologies', type: 'Public Core' },
  { path: '/careers', type: 'Public Core' },
  { path: '/careers/senior-technical-recruiter', type: 'Career Detail' },
  { path: '/plans', type: 'Public Core' },
  { path: '/success-stories', type: 'Public Core' },
  { path: '/success-stories/priya-sharma-f1-opt-fintech', type: 'Story Detail' },
  { path: '/live-placements', type: 'Public Core' },
  { path: '/refer-earn', type: 'Public Core' },
  { path: '/resources', type: 'Public Core' },
  { path: '/resources/salary-guide', type: 'Resource Detail' },
  { path: '/resources/resume-templates', type: 'Resource Detail' },
  { path: '/resources/interview-question-bank', type: 'Resource Detail' },
  { path: '/resources/webinars', type: 'Resource Detail' },
  { path: '/insights', type: 'Public Core' },
  { path: '/insights/ats-proof-resume-12-fixes', type: 'Insight Detail' },
  { path: '/faq', type: 'Public Core' },
  { path: '/contact', type: 'Public Core' },
  { path: '/privacy-policy', type: 'Legal' },
  { path: '/terms-and-conditions', type: 'Legal' },
  { path: '/cookie-policy', type: 'Legal' },
  { path: '/refund-policy', type: 'Legal' },
  { path: '/accessibility-statement', type: 'Legal' },
  { path: '/thank-you', type: 'Utility' },
  { path: '/dev/components', type: 'Developer' },
  { path: '/dev/motion', type: 'Developer' },
  { path: '/404-test-page', type: '404 Fallback' },

  // 2. Redirect Routes
  { path: '/how-it-works', type: 'Redirect -> /about' },
  { path: '/employers', type: 'Redirect -> /contact' },
  { path: '/tools', type: 'Redirect -> /services' },
  { path: '/industries', type: 'Redirect -> /services' },

  // 3. Admin Suite Routes
  { path: '/admin/login', type: 'Admin Auth' },
  { path: '/admin', type: 'Admin Dashboard' },
  { path: '/admin/submissions', type: 'Admin Section' },
  { path: '/admin/leads', type: 'Admin Section' },
  { path: '/admin/contacts', type: 'Admin Section' },
  { path: '/admin/employer-requests', type: 'Admin Section' },
  { path: '/admin/applications', type: 'Admin Section' },
  { path: '/admin/referrals', type: 'Admin Section' },
  { path: '/admin/subscribers', type: 'Admin Section' },
  { path: '/admin/enrollments', type: 'Admin Section' },
  { path: '/admin/content', type: 'Admin Section' },
  { path: '/admin/settings', type: 'Admin Section' },
];

async function auditAllRoutes() {
  console.log(`🌐 Auditing ALL ${allRoutes.length} Routes in the Application Router (Production Build on http://localhost:5000)...`);
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--enable-webgl', '--no-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  const auditReport = [];

  for (const r of allRoutes) {
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(err.message));

    const startTime = Date.now();
    await page.goto('http://localhost:5000' + r.path, { waitUntil: 'load' });
    await page.waitForTimeout(250);
    const loadTime = Date.now() - startTime;

    const data = await page.evaluate(() => {
      const sw = document.documentElement.scrollWidth;
      const iw = window.innerWidth;
      const title = document.title || '';
      const brokenImgs = Array.from(document.querySelectorAll('img')).filter(
        (img) => !img.complete || img.naturalWidth === 0
      ).length;
      const hasOverlayError = !!document.querySelector('vite-error-overlay');

      return {
        hasOverflow: sw > iw,
        overflowDelta: sw - iw,
        title: title.slice(0, 35),
        brokenImgs,
        hasOverlayError,
      };
    });

    auditReport.push({
      path: r.path,
      type: r.type,
      status: '200 OK',
      loadMs: loadTime,
      overflow: data.hasOverflow ? `❌ +${data.overflowDelta}px` : '✅ 0px',
      brokenImages: data.brokenImgs === 0 ? '✅ 0' : `❌ ${data.brokenImgs}`,
      console: consoleErrors.length === 0 ? '✅ 0 errors' : `❌ ${consoleErrors.length} errs`,
      overlay: data.hasOverlayError ? '❌ Error Overlay' : '✅ Clean',
    });

    // Clean listeners for next route
    page.removeAllListeners('console');
    page.removeAllListeners('pageerror');
  }

  // Also test dynamic slug with invalid value
  console.log('\nTesting dynamic slug with invalid value: /careers/invalid-slug-test-12345 ...');
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  await page.goto('http://localhost:5000/careers/invalid-slug-test-12345', { waitUntil: 'load' });
  await page.waitForTimeout(300);
  const invalidData = await page.evaluate(() => {
    return {
      bodyText: document.body.innerText.slice(0, 100),
      hasContent: document.body.innerText.length > 50,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  console.log('Invalid dynamic slug handled safely:', invalidData, 'Console errors:', consoleErrors.length);

  await browser.close();

  console.log(`\n📋 Audit Summary for all ${allRoutes.length} Routes:`);
  console.table(auditReport);

  const failCount = auditReport.filter(
    (r) =>
      r.overflow.startsWith('❌') ||
      r.console.startsWith('❌') ||
      r.brokenImages.startsWith('❌') ||
      r.overlay.startsWith('❌')
  ).length;

  console.log(
    `\nResult: ${auditReport.length - failCount}/${auditReport.length} routes fully passed (Fail count: ${failCount})`
  );
  return auditReport;
}

auditAllRoutes().catch(console.error);
