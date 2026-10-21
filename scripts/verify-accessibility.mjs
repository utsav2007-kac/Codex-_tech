import { chromium } from '@playwright/test';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/iGen Systems/.gemini/antigravity-ide/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/audit_screens';

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl'] });

  // ── TEST 1: prefers-reduced-motion ──
  console.log('--- 1. TESTING PREFERS-REDUCED-MOTION ---');
  const pageMotion = await browser.newPage();
  await pageMotion.setViewportSize({ width: 1440, height: 900 });
  await pageMotion.emulateMedia({ reducedMotion: 'reduce' });
  await pageMotion.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await pageMotion.waitForTimeout(600);

  const reducedMotionStyles = await pageMotion.evaluate(() => {
    const el = document.querySelector('h1, button, a, div');
    const computed = window.getComputedStyle(el);
    const mediaMatched = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return {
      mediaMatches: mediaMatched,
      animationDuration: computed.animationDuration,
      transitionDuration: computed.transitionDuration
    };
  });
  console.log('Reduced motion active in browser:', reducedMotionStyles);

  await pageMotion.screenshot({
    path: path.join(ARTIFACT_DIR, 'accessibility-reduced-motion-1440.png')
  });
  console.log('Saved screenshot: accessibility-reduced-motion-1440.png');
  await pageMotion.close();

  // ── TEST 2: Keyboard Tab-Order Walkthrough ──
  console.log('\n--- 2. KEYBOARD TAB-ORDER WALKTHROUGH ---');
  const pageTab = await browser.newPage();
  await pageTab.setViewportSize({ width: 1440, height: 900 });
  await pageTab.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await pageTab.waitForTimeout(600);

  const tabOrder = [];
  for (let i = 1; i <= 25; i++) {
    await pageTab.keyboard.press('Tab');
    const focused = await pageTab.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      return {
        tag: el.tagName,
        type: el.getAttribute('type') || undefined,
        id: el.id || undefined,
        ariaLabel: el.getAttribute('aria-label') || undefined,
        text: el.innerText ? el.innerText.trim().replace(/\s+/g, ' ').slice(0, 40) : undefined,
        href: el.getAttribute('href') || undefined,
        className: el.className ? el.className.toString().slice(0, 40) : undefined
      };
    });
    if (focused) {
      tabOrder.push({ step: i, ...focused });
    }
  }
  console.table(tabOrder);

  // ── TEST 3: List of all aria-hidden elements ──
  console.log('\n--- 3. ALL ARIA-HIDDEN ELEMENTS ---');
  const ariaHiddenElements = await pageTab.evaluate(() => {
    return Array.from(document.querySelectorAll('[aria-hidden="true"]')).map((el, idx) => ({
      index: idx + 1,
      tag: el.tagName.toLowerCase(),
      className: (el.className ? el.className.toString() : '').slice(0, 60),
      parentTag: el.parentElement?.tagName.toLowerCase(),
      textSnippet: (el.innerText || '').slice(0, 30).trim() || '(visual/icon/canvas)',
      purpose: el.tagName.toLowerCase() === 'svg' ? 'Decorative SVG icon' :
               el.tagName.toLowerCase() === 'canvas' ? 'Ambient WebGL scene' :
               el.tagName.toLowerCase() === 'div' ? 'Decorative scrim/mesh/background' : 'Decorative graphic'
    }));
  });
  console.log(`Found ${ariaHiddenElements.length} aria-hidden elements on Home page.`);
  console.table(ariaHiddenElements.slice(0, 20));

  console.log('\n=== COMPLETE ACCESSIBILITY PAYLOAD ===');
  console.log(JSON.stringify({
    reducedMotion: reducedMotionStyles,
    tabOrderWalkthrough: tabOrder,
    ariaHiddenTotalCount: ariaHiddenElements.length,
    ariaHiddenElements: ariaHiddenElements
  }, null, 2));

  await pageTab.close();
  await browser.close();
}

main().catch(console.error);
