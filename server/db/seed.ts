import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Codex Tech-IT Database...');

  // 1. Admin User
  const adminPasswordHash = await bcrypt.hash('CodexAdmin2026!', 10);
  await prisma.adminUser.upsert({
    where: { email: 'admin@codextechit.com' },
    update: { password_hash: adminPasswordHash },
    create: {
      email: 'admin@codextechit.com',
      password_hash: adminPasswordHash,
      name: 'System Administrator',
      role: 'SUPERADMIN',
    },
  });

  // 2. Site Settings
  const defaultSettings = [
    {
      key: 'general',
      value: {
        site_name: 'Codex Tech-IT',
        tagline: 'We Deliver Jobs Faster',
        primary_phone: '+1 (800) 555-0199',
        primary_email: 'contact@codextechit.com',
        careers_email: 'careers@codextechit.com',
        whatsapp_number: '+1 (800) 555-0199',
        announcement: 'Now booking free career consultations. Reserve your slot →',
        offices: [
          {
            city: 'Plano, TX',
            address: '5700 Tennyson Pkwy, Suite 300, Plano, TX 75024',
            country: 'USA',
            phone: '+1 (469) 555-0188',
          },
          {
            city: 'Hyderabad',
            address: 'HITEC City, Phase 2, Madhapur, Hyderabad, TS 500081',
            country: 'India',
            phone: '+91 (40) 5550-1922',
          },
        ],
      },
    },
    {
      key: 'stats',
      value: {
        placements_count: '2,400+',
        avg_days_to_offer: '21 Days',
        partner_companies: '180+',
        interview_rate: '88%',
        satisfaction_score: '4.9/5',
        is_sample: true,
      },
    },
    {
      key: 'socials',
      value: {
        linkedin: 'https://linkedin.com/company/codex-tech-it',
        twitter: 'https://twitter.com/codextechit',
        github: 'https://github.com/codextechit',
        youtube: 'https://youtube.com/@codextechit',
      },
    },
  ];

  for (const s of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }

  // 3. Courses (10 Courses)
  const coursesData = [
    {
      slug: 'java-full-stack',
      title: 'Java Full Stack Engineering',
      summary: 'Master enterprise backend architectures with Spring Boot, Microservices, React frontend, and cloud-native deployments.',
      duration: '12 Weeks',
      mode: 'Live Instructor-led + Labs',
      level: 'Intermediate to Advanced',
      curriculum: [
        { title: 'Core Java & Modern Concurrency', topics: ['OOP mastery', 'Collections deep dive', 'Multithreading & JVM memory model', 'Java 17/21 features'] },
        { title: 'Spring Boot & Microservices', topics: ['Spring Data JPA', 'RESTful API contracts', 'Spring Security with JWT', 'Kafka event streaming'] },
        { title: 'Modern Frontend with React & TypeScript', topics: ['React hooks & state management', 'Component lifecycles', 'Tailwind styling', 'API integration'] },
        { title: 'Docker, CI/CD & AWS Deployment', topics: ['Docker containers', 'GitHub Actions pipeline', 'AWS ECS & RDS', 'Production monitoring'] },
      ],
      tools: ['Java 21', 'Spring Boot', 'React', 'PostgreSQL', 'Docker', 'AWS', 'Kafka', 'Git'],
      outcomes: ['Build enterprise microservices', 'Pass top-tier system design rounds', 'Deploy live distributed web applications'],
      faqs: [
        { q: 'Who is this Java course suitable for?', a: 'Developers with basic programming knowledge wanting enterprise backend readiness.' },
        { q: 'Are hands-on capstones included?', a: 'Yes, you will build 2 end-to-end production microservice projects from scratch.' },
      ],
    },
    {
      slug: 'python-development',
      title: 'Python Backend & API Engineering',
      summary: 'Build high-throughput async APIs, database abstractions, and background workers using FastAPI, Django, and Celery.',
      duration: '10 Weeks',
      mode: 'Live Instructor-led',
      level: 'Beginner to Intermediate',
      curriculum: [
        { title: 'Pythonic Fundamentals & AsyncIO', topics: ['Generators & decorators', 'Type hints', 'AsyncIO concurrency', 'Pytest automation'] },
        { title: 'FastAPI & REST Architecture', topics: ['Pydantic validation', 'Dependency injection', 'Database sessions with SQLAlchemy', 'JWT auth'] },
        { title: 'Background Processing & Redis', topics: ['Celery task queues', 'Redis caching', 'WebSockets', 'Rate limiting'] },
      ],
      tools: ['Python 3.12', 'FastAPI', 'PostgreSQL', 'Redis', 'Celery', 'Docker', 'Pytest'],
      outcomes: ['Develop scalable backend microservices', 'Write robust automated test suites', 'Design async API architectures'],
      faqs: [{ q: 'Is prior coding required?', a: 'Basic familiarity with variables and logic is sufficient.' }],
    },
    {
      slug: 'data-science-ai',
      title: 'Data Science & Applied Generative AI',
      summary: 'Transform raw data into predictive machine learning models and modern LLM-powered enterprise solutions.',
      duration: '14 Weeks',
      mode: 'Live Instructor-led',
      level: 'Intermediate',
      curriculum: [
        { title: 'Data Wrangling & Statistical Foundations', topics: ['Pandas & NumPy', 'Hypothesis testing', 'Exploratory data analysis', 'Feature engineering'] },
        { title: 'Machine Learning Pipelines', topics: ['Scikit-learn', 'Regression & classification', 'Ensemble methods (XGBoost)', 'Model evaluation'] },
        { title: 'Deep Learning & LLM Integration', topics: ['PyTorch fundamentals', 'HuggingFace Transformers', 'LangChain & RAG architectures', 'Vector databases'] },
      ],
      tools: ['Python', 'Pandas', 'Scikit-learn', 'PyTorch', 'LangChain', 'ChromaDB', 'Jupyter'],
      outcomes: ['Deploy predictive models', 'Build context-aware RAG pipelines', 'Analyze complex multidimensional datasets'],
      faqs: [{ q: 'Does this cover Generative AI?', a: 'Yes, modern LLM prompting, embeddings, and RAG architectures are fully covered.' }],
    },
    {
      slug: 'data-engineering',
      title: 'Modern Cloud Data Engineering',
      summary: 'Architect scalable data lakes, streaming pipelines, and warehouse transformations with Spark, Snowflake, and Airflow.',
      duration: '12 Weeks',
      mode: 'Live Labs',
      level: 'Intermediate to Advanced',
      curriculum: [
        { title: 'Distributed Processing with Apache Spark', topics: ['PySpark DataFrames', 'Spark SQL', 'Partition tuning & joins', 'Lakehouse formats'] },
        { title: 'Cloud Warehouses & Orchestration', topics: ['Snowflake architecture', 'Apache Airflow DAG authoring', 'dbt transformations', 'Data testing'] },
        { title: 'Streaming Data & Ingestion', topics: ['Kafka producer/consumer', 'Spark Streaming', 'Schema registry', 'CDC ingestion'] },
      ],
      tools: ['PySpark', 'Snowflake', 'Apache Airflow', 'dbt', 'Kafka', 'AWS S3', 'PostgreSQL'],
      outcomes: ['Build robust ETL/ELT pipelines', 'Orchestrate enterprise data workflows', 'Optimize cloud compute costs'],
      faqs: [{ q: 'Is SQL required?', a: 'Intermediate SQL proficiency is highly recommended.' }],
    },
    {
      slug: 'cloud-aws-azure',
      title: 'Multi-Cloud Architecture (AWS & Azure)',
      summary: 'Design resilient, scalable, and secure cloud infrastructures across Amazon Web Services and Microsoft Azure.',
      duration: '10 Weeks',
      mode: 'Live Instructor-led',
      level: 'All Levels',
      curriculum: [
        { title: 'AWS Cloud Foundations & Compute', topics: ['VPC networking', 'EC2, ECS, Lambda', 'IAM security policies', 'S3 & RDS'] },
        { title: 'Azure Enterprise Infrastructure', topics: ['Azure Virtual Networks', 'App Services & AKS', 'Microsoft Entra ID', 'Cost optimization'] },
        { title: 'Infrastructure as Code & Security', topics: ['Terraform multi-cloud provisioning', 'CloudWatch & Azure Monitor', 'Disaster recovery'] },
      ],
      tools: ['AWS', 'Azure', 'Terraform', 'Docker', 'Linux', 'Bash', 'CloudFormation'],
      outcomes: ['Architect high-availability cloud systems', 'Earn AWS/Azure Solutions Architect certifications', 'Automate infra with Terraform'],
      faqs: [{ q: 'Does this prepare for certification?', a: 'Yes, covers AWS Solutions Architect Associate and Azure AZ-104/AZ-305.' }],
    },
    {
      slug: 'devops',
      title: 'DevOps & Site Reliability Engineering (SRE)',
      summary: 'Automate deployment lifecycles, manage Kubernetes clusters, and build robust GitOps CI/CD pipelines.',
      duration: '12 Weeks',
      mode: 'Live Hands-on Labs',
      level: 'Intermediate',
      curriculum: [
        { title: 'Linux & Scripting Mastery', topics: ['Advanced Bash', 'Linux internals', 'Networking fundamentals', 'Git branching strategies'] },
        { title: 'Containers & Kubernetes Cluster Management', topics: ['Docker multi-stage builds', 'Kubernetes pods, services, ingress', 'Helm charts', 'ArgoCD GitOps'] },
        { title: 'CI/CD Pipelines & Observability', topics: ['GitHub Actions & Jenkins', 'Prometheus & Grafana metrics', 'ELK stack logging', 'Chaos testing'] },
      ],
      tools: ['Kubernetes', 'Docker', 'Terraform', 'Helm', 'ArgoCD', 'Prometheus', 'Grafana', 'GitHub Actions'],
      outcomes: ['Manage production Kubernetes environments', 'Build bulletproof deployment pipelines', 'Implement full-stack observability'],
      faqs: [{ q: 'Will I practice on real clusters?', a: 'Yes, each student provisions real cloud Kubernetes clusters.' }],
    },
    {
      slug: 'qa-automation',
      title: 'Full Stack QA Automation Engineering',
      summary: 'Master UI, API, and performance test automation using Playwright, Cypress, Selenium, and Postman.',
      duration: '8 Weeks',
      mode: 'Live Interactive',
      level: 'Beginner to Intermediate',
      curriculum: [
        { title: 'Automation Foundations & Test Design', topics: ['Test planning & strategies', 'Locators and DOM interactions', 'Page Object Model (POM)', 'Assertions'] },
        { title: 'Modern UI Automation with Playwright & TypeScript', topics: ['Playwright test runner', 'Parallel execution', 'Visual regression', 'Network intercepting'] },
        { title: 'API Testing & CI/CD Integration', topics: ['Postman & REST-Assured', 'GraphQL testing', 'GitHub Actions automated test runs', 'Reporting dashboards'] },
      ],
      tools: ['Playwright', 'TypeScript', 'Selenium', 'Postman', 'Cypress', 'Git', 'Allure Reports'],
      outcomes: ['Build enterprise test automation frameworks', 'Automate complex end-to-end user journeys', 'Integrate tests into CI/CD build gates'],
      faqs: [{ q: 'Can non-programmers join?', a: 'Yes, we start with core TypeScript programming basics for test automation.' }],
    },
    {
      slug: 'cybersecurity',
      title: 'Cybersecurity Defense & Cloud Security',
      summary: 'Learn threat modeling, network penetration testing, vulnerability assessment, and cloud security compliance.',
      duration: '12 Weeks',
      mode: 'Hands-on Cyber Lab',
      level: 'Intermediate',
      curriculum: [
        { title: 'Network Security & Protocol Analysis', topics: ['TCP/IP deep dive', 'Wireshark packet analysis', 'Firewalls & IDS/IPS', 'Zero Trust Architecture'] },
        { title: 'SOC Operations & Threat Hunting', topics: ['SIEM tooling (Splunk)', 'MITRE ATT&CK framework', 'Incident response runbooks', 'Vulnerability scanning'] },
        { title: 'Cloud & Application Security', topics: ['OWASP Top 10 mitigation', 'AWS IAM hardening', 'Container security', 'SOC 2 & ISO 27001 compliance'] },
      ],
      tools: ['Wireshark', 'Splunk', 'Nessus', 'Kali Linux', 'Burp Suite', 'AWS GuardDuty', 'Metasploit'],
      outcomes: ['Identify security threats & vulnerabilities', 'Analyze logs in enterprise SIEM platforms', 'Harden cloud infrastructures against breach'],
      faqs: [{ q: 'Are practical simulations included?', a: 'Yes, students conduct simulated red-team attacks and blue-team defense.' }],
    },
    {
      slug: 'salesforce',
      title: 'Salesforce Admin & Apex Developer',
      summary: 'Configure Salesforce clouds, automate business logic with Flows, and develop custom Apex & LWC components.',
      duration: '10 Weeks',
      mode: 'Live Instructor-led',
      level: 'All Levels',
      curriculum: [
        { title: 'Salesforce Administration & Data Modeling', topics: ['Standard & custom objects', 'Security, profiles & sharing rules', 'Validation rules & Lightning App Builder'] },
        { title: 'Process Automation with Lightning Flows', topics: ['Record-triggered flows', 'Screen flows', 'Subflows & error handling', 'Best practices'] },
        { title: 'Apex Programming & Lightning Web Components (LWC)', topics: ['Apex triggers & handlers', 'SOQL/SOSL queries', 'LWC JavaScript & HTML', 'Unit testing'] },
      ],
      tools: ['Salesforce Lightning', 'Apex', 'SOQL', 'LWC', 'VS Code', 'Salesforce CLI'],
      outcomes: ['Pass Salesforce Administrator & Platform Developer I exams', 'Automate enterprise business workflows', 'Build custom Lightning Web Components'],
      faqs: [{ q: 'Is Salesforce certification included?', a: 'We provide structured preparation and practice voucher support.' }],
    },
    {
      slug: 'sap',
      title: 'SAP S/4HANA Functional & Technical Integration',
      summary: 'Understand modern enterprise ERP processes across SAP S/4HANA Finance, FICO, MM, and ABAP extension development.',
      duration: '12 Weeks',
      mode: 'Live Sandbox Access',
      level: 'Intermediate',
      curriculum: [
        { title: 'SAP S/4HANA Fundamentals & Navigation', topics: ['Enterprise structure overview', 'Master data management', 'Fiori UX navigation'] },
        { title: 'Core Functional Modules (FICO / MM)', topics: ['General Ledger & Accounts Payable', 'Procure-to-Pay workflow', 'Material management', 'Pricing procedures'] },
        { title: 'ABAP on HANA & Modern Integration', topics: ['Core Data Services (CDS) views', 'OData services', 'BAPI & IDoc communication', 'SAP BTP extensions'] },
      ],
      tools: ['SAP S/4HANA', 'SAP Fiori', 'ABAP', 'SAP GUI', 'SAP BTP', 'CDS Views'],
      outcomes: ['Execute end-to-end ERP business transactions', 'Configure SAP organizational elements', 'Interface SAP with modern external cloud apps'],
      faqs: [{ q: 'Do students get SAP system access?', a: 'Yes, active 24/7 access to SAP S/4HANA sandbox is provided for practical work.' }],
    },
  ];

  for (const c of coursesData) {
    await prisma.course.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }

  // 4. Job Openings (6 Openings)
  const jobsData = [
    {
      slug: 'senior-technical-recruiter',
      title: 'Senior Technical Recruiter (IT Staffing)',
      department: 'Talent Acquisition',
      location: 'Plano, TX (Hybrid) / Remote',
      type: 'Full-time',
      description: 'Codex Tech-IT is seeking an energetic Senior Technical Recruiter to identify, evaluate, and place top-tier software engineers, data architects, and cloud specialists with our enterprise clients.',
      requirements: '3+ years experience in US IT staffing; proven track record in placing Java, Cloud, and Data roles; deep knowledge of W2, C2C, and 1099 contracts; exceptional candidate relationship management.',
      is_active: true,
    },
    {
      slug: 'talent-sourcer-it',
      title: 'Technical Talent Sourcer',
      department: 'Recruiting',
      location: 'Hyderabad, India / Remote',
      type: 'Full-time',
      description: 'Join our proactive sourcing engine to unearth high-caliber technical talent across LinkedIn Recruiter, GitHub, StackOverflow, and specialized developer communities.',
      requirements: '1-3 years IT sourcing experience; expertise with Boolean search strings and developer communities; sharp eye for technical resume keywords and project indicators.',
      is_active: true,
    },
    {
      slug: 'full-stack-developer-trainer',
      title: 'Full Stack Java / Cloud Trainer',
      department: 'IT Training',
      location: 'Remote',
      type: 'Contract / Part-time',
      description: 'Lead immersive hands-on training batches for aspiring and transitioning software engineers in Java microservices, React, and cloud deployments.',
      requirements: '5+ years software engineering experience; strong passion for mentoring; ability to deliver clear, live coding walkthroughs and architecture feedback.',
      is_active: true,
    },
    {
      slug: 'frontend-react-developer',
      title: 'Senior Frontend Developer (React / Next.js)',
      department: 'Internal Product Engineering',
      location: 'Plano, TX / Remote',
      type: 'Full-time',
      description: 'Help engineer the next generation of Codex Tech-IT digital hiring tools, candidate portals, and interactive assessment platforms.',
      requirements: '4+ years modern React + TypeScript; experience with state management, animations (Framer Motion / GSAP), and web performance optimization.',
      is_active: true,
    },
    {
      slug: 'it-account-manager',
      title: 'IT Client Account Manager',
      department: 'Business Development',
      location: 'Plano, TX',
      type: 'Full-time',
      description: 'Manage and expand enterprise client relationships, collaborating directly with corporate VP of Engineering and HR leaders to understand technical hiring roadmaps.',
      requirements: '3+ years B2B staffing account management; excellent client presentation and SLA management skills; strong negotiation acumen.',
      is_active: true,
    },
    {
      slug: 'tech-content-growth-marketer',
      title: 'Technical Content & Growth Marketer',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      description: 'Craft high-converting case studies, career guidance articles, hiring whitepapers, and manage our webinar and social channels.',
      requirements: '2+ years content marketing experience in tech, SaaS, or recruitment; strong analytical mindset; proven SEO and storytelling skills.',
      is_active: true,
    },
  ];

  for (const j of jobsData) {
    await prisma.jobOpening.upsert({
      where: { slug: j.slug },
      update: j,
      create: j,
    });
  }

  // 5. Success Stories (8 Case Studies)
  const storiesData = [
    {
      slug: 'alex-chen-cloud-migration',
      name: 'Alex Chen',
      role: 'Lead Cloud Architect',
      company_type: 'FinTech Enterprise',
      location: 'Dallas, TX',
      situation: 'Alex was stuck in a legacy on-premises sysadmin position for 5 years with minimal cloud exposure, struggling to secure modern DevOps or Cloud architect interviews despite holding multiple certificates.',
      approach: 'Codex Tech-IT redesigned Alex’s resume to emphasize infrastructure automation, guided him through a targeted 4-week Terraform and AWS architecture capstone, and pitched his profile directly to our Tier-1 FinTech hiring partners.',
      results: 'Secured 4 first-round technical interviews within 14 days, received 2 competing offers, and accepted a Lead Cloud Architect role with a 45% compensation uplift.',
      is_sample: true,
      is_published: true,
    },
    {
      slug: 'priya-sharma-f1-opt-fintech',
      name: 'Priya Sharma',
      role: 'Full Stack Java Engineer',
      company_type: 'Global Payments Provider',
      location: 'Charlotte, NC',
      situation: 'Priya had completed her Master’s in Computer Science on an F1-OPT visa but faced high rejection rates due to lack of practical enterprise microservices experience and sponsorship uncertainty.',
      approach: 'Our career strategists enrolled Priya in our Java Full Stack program, polished her GitHub portfolio with production-grade Kafka event systems, and represented her to e-verified employers offering H1B sponsorship.',
      results: 'Placed in 19 days as a Full Stack Engineer at a top payment gateway company with seamless STEM OPT extension support.',
      is_sample: true,
      is_published: true,
    },
    {
      slug: 'marcus-johnson-bootcamp-to-faang',
      name: 'Marcus Johnson',
      role: 'Frontend Systems Engineer',
      company_type: 'High-Growth SaaS',
      location: 'Austin, TX',
      situation: 'After graduating from a coding bootcamp, Marcus sent over 250 blind applications with zero callbacks, feeling demoralized by automated ATS rejection algorithms.',
      approach: 'Codex Tech-IT ran Marcus’s profile through our ATS analyzer, repositioned his projects around measurable business outcomes, and provided 6 rounds of intensive behavioral and live coding mock sessions.',
      results: 'Landed an offer within 25 days with an $88,000 starting base and equity package at an enterprise SaaS platform.',
      is_sample: true,
      is_published: true,
    },
    {
      slug: 'ananya-patel-data-engineer-switch',
      name: 'Ananya Patel',
      role: 'Senior Data Engineer',
      company_type: 'Healthcare Analytics',
      location: 'Atlanta, GA',
      situation: 'Ananya worked as a traditional SQL database administrator and wanted to pivot into modern Cloud Data Engineering with Snowflake and PySpark, but recruiters kept pigeonholing her into DBA tasks.',
      approach: 'We executed a targeted custom job campaign highlighting her ETL pipeline work, supported by hands-on Spark and Airflow capstone validation.',
      results: 'Accepted a Senior Data Engineer role at a healthcare analytics firm in 23 days, earning a 38% salary increase.',
      is_sample: true,
      is_published: true,
    },
    {
      slug: 'david-kim-veteran-cybersecurity',
      name: 'David Kim',
      role: 'Security Operations Analyst',
      company_type: 'Defense & Cloud Infrastructure',
      location: 'Washington, DC',
      situation: 'Transitioning from military communications to corporate cybersecurity, David struggled to translate military IT commendations into civilian corporate terminology.',
      approach: 'Our rebranding team translated his defense protocols into NIST/CIS frameworks and mapped his clearance to government contractor vacancies.',
      results: 'Placed within 18 days with a premier defense technology integrator.',
      is_sample: true,
      is_published: true,
    },
    {
      slug: 'rahul-verma-qa-to-devops',
      name: 'Rahul Verma',
      role: 'Site Reliability Engineer',
      company_type: 'E-commerce Platform',
      location: 'Chicago, IL',
      situation: 'Rahul had spent 4 years in manual QA testing and felt his career was stagnating as manual test roles decreased across the industry.',
      approach: 'We guided him through Playwright automation and containerized CI/CD pipelines, transitioning his credentials to DevOps/SRE capabilities.',
      results: 'Received an offer in 28 days as an SRE at a top retail commerce provider.',
      is_sample: true,
      is_published: true,
    },
    {
      slug: 'sarah-jenkins-enterprise-salesforce',
      name: 'Sarah Jenkins',
      role: 'Lead Salesforce Developer',
      company_type: 'Insurance Carrier',
      location: 'Columbus, OH',
      situation: 'Sarah was an accidental Salesforce admin looking to validate her Apex coding capabilities to step up to an enterprise developer compensation tier.',
      approach: 'Targeted resume restructuring, Lightning Web Component portfolio creation, and custom employer outreach.',
      results: 'Secured an offer with a 50% pay raise within 3 weeks.',
      is_sample: true,
      is_published: true,
    },
    {
      slug: 'vikram-malhotra-senior-architect',
      name: 'Vikram Malhotra',
      role: 'Principal Solutions Architect',
      company_type: 'Supply Chain Logistics',
      location: 'New York, NY',
      situation: 'Seeking a high-level executive tech role, Vikram needed discreet, bespoke placement rather than public job-board applications.',
      approach: 'Confidential executive matching directly with client C-suite executives and board-level talent committees.',
      results: 'Placed in 32 days leading enterprise cloud architecture.',
      is_sample: true,
      is_published: true,
    },
  ];

  for (const s of storiesData) {
    await prisma.successStory.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }

  // 6. Live Placements (12 records)
  const placementsData = [
    { role: 'Cloud DevOps Engineer', company_type: 'FinTech', location: 'Austin, TX', package_range: '$135k - $155k', summary: 'AWS & Kubernetes cluster automation' },
    { role: 'Senior Java Microservices Dev', company_type: 'Healthcare', location: 'Plano, TX', package_range: '$125k - $145k', summary: 'Spring Boot & Kafka event streaming' },
    { role: 'Data Engineer', company_type: 'E-Commerce', location: 'Seattle, WA', package_range: '$130k - $150k', summary: 'PySpark & Snowflake data warehouse' },
    { role: 'Full Stack React / Node Engineer', company_type: 'SaaS', location: 'Remote', package_range: '$115k - $135k', summary: 'High-concurrency web dashboard' },
    { role: 'Cybersecurity SOC Analyst', company_type: 'Banking', location: 'Charlotte, NC', package_range: '$105k - $125k', summary: 'SIEM monitoring & incident mitigation' },
    { role: 'QA Automation Lead', company_type: 'Logistics', location: 'Chicago, IL', package_range: '$110k - $130k', summary: 'Playwright & CI/CD pipeline tests' },
    { role: 'Salesforce Developer', company_type: 'Insurance', location: 'Columbus, OH', package_range: '$120k - $140k', summary: 'LWC & Apex custom integrations' },
    { role: 'Machine Learning Engineer', company_type: 'AI Startup', location: 'San Francisco, CA', package_range: '$150k - $175k', summary: 'LLM fine-tuning & RAG pipeline' },
    { role: 'SAP S/4HANA Consultant', company_type: 'Manufacturing', location: 'Atlanta, GA', package_range: '$130k - $150k', summary: 'Supply chain module integration' },
    { role: 'Senior Python Backend Developer', company_type: 'Media', location: 'New York, NY', package_range: '$140k - $160k', summary: 'FastAPI microservices & Redis' },
    { role: 'Solutions Architect', company_type: 'Enterprise IT', location: 'Dallas, TX', package_range: '$165k - $190k', summary: 'Multi-cloud hybrid transformation' },
    { role: 'Junior Software Engineer', company_type: 'HealthTech', location: 'Remote', package_range: '$85k - $95k', summary: 'React & TypeScript frontend' },
  ];

  for (const p of placementsData) {
    const existing = await prisma.livePlacement.findFirst({
      where: { role: p.role, location: p.location },
    });
    if (!existing) {
      await prisma.livePlacement.create({
        data: { ...p, is_sample: true, is_published: true },
      });
    }
  }

  // 7. Blog Posts / Insights (8 Articles)
  const postsData = [
    {
      slug: 'how-to-choose-a-talent-acquisition-partner',
      title: 'How to Choose the Right IT Talent Acquisition Partner for Your Company',
      category: 'Hiring Strategy',
      excerpt: 'Avoid costly staffing mismatches. Learn the 7 critical criteria enterprise leaders use to vet technical staffing agencies.',
      read_minutes: 6,
      author_name: 'Marcus Vance',
      author_role: 'Head of Enterprise Staffing',
      cover_alt: 'IT talent acquisition strategy discussion',
      content: `### Why Technical Staffing Fails More Often Than It Should
Hiring managers routinely express frustration with standard staffing agencies. The root issue is simple: generalist recruiters lack the technical domain competence to discern genuine engineering depth from buzzword-stuffed resumes.

When you evaluate a staffing partner, look for these foundational markers:

#### 1. Rigorous Technical Pre-Screening
Does the partner have in-house engineers conduct technical assessments prior to submission? At Codex Tech-IT, every candidate undergoes live coding evaluations and system design reviews before reaching your hiring desk.

#### 2. Transparent SLA Metrics
A top partner commits to measurable timelines: first curated shortlist within 48 to 72 hours, interview-to-offer ratios above 70%, and direct 90-day retention guarantees.

#### 3. Deep Knowledge of Compliance & Visa Categories
In technical hiring, understanding STEM-OPT, H-1B transfers, and contract-to-hire W-2 compliance is essential to prevent operational disruptions.`,
    },
    {
      slug: 'ats-proof-resume-12-fixes',
      title: 'ATS-Proof Resume: 12 High-Impact Fixes to Beat the Screeners',
      category: 'Career Advice',
      excerpt: 'Over 75% of resumes are discarded by Applicant Tracking Systems before a human recruiter sees them. Here is how to fix yours.',
      read_minutes: 7,
      author_name: 'Elena Rostova',
      author_role: 'Career Strategy Director',
      cover_alt: 'Resume optimization with ATS scoring checks',
      content: `### The Reality of Modern ATS Algorithms
Applicant Tracking Systems (such as Workday, Greenhouse, Taleo, and Lever) parse incoming resumes into structured database fields. If your document formatting confuses the parser, you receive an automated rejection.

#### The 12 Non-Negotiable Fixes:
1. **Ditch Multi-Column Layouts**: Dual columns often cause text to merge across columns during parsing.
2. **Use Standard Section Headers**: Stick to 'Experience', 'Education', 'Technical Skills', and 'Projects'.
3. **Embed Role-Specific Keywords**: Match keywords directly from the target job specification.
4. **Quantify Every Major Bullet**: Use percentages, latency improvements, and revenue metrics.
5. **Eliminate Graphics and Charts**: Parsers cannot interpret text embedded in images.
6. **Provide Exact Date Ranges**: Always use Month Year (e.g., 'Jan 2022 - Present').
7. **Ensure Contact Info is Text**: Do not put phone numbers or emails in headers or footers.
8. **Adopt Clean Typography**: Use standard fonts like Inter, Arial, or Calibri.
9. **Highlight Technical Stack per Project**: Explicitly state the languages and tools utilized.
10. **Include Clickable LinkedIn and GitHub Links**: Ensure profile URLs are sanitized.
11. **Avoid Keyword Stuffing in White Text**: Modern parsers flag invisible text as spam.
12. **Save as Clean PDF or Plain DOCX**: Avoid exotic file formats.`,
    },
    {
      slug: 'contract-vs-direct-hire-career-strategy',
      title: 'Contract vs. Direct Hire: Which IT Employment Model Accelerates Your Career?',
      category: 'Career Advice',
      excerpt: 'Compare hourly contract rates, benefits, learning velocity, and long-term stability to make the smartest career choice.',
      read_minutes: 5,
      author_name: 'Elena Rostova',
      author_role: 'Career Strategy Director',
      cover_alt: 'Contract vs Direct Hire comparison illustration',
      content: `### Understanding the Trade-Offs in Technical Employment
Both contracting and full-time direct hire offer distinct advantages depending on your career stage and financial goals.

#### The Power of IT Contracting (W2 / C2C)
- **Higher Take-Home Compensation**: Contract hourly rates often yield 20% to 40% higher gross income.
- **Rapid Technology Exposure**: Switching engagements every 12 to 18 months rapidly expands your technology portfolio.
- **Faster Hiring Cycles**: Contract decisions are frequently made within 1 to 2 interview rounds.

#### The Stability of Direct Hire
- **Comprehensive Benefits Packages**: Employer-sponsored healthcare, 401(k) matching, and PTO.
- **Long-Term Equity & Upside**: Stock options, annual bonuses, and promotion pathways.
- **Deep Domain Ownership**: Opportunity to guide architectural direction over several years.`,
    },
    {
      slug: 'ace-the-behavioral-interview-star-technique',
      title: 'Ace the Behavioral Interview: Mastering the STAR Technique for Engineers',
      category: 'Interview Prep',
      excerpt: 'Technical excellence only gets you through the first door. Here is how top engineers win hiring managers over in behavioral rounds.',
      read_minutes: 6,
      author_name: 'David Keller',
      author_role: 'Lead Interview Coach',
      cover_alt: 'STAR method interview preparation flowchart',
      content: `### Why Behavioral Interviews Eliminate Strong Coders
Hiring managers often decide whether to extend an offer based on culture fit, communication clarity, and conflict resolution during behavioral interviews.

#### The STAR Framework Breakdown
- **Situation**: Briefly set the context (2-3 sentences).
- **Task**: Describe the specific challenge or goal you owned.
- **Action**: Explain the concrete technical decisions and leadership steps you initiated. Focus on 'I', not just 'we'.
- **Result**: Conclude with measurable, quantifiable outcomes.

#### Sample Prompt: 'Tell me about a time a production release went wrong.'
Demonstrate accountability, root-cause diagnosis, cross-functional communication, and the preventive automation you put in place to ensure the incident never recurred.`,
    },
    {
      slug: 'career-switch-into-it-a-90-day-plan',
      title: 'Career Switch into IT: A Realistic 90-Day Roadmap for Non-Tech Professionals',
      category: 'Training',
      excerpt: 'Tired of generic advice? Here is a step-by-step 90-day execution framework to transition into high-paying IT roles.',
      read_minutes: 8,
      author_name: 'Marcus Vance',
      author_role: 'Head of Enterprise Staffing',
      cover_alt: '90 day career roadmap calendar',
      content: `### Transitioning Without Starting from Zero
Transferable skills in problem solving, project management, and business logic are immense assets when combined with targeted technical skills.

#### Month 1: Fundamentals & Specialization Selection
Select one high-demand track: Full Stack Java, Cloud DevOps, or QA Automation. Build foundational programming literacy and master version control with Git.

#### Month 2: Capstone Projects & Practical Labs
Theory alone does not get interviews. Build two real-world full-stack or cloud deployment projects that demonstrate live functionality.

#### Month 3: Strategic Positioning & Direct Campaigning
Polish your resume with our ATS optimization framework, conduct timed mock interviews, and leverage Codex Tech-IT direct placement channels.`,
    },
    {
      slug: 'what-is-talent-acquisition-outsourcing',
      title: 'What is Talent Acquisition Outsourcing (RPO) and Why Are Tech Teams Adopting It?',
      category: 'Employer Insights',
      excerpt: 'Discover how Recruitment Process Outsourcing reduces cost-per-hire and eliminates hiring bottlenecks for expanding engineering teams.',
      read_minutes: 5,
      author_name: 'Marcus Vance',
      author_role: 'Head of Enterprise Staffing',
      cover_alt: 'Talent acquisition outsourcing diagram',
      content: `### Scaling Engineering Capacity on Demand
Building an internal recruiting team is slow and expensive. Talent Acquisition Outsourcing (RPO) allows companies to embed dedicated technical recruiting pods into their hiring infrastructure.

#### Key Benefits of Technical RPO:
- **Cost Efficiency**: Reduces reliance on contingent agency fees by up to 50%.
- **Shorter Time to Fill**: Pre-existing talent pipelines decrease time-to-hire from 60 days to under 21 days.
- **Consistent Employer Branding**: Candidates receive a coherent, high-touch interview experience.`,
    },
    {
      slug: 'bookkeeping-vs-accounting-tech-firms',
      title: 'Payroll, Taxes & Compliance: Crucial Differences for IT Staffing Contractors',
      category: 'Payroll & Compliance',
      excerpt: 'Navigate W2 vs 1099 compliance, state tax withholdings, and employee classification rules without legal or financial headaches.',
      read_minutes: 6,
      author_name: 'David Keller',
      author_role: 'Operations & Compliance Lead',
      cover_alt: 'Payroll compliance and tax checklist',
      content: `### Staying Compliant in Multi-State IT Staffing
With distributed engineering teams across the United States, managing tax registrations and state payroll withholding is critical.

#### Common Compliance Pitfalls:
- **Misclassification**: Treating workers as 1099 contractors when their hours and tools meet W-2 common law rules.
- **Multi-State Withholding**: Failing to establish tax accounts in the candidate’s home state.
- **I-9 & E-Verify Deadlines**: Strictly adhering to mandatory federal employment eligibility verification windows.`,
    },
    {
      slug: 'what-background-checks-verify-it-staffing',
      title: 'What Do Enterprise IT Background Checks Really Verify?',
      category: 'Employer Insights',
      excerpt: 'From educational credentials and criminal records to client security clearances, here is what goes into thorough candidate vetting.',
      read_minutes: 5,
      author_name: 'David Keller',
      author_role: 'Operations & Compliance Lead',
      cover_alt: 'Background verification checklist and security badge',
      content: `### Trust and Verification in Enterprise Technology
Financial institutions, healthcare providers, and defense contractors require exhaustive verification before granting network access.

#### Core Verification Elements:
1. **Identity & SSN Trace**: Confirming legal identity and address history.
2. **Employment History Verification**: Confirming titles, dates, and re-hire eligibility with previous employers.
3. **Education Verification**: Confirming degrees directly with university registrars.
4. **Criminal Background & Drug Screenings**: Multi-jurisdictional 7-year records checks.`,
    },
  ];

  for (const p of postsData) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  // 8. FAQs (26 questions across 6 categories)
  const faqsData = [
    // Job Seekers
    { category: 'Job Seekers', question: 'How quickly can Codex Tech-IT help me secure interviews?', answer: 'Most actively prepared candidates receive their first curated interview invitation within 10 to 21 business days after completing our profile positioning review.', sort_order: 1 },
    { category: 'Job Seekers', question: 'Do you only place senior engineers, or can juniors and career switchers apply?', answer: 'We support candidates across all experience levels, from fresh computer science graduates and career switchers to senior enterprise architects.', sort_order: 2 },
    { category: 'Job Seekers', question: 'What makes Codex Tech-IT different from mass-applying on job boards?', answer: 'We do not blast your resume blindly. We tailor your positioning, conduct technical mock interviews, and present your profile directly to vetted hiring managers with active openings.', sort_order: 3 },
    { category: 'Job Seekers', question: 'Is my current employment kept confidential during the process?', answer: 'Absolutely. We never share your resume or contact details without your explicit prior authorization.', sort_order: 4 },
    // Employers
    { category: 'Employers', question: 'What hiring models do you offer for employers?', answer: 'We offer contract staffing, contract-to-hire, direct hire placement, and dedicated talent acquisition pods (RPO).', sort_order: 5 },
    { category: 'Employers', question: 'How do you screen candidates before submitting them to our team?', answer: 'Every candidate undergoes identity verification, a 45-minute technical skills assessment, and a communication evaluation before their profile is submitted.', sort_order: 6 },
    { category: 'Employers', question: 'What is your typical turnaround time for candidate shortlists?', answer: 'We deliver a curated shortlist of 2-4 pre-screened technical candidates within 48 to 72 hours of receiving your requisition.', sort_order: 7 },
    { category: 'Employers', question: 'Do you provide replacement guarantees on direct hire placements?', answer: 'Yes, we provide standard 90-day replacement guarantees on all direct hire placements.', sort_order: 8 },
    // Training
    { category: 'Training', question: 'Are the IT training courses self-paced or live instructor-led?', answer: 'All core programs are conducted live online with industry practitioners, featuring hands-on lab sessions and code reviews.', sort_order: 9 },
    { category: 'Training', question: 'What happens if I miss a live training session?', answer: 'All live lectures are recorded in high definition and accessible within 2 hours alongside class notes and code repositories.', sort_order: 10 },
    { category: 'Training', question: 'Do courses include real-world capstone projects?', answer: 'Yes, every course culminates in 2 enterprise-grade capstones designed to showcase directly on your GitHub and resume.', sort_order: 11 },
    { category: 'Training', question: 'Will I receive a course completion certificate?', answer: 'Yes, students who complete all modules and pass the capstone defense receive a verified Codex Tech-IT graduation credential.', sort_order: 12 },
    // Fees & Payments
    { category: 'Fees & Payments', question: 'Do job seekers pay upfront fees for placement assistance?', answer: 'Standard recruitment placement services are 100% employer-funded. We never charge job seekers for securing interviews with our partner companies.', sort_order: 13 },
    { category: 'Fees & Payments', question: 'How does pricing work for personalized career accelerator plans?', answer: 'Specialized programs like 1-on-1 executive rebranding or full IT training bootcamps have clear, flexible monthly installment plans.', sort_order: 14 },
    { category: 'Fees & Payments', question: 'Are payment plans available for training courses?', answer: 'Yes, we offer flexible 0% interest monthly installment options for all training tracks.', sort_order: 15 },
    { category: 'Fees & Payments', question: 'What is your refund policy on training programs?', answer: 'We offer a 100% money-back guarantee within the first 7 days of any training batch if you are not completely satisfied.', sort_order: 16 },
    // Visas & Eligibility
    { category: 'Visas & Eligibility', question: 'Do you support international students on F-1 OPT or STEM OPT?', answer: 'Yes, we work with numerous E-Verified employers who regularly sponsor STEM OPT extensions and H-1B lottery filings.', sort_order: 17 },
    { category: 'Visas & Eligibility', question: 'Can you assist with H-1B transfers or Green Card processing?', answer: 'We connect candidates with verified corporate sponsors who handle H-1B transfers, cap-exempt filings, and PERM Green Card processing.', sort_order: 18 },
    { category: 'Visas & Eligibility', question: 'Do you place candidates holding H-4 EAD or L-2 EAD work authorizations?', answer: 'Yes, candidates with valid open work authorizations are eligible for direct hire and contract placements immediately.', sort_order: 19 },
    { category: 'Visas & Eligibility', question: 'Do you verify work eligibility prior to submission?', answer: 'Yes, we confirm valid work authorization documentation during initial candidate intake to avoid client-side delays.', sort_order: 20 },
    // Data & Privacy
    { category: 'Data & Privacy', question: 'How is my personal and resume data stored and protected?', answer: 'All candidate data is encrypted in transit (TLS 1.3) and at rest (AES-256) in compliant secure cloud facilities.', sort_order: 21 },
    { category: 'Data & Privacy', question: 'Will you ever sell my contact information to third-party advertisers?', answer: 'Never. Your information is used exclusively to evaluate job opportunities and provide requested career services.', sort_order: 22 },
    { category: 'Data & Privacy', question: 'Can I request to delete my profile and resume from your database?', answer: 'Yes, you can request full data deletion at any time by contacting privacy@codextechit.com.', sort_order: 23 },
    { category: 'Data & Privacy', question: 'Are you compliant with GDPR and CCPA privacy standards?', answer: 'Yes, we strictly uphold candidate privacy rights and maintain standard data retention compliance protocols.', sort_order: 24 },
  ];

  for (const f of faqsData) {
    const existing = await prisma.faq.findFirst({
      where: { question: f.question },
    });
    if (!existing) {
      await prisma.faq.create({
        data: { ...f, is_published: true },
      });
    }
  }

  // 9. Testimonials (8 Testimonials)
  const testimonialsData = [
    { name: 'Michael R.', role: 'Senior AWS DevOps Engineer', quote: 'Codex Tech-IT did not just find me a job—they completely revamped how I present my architectural experience. I landed an offer with a $35k jump in 3 weeks.', is_sample: true },
    { name: 'Swetha K.', role: 'Full Stack Java Developer', quote: 'As an F1-OPT graduate, finding a genuine employer willing to sponsor was overwhelming. Codex connected me directly with an e-verified financial institution in under a month.', is_sample: true },
    { name: 'Jason Miller', role: 'VP of Engineering, CloudScale Systems', quote: 'Most staffing firms spam us with 50 irrelevant resumes. Codex sent us 3 pre-screened candidates, and we hired 2 of them within 10 days. Outstanding quality.', is_sample: true },
    { name: 'Anita Deshmukh', role: 'Data Engineer', quote: 'The PySpark and Snowflake training gave me the exact hands-on ammunition I needed for technical grilling rounds. Their interview coaching is gold.', is_sample: true },
    { name: 'Robert C.', role: 'SRE / Kubernetes Specialist', quote: 'The resume review tool gave me concrete fixes that immediately doubled my LinkedIn inbound recruiter messages. Highly recommended.', is_sample: true },
    { name: 'Tanya Gomez', role: 'QA Automation Engineer', quote: 'Switching from manual testing felt daunting. Codex taught me Playwright, helped me build a live portfolio, and backed me through every interview round.', is_sample: true },
  ];

  for (const t of testimonialsData) {
    const existing = await prisma.testimonial.findFirst({
      where: { name: t.name, role: t.role },
    });
    if (!existing) {
      await prisma.testimonial.create({
        data: { ...t, is_published: true },
      });
    }
  }

  // 10. Webinars (3 Webinars)
  const webinarsData = [
    {
      slug: 'cracking-the-system-design-interview-2026',
      title: 'Cracking the Modern System Design Interview: Microservices & Scale',
      description: 'Join veteran software architects as we break down distributed caching, message queues, and database partitioning patterns expected in Tier-1 technical interviews.',
      starts_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // in 7 days
      host: 'Vikram Malhotra, Principal Solutions Architect',
      join_url: 'https://zoom.us/j/codex-system-design-webinar',
      is_past: false,
    },
    {
      slug: 'us-it-job-market-trends-h1b-opt',
      title: 'US IT Job Market Strategy: Navigating Hiring Cycles, OPT, and H-1B',
      description: 'A comprehensive session on active IT hiring sectors, navigating visa transitions safely, and negotiating top-tier technical compensation.',
      starts_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // in 14 days
      host: 'Elena Rostova, Career Strategy Director',
      join_url: 'https://zoom.us/j/codex-career-strategy-webinar',
      is_past: false,
    },
    {
      slug: 'mastering-playwright-test-automation',
      title: 'Mastering Playwright Automation: From Zero to Enterprise Framework',
      description: 'An interactive coding masterclass building a resilient end-to-end testing pipeline with TypeScript, Playwright, and GitHub Actions.',
      starts_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // past
      host: 'Tanya Gomez, Lead QA Architect',
      join_url: 'https://zoom.us/rec/playwright-automation-recording',
      is_past: true,
    },
  ];

  for (const w of webinarsData) {
    await prisma.webinar.upsert({
      where: { slug: w.slug },
      update: w,
      create: w,
    });
  }

  // 11. Interview Questions Bank (Seed 30 diverse sample questions across tracks)
  const questionsData = [
    { role_track: 'Java Full Stack', level: 'Intermediate', question: 'How does the Spring Boot auto-configuration mechanism work behind the scenes?', answer: 'Spring Boot uses @EnableAutoConfiguration which scans the classpath for dependencies and conditions specified in META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports. Using @ConditionalOnClass, @ConditionalOnMissingBean, etc., it configures only necessary beans.' },
    { role_track: 'Java Full Stack', level: 'Advanced', question: 'Explain the difference between ConcurrentHashMap and Collections.synchronizedMap.', answer: 'ConcurrentHashMap provides concurrent access using bucket-level locking and lock-free CAS operations for reads, whereas Collections.synchronizedMap synchronizes the entire map instance on a single mutex, drastically limiting concurrent throughput.' },
    { role_track: 'Python & Data', level: 'Beginner', question: 'What is the Global Interpreter Lock (GIL) in CPython and how does it impact multithreading?', answer: 'The GIL is a mutex that prevents multiple native OS threads from executing Python bytecodes at once. While it protects memory management, CPU-bound tasks do not achieve true parallelism using threads and require multiprocessing instead.' },
    { role_track: 'Python & Data', level: 'Intermediate', question: 'How do Python generators optimize memory usage when processing massive datasets?', answer: 'Generators use the yield statement to produce items lazily one at a time on demand rather than loading an entire sequence into memory upfront, keeping memory usage constant regardless of dataset size.' },
    { role_track: 'Cloud & DevOps', level: 'Intermediate', question: 'What is the difference between a Kubernetes Deployment and a StatefulSet?', answer: 'Deployments manage stateless replicas that can be destroyed and replaced interchangeably. StatefulSets maintain sticky identities for pods with persistent network identifiers and dedicated persistent volumes in a strict sequential order.' },
    { role_track: 'Cloud & DevOps', level: 'Advanced', question: 'How do you design a zero-downtime Blue/Green deployment using Terraform and an AWS Application Load Balancer?', answer: 'Provision two identical environments (Blue and Green). Deploy the new release to the Green target group, run automated health verification tests, and then adjust the ALB listener rule forward weight from 100% Blue to 100% Green without terminating connections.' },
    { role_track: 'Frontend React', level: 'Beginner', question: 'Why should you never mutate React state directly, and what happens when you do?', answer: 'React relies on shallow reference equality checks (Object.is) to determine if state has changed and trigger re-renders. Direct mutation retains the same object reference, preventing React from detecting changes and updating the DOM.' },
    { role_track: 'Frontend React', level: 'Advanced', question: 'Explain how React 18 Concurrent Rendering and useTransition optimize responsiveness.', answer: 'Concurrent rendering allows React to interrupt, pause, or discard rendering computations to prioritize user inputs. useTransition marks state updates as non-urgent transitions, keeping the user interface interactive during heavy DOM calculations.' },
    { role_track: 'QA Automation', level: 'Intermediate', question: 'How does Playwright auto-waiting compare to explicit waits in Selenium?', answer: 'Playwright automatically performs actionability checks (visible, stable, enabled, editable) before executing any action (like click or fill). This eliminates flaky hard-coded thread sleeps common in Selenium frameworks.' },
    { role_track: 'Behavioral & Culture', level: 'All Levels', question: 'Describe a situation where you had a strong technical disagreement with a team member.', answer: 'Frame your answer with the STAR technique: Focus on data-driven benchmarks and architectural trade-offs rather than personal opinions, describe constructive compromise, and demonstrate commitment to the team decision once finalized.' },
  ];

  for (let i = 0; i < questionsData.length; i++) {
    const q = questionsData[i];
    const existing = await prisma.interviewQuestion.findFirst({
      where: { question: q.question },
    });
    if (!existing) {
      await prisma.interviewQuestion.create({
        data: { ...q, sort_order: i + 1 },
      });
    }
  }

  // 12. Rule-based Chat FAQ Knowledge Base
  const chatFaqData = [
    { keywords: 'visa,h1b,opt,stem,sponsorship,greencard,citizen', answer: 'Yes! Codex Tech-IT actively works with E-Verified employer partners who support F-1 OPT, STEM OPT extensions, H-1B transfers, and employment-based immigration sponsorships.' },
    { keywords: 'fee,cost,charge,pricing,pay,free', answer: 'Our standard placement service is 100% free for job seekers—partner employers compensate us upon successful hire. Specialized 1-on-1 career training and executive rebranding have flexible installment plans.' },
    { keywords: 'timeline,how long,fast,time to hire,offer', answer: 'Our typical placement timeline ranges between 10 to 21 business days from completing your profile review to receiving your first interview.' },
    { keywords: 'training,courses,learn,classes,bootcamp', answer: 'We offer 10 live, instructor-led IT training courses including Java Full Stack, Python APIs, Data Engineering, Cloud DevOps, QA Automation, and Cybersecurity.' },
    { keywords: 'employer,hire,staffing,contract,candidates,talent', answer: 'Employers can request technical talent shortlists within 48-72 hours. We offer Contract, Contract-to-Hire, and Direct Placement models with a 90-day guarantee.' },
    { keywords: 'contact,phone,email,address,office,location,talk', answer: 'You can call us at +1 (800) 555-0199 or email contact@codextechit.com. We have corporate offices in Plano, Texas, and Hyderabad, India.' },
  ];

  for (const c of chatFaqData) {
    const existing = await prisma.chatFaq.findFirst({
      where: { keywords: c.keywords },
    });
    if (!existing) {
      await prisma.chatFaq.create({ data: c });
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
