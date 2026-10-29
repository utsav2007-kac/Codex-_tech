import { chromium } from '@playwright/test';

async function testHydrationOnUrl(url, label) {
  console.log(`\n======================================================`);
  console.log(`🔍 Testing Hydration & Console on ${label} (${url})`);
  console.log(`======================================================`);

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const logs = [];
  const warnings = [];
  const errors = [];
  const hydrationIssues = [];

  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    logs.push({ type, text });
    if (type === 'warning') {
      warnings.push(text);
      if (text.toLowerCase().includes('hydrat') || text.toLowerCase().includes('mismatch') || text.toLowerCase().includes('did not match')) {
        hydrationIssues.push(text);
      }
    }
    if (type === 'error') {
      errors.push(text);
      if (text.toLowerCase().includes('hydrat') || text.toLowerCase().includes('mismatch')) {
        hydrationIssues.push(text);
      }
    }
  });

  page.on('pageerror', err => {
    errors.push(err.message);
  });

  // Track component mount count on hero elements to prove 0 remounts
  await page.addInitScript(() => {
    window.__mountCounters = {
      heroRoot: 0,
      heroH1: 0,
      heroCta: 0,
    };

    // Use MutationObserver to verify elements are not unmounted & re-created
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          m.removedNodes.forEach(node => {
            if (node.nodeType === 1 && (node.getAttribute?.('data-testid') === 'hero-h1' || node.querySelector?.('[data-testid="hero-h1"]'))) {
              console.warn('[REMOUNT DETECTED] Hero H1 was removed from DOM during hydration!');
            }
          });
        }
      }
    });

    document.addEventListener('DOMContentLoaded', () => {
      const main = document.getElementById('main-content');
      if (main) observer.observe(main, { childList: true, subtree: true });
    });
  });

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  console.log(`Results for ${label}:`);
  console.log(`  Total Console Messages: ${logs.length}`);
  console.log(`  Total Warnings: ${warnings.length}`);
  console.log(`  Total Errors: ${errors.length}`);
  console.log(`  Hydration Mismatches: ${hydrationIssues.length}`);

  if (warnings.length > 0) {
    console.log(`  Warnings:`, warnings);
  }
  if (errors.length > 0) {
    console.log(`  Errors:`, errors);
  }

  await browser.close();
  return { label, warnings, errors, hydrationIssues };
}

(async () => {
  const prodResults = await testHydrationOnUrl('http://localhost:4173/', 'Production Build (Preview)');
  console.log('\nAudit complete for Production Build.');
})();
