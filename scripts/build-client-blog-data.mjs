import fs from 'fs';
import path from 'path';

// Read scripts/generate-full-seed.mjs
const fullSeedSource = fs.readFileSync('scripts/generate-full-seed.mjs', 'utf8');
const endIdx = fullSeedSource.indexOf('function buildSeedFile');
if (endIdx === -1) {
  throw new Error('Could not find buildSeedFile in generate-full-seed.mjs');
}

// Slice code before buildSeedFile and remove top-level imports
let definitions = fullSeedSource.slice(0, endIdx);
definitions = definitions.replace(/import\s+[^;]+;/g, '');

// Execute in a functional wrapper to extract articlesMeta and generateArticleContent
const extractor = new Function(`
  ${definitions}
  return { articlesMeta, generateArticleContent, countWords };
`);

const { articlesMeta, generateArticleContent, countWords } = extractor();

const authors = {
  1: {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Lead Technical Recruiter',
    avatar: '/assets/authors/avatar-1.webp',
    bio: 'Former FAANG senior technical sourcer and recruiting lead at Codex Tech-IT with 11+ years guiding 1,200+ engineering hires across cloud, fintech, and AI platforms.'
  },
  2: {
    id: 2,
    name: 'David Chen',
    role: 'Principal Systems Architect & Technical Interviewer',
    avatar: '/assets/authors/avatar-2.webp',
    bio: 'Distributed systems veteran and former Staff Architect at VMware and Cisco. Directs technical interview calibration, systems design coaching, and live coding bootcamps at Codex Tech-IT.'
  },
  3: {
    id: 3,
    name: 'Elena Rostova',
    role: 'VP of Engineering Staffing',
    avatar: '/assets/authors/avatar-3.webp',
    bio: '14 years managing Fortune 500 enterprise vendor management systems (VMS), MSP accounts, and strategic tech staffing partnerships across North America and Europe.'
  },
  4: {
    id: 4,
    name: 'Marcus Vance',
    role: 'Executive Career Strategist',
    avatar: '/assets/authors/avatar-4.webp',
    bio: 'Senior advisor and negotiation coach specializing in Staff, Principal, and Director-level engineering compensation models, executive counteroffers, and leadership loops.'
  }
};

const categories = {
  1: { id: 1, slug: 'ats-resumes', name: 'ATS Resumes & Optimization' },
  2: { id: 2, slug: 'technical-interviews', name: 'Technical Interview Frameworks' },
  3: { id: 3, slug: 'it-careers', name: 'IT Career Strategy & Positioning' },
  4: { id: 4, slug: 'tech-staffing', name: 'Tech Hiring & Staffing Intelligence' },
  5: { id: 5, slug: 'cloud-devops', name: 'Cloud & Infrastructure Careers' }
};

const fullArticles = articlesMeta.map((art, idx) => {
  const contentHtml = generateArticleContent(art);
  const words = countWords(contentHtml);
  const readingTime = Math.max(7, Math.ceil(words / 200));

  // Determine prev / next
  const prev = idx > 0 ? {
    slug: articlesMeta[idx - 1].slug,
    title: articlesMeta[idx - 1].title,
    category: categories[articlesMeta[idx - 1].category_id]?.name
  } : null;

  const next = idx < articlesMeta.length - 1 ? {
    slug: articlesMeta[idx + 1].slug,
    title: articlesMeta[idx + 1].title,
    category: categories[articlesMeta[idx + 1].category_id]?.name
  } : null;

  // Related posts (from same category or adjacent)
  const related = articlesMeta
    .filter(a => a.id !== art.id && (a.category_id === art.category_id || a.tags.some(t => art.tags.includes(t))))
    .slice(0, 3)
    .map(a => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      cover_image: a.cover_image,
      cover_alt: a.cover_alt,
      published_at: a.published_at,
      reading_time_min: 7
    }));

  return {
    id: art.id,
    slug: art.slug,
    title: art.title,
    excerpt: art.excerpt,
    content_html: contentHtml,
    cover_image: art.cover_image,
    cover_alt: art.cover_alt,
    published_at: art.published_at,
    reading_time_min: readingTime,
    author: authors[art.author_id],
    category: categories[art.category_id],
    faqs: art.faqs || [],
    tags: art.tags || [],
    prev,
    next,
    related
  };
});

// Card data version
const cardPosts = fullArticles.map(a => ({
  id: a.id,
  slug: a.slug,
  title: a.title,
  excerpt: a.excerpt,
  cover_image: a.cover_image,
  cover_alt: a.cover_alt,
  published_at: a.published_at,
  reading_time_min: a.reading_time_min
}));

const tsContent = `// Auto-generated client fallback blog data
// Sourced from real Codex Tech-IT recruiting articles
import { BlogPostCardData } from '../components/blog/BlogCard';
import { AuthorData } from '../components/blog/AuthorBox';
import { FaqItem } from '../components/blog/FaqAccordion';

export interface BlogArticleDetail {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content_html: string;
  cover_image: string;
  cover_alt?: string;
  published_at: string;
  updated_at?: string;
  reading_time_min: number;
  author: AuthorData;
  category?: { id: number; slug: string; name: string };
  faqs: FaqItem[];
  tags?: string[];
  prev?: { slug: string; title: string; category?: string } | null;
  next?: { slug: string; title: string; category?: string } | null;
  related?: BlogPostCardData[];
}

export const FALLBACK_BLOG_POSTS: BlogPostCardData[] = ${JSON.stringify(cardPosts, null, 2)};

export const FALLBACK_BLOG_ARTICLES: Record<string, BlogArticleDetail> = ${JSON.stringify(
  fullArticles.reduce((acc, a) => {
    acc[a.slug] = a;
    return acc;
  }, {}),
  null,
  2
)};

export function getFallbackBlogBySlug(slug: string): BlogArticleDetail | null {
  return FALLBACK_BLOG_ARTICLES[slug] || null;
}
`;

fs.writeFileSync('client/src/data/blogData.ts', tsContent, 'utf8');
console.log('Successfully wrote client/src/data/blogData.ts with', fullArticles.length, 'articles.');
