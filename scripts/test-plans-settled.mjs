import { chromium } from '@playwright/test';

async function testPlansSettled() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  await page.goto('http://localhost:5173/plans', { waitUntil: 'networkidle' });
  
  // Wait for all animations to complete
  await page.waitForTimeout(1200);
  
  const heights = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-3 > *'));
    return cards.map(c => Math.round(c.getBoundingClientRect().height));
  });
  
  console.log('PLANS HEIGHTS AFTER 1200ms:', heights);
  await browser.close();
}

testPlansSettled();
