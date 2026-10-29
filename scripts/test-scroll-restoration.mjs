import { chromium } from '@playwright/test';

(async () => {
  console.log('📜 Testing Scroll Restoration (Back Navigation & Reload at Scrolled Position)...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:4173/', { waitUntil: 'load' });
  await page.waitForTimeout(600);

  // 1. Scroll Home to 600px
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(400);
  const homeScrollBefore = await page.evaluate(() => window.scrollY);
  console.log(`1. Home initial scrollY: ${homeScrollBefore}px`);

  // 2. Navigate to /about
  await page.evaluate(() => {
    const link = document.querySelector('a[href="/about"]');
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  });
  await page.waitForTimeout(600);
  const aboutScroll = await page.evaluate(() => window.scrollY);
  console.log(`2. About page scrollY: ${aboutScroll}px`);

  // 3. Press browser Back button
  await page.goBack({ waitUntil: 'load' });
  await page.waitForTimeout(600);
  const homeScrollAfterBack = await page.evaluate(() => window.scrollY);
  console.log(`3. Home scrollY after Back navigation: ${homeScrollAfterBack}px (Target: ~600px, Diff: ${Math.abs(homeScrollAfterBack - 600)}px)`);

  // 4. Test reload at scrolled position
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(300);
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(600);
  const homeScrollAfterReload = await page.evaluate(() => window.scrollY);
  console.log(`4. Home scrollY after reload at 600px: ${homeScrollAfterReload}px (Target: ~600px, Diff: ${Math.abs(homeScrollAfterReload - 600)}px)`);

  const passed = Math.abs(homeScrollAfterBack - 600) <= 2 && Math.abs(homeScrollAfterReload - 600) <= 2;
  console.log(`\nOverall Scroll Restoration Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);

  await browser.close();
})();
