import { chromium } from '@playwright/test';

async function measurePositions() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('--- MEASURING INITIAL VS FINAL POSITIONS ---');

  // Inject tracking
  await page.addInitScript(() => {
    window.__snapshots = [];
    const record = (label) => {
      const getBox = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height) };
      };
      window.__snapshots.push({
        time: Math.round(performance.now()),
        label,
        announcement: getBox('aside[aria-label="Announcement"]'),
        navbar: getBox('header'),
        eyebrow: getBox('.eyebrow'),
        h1: getBox('h1'),
        para: getBox('.hero-anim-para'),
        card1: getBox('.hero-anim-card-1'),
        card2: getBox('.hero-anim-card-2'),
        stage: getBox('[data-hero-scene="codex-stage"]'),
      });
    };

    window.__record = record;
    document.addEventListener('DOMContentLoaded', () => record('DOMContentLoaded'));
  });

  await page.goto('http://localhost:4173/', { waitUntil: 'commit' });
  
  for (const ms of [0, 50, 100, 200, 600, 1200, 2000]) {
    if (ms > 0) await page.waitForTimeout(ms === 50 ? 50 : ms - 50);
    await page.evaluate((m) => window.__record && window.__record(`${m}ms`), ms);
  }

  const snapshots = await page.evaluate(() => window.__snapshots);
  console.log(JSON.stringify(snapshots, null, 2));

  await browser.close();
}

measurePositions();
