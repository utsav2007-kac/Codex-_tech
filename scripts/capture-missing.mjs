import { chromium } from '@playwright/test';

async function captureMissing() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--no-sandbox'] });
  
  // 1. Milestones at 1440px
  const ctx1440 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx1440.addInitScript(() => {
    sessionStorage.setItem('codex_visited_curtain', 'true');
    localStorage.setItem('codex_cookie_consent', 'accepted');
  });
  const p1440 = await ctx1440.newPage();
  await p1440.goto('http://localhost:5173/about', { waitUntil: 'domcontentloaded' });
  await p1440.waitForTimeout(600);
  const m1440 = p1440.locator('section:has-text("Milestones & Growth")').first();
  await m1440.scrollIntoViewIfNeeded();
  await p1440.waitForTimeout(600);
  await m1440.screenshot({ path: 'scripts/screenshots/milestones-trajectory-1440px.png' });
  console.log('Saved milestones-trajectory-1440px.png');
  await ctx1440.close();

  // 2. Blog on Home at 1920px
  const ctx1920 = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  await ctx1920.addInitScript(() => {
    sessionStorage.setItem('codex_visited_curtain', 'true');
    localStorage.setItem('codex_cookie_consent', 'accepted');
  });
  const p1920 = await ctx1920.newPage();
  await p1920.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await p1920.waitForTimeout(600);
  const b1920 = p1920.locator('section:has-text("Latest Hiring Insights")').first();
  await b1920.scrollIntoViewIfNeeded();
  await p1920.waitForTimeout(600);
  await b1920.screenshot({ path: 'scripts/screenshots/blog-insights-home-1920px.png' });
  console.log('Saved blog-insights-home-1920px.png');
  await ctx1920.close();

  await browser.close();
  console.log('Done capturing missing screenshots.');
}
captureMissing().catch(console.error);
