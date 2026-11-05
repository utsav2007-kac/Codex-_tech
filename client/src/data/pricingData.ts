export interface PricingPlan {
  id: 'basic' | 'elite' | 'premium';
  name: string;
  duration: string;
  durationMonths: number;
  headerColor: string;
  accentColor: string;
  textColor: string;
  badgeBg: string;
  badgeText: string;
  tagline: string;
  pricing: {
    upfront: string;
    plusOrOffer: {
      label: string;
      value: string;
    };
    paidOrThen: {
      label: string;
      value: string;
    };
    total?: {
      label: string;
      value: string;
    };
  };
  cardHighlights: string[];
  refundEligible: boolean;
  idealFor: string;
  overview: string;
  paymentTerms: string[];
  featuresCategorized: {
    category: string;
    items: { name: string; included: boolean; detail?: string }[];
  }[];
  jobWarrantyMonths?: number;
  refundPolicyDetails: string;
}

export const PRICING_PLANS: Record<'basic' | 'elite' | 'premium', PricingPlan> = {
  basic: {
    id: 'basic',
    name: 'Basic',
    duration: '6 months',
    durationMonths: 6,
    headerColor: 'bg-[#3D4B5C]',
    accentColor: '#3D4B5C',
    textColor: 'text-slate-800',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
    tagline: 'Foundational career accelerator with recorded training, quality job applications, and expert offer review.',
    pricing: {
      upfront: '$1,500',
      plusOrOffer: {
        label: 'PLUS',
        value: '10% of annual salary package',
      },
      paidOrThen: {
        label: 'PAID',
        value: 'In 4 installments, starting when you receive your offer letter',
      },
    },
    cardHighlights: [
      'Recorded technical training',
      'Quality job applications',
      'Offer review',
    ],
    refundEligible: false,
    idealFor: 'Self-motivated engineers who need structured resumes, high-volume verified job applications, and expert compensation review upon offer.',
    overview: 'The Basic plan provides six months of direct career support. You receive our battle-tested recorded technical curriculum, professional resume crafting and understanding sessions, automated quality job applications, and hands-on compensation and offer review when your offer arrives.',
    paymentTerms: [
      'Upfront enrollment fee: $1,500 due upon registration.',
      'Success fee: 10% of your first-year annual salary package.',
      'Flexible payment schedule: Paid in 4 equal installments, starting only after you receive and accept your written offer letter.',
    ],
    jobWarrantyMonths: 0,
    refundPolicyDetails: 'The Basic plan upfront fee covers immediate onboarding, resume reconstruction, and software platform infrastructure. This tier is not eligible for refund guarantee.',
    featuresCategorized: [
      {
        category: 'Training & Skill Enhancement',
        items: [
          { name: 'Technical Training', included: true, detail: 'Comprehensive on-demand recorded technical training modules' },
          { name: 'Projects + Certifications', included: false, detail: 'Not included in Basic tier' },
        ],
      },
      {
        category: 'Resume & Branding',
        items: [
          { name: 'Screening Call + Career Guidance', included: true, detail: 'Comprehensive intake and strategic roadmap call' },
          { name: 'Resume Crafting', included: true, detail: 'Custom tailored resume for US enterprise tech roles' },
          { name: 'Resume Understanding Session', included: true, detail: 'Deep dive call to master your resume line-by-line' },
        ],
      },
      {
        category: 'Job Outreach & Applications',
        items: [
          { name: 'Quality Job Applications', included: true, detail: 'Targeted submissions to high-relevance US job requisitions' },
          { name: 'ATS Applications', included: false, detail: 'Not included in Basic tier' },
          { name: 'Personal Recruiter', included: false, detail: 'Not included in Basic tier' },
        ],
      },
      {
        category: 'Interview Preparation & Support',
        items: [
          { name: 'JD / Mock Interview Sessions', included: false, detail: 'Not included in Basic tier' },
          { name: 'Interview Preparation', included: false, detail: 'Not included in Basic tier' },
          { name: 'Assessment Support', included: false, detail: 'Not included in Basic tier' },
          { name: 'Interview Support + Feedback', included: false, detail: 'Not included in Basic tier' },
        ],
      },
      {
        category: 'Offer & Placement Guarantees',
        items: [
          { name: 'Offer Review', included: true, detail: 'Complete compensation benchmarking and contract review' },
          { name: 'We Care Support', included: true, detail: 'Continuous administrative and candidate assistance' },
          { name: 'BGC + Onboarding Help', included: true, detail: 'Full guidance on background checks and corporate onboarding' },
          { name: 'Job Warranty', included: false, detail: 'No job warranty on Basic tier' },
          { name: 'Eligible for Refund', included: false, detail: 'Non-refundable' },
        ],
      },
    ],
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    duration: '9 months',
    durationMonths: 9,
    headerColor: 'bg-[#0E7490]',
    accentColor: '#0E7490',
    textColor: 'text-cyan-950',
    badgeBg: 'bg-cyan-50 border-cyan-300 text-cyan-800',
    badgeText: 'text-[#0E7490]',
    tagline: 'Our flagship 9-month program featuring live or recorded training, intensive mock interviews, ATS applications, and a 3-month job warranty.',
    pricing: {
      upfront: '$2,500',
      plusOrOffer: {
        label: 'PLUS',
        value: '12% of annual salary package',
      },
      paidOrThen: {
        label: 'PAID',
        value: 'In 4 to 5 installments, starting when you receive your offer letter',
      },
    },
    cardHighlights: [
      'Live or recorded training',
      'Mock interviews and interview support',
      '3-month job warranty',
    ],
    refundEligible: true,
    idealFor: 'Software engineers, DevOps, and cloud professionals looking for comprehensive live training, rigorous mock interview coaching, and refund-backed peace of mind.',
    overview: 'The Elite plan delivers nine months of intensive, end-to-end career acceleration. You get access to live or recorded technical tracks, ATS-tailored job outreach, real-world mock interview simulations, ongoing interview feedback loops, and a 3-month job warranty backed by our refund policy.',
    paymentTerms: [
      'Upfront enrollment fee: $2,500 due upon registration.',
      'Success fee: 12% of your first-year annual salary package.',
      'Flexible payment schedule: Paid in 4 to 5 installments, beginning only once you receive your official offer letter.',
    ],
    jobWarrantyMonths: 3,
    refundPolicyDetails: 'Refund Eligible: If Codex Tech-IT does not secure you a qualifying job offer meeting the agreed program criteria within the program duration, you are eligible for our money-back guarantee pursuant to terms.',
    featuresCategorized: [
      {
        category: 'Training & Skill Enhancement',
        items: [
          { name: 'Technical Training', included: true, detail: 'Live interactive classes plus on-demand recorded technical curriculum' },
          { name: 'Projects + Certifications', included: true, detail: 'Hands-on production projects and cloud certification guidance' },
        ],
      },
      {
        category: 'Resume & Branding',
        items: [
          { name: 'Screening Call + Career Guidance', included: true, detail: 'Comprehensive intake and strategic roadmap call' },
          { name: 'Resume Crafting', included: true, detail: 'Custom tailored resume for US enterprise tech roles' },
          { name: 'Resume Understanding Session', included: true, detail: 'Deep dive call to master your resume line-by-line' },
        ],
      },
      {
        category: 'Job Outreach & Applications',
        items: [
          { name: 'Quality Job Applications', included: true, detail: 'Targeted submissions to high-relevance US job requisitions' },
          { name: 'ATS Applications', included: true, detail: 'Direct ATS parsing optimization and algorithmic application campaigns' },
          { name: 'Personal Recruiter', included: false, detail: 'Available exclusively in Premium tier' },
        ],
      },
      {
        category: 'Interview Preparation & Support',
        items: [
          { name: 'JD / Mock Interview Sessions', included: true, detail: 'Role-specific mock interview sessions based on exact Job Descriptions' },
          { name: 'Interview Preparation', included: true, detail: 'Behavioral, technical coding, and system design coaching' },
          { name: 'Assessment Support', included: false, detail: 'Available exclusively in Premium tier' },
          { name: 'Interview Support + Feedback', included: true, detail: 'Post-round interview analysis, debriefs, and strategic adjustments' },
        ],
      },
      {
        category: 'Offer & Placement Guarantees',
        items: [
          { name: 'Offer Review', included: true, detail: 'Complete compensation benchmarking and contract review' },
          { name: 'We Care Support', included: true, detail: 'Dedicated priority candidate advocacy and continuous check-ins' },
          { name: 'BGC + Onboarding Help', included: true, detail: 'Full guidance on background checks and corporate onboarding' },
          { name: 'Job Warranty', included: true, detail: '3-Month Job Warranty protection post-placement' },
          { name: 'Eligible for Refund', included: true, detail: 'Fully eligible for our satisfaction guarantee' },
        ],
      },
    ],
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    duration: '12 months',
    durationMonths: 12,
    headerColor: 'bg-[#0B1B2E]',
    accentColor: '#0B1B2E',
    textColor: 'text-navy-900',
    badgeBg: 'bg-navy-900/10 border-navy-900/30 text-navy-900',
    badgeText: 'text-navy-900',
    tagline: 'Our premier all-inclusive 12-month executive tier with a dedicated personal recruiter, technical assessment support, and a 6-month job warranty.',
    pricing: {
      upfront: '$3,000',
      plusOrOffer: {
        label: 'ON OFFER LETTER',
        value: '$3,000',
      },
      paidOrThen: {
        label: 'THEN',
        value: '$4,000 in 2 installments',
      },
      total: {
        label: 'TOTAL',
        value: '$10,000',
      },
    },
    cardHighlights: [
      'Personal recruiter',
      'Assessment support',
      '6-month job warranty',
    ],
    refundEligible: true,
    idealFor: 'Senior engineers, tech leads, and high-earning professionals seeking a VIP concierge experience with fixed total fees, dedicated recruiter representation, and maximum security.',
    overview: 'The Premium tier is our highest level of career partnership. Designed for those who want an unfair advantage in the market, it includes a dedicated Personal Recruiter managing your pipeline, real-time technical assessment support, a capped flat-rate fee structure ($10,000 total), and an industry-leading 6-month job warranty.',
    paymentTerms: [
      'Upfront enrollment fee: $3,000 due upon registration.',
      'On offer letter: $3,000 due upon receiving your offer letter.',
      'Remaining balance: $4,000 paid in 2 equal installments ($2,000 each) after starting your new role.',
      'Total fixed program cost: $10,000 (No salary percentage cuts).',
    ],
    jobWarrantyMonths: 6,
    refundPolicyDetails: 'Refund Eligible: Complete refund eligibility under our premium placement service level agreement. If we fail to secure your qualifying offer, you are protected by our contractual refund clause.',
    featuresCategorized: [
      {
        category: 'Training & Skill Enhancement',
        items: [
          { name: 'Technical Training', included: true, detail: 'Live interactive classes plus on-demand recorded technical curriculum' },
          { name: 'Projects + Certifications', included: true, detail: 'Production portfolio development and advanced cloud architecture projects' },
        ],
      },
      {
        category: 'Resume & Branding',
        items: [
          { name: 'Screening Call + Career Guidance', included: true, detail: 'Executive strategy session with Senior Talent Director' },
          { name: 'Resume Crafting', included: true, detail: 'High-impact resume tailored for top-paying US employers' },
          { name: 'Resume Understanding Session', included: true, detail: 'Deep dive call to master your resume line-by-line' },
        ],
      },
      {
        category: 'Job Outreach & Applications',
        items: [
          { name: 'Quality Job Applications', included: true, detail: 'Targeted submissions to high-relevance US job requisitions' },
          { name: 'ATS Applications', included: true, detail: 'Algorithmic application campaigns across priority platforms' },
          { name: 'Personal Recruiter', included: true, detail: 'Dedicated talent representative proactively pitching your profile to hiring managers' },
        ],
      },
      {
        category: 'Interview Preparation & Support',
        items: [
          { name: 'JD / Mock Interview Sessions', included: true, detail: 'Unlimited JD-specific mock interviews with veteran US engineering managers' },
          { name: 'Interview Preparation', included: true, detail: 'Full-spectrum coding, architecture, behavioral, and leadership coaching' },
          { name: 'Assessment Support', included: true, detail: 'Comprehensive support and review for take-home tests and live technical assessments' },
          { name: 'Interview Support + Feedback', included: true, detail: 'Continuous round-by-round debriefing and interview coaching' },
        ],
      },
      {
        category: 'Offer & Placement Guarantees',
        items: [
          { name: 'Offer Review', included: true, detail: 'Executive-level salary negotiation coaching to maximize your total compensation' },
          { name: 'We Care Support', included: true, detail: '24/7 VIP concierge candidate support' },
          { name: 'BGC + Onboarding Help', included: true, detail: 'Full guidance on background checks and corporate onboarding' },
          { name: 'Job Warranty', included: true, detail: '6-Month Job Warranty protection post-placement' },
          { name: 'Eligible for Refund', included: true, detail: 'Fully eligible for contractual refund guarantee' },
        ],
      },
    ],
  },
};

