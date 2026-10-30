/**
 * Old Site Content Points (Grounding & Reference)
 * Source: https://www.codextech-it.com
 * Rewritten in Codex Tech-IT's current voice adhering to strict truth guidelines.
 */

export interface OldSiteCareerPath {
  title: string;
  slug: string;
  description: string;
  sourceUrl: string;
}

export interface OldSiteServicePoint {
  id: string;
  title: string;
  summary: string;
  highlights: string[];
  sourceUrl: string;
}

export interface OldSiteFaq {
  question: string;
  answer: string;
  sourceUrl: string;
}

export interface OldSiteTestimonialDraft {
  name: string;
  role: string;
  quote: string;
  sourceUrl: string;
  isPublished: boolean;
  consentConfirmed: boolean;
}

export const oldSitePositioning = {
  statement:
    'Career success and growth architects, guiding tech talent beyond standard transactional recruiting.',
  narrative:
    'Codex Tech-IT pairs high-conviction engineering candidates—including international STEM graduates and seasoned specialists—with direct hiring teams across North America through structured technical training, personalized advisory, and strategic employer representation.',
  sourceUrl: 'https://codextech-it.com/about-us',
};

export const oldSiteCareerPaths: OldSiteCareerPath[] = [
  {
    title: 'Data Scientist',
    slug: 'data-scientist',
    description: 'Statistical modeling, predictive machine learning pipelines, and production inference.',
    sourceUrl: 'https://codextech-it.com/services',
  },
  {
    title: 'Python Developer',
    slug: 'python-developer',
    description: 'Scalable backend services, async APIs, and distributed data processing pipelines.',
    sourceUrl: 'https://codextech-it.com/services',
  },
  {
    title: 'Java Developer',
    slug: 'java-developer',
    description: 'Enterprise Spring Boot microservices, high-throughput message brokers, and resilient architectures.',
    sourceUrl: 'https://codextech-it.com/services',
  },
  {
    title: 'Business Analyst',
    slug: 'business-analyst',
    description: 'Translating complex operational workflows into technical specs, data models, and sprint roadmaps.',
    sourceUrl: 'https://codextech-it.com/services',
  },
  {
    title: 'Data Engineer',
    slug: 'data-engineer',
    description: 'ETL orchestration, modern data lakehouse architectures, Snowflake, and streaming pipelines.',
    sourceUrl: 'https://codextech-it.com/services',
  },
  {
    title: 'Data Analyst',
    slug: 'data-analyst',
    description: 'Business intelligence dashboards, dimensional modeling, SQL analytics, and executive reporting.',
    sourceUrl: 'https://codextech-it.com/services',
  },
  {
    title: 'Full Stack Developer',
    slug: 'full-stack-developer',
    description: 'End-to-end web architectures bridging reactive modern frontends with resilient cloud backends.',
    sourceUrl: 'https://codextech-it.com/services',
  },
  {
    title: 'Front-End Developer',
    slug: 'front-end-developer',
    description: 'Accessible, responsive UI/UX engineering with TypeScript, React, and performance optimizations.',
    sourceUrl: 'https://codextech-it.com/services',
  },
  {
    title: 'Back-End Developer',
    slug: 'back-end-developer',
    description: 'Distributed database design, low-latency microservices, authentication, and cloud infrastructure.',
    sourceUrl: 'https://codextech-it.com/services',
  },
  {
    title: 'AWS Cloud Engineer',
    slug: 'aws-engineer',
    description: 'Multi-region cloud infrastructure, Terraform IaC, container orchestration, and serverless architectures.',
    sourceUrl: 'https://codextech-it.com/services',
  },
  {
    title: 'SQL / Database Engineer',
    slug: 'sql-engineer',
    description: 'Complex query optimization, transaction tuning, relational data modeling, and DB governance.',
    sourceUrl: 'https://codextech-it.com/services',
  },
];

