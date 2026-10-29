import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/iGen Systems/.gemini/antigravity-ide/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/screenshots';
const BASE_URL = 'http://localhost:5000';

async function verifyAndCaptureSequence() {
  if (!fs.existsSync(ARTIFACTS_DIR)) {
    fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  }

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox']
  });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => {
    sessionStorage.setItem('codex_visited_curtain', 'true');
    localStorage.setItem('codex_cookie_consent', 'accepted');
  });

  const page = await context.newPage();

  console.log('1. Navigating to /blog (Page 1)...');
  await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(1000);

  // Extract Recent Blogs and All Blogs card titles and image numbers
  const page1Data = await page.evaluate(() => {
    const recentCards = Array.from(document.querySelectorAll('section[aria-labelledby="recent-blogs-heading"] article'));
    const allCards = Array.from(document.querySelectorAll('section[aria-labelledby="all-blogs-heading"] article'));

    const extractInfo = (art) => {
      const h3 = art.querySelector('h3')?.textContent?.trim() || '';
      const img = art.querySelector('img')?.getAttribute('src') || '';
      return { title: h3, img };
    };

    return {
      recent: recentCards.map(extractInfo),
      all: allCards.map(extractInfo)
    };
  });

  console.log('Page 1 Recent Blogs:', page1Data.recent);
  console.log('Page 1 All Blogs:', page1Data.all);

  const page1Screenshot = path.join(ARTIFACTS_DIR, 'blog_sequence_page1.png');
  await page.screenshot({ path: page1Screenshot, fullPage: true });
  console.log(`Saved screenshot: ${page1Screenshot}`);

  console.log('\n2. Navigating to /blog?page=2 (Page 2)...');
  // Click on pagination button '2' or navigate
  const page2Btn = await page.$('button[aria-label="Page 2"], a[href*="page=2"], nav button:has-text("2")');
  if (page2Btn) {
    await page2Btn.click();
    await page.waitForTimeout(1000);
  } else {
    await page.goto(`${BASE_URL}/blog?page=2`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(1000);
  }

  const page2Data = await page.evaluate(() => {
    const allCards = Array.from(document.querySelectorAll('section[aria-labelledby="all-blogs-heading"] article'));
    const extractInfo = (art) => {
      const h3 = art.querySelector('h3')?.textContent?.trim() || '';
      const img = art.querySelector('img')?.getAttribute('src') || '';
      return { title: h3, img };
    };
    return {
      all: allCards.map(extractInfo)
    };
  });

  console.log('Page 2 All Blogs:', page2Data.all);

  const page2Screenshot = path.join(ARTIFACTS_DIR, 'blog_sequence_page2.png');
  await page.screenshot({ path: page2Screenshot, fullPage: true });
  console.log(`Saved screenshot: ${page2Screenshot}`);

  await browser.close();

  return { page1Data, page2Data };
}

verifyAndCaptureSequence().catch(err => {
  console.error('Error verifying sequence:', err);
  process.exit(1);
});
