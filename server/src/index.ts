import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { config } from './config';
import apiRouter from './routes/api';
import { errorHandler } from './middleware/errorHandler';
import { prisma } from './services/db';

const app = express();

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow Vite dev & inline assets
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
app.use(
  cors({
    origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory (secured, but accessible if needed)
const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Dynamic robots.txt from MySQL settings
app.get('/robots.txt', (_req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/admin/
Sitemap: ${config.clientUrl}/sitemap.xml
`);
});

// Dynamic sitemap.xml generated directly from MySQL
app.get('/sitemap.xml', async (_req, res, next) => {
  try {
    const baseUrl = config.clientUrl;
    const staticRoutes = [
      '',
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
    ];

    const [courses, posts, stories, jobs] = await Promise.all([
      prisma.course.findMany({ where: { is_active: true }, select: { slug: true } }),
      prisma.post.findMany({ where: { is_published: true }, select: { slug: true } }),
      prisma.successStory.findMany({ where: { is_published: true }, select: { slug: true } }),
      prisma.jobOpening.findMany({ where: { is_active: true }, select: { slug: true } }),
    ]);

    const dynamicRoutes = [
      ...courses.map((c) => `/services/it-training/${c.slug}`),
      ...posts.map((p) => `/insights/${p.slug}`),
      ...stories.map((s) => `/success-stories/${s.slug}`),
      ...jobs.map((j) => `/careers/${j.slug}`),
    ];

    const allRoutes = [...staticRoutes, ...dynamicRoutes];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    next(err);
  }
});

// Mount /api routes
app.use('/api', apiRouter);

// Route-Specific SEO Metadata Map for Crawlers and Previews
const routeSeoMap: Record<string, { title: string; desc: string; canonical: string }> = {
  '/': {
    title: 'We Deliver Jobs Faster | IT Recruitment, Staffing & Training - Codex Tech-IT',
    desc: 'Codex Tech-IT connects skilled IT professionals with companies ready to hire, through sharp profile positioning, interview coaching and direct employer access.',
    canonical: 'https://codextechit.com/',
  },
  '/services': {
    title: 'Specialized IT Solutions & Staffing Services - Codex Tech-IT',
    desc: 'Explore full-lifecycle tech recruitment, IT training, contract staffing, executive search, and career acceleration solutions from Codex Tech-IT.',
    canonical: 'https://codextechit.com/services',
  },
  '/careers': {
    title: 'High-Growth IT Careers & Tech Openings - Codex Tech-IT',
    desc: 'Browse open full-stack, AI/ML, cloud DevOps, and data engineering positions with pre-vetted corporate enterprise partners.',
    canonical: 'https://codextechit.com/careers',
  },
  '/about': {
    title: 'About Codex Tech-IT | Our Mission, Leadership & Enterprise Network',
    desc: 'Learn how Codex Tech-IT bridges top technical talent with industry leaders through specialized calibration and transparent placement partnerships.',
    canonical: 'https://codextechit.com/about',
  },
  '/contact': {
    title: 'Contact Codex Tech-IT | Hire Talent or Accelerate Your Tech Career',
    desc: 'Get in touch with our recruitment directors or career advisors. Direct consultations for employers and tech candidates.',
    canonical: 'https://codextechit.com/contact',
  },
  '/plans': {
    title: 'Candidate Career Acceleration Plans & Pricing - Codex Tech-IT',
    desc: 'Flexible, outcome-driven career placement programs including Staffing, Executive Coaching, and Technical Upskilling tracks.',
    canonical: 'https://codextechit.com/plans',
  },
};

// Serve frontend dist in production with SPA fallback & dynamic SEO injection
const clientDist = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist, { index: false }));
  app.get('*', (req, res) => {
    const indexPath = path.join(clientDist, 'index.html');
    if (!fs.existsSync(indexPath)) {
      return res.status(404).send('Application build not found.');
    }

    const reqPath = req.path.replace(/\/$/, '') || '/';
    const seo = routeSeoMap[reqPath] || routeSeoMap['/'];

    let html = fs.readFileSync(indexPath, 'utf8');

    // Inject dynamic, unique SEO metadata
    html = html.replace(/<title>.*?<\/title>/i, `<title>${seo.title}</title>`);

    if (html.includes('<meta name="description"')) {
      html = html.replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${seo.desc}" />`);
    } else {
      html = html.replace('</head>', `<meta name="description" content="${seo.desc}" />\n</head>`);
    }

    const ogTags = `
    <link rel="canonical" href="${seo.canonical}" />
    <meta property="og:title" content="${seo.title}" />
    <meta property="og:description" content="${seo.desc}" />
    <meta property="og:url" content="${seo.canonical}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${seo.title}" />
    <meta name="twitter:description" content="${seo.desc}" />
    `;
    html = html.replace('</head>', `${ogTags}\n</head>`);

    res.send(html);
  });
}

// Global error handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`[Codex Tech-IT Server] Running at http://localhost:${config.port}`);
    console.log(`[Codex Tech-IT Server] API mounted at http://localhost:${config.port}/api`);
  });
}

export default app;