export const oldSiteServices: Record<string, OldSiteServicePoint> = {
  careerGuidance: {
    id: 'career-guidance',
    title: 'Personalized Career Guidance',
    summary:
      'A dedicated career advisor analyzes your technical background, identifies market positioning gaps, and outlines a strategic path forward.',
    highlights: [
      'Dedicated one-on-one consultation with a senior placement specialist',
      'Clarification of hiring timelines, visa-friendly requisitions, and market expectations',
      'Realistic assessment of compensation bands across North American technology corridors',
    ],
    sourceUrl: 'https://codextech-it.com/services',
  },
  enhancedResumeCrafting: {
    id: 'enhanced-resume-crafting',
    title: 'Enhanced Resume Crafting',
    summary:
      'Re-engineering technical resumes for maximum ATS parse rate, engineering credibility, and US enterprise recruiter impact.',
    highlights: [
      'Tailored keyword density calibrated to specific target roles and tech stacks',
      'Action-oriented architectural impact bullets emphasizing scale, latency, and business ROI',
      'Full LinkedIn profile optimization to drive qualified inbound recruiter outreach',
    ],
    sourceUrl: 'https://codextech-it.com/services',
  },
  skillDevelopment: {
    id: 'skill-development-program',
    title: 'Skill Development Program',
    summary:
      'Rigorous, instructor-led technical coaching bridging theoretical knowledge with live enterprise software engineering.',
    highlights: [
      'Tailored architectural curriculum aligned with enterprise hiring trends',
      'Live code reviews, production system design clinics, and code labs',
      'Direct mentorship from working senior engineering leaders',
    ],
    sourceUrl: 'https://codextech-it.com/services',
  },
  resumePromotion: {
    id: 'resume-promotion',
    title: 'Strategic Talent Representation',
    summary:
      'Proactive promotion of vetted candidate profiles directly to enterprise hiring authorities and prime vendor desks.',
    highlights: [
      'Direct pipeline to hiring managers without third-party aggregator noise',
      'Targeted campaign positioning matched specifically to vetted skill proficiencies',
      'Continuous advocacy and interview interview slot scheduling support',
    ],
    sourceUrl: 'https://codextech-it.com/services',
  },
  documentationSupport: {
    id: 'documentation-support',
    title: 'Post-Offer Onboarding & Documentation Advisory',
    summary:
      'Guidance through background clearance, corporate documentation, and payroll setup upon receiving an offer.',
    highlights: [
      'Structured onboarding document review to avoid paperwork delays',
      'Compliance checklist support for seamless corporate entry',
      'General informational guidance on employer payroll processes',
    ],
    sourceUrl: 'https://codextech-it.com/services',
  },
  oneOnOneInterview: {
    id: 'one-on-one-interview',
    title: 'One-on-One Interview Coaching',
    summary:
      'Customized role-and-company preparation focusing on technical defense and reverse-engineering the interviewer expectations.',
    highlights: [
      'Company-specific interview intelligence and rubric preparation',
      'Formulating high-conviction questions to ask engineering leaders',
      'Confidence building and executive communication framing',
    ],
    sourceUrl: 'https://codextech-it.com/services',
  },
  mockInterview: {
    id: 'mock-interview',
    title: 'Simulated Technical Mock Interviews',
    summary:
      'Live simulated interviews with real-time rubric feedback covering both deep algorithmic defense and behavioral leadership.',
    highlights: [
      'Live whiteboard system design and algorithmic simulation rounds',
      'Structured feedback on non-verbal cues, pacing, and concise technical articulation',
      'STAR methodology calibration for behavioral and situational scenarios',
    ],
    sourceUrl: 'https://codextech-it.com/services',
  },
};

export const oldSiteJobPlacementSteps = [
  {
    step: 1,
    title: 'Candidate Profile & Diagnostic Review',
    description:
      'Deep dive into candidate technical competencies, portfolio artifacts, and target role criteria.',
  },
  {
    step: 2,
    title: 'Strategic Skill & Portfolio Refinement',
    description:
      'Closing specific tech stack gaps through targeted labs, code polish, and architectural review.',
  },
  {
    step: 3,
    title: 'Resume & Brand Alignment',
    description:
      'Optimizing resume keyword indexing and LinkedIn presence for senior technical recruiter searches.',
  },
  {
    step: 4,
    title: 'Targeted Opportunity Matching',
    description:
      'Direct submission to vetted hiring teams, verified client partner requisitions, and active tech corridors.',
  },
  {
    step: 5,
    title: 'Interview Preparation & Mock Defense',
    description:
      'Technical grilling simulation, behavioral framing, and system architecture walkthrough practice.',
  },
  {
    step: 6,
    title: 'Offer Evaluation & Seamless Onboarding',
    description:
      'Objective compensation benchmarking, document readiness verification, and smooth Day-1 integration.',
  },
];

export const oldSiteAboutPoints = {
  target: {
    title: 'Our Target',
    description:
      'Provide tech professionals with a high-conviction platform that secures genuine career opportunities, deserved recognition, and sustained upward mobility.',
    sourceUrl: 'https://codextech-it.com/about-us',
  },
  instructors: {
    title: 'Skilled Mentors & Instructors',
    description:
      'Provide clear, precise, and inspiring technical guidance drawn directly from active enterprise engineering experience.',
    sourceUrl: 'https://codextech-it.com/about-us',
  },
  mission: {
    title: 'Our Mission & Commitment',
    statement:
      'To deliver unparalleled IT placement and staffing services through relationships built on absolute transparency, immediate client value, and enduring career partnerships—operating as solution architects rather than conventional recruiters.',
    sourceUrl: 'https://codextech-it.com/about-us',
  },
};

