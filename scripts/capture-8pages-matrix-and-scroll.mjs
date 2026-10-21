import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\iGen Systems\\.gemini\\antigravity-ide\\brain\\24257650-6bb9-47cd-afe7-aec6be5496d1\\audit_screens';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const pagesToCapture = [
  { name: 'home', route: '/' },
  { name: 'about', route: '/about' },
  { name: 'services', route: '/services' },
  { name: 'services-job-placement', route: '/services/job-placement' },
  { name: 'careers', route: '/careers' },
  { name: 'plans', route: '/plans' },
  { name: 'success-stories', route: '/success-stories' },
  { name: 'contact', route: '/contact' },
  { name: 'faq', route: '/faq' },
];

const breakpoints = [
  { width: 1920, height: 1080, suffix: '1920' },
  { width: 1440, height: 900, suffix: '1440' },
  { width: 768, height: 1024, suffix: '768' },
  { width: 390, height: 844, suffix: '390' },
];

async function captureMatrixAndScroll() {
  console.log('📸 Capturing 8-Page 4-Breakpoint Matrix and 3D Scroll Sequences on Production Build...');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--enable-webgl', '--enable-gpu-rasterization', '--no-sandbox'],
  });

  const page = await browser.newPage();

  // 1. Capture 8+ Pages at 4 Breakpoints (36 Screenshots)
  for (const bp of breakpoints) {
    await page.setViewportSize({ width: bp.width, height: bp.height });
    for (const p of pagesToCapture) {
      await page.goto('http://localhost:5000' + p.route, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);

      const filePath = path.join(outDir, `${p.name}-${bp.suffix}.png`);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`Saved screenshot: ${p.name}-${bp.suffix}.png`);
    }
  }

  // 2. Capture Frame Sequences of Full Scroll on Home, Services, and Careers
  console.log('\n🎞️ Capturing 3D Scroll Progressions (Home, Services, Careers)...');
  await page.setViewportSize({ width: 1440, height: 900 });

  const scrollTargets = [
    { name: 'home', route: '/', steps: [0, 600, 1200, 1800, 2400, 3200] },
    { name: 'services', route: '/services', steps: [0, 500, 1000, 1600, 2200] },
    { name: 'careers', route: '/careers', steps: [0, 500, 1000, 1500, 2000] },
  ];

  for (const target of scrollTargets) {
    await page.goto('http://localhost:5000' + target.route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    for (let i = 0; i < target.steps.length; i++) {
      const scrollY = target.steps[i];
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), scrollY);
      await page.waitForTimeout(250);

      const framePath = path.join(outDir, `scroll-${target.name}-frame-${i + 1}-y${scrollY}.png`);
      await page.screenshot({ path: framePath, fullPage: false });
      console.log(`Saved scroll frame: scroll-${target.name}-frame-${i + 1}-y${scrollY}.png`);
    }
  }

  await browser.close();
  console.log('\n✅ All screenshots and scroll frame sequences saved successfully!');
}

captureMatrixAndScroll().catch(console.error);
