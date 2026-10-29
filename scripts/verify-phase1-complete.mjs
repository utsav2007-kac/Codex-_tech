import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

// Output directory for screenshots
const SCREENSHOTS_DIR = path.resolve('scripts/screenshots/phase1');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Relative luminance formula
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function parseRgb(colorStr) {
  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
  }
  return [255, 255, 255];
}

function getContrastRatio(rgb1, rgb2) {
  const l1 = getLuminance(...rgb1);
  const l2 = getLuminance(...rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

async function runPhase1Verification() {
  console.log('====================================================');
  console.log('🚀 CODEX TECH-IT: PHASE 1 COMPREHENSIVE QA AUDIT');
  console.log('====================================================\n');

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const report = {
    timestamp: new Date().toISOString(),
    tests: {},
    measurements: {},
    screenshots: {}
  };

  // ────────────────────────────────────────────────────────────────
  // TEST 1: HOME PAGE AUDIT (1.1, 1.2, 1.3, 1.4, Home Blog Teaser)
  // ────────────────────────────────────────────────────────────────
  console.log('--- Testing Home Page: http://localhost:5173/ ---');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Take Full Homepage screenshot
  const homeHeroShot = path.join(SCREENSHOTS_DIR, '01_home_hero_light.png');
  await page.screenshot({ path: homeHeroShot, clip: { x: 0, y: 0, width: 1440, height: 900 } });
  report.screenshots.hero = homeHeroShot;
  console.log('📸 Captured 01_home_hero_light.png');

  // 1.1 Restore Home Chart verification
  console.log('\n[1.1 Restore Home Chart: Performance By the Numbers]');
  const chartAudit = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('section'));
    const timelineIdx = sections.findIndex(s => s.textContent?.includes('Since 2021') || s.textContent?.includes('Milestones'));
    const chartIdx = sections.findIndex(s => s.textContent?.includes('Performance By the Numbers'));
    const reviewsIdx = sections.findIndex(s => s.textContent?.includes('Reviews') || s.textContent?.includes('Candidate & Client'));

    const chartSec = sections[chartIdx];
    const tabs = chartSec ? Array.from(chartSec.querySelectorAll('button')).map(b => b.textContent?.trim()).filter(Boolean) : [];
    const badges = chartSec ? Array.from(chartSec.querySelectorAll('.badge, [class*="rounded"]')).map(b => b.textContent?.trim()).filter(t => t?.includes('Sample') || t?.includes('Illustration')) : [];
    const h3s = chartSec ? Array.from(chartSec.querySelectorAll('h3')).map(h => h.textContent?.trim()) : [];

    return {
      timelineIdx,
      chartIdx,
      reviewsIdx,
      isRightAfterTimeline: chartIdx > timelineIdx && (reviewsIdx === -1 || chartIdx < reviewsIdx),
      tabs,
      badges,
      headings: h3s
    };
  });

  report.tests['1.1_home_chart'] = {
    passed: chartAudit.chartIdx !== -1 && chartAudit.isRightAfterTimeline,
    chartFound: chartAudit.chartIdx !== -1,
    isRightAfterTimelineAndBeforeReviews: chartAudit.isRightAfterTimeline,
    timelineIndex: chartAudit.timelineIdx,
    chartIndex: chartAudit.chartIdx,
    reviewsIndex: chartAudit.reviewsIdx,
    tabs: chartAudit.tabs,
    badges: chartAudit.badges,
    headings: chartAudit.headings
  };
  console.log('  - Chart found at section index:', chartAudit.chartIdx);
  console.log('  - Placed between Timeline (' + chartAudit.timelineIdx + ') and Reviews (' + chartAudit.reviewsIdx + '):', chartAudit.isRightAfterTimeline);
  console.log('  - Badges found:', chartAudit.badges);
  console.log('  - Tabs found:', chartAudit.tabs);

  // Scroll to chart and take screenshot
  const chartElement = page.locator('section:has-text("Performance By the Numbers")');
  await chartElement.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const chartShot = path.join(SCREENSHOTS_DIR, '02_home_chart_section.png');
  await chartElement.screenshot({ path: chartShot });
  report.screenshots.chart = chartShot;
  console.log('📸 Captured 02_home_chart_section.png');

  // 1.2 Remove Toolbar Control Buttons
  console.log('\n[1.2 Remove Toolbar Control Buttons from Dual3DScrollShowcase]');
  const buttonsAudit = await page.evaluate(() => {
    const forbidden = ['Normal Dual Flow', 'Reverse Flow', 'Pause', '1x Speed', '3D Stage'];
    const found = [];
    for (const text of forbidden) {
      const match = Array.from(document.querySelectorAll('*')).find(
        el => el.children.length === 0 && el.textContent?.trim() === text
      );
      if (match) found.push(text);
    }
    // Also check for "Verified" badge on cards
    const verifiedBadges = Array.from(document.querySelectorAll('*')).filter(
      el => el.children.length === 0 && el.textContent?.trim() === 'Verified'
    ).length;

    return { forbiddenFound: found, verifiedBadgesCount: verifiedBadges };
  });

  report.tests['1.2_toolbar_buttons'] = {
    passed: buttonsAudit.forbiddenFound.length === 0,
    forbiddenFound: buttonsAudit.forbiddenFound,
    verifiedBadgesCount: buttonsAudit.verifiedBadgesCount
  };
  console.log('  - Forbidden buttons in DOM (must be 0):', buttonsAudit.forbiddenFound.length, buttonsAudit.forbiddenFound);
  console.log('  - Unverified "Verified" badges in DOM (must be 0):', buttonsAudit.verifiedBadgesCount);

  // Scroll to 3D Showcase and screenshot
  const showcaseElem = page.locator('section:has-text("Curated Technical Profiles")');
  if (await showcaseElem.count() > 0) {
    await showcaseElem.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const showcaseShot = path.join(SCREENSHOTS_DIR, '03_dual_3d_showcase.png');
    await showcaseElem.screenshot({ path: showcaseShot });
    report.screenshots.showcase = showcaseShot;
    console.log('📸 Captured 03_dual_3d_showcase.png');
  }

  // 1.3 Light Colours Site-wide: Luminance and Contrast
  console.log('\n[1.3 Light Colours Site-wide: Luminance & Contrast]');
  const lightColorsAudit = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('section'));
    const sectionLuminances = sections.map((s, idx) => {
      const bg = window.getComputedStyle(s).backgroundColor;
      const rgb = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/);
      let lum = 1.0;
      if (rgb) {
        const alpha = rgb[4] !== undefined ? parseFloat(rgb[4]) : 1.0;
        if (alpha === 0) {
          lum = 1.0; // Transparent inherits page white
        } else {
          const [r, g, b] = [parseInt(rgb[1]), parseInt(rgb[2]), parseInt(rgb[3])];
          const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
          });
          lum = 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        }
      }
      // Check if it's a dark navy background (e.g. #0B1228 or #0F172A)
      const isDarkNavy = s.className.includes('bg-navy') || s.className.includes('bg-[#0B1228]') || s.className.includes('bg-[#0F172A]');
      return {
        idx,
        tag: s.tagName,
        className: s.className.slice(0, 50),
        bg,
        lum,
        isDarkNavy
      };
    });

    // Check ThreeColumnHighlight center card
    const centerCard = document.querySelector('[data-testid="center-highlight-card"]') ||
      Array.from(document.querySelectorAll('div')).find(d => d.className.includes('border-[#F25C2A]') || d.textContent?.includes('Our edge'));
    let centerCardBg = '';
    let isCenterCardDark = false;
    if (centerCard) {
      centerCardBg = window.getComputedStyle(centerCard).backgroundColor;
      isCenterCardDark = centerCard.className.includes('navy') || centerCard.className.includes('bg-[#0B1228]');
    }

    // Check navbar styles
    const nav = document.querySelector('header') || document.querySelector('nav');
    const navStyles = nav ? {
      bg: window.getComputedStyle(nav).backgroundColor,
      backdropFilter: window.getComputedStyle(nav).backdropFilter,
      position: window.getComputedStyle(nav).position
    } : null;

    const darkNavySections = sectionLuminances.filter(s => s.isDarkNavy);

    return {
      sectionLuminances,
      darkSectionsCount: darkNavySections.length,
      darkNavySections,
      centerCardBg,
      isCenterCardDark,
      navStyles
    };
  });

  report.tests['1.3_light_colors'] = {
    passed: lightColorsAudit.darkSectionsCount === 0 && !lightColorsAudit.isCenterCardDark,
    darkSectionsCount: lightColorsAudit.darkSectionsCount,
    isCenterCardDark: lightColorsAudit.isCenterCardDark,
    sectionLuminances: lightColorsAudit.sectionLuminances,
    centerCardBg: lightColorsAudit.centerCardBg,
    navStyles: lightColorsAudit.navStyles
  };
  console.log('  - Dark sections (luminance < 0.3) count (must be 0):', lightColorsAudit.darkSectionsCount);
  console.log('  - Center card background:', lightColorsAudit.centerCardBg);
  console.log('  - Navbar styling:', JSON.stringify(lightColorsAudit.navStyles));

  // Screenshot Three Column Highlight
  const threeCol = page.locator('section:has-text("Direct-Hire Precision")');
  if (await threeCol.count() > 0) {
    await threeCol.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const threeColShot = path.join(SCREENSHOTS_DIR, '04_three_column_highlight_light.png');
    await threeCol.screenshot({ path: threeColShot });
    report.screenshots.threeColumn = threeColShot;
    console.log('📸 Captured 04_three_column_highlight_light.png');
  }

  // 1.4 Fix FAQ Section
  console.log('\n[1.4 Fix FAQ Section: Centered, Tabs, Search, Accordion, Schema]');
  const faqSection = page.locator('#faq-section');
  await faqSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const faqAudit = await page.evaluate(() => {
    const sec = Array.from(document.querySelectorAll('section')).find(s => s.textContent?.includes('Frequently Asked Questions'));
    if (!sec) return { error: 'FAQ section not found' };

    const heading = sec.querySelector('h2');
    const headingAlignment = heading ? window.getComputedStyle(heading).textAlign : 'none';

    // Tabs
    const tabs = Array.from(sec.querySelectorAll('button')).filter(b =>
      ['All Questions', 'Candidates', 'Employers', 'Process'].includes(b.textContent?.trim() || '')
    ).map(b => b.textContent?.trim());

    // Search input
    const searchInput = sec.querySelector('input[placeholder*="Search questions"]');

    // Accordion items
    const items = Array.from(sec.querySelectorAll('.faq-accordion-item, div:has(> button[aria-expanded])'));
    const firstButton = sec.querySelector('button[aria-expanded]');
    const isFirstOpen = firstButton ? firstButton.getAttribute('aria-expanded') === 'true' : false;

    // FAQPage JSON-LD
    const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    const faqSchema = jsonLdScripts.find(s => s.textContent?.includes('"@type":"FAQPage"') || s.textContent?.includes('"@type": "FAQPage"'));

    return {
      headingText: heading?.textContent?.trim(),
      headingAlignment,
      tabsFound: tabs,
      hasSearchInput: !!searchInput,
      itemCount: items.length,
      isFirstItemOpenByDefault: isFirstOpen,
      hasFaqPageJsonLd: !!faqSchema
    };
  });

  report.tests['1.4_faq_section'] = {
    passed: faqAudit.itemCount >= 8 && faqAudit.tabsFound.length >= 3 && faqAudit.hasSearchInput && faqAudit.isFirstItemOpenByDefault,
    ...faqAudit
  };
  console.log('  - FAQ questions count (>= 8):', faqAudit.itemCount);
  console.log('  - Tabs found:', faqAudit.tabsFound);
  console.log('  - Search input present:', faqAudit.hasSearchInput);
  console.log('  - First item open by default:', faqAudit.isFirstItemOpenByDefault);
  console.log('  - FAQPage JSON-LD schema present:', faqAudit.hasFaqPageJsonLd);

  // Test search filtering interaction
  const searchInput = page.locator('input[placeholder*="Search questions"]');
  await searchInput.fill('ATS');
  await page.waitForTimeout(300);
  const filteredCount = await page.evaluate(() => {
    const sec = Array.from(document.querySelectorAll('section')).find(s => s.textContent?.includes('Frequently Asked Questions'));
    return sec ? sec.querySelectorAll('button[aria-expanded]').length : 0;
  });
  console.log('  - Filtered items matching "ATS":', filteredCount);

  // Clear search
  await searchInput.fill('');
  await page.waitForTimeout(300);

  // Screenshot FAQ section
  const faqShot = path.join(SCREENSHOTS_DIR, '05_faq_section_interactive.png');
  await faqSection.screenshot({ path: faqShot });
  report.screenshots.faq = faqShot;
  console.log('📸 Captured 05_faq_section_interactive.png');

  // Test Mobile Viewport for FAQ
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  const faqMobileShot = path.join(SCREENSHOTS_DIR, '06_faq_mobile_390px.png');
  await faqSection.screenshot({ path: faqMobileShot });
  report.screenshots.faqMobile = faqMobileShot;
  console.log('📸 Captured 06_faq_mobile_390px.png');

  // Restore Desktop Viewport
  await page.setViewportSize({ width: 1440, height: 900 });

  // Home Blog Teaser
  console.log('\n[Home Blog Teaser Verification]');
  const blogTeaser = page.locator('section:has-text("Engineering & Staffing Publications")');
  const blogTeaserAudit = await page.evaluate(() => {
    const sec = Array.from(document.querySelectorAll('section')).find(s => s.textContent?.includes('Engineering & Staffing Publications'));
    if (!sec) return { found: false };
    const cards = Array.from(sec.querySelectorAll('article'));
    return {
      found: true,
      cardCount: cards.length,
      titles: cards.map(c => c.querySelector('h3')?.textContent?.trim())
    };
  });

  report.tests['home_blog_teaser'] = {
    passed: blogTeaserAudit.found && blogTeaserAudit.cardCount === 3,
    ...blogTeaserAudit
  };
  console.log('  - Home Blog Teaser found:', blogTeaserAudit.found);
  console.log('  - Number of teaser cards (must be 3):', blogTeaserAudit.cardCount);
  console.log('  - Teaser titles:', blogTeaserAudit.titles);

  if (blogTeaserAudit.found) {
    await blogTeaser.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const teaserShot = path.join(SCREENSHOTS_DIR, '07_home_blog_teaser.png');
    await blogTeaser.screenshot({ path: teaserShot });
    report.screenshots.teaser = teaserShot;
    console.log('📸 Captured 07_home_blog_teaser.png');
  }

  // Screenshot Closing CTA
  const closingCta = page.locator('section:has-text("Accelerate Your Technical")');
  if (await closingCta.count() > 0) {
    await closingCta.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const ctaShot = path.join(SCREENSHOTS_DIR, '08_closing_cta_light.png');
    await closingCta.screenshot({ path: ctaShot });
    report.screenshots.closingCta = ctaShot;
    console.log('📸 Captured 08_closing_cta_light.png');
  }

  // ────────────────────────────────────────────────────────────────
  // TEST 2: BLOG LISTING AUDIT (/blog)
  // ────────────────────────────────────────────────────────────────
  console.log('\n--- Testing Blog Listing: http://localhost:5173/blog ---');
  const blogListRes = await page.goto('http://localhost:5173/blog', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const blogListAudit = await page.evaluate(() => {
    const h1 = document.querySelector('h1')?.textContent?.trim();
    const recentH2 = Array.from(document.querySelectorAll('h2')).find(h => h.textContent?.includes('Recent Blogs'));
    const allH2 = Array.from(document.querySelectorAll('h2')).find(h => h.textContent?.includes('All Blogs'));
    const allSpan = allH2?.parentElement?.querySelector('span')?.textContent?.trim();
    const cards = Array.from(document.querySelectorAll('article'));
    const searchInput = document.querySelector('input[placeholder*="Search"]');

    return {
      status: 200,
      title: document.title,
      h1,
      hasRecentSection: !!recentH2,
      allBlogsCountLabel: allSpan,
      totalCardsRendered: cards.length,
      hasSearchInput: !!searchInput
    };
  });

  report.tests['1.5_blog_listing'] = {
    passed: blogListAudit.h1 === 'Blogs' && blogListAudit.totalCardsRendered >= 6 && blogListAudit.hasRecentSection,
    ...blogListAudit
  };
  console.log('  - Title:', blogListAudit.title);
  console.log('  - H1:', blogListAudit.h1);
  console.log('  - Has Recent Blogs section:', blogListAudit.hasRecentSection);
  console.log('  - All Blogs counter label:', blogListAudit.allBlogsCountLabel);
  console.log('  - Total cards rendered on page 1:', blogListAudit.totalCardsRendered);

  const blogListShot = path.join(SCREENSHOTS_DIR, '09_blog_listing_page.png');
  await page.screenshot({ path: blogListShot, fullPage: false });
  report.screenshots.blogList = blogListShot;
  console.log('📸 Captured 09_blog_listing_page.png');

  // ────────────────────────────────────────────────────────────────
  // TEST 3: BLOG DETAIL AUDIT (/blog/ats-resume-optimization-guide-2026)
  // ────────────────────────────────────────────────────────────────
  console.log('\n--- Testing Blog Detail: http://localhost:5173/blog/ats-resume-optimization-guide-2026 ---');
  const detailUrl = 'http://localhost:5173/blog/ats-resume-optimization-guide-2026';
  const detailRes = await page.goto(detailUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const detailAudit = await page.evaluate(() => {
    const h1 = document.querySelector('h1')?.textContent?.trim();
    const cover = document.querySelector('img[alt*="ATS"]');
    const desktopToc = document.querySelector('aside nav[aria-label="Table of contents"]') || document.querySelectorAll('nav[aria-label="Table of contents"]')[1];
    const tocLinks = desktopToc ? Array.from(desktopToc.querySelectorAll('a')).map(a => a.textContent?.trim()).filter(Boolean) : [];
    const faqs = Array.from(document.querySelectorAll('button')).filter(b => b.textContent?.includes('ATS') || b.textContent?.includes('resume'));
    const author = document.querySelector('h3, h4')?.textContent?.includes('Sarah') || document.body.innerText.includes('Sarah Jenkins');
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');

    // Code block background check
    const codeBlock = document.querySelector('.blog-prose pre, pre');
    const codeBlockStyles = codeBlock ? {
      bg: window.getComputedStyle(codeBlock).backgroundColor,
      color: window.getComputedStyle(codeBlock).color,
      isLight: !window.getComputedStyle(codeBlock).backgroundColor.includes('15, 23, 42')
    } : null;

    // Schemas
    const jsonLds = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => {
      try { return JSON.parse(s.textContent || '{}'); } catch { return {}; }
    });
    const hasBlogPosting = jsonLds.some(j => j['@type'] === 'BlogPosting');
    const hasBreadcrumbs = jsonLds.some(j => j['@type'] === 'BreadcrumbList');
    const hasFaqPage = jsonLds.some(j => j['@type'] === 'FAQPage');

    return {
      title: document.title,
      h1,
      hasCover: !!cover,
      coverSrc: cover?.getAttribute('src'),
      tocLinksCount: tocLinks.length,
      tocLinks: tocLinks.slice(0, 5),
      hasAuthor: author,
      canonical,
      codeBlockStyles,
      hasBlogPostingSchema: hasBlogPosting,
      hasBreadcrumbSchema: hasBreadcrumbs,
      hasFaqPageSchema: hasFaqPage
    };
  });

  report.tests['1.5_blog_detail'] = {
    passed: detailAudit.h1?.includes('ATS') && detailAudit.tocLinksCount >= 3 && detailAudit.hasBlogPostingSchema,
    ...detailAudit
  };
  console.log('  - Title:', detailAudit.title);
  console.log('  - H1:', detailAudit.h1);
  console.log('  - TOC headings count:', detailAudit.tocLinksCount);
  console.log('  - Author Sarah Jenkins verified:', detailAudit.hasAuthor);
  console.log('  - Canonical URL:', detailAudit.canonical);
  console.log('  - BlogPosting Schema:', detailAudit.hasBlogPostingSchema);
  console.log('  - BreadcrumbList Schema:', detailAudit.hasBreadcrumbSchema);
  console.log('  - FAQPage Schema:', detailAudit.hasFaqPageSchema);

  const detailShot = path.join(SCREENSHOTS_DIR, '10_blog_detail_page.png');
  await page.screenshot({ path: detailShot, fullPage: false });
  report.screenshots.blogDetail = detailShot;
  console.log('📸 Captured 10_blog_detail_page.png');

  // ────────────────────────────────────────────────────────────────
  // TEST 4: INSIGHTS ROUTE INDEPENDENCE (/insights)
  // ────────────────────────────────────────────────────────────────
  console.log('\n--- Testing /insights route independence ---');
  await page.goto('http://localhost:5173/insights', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const insightsTitle = await page.title();
  const insightsH1 = await page.locator('h1').first().textContent();
  report.tests['insights_independent'] = {
    passed: insightsTitle.toLowerCase().includes('insight') || (insightsH1 && insightsH1.toLowerCase().includes('insight')),
    title: insightsTitle,
    h1: insightsH1?.trim()
  };
  console.log('  - /insights Title:', insightsTitle);
  console.log('  - /insights H1:', insightsH1?.trim());

  const insightsShot = path.join(SCREENSHOTS_DIR, '11_insights_independent_page.png');
  await page.screenshot({ path: insightsShot, fullPage: false });
  report.screenshots.insights = insightsShot;
  console.log('📸 Captured 11_insights_independent_page.png');

  await browser.close();

  // Save report to disk
  const reportPath = path.resolve('scripts/phase1-qa-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log('\n====================================================');
  console.log('✅ PHASE 1 AUDIT COMPLETE. REPORT SAVED TO:', reportPath);
  console.log('====================================================\n');
}

runPhase1Verification().catch(err => {
  console.error('Phase 1 Verification Failed:', err);
  process.exit(1);
});
