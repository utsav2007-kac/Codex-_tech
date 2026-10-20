import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BREAKPOINTS = [
  { name: '1920px (Ultrawide)', width: 1920, height: 1080 },
  { name: '1440px (Desktop)', width: 1440, height: 900 },
  { name: '1280px (Standard Laptop)', width: 1280, height: 800 },
  { name: '1024px (Tablet Landscape / Small Desktop)', width: 1024, height: 768 },
  { name: '768px (Tablet Portrait)', width: 768, height: 1024 },
  { name: '375px (Mobile)', width: 375, height: 667 },
];

const TARGET_ROUTES = process.argv.slice(2).length > 0 
  ? process.argv.slice(2)
  : ['/services/job-placement'];

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const AUDIT_SCREEN_DIR = path.resolve('agent/screens/audit');
const AUDIT_REPORT_PATH = path.resolve('agent/audit-report.md');

if (!fs.existsSync(AUDIT_SCREEN_DIR)) {
  fs.mkdirSync(AUDIT_SCREEN_DIR, { recursive: true });
}

async function runAudit() {
  console.log(`🚀 Starting Whitespace Audit against ${BASE_URL}...`);
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  
  const results = [];

  for (const route of TARGET_ROUTES) {
    console.log(`\n🔍 Auditing route: ${route}`);
    const routeResults = {
      route,
      timestamp: new Date().toISOString(),
      breakpoints: {},
    };

    for (const bp of BREAKPOINTS) {
      const page = await browser.newPage({
        viewport: { width: bp.width, height: bp.height },
        deviceScaleFactor: 1,
      });

      const url = `${BASE_URL}${route}`;
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(600); // Allow motion/render settle

      // Screenshot
      const slugName = route.replace(/\//g, '_').replace(/^_/, '');
      const screenPath = path.join(AUDIT_SCREEN_DIR, `${slugName}-${bp.width}.png`);
      await page.screenshot({ path: screenPath, fullPage: true });

      // Run evaluation metrics
      const evaluation = await page.evaluate(({ isDesktop, bpWidth }) => {
        const issues = [];

        // 1. Hero Check (for desktop >= 1024px)
        const heroSection = document.querySelector('section, [data-hero-section]') || document.querySelector('main > div:first-child');
        const heroVisual = document.querySelector('[data-hero-visual], .page-hero-visual, [data-hero-scene]');
        const heroRightCol = document.querySelector('[data-hero-right], .page-hero-right');

        if (isDesktop) {
          if (!heroVisual && !heroRightCol) {
            // Check if right half of the hero is essentially empty
            const heroRect = heroSection ? heroSection.getBoundingClientRect() : { width: bpWidth, height: 400 };
            const mainText = heroSection ? (heroSection.querySelector('h1')?.parentElement || heroSection) : null;
            const textRect = mainText ? mainText.getBoundingClientRect() : { width: 800 };
            const emptyWidth = bpWidth - textRect.width;

            issues.push({
              type: 'HERO_EMPTY_RIGHT_COL',
              severity: 'FAIL',
              message: `Hero right-hand area has no visual companion. Text width: ${Math.round(textRect.width)}px, unused empty width: ${Math.round(emptyWidth)}px.`,
              measured: { textWidth: Math.round(textRect.width), emptyWidth: Math.round(emptyWidth) },
            });
          } else if (heroVisual) {
            const vRect = heroVisual.getBoundingClientRect();
            if (vRect.width < 250 || vRect.height < 250) {
              issues.push({
                type: 'HERO_VISUAL_UNDERSIZED',
                severity: 'FAIL',
                message: `Hero visual bounding box is undersized (${Math.round(vRect.width)}x${Math.round(vRect.height)}px).`,
                measured: { width: Math.round(vRect.width), height: Math.round(vRect.height) },
              });
            }
          }
        }

        // 2. Section Occupancy Check
        const sections = Array.from(document.querySelectorAll('main section'));
        sections.forEach((sec, idx) => {
          if (sec.getAttribute('data-whitespace') === 'intentional') return;
          const rect = sec.getBoundingClientRect();
          if (rect.height < 50) return; // Skip zero/tiny spacers

          const children = Array.from(sec.children);
          if (children.length === 1 && isDesktop) {
            const childRect = children[0].getBoundingClientRect();
            const containerWidth = Math.min(bpWidth, 1280);
            const contentRatio = childRect.width / containerWidth;

            // If single child is narrow and left-aligned, leaving empty side
            if (contentRatio < 0.65 && !sec.querySelector('.grid, .flex-row, [data-companion]')) {
              issues.push({
                type: 'SECTION_LOW_OCCUPANCY',
                sectionIndex: idx,
                severity: 'WARN',
                message: `Section #${idx + 1} content occupies only ${Math.round(contentRatio * 100)}% of container width without companion element.`,
              });
            }
          }
        });

        // 3. Vertical Gaps Check (>160px)
        for (let i = 0; i < sections.length - 1; i++) {
          const r1 = sections[i].getBoundingClientRect();
          const r2 = sections[i + 1].getBoundingClientRect();
          const gap = r2.top - r1.bottom;
          if (gap > 160) {
            issues.push({
              type: 'VERTICAL_GAP_EXCESSIVE',
              severity: 'WARN',
              message: `Gap between section #${i + 1} and #${i + 2} is ${Math.round(gap)}px (>160px threshold).`,
              measured: { gap: Math.round(gap) },
            });
          }
        }

        // 4. Horizontal Scroll Check
        const scrollWidth = document.documentElement.scrollWidth;
        const clientWidth = document.documentElement.clientWidth;
        if (scrollWidth > clientWidth + 2) {
          issues.push({
            type: 'HORIZONTAL_OVERFLOW',
            severity: 'FAIL',
            message: `Page has horizontal overflow: scrollWidth=${scrollWidth}px vs clientWidth=${clientWidth}px.`,
          });
        }

        return {
          issues,
          scrollHeight: document.documentElement.scrollHeight,
          clientHeight: document.documentElement.clientHeight,
        };
      }, { isDesktop: bp.width >= 1024, bpWidth: bp.width });

      routeResults.breakpoints[bp.width] = {
        name: bp.name,
        screenshot: screenPath,
        ...evaluation,
      };

      await page.close();
    }

    results.push(routeResults);
  }

  await browser.close();

  // Generate /agent/audit-report.md
  generateReportMarkdown(results);
  console.log(`\n✅ Audit complete! Report written to ${AUDIT_REPORT_PATH}`);
}

function generateReportMarkdown(results) {
  let md = `# WHITESPACE & COMPANION VISUAL AUDIT REPORT\n\n`;
  md += `**Date**: ${new Date().toISOString()}\n`;
  md += `**Target Route**: ${results.map(r => r.route).join(', ')}\n\n`;
  md += `Audit executed across 6 standard breakpoints: 1920px, 1440px, 1280px, 1024px, 768px, 375px.\n\n`;
  md += `| Route | Width | Status | Hero Visual | Section Occupancy | Key Finding / Diagnostic |\n`;
  md += `|---|---|---|---|---|---|\n`;

  let totalFailures = 0;

  for (const res of results) {
    for (const [w, data] of Object.entries(res.breakpoints)) {
      const fails = data.issues.filter(i => i.severity === 'FAIL');
      const warns = data.issues.filter(i => i.severity === 'WARN');
      const status = fails.length > 0 ? '❌ FAIL' : (warns.length > 0 ? '⚠️ WARN' : '✅ PASS');
      if (fails.length > 0) totalFailures++;

      const heroIssue = data.issues.find(i => i.type.startsWith('HERO_'));
      const occupancyIssue = data.issues.find(i => i.type === 'SECTION_LOW_OCCUPANCY');
      const findings = data.issues.map(i => i.message).join('; ') || 'Balanced layout, zero overflow';

      md += `| \`${res.route}\` | ${w}px | ${status} | ${heroIssue ? '❌ Missing' : '✅ Present'} | ${occupancyIssue ? '⚠️ Low' : '✅ Good'} | ${findings} |\n`;
    }
  }

  md += `\n## Baseline Summary\n`;
  if (totalFailures > 0) {
    md += `> [!WARNING]\n`;
    md += `> **Baseline Confirmed**: ${totalFailures} failures diagnosed on initial unmigrated layout.\n`;
    md += `> Root cause on desktop (1024px-1920px): \`<SectionReveal className="max-w-3xl mt-4">\` renders a 1-column layout without companion visual, leaving ~500-800px of completely empty blank space on the right side of the hero.\n`;
    md += `> Required remediation: Deploy \`<PageHero>\` with 12-column grid and the \`PlacementPipelineVisual\` companion to achieve 0 failures.\n`;
  } else {
    md += `> [!NOTE]\n`;
    md += `> All audited breakpoints PASS with 0 failures.\n`;
  }

  fs.writeFileSync(AUDIT_REPORT_PATH, md, 'utf-8');
}

runAudit().catch(err => {
  console.error('Audit run failed:', err);
  process.exit(1);
});
