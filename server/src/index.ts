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

// Serve frontend dist in production with SPA fallback
const clientDist = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
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
