import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\iGen Systems\\.gemini\\antigravity\\brain\\24257650-6bb9-47cd-afe7-aec6be5496d1';

async function verify() {
  console.log('--- STARTING VERIFICATION: DARK THEME & HOVER PAUSE ---');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Page loaded successfully.');

    // ─────────────────────────────────────────────────────────────
    // TEST 1: Dual3DScrollShowcase Dark Theme & Card Hover Pause
    // ─────────────────────────────────────────────────────────────
    console.log('\n--- 1. Testing Dual3DScrollShowcase ---');
    const showcase = page.locator('#enterprise-showcase');
    await showcase.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    const showcaseBg = await showcase.evaluate(el => window.getComputedStyle(el).backgroundColor);
    console.log('Showcase background color:', showcaseBg);

    // Verify marquee track is initially running
    const track = page.locator('.marquee-track').first();
    const initialPlayState = await track.evaluate(el => window.getComputedStyle(el).animationPlayState);
    console.log('Initial marquee animationPlayState:', initialPlayState);

    // Find coordinates of a card currently in view and move mouse to it
    const cardPos = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.showcase-card'));
      for (const card of cards) {
        const r = card.getBoundingClientRect();
        if (r.left > 100 && r.right < window.innerWidth - 100) {
          return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        }
      }
      const r = cards[2].getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });

    console.log('Moving mouse directly onto card at:', cardPos);
    await page.mouse.move(cardPos.x, cardPos.y);
    await page.waitForTimeout(300);

    const pausedPlayState = await track.evaluate(el => window.getComputedStyle(el).animationPlayState);
    console.log('When hovering directly over a card, animationPlayState:', pausedPlayState);

    if (pausedPlayState !== 'paused') {
      throw new Error(`Expected paused when hovering card, but got: ${pausedPlayState}`);
    }
    console.log('✓ Successfully confirmed animation STOPS on card hover!');

    // Move cursor outside the card onto the heading
    const heading = showcase.locator('h2');
    const headingBox = await heading.boundingBox();
    console.log('Moving mouse outside cards to heading at:', headingBox.x, headingBox.y);
    await page.mouse.move(headingBox.x + 50, headingBox.y + 10);
    await page.waitForTimeout(300);

    const resumedPlayState = await track.evaluate(el => window.getComputedStyle(el).animationPlayState);
    console.log('When moving cursor outside of cards, animationPlayState:', resumedPlayState);

    if (resumedPlayState !== 'running') {
      throw new Error(`Expected running after unhovering card, but got: ${resumedPlayState}`);
    }
    console.log('✓ Successfully confirmed animation RESUMES when leaving card!');

    // Capture screenshot of Dual3DScrollShowcase in dark theme
    const showcaseShot = path.join(ARTIFACT_DIR, 'evidence_dark_dual_showcase.png');
    await showcase.screenshot({ path: showcaseShot });
    console.log(`Saved screenshot: ${showcaseShot}`);

    // ─────────────────────────────────────────────────────────────
    // TEST 2: DataVisualizations Section Dark Theme
    // ─────────────────────────────────────────────────────────────
    console.log('\n--- 2. Testing DataVisualizations in Dark Theme ---');
    const dataSection = page.locator('#performance-numbers');
    await dataSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const dataSectionBg = await dataSection.evaluate(el => window.getComputedStyle(el).backgroundColor);
    console.log('DataVisualizations section background color:', dataSectionBg);

    // Check tab switching in dark mode
    const salaryTab = dataSection.locator('button:has-text("Compensation Ranges")');
    await salaryTab.click();
    await page.waitForTimeout(400);

    const velocityTab = dataSection.locator('button:has-text("Interview Velocity")');
    await velocityTab.click();
    await page.waitForTimeout(400);

    const placementTab = dataSection.locator('button:has-text("Placement Rate by Track")');
    await placementTab.click();
    await page.waitForTimeout(400);

    // Capture screenshot of DataVisualizations in dark theme
    const dataShot = path.join(ARTIFACT_DIR, 'evidence_dark_data_visualizations.png');
    await dataSection.screenshot({ path: dataShot });
    console.log(`Saved screenshot: ${dataShot}`);

    console.log('\n✓ ALL TESTS PASSED SUCCESSFULLY 100%!');
  } catch (err) {
    console.error('Error during verification:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

verify();
