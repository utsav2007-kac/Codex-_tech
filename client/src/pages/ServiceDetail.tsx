import React, { useState } from 'react';
import { useParams, Link, useOutletContext, Navigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  Award,
  ChevronDown,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { siteConfig } from '../config/site';

interface ServiceContent {
  slug: string;
  title: string;
  tagline: string;
  overview: string;
  whoItsFor: string[];
  whatsIncluded: string[];
  process: { step: string; title: string; desc: string }[];
  benefits: { title: string; desc: string }[];
  miniCaseStudy: { title: string; role: string; challenge: string; solution: string; result: string };
  faqs: { q: string; a: string }[];
}

const SERVICE_DATA: Record<string, ServiceContent> = {
  'job-placement': {
    slug: 'job-placement',
    title: 'Job Placement Services',
    tagline: 'Land a role that builds a long-term career.',
    overview: `Securing a career-defining technical position requires far more than generic applications. The contemporary tech hiring ecosystem is governed by automated keyword parsers and opaque recruiting intermediaries that filter out high-potential engineers. Codex Tech-IT Job Placement service provides dedicated candidate representation. We analyze your technical depth, rewrite your profile to match active corporate mandates, and introduce you directly to hiring decision-makers across our vetted partner network. We manage the scheduling, coach you through round-specific technical interviews, and negotiate market-leading compensation packages on your behalf.`,
    whoItsFor: [
      'Experienced engineers seeking a step-up in compensation, architecture ownership, or leadership responsibilities.',
      'F-1 OPT and STEM OPT international graduates navigating E-Verified corporate sponsorships.',
      'Career switchers with transferable problem-solving skills looking to break into enterprise tech.',
      'Software professionals facing application fatigue and radio silence from automated job boards.',
    ],
    whatsIncluded: [
      'Comprehensive ATS-optimized resume and LinkedIn overhaul',
      'Targeted representation to 180+ verified enterprise hiring partners',
      '1-on-1 technical mock interviews and system design coaching',
      'Direct interview scheduling with hiring managers (no HR black holes)',
      'STAR-format behavioral interview alignment and storytelling',
      'Data-backed compensation and benefits negotiation assistance',
      'E-Verify documentation and visa transfer coordination support',
      '90-day post-placement onboarding coaching and retention check-ins',
    ],
    process: [
      { step: '01', title: 'Intake & Architecture Audit', desc: 'We conduct a 45-minute deep dive into your technical stack, career ambitions, location preferences, and target compensation.' },
      { step: '02', title: 'Positioning & Rebranding', desc: 'Our technical writers restructure your resume and portfolio around measurable impact, metrics, and high-demand keywords.' },
      { step: '03', title: 'Live Mock Coaching', desc: 'You complete targeted mock interviews with senior developers who calibrate your answers for specific company formats.' },
      { step: '04', title: 'Direct Employer Pitching', desc: 'Our account directors present your profile directly to engineering directors with open, funded requisitions.' },
      { step: '05', title: 'Offer & Onboarding', desc: 'We review offer letters, negotiate competitive base salaries and bonuses, and support your transition into your new team.' },
    ],
    benefits: [
      { title: 'Faster Interview Cycles', desc: 'Candidates typically secure their first curated client interview within 10 to 21 business days.' },
      { title: 'Market-Leading Compensation', desc: 'Our negotiation guidance historically yields a 20% to 40% compensation increase over prior roles.' },
      { title: 'Zero Candidate Fees', desc: 'Standard job placement is 100% employer-funded. We are compensated by our corporate partners upon successful hire.' },
      { title: 'Verified Corporate Sponsors', desc: 'We work with reputable corporate employers who honor E-Verify, STEM-OPT extensions, and H-1B filings.' },
    ],
    miniCaseStudy: {
      title: 'From 200 Rejected Applications to 2 Competing Offers in 19 Days',
      role: 'Full Stack Java Engineer Placed at FinTech Enterprise',
      challenge: 'A developer with 3 years of experience sent hundreds of cold applications without receiving callbacks due to formatting and keyword deficiencies.',
      solution: 'Codex Tech-IT redesigned their resume around Kafka microservices, coached them on system design trade-offs, and pitched them directly to 3 partner companies.',
      result: 'The candidate completed 2 interview rounds within 10 days and accepted an offer with a $132,000 base salary and full benefits.',
    },
    faqs: [
      { q: 'How much does your job placement service cost job seekers?', a: 'Standard recruitment placement services are 100% free for candidates. Partner employers compensate Codex Tech-IT upon successful hire.' },
      { q: 'How long does the average placement take?', a: 'Most candidates who actively participate in mock interviews and profile optimization secure offers within 21 to 30 business days.' },
      { q: 'Do you work with candidates requiring visa sponsorship?', a: 'Yes, we have established relationships with E-Verified employers who sponsor STEM-OPT extensions and H-1B transfers.' },
      { q: 'What happens if I receive multiple job offers?', a: 'Our team helps you objectively evaluate total compensation, tech stack growth, and long-term career benefits to make the best choice.' },
    ],
  },
  'recruitment-staffing': {
    slug: 'recruitment-staffing',
    title: 'Technical Recruitment & Staffing',
    tagline: 'Technical staffing that scales with your roadmap.',
    overview: `Engineering leaders cannot afford multi-month hiring delays or candidates who fail basic live coding rounds. Codex Tech-IT Technical Recruitment & Staffing delivers pre-screened technical talent across Contract, Contract-to-Hire, and Direct Hire models. Our recruiters possess technical backgrounds and evaluate candidates against enterprise architecture standards before presenting a shortlist. Within 48 to 72 hours of requisition kickoff, you receive a curated dossier of 2 to 4 candidates ready for client interviews. We handle multi-state compliance, payroll, and background checks so you can focus on building software.`,
    whoItsFor: [
      'Engineering VPs and Directors needing to rapidly scale development capacity for critical sprints.',
      'Talent Acquisition teams needing specialized niche technical profiles (Cloud DevOps, PySpark, SAP, Salesforce).',
      'Organizations requiring flexible contract-to-hire arrangements to evaluate culture fit before permanent commitment.',
      'Enterprises needing compliant multi-state contractor payroll and onboarding management.',
    ],
    whatsIncluded: [
      'Curated candidate shortlists delivered within 48 to 72 hours',
      'In-depth technical pre-screening by practicing software developers',
      'Multi-state W-2 and contract contractor payroll and tax handling',
      'Comprehensive background, criminal, and employment verification',
      'Flexible engagement models: Contract, Contract-to-Hire, Direct Hire',
      'Dedicated Account Director and weekly hiring pipeline reviews',
      '90-day replacement guarantee on direct-hire placements',
      'Seamless contractor conversion pathways with zero hidden exit penalties',
    ],
    process: [
      { step: '01', title: 'Requisition Calibration', desc: 'We align with your hiring manager on tech stack nuances, team dynamics, budget parameters, and delivery milestones.' },
      { step: '02', title: 'Active Sourcing & Sifting', desc: 'Our sourcing engine evaluates hundreds of candidates across our pre-vetted proprietary engineering network.' },
      { step: '03', title: 'Technical Pre-Screening', desc: 'Our senior engineers administer live coding and architecture assessments, submitting only top performers.' },
      { step: '04', title: 'Client Interview Coordination', desc: 'We schedule interviews, brief candidates on your evaluation style, and collect immediate post-interview feedback.' },
      { step: '05', title: 'Offer & Onboarding', desc: 'We coordinate contract execution, background verification, equipment delivery, and multi-state compliance.' },
    ],
    benefits: [
      { title: '48-Hour Turnaround', desc: 'Receive high-caliber candidate profiles within 2 business days of submitting your job specifications.' },
      { title: '88% Interview-to-Offer Ratio', desc: 'Our rigorous technical pre-screening means you only spend interview hours with genuinely qualified contenders.' },
      { title: 'Zero Compliance Headaches', desc: 'We manage all employer-of-record responsibilities, state tax withholding, and employment eligibility verification.' },
      { title: '90-Day Guarantee', desc: 'If a direct-hire placement leaves within 90 days, we provide a full candidate replacement at no additional charge.' },
    ],
    miniCaseStudy: {
      title: 'Scaling 5 Senior Kubernetes SREs in Under 3 Weeks for Cloud Migration',
      role: 'Enterprise Healthcare SaaS Platform',
      challenge: 'The client faced a strict compliance deadline to containerize their multi-tenant HIPAA application but lacked in-house DevOps recruiters.',
      solution: 'Codex Tech-IT activated our dedicated Cloud network, pre-screened 14 engineers, and delivered 5 accepted contract-to-hire offers within 18 days.',
      result: 'The migration was completed 2 weeks ahead of the federal audit deadline with 100% contractor retention.',
    },
    faqs: [
      { q: 'How quickly can we expect candidate resumes after opening a role?', a: 'Our typical turnaround time for a calibrated shortlist is 48 to 72 business hours.' },
      { q: 'What hiring models are available?', a: 'We offer contract (W-2/C2C), contract-to-hire (with flexible conversion timelines), and direct permanent placement.' },
      { q: 'Do you perform background checks on contractors?', a: 'Yes, every contractor completes multi-jurisdictional criminal, employment, and education verification prior to start.' },
      { q: 'How do you handle payroll in multiple US states?', a: 'Codex Tech-IT handles employer-of-record operations, payroll processing, and state tax compliance across all 50 states.' },
    ],
  },
  'talent-acquisition': {
    slug: 'talent-acquisition',
    title: 'Talent Acquisition Outsourcing (RPO)',
    tagline: 'Build high-performing engineering teams for the long run.',
    overview: `Building internal technical recruiting infrastructure takes months of expensive ramp-up time. Codex Tech-IT Talent Acquisition Outsourcing (RPO) embeds dedicated, seasoned technical recruiting pods directly into your talent organization. Working under your brand, our recruiters integrate with your Applicant Tracking System (Greenhouse, Lever, Workday), establish consistent candidate interview stages, run proactive outbound candidate campaigns, and substantially reduce cost-per-hire compared to traditional contingent recruitment fees.`,
    whoItsFor: [
      'Fast-growing tech companies expanding engineering headcount by 15+ hires in a fiscal year.',
      'Enterprises modernizing legacy recruiting workflows to compete with Tier-1 tech employers.',
      'Startups needing immediate talent operations without adding permanent HR overhead.',
      'Companies experiencing high agency spend and inconsistent candidate submission quality.',
    ],
    whatsIncluded: [
      'Dedicated technical recruiting pods embedded directly into your Slack and ATS',
      'End-to-end recruitment lifecycle management from sourcing to offer acceptance',
      'Employer brand optimization and competitive tech compensation benchmarking',
      'Standardized technical rubric development and interviewer calibration training',
      'Weekly recruitment analytics dashboards (time-to-fill, funnel conversion, diversity metrics)',
      'Candidate pipeline generation and proactive executive talent community nurturing',
      'Seamless scaling: adjust recruiter capacity as hiring roadmaps fluctuate',
      'Substantial cost savings of up to 40% compared to contingent agency commissions',
    ],
    process: [
      { step: '01', title: 'Talent Audit & ATS Integration', desc: 'We inspect your current hiring funnel, integrate with your ATS, and establish baseline performance metrics.' },
      { step: '02', title: 'Employer Brand Positioning', desc: 'We craft compelling technical job descriptions and engineer-focused messaging that boosts inbound responses.' },
      { step: '03', title: 'Dedicated Pod Deployment', desc: 'Our technical sourcers and recruiters begin active outreach, screening, and interview coordination.' },
      { step: '04', title: 'Continuous Calibration', desc: 'Weekly pipeline syncs with engineering hiring managers ensure interview quality stays consistently high.' },
      { step: '05', title: 'Knowledge Transfer & Optimization', desc: 'We document candidate pipelines and operational playbooks, leaving your organization stronger.' },
    ],
    benefits: [
      { title: 'Drastic Cost Reduction', desc: 'Cut overall agency expenditure by 30% to 50% while scaling hiring throughput.' },
      { title: 'Predictable Hiring Velocity', desc: 'Fill engineering positions within an average of 24 days through dedicated pipeline nurturing.' },
      { title: 'Elevated Candidate Experience', desc: 'Candidates receive prompt feedback and a coherent, respectful interview journey that elevates your brand.' },
      { title: 'On-Demand Elasticity', desc: 'Scale recruitment pods up or down as funding cycles and project requirements dictate.' },
    ],
    miniCaseStudy: {
      title: 'Hiring 22 Distributed Engineers in 5 Months While Cutting Cost-per-Hire by 42%',
      role: 'Series B FinTech Platform',
      challenge: 'The client was spending over $350k on fragmented staffing agencies with inconsistent quality and high manager interview fatigue.',
      solution: 'Codex Tech-IT deployed a 3-person embedded RPO pod that standardized the technical interview rubric and executed proactive outbound campaigns.',
      result: 'Filled all 22 positions (Java, React, DevOps) within 150 days and reduced average cost-per-hire from $18k to $9.5k.',
    },
    faqs: [
      { q: 'How does an RPO model differ from traditional contingency staffing?', a: 'An RPO pod acts as an embedded extension of your internal team working under your brand, charging a predictable monthly retainer rather than huge one-off commissions.' },
      { q: 'Which ATS platforms do your recruiters work with?', a: 'Our team is certified in Greenhouse, Lever, Workday, Ashby, BambooHR, and Taleo.' },
      { q: 'What is the minimum engagement length for RPO services?', a: 'We offer flexible 3-month, 6-month, and annual partnership agreements.' },
      { q: 'Who owns the candidate data generated during the project?', a: 'You retain 100% ownership of all candidate databases, applicant pipelines, and contact notes.' },
    ],
  },
  'it-training': {
    slug: 'it-training',
    title: 'Industry IT Training Bootcamps',
    tagline: 'Training built around real jobs, real code, and real architectures.',
    overview: `Theoretical tutorials and self-paced video courses do not prepare engineers for enterprise technical interviews. Codex Tech-IT IT Training Division delivers immersive, live instructor-led programs across 10 in-demand technology specializations. Taught by practicing software architects, our curriculum centers on distributed systems, hands-on cloud labs, and production-grade capstone projects. Every student finishes with tangible GitHub code repositories, automated CI/CD pipelines, and the technical confidence required to excel in Tier-1 coding assessments.`,
    whoItsFor: [
      'Graduates with computer science or engineering degrees seeking enterprise microservices readiness.',
      'Manual QA testers, support analysts, and sysadmins looking to transition into DevOps or Automation.',
      'Developers wanting to modernize their technical stack with Cloud, Spark, or Generative AI.',
      'Engineers preparing for rigorous system design and coding interview rounds.',
    ],
    whatsIncluded: [
      '10 specialized tracks: Java Full Stack, Python APIs, Cloud, DevOps, Data Science, and more',
      'Live interactive classes led by veteran enterprise technical architects',
      '2 production-grade capstone projects designed for your personal GitHub portfolio',
      '24/7 dedicated sandbox environments (AWS, Azure, SAP, and Kubernetes clusters)',
      '1-on-1 weekly code reviews and architecture design feedback sessions',
      'Mock interview simulations and STAR behavioral coaching integrated into the curriculum',
      'Direct pipeline access to Codex Tech-IT corporate hiring and placement network',
      'Verified graduation credential and lifetime access to updated course materials',
    ],
    process: [
      { step: '01', title: 'Track Selection & Skills Assessment', desc: 'We evaluate your programming background to recommend the optimal specialization based on hiring demand.' },
      { step: '02', title: 'Live Architectural Lectures', desc: 'Participate in live interactive lectures focusing on clean code, design patterns, and distributed systems.' },
      { step: '03', title: 'Hands-on Cloud Labs', desc: 'Build scalable services directly in cloud sandbox environments under instructor guidance.' },
      { step: '04', title: 'Capstone Defense', desc: 'Architect and defend 2 enterprise projects demonstrating end-to-end functionality, tests, and CI/CD.' },
      { step: '05', title: 'Placement Fast-Track', desc: 'Graduates enter our dedicated job placement campaigns with immediate hiring partner submissions.' },
    ],
    benefits: [
      { title: 'Job-Aligned Curriculum', desc: 'Our curriculum is updated quarterly based on feedback from enterprise engineering directors.' },
      { title: 'Portfolio-Ready Artifacts', desc: 'Never show a generic to-do app. Build distributed, containerized systems with live API endpoints.' },
      { title: 'Practitioner Mentors', desc: 'Learn directly from practicing engineers who work daily at top tech enterprises.' },
      { title: 'Career Acceleration Guarantee', desc: 'Complete placement representation included upon successful capstone graduation.' },
    ],
    miniCaseStudy: {
      title: 'Manual Tester to $118k SRE Engineer in 12 Weeks',
      role: 'Former QA Analyst at Regional Bank',
      challenge: 'The candidate was pigeonholed in manual spreadsheet testing and lacked practical containerization and Linux automation experience.',
      solution: 'Enrolled in our DevOps & SRE bootcamp, built automated Kubernetes pipelines, and received intensive live mock interview coaching.',
      result: 'Graduated, completed 4 client interviews in 14 days, and secured an SRE role with a 65% salary uplift.',
    },
    faqs: [
      { q: 'Are classes recorded if I have to miss a session?', a: 'Yes, all live sessions are recorded in high-definition and uploaded to the student portal within 2 hours.' },
      { q: 'Do you offer flexible payment plans?', a: 'Yes, we provide 0% interest monthly installment options for all training tracks.' },
      { q: 'Which courses are currently most in demand by employers?', a: 'Java Full Stack Microservices, Cloud DevOps (Kubernetes/AWS), and Cloud Data Engineering (PySpark/Snowflake).' },
      { q: 'Is placement assistance guaranteed upon completion?', a: 'All graduates who complete the capstones and pass our mock assessment receive direct placement representation.' },
    ],
  },
  'background-verification': {
    slug: 'background-verification',
    title: 'Background Verification Services',
    tagline: 'Hire with confidence. Verify with speed.',
    overview: `Bad hires and credential misrepresentation introduce severe security, operational, and financial liabilities to your organization. Codex Tech-IT Background Verification services provide fast, exhaustive, and compliant pre-employment vetting specifically calibrated for technical roles. From multi-jurisdictional criminal history and SSN identity trace to verified educational transcripts and corporate employment checks, we deliver clear, audit-ready compliance dossiers within 48 to 72 hours.`,
    whoItsFor: [
      'Enterprises and startups hiring contractors or full-time engineers requiring trusted vetting.',
      'Financial institutions and healthcare platforms with strict regulatory compliance standards (SOC 2, HIPAA, PCI-DSS).',
      'Staffing firms needing a reliable, rapid background screening partner for technical placements.',
      'Companies needing international credential verification for global technical hires.',
    ],
    whatsIncluded: [
      'Comprehensive 7-year multi-jurisdictional criminal record checks',
      'SSN trace, identity authentication, and address history verification',
      'Direct university registrar degree and educational credential confirmation',
      'Past employment verification (dates, titles, eligibility for rehire)',
      'Global sanctions lists (OFAC, Interpol, Watchlists) screening',
      '5-panel to 10-panel pre-employment drug screening coordination',
      'Credit report and financial integrity checks (where legally permissible for finance roles)',
      'Centralized admin dashboard with real-time status tracking and PDF compliance certificates',
    ],
    process: [
      { step: '01', title: 'Candidate Initiation', desc: 'The candidate receives a mobile-friendly secure link to authorize screening and submit documentation.' },
      { step: '02', title: 'Automated Record Extraction', desc: 'Instant checks (SSN trace, national criminal registries, sanctions lists) run immediately.' },
      { step: '03', title: 'Direct Verification Outreach', desc: 'Our compliance specialists verify employment and educational credentials directly with source institutions.' },
      { step: '04', title: 'Adjudication & Quality Review', desc: 'Our team reviews findings against your predefined hiring criteria to eliminate false positives.' },
      { step: '05', title: 'Final Report Delivery', desc: 'A secure, audit-ready verification dossier is delivered to your hiring manager or HR dashboard.' },
    ],
    benefits: [
      { title: '48-Hour Turnaround', desc: 'Most standard domestic verification reports are completed and certified within 2 business days.' },
      { title: 'FCRA Compliant', desc: 'Full adherence to Fair Credit Reporting Act protocols and federal data privacy standards.' },
      { title: 'Eliminate Resume Fraud', desc: 'Ensure candidate credentials, degrees, and past employment dates match verified reality.' },
      { title: 'Seamless Integration', desc: 'Easily view and download compliance reports directly within our admin management portal.' },
    ],
    miniCaseStudy: {
      title: 'Eliminating 3-Week Onboarding Delays for Tier-1 Banking Staffing',
      role: 'Financial Systems Integrator',
      challenge: 'Previous background screening vendors averaged 18 to 22 business days, causing top technical candidates to accept competing offers.',
      solution: 'Transitioned to Codex Tech-IT streamlined verification service with automated electronic consent and direct university registrar pipelines.',
      result: 'Reduced average background check turnaround to 2.8 days, eliminating onboarding drop-off completely.',
    },
    faqs: [
      { q: 'How long does a standard background check take?', a: 'Standard US screenings take between 48 to 72 business hours.' },
      { q: 'Are your screening procedures FCRA compliant?', a: 'Yes, all our processes, notifications, and consent protocols comply strictly with the Fair Credit Reporting Act.' },
      { q: 'Can you verify foreign educational degrees?', a: 'Yes, we have verified international screening networks covering India, Canada, the UK, and Europe.' },
      { q: 'How are candidates notified?', a: 'Candidates receive a secure, encrypted mobile portal link to review their disclosures and provide consent.' },
    ],
  },
  'payroll-taxes': {
    slug: 'payroll-taxes',
    title: 'Payroll & Tax Compliance Services',
    tagline: 'Payroll, withholdings, and multi-state compliance—handled.',
    overview: `Managing remote and hybrid technical engineering teams across multiple states introduces a maze of tax withholdings, state registrations, unemployment insurance, and worker classification rules. Codex Tech-IT handles complete Employer of Record (EOR) and contractor payroll administration. We ensure seamless bi-weekly direct deposits, W-2 and 1099 tax filings, worker's compensation insurance, and strict I-9 compliance, letting you deploy technical talent anywhere in the United States without administrative risk.`,
    whoItsFor: [
      'Companies hiring remote software developers located in states where they have no existing legal entity.',
      'Organizations utilizing 1099 and W-2 contractors who must mitigate misclassification audits.',
      'Overseas tech firms needing a compliant US Employer of Record to hire American talent.',
      'Growing agencies looking to outsource payroll funding and insurance liabilities.',
    ],
    whatsIncluded: [
      'Multi-state employee payroll processing via direct deposit (weekly or bi-weekly)',
      'Automated federal, state, and local payroll tax withholding and quarterly remittances',
      'Form W-2 and Form 1099 year-end generation, distribution, and IRS reporting',
      'Electronic Form I-9 management and mandatory federal E-Verify verification',
      'Worker\'s compensation, general liability, and professional liability insurance coverage',
      'Accruals tracking for paid sick leave, vacation, and state-mandated benefits',
      'Employee self-service portal for paystubs, W-4 tax updates, and direct deposit changes',
      'Dedicated compliance audit team protecting your business from worker misclassification penalties',
    ],
    process: [
      { step: '01', title: 'Worker Classification Audit', desc: 'We examine job duties and contracts to guarantee correct W-2 or 1099 classification under federal and state tests.' },
      { step: '02', title: 'Seamless Digital Onboarding', desc: 'The worker completes tax elections, direct deposit details, and E-Verify I-9 documentation online in under 10 minutes.' },
      { step: '03', title: 'Time Tracking & Approval', desc: 'Managers easily review and approve bi-weekly timesheets through our intuitive digital portal.' },
      { step: '04', title: 'Automated Disbursement', desc: 'Direct deposits are executed promptly, with automated tax remittances sent to applicable government agencies.' },
      { step: '05', title: 'Year-End Tax Reporting', desc: 'We generate and distribute all W-2s and 1099s with full IRS and state compliance reporting.' },
    ],
    benefits: [
      { title: 'Zero Multi-State Entity Burdens', desc: 'Hire engineers in any of the 50 US states without opening costly local corporate registrations.' },
      { title: '100% Tax Accuracy', desc: 'Eliminate penalties and interest from miscalculated local withholding rates or late filings.' },
      { title: 'Comprehensive Insurance', desc: 'Workers are covered under our master workers\' comp and commercial liability policies.' },
      { title: 'High Worker Satisfaction', desc: 'Engineers enjoy punctual on-time direct deposits and a clean mobile portal for pay records.' },
    ],
    miniCaseStudy: {
      title: 'Enabling a Texas SaaS Firm to Hire Engineers Across 8 States Without Compliance Headaches',
      role: 'Growth-Stage B2B Software Company',
      challenge: 'The client needed to hire 6 remote specialists in California, New York, and North Carolina but lacked local state tax accounts.',
      solution: 'Codex Tech-IT onboarded all 6 engineers under our comprehensive Employer of Record (EOR) multi-state payroll umbrella.',
      result: 'Engineers started within 3 days with full tax compliance, saving the client over $40,000 in legal and administrative setup fees.',
    },
    faqs: [
      { q: 'In which states can you process payroll?', a: 'We support payroll processing and worker compliance across all 50 US states.' },
      { q: 'What is the turnaround time to onboard a new contractor or employee?', a: 'A new worker can complete digital paperwork and E-Verify clearance within 24 to 48 business hours.' },
      { q: 'How do you handle worker classification (W2 vs 1099)?', a: 'We run every engagement through DOL and IRS common-law classification tests to protect you from misclassification fines.' },
      { q: 'Do workers have access to digital pay stubs?', a: 'Yes, all employees receive access to a secure portal for real-time pay stubs, tax documents, and W-2 downloads.' },
    ],
  },
  'resume-linkedin-rebranding': {
    slug: 'resume-linkedin-rebranding',
    title: 'Resume & LinkedIn Rebranding',
    tagline: 'Be found. Be understood. Be shortlisted.',
    overview: `Your resume and LinkedIn profile are not mere career summaries—they are high-converting marketing documents. Over 75% of technical resumes are rejected by Applicant Tracking Systems before a human eye ever evaluates them. Codex Tech-IT Resume & LinkedIn Rebranding service pairs you with seasoned technical career writers who translate your architectural decisions into quantifiable metrics, ATS-compliant formats, and recruiter-magnetic LinkedIn copy. We position your skills around high-budget enterprise pain points so recruiters reach out to you directly.`,
    whoItsFor: [
      'Software engineers sending hundreds of resumes without receiving interview callbacks.',
      'Developers whose resumes are text-heavy or lack quantifiable business impact metrics.',
      'Experienced professionals stepping into Lead, Principal, or Management compensation tiers.',
      'Candidates transitioning stacks or returning to the workforce after a career pause.',
    ],
    whatsIncluded: [
      'Complete end-to-end rewrite by certified technical resume writers',
      '100% ATS-compliant single/two-page structure engineered for Workday, Greenhouse, and Taleo',
      'Extraction and quantification of measurable project metrics (scale, latency, revenue)',
      'LinkedIn profile optimization (headline, keyword-rich summary, featured media, skills order)',
      'Custom technical project descriptions showcasing architectural decisions and tools',
      'Recruiter outreach messaging templates for cold LinkedIn and email introductions',
      'Editable Word (.docx) and production-ready PDF versions of all documents',
      'Two rounds of revisions with direct 1-on-1 feedback from your designated strategist',
    ],
    process: [
      { step: '01', title: 'Profile Diagnostic', desc: 'We analyze your current resume through our deterministic ATS parser to benchmark keyword density and structural gaps.' },
      { step: '02', title: 'Strategy Consultation', desc: 'A 30-minute interview to extract unlisted accomplishments, metric wins, and architectural responsibilities.' },
      { step: '03', title: 'Comprehensive Rebuild', desc: 'Our team writes your new resume from the ground up, infusing targeted keywords and strong action verbs.' },
      { step: '04', title: 'LinkedIn Transformation', desc: 'We craft your headline, About narrative, and skills list to trigger high ranking in LinkedIn Recruiter searches.' },
      { step: '05', title: 'Review & Final Delivery', desc: 'We incorporate your feedback, deliver finalized source files, and guide you on ongoing optimization.' },
    ],
    benefits: [
      { title: '3x More Recruiter Inbounds', desc: 'Proper keyword placement in your LinkedIn headline and About section dramatically increases visibility.' },
      { title: 'Beat ATS Screening', desc: 'Clean, parseable headers ensure your resume achieves 85%+ match scores in automated company portals.' },
      { title: 'Position for Higher Pay', desc: 'Framing your experience around business value positions you for top-quartile salary negotiations.' },
      { title: 'Turnaround in 4 Days', desc: 'Receive your complete draft suite within 4 business days of your strategy intake session.' },
    ],
    miniCaseStudy: {
      title: 'From 3 Recruiter Inbounds/Month to 14 Inbounds/Week After Profile Rebranding',
      role: 'Senior React & Node Full Stack Engineer',
      challenge: 'The candidate’s resume read like a laundry list of duties without mentioning the 40% query latency optimization they had engineered.',
      solution: 'Rebranded their profile around performance engineering, scalability, and cloud microservices with targeted keyword density.',
      result: 'The candidate received 14 inbound recruiter messages within 7 days and accepted a Senior position with a $40k base increase.',
    },
    faqs: [
      { q: 'How long does the rebranding process take?', a: 'You will receive your initial complete draft within 3 to 4 business days after your intake interview.' },
      { q: 'Will I receive editable files?', a: 'Yes, you receive both cleanly formatted PDF documents and fully editable Microsoft Word (.docx) files.' },
      { q: 'Do you guarantee my resume will pass ATS parsers?', a: 'Yes, all our resumes are tested against our proprietary ATS parser to guarantee clean, uncorrupted data extraction.' },
      { q: 'Can I request revisions?', a: 'Every package includes two rounds of revisions to ensure you are 100% confident in your new profile.' },
    ],
  },
  'interview-preparation': {
    slug: 'interview-preparation',
    title: 'Interview Preparation Coaching',
    tagline: 'Walk into your technical interview ready to win.',
    overview: `Passing technical interviews requires distinct skills from day-to-day coding. You must articulate architectural trade-offs under pressure, write clean algorithms on shared screens, and structure behavioral responses with compelling leadership narratives. Codex Tech-IT Interview Preparation service delivers 1-on-1 mock interviews conducted by senior software directors from top tech enterprises. We break down your communication habits, eliminate rambling, sharpen your system design frameworks, and build the poise required to command top-of-market compensation offers.`,
    whoItsFor: [
      'Engineers who freeze up or run out of time during live coding rounds (LeetCode / CoderPad).',
      'Developers preparing for complex distributed system design assessments (microservices, caching, databases).',
      'Technical leads who struggle with STAR-format behavioral and conflict resolution questions.',
      'Candidates who haven’t interviewed in 3+ years and need to shake off interview rust quickly.',
    ],
    whatsIncluded: [
      '1-on-1 live mock interviews with practicing senior software architects',
      'System design deep dives: scaling, message brokers, caching, and database partitioning',
      'Live coding rounds with real-time feedback on clean code, time complexity, and edge cases',
      'STAR behavioral interview framework coaching for leadership and conflict prompts',
      'High-definition video recordings of your mock sessions with timestamped critiques',
      'Negotiation strategy scripts for counter-offers and multi-offer scenarios',
      'Company-specific cheat sheets for major enterprise tech interview loops',
      'Post-mock actionable improvement checklist delivered within 4 hours of each session',
    ],
    process: [
      { step: '01', title: 'Target Role Calibration', desc: 'We review the upcoming interview rounds, target company rubrics, and technical tracks you are preparing for.' },
      { step: '02', title: 'Diagnostic Mock Round', desc: 'A full 60-minute simulated interview replicating real company difficulty, pressure, and time constraints.' },
      { step: '03', title: 'Detailed Feedback Breakdown', desc: 'We analyze your performance across problem-solving approach, code readability, and communication clarity.' },
      { step: '04', title: 'Architecture & System Design Sprints', desc: 'Deep dive into distributed caching, database indexing, and fault tolerance frameworks.' },
      { step: '05', title: 'Behavioral & Negotiation Mastery', desc: 'Refine your STAR stories and practice offer negotiation tactics to maximize final compensation.' },
    ],
    benefits: [
      { title: 'Overcome Interview Anxiety', desc: 'Repeated simulation under realistic pressure transforms nervousness into confident execution.' },
      { title: 'Master System Design Rubrics', desc: 'Learn the exact 5-step framework senior interviewers look for when evaluating architecture.' },
      { title: 'Immediate Concrete Feedback', desc: 'Know precisely what to fix before your high-stakes actual interview, not after a rejection.' },
      { title: 'Higher Offer Rates', desc: 'Candidates who complete our coaching pass final technical rounds at more than double the industry average.' },
    ],
    miniCaseStudy: {
      title: 'Overcoming System Design Rejection to Land a Senior Architect Offer',
      role: 'Staff Software Engineer at Cloud Infrastructure Provider',
      challenge: 'The candidate had failed 3 consecutive system design interviews due to unstructured communication and poor trade-off articulation.',
      solution: 'Completed 4 intensive mock system design rounds with a Codex principal architect, focusing on clear requirements gathering and data flow diagrams.',
      result: 'Passed all 5 rounds of a major tech interview loop and negotiated a $165,000 compensation package.',
    },
    faqs: [
      { q: 'Who conducts the mock interviews?', a: 'All mock sessions are conducted by active senior engineers, team leads, and architects with hiring experience.' },
      { q: 'How many sessions should I book?', a: 'Most candidates see dramatic performance improvements with 3 to 5 targeted mock sessions.' },
      { q: 'Do you provide recordings of our sessions?', a: 'Yes, full session recordings are provided so you can review your communication, posture, and code explanations.' },
      { q: 'Can you prepare me for a specific company format?', a: 'Yes, we tailor mock rounds to match specific interview loops at major financial institutions, SaaS platforms, and consulting firms.' },
    ],
  },
  'custom-job-campaigns': {
    slug: 'custom-job-campaigns',
    title: 'Custom Job Campaigns',
    tagline: 'Hand-picked applications and direct advocacy, not mass-applying.',
    overview: `Mass-submitting resumes to 500 random job openings is exhausting, demoralizing, and ineffective. High-value engineering positions are secured through targeted introductions and strategic employer outreach. Codex Tech-IT Custom Job Campaigns provide white-glove, bespoke career representation. We identify high-fit openings matching your technology stack and location criteria, customize your application materials for each requisition, and leverage direct relationships with hiring directors to advocate for your profile. You focus on preparing for interviews while we manage your entire application pipeline.`,
    whoItsFor: [
      'Busy working professionals who lack 15+ hours a week to search, tailor, and submit job applications.',
      'Specialized engineers seeking confidential career transitions without alerting current employers.',
      'Candidates targeting specific metropolitan markets (Dallas, Austin, New York, Charlotte, Remote).',
      'Technical talent wanting an advocate to negotiate directly with corporate decision-makers.',
    ],
    whatsIncluded: [
      'Curated weekly target company list aligned with your stack and culture preferences',
      'Bespoke resume tailoring and custom cover note drafting for each specific target role',
      'Direct introductions to hiring managers across our pre-vetted 180+ employer network',
      'Full pipeline management: tracking applications, interview invites, and status updates',
      'Confidential candidate handling protecting your current employment security',
      'Interview debriefing and continuous campaign recalibration based on recruiter feedback',
      'Executive salary benchmarking and counter-offer negotiation guidance',
      'Weekly 1-on-1 strategy sync with your designated Senior Career Director',
    ],
    process: [
      { step: '01', title: 'Campaign Blueprint', desc: 'We define your target industries, desired tech stack, compensation minimums, and geographic preferences.' },
      { step: '02', title: 'Target Role Curation', desc: 'Our researchers hand-pick active, funded opportunities across verified corporate partners.' },
      { step: '03', title: 'Tailored Submission & Outreach', desc: 'We tailor your materials and pitch your credentials directly to internal talent acquisition leaders.' },
      { step: '04', title: 'Interview Pipeline Coordination', desc: 'As interview invites arrive, we coordinate your calendar and prepare you for each company’s loop.' },
      { step: '05', title: 'Offer Finalization', desc: 'We assist with offer comparisons, negotiation strategy, and seamless onboarding transitions.' },
    ],
    benefits: [
      { title: 'Save 15+ Hours Every Week', desc: 'Reclaim your evenings and weekends while our team manages your outreach and pipeline tracking.' },
      { title: 'Higher Callback Rates', desc: 'Tailored applications sent directly to decision-makers achieve 5x the response rate of mass job board blasts.' },
      { title: '100% Confidentiality', desc: 'Your search remains entirely private, protecting your current position and professional reputation.' },
      { title: 'Strategic Career Growth', desc: 'Target only companies that offer meaningful technical growth and verified compensation upside.' },
    ],
    miniCaseStudy: {
      title: 'Placed in 23 Days with a 35% Salary Bump While Working 50 Hours a Week',
      role: 'Lead Cloud DevOps Engineer',
      challenge: 'The candidate was overwhelmed with long hours at their current role and had zero time to apply for new opportunities.',
      solution: 'Codex Tech-IT ran a custom campaign, identified 8 target roles, tailored submissions, and secured 3 client interviews.',
      result: 'The candidate only spent time on actual interviews and accepted an offer for $148,000 with full remote flexibility.',
    },
    faqs: [
      { q: 'How is this different from applying to job boards myself?', a: 'We tailor every submission for ATS algorithms and pitch your profile directly to decision-makers through existing relationships.' },
      { q: 'Is my search kept confidential?', a: 'Yes, we never disclose your identity or current employer without your explicit prior authorization.' },
      { q: 'How many applications do you submit on my behalf?', a: 'We focus on quality over volume, typically pitching 15 to 25 highly calibrated target opportunities per month.' },
      { q: 'How do we track campaign progress?', a: 'You receive access to a live tracking dashboard with weekly 1-on-1 review syncs with your career director.' },
    ],
  },
};

export const ServiceDetail: React.FC = () => {
  const { service: slug } = useParams<{ service: string }>();
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const service = slug ? SERVICE_DATA[slug] : null;

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  // Related services
  const otherServices = siteConfig.services.filter((s) => s.slug !== service.slug).slice(0, 3);

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.overview,
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: ['US', 'IN'],
  };

  return (
    <div className="bg-white">
      <SEO
        title={`${service.title} | ${service.tagline}`}
        description={service.overview.slice(0, 160)}
        canonical={`/services/${service.slug}`}
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="pt-10 pb-16 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: 'Services', path: '/services' },
              { label: service.title },
            ]}
          />
          <div className="max-w-3xl mt-4">
            <div className="eyebrow">Codex Specialized IT Service</div>
            <h1 className="text-h1 text-navy-900 mb-4">
              {service.title}
            </h1>
            <p className="text-lg font-heading font-semibold text-orange-600 mb-6">
              "{service.tagline}"
            </p>
            <p className="text-body-lg text-slate-600 leading-relaxed mb-8">
              {service.overview}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="lg" onClick={onOpenConsultation}>
                Book Free Consultation <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
              <Button variant="outline" size="lg" href="/contact">
                Contact Advisory Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For & What's Included */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Who It's For */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <div className="eyebrow">Target Audience</div>
              <h2 className="text-h2 text-navy-900">
                Who This Service <span className="text-brand-gradient">Is For.</span>
              </h2>
              <ul className="flex flex-col gap-4 mt-2">
                {service.whoItsFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What's Included */}
            <div className="lg:col-span-7 bg-navy-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="eyebrow text-orange-400">Deliverables</div>
                <h3 className="text-h2 text-white mb-6">What's Included in the Service.</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
                  {service.whatsIncluded.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-navy-800/80 border border-navy-700/60">
                      <Sparkles className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="section-padding bg-gray-50 border-t border-gray-200/60">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow justify-center">Execution Methodology</div>
            <h2 className="text-h2 text-navy-900 mb-3">
              How the Process <span className="text-brand-gradient">Works.</span>
            </h2>
            <p className="text-slate-600 text-sm">
              A structured, step-by-step roadmap delivering transparent milestones from intake to placement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {service.process.map((step, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-3xl font-numbers font-black text-orange-500 mb-3 block">{step.step}</span>
                  <h3 className="font-heading font-bold text-base text-navy-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="eyebrow justify-center">Measurable Value</div>
            <h2 className="text-h2 text-navy-900 mb-3">
              Core Benefits & <span className="text-brand-gradient">Advantages.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.benefits.map((b, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-navy-900 mb-2">{b.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mini Case Study (SAMPLE) */}
      <section className="section-padding bg-navy-900 text-white relative overflow-hidden">
        <div className="container-custom max-w-4xl relative z-10">
          <div className="eyebrow text-orange-400">Verified Outcome (SAMPLE)</div>
          <h2 className="text-h2 text-white mb-2">{service.miniCaseStudy.title}</h2>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-8">
            Target Role: {service.miniCaseStudy.role}
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-navy-800/80 p-8 rounded-3xl border border-navy-700/80">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">The Challenge</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{service.miniCaseStudy.challenge}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">The Codex Solution</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{service.miniCaseStudy.solution}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-green-400 mb-2">The Result</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-semibold">{service.miniCaseStudy.result}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service FAQs */}
      <section className="section-padding bg-gray-50 border-t border-gray-200/60">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-12">
            <div className="eyebrow justify-center">FAQ</div>
            <h2 className="text-h2 text-navy-900 mb-2">Service FAQs.</h2>
            <p className="text-xs text-slate-500">Common questions regarding {service.title}.</p>
          </div>

          <div className="flex flex-col gap-4">
            {service.faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-5 text-left font-heading font-bold text-sm text-navy-900 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180 text-orange-500' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services Navigation */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-heading font-bold text-base text-navy-900">Explore Other Services</h4>
            <Link to="/services" className="text-xs font-bold text-orange-500 hover:underline">
              View all services →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {otherServices.map((s) => (
              <Link
                key={s.slug}
                to={`/services/${s.slug}`}
                className="p-5 rounded-2xl bg-gray-50 border border-gray-200/80 hover:border-orange-500/40 transition-colors group flex flex-col justify-between"
              >
                <div>
                  <h5 className="font-heading font-bold text-sm text-navy-900 group-hover:text-orange-500 transition-colors mb-1">
                    {s.title}
                  </h5>
                  <p className="text-xs text-slate-500 line-clamp-2">{s.desc}</p>
                </div>
                <div className="mt-4 text-xs font-bold text-orange-500 flex items-center gap-1">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Consultation CTA */}
      <section className="section-padding bg-navy-900 text-white text-center">
        <div className="container-custom max-w-2xl mx-auto">
          <h2 className="text-h2 text-white mb-4">
            Ready to Get Started with <span className="text-brand-gradient">{service.title}?</span>
          </h2>
          <p className="text-slate-300 text-sm mb-8">
            Speak directly with a senior talent advisor to discuss your timeline, requirements, and next steps.
          </p>
          <Button variant="primary" size="lg" onClick={onOpenConsultation}>
            Book Free Consultation <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </section>
    </div>
  );
};
