import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BREAKPOINTS = [
  { width: 1920, height: 1080, name: '1920' },
  { width: 1440, height: 900, name: '1440' },
  { width: 1280, height: 800, name: '1280' },
  { width: 1024, height: 768, name: '1024' },
  { width: 768, height: 1024, name: '768' },
  { width: 390, height: 844, name: '390' },
];

const ARTIFACT_DIR = 'C:/Users/iGen Systems/.gemini/antigravity-ide/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/screenshots';
const LOCAL_DIR = 'd:/web devlopment/scripts/screenshots';

if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
if (!fs.existsSync(LOCAL_DIR)) fs.mkdirSync(LOCAL_DIR, { recursive: true });

async function captureAllEvidence() {
  console.log('📸 Starting Visual Evidence Capture across 6 Breakpoints...\n');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--enable-webgl', '--no-sandbox'],
  });

  for (const bp of BREAKPOINTS) {
    console.log(`\n======================================================`);
    console.log(`📸 Capturing Breakpoint: ${bp.name}px (${bp.width}x${bp.height})`);
    console.log(`======================================================`);

    const context = await browser.newContext({
      viewport: { width: bp.width, height: bp.height },
    });

    await context.addInitScript(() => {
      sessionStorage.setItem('codex_visited_curtain', 'true');
      localStorage.setItem('codex_cookie_consent', 'accepted');
    });

    const page = await context.newPage();
    await page.emulateMedia({ reducedMotion: 'reduce' });

    async function captureElement(route, selectorFn, filename) {
      try {
        await page.goto(`http://localhost:5173${route}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
        // Smooth scroll to settle
        await page.evaluate(async () => {
          const step = Math.max(300, Math.floor(document.body.scrollHeight / 6));
          for (let y = 0; y < document.body.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 40));
          }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(600);

        const targetHandle = await page.evaluateHandle(selectorFn);
        const el = targetHandle.asElement();
        if (el) {
          await el.scrollIntoViewIfNeeded();
          await page.waitForTimeout(300);

          const localPath = path.join(LOCAL_DIR, filename);
          const artifactPath = path.join(ARTIFACT_DIR, filename);

          await el.screenshot({ path: localPath });
          fs.copyFileSync(localPath, artifactPath);
          console.log(`  ✅ Captured: ${filename}`);
        } else {
          console.warn(`  ⚠️ Could not find element for ${filename}`);
        }
      } catch (err) {
        console.error(`  ❌ Error capturing ${filename}:`, err.message);
      }
    }

    // 1. Milestones ("The Codex Trajectory" on /about - including section top edge)
    await captureElement(
      '/about',
      () => {
        const headings = Array.from(document.querySelectorAll('h2, h3'));
        const h = headings.find((el) => (el.textContent || '').includes('Trajectory'));
        return h ? h.closest('section') : document.querySelector('section:nth-of-type(4)');
      },
      `milestones-${bp.name}px.png`
    );

    // 2. Next Step cards ("Wherever you are, there's a next step" on /)
    await captureElement(
      '/',
      () => {
        const headings = Array.from(document.querySelectorAll('h2, h3'));
        const h = headings.find((el) => {
          const t = (el.textContent || '').toLowerCase();
          return t.includes('wherever') || t.includes('next step');
        });
        return h ? h.closest('section') : null;
      },
      `next-step-${bp.name}px.png`
    );

    // 3. Services Grid (on /services)
    await captureElement(
      '/services',
      () => {
        const grid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
        return grid ? grid.closest('section') || grid : null;
      },
      `services-grid-${bp.name}px.png`
    );

    // 4. Plans (3 tiers on /plans)
    await captureElement(
      '/plans',
      () => {
        const grid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3');
        return grid ? grid.closest('section') || grid : null;
      },
      `plans-${bp.name}px.png`
    );

    // 5. Blog / Insights Cards (on /insights)
    await captureElement(
      '/insights',
      () => {
        const grid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
        return grid ? grid.closest('section') || grid : null;
      },
      `blog-cards-${bp.name}px.png`
    );

    // 6. Service Detail Page (/services/job-placement - Process / Deliverables cards)
    await captureElement(
      '/services/job-placement',
      () => {
        const headings = Array.from(document.querySelectorAll('h2'));
        const h2 = headings.find((h) => (h.textContent || '').includes('Included') || (h.textContent || '').includes('Who This'));
        return h2 ? h2.closest('section') : document.querySelector('section:nth-of-type(2)');
      },
      `service-detail-${bp.name}px.png`
    );

    // 7. Footer (on /about)
    await captureElement(
      '/about',
      () => document.querySelector('footer'),
      `footer-${bp.name}px.png`
    );

    await context.close();
  }

  await browser.close();
  console.log('\n🎉 Finished capturing all visual evidence across all 6 breakpoints!');
}

captureAllEvidence().catch(console.error);
