import { chromium } from '@playwright/test';

async function testMilestonesAndNextStep() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  await page.addInitScript(() => {
    sessionStorage.setItem('codex_visited_curtain', 'true');
    localStorage.setItem('codex_cookie_consent', 'accepted');
  });

  // 1. Measure About Milestones
  await page.goto('http://localhost:5173/about', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const milestones = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Trajectory'));
    const section = heading?.closest('section');
    const cards = Array.from(section?.querySelectorAll('.grid.items-stretch > div') || []);

    return cards.map((c, i) => {
      const cardBox = c.getBoundingClientRect();
      const titleEl = c.querySelector('h3');
      const descEl = c.querySelector('p');
      const titleBox = titleEl?.getBoundingClientRect();
      const descBox = descEl?.getBoundingClientRect();

      return {
        cardIndex: i,
        titleText: titleEl?.innerText.trim(),
        cardTop: Math.round(cardBox.top),
        cardHeight: Math.round(cardBox.height),
        titleTopRel: Math.round((titleBox?.top || 0) - cardBox.top),
        titleHeight: Math.round(titleBox?.height || 0),
        titleBottomRel: Math.round((titleBox?.bottom || 0) - cardBox.top),
        descTopRel: Math.round((descBox?.top || 0) - cardBox.top),
        gapTitleToDesc: Math.round((descBox?.top || 0) - (titleBox?.bottom || 0)),
      };
    });
  });

  console.log('REAL MILESTONES (ABOUT):', JSON.stringify(milestones, null, 2));

  // 2. Measure Next Step
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const nextStep = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.toLowerCase().includes('next step'));
    const section = heading?.closest('section');
    const cards = Array.from(section?.querySelectorAll('.grid.items-stretch > div') || []);

    return cards.map((c, i) => {
      const cardBox = c.getBoundingClientRect();
      const titleEl = c.querySelector('h3');
      const descEl = c.querySelector('p');
      const ctaEl = c.querySelector('a, button');
      const titleBox = titleEl?.getBoundingClientRect();
      const descBox = descEl?.getBoundingClientRect();
      const ctaBox = ctaEl?.getBoundingClientRect();

      return {
        cardIndex: i,
        titleText: titleEl?.innerText.trim(),
        cardTop: Math.round(cardBox.top),
        cardHeight: Math.round(cardBox.height),
        titleTopRel: Math.round((titleBox?.top || 0) - cardBox.top),
        titleHeight: Math.round(titleBox?.height || 0),
        titleBottomRel: Math.round((titleBox?.bottom || 0) - cardBox.top),
        descTopRel: Math.round((descBox?.top || 0) - cardBox.top),
        ctaBottomRel: Math.round((ctaBox?.bottom || 0) - cardBox.top),
        gapTitleToDesc: Math.round((descBox?.top || 0) - (titleBox?.bottom || 0)),
      };
    });
  });

  console.log('REAL NEXT STEP (HOME):', JSON.stringify(nextStep, null, 2));

  await browser.close();
}

testMilestonesAndNextStep().catch(console.error);
