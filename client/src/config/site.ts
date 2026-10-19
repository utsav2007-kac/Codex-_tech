// Codex Tech-IT Global Site Configuration
// All contact details centralized here with default markets USA + India (TODO marked for easy replacement)

export const siteConfig = {
  name: 'Codex Tech-IT',
  tagline: 'We Deliver Jobs Faster',
  domain: 'codextechit.com',
  url: 'https://codextechit.com',
  announcement: 'Now booking free career consultations. Reserve your slot →',
  contact: {
    // TODO: Update primary contact details if different
    phoneUSA: '+1 (800) 555-0199',
    phoneIndia: '+91 (40) 5550-1922',
    email: 'contact@codextechit.com',
    careersEmail: 'careers@codextechit.com',
    talentEmail: 'hire@codextechit.com',
    whatsappNumber: '+1 (800) 555-0199',
    whatsappUrl: 'https://wa.me/18005550199?text=Hello%20Codex%20Tech-IT,%20I%20am%20interested%20in%20career%20opportunities',
    hours: 'Mon - Fri: 8:00 AM - 7:00 PM CST',
  },
  offices: [
    {
      country: 'United States',
      city: 'Plano, Texas',
      address: '5700 Tennyson Pkwy, Suite 300, Plano, TX 75024',
      phone: '+1 (469) 555-0188',
      type: 'US Corporate Headquarters',
    },
    {
      country: 'India',
      city: 'Hyderabad, Telangana',
      address: 'HITEC City, Phase 2, Madhapur, Hyderabad, TS 500081',
      phone: '+91 (40) 5550-1922',
      type: 'Global Delivery & Training Hub',
    },
  ],
  services: [
    { slug: 'job-placement', title: 'Job Placement', desc: 'Direct corporate employer representation to land roles that build long-term careers.' },
    { slug: 'recruitment-staffing', title: 'Recruitment & Staffing', desc: 'Contract, contract-to-hire, and direct-hire technical staffing at scale.' },
    { slug: 'talent-acquisition', title: 'Talent Acquisition (RPO)', desc: 'Embedded engineering recruitment pods designed to scale technical teams.' },
    { slug: 'it-training', title: 'Industry IT Training', desc: 'Live hands-on training across 10 in-demand technology tracks with labs.' },
    { slug: 'background-verification', title: 'Background Verification', desc: 'Exhaustive identity, criminal, and employment screening for technical hires.' },
    { slug: 'payroll-taxes', title: 'Payroll & Compliance', desc: 'Multi-state W-2 and contract payroll handling, tax filings, and insurance.' },
    { slug: 'resume-linkedin-rebranding', title: 'Resume & LinkedIn Rebranding', desc: 'ATS-optimized positioning that triples recruiter inbound messages.' },
    { slug: 'interview-preparation', title: 'Interview Preparation', desc: 'Intensive mock interviews, coding walkthroughs, and STAR behavioral coaching.' },
    { slug: 'custom-job-campaigns', title: 'Custom Job Campaigns', desc: 'Curated employer outreach, personalized pitch strategy, and offer negotiation.' },
  ],
  tools: [
    { slug: 'resume-analyzer', title: 'ATS Resume Analyzer', desc: 'Evaluate your resume keyword score, structure, and action verbs against target roles.' },
    { slug: 'linkedin-profile-analyzer', title: 'LinkedIn Profile Analyzer', desc: 'Optimize your headline, summary narrative, and recruiter search visibility.' },
    { slug: 'job-match-score', title: 'Job Description Match Score', desc: 'Compare your resume against any job description to discover missing skills.' },
    { slug: 'interview-readiness', title: 'Interview Readiness Quiz', desc: 'Self-assess technical and behavioral readiness and receive a 14-day study plan.' },
  ],
  industries: [
    { slug: 'banking-finance', title: 'Banking & Financial Services' },
    { slug: 'healthcare', title: 'Healthcare & Life Sciences' },
    { slug: 'insurance', title: 'Insurance & InsurTech' },
    { slug: 'retail-ecommerce', title: 'Retail & E-Commerce' },
    { slug: 'telecom', title: 'Telecommunications & Networks' },
    { slug: 'manufacturing', title: 'Manufacturing & Industrial IoT' },
    { slug: 'government-public-sector', title: 'Government & Public Sector' },
  ],
  socials: {
    linkedin: 'https://linkedin.com/company/codex-tech-it',
    twitter: 'https://twitter.com/codextechit',
    github: 'https://github.com/codextechit',
    youtube: 'https://youtube.com/@codextechit',
  },
};
