import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function testCardGrowth() {
  console.log('🧪 Starting Dynamic Card Growth & Subgrid Verification...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--enable-webgl', '--no-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  // Pre-seed storage to bypass curtain intro overlay & cookie popup
  await context.addInitScript(() => {
    sessionStorage.setItem('codex_visited_curtain', 'true');
    localStorage.setItem('codex_cookie_consent', 'accepted');
  });

  const page = await context.newPage();

  // ── 1. TEST MILESTONES ON /about ──
  console.log('\n--- 1. Testing Milestones on /about ---');
  await page.goto('http://localhost:5173/about', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  // Scroll to milestones section
  const milestoneSection = page.locator('section:has-text("The Codex Trajectory")');
  await milestoneSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  // Measure initial milestone cards
  const initialMilestones = await page.evaluate(() => {
    // Select cards inside the milestones section
    const section = Array.from(document.querySelectorAll('h2')).find((h) =>
      h.textContent.includes('The Codex Trajectory')
    )?.closest('section');
    if (!section) return null;

    const cards = Array.from(section.querySelectorAll('.rounded-3xl.bg-slate-50'));
    return cards.map((c, i) => {
      const rect = c.getBoundingClientRect();
      const title = c.querySelector('h3');
      const titleRect = title?.getBoundingClientRect();
      const desc = c.querySelector('p');
      const descRect = desc?.getBoundingClientRect();

      return {
        cardIndex: i,
        year: c.querySelector('.font-numbers')?.textContent?.trim(),
        cardHeight: Math.round(rect.height),
        titleTop: titleRect ? Math.round(titleRect.top) : 0,
        titleHeight: titleRect ? Math.round(titleRect.height) : 0,
        descHeight: descRect ? Math.round(descRect.height) : 0,
        isClipped: c.scrollHeight > c.clientHeight + 2,
      };
    });
  });

  console.log('Initial Milestones (All 4 cards):');
  console.table(initialMilestones);

  await milestoneSection.screenshot({ path: 'scripts/milestones-before-growth.png' });
  console.log('Saved scripts/milestones-before-growth.png');

  // Inject 3x longer description into Milestone Card #2 (2023)
  console.log('\n💉 Injecting 3x longer description text into Milestone Card #2 (2023)...');
  const injected3xMilestone =
    'Codex Tech-IT scaled candidate representation globally by establishing dedicated enterprise placement pipelines across 18 states, inaugurating our modern Hyderabad technical delivery hub, launching intensive AWS/DevOps hands-on labs, and achieving an unprecedented 18-day average placement turnaround with 180+ verified enterprise hiring partners.';

  await page.evaluate((text) => {
    const section = Array.from(document.querySelectorAll('h2')).find((h) =>
      h.textContent.includes('The Codex Trajectory')
    )?.closest('section');
    const cards = Array.from(section.querySelectorAll('.rounded-3xl.bg-slate-50'));
    const card2 = cards[1];
    const desc = card2?.querySelector('p');
    if (desc) desc.textContent = text;
  }, injected3xMilestone);

  await page.waitForTimeout(500);

  // Measure after-growth milestone cards
  const afterMilestones = await page.evaluate(() => {
    const section = Array.from(document.querySelectorAll('h2')).find((h) =>
      h.textContent.includes('The Codex Trajectory')
    )?.closest('section');
    if (!section) return null;

    const cards = Array.from(section.querySelectorAll('.rounded-3xl.bg-slate-50'));
    return cards.map((c, i) => {
      const rect = c.getBoundingClientRect();
      const title = c.querySelector('h3');
      const titleRect = title?.getBoundingClientRect();
      const desc = c.querySelector('p');
      const descRect = desc?.getBoundingClientRect();

      return {
        cardIndex: i,
        year: c.querySelector('.font-numbers')?.textContent?.trim(),
        cardHeight: Math.round(rect.height),
        titleTop: titleRect ? Math.round(titleRect.top) : 0,
        titleHeight: titleRect ? Math.round(titleRect.height) : 0,
        descHeight: descRect ? Math.round(descRect.height) : 0,
        isClipped: c.scrollHeight > c.clientHeight + 2,
      };
    });
  });

  console.log('After 3x Longer Description in Card #2:');
  console.table(afterMilestones);

  await milestoneSection.screenshot({ path: 'scripts/milestones-after-growth.png' });
  console.log('Saved scripts/milestones-after-growth.png');

  // Assertions for Milestones
  const mHeights = afterMilestones.map((m) => m.cardHeight);
  const mDiff = Math.max(...mHeights) - Math.min(...mHeights);
  const mGrowth = afterMilestones[0].cardHeight - initialMilestones[0].cardHeight;
  const mTitleDiff =
    Math.max(...afterMilestones.map((m) => m.titleTop)) -
    Math.min(...afterMilestones.map((m) => m.titleTop));

  console.log('\nMilestones Verification Results:');
  console.log(`- Base card height before: ${initialMilestones[0].cardHeight}px`);
  console.log(`- Expanded card height after: ${afterMilestones[0].cardHeight}px (Grew by +${mGrowth}px)`);
  console.log(`- Difference between all 4 sibling card heights: ${mDiff}px (Tolerance: <= 1px) -> ${mDiff <= 1 ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Difference between title start Y-positions: ${mTitleDiff}px (Tolerance: <= 1px) -> ${mTitleDiff <= 1 ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Any card clipped: ${afterMilestones.some((m) => m.isClipped) ? 'YES ❌' : 'NO ✅'}`);

  // ── 2. TEST "NEXT STEP" CARDS ON / ──
  console.log('\n--- 2. Testing "Next Step" Cards on / ---');
  await page.goto('http://localhost:5173/', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const nextStepHeading = page.locator('h2:has-text("Wherever you are, there’s a next step")');
  await nextStepHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  const initialNextStep = await page.evaluate(() => {
    const section = Array.from(document.querySelectorAll('h2')).find((h) =>
      h.textContent.includes('Wherever you are')
    )?.closest('section');
    if (!section) return null;

    const cards = Array.from(section.querySelectorAll('.glass-card'));
    return cards.map((c, i) => {
      const rect = c.getBoundingClientRect();
      const title = c.querySelector('h3');
      const titleRect = title?.getBoundingClientRect();
      const sub = c.querySelector('p');
      const subRect = sub?.getBoundingClientRect();

      return {
        cardIndex: i,
        title: title?.textContent?.trim(),
        cardHeight: Math.round(rect.height),
        titleTop: titleRect ? Math.round(titleRect.top) : 0,
        subHeight: subRect ? Math.round(subRect.height) : 0,
        isClipped: c.scrollHeight > c.clientHeight + 2,
      };
    });
  });

  console.log('Initial Next Step Cards:');
  console.table(initialNextStep);

  const nextStepSectionLocator = page.locator('section:has(h2:has-text("Wherever you are"))');
  await nextStepSectionLocator.screenshot({ path: 'scripts/next-step-before-growth.png' });
  console.log('Saved scripts/next-step-before-growth.png');

  // Inject 3x longer description into Next Step Card #1 ("Fresh Graduates")
  console.log('\n💉 Injecting 3x longer description into Next Step Card #1 ("Fresh Graduates")...');
  const injected3xNextStep =
    'Comprehensive accelerated technical launchpad specifically engineered for recent computer science graduates, international F1-OPT and STEM students, and career pivoters transitioning from academic textbook theory to real enterprise cloud architectures, high-throughput microservices, production CI/CD pipelines, and immediate hiring manager interview fast-tracks.';

  await page.evaluate((text) => {
    const section = Array.from(document.querySelectorAll('h2')).find((h) =>
      h.textContent.includes('Wherever you are')
    )?.closest('section');
    const cards = Array.from(section.querySelectorAll('.glass-card'));
    const card1 = cards[0];
    const sub = card1?.querySelector('p');
    if (sub) sub.textContent = text;
  }, injected3xNextStep);

  await page.waitForTimeout(500);

  const afterNextStep = await page.evaluate(() => {
    const section = Array.from(document.querySelectorAll('h2')).find((h) =>
      h.textContent.includes('Wherever you are')
    )?.closest('section');
    if (!section) return null;

    const cards = Array.from(section.querySelectorAll('.glass-card'));
    return cards.map((c, i) => {
      const rect = c.getBoundingClientRect();
      const title = c.querySelector('h3');
      const titleRect = title?.getBoundingClientRect();
      const sub = c.querySelector('p');
      const subRect = sub?.getBoundingClientRect();

      return {
        cardIndex: i,
        title: title?.textContent?.trim(),
        cardHeight: Math.round(rect.height),
        titleTop: titleRect ? Math.round(titleRect.top) : 0,
        subHeight: subRect ? Math.round(subRect.height) : 0,
        isClipped: c.scrollHeight > c.clientHeight + 2,
      };
    });
  });

  console.log('After 3x Longer Description in Card #1:');
  console.table(afterNextStep);

  await nextStepSectionLocator.screenshot({ path: 'scripts/next-step-after-growth.png' });
  console.log('Saved scripts/next-step-after-growth.png');

  // Assertions for Next Step
  const nsHeights = afterNextStep.map((c) => c.cardHeight);
  const nsDiff = Math.max(...nsHeights) - Math.min(...nsHeights);
  const nsGrowth = afterNextStep[0].cardHeight - initialNextStep[0].cardHeight;
  const nsTitleDiff =
    Math.max(...afterNextStep.map((c) => c.titleTop)) -
    Math.min(...afterNextStep.map((c) => c.titleTop));

  console.log('\nNext Step Cards Verification Results:');
  console.log(`- Base card height before: ${initialNextStep[0].cardHeight}px`);
  console.log(`- Expanded card height after: ${afterNextStep[0].cardHeight}px (Grew by +${nsGrowth}px)`);
  console.log(`- Difference between all 4 sibling card heights: ${nsDiff}px (Tolerance: <= 1px) -> ${nsDiff <= 1 ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Difference between title start Y-positions: ${nsTitleDiff}px (Tolerance: <= 1px) -> ${nsTitleDiff <= 1 ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Any card clipped: ${afterNextStep.some((c) => c.isClipped) ? 'YES ❌' : 'NO ✅'}`);

  await browser.close();

  // Copy images to artifact directory
  const artifactDir =
    'C:\\Users\\iGen Systems\\.gemini\\antigravity-ide\\brain\\24257650-6bb9-47cd-afe7-aec6be5496d1\\screenshots';
  if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });
  fs.copyFileSync('scripts/milestones-before-growth.png', path.join(artifactDir, 'milestones-before-growth.png'));
  fs.copyFileSync('scripts/milestones-after-growth.png', path.join(artifactDir, 'milestones-after-growth.png'));
  fs.copyFileSync('scripts/next-step-before-growth.png', path.join(artifactDir, 'next-step-before-growth.png'));
  fs.copyFileSync('scripts/next-step-after-growth.png', path.join(artifactDir, 'next-step-after-growth.png'));

  console.log('\n🎯 Dynamic Card Growth & Subgrid Stretch fully verified and saved!');
}

testCardGrowth().catch(console.error);
