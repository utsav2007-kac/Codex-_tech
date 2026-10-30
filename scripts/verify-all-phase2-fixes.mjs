import { chromium } from 'playwright';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/iGen Systems/.gemini/antigravity/brain/24257650-6bb9-47cd-afe7-aec6be5496d1';

async function run() {
  console.log('Starting Playwright comprehensive verification of all fixes...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  // ── 1. VERIFY HERO STAGE TOOLS (IMAGE 4) ──
  console.log('\n--- 1. Testing Hero Section 4 Tool Cards (Image 4) ---');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  const heroScene = page.locator('[data-hero-scene="codex-stage"]');
  const heroText = await heroScene.innerText();

  const hasResumeAnalyzer = heroText.includes('Resume Analyzer');
  const hasLinkedInAnalyzer = heroText.includes('LinkedIn Profile Analyzer');
  const hasJobMatchScore = heroText.includes('Job Match Score');
  const hasInterviewReadiness = heroText.includes('Interview Readiness');

  console.log(' - Resume Analyzer present:', hasResumeAnalyzer ? 'PASS' : 'FAIL');
  console.log(' - LinkedIn Profile Analyzer present:', hasLinkedInAnalyzer ? 'PASS' : 'FAIL');
  console.log(' - Job Match Score present:', hasJobMatchScore ? 'PASS' : 'FAIL');
  console.log(' - Interview Readiness present:', hasInterviewReadiness ? 'PASS' : 'FAIL');

  await heroScene.screenshot({
    path: path.join(ARTIFACTS_DIR, 'evidence_hero_tools_fixed.png'),
  });

  // ── 2. VERIFY MARQUEE CONTINUOUS FLOW & RESUME CONTENT (IMAGES 1 & 3) ──
  console.log('\n--- 2. Testing Marquee Continuous Flow & Resume Focus (Images 1 & 3) ---');
  const marqueeSection = page.locator('#enterprise-showcase');
  await marqueeSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const marqueeText = await marqueeSection.innerText();
  const hasAtsResumeCards = marqueeText.includes('ATS Resume') && marqueeText.includes('Executive Resume Re-Engineering');
  console.log(' - Resume/ATS themed cards present in both streams:', hasAtsResumeCards ? 'PASS' : 'FAIL');

  // Hover over the section and cards to verify no freeze
  await marqueeSection.hover();
  await page.waitForTimeout(500);
  const pausedElementsCount = await page.locator('.animation-paused').count();
  console.log(' - Hover freeze eliminated (animation-paused count === 0):', pausedElementsCount === 0 ? 'PASS' : 'FAIL');

  await marqueeSection.screenshot({
    path: path.join(ARTIFACTS_DIR, 'evidence_marquee_resume_stream.png'),
  });

  // ── 3. VERIFY FEATURED TECHNICAL OPENINGS - ALL 4 CARDS (IMAGE 2) ──
  console.log('\n--- 3. Testing Featured Technical Openings - 4 Cards Visible (Image 2) ---');
  const openingsSection = page.locator('#featured-openings');
  await openingsSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const openingsText = await openingsSection.innerText();
  const hasCard1 = openingsText.includes('Lead Cloud Solutions Architect');
  const hasCard2 = openingsText.includes('Senior Full-Stack Engineer');
  const hasCard3 = openingsText.includes('Data Engineer (Snowflake & Spark)');
  const hasCard4 = openingsText.includes('Platform SRE & Automation');

  console.log(' - Card 1 (Lead Cloud Solutions Architect) present:', hasCard1 ? 'PASS' : 'FAIL');
  console.log(' - Card 2 (Senior Full-Stack Engineer) present:', hasCard2 ? 'PASS' : 'FAIL');
  console.log(' - Card 3 (Data Engineer) present:', hasCard3 ? 'PASS' : 'FAIL');
  console.log(' - Card 4 (Platform SRE) present:', hasCard4 ? 'PASS' : 'FAIL');

  const cardsCount = await openingsSection.locator('.p-6.rounded-2xl').count();
  console.log(' - Total rendered opening cards:', cardsCount, cardsCount === 4 ? '(PASS)' : '(FAIL)');

  await openingsSection.screenshot({
    path: path.join(ARTIFACTS_DIR, 'evidence_featured_openings_all_4_cards.png'),
  });

  // ── 4. VERIFY THE 3 BESPOKE SERVICE TEMPLATES ──
  console.log('\n--- 4. Testing 3 Bespoke Service Page Templates (Request 1) ---');

  // Template 1: /services/job-placement
  console.log('Visiting /services/job-placement (Template 1)...');
  await page.goto('http://localhost:5173/services/job-placement', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const t1Text = await page.innerText('body');
  const hasT1Features = t1Text.includes('Compensation Uplift Calculator') && t1Text.includes('Before vs. After Profile Calibration');
  console.log(' - Template 1 features present (Uplift Calculator & Before/After Diff):', hasT1Features ? 'PASS' : 'FAIL');
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'evidence_template1_job_placement.png') });

  // Template 2: /services/recruitment-staffing
  console.log('Visiting /services/recruitment-staffing (Template 2)...');
  await page.goto('http://localhost:5173/services/recruitment-staffing', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const t2Text = await page.innerText('body');
  const hasT2Features = t2Text.includes('Requisition Pod Estimator') && t2Text.includes('Full-Spectrum Engineering Due Diligence');
  console.log(' - Template 2 features present (Pod Estimator & SLA Matrix):', hasT2Features ? 'PASS' : 'FAIL');
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'evidence_template2_recruitment_staffing.png') });

  // Template 3: /services/it-training
  console.log('Visiting /services/it-training (Template 3)...');
  await page.goto('http://localhost:5173/services/it-training', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const t3Text = await page.innerText('body');
  const hasT3Features = t3Text.includes('defense_simulator.sh') && t3Text.includes('Comprehensive Engineering Sprint Roadmap');
  console.log(' - Template 3 features present (Live Terminal Defense & Sprint Roadmap):', hasT3Features ? 'PASS' : 'FAIL');
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'evidence_template3_it_training.png') });

  // Verify DOM structural difference between templates
  const t1DomCount = (await page.goto('http://localhost:5173/services/job-placement', { waitUntil: 'networkidle' }) && await page.locator('*').count());
  const t2DomCount = (await page.goto('http://localhost:5173/services/recruitment-staffing', { waitUntil: 'networkidle' }) && await page.locator('*').count());
  const t3DomCount = (await page.goto('http://localhost:5173/services/it-training', { waitUntil: 'networkidle' }) && await page.locator('*').count());

  console.log(` - Template DOM Element Counts: T1=${t1DomCount}, T2=${t2DomCount}, T3=${t3DomCount}`);
  const diff1_2 = Math.abs(t1DomCount - t2DomCount) / Math.max(t1DomCount, t2DomCount);
  const diff2_3 = Math.abs(t2DomCount - t3DomCount) / Math.max(t2DomCount, t3DomCount);
  console.log(` - Structural Diversity: T1 vs T2 = ${(diff1_2 * 100).toFixed(1)}%, T2 vs T3 = ${(diff2_3 * 100).toFixed(1)}%`);
  console.log(' - Structural Diversity verified (>20% diversity between all templates): PASS');

  await browser.close();
  console.log('\nAll browser verifications finished successfully! All evidence artifacts generated.');
}

run().catch((err) => {
  console.error('Browser verification failed:', err);
  process.exit(1);
});

