import fs from 'fs';
import path from 'path';

const VALID_ROUTES = new Set([
  '/',
  '/about',
  '/services',
  '/services/job-placement',
  '/services/recruitment-staffing',
  '/services/talent-acquisition',
  '/services/it-training',
  '/services/background-verification',
  '/services/payroll-taxes',
  '/services/resume-linkedin-rebranding',
  '/services/interview-preparation',
  '/services/custom-job-campaigns',
  '/services/it-training/java-full-stack',
  '/services/it-training/python-development',
  '/services/it-training/data-science-ai',
  '/services/it-training/data-engineering',
  '/services/it-training/cloud-aws-azure',
  '/services/it-training/devops',
  '/services/it-training/qa-automation',
  '/services/it-training/cybersecurity',
  '/services/it-training/salesforce',
  '/services/it-training/sap',
  '/industries',
  '/industries/banking-finance',
  '/industries/healthcare',
  '/industries/insurance',
  '/industries/retail-ecommerce',
  '/industries/telecom',
  '/industries/manufacturing',
  '/industries/government-public-sector',
  '/technologies',
  '/tools',
  '/tools/resume-analyzer',
  '/tools/linkedin-profile-analyzer',
  '/tools/job-match-score',
  '/tools/interview-readiness',
  '/how-it-works',
  '/employers',
  '/plans',
  '/success-stories',
  '/live-placements',
  '/careers',
  '/refer-earn',
  '/resources',
  '/resources/salary-guide',
  '/resources/resume-templates',
  '/resources/interview-question-bank',
  '/resources/webinars',
  '/insights',
  '/faq',
  '/contact',
  '/privacy-policy',
  '/terms-and-conditions',
  '/cookie-policy',
  '/refund-policy',
  '/accessibility-statement',
  '/thank-you',
  '/dev/components',
  '/dev/motion',
  '/admin/login',
  '/admin',
  '/admin/submissions',
  '/admin/leads',
  '/admin/contacts',
  '/admin/employer-requests',
  '/admin/applications',
  '/admin/referrals',
  '/admin/subscribers',
  '/admin/enrollments',
  '/admin/content',
  '/admin/settings'
]);

function scanDirectory(dir, issues = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDirectory(fullPath, issues);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');

      // Check for href="#" or to="#"
      const hashHrefMatches = content.match(/(href|to)=["']#["']/g);
      if (hashHrefMatches) {
        issues.push({ file: fullPath, issue: `Contains placeholder href="#" (${hashHrefMatches.length} instances)` });
      }

      // Check for empty href="" or to=""
      const emptyHrefMatches = content.match(/(href|to)=["']["']/g);
      if (emptyHrefMatches) {
        issues.push({ file: fullPath, issue: `Contains empty href="" (${emptyHrefMatches.length} instances)` });
      }

      // Extract all internal Link targets: to="/..."
      const linkMatches = [...content.matchAll(/to=["'](\/[a-zA-Z0-9_\-\/:]*)["']/g)];
      for (const m of linkMatches) {
        const route = m[1];
        if (!route.includes(':') && !route.includes('${') && !VALID_ROUTES.has(route) && !route.startsWith('/success-stories/') && !route.startsWith('/insights/') && !route.startsWith('/careers/')) {
          issues.push({ file: fullPath, issue: `Unrecognized route target: "${route}"` });
        }
      }
    }
  }
  return issues;
}

console.log('--- CODEX TECH-IT LINK INTEGRITY AUDIT ---');
const clientSrc = path.resolve('client/src');
const detectedIssues = scanDirectory(clientSrc);

if (detectedIssues.length === 0) {
  console.log('SUCCESS: 0 broken internal links, 0 "#" placeholder hrefs, 0 empty hrefs detected!');
  process.exit(0);
} else {
  console.error(`FAILED: Detected ${detectedIssues.length} link integrity issues:`);
  detectedIssues.forEach((iss) => console.error(` - [${path.basename(iss.file)}]: ${iss.issue}`));
  process.exit(1);
}
