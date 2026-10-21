import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl'] });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  console.log('1. Navigating to Home (/)...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const homeCanvasesInitial = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('canvas')).map(c => ({
      width: c.width,
      height: c.height,
      className: c.className,
      parentElement: c.parentElement?.tagName + '.' + c.parentElement?.className.slice(0, 30)
    }));
  });
  console.log(`Initial Home canvas count: ${homeCanvasesInitial.length}`);

  console.log('2. Navigating to Subpage (/about)...');
  await page.goto('http://localhost:5173/about', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const aboutCanvases = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('canvas')).map(c => ({
      width: c.width,
      height: c.height,
      className: c.className,
      parentElement: c.parentElement?.tagName + '.' + c.parentElement?.className.slice(0, 30)
    }));
  });
  console.log(`Subpage (/about) canvas count: ${aboutCanvases.length}`);

  console.log('3. Returning to Home (/) via client navigation...');
  await page.click('a[href="/"]');
  await page.waitForTimeout(1500);
  const homeCanvasesAfterReturn = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('canvas')).map(c => ({
      width: c.width,
      height: c.height,
      className: c.className,
      parentElement: c.parentElement?.tagName + '.' + c.parentElement?.className.slice(0, 30)
    }));
  });
  console.log(`Home canvas count after return: ${homeCanvasesAfterReturn.length}`);

  console.log('\n=== CANVAS INVENTORY REPORT ===');
  console.log('Initial Home Canvases:', JSON.stringify(homeCanvasesInitial, null, 2));
  console.log('Subpage Canvases:', JSON.stringify(aboutCanvases, null, 2));
  console.log('Return to Home Canvases:', JSON.stringify(homeCanvasesAfterReturn, null, 2));
  console.log('Count returned to initial exact value without leak:', homeCanvasesInitial.length === homeCanvasesAfterReturn.length);

  await browser.close();
}

main().catch(console.error);
