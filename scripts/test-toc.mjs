import { chromium } from 'playwright';

async function testToc() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173/blog/ats-resume-optimization-guide-2026', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const res = await page.evaluate(() => {
    const desktopToc = document.querySelector('aside nav[aria-label="Table of contents"]');
    const links = desktopToc ? Array.from(desktopToc.querySelectorAll('a')).map(a => a.textContent?.trim()) : [];
    return {
      desktopTocFound: !!desktopToc,
      linksCount: links.length,
      links: links.slice(0, 5)
    };
  });
  console.log(JSON.stringify(res, null, 2));
  await browser.close();
}

testToc().catch(console.error);