export const COMPARISON_TABLE_ROWS = [
  {
    feature: 'Plan duration',
    basic: '6 months',
    elite: '9 months',
    premium: '12 months',
    type: 'text',
  },
  {
    feature: 'Screening Call + Career Guidance',
    basic: true,
    elite: true,
    premium: true,
    type: 'check',
  },
  {
    feature: 'Technical Training',
    basic: 'Recorded',
    elite: 'Live / Recorded',
    premium: 'Live / Recorded',
    type: 'text',
  },
  {
    feature: 'Resume Crafting',
    basic: true,
    elite: true,
    premium: true,
    type: 'check',
  },
  {
    feature: 'Resume Understanding Session',
    basic: true,
    elite: true,
    premium: true,
    type: 'check',
  },
  {
    feature: 'Quality Job Applications',
    basic: true,
    elite: true,
    premium: true,
    type: 'check',
  },
  {
    feature: 'ATS Applications',
    basic: false,
    elite: true,
    premium: true,
    type: 'check',
  },
  {
    feature: 'Projects + Certifications',
    basic: false,
    elite: true,
    premium: true,
    type: 'check',
  },
  {
    feature: 'JD / Mock Interview Sessions',
    basic: false,
    elite: true,
    premium: true,
    type: 'check',
  },
  {
    feature: 'Interview Preparation',
    basic: false,
    elite: true,
    premium: true,
    type: 'check',
  },
  {
    feature: 'Assessment Support',
    basic: false,
    elite: false,
    premium: true,
    type: 'check',
  },
  {
    feature: 'Interview Support + Feedback',
    basic: false,
    elite: true,
    premium: true,
    type: 'check',
  },
  {
    feature: 'Personal Recruiter',
    basic: false,
    elite: false,
    premium: true,
    type: 'check',
  },
  {
    feature: 'Job Warranty',
    basic: false,
    elite: '3 months',
    premium: '6 months',
    type: 'text-or-dash',
  },
  {
    feature: 'We Care Support',
    basic: true,
    elite: true,
    premium: true,
    type: 'check',
  },
  {
    feature: 'BGC + Onboarding Help',
    basic: true,
    elite: true,
    premium: true,
    type: 'check',
  },
  {
    feature: 'Offer Review',
    basic: true,
    elite: true,
    premium: true,
    type: 'check',
  },
  {
    feature: 'Eligible for Refund',
    basic: false,
    elite: true,
    premium: true,
    type: 'check',
  },
];

export const EVERY_PLAN_INCLUDES = [
  'Screening Call + Career Guidance',
  'Resume Crafting',
  'Resume Understanding Session',
  'We Care Support',
  'BGC + Onboarding Help',
  'Offer Review',
];

