import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const outDir = 'd:/web devlopment/agent/screens/audit';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const viewports = [
  { width: 1920, height: 1080, name: '1920' },
  { width: 1440, height: 900, name: '1440' },
  { width: 768, height: 1024, name: '768' },
  { width: 390, height: 844, name: '390' }
];

const routes = [
  { path: '/', name: 'home' },
  { path: '/about', name: 'about' },
  { path: '/services/job-placement', name: 'services-job-placement' },
  { path: '/careers', name: 'careers' },
  { path: '/contact', name: 'contact' }
];

async function capture() {
  console.log('📸 Capturing 20 Full-Page Verification Screenshots...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--enable-webgl']
  });

  const capturedFiles = [];

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const r of routes) {
      const url = 'http://localhost:5173' + r.path;
      await page.goto(url);
      await page.waitForTimeout(1200); // Allow animations & 3D hero stage to settle

      const filename = `${r.name}-${vp.name}.png`;
      const filePath = path.join(outDir, filename);

      await page.screenshot({
        path: filePath,
        fullPage: false // Viewport screenshot showing hero & initial layout
      });

      console.log(`Saved: ${filename} (${vp.width}x${vp.height})`);
      capturedFiles.push({
        route: r.path,
        name: r.name,
        viewport: `${vp.name}px`,
        file: filePath
      });
    }
    await page.close();
  }

  await browser.close();
  console.log('\n✅ All 20 audit screenshots captured successfully!');
  return capturedFiles;
}

capture().catch(console.error);
