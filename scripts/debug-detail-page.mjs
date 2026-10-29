import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:5000/insights/ats-proof-resume-12-fixes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const links = await page.$$eval('link[rel="canonical"]', els => els.map(e => e.getAttribute('href')));
  console.log('All canonical links on insight detail:', links);
  await browser.close();
}

main().catch(console.error);
