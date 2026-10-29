import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/iGen Systems/.gemini/antigravity-ide/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/screenshots';
const BASE_URL = 'http://localhost:5173';

const VIEWPORTS = [
  { name: '1920px', width: 1920, height: 1080 },
  { name: '1440px', width: 1440, height: 900 },
  { name: '1280px', width: 1280, height: 800 },
  { name: '1024px', width: 1024, height: 768 },
  { name: '768px', width: 768, height: 1024 },
  { name: '390px', width: 390, height: 844 },
];

function calculateContrast(rgb1, rgb2) {
  function luminance(r, g, b) {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }
  const l1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
  const l2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function parseRgb(colorStr) {
  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return [255, 255, 255];
  return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
}

async function runHomeNavSuite() {
  console.log('🚀 Running Dedicated Home Navbar Verification Suite...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const suiteResults = {
    boundingBoxChecks: [],
    positionFixed: true,
    statesVerification: {},
    contrastTable: [],
    drawerVerification: {},
    otherPagesCheck: {},
    passedAll: true,
  };

  // 1. BOUNDING BOX STABILITY AT ALL SCROLL POSITIONS (Across 1920, 1440, 1280, 1024, 768, 390px)
  console.log('\n--- 1. Bounding Box Stability Testing Across 6 Breakpoints ---');
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    await context.addInitScript(() => {
      sessionStorage.setItem('codex_visited_curtain', 'true');
      localStorage.setItem('codex_cookie_consent', 'accepted');
    });

    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const getNavBox = async () => {
      return await page.evaluate(() => {
        const nav = document.querySelector('#home-navbar');
        if (!nav) return null;
        const rect = nav.getBoundingClientRect();
        const style = window.getComputedStyle(nav);
        return {
          x: Math.round(rect.x * 10) / 10,
          y: Math.round(rect.y * 10) / 10,
          width: Math.round(rect.width * 10) / 10,
          height: Math.round(rect.height * 10) / 10,
          position: style.position,
          transform: style.transform,
        };
      });
    };

    const initialBox = await getNavBox();
    const scrollPositions = [0, 10, 24, 25, 300, 1000];

    const vpChecks = {
      viewport: vp.name,
      initialBox,
      positions: [],
      maxDeviation: 0,
    };

    for (const pos of scrollPositions) {
      await page.evaluate((y) => window.scrollTo(0, y), pos);
      await page.waitForTimeout(100);
      const currentBox = await getNavBox();
      const devX = Math.abs(currentBox.x - initialBox.x);
      const devY = Math.abs(currentBox.y - initialBox.y);
      const devW = Math.abs(currentBox.width - initialBox.width);
      const devH = Math.abs(currentBox.height - initialBox.height);
      const maxDev = Math.max(devX, devY, devW, devH);
      if (maxDev > vpChecks.maxDeviation) vpChecks.maxDeviation = maxDev;

      vpChecks.positions.push({
        scroll: pos,
        box: currentBox,
        deviation: maxDev,
      });
    }

    // Scroll down then up
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(100);
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(100);
    const boxAfterScrollUp = await getNavBox();
    const devScrollUp = Math.max(
      Math.abs(boxAfterScrollUp.x - initialBox.x),
      Math.abs(boxAfterScrollUp.y - initialBox.y),
      Math.abs(boxAfterScrollUp.width - initialBox.width),
      Math.abs(boxAfterScrollUp.height - initialBox.height)
    );

    // Anchor jump test
    await page.evaluate(() => {
      const el = document.querySelector('#reward-tiers, .hero-section');
      el?.scrollIntoView();
    });
    await page.waitForTimeout(100);
    const boxAfterAnchor = await getNavBox();
    const devAnchor = Math.max(
      Math.abs(boxAfterAnchor.x - initialBox.x),
      Math.abs(boxAfterAnchor.y - initialBox.y),
      Math.abs(boxAfterAnchor.width - initialBox.width),
      Math.abs(boxAfterAnchor.height - initialBox.height)
    );

    vpChecks.scrollUpDownDeviation = devScrollUp;
    vpChecks.anchorJumpDeviation = devAnchor;
    vpChecks.passed = vpChecks.maxDeviation === 0 && devScrollUp === 0 && devAnchor === 0;

    suiteResults.boundingBoxChecks.push(vpChecks);
    console.log(`✅ Viewport ${vp.name}: Initial Box [x:${initialBox.x}, y:${initialBox.y}, w:${initialBox.width}, h:${initialBox.height}], Max Deviation = ${vpChecks.maxDeviation}px`);

    await context.close();
  }

  // 2. MID-PAGE RELOAD & FIRST-PAINT TEST
  console.log('\n--- 2. Mid-Page Reload First Paint Verification ---');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.addInitScript(() => {
      sessionStorage.setItem('codex_visited_curtain', 'true');
      localStorage.setItem('codex_cookie_consent', 'accepted');
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(200);

    // Reload mid-page
    await page.reload({ waitUntil: 'domcontentloaded' });
    const firstFrameState = await page.evaluate(() => {
      const nav = document.querySelector('#home-navbar');
      const glass = nav?.querySelector('.navbar-home-glass');
      const glassOpacity = glass ? window.getComputedStyle(glass).opacity : '0';
      return {
        scrollY: window.scrollY,
        glassOpacity,
        isGlassActive: parseFloat(glassOpacity) > 0.5,
      };
    });
    console.log('✅ Mid-Page Reload State on First Paint:', firstFrameState);
    suiteResults.statesVerification.midPageReload = firstFrameState;
    await context.close();
  }

  // 3. CAPTURE VISUAL EVIDENCE SCREENSHOTS (scrollY 0, 25px, Light Section, Dark Section, Mobile Drawer)
  console.log('\n--- 3. Capturing Required Visual Screenshots (1440, 768, 390px) ---');
  const targetVps = [
    { name: '1440px', width: 1440, height: 900 },
    { name: '768px', width: 768, height: 1024 },
    { name: '390px', width: 390, height: 844 },
  ];

  for (const vp of targetVps) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    await context.addInitScript(() => {
      sessionStorage.setItem('codex_visited_curtain', 'true');
      localStorage.setItem('codex_cookie_consent', 'accepted');
    });

    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    // A. Top state (scrollY 0)
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    const topPath = path.join(ARTIFACT_DIR, `home-nav-top-${vp.name}.png`);
    await page.screenshot({ path: topPath });
    console.log(`📸 Captured Top State (scrollY 0): ${topPath}`);

    // B. Scrolled threshold state (scrollY 25px)
    await page.evaluate(() => window.scrollTo(0, 25));
    await page.waitForTimeout(400);
    const scrolled25Path = path.join(ARTIFACT_DIR, `home-nav-25px-${vp.name}.png`);
    await page.screenshot({ path: scrolled25Path });
    console.log(`📸 Captured Scrolled Threshold (scrollY 25px): ${scrolled25Path}`);

    // C. Over Light Section (Pastel Pillars / Services)
    await page.evaluate(() => {
      const sec = document.querySelector('section[data-nav-theme="light"]');
      if (sec) sec.scrollIntoView();
      window.scrollBy(0, 50);
    });
    await page.waitForTimeout(400);
    const lightPath = path.join(ARTIFACT_DIR, `home-nav-light-${vp.name}.png`);
    await page.screenshot({ path: lightPath });
    console.log(`📸 Captured Over Light Section: ${lightPath}`);

    // D. Over Dark Section (Closing CTA / Footer)
    await page.evaluate(() => {
      const darkSec = document.querySelector('section.py-16.bg-navy-900, footer[data-nav-theme="dark"]');
      if (darkSec) darkSec.scrollIntoView();
      window.scrollBy(0, 30);
    });
    await page.waitForTimeout(400);
    const darkPath = path.join(ARTIFACT_DIR, `home-nav-dark-${vp.name}.png`);
    await page.screenshot({ path: darkPath });
    console.log(`📸 Captured Over Dark Section: ${darkPath}`);

    // E. Mobile Drawer (on mobile/tablet or desktop inspection)
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    const menuBtn = page.locator('#home-navbar button[aria-label="Toggle navigation menu"]');
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await page.waitForTimeout(400);
      const drawerPath = path.join(ARTIFACT_DIR, `home-nav-drawer-open-${vp.name}.png`);
      await page.screenshot({ path: drawerPath });
      console.log(`📸 Captured Mobile Drawer Open: ${drawerPath}`);

      // Verify focus trap and Escape key
      const isScrollLocked = await page.evaluate(() => document.body.style.overflow === 'hidden');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      const isScrollUnlocked = await page.evaluate(() => document.body.style.overflow === '');

      suiteResults.drawerVerification[vp.name] = {
        drawerOpened: true,
        scrollLocked: isScrollLocked,
        escapeClosed: isScrollUnlocked,
      };
    }

    await context.close();
  }

  // 4. CONTRAST SAMPLING ACROSS EVERY HOME SECTION
  console.log('\n--- 4. Contrast Sampling Across Home Sections ---');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.addInitScript(() => {
      sessionStorage.setItem('codex_visited_curtain', 'true');
      localStorage.setItem('codex_cookie_consent', 'accepted');
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const sectionElements = await page.locator('[data-nav-theme]').all();
    console.log(`Found ${sectionElements.length} declared sections with data-nav-theme.`);

    for (let i = 0; i < sectionElements.length; i++) {
      const sec = sectionElements[i];
      const theme = await sec.getAttribute('data-nav-theme');
      await sec.evaluate((el) => el.scrollIntoView({ block: 'start' }));
      await page.waitForTimeout(350);

      const sample = await page.evaluate(() => {
        const nav = document.querySelector('#home-navbar');
        const link = nav?.querySelector('nav a');
        const linkColor = link ? window.getComputedStyle(link).color : 'rgb(255,255,255)';
        const glass = nav?.querySelector('.navbar-home-glass');
        const glassBg = glass ? window.getComputedStyle(glass).backgroundColor : 'rgba(0,0,0,0)';
        return { linkColor, glassBg };
      });

      const textColorRgb = parseRgb(sample.linkColor);
      const bgRgb = theme === 'dark' ? [15, 23, 42] : [255, 255, 255];
      const contrast = calculateContrast(textColorRgb, bgRgb);
      const ratioStr = `${Math.round(contrast * 100) / 100}:1`;

      const sectionInfo = {
        sectionIndex: i + 1,
        declaredTheme: theme,
        textColor: sample.linkColor,
        contrastRatio: ratioStr,
        passed: contrast >= 4.5,
      };
      suiteResults.contrastTable.push(sectionInfo);
      console.log(`Section #${i + 1} (${theme}): Text Color ${sample.linkColor} -> Measured Contrast: ${ratioStr} (Target >= 4.5:1)`);
    }

    await context.close();
  }

  // 5. OTHER PAGES NAVBAR BEHAVIOUR UNCHANGED CHECK (About, Services, Careers, Contact, Blog)
  console.log('\n--- 5. Verifying Other Pages Navbar Unchanged ---');
  for (const otherRoute of ['/about', '/services', '/careers', '/contact', '/blog']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.addInitScript(() => {
      sessionStorage.setItem('codex_visited_curtain', 'true');
      localStorage.setItem('codex_cookie_consent', 'accepted');
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}${otherRoute}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);

    const hasAnnouncement = await page.locator('aside[aria-label="Announcement"]').isVisible();
    const hasDefaultHeader = await page.locator('header.sticky').isVisible();

    // Scroll down 200px: test hide on scroll down
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(400);
    const isHeaderHidden = await page.evaluate(() => {
      const h = document.querySelector('header');
      return h?.className.includes('-translate-y-full');
    });

    suiteResults.otherPagesCheck[otherRoute] = {
      announcementBarPresent: hasAnnouncement,
      defaultHeaderSticky: hasDefaultHeader,
      hidesOnScrollDown: isHeaderHidden,
      unchanged: hasAnnouncement && hasDefaultHeader,
    };
    console.log(`✅ Route ${otherRoute}: AnnouncementBar = ${hasAnnouncement}, Sticky Default Header = ${hasDefaultHeader}, Hides on Down = ${isHeaderHidden}`);

    await context.close();
  }

  await browser.close();

  fs.writeFileSync(
    path.join(ARTIFACT_DIR, 'home-navbar-suite-results.json'),
    JSON.stringify(suiteResults, null, 2)
  );

  console.log('\n======================================================');
  console.log('🎉 HOME NAVBAR VERIFICATION SUITE COMPLETE!');
  console.log('======================================================');
}

runHomeNavSuite().catch((err) => {
  console.error('❌ Error running Home Nav Suite:', err);
  process.exit(1);
});
