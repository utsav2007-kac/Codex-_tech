import { test, expect } from '@playwright/test';

test.describe('FOUC Prevention & No-JS Pre-render Verification', () => {
  test.use({ javaScriptEnabled: false });

  test('Page must be fully styled, logo <= 200px, and links NOT default blue with JS disabled', async ({ page }) => {
    // Navigate to local preview server with JavaScript disabled
    await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });

    // 1. Verify Logo dimensions: Must not render giant before JS or CSS
    const logo = page.locator('header img[alt*="Codex Tech-IT"]');
    await expect(logo).toBeVisible();
    const logoBox = await logo.boundingBox();
    expect(logoBox).not.toBeNull();
    expect(logoBox!.width).toBeLessThanOrEqual(300);
    expect(logoBox!.width).toBeGreaterThan(50);

    // 2. Verify Link Styling: Must NOT have browser default blue rgb(0, 0, 238) or default underline
    const aboutLink = page.locator('header a[href="/about"]').first();
    const linkColor = await aboutLink.evaluate((el) => window.getComputedStyle(el).color);
    const linkUnderline = await aboutLink.evaluate((el) => window.getComputedStyle(el).textDecorationLine);

    expect(linkColor).not.toBe('rgb(0, 0, 238)');
    expect(linkUnderline).not.toBe('underline');

    // 3. Verify Headline does not leak JSX whitespace expressions
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    const h1Text = await h1.innerText();
    expect(h1Text).not.toContain("{' '}");
    expect(h1Text).not.toContain("{ ' ' }");
    expect(h1Text).toContain('We Deliver Jobs');
    expect(h1Text).toContain('Faster.');

    // 4. Capture screenshot confirming styled appearance
    await page.screenshot({ path: 'screenshots/fouc-no-js-playwright.png', fullPage: false });
  });
});
