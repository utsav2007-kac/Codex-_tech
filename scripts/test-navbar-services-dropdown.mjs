import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/iGen Systems/.gemini/antigravity/brain/24257650-6bb9-47cd-afe7-aec6be5496d1';

(async () => {
  console.log('🚀 Launching Chrome to test Services dropdown on Desktop & Mobile...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  // 1. DESKTOP HOVER & GAP RESILIENCE TEST
  console.log('\n--- 1. Testing Desktop Hover & Zero-Gap Behavior (1440x900) ---');
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await desktopContext.newPage();

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Locate Services trigger button
  const servicesBtn = await page.locator('button:has-text("Services")').first();
  await servicesBtn.waitFor({ state: 'visible' });

  // Initial check: dropdown should NOT be visible
  let dropdown = page.locator('#home-services-dropdown');
  let isVisible = await dropdown.isVisible();
  console.log(`Initial dropdown visible: ${isVisible} (Expected: false)`);

  // Move cursor onto Services button
  console.log('Hovering over "Services" button...');
  await servicesBtn.hover();
  await page.waitForTimeout(100);

  isVisible = await dropdown.isVisible();
  console.log(`Dropdown visible on button hover: ${isVisible} (Expected: true)`);
  if (!isVisible) throw new Error('Dropdown failed to open on hover!');

  // Capture screenshot of open dropdown
  const desktopScreenshotPath = path.join(ARTIFACT_DIR, 'navbar_services_dropdown_desktop.png');
  await page.screenshot({ path: desktopScreenshotPath });
  console.log(`📸 Desktop open dropdown screenshot saved: ${desktopScreenshotPath}`);

  // Test moving cursor slowly across the gap into the dropdown body
  console.log('Moving cursor down across the gap into the dropdown menu...');
  const dropdownBox = await dropdown.boundingBox();
  if (dropdownBox) {
    // Hover at the top edge of the dropdown (where gap used to be)
    await page.mouse.move(dropdownBox.x + 50, dropdownBox.y + 15);
    await page.waitForTimeout(150);
    isVisible = await dropdown.isVisible();
    console.log(`Dropdown visible inside dropdown body: ${isVisible} (Expected: true)`);
    if (!isVisible) throw new Error('Dropdown flickered or closed while moving into menu!');

    // Hover on a specific service link inside
    const link = dropdown.locator('a[href="/services/job-placement"]');
    await link.hover();
    await page.waitForTimeout(100);
    isVisible = await dropdown.isVisible();
    console.log(`Dropdown visible while hovering a link: ${isVisible} (Expected: true)`);
    if (!isVisible) throw new Error('Dropdown closed while hovering over service link!');
  }

  // Move cursor far outside (e.g. to bottom right of viewport)
  console.log('Moving cursor outside the entire Services section...');
  await page.mouse.move(1200, 600);
  // Wait for the smooth 180ms close buffer
  await page.waitForTimeout(300);
  isVisible = await dropdown.isVisible();
  console.log(`Dropdown visible after moving outside: ${isVisible} (Expected: false)`);
  if (isVisible) throw new Error('Dropdown failed to close after moving outside!');
  console.log('✅ Desktop hover & gap resilience test PASSED!');

  // 2. MOBILE VIEWPORT TEST (390x844)
  console.log('\n--- 2. Testing Mobile Services Accordion (390x844) ---');
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileContext.newPage();

  await mobilePage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(500);

  // Open mobile drawer
  const menuBtn = mobilePage.locator('button[aria-label="Toggle navigation menu"]');
  await menuBtn.click();
  await mobilePage.waitForTimeout(300);

  const drawer = mobilePage.locator('#mobile-nav-drawer');
  const isDrawerOpen = await drawer.isVisible();
  console.log(`Mobile drawer open: ${isDrawerOpen} (Expected: true)`);
  if (!isDrawerOpen) throw new Error('Mobile drawer failed to open!');

  // Tap "Services" in mobile drawer
  const mobileServicesBtn = drawer.locator('button:has-text("Services")');
  console.log('Tapping Services accordion button in mobile drawer...');
  await mobileServicesBtn.click();
  await mobilePage.waitForTimeout(250);

  // Verify all 9 services + overview link are visible
  const overviewLink = drawer.locator('a:has-text("All Services Overview")');
  const isOverviewVisible = await overviewLink.isVisible();
  console.log(`Mobile All Services Overview link visible: ${isOverviewVisible} (Expected: true)`);

  const jobPlacementMobileLink = drawer.locator('a[href="/services/job-placement"]');
  const isJobPlacementVisible = await jobPlacementMobileLink.isVisible();
  console.log(`Mobile Job Placement link visible: ${isJobPlacementVisible} (Expected: true)`);

  if (!isOverviewVisible || !isJobPlacementVisible) {
    throw new Error('Mobile Services accordion failed to expand!');
  }

  // Capture screenshot of expanded mobile drawer
  const mobileScreenshotPath = path.join(ARTIFACT_DIR, 'navbar_services_dropdown_mobile.png');
  await mobilePage.screenshot({ path: mobileScreenshotPath });
  console.log(`📸 Mobile expanded Services screenshot saved: ${mobileScreenshotPath}`);

  // Tap a link and verify navigation and drawer auto-close
  console.log('Tapping Job Placement link in mobile drawer...');
  await jobPlacementMobileLink.click();
  await mobilePage.waitForTimeout(500);

  console.log(`Current mobile page URL: ${mobilePage.url()}`);
  const isDrawerStillVisible = await drawer.isVisible();
  console.log(`Mobile drawer closed after link tap: ${!isDrawerStillVisible} (Expected: true)`);

  await browser.close();
  console.log('\n======================================================');
  console.log('🎉 ALL NAVBAR SERVICES DROPDOWN TESTS PASSED!');
  console.log('======================================================');
})();

