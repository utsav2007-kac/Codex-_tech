import { chromium } from '@playwright/test';

async function measureAllCardsHomeAbout() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  await page.addInitScript(() => {
    sessionStorage.setItem('codex_visited_curtain', 'true');
    localStorage.setItem('codex_cookie_consent', 'accepted');
  });

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const homeSections = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('section'));
    return sections.map((s, idx) => {
      const h2 = s.querySelector('h2')?.innerText.replace(/\n/g, ' ').trim() || `Section ${idx}`;
      const grids = Array.from(s.querySelectorAll('.grid, [class*="grid-cols-"]'));
      const cardHeights = [];
      grids.forEach(g => {
        const cards = Array.from(g.children).filter(c => c.offsetHeight > 40 && c.offsetWidth > 40);
        if (cards.length >= 2) {
          const heights = cards.map(c => Math.round(c.getBoundingClientRect().height));
          cardHeights.push({
            count: cards.length,
            heights,
            gridClass: g.className
          });
        }
      });
      return {
        sectionIdx: idx,
        heading: h2,
        cardGrids: cardHeights
      };
    }).filter(s => s.cardGrids.length > 0);
  });

  console.log('HOME SECTIONS & HEIGHTS AT 1920px:', JSON.stringify(homeSections, null, 2));

  await browser.close();
}

measureAllCardsHomeAbout().catch(console.error);
