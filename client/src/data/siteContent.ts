/**
 * Site Content & Hero Showcase Metrics
 * Dynamic tech roles & real career milestone tracks for hero stage
 */

export interface JobHiringStory {
  id: string;
  role: string;
  shortRole: string;
  emoji: string;
  tag: string;
  salary: string;
  companyTier: string;
  daysToHire: number;
  atsScore: number;
  interviewTime: string;
  roundName: string;
  skills: string[];
}

export const heroJobStories: JobHiringStory[] = [
  {
    id: 'python-dev',
    role: 'Python Developer',
    shortRole: 'Python Dev',
    emoji: '🐍',
    tag: 'FastAPI / Django',
    salary: '$148,000',
    companyTier: 'Tier-1 FinTech',
    daysToHire: 14,
    atsScore: 98,
    interviewTime: 'Tue · 2:30 PM',
    roundName: 'Fast-track technical round',
    skills: ['Python', 'FastAPI', 'PostgreSQL'],
  },
  {
    id: 'fullstack-dev',
    role: 'Full Stack Engineer',
    shortRole: 'Full Stack',
    emoji: '⚛️',
    tag: 'React / Node.js',
    salary: '$156,000',
    companyTier: 'Cloud SaaS Enterprise',
    daysToHire: 16,
    atsScore: 99,
    interviewTime: 'Wed · 11:00 AM',
    roundName: 'System architecture round',
    skills: ['React', 'TypeScript', 'Node.js'],
  },
  {
    id: 'cloud-devops',
    role: 'Cloud & DevOps Lead',
    shortRole: 'Cloud & DevOps',
    emoji: '☁️',
    tag: 'AWS / Kubernetes',
    salary: '$168,000',
    companyTier: 'Global Tech Corp',
    daysToHire: 12,
    atsScore: 97,
    interviewTime: 'Thu · 4:00 PM',
    roundName: 'Infra & CI/CD round',
    skills: ['Kubernetes', 'AWS', 'Terraform'],
  },
  {
    id: 'ai-ml-engineer',
    role: 'AI / ML Engineer',
    shortRole: 'AI & ML',
    emoji: '🤖',
    tag: 'PyTorch / GenAI',
    salary: '$178,000',
    companyTier: 'Autonomous AI Labs',
    daysToHire: 15,
    atsScore: 99,
    interviewTime: 'Fri · 1:30 PM',
    roundName: 'Deep learning & LLM round',
    skills: ['PyTorch', 'LangChain', 'Python'],
  },
  {
    id: 'data-engineer',
    role: 'Data Engineer',
    shortRole: 'Data Eng',
    emoji: '📊',
    tag: 'Snowflake / Spark',
    salary: '$152,000',
    companyTier: 'Capital Analytics',
    daysToHire: 18,
    atsScore: 98,
    interviewTime: 'Mon · 3:00 PM',
    roundName: 'Data pipeline design round',
    skills: ['Spark', 'SQL', 'Snowflake'],
  },
  {
    id: 'cybersecurity-analyst',
    role: 'Cybersecurity Specialist',
    shortRole: 'Cybersecurity',
    emoji: '🛡️',
    tag: 'Zero Trust / SOC',
    salary: '$162,000',
    companyTier: 'CyberDefense Global',
    daysToHire: 13,
    atsScore: 96,
    interviewTime: 'Wed · 2:00 PM',
    roundName: 'Threat modeling & SOC round',
    skills: ['Zero Trust', 'SIEM', 'Cloud Security'],
  },
  {
    id: 'java-architect',
    role: 'Java Microservices Architect',
    shortRole: 'Java Architect',
    emoji: '☕',
    tag: 'Spring Boot / Kafka',
    salary: '$165,000',
    companyTier: 'Tier-1 Banking Corp',
    daysToHire: 14,
    atsScore: 99,
    interviewTime: 'Tue · 10:30 AM',
    roundName: 'Distributed systems round',
    skills: ['Java 21', 'Spring Cloud', 'Kafka'],
  },
  {
    id: 'mobile-lead',
    role: 'Mobile iOS & Android Lead',
    shortRole: 'Mobile Lead',
    emoji: '📱',
    tag: 'React Native / Swift',
    salary: '$155,000',
    companyTier: 'FinTech Unicorn',
    daysToHire: 11,
    atsScore: 97,
    interviewTime: 'Thu · 1:00 PM',
    roundName: 'Mobile architecture round',
    skills: ['React Native', 'Swift', 'Kotlin'],
  },
];

// Backward-compatible export
export const heroMonogramContent = {
  chips: [
    {
      id: 'chip-ats',
      icon: 'document-check',
      title: 'ATS score 98',
      subtext: 'Resume optimized',
      theme: 'orange',
    },
    {
      id: 'chip-interview',
      icon: 'calendar',
      title: 'Interview · Tue 2:30 PM',
      subtext: 'Fast-track technical round',
      theme: 'blue',
    },
    {
      id: 'chip-offer',
      icon: 'badge-check',
      title: 'Offer secured',
      subtext: 'Cloud Architecture · $165k',
      theme: 'green',
    },
  ],
};
