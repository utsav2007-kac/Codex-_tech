import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BREAKPOINTS = [
  { width: 1920, height: 1080, name: '1920' },
  { width: 1440, height: 900, name: '1440' },
  { width: 768, height: 1024, name: '768' },
  { width: 390, height: 844, name: '390' },
];

const SECTIONS = [
  {
    id: 'milestones-trajectory',
    route: '/about',
    selector: 'section:has-text("Milestones & Growth")',
    title: 'About - The Codex Trajectory (Milestones Timeline)',
  },
  {
    id: 'next-step-cards',
    route: '/',
    selector: 'section:has-text("Wherever you are, there")',
    title: 'Home - Wherever You Are, Next Step (4 Cards)',
  },
  {
    id: 'services-home',
    route: '/',
    selector: 'section:has-text("End-to-End IT Services")',
    title: 'Home - End-to-End IT Services (Cards Grid)',
  },
  {
    id: 'plans-home',
    route: '/',
    selector: 'section:has-text("Simple, Transparent Career Plans")',
    title: 'Home - Career Plans (3 Cards)',
  },
  {
    id: 'blog-insights-home',
    route: '/',
    selector: 'section:has-text("Latest Hiring Insights")',
    title: 'Home - Latest Insights & Blog (3 Cards)',
  },
  {
    id: 'services-page-grid',
    route: '/services',
    selector: 'section:has-text("01")',
    title: 'Services Page - 9 IT Services Grid',
  },
  {
    id: 'plans-page-grid',
    route: '/plans',
    selector: 'section:has-text("US Career Ready")',
    title: 'Plans Page - Tier Pricing Cards',
  },
  {
    id: 'careers-workflow-grid',
    route: '/careers',
    selector: 'section:has-text("The Codex Placement Advantage")',
    title: 'Careers - 18 Days Workflow (4 Cards)',
  },
  {
    id: 'insights-articles-grid',
    route: '/insights',
    selector: 'section:has-text("Read article")',
    title: 'Insights Page - Blog Articles Grid',
  },
];

async function capture() {
  const outputDir = path.resolve('scripts/screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--enable-webgl', '--no-sandbox'],
  });

  console.log('📸 Starting Playwright High-Res Card Grid Screenshot Capture...\n');

  for (const bp of BREAKPOINTS) {
    console.log(`\n--- Capturing Breakpoint ${bp.name}px (${bp.width}x${bp.height}) ---`);
    const context = await browser.newContext({
      viewport: { width: bp.width, height: bp.height },
    });

    await context.addInitScript(() => {
      sessionStorage.setItem('codex_visited_curtain', 'true');
      localStorage.setItem('codex_cookie_consent', 'accepted');
    });

    const page = await context.newPage();

    for (const sec of SECTIONS) {
      try {
        await page.goto(`http://localhost:5173${sec.route}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
        await page.waitForTimeout(500);

        const locator = page.locator(sec.selector).first();
        if (await locator.count() > 0) {
          await locator.scrollIntoViewIfNeeded();
          await page.waitForTimeout(600); // let tilt/scroll animations settle

          const filename = `${sec.id}-${bp.name}px.png`;
          const filePath = path.join(outputDir, filename);
          await locator.screenshot({ path: filePath });
          console.log(`  ✓ Saved ${filename}`);
        } else {
          console.warn(`  ⚠ Selector not found: ${sec.selector} on ${sec.route}`);
        }
      } catch (err) {
        console.error(`  ✗ Error on ${sec.title} at ${bp.name}px:`, err.message);
      }
    }

    await context.close();
  }

  await browser.close();
  console.log('\n✅ All screenshots captured into scripts/screenshots/');
}

capture().catch(console.error);
