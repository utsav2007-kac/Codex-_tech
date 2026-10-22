import { chromium } from '@playwright/test';

async function diagnose() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  
  // 1. Diagnose Home at 1920: Heights [381, 405]
  {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const result = await page.evaluate(() => {
      const grids = Array.from(document.querySelectorAll('.grid, [class*="grid-cols-"]'));
      const details = [];
      grids.forEach(g => {
        const ch = Array.from(g.children);
        const heights = ch.map(c => Math.round(c.getBoundingClientRect().height));
        const maxH = Math.max(...heights);
        const minH = Math.min(...heights);
        if (maxH - minH >= 2) {
          details.push({
            tag: g.tagName,
            className: g.className,
            parentText: g.parentElement?.innerText?.slice(0, 100),
            heights,
            childrenTags: ch.map(c => `${c.tagName}.${c.className.slice(0, 30)}`)
          });
        }
      });
      return details;
    });
    console.log('HOME 1920 FAILURES:', JSON.stringify(result, null, 2));
    await page.close();
  }

  // 2. Diagnose Plans at 1920: Heights [636, 632, 632]
  {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:5173/plans', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const result = await page.evaluate(() => {
      const grids = Array.from(document.querySelectorAll('.grid, [class*="grid-cols-"]'));
      const details = [];
      grids.forEach(g => {
        const ch = Array.from(g.children);
        const heights = ch.map(c => Math.round(c.getBoundingClientRect().height));
        const maxH = Math.max(...heights);
        const minH = Math.min(...heights);
        if (maxH - minH >= 2) {
          details.push({
            className: g.className,
            parentText: g.parentElement?.innerText?.slice(0, 100),
            heights,
            childrenTags: ch.map(c => `${c.tagName}.${c.className.slice(0, 50)}`)
          });
        }
      });
      return details;
    });
    console.log('PLANS 1920 FAILURES:', JSON.stringify(result, null, 2));
    await page.close();
  }

  // 3. Diagnose ServiceDetail at 1024: Heights [664, 685]
  {
    const page = await browser.newPage({ viewport: { width: 1024, height: 768 } });
    await page.goto('http://localhost:5173/services/job-placement', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const result = await page.evaluate(() => {
      const grids = Array.from(document.querySelectorAll('.grid, [class*="grid-cols-"]'));
      const details = [];
      grids.forEach(g => {
        const ch = Array.from(g.children);
        const heights = ch.map(c => Math.round(c.getBoundingClientRect().height));
        const maxH = Math.max(...heights);
        const minH = Math.min(...heights);
        if (maxH - minH >= 2) {
          details.push({
            className: g.className,
            parentText: g.parentElement?.innerText?.slice(0, 100),
            heights,
            childrenTags: ch.map(c => `${c.tagName}.${c.className.slice(0, 50)}`)
          });
        }
      });
      return details;
    });
    console.log('SERVICEDETAIL 1024 FAILURES:', JSON.stringify(result, null, 2));
    await page.close();
  }

  // 4. Diagnose Home at 768: Gaps [-315]
  {
    const page = await browser.newPage({ viewport: { width: 768, height: 1024 } });
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const result = await page.evaluate(() => {
      const grids = Array.from(document.querySelectorAll('.grid, [class*="grid-cols-"]'));
      const details = [];
      grids.forEach(g => {
        const ch = Array.from(g.children).filter(c => c.offsetHeight > 35);
        if (ch.length < 2) return;
        const rects = ch.map(c => ({
          top: Math.round(c.getBoundingClientRect().top),
          bottom: Math.round(c.getBoundingClientRect().bottom),
          height: Math.round(c.getBoundingClientRect().height),
          class: c.className.slice(0, 40)
        }));
        details.push({
          gridClass: g.className,
          parentText: g.parentElement?.innerText?.slice(0, 80),
          rects
        });
      });
      return details;
    });
    console.log('HOME 768 GRIDS:', JSON.stringify(result, null, 2));
    await page.close();
  }

  await browser.close();
}

diagnose().catch(console.error);
