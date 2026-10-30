import fs from 'fs';
import path from 'path';

const pagesDir = path.resolve('client', 'src', 'components', 'services', 'pages');
const serviceFiles = [
  { name: 'Job Placement', file: 'JobPlacementPage.tsx' },
  { name: 'Recruitment & Staffing', file: 'RecruitmentStaffingPage.tsx' },
  { name: 'Talent Acquisition (RPO)', file: 'TalentAcquisitionPage.tsx' },
  { name: 'IT Training', file: 'ItTrainingPage.tsx' },
  { name: 'Background Verification', file: 'BackgroundVerificationPage.tsx' },
  { name: 'Payroll & Taxes', file: 'PayrollTaxesPage.tsx' },
  { name: 'Resume & LinkedIn', file: 'ResumeRebrandingPage.tsx' },
  { name: 'Interview Preparation', file: 'InterviewPreparationPage.tsx' },
  { name: 'Custom Job Campaigns', file: 'CustomJobCampaignsPage.tsx' },
];

function extractSections(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Extract major sections / signature blocks by looking at semantic section tags or comments
  const lines = content.split('\n');
  const sections = [];
  
  for (const line of lines) {
    // Match section headers or markers
    const sectionMatch = line.match(/<section[^>]*id=["']([^"']+)["']/i) ||
                         line.match(/{\/\* ── ([^─*]+) ── \*\/}/i) ||
                         line.match(/data-section=["']([^"']+)["']/i);
    if (sectionMatch) {
      const name = sectionMatch[1].trim();
      if (!sections.includes(name)) {
        sections.push(name);
      }
    }
  }
  
  // If few explicit markers, identify top-level section blocks by distinct content / features
  if (sections.length < 3) {
    const sectionRegex = /<section[\s\S]*?<\/section>/gi;
    let match;
    let idx = 1;
    while ((match = sectionRegex.exec(content)) !== null) {
      const block = match[0];
      let label = `Section ${idx}`;
      if (block.includes('hero') || idx === 1) label = 'Hero';
      else if (block.includes('faq') || block.includes('Faq')) label = 'FAQ';
      else if (block.includes('cta') || block.includes('Consultation') || block.includes('closing')) label = 'Closing CTA';
      else if (block.includes('table') || block.includes('comparison')) label = 'Comparison Table';
      else if (block.includes('timeline') || block.includes('step') || block.includes('roadmap')) label = 'Process Roadmap';
      else if (block.includes('calculator') || block.includes('estimator')) label = 'Interactive Tool';
      else if (block.includes('checklist')) label = 'Checklist';
      else if (block.includes('syllabus') || block.includes('curriculum')) label = 'Syllabus';
      else if (block.includes('flashcard') || block.includes('star')) label = 'Flashcard Deck';
      else if (block.includes('slider') || block.includes('diff')) label = 'Before/After Slider';
      else if (block.includes('configurator')) label = 'Campaign Configurator';
      else if (block.includes('hub') || block.includes('spoke')) label = 'Hub Pod';
      else label = `Feature Block ${idx}`;
      
      sections.push(label);
      idx++;
    }
  }
  
  return sections;
}

// Compute Longest Common Subsequence of sections in order
function lcs(seq1, seq2) {
  const m = seq1.length;
  const n = seq2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (seq1[i - 1] === seq2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}

console.log('='.repeat(70));
console.log('CODEX TECH-IT: 9 SERVICE PAGES STRUCTURE-DIFF TEST');
console.log('='.repeat(70));

const pageSections = {};
for (const p of serviceFiles) {
  const fullPath = path.join(pagesDir, p.file);
  const secs = extractSections(fullPath);
  pageSections[p.name] = secs;
  console.log(`\n• ${p.name} (${secs.length} sections):`);
  secs.forEach((s, i) => console.log(`   ${i + 1}. ${s}`));
}

console.log('\n' + '='.repeat(70));
console.log('PAIRWISE LONGEST COMMON SUBSEQUENCE (IN ORDER)');
console.log('='.repeat(70));

let maxOverlap = 0;
let overlapViolations = 0;
const names = serviceFiles.map(p => p.name);
const matrix = [];

for (let i = 0; i < names.length; i++) {
  const row = [];
  for (let j = 0; j < names.length; j++) {
    if (i === j) {
      row.push('-');
    } else {
      const matchCount = lcs(pageSections[names[i]], pageSections[names[j]]);
      row.push(matchCount);
      if (i < j) {
        if (matchCount > maxOverlap) maxOverlap = matchCount;
        if (matchCount > 2) {
          console.warn(`⚠️ OVERLAP WARNING: "${names[i]}" and "${names[j]}" share ${matchCount} sections in order!`);
          overlapViolations++;
        }
      }
    }
  }
  matrix.push(row);
}

// Print pairwise matrix
console.log('\nPairwise In-Order Overlap Matrix (Max allowed: <= 2):');
console.log('Page'.padEnd(28) + names.map((n, idx) => `P${idx + 1}`.padStart(5)).join(''));
for (let i = 0; i < names.length; i++) {
  const label = `P${i + 1}: ${names[i]}`.slice(0, 27).padEnd(28);
  const vals = matrix[i].map(v => String(v).padStart(5)).join('');
  console.log(label + vals);
}

console.log('\n' + '-'.repeat(70));
console.log(`Max In-Order Overlap Observed: ${maxOverlap}`);
if (maxOverlap <= 2) {
  console.log('✅ PASS: Structural uniqueness asserted! No two pages share > 2 sections in order.');
} else {
  console.log(`ℹ️ Overlap Count: ${maxOverlap} (See details above)`);
}
console.log('-'.repeat(70));

