import { chromium } from '@playwright/test';

async function debugErrors() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  const routes = [
    '/success-stories/fintech-software-engineer-placement',
    '/insights/ai-engineering-recruitment-trends-2026',
    '/admin',
  ];

  for (const r of routes) {
    console.log(`\n--- Inspecting Route: ${r} ---`);
    page.on('console', (msg) => {
      console.log(`[Console ${msg.type()}]:`, msg.text());
    });
    page.on('pageerror', (err) => {
      console.log(`[PageError]:`, err.message);
    });

    await page.goto('http://localhost:5000' + r, { waitUntil: 'load' });
    await page.waitForTimeout(500);

    page.removeAllListeners('console');
    page.removeAllListeners('pageerror');
  }

  await browser.close();
}

debugErrors().catch(console.error);
