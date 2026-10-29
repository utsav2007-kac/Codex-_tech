import { chromium } from 'playwright';

async function diagnose() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(() => {
    sessionStorage.setItem('codex_visited_curtain', 'true');
    localStorage.setItem('codex_cookie_consent', 'accepted');
  });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const heroInfo = await page.evaluate(() => {
    const hero = document.querySelector('.hero-section');
    const heroRect = hero?.getBoundingClientRect();
    const elemBehindNav = document.elementFromPoint(500, 85);
    return {
      heroRect,
      elemBehindNavTag: elemBehindNav?.tagName,
      elemBehindNavClass: elemBehindNav?.className,
      mainRect: document.querySelector('#main-content')?.getBoundingClientRect()
    };
  });
  console.log(JSON.stringify(heroInfo, null, 2));
  await browser.close();
}

diagnose().catch(console.error);