export const oldSiteFaqs: OldSiteFaq[] = [
  {
    question: 'Why partner with a specialized technical staffing and placement firm?',
    answer:
      'Navigating direct enterprise applicant tracking systems often results in resumes being buried among thousands of generic submissions. A dedicated placement partner maintains direct relationships with hiring directors, ensures your qualifications are personally reviewed, and provides coaching tailored to specific corporate expectations.',
    sourceUrl: 'https://codextech-it.com/faqs',
  },
  {
    question: 'What professional development and training is provided?',
    answer:
      'Our programs focus on live project coaching, modern system design, microservice architectures, and role-specific interview simulation rather than rote memorization, helping engineers defend complex technical choices with conviction.',
    sourceUrl: 'https://codextech-it.com/faqs',
  },
  {
    question: 'What is the typical placement timeline?',
    answer:
      'Placement timing varies significantly based on individual technical background, target specialization, hiring seasonality, and current market demand. While some candidates match within weeks, comprehensive preparation and enterprise interview loops typically take several weeks to a few months.',
    sourceUrl: 'https://codextech-it.com/faqs',
  },
];

export const oldSiteDraftTestimonials: OldSiteTestimonialDraft[] = [
  {
    name: 'Raj Chauhan',
    role: 'Software Engineer',
    quote:
      'Codex Tech-IT has been instrumental in shaping my career. Their dedicated team went above and beyond to match my skills with the perfect job opportunity. Their professionalism and commitment to both candidates and clients truly set them apart.',
    sourceUrl: 'https://codextech-it.com/about-us',
    isPublished: false,
    consentConfirmed: false,
  },
  {
    name: 'Anjana Thomas',
    role: 'Software Engineer',
    quote:
      "Codex Tech-IT is not just a staffing agency; they are a true partner in your career journey. The team is responsive, proactive, and genuinely invested in your success. Thanks to them, I found a job that I'm not only qualified for but also passionate about.",
    sourceUrl: 'https://codextech-it.com/about-us',
    isPublished: false,
    consentConfirmed: false,
  },
  {
    name: 'Ramandeep Kaur',
    role: 'Software Developer',
    quote:
      'Working with Codex Tech-IT was a seamless experience. They understood my career goals and connected me with a company that perfectly aligned with my skills. The entire process was efficient, and their team was always available to address any concerns. Highly recommend!',
    sourceUrl: 'https://codextech-it.com/about-us',
    isPublished: false,
    consentConfirmed: false,
  },
  {
    name: 'Smit Patel',
    role: 'IT Professional',
    quote:
      'Codex Tech-IT is the go-to IT placement company! Their expertise in matching candidates with the right opportunities is unparalleled. I landed my dream job through their services, and the entire process was seamless. Highly recommend Codex Tech-IT for anyone looking for top-notch IT placement services.',
    sourceUrl: 'https://codextech-it.com/about-us',
    isPublished: false,
    consentConfirmed: false,
  },
  {
    name: 'Shweta Singh',
    role: 'IT Specialist',
    quote:
      'Thanks to Codex Tech-IT, I am now in a position that perfectly aligns with my career goals. Their professionalism, attention to detail, and commitment to candidate success are truly commendable. I am grateful for the personalized service they provided, guiding me through the job search process and helping me secure an incredible opportunity. Codex Tech-IT is the go-to for anyone serious about advancing their career in IT.',
    sourceUrl: 'https://codextech-it.com/about-us',
    isPublished: false,
    consentConfirmed: false,
  },
  {
    name: 'Sonia Rajput',
    role: 'IT Professional',
    quote:
      "Codex Tech-IT truly understands the needs of IT professionals. Their commitment to excellence and personalized service made my job search a breeze. With their guidance, I not only found a job that matches my skill set but also one that I'm genuinely excited about. Kudos to Codex Tech-IT for being a reliable partner in my career journey!",
    sourceUrl: 'https://codextech-it.com/about-us',
    isPublished: false,
    consentConfirmed: false,
  },
  {
    name: 'Maharshi Bhardwaj',
    role: 'Software Developer',
    quote:
      'Codex Tech-IT has been a game-changer in my job search! Their personalized approach and dedication to finding the right fit for candidates are unmatched. Thanks to their exceptional service, I landed the best job that perfectly aligns with my skills and career aspirations. Grateful to the Codex Tech-IT team for making this career milestone possible!',
    sourceUrl: 'https://codextech-it.com/about-us',
    isPublished: false,
    consentConfirmed: false,
  },
];

