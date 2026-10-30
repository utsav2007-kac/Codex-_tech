import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const artifactsDir = 'C:\\Users\\iGen Systems\\.gemini\\antigravity\\brain\\24257650-6bb9-47cd-afe7-aec6be5496d1';

async function verifyLogo() {
  console.log('🚀 Verifying new logo rendering across pages...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2, // High-DPI for crisp screenshot inspection
  });
  const page = await context.newPage();

  try {
    // 1. Check Homepage Navbar Logo
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    const navLogo = page.locator('header img[src*="logo"]').first();
    const isNavLogoVisible = await navLogo.isVisible();
    const navLogoBox = await navLogo.boundingBox();
    const navNatural = await navLogo.evaluate((img) => ({
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      currentSrc: img.currentSrc,
    }));

    console.log('Navbar Logo:', { isNavLogoVisible, navLogoBox, navNatural });

    // Capture header screenshot
    const navShot = path.join(artifactsDir, 'navbar_new_logo.png');
    const header = page.locator('header').first();
    await header.screenshot({ path: navShot });
    console.log('📸 Saved navbar_new_logo.png');

    // 2. Check Footer Logo
    const footer = page.locator('#site-footer').first();
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const footerLogo = footer.locator('img[src*="logo"]').first();
    const isFooterLogoVisible = await footerLogo.isVisible();
    const footerLogoBox = await footerLogo.boundingBox();
    console.log('Footer Logo:', { isFooterLogoVisible, footerLogoBox });

    const footerShot = path.join(artifactsDir, 'footer_new_logo.png');
    // Capture the top statement band of footer
    const footerBrandBand = footer.locator('.grid.grid-cols-1.lg\\:grid-cols-12').first();
    await footerBrandBand.screenshot({ path: footerShot });
    console.log('📸 Saved footer_new_logo.png');

    // 3. Check Admin Login Logo
    await page.goto('http://localhost:5173/admin/login', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(500);
    const adminLogoShot = path.join(artifactsDir, 'admin_login_new_logo.png');
    const loginCard = page.locator('.max-w-md.w-full.bg-white').first();
    await loginCard.screenshot({ path: adminLogoShot });
    console.log('📸 Saved admin_login_new_logo.png');

  } catch (err) {
    console.error('Error during logo verification:', err);
  } finally {
    await browser.close();
  }
}

verifyLogo();

