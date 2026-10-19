// Deterministic, explainable scoring engines for all 4 tools

const ACTION_VERBS = [
  'developed', 'architected', 'spearheaded', 'orchestrated', 'implemented', 'optimized',
  'engineered', 'deployed', 'automated', 'delivered', 'reduced', 'increased', 'managed',
  'collaborated', 'designed', 'built', 'resolved', 'streamlined', 'migrated', 'transformed'
];

const ROLE_DICTIONARIES: Record<string, string[]> = {
  'Software Engineer': ['javascript', 'typescript', 'react', 'node', 'python', 'java', 'sql', 'git', 'docker', 'rest', 'api', 'ci/cd', 'agile', 'aws', 'testing'],
  'Full Stack Engineer': ['react', 'node', 'typescript', 'sql', 'nosql', 'express', 'html5', 'css3', 'tailwind', 'graphql', 'docker', 'next.js', 'redis', 'jest'],
  'Data Engineer': ['python', 'sql', 'spark', 'kafka', 'hadoop', 'etl', 'airflow', 'snowflake', 'bigquery', 'data lake', 'pipeline', 'aws', 'databricks', 'scala'],
  'DevOps / Cloud Engineer': ['aws', 'azure', 'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'ci/cd', 'linux', 'bash', 'monitoring', 'prometheus', 'grafana'],
  'Data Scientist / AI': ['python', 'machine learning', 'deep learning', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'nlp', 'llm', 'sql', 'data visualization'],
  'QA Automation': ['selenium', 'cypress', 'playwright', 'testing', 'automation', 'javascript', 'python', 'api testing', 'postman', 'jest', 'test cases', 'jira'],
};

export function analyzeResume(text: string, targetRole: string = 'Software Engineer') {
  if (!text || text.trim().length < 30) {
    throw new Error('Resume content is too short or unreadable. Please paste complete resume text or upload an unscanned document.');
  }

  const normalized = text.toLowerCase();
  const words = normalized.split(/\s+/);
  const wordCount = words.length;

  // 1. Contact Info check (20 pts)
  let contactScore = 0;
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/.test(text);
  const hasLinkedIn = /linkedin\.com\/in\//.test(normalized) || /linkedin/.test(normalized);
  const hasGitHub = /github\.com\//.test(normalized) || /portfolio/.test(normalized);

  if (hasEmail) contactScore += 6;
  if (hasPhone) contactScore += 6;
  if (hasLinkedIn) contactScore += 5;
  if (hasGitHub) contactScore += 3;

  // 2. Section Headings check (20 pts)
  let sectionScore = 0;
  const sections = ['experience', 'education', 'skills', 'projects', 'summary'];
  const presentSections: string[] = [];
  sections.forEach((sec) => {
    if (normalized.includes(sec)) {
      sectionScore += 4;
      presentSections.push(sec.charAt(0).toUpperCase() + sec.slice(1));
    }
  });

  // 3. Action Verbs check (20 pts)
  let verbMatches: string[] = [];
  ACTION_VERBS.forEach((v) => {
    if (normalized.includes(v)) {
      verbMatches.push(v);
    }
  });
  const verbScore = Math.min(20, verbMatches.length * 2);

  // 4. Quantified Bullets check (20 pts)
  // Look for percentages, dollar amounts, or numbers near words like reduced, increased, delivered
  const metricsMatches = text.match(/\b(\d+[\%kmb]?|\$\d+|\d+\+?\s*(users|clients|percent|seconds|hours|ms|teams))\b/gi) || [];
  const metricsScore = Math.min(20, metricsMatches.length * 4);

  // 5. Keyword Coverage vs Target Role (20 pts)
  const targetDict = ROLE_DICTIONARIES[targetRole] || ROLE_DICTIONARIES['Software Engineer'];
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  targetDict.forEach((kw) => {
    if (normalized.includes(kw)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const keywordCoveragePct = targetDict.length > 0 ? (matchedKeywords.length / targetDict.length) : 1;
  const keywordScore = Math.round(keywordCoveragePct * 20);

  // Total Score (0 - 100)
  const totalScore = Math.min(100, contactScore + sectionScore + verbScore + metricsScore + keywordScore);

  // Prioritized fixes
  const fixes: string[] = [];
  if (!hasLinkedIn) fixes.push('Add a clickable LinkedIn profile link in your contact header.');
  if (missingKeywords.length > 0) fixes.push(`Include in-demand keywords for ${targetRole}: ${missingKeywords.slice(0, 4).join(', ')}.`);
  if (metricsMatches.length < 3) fixes.push('Quantify your achievements using specific percentages (%), metrics, or scale impact.');
  if (verbMatches.length < 5) fixes.push('Lead your experience bullets with strong action verbs (e.g., Architected, Optimized, Spearheaded).');
  if (wordCount < 250) fixes.push('Resume length is too brief. Standard ATS-optimized technical resumes range between 400 - 800 words.');
  if (wordCount > 1200) fixes.push('Resume exceeds optimal length. Condense older roles to keep technical focus within 1-2 pages.');

  return {
    score: totalScore,
    wordCount,
    breakdown: {
      contactInfo: { score: contactScore, max: 20 },
      sectionStructure: { score: sectionScore, max: 20, presentSections },
      actionVerbs: { score: verbScore, max: 20, count: verbMatches.length },
      quantifiedMetrics: { score: metricsScore, max: 20, count: metricsMatches.length },
      roleKeywords: { score: keywordScore, max: 20, matched: matchedKeywords, missing: missingKeywords },
    },
    fixes: fixes.length > 0 ? fixes : ['Great job! Your resume meets high ATS compliance standards.'],
  };
}

export function analyzeLinkedIn(headline: string, about: string, skills: string, targetRole: string = 'Full Stack Engineer') {
  let score = 0;
  const suggestions: string[] = [];

  // Headline assessment (30 pts)
  let headlineScore = 0;
  if (headline.length >= 30) headlineScore += 10;
  if (/\||\/|•|-/.test(headline)) headlineScore += 10; // separated value proposition
  if (new RegExp(targetRole.split(' ')[0], 'i').test(headline)) headlineScore += 10;
  score += headlineScore;

  if (headline.length < 30) {
    suggestions.push(`Expand your headline beyond your job title. Include core stack and business value (e.g., "${targetRole} | React, Node, AWS | Building Scalable Cloud Apps").`);
  }

  // About assessment (40 pts)
  let aboutScore = 0;
  const wordCount = about.split(/\s+/).length;
  if (wordCount >= 50 && wordCount <= 300) aboutScore += 20;
  else if (wordCount > 300) aboutScore += 12;
  else aboutScore += 5;

  if (/contact|email|reach|connect|let's chat/i.test(about)) {
    aboutScore += 10;
  } else {
    suggestions.push('Add a clear Call to Action (CTA) at the bottom of your About section with your preferred contact channel.');
  }

  if (/(helped|achieved|scaled|built|led|delivered)/i.test(about)) {
    aboutScore += 10;
  } else {
    suggestions.push('Highlight 1-2 career highlights or measurable wins in your About narrative.');
  }
  score += aboutScore;

  // Skills assessment (30 pts)
  const skillsList = skills.split(/[,;\n]+/).map(s => s.trim().toLowerCase()).filter(Boolean);
  let skillsScore = Math.min(30, skillsList.length * 6);
  score += skillsScore;

  if (skillsList.length < 5) {
    suggestions.push('Add at least 5-10 specific industry skills to maximize LinkedIn recruiter search visibility.');
  }

  return {
    score: Math.min(100, score),
    headlineScore,
    aboutScore,
    skillsScore,
    suggestions: suggestions.length > 0 ? suggestions : ['Your profile structure is well-optimized for technical recruiters.'],
  };
}

export function calculateJobMatch(resumeText: string, jobDescription: string) {
  const normResume = resumeText.toLowerCase();
  const normJd = jobDescription.toLowerCase();

  // Extract common tech tokens
  const techTokens = [
    'react', 'node', 'typescript', 'javascript', 'python', 'java', 'sql', 'nosql', 'mongodb',
    'postgresql', 'mysql', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'git',
    'rest', 'graphql', 'html', 'css', 'tailwind', 'microservices', 'agile', 'scrum', 'redis',
    'next.js', 'express', 'terraform', 'linux', 'devops', 'spark', 'kafka', 'testing', 'jest'
  ];

  const jdKeywords = techTokens.filter(t => normJd.includes(t));
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  jdKeywords.forEach(kw => {
    if (normResume.includes(kw)) {
      matchedSkills.push(kw);
    } else {
      missingSkills.push(kw);
    }
  });

  const matchPercentage = jdKeywords.length > 0
    ? Math.round((matchedSkills.length / jdKeywords.length) * 100)
    : 75;

  const recommendations: string[] = [];
  if (missingSkills.length > 0) {
    recommendations.push(`Incorporate experience with ${missingSkills.slice(0, 3).join(', ')} into your project or skills section.`);
  }
  if (matchPercentage < 60) {
    recommendations.push('Consider bridging the skills gap with Codex Tech-IT targeted IT training or custom project campaigns.');
  } else {
    recommendations.push('Strong core alignment! Focus your interview preparation on your experience with ' + matchedSkills.slice(0, 3).join(', ') + '.');
  }

  return {
    matchPercentage,
    totalSkillsInJob: jdKeywords.length,
    matchedCount: matchedSkills.length,
    missingCount: missingSkills.length,
    matchedSkills,
    missingSkills,
    recommendations,
  };
}

export function evaluateInterviewReadiness(input: {
  track: string;
  experience_years: string;
  technical_confidence: number;
  system_design_confidence: number;
  behavioral_confidence: number;
  live_coding_experience: boolean;
  mock_interviews_done: number;
}) {
  const techPart = (input.technical_confidence / 5) * 30;
  const sysPart = (input.system_design_confidence / 5) * 25;
  const behavPart = (input.behavioral_confidence / 5) * 20;
  const codingPart = input.live_coding_experience ? 15 : 5;
  const mockPart = Math.min(10, input.mock_interviews_done * 2.5);

  const overallScore = Math.round(techPart + sysPart + behavPart + codingPart + mockPart);

  const strengths: string[] = [];
  const gaps: string[] = [];

  if (input.technical_confidence >= 4) strengths.push('Solid confidence in core domain technologies');
  else gaps.push('Technical depth in algorithms, frameworks, and architecture');

  if (input.behavioral_confidence >= 4) strengths.push('Good grasp of STAR-format behavioral communication');
  else gaps.push('Behavioral answer structuring and leadership scenario communication');

  if (input.system_design_confidence >= 4) strengths.push('Strong architectural & high-level system design knowledge');
  else gaps.push('System design scalability, caching, and data modeling');

  if (input.mock_interviews_done >= 3) strengths.push('Active mock interview practice completed');
  else gaps.push('Live mock interview simulation under timed pressure');

  const prepRoadmap = [
    { day: 'Days 1-3', focus: 'Core fundamentals review & top 50 technical interview questions' },
    { day: 'Days 4-7', focus: 'System design patterns, trade-offs, and architecture diagrams' },
    { day: 'Days 8-10', focus: 'STAR framework behavioral storytelling & portfolio walkthrough' },
    { day: 'Days 11-14', focus: 'Full-length 60-minute mock interview simulation with feedback' },
  ];

  return {
    score: overallScore,
    strengths,
    gaps,
    roadmap: prepRoadmap,
    suggestedService: 'interview-preparation',
  };
}
