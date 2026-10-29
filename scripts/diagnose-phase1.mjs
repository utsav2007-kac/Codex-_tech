import { chromium } from 'playwright';

async function diagnose() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Check 1.1: Data Visualizations / Performance By the Numbers
  const dataSec = await page.locator('text=Performance By the Numbers.').count();
  const dataVisHtml = await page.evaluate(() => {
    const sec = Array.from(document.querySelectorAll('section')).find(s => s.textContent?.includes('Performance By the Numbers'));
    return sec ? { text: sec.innerText.slice(0, 300), htmlLen: sec.innerHTML.length } : null;
  });
  console.log('1.1 DataVisualizations present:', dataSec, dataVisHtml);

  // Check 1.2: Control buttons: "Normal Dual Flow", "Reverse Flow", "Pause", "1x Speed", "3D Stage"
  const buttonsFound = await page.evaluate(() => {
    const texts = ['Normal Dual Flow', 'Reverse Flow', 'Pause', '1x Speed', '3D Stage'];
    const found = [];
    for (const t of texts) {
      const el = Array.from(document.querySelectorAll('*')).find(e => e.children.length === 0 && e.textContent.includes(t));
      if (el) found.push(t);
    }
    return found;
  });
  console.log('1.2 Control buttons found on page:', buttonsFound);

  // Check 1.4: FAQ section
  const faqData = await page.evaluate(() => {
    const faqHeading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Frequently Asked Questions'));
    if (!faqHeading) return { error: 'FAQ heading not found' };
    const section = faqHeading.closest('section');
    const items = section ? Array.from(section.querySelectorAll('.space-y-3 > div')) : [];
    return {
      sectionFound: !!section,
      itemCount: items.length,
      itemOpacities: items.map(it => ({
        opacity: window.getComputedStyle(it).opacity,
        display: window.getComputedStyle(it).display,
        visibility: window.getComputedStyle(it).visibility,
        height: it.getBoundingClientRect().height,
      })),
      sectionText: section ? section.innerText.slice(0, 300) : ''
    };
  });
  console.log('1.4 FAQ section diagnostics:', JSON.stringify(faqData, null, 2));

  // Check 1.5: Blog route
  const blogResponse = await page.goto('http://localhost:5173/blog', { waitUntil: 'domcontentloaded' });
  const blogTitle = await page.title();
  const blogContent = await page.evaluate(() => document.body.innerText.slice(0, 200));
  console.log('1.5 /blog route status:', blogResponse?.status(), 'title:', blogTitle, 'preview:', blogContent.replace(/\n/g, ' '));

  await browser.close();
}

diagnose().catch(console.error);
