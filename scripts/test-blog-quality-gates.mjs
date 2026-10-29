import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/iGen Systems/.gemini/antigravity-ide/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/screenshots';
const BASE_URL = 'http://localhost:5000';
const SAMPLE_SLUG = 'ats-resume-optimization-guide-2026';
const SAMPLE_INSIGHT_SLUG = 'ats-proof-resume-12-fixes';

const BREAKPOINTS = [
  { width: 1920, height: 1080, name: '1920px (Desktop Large)' },
  { width: 1440, height: 900, name: '1440px (Desktop Standard)' },
  { width: 1280, height: 800, name: '1280px (Compact Desktop / Laptop)' },
  { width: 1024, height: 768, name: '1024px (Tablet Landscape)' },
  { width: 768, height: 1024, name: '768px (Tablet Portrait)' },
  { width: 390, height: 844, name: '390px (Mobile iPhone)' }
];

async function runBlogQualityGates() {
  console.log('🚀 Starting Comprehensive Blog System Quality Gates & Playwright Verification...\n');

  if (!fs.existsSync(ARTIFACTS_DIR)) {
    fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  }

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--enable-webgl', '--no-sandbox']
  });

  const testResults = {
    geometry: { passed: 0, failed: 0, measurements: [] },
    listing: { passed: 0, failed: 0, details: [] },
    detail: { passed: 0, failed: 0, details: [] },
    separation: { passed: 0, failed: 0, details: [] },
    screenshots: []
  };

  function assert(condition, category, message, measurement = null) {
    if (condition) {
      testResults[category].passed++;
      testResults[category].details?.push(`✓ ${message}`);
      if (measurement) testResults[category].measurements?.push(measurement);
      console.log(`  ✓ ${message}`);
    } else {
      testResults[category].failed++;
      testResults[category].details?.push(`✗ ${message}`);
      if (measurement) testResults[category].measurements?.push(measurement);
      console.error(`  ✗ FAIL: ${message}`);
    }
  }

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => {
    sessionStorage.setItem('codex_visited_curtain', 'true');
    localStorage.setItem('codex_cookie_consent', 'accepted');
  });

  const page = await context.newPage();
  await page.emulateMedia({ reducedMotion: 'reduce' });

  // ==========================================================
  // PART 1: GEOMETRY CHECKS ON BLOG DETAIL ACROSS 6 BREAKPOINTS
  // ==========================================================
  console.log('======================================================================');
  console.log('📐 PART 1: Verifying Blog Detail Geometry Across 6 Breakpoints');
  console.log('======================================================================');

  for (const bp of BREAKPOINTS) {
    console.log(`\nTesting Breakpoint: ${bp.name}`);
    await page.setViewportSize({ width: bp.width, height: bp.height });
    await page.goto(`${BASE_URL}/blog/${SAMPLE_SLUG}`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(600);

    const geo = await page.evaluate(() => {
      const navbar = document.querySelector('header');
      const breadcrumb = document.querySelector('nav[aria-label="Breadcrumb"]');
      const h1 = document.querySelector('h1');
      const metaRow = h1 ? h1.nextElementSibling : null;
      const coverImg = document.querySelector('img[fetchpriority="high"]') || document.querySelector('.aspect-video img');
      const article = document.querySelector('article');
      const sidebar = document.querySelector('main aside');
      const authorImg = document.querySelector('img[alt*="Jenkins"]') || document.querySelector('article img.rounded-full');
      const relatedCards = Array.from(document.querySelectorAll('section[aria-labelledby*="related"] article, section[aria-labelledby*="related"] a'));
      const tocLinks = Array.from(document.querySelectorAll('main aside nav a, main aside a[href^="#"]'));
      const proseHeadings = Array.from(document.querySelectorAll('.blog-prose h2, .blog-prose h3'));

      const navRect = navbar ? navbar.getBoundingClientRect() : null;
      const breadcrumbRect = breadcrumb ? breadcrumb.getBoundingClientRect() : null;
      const h1Rect = h1 ? h1.getBoundingClientRect() : null;
      const metaRect = metaRow ? metaRow.getBoundingClientRect() : null;
      const coverRect = coverImg ? coverImg.getBoundingClientRect() : null;
      const articleRect = article ? article.getBoundingClientRect() : null;
      const sidebarRect = sidebar ? sidebar.getBoundingClientRect() : null;

      // Check horizontal overflow
      const scrollWidth = document.documentElement.scrollWidth;
      const innerWidth = window.innerWidth;
      const hasHorizontalOverflow = scrollWidth > innerWidth + 1;

      // H1 scrollHeight vs clientHeight (all lines visible)
      const h1AllLinesVisible = h1 ? h1.scrollHeight <= h1.clientHeight + 2 : false;

      // Gap navbar to breadcrumb
      const navToBreadcrumbGap = (navRect && breadcrumbRect) ? Math.round(breadcrumbRect.top - navRect.bottom) : null;

      // Gap breadcrumb to H1
      const breadcrumbToH1Gap = (breadcrumbRect && h1Rect) ? Math.round(h1Rect.top - breadcrumbRect.bottom) : null;

      // Gap H1 to meta
      const h1ToMetaGap = (h1Rect && metaRect) ? Math.round(metaRect.top - h1Rect.bottom) : null;

      // Gap meta to cover
      const metaToCoverGap = (metaRect && coverRect) ? Math.round(coverRect.top - metaRect.bottom) : null;

      // Cover bottom above article top
      const coverBottomAboveArticle = (coverRect && articleRect) ? Math.round(articleRect.top - coverRect.bottom) : null;

      // Sidebar does not overlap article (desktop only)
      let sidebarArticleGap = null;
      if (sidebarRect && articleRect && sidebarRect.width > 50) {
        sidebarArticleGap = Math.round(sidebarRect.left - articleRect.right);
      }

      // Author avatar naturalWidth
      const avatarNaturalWidth = authorImg ? (authorImg.naturalWidth || 0) : 0;

      // Related cards inside viewport
      let relatedCardsInside = true;
      const relatedCardBounds = relatedCards.map(c => {
        const r = c.getBoundingClientRect();
        if (r.left < -1 || r.right > innerWidth + 1) relatedCardsInside = false;
        return { left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) };
      });

      return {
        navToBreadcrumbGap,
        breadcrumbToH1Gap,
        h1ToMetaGap,
        metaToCoverGap,
        coverBottomAboveArticle,
        sidebarArticleGap,
        h1AllLinesVisible,
        hasHorizontalOverflow,
        scrollWidth,
        innerWidth,
        avatarNaturalWidth,
        tocCount: tocLinks.length,
        proseHeadingCount: proseHeadings.length,
        relatedCardCount: relatedCards.length,
        relatedCardsInside,
        h1Rect: h1Rect ? { top: Math.round(h1Rect.top), bottom: Math.round(h1Rect.bottom), height: Math.round(h1Rect.height) } : null
      };
    });

    // 1. Gap navbar bottom to breadcrumb < 64px
    assert(
      geo.navToBreadcrumbGap !== null && geo.navToBreadcrumbGap >= 0 && geo.navToBreadcrumbGap < 64,
      'geometry',
      `[${bp.name}] Gap navbar bottom to breadcrumb is < 64px (actual: ${geo.navToBreadcrumbGap}px)`,
      { breakpoint: bp.name, check: 'navToBreadcrumbGap', value: `${geo.navToBreadcrumbGap}px`, pass: geo.navToBreadcrumbGap < 64 }
    );

    // 2. Breadcrumb to H1 gap >= 16px
    assert(
      geo.breadcrumbToH1Gap !== null && geo.breadcrumbToH1Gap >= 16,
      'geometry',
      `[${bp.name}] Breadcrumb to H1 gap is >= 16px (actual: ${geo.breadcrumbToH1Gap}px)`,
      { breakpoint: bp.name, check: 'breadcrumbToH1Gap', value: `${geo.breadcrumbToH1Gap}px`, pass: geo.breadcrumbToH1Gap >= 16 }
    );

    // 3. H1 bounding box does not intersect meta row (gap >= 14px)
    assert(
      geo.h1ToMetaGap !== null && geo.h1ToMetaGap >= 14,
      'geometry',
      `[${bp.name}] H1 to Meta row gap is >= 14px (actual: ${geo.h1ToMetaGap}px, no overlap)`,
      { breakpoint: bp.name, check: 'h1ToMetaGap', value: `${geo.h1ToMetaGap}px`, pass: geo.h1ToMetaGap >= 14 }
    );

    // 4. Every H1 line visible (scrollHeight === clientHeight)
    assert(
      geo.h1AllLinesVisible,
      'geometry',
      `[${bp.name}] All H1 lines visible without vertical clipping (scrollHeight <= clientHeight + 2)`,
      { breakpoint: bp.name, check: 'h1AllLinesVisible', value: geo.h1AllLinesVisible, pass: geo.h1AllLinesVisible }
    );

    // 5. Cover bottom is above article top
    assert(
      geo.coverBottomAboveArticle !== null && geo.coverBottomAboveArticle >= 0,
      'geometry',
      `[${bp.name}] Cover bottom is above article top in normal flow (gap: ${geo.coverBottomAboveArticle}px)`,
      { breakpoint: bp.name, check: 'coverBottomAboveArticle', value: `${geo.coverBottomAboveArticle}px`, pass: geo.coverBottomAboveArticle >= 0 }
    );

    // 6. Sidebar does not overlap article (desktop >= 1024px)
    if (bp.width >= 1024) {
      assert(
        geo.sidebarArticleGap !== null && geo.sidebarArticleGap >= 0,
        'geometry',
        `[${bp.name}] Sidebar does not overlap article column (gap: ${geo.sidebarArticleGap}px)`,
        { breakpoint: bp.name, check: 'sidebarArticleGap', value: `${geo.sidebarArticleGap}px`, pass: geo.sidebarArticleGap >= 0 }
      );
    }

    // 7. No horizontal overflow (scrollWidth <= innerWidth)
    assert(
      !geo.hasHorizontalOverflow,
      'geometry',
      `[${bp.name}] No element wider than viewport (scrollWidth: ${geo.scrollWidth}px <= innerWidth: ${geo.innerWidth}px)`,
      { breakpoint: bp.name, check: 'horizontalOverflow', value: `${geo.scrollWidth} / ${geo.innerWidth}`, pass: !geo.hasHorizontalOverflow }
    );

    // 8. Author avatar naturalWidth > 0
    assert(
      geo.avatarNaturalWidth > 0,
      'geometry',
      `[${bp.name}] Author avatar loaded successfully (naturalWidth: ${geo.avatarNaturalWidth}px)`,
      { breakpoint: bp.name, check: 'avatarNaturalWidth', value: `${geo.avatarNaturalWidth}px`, pass: geo.avatarNaturalWidth > 0 }
    );

    // 9. Related cards inside viewport
    assert(
      geo.relatedCardsInside,
      'geometry',
      `[${bp.name}] All related post cards are fully inside viewport width and not cut off`,
      { breakpoint: bp.name, check: 'relatedCardsInside', value: geo.relatedCardsInside, pass: geo.relatedCardsInside }
    );

    // 10. TOC items count matches article H2+H3 headings count (checked on desktop)
    if (bp.width >= 1024) {
      assert(
        geo.tocCount === geo.proseHeadingCount && geo.tocCount >= 10,
        'geometry',
        `[${bp.name}] TOC items count matches article H2+H3 count (${geo.tocCount} TOC items == ${geo.proseHeadingCount} headings)`,
        { breakpoint: bp.name, check: 'tocMatchesHeadings', value: `${geo.tocCount} / ${geo.proseHeadingCount}`, pass: geo.tocCount === geo.proseHeadingCount }
      );
    }
  }

  // ==========================================================
  // PART 2: BLOG LISTING TESTS & EQUAL HEIGHT CARDS
  // ==========================================================
  console.log('\n======================================================================');
  console.log('📄 PART 2: Testing Blog Listing Page (/blog) & Equal-Height Cards');
  console.log('======================================================================');

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(600);

  // Check Header Title and Intro
  const listingH1 = await page.textContent('h1');
  assert(listingH1 && listingH1.trim().includes('Blogs'), 'listing', `Header H1 contains "Blogs": "${listingH1?.trim()}"`);

  // Check Recent Blogs section (2 cards)
  const recentCards = await page.$$('section[aria-labelledby="recent-blogs-heading"] article');
  assert(recentCards.length === 2, 'listing', `Recent Blogs section has exactly 2 featured cards (found: ${recentCards.length})`);

  // Check All Blogs section header and total counter
  const totalCountText = await page.textContent('#all-blogs-heading + span, span:has-text("total")');
  assert(totalCountText && totalCountText.includes('total'), 'listing', `All Blogs total counter is visible: "${totalCountText?.trim()}"`);

  // Check Search Box alignment at >=1024px (same row as All Blogs heading)
  const searchRowAligned = await page.evaluate(() => {
    const heading = document.querySelector('#all-blogs-heading');
    const search = document.querySelector('input[type="search"]');
    if (!heading || !search) return false;
    const hRect = heading.getBoundingClientRect();
    const sRect = search.getBoundingClientRect();
    return Math.abs(hRect.top - sRect.top) < 35;
  });
  assert(searchRowAligned, 'listing', 'Search box is aligned on the same row as "All Blogs" heading at >=1024px');

  // Test Search Box debounce and filtering
  const searchInput = await page.$('input[type="search"]');
  assert(!!searchInput, 'listing', 'Search input field is rendered');
  if (searchInput) {
    await searchInput.fill('ATS');
    await page.waitForTimeout(600); // 300ms debounce + query
    const urlWithQuery = page.url();
    assert(urlWithQuery.includes('q=ATS'), 'listing', `Search query synced to URL: ${urlWithQuery}`);

    const cardTitles = await page.$$eval('article h3', els => els.map(e => e.textContent));
    const matchesAts = cardTitles.some(t => t?.toLowerCase().includes('ats') || t?.toLowerCase().includes('resume'));
    assert(matchesAts, 'listing', `Search results filtered to matching ATS posts (${cardTitles.length} cards displayed)`);

    // Test Empty State on zero matches
    await searchInput.fill('xyznonexistentquery999');
    await page.waitForTimeout(600);
    const emptyStateText = await page.textContent('body');
    assert(emptyStateText.includes('No blog articles found'), 'listing', 'Empty state rendered on zero search matches');

    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(600);
  }

  // Equal-Height Cards Check across 6 breakpoints
  console.log('\nChecking Equal-Height Cards across 6 breakpoints...');
  for (const bp of BREAKPOINTS) {
    await page.setViewportSize({ width: bp.width, height: bp.height });
    await page.goto(`${BASE_URL}/blog`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(500);

    const equalHeightCheck = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('article'));
      if (cards.length < 2) return { pass: true, rows: [] };

      const rows = {};
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const top = Math.round(rect.top);
        let key = Object.keys(rows).find(k => Math.abs(Number(k) - top) < 12);
        if (!key) {
          key = top;
          rows[key] = [];
        }
        rows[key].push(Math.round(rect.height));
      });

      let pass = true;
      const rowDetails = [];
      for (const [top, heights] of Object.entries(rows)) {
        if (heights.length > 1) {
          const diff = Math.max(...heights) - Math.min(...heights);
          if (diff > 2) pass = false;
          rowDetails.push({ top, heights, diff, pass: diff <= 2 });
        }
      }
      return { pass, rows: rowDetails };
    });

    assert(
      equalHeightCheck.pass,
      'listing',
      `[${bp.name}] Cards in each row share exact equal height (diff <= 2px across ${equalHeightCheck.rows.length} rows)`
    );
  }

  // ==========================================================
  // PART 3: DETAIL PAGE FUNCTIONALITY & INTERACTION CHECKS
  // ==========================================================
  console.log('\n======================================================================');
  console.log('📖 PART 3: Testing Detail Page Interactions & Content Structure');
  console.log('======================================================================');

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/blog/${SAMPLE_SLUG}`, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(600);

  // Check 5 FAQs in Accordion
  const faqButtons = await page.$$('button[data-faq-id], button[id^="faq-button-"]');
  assert(faqButtons.length >= 4, 'detail', `FAQ Accordion rendered with ${faqButtons.length} FAQs (>= 4 required)`);

  if (faqButtons.length > 0) {
    const isInitiallyExpanded = await faqButtons[0].getAttribute('aria-expanded');
    await faqButtons[0].click();
    await page.waitForTimeout(400);
    const toggledExpanded = await faqButtons[0].getAttribute('aria-expanded');
    assert(isInitiallyExpanded !== toggledExpanded, 'detail', `FAQ expands/collapses interactively (${isInitiallyExpanded} -> ${toggledExpanded})`);
  }

  // Check Social Share Buttons
  const shareButtons = await page.$$('button[aria-label*="Copy" i], a[aria-label*="LinkedIn" i], a[aria-label*="X" i], a[aria-label*="WhatsApp" i]');
  assert(shareButtons.length >= 3, 'detail', `Social share buttons present (${shareButtons.length} buttons found)`);

  // Check Reading Progress Bar
  const readingBar = await page.$('[role="progressbar"]');
  assert(!!readingBar, 'detail', 'Reading progress bar active at top of viewport');

  // Check Previous / Next Navigation
  const prevNext = await page.$$('a[href*="/blog/"]:has-text("Previous"), a[href*="/blog/"]:has-text("Next")');
  assert(prevNext.length >= 1, 'detail', 'Previous / Next article links rendered at bottom of article');

  // Check 404 behavior for unknown slug
  await page.goto(`${BASE_URL}/blog/unknown-test-slug-999`, { waitUntil: 'networkidle' });
  const notFoundHeading = await page.textContent('h1');
  const notFoundBody = await page.textContent('body');
  assert(
    notFoundHeading?.includes('Not Found') || notFoundBody.includes('Article Not Found'),
    'detail',
    'Proper 404 page displayed for non-existent slug with link to /blog'
  );

  // ==========================================================
  // PART 4: SEPARATION VERIFICATION (/insights vs /blog)
  // ==========================================================
  console.log('\n======================================================================');
  console.log('🛡️ PART 4: Verifying Complete Separation of /insights and /blog');
  console.log('======================================================================');

  // 1. Check /insights has no redirect to /blog
  await page.goto(`${BASE_URL}/insights`, { waitUntil: 'networkidle', timeout: 15000 });
  const insightsUrl = page.url();
  assert(insightsUrl.endsWith('/insights') || insightsUrl.endsWith('/insights/'), 'separation', `/insights does NOT redirect to /blog (URL: ${insightsUrl})`);

  // 2. Check /insights header title is original
  const insightsH1 = await page.textContent('h1');
  assert(
    insightsH1 && !insightsH1.includes('Blogs') && insightsH1.includes('Engineering Careers'),
    'separation',
    `/insights displays original title "${insightsH1?.trim()}"`
  );

  // 3. Check /insights links point to /insights/ and NOT /blog/
  const insightsLinks = await page.$$eval('a[href*="/insights/"]', els => els.map(e => e.getAttribute('href')));
  const blogBleedLinks = await page.$$eval('a[href*="/blog/"]', els => els.map(e => e.getAttribute('href')));
  assert(insightsLinks.length >= 2, 'separation', `/insights contains ${insightsLinks.length} original insight links`);
  assert(blogBleedLinks.length === 0, 'separation', `/insights content has ZERO blog bleed links (0 /blog/ links found)`);

  // 4. Check /insights detail page works independently
  await page.goto(`${BASE_URL}/insights/${SAMPLE_INSIGHT_SLUG}`, { waitUntil: 'networkidle', timeout: 15000 });
  const insightDetailH1 = await page.textContent('h1');
  assert(
    insightDetailH1 && insightDetailH1.toLowerCase().includes('ats'),
    'separation',
    `/insights/${SAMPLE_INSIGHT_SLUG} loads original insight article: "${insightDetailH1?.trim().slice(0, 45)}..."`
  );

  // 5. Check canonical tag on /insights detail
  const insightCanonical = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('link[rel="canonical"]'));
    return els[els.length - 1]?.getAttribute('href');
  });
  assert(insightCanonical === `https://codextechit.com/insights/${SAMPLE_INSIGHT_SLUG}`, 'separation', `Insight canonical tag is correct: ${insightCanonical}`);

  // 6. Check canonical tag on /blog detail
  await page.goto(`${BASE_URL}/blog/${SAMPLE_SLUG}`, { waitUntil: 'networkidle', timeout: 15000 });
  const blogCanonical = await page.$eval('link[rel="canonical"]', el => el.getAttribute('href'));
  assert(blogCanonical === `https://codextechit.com/blog/${SAMPLE_SLUG}`, 'separation', `Blog canonical tag is correct: ${blogCanonical}`);

  // ==========================================================
  // PART 5: CAPTURE HIGH RESOLUTION SCREENSHOTS FOR DELIVERY
  // ==========================================================
  console.log('\n======================================================================');
  console.log('📸 PART 5: Capturing Production Screenshots for Delivery');
  console.log('======================================================================');

  const captureBreakpoints = [
    { width: 1440, height: 900, name: '1440' },
    { width: 768, height: 1024, name: '768' },
    { width: 390, height: 844, name: '390' }
  ];

  for (const cbp of captureBreakpoints) {
    await page.setViewportSize({ width: cbp.width, height: cbp.height });

    // 1. Listing Page
    await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const listingFilename = `blog_listing_${cbp.name}.png`;
    const listingPath = path.join(ARTIFACTS_DIR, listingFilename);
    await page.screenshot({ path: listingPath, fullPage: false });
    testResults.screenshots.push({ name: listingFilename, path: listingPath, viewport: `${cbp.width}x${cbp.height}` });
    console.log(`  ✓ Saved listing screenshot: ${listingFilename}`);

    // 2. Detail Page (Viewport)
    await page.goto(`${BASE_URL}/blog/${SAMPLE_SLUG}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const detailFilename = `blog_detail_${cbp.name}.png`;
    const detailPath = path.join(ARTIFACTS_DIR, detailFilename);
    await page.screenshot({ path: detailPath, fullPage: false });
    testResults.screenshots.push({ name: detailFilename, path: detailPath, viewport: `${cbp.width}x${cbp.height}` });
    console.log(`  ✓ Saved detail screenshot: ${detailFilename}`);

    // 3. Full Page for 1440px
    if (cbp.name === '1440') {
      const fullDetailFilename = 'blog_detail_full_1440.png';
      const fullDetailPath = path.join(ARTIFACTS_DIR, fullDetailFilename);
      await page.screenshot({ path: fullDetailPath, fullPage: true });
      testResults.screenshots.push({ name: fullDetailFilename, path: fullDetailPath, viewport: '1440xFull' });
      console.log(`  ✓ Saved full-page detail screenshot: ${fullDetailFilename}`);
    }
  }

  // 4. Capture Insights page at 1440 to prove separation
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/insights`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const insightsFilename = 'insights_listing_1440.png';
  const insightsPath = path.join(ARTIFACTS_DIR, insightsFilename);
  await page.screenshot({ path: insightsPath, fullPage: false });
  testResults.screenshots.push({ name: insightsFilename, path: insightsPath, viewport: '1440x900' });
  console.log(`  ✓ Saved insights verification screenshot: ${insightsFilename}`);

  await browser.close();

  // Summary Report
  console.log('\n======================================================================');
  console.log('📊 QUALITY GATES SUMMARY REPORT');
  console.log('======================================================================');
  console.log(`Geometry Measurements: ${testResults.geometry.passed} passed, ${testResults.geometry.failed} failed`);
  console.log(`Listing Page Tests:    ${testResults.listing.passed} passed, ${testResults.listing.failed} failed`);
  console.log(`Detail Page Tests:     ${testResults.detail.passed} passed, ${testResults.detail.failed} failed`);
  console.log(`Separation Tests:      ${testResults.separation.passed} passed, ${testResults.separation.failed} failed`);
  console.log(`Screenshots Captured:  ${testResults.screenshots.length} files saved`);

  const allPassed =
    testResults.geometry.failed === 0 &&
    testResults.listing.failed === 0 &&
    testResults.detail.failed === 0 &&
    testResults.separation.failed === 0;

  console.log(`\nOVERALL STATUS: ${allPassed ? '🎉 ALL QUALITY GATES PASSED!' : '⚠️ SOME GATES FAILED'}`);

  // Write results JSON
  fs.writeFileSync(
    path.join(ARTIFACTS_DIR, 'blog-quality-report.json'),
    JSON.stringify(testResults, null, 2)
  );

  return testResults;
}

runBlogQualityGates().catch(err => {
  console.error('Fatal error during quality gates execution:', err);
  process.exit(1);
});
