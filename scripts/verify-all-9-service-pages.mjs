import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\iGen Systems\\.gemini\\antigravity\\brain\\24257650-6bb9-47cd-afe7-aec6be5496d1';

const services = [
  { slug: 'job-placement', title: 'Job Placement', uniqueSelector: 'text=Salary Uplift Estimator' },
  { slug: 'recruitment-staffing', title: 'Recruitment & Staffing', uniqueSelector: 'text=Requisition Pod Estimator' },
  { slug: 'talent-acquisition', title: 'Talent Acquisition (RPO)', uniqueSelector: 'text=RPO Cost Savings Calculator' },
  { slug: 'it-training', title: 'IT Training Bootcamps', uniqueSelector: 'text=Zero Toy Projects' },
  { slug: 'background-verification', title: 'Background Verification', uniqueSelector: 'text=Live Candidate Audit Dossier' },
  { slug: 'payroll-taxes', title: 'Payroll & Taxes', uniqueSelector: 'text=Multi-State Nexus Explorer' },
  { slug: 'resume-linkedin-rebranding', title: 'Resume Rebranding', uniqueSelector: 'text=Live Bullet Re-Engineering Studio' },
  { slug: 'interview-preparation', title: 'Interview Preparation', uniqueSelector: 'text=LIVE MOCK SIMULATOR' },
  { slug: 'custom-job-campaigns', title: 'Custom Campaigns', uniqueSelector: 'text=Private Pipeline Dossier' },
];

async function verifyAll9Services() {
  console.log('--- STARTING VERIFICATION OF ALL 9 BESPOKE SERVICE SUBPAGES ---');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Accept cookies once
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  const acceptBtn = page.locator('button:has-text("Accept All")');
  if (await acceptBtn.isVisible()) {
    await acceptBtn.click();
    await page.waitForTimeout(300);
  }

  for (const s of services) {
    const url = `http://localhost:5173/services/${s.slug}`;
    console.log(`\nNavigating to ${s.title}: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(600);

    // Verify unique component presence
    const uniqueEl = page.locator(s.uniqueSelector).first();
    const isVisible = await uniqueEl.isVisible();
    console.log(` - Checking unique element "${s.uniqueSelector}": ${isVisible ? 'PASS' : 'FAIL'}`);

    if (!isVisible) {
      throw new Error(`Failed to locate unique element for ${s.slug}`);
    }

    // Capture screenshot
    const shotPath = path.join(ARTIFACT_DIR, `service_bespoke_${s.slug}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(` - Captured screenshot: ${shotPath}`);
  }

  await browser.close();
  console.log('\n✓ ALL 9 BESPOKE SERVICE SUBPAGES VERIFIED 100% SUCCESSFULLY!');
}

verifyAll9Services().catch((err) => {
  console.error('Error during 9 services verification:', err);
  process.exit(1);
});

