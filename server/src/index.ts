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
      '/technologies',
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
      '/blog',
      '/faq',
      '/contact',
      '/privacy-policy',
      '/terms-and-conditions',
      '/cookie-policy',
      '/refund-policy',
      '/accessibility-statement',
    ];

    const [courses, posts, blogPosts, stories, jobs] = await Promise.all([
      prisma.course.findMany({ where: { is_active: true }, select: { slug: true } }),
      prisma.post.findMany({ where: { is_published: true }, select: { slug: true } }),
      prisma.blogPost.findMany({ where: { status: 'published' }, select: { slug: true, updated_at: true } }),
      prisma.successStory.findMany({ where: { is_published: true }, select: { slug: true } }),
      prisma.jobOpening.findMany({ where: { is_active: true }, select: { slug: true } }),
    ]);

    const dynamicRoutes = [
      ...courses.map((c) => `/services/it-training/${c.slug}`),
      ...posts.map((p) => `/insights/${p.slug}`),
      ...blogPosts.map((b) => `/blog/${b.slug}`),
      ...stories.map((s) => `/success-stories/${s.slug}`),
      ...jobs.map((j) => `/careers/${j.slug}`),
    ];

    const allRoutes = Array.from(new Set([...staticRoutes, ...dynamicRoutes]));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : route.startsWith('/blog/') || route.startsWith('/insights/') ? '0.9' : '0.8'}</priority>
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

// Dynamic RSS Feed (/rss.xml) for Codex Tech-IT Blog
app.get('/rss.xml', async (_req, res, next) => {
  try {
    const baseUrl = config.clientUrl;
    const posts = await prisma.blogPost.findMany({
      where: { status: 'published' },
      orderBy: { published_at: 'desc' },
      take: 25,
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } }
      }
    });

    const feedXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Codex Tech-IT Engineering Blog</title>
  <link>${baseUrl}/blog</link>
  <description>Field-tested technical career intelligence, ATS resume optimization, system design blueprints, and US tech hiring economics.</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
${posts
  .map(
    (p) => `  <item>
    <title><![CDATA[${p.title}]]></title>
    <link>${baseUrl}/blog/${p.slug}</link>
    <guid isPermaLink="true">${baseUrl}/blog/${p.slug}</guid>
    <pubDate>${p.published_at ? new Date(p.published_at).toUTCString() : new Date().toUTCString()}</pubDate>
    <description><![CDATA[${p.excerpt}]]></description>
    <category><![CDATA[${p.category.name}]]></category>
    <author>contact@codextechit.com (${p.author.name})</author>
  </item>`
  )
  .join('\n')}
</channel>
</rss>`;

    res.header('Content-Type', 'application/xml');
    res.send(feedXml);
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
  '/insights': {
    title: 'Technical Career Insights & Hiring Strategies | Codex Tech-IT',
    desc: 'Deep-dive articles on ATS resume fixes, technical interview frameworks, contract vs direct hire dynamics, and tech talent acquisition.',
    canonical: 'https://codextechit.com/insights',
  },
  '/blog': {
    title: 'Blogs | Codex Tech-IT',
    desc: 'Explore technical engineering guides, ATS resume optimization protocols, and US IT hiring benchmarks from Codex Tech-IT advisors.',
    canonical: 'https://codextechit.com/blog',
  },
  '/login': {
    title: 'Admin Sign In | Codex Tech-IT',
    desc: 'Authorized Codex Tech-IT administration portal sign in.',
    canonical: 'https://codextechit.com/login',
  },
  '/admin/login': {
    title: 'Admin Sign In | Codex Tech-IT',
    desc: 'Authorized Codex Tech-IT administration portal sign in.',
    canonical: 'https://codextechit.com/admin/login',
  },
};

// Serve frontend dist in production with SPA fallback & dynamic SEO injection
const clientDist = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist, { index: false }));
  app.get('*', async (req, res, next) => {
    try {
      const indexPath = path.join(clientDist, 'index.html');
      if (!fs.existsSync(indexPath)) {
        return res.status(404).send('Application build not found.');
      }

      const reqPath = req.path.replace(/\/$/, '') || '/';

      // Check for /insights listing page
      if (reqPath === '/insights') {
        const prerenderedInsights = path.join(clientDist, 'insights', 'index.html');
        if (fs.existsSync(prerenderedInsights)) {
          return res.send(fs.readFileSync(prerenderedInsights, 'utf8'));
        }
      }

      // Check for /blog listing page
      if (reqPath === '/blog') {
        const prerenderedBlog = path.join(clientDist, 'blog', 'index.html');
        if (fs.existsSync(prerenderedBlog)) {
          return res.send(fs.readFileSync(prerenderedBlog, 'utf8'));
        }
      }

      // Check for /blog/:slug routes
      const blogMatch = reqPath.match(/^\/blog\/([a-z0-9-]+)$/i);
      if (blogMatch) {
        const slug = blogMatch[1];
        const post = await prisma.blogPost.findUnique({
          where: { slug },
          include: {
            author: true,
            category: true,
            faqs: { orderBy: { sort_order: 'asc' } }
          }
        });

        if (!post || post.status !== 'published') {
          // Proper 404 Response with real HTTP 404 status
          let notFoundHtml = fs.readFileSync(indexPath, 'utf8');
          notFoundHtml = notFoundHtml
            .replace(/<title>.*?<\/title>/i, '<title>Article Not Found (404) | Codex Tech-IT Blog</title>')
            .replace('</head>', '<meta name="robots" content="noindex, nofollow" />\n</head>')
            .replace(
              /<div id="root">[\s\S]*<\/div>\s*(?=<script|<\/body)/i,
              `<div id="root">
                <main class="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50">
                  <div class="max-w-md bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                    <span class="text-xs font-bold uppercase tracking-wider text-orange-500">HTTP 404 Error</span>
                    <h1 class="text-2xl font-extrabold text-navy-900 mt-2 mb-4">Article Not Found</h1>
                    <p class="text-sm text-slate-600 mb-6">The blog article you requested does not exist or has been unpublished.</p>
                    <a href="/blog" class="inline-block px-5 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-xs hover:bg-orange-600 transition-colors">Browse All Blogs</a>
                  </div>
                </main>
              </div>`
            );
          return res.status(404).send(notFoundHtml);
        }

        let html = fs.readFileSync(indexPath, 'utf8');

        // Post found: Generate Rich SEO Metadata & JSON-LD
        const title = post.seo_title || `${post.title} | Codex Tech-IT Blog`;
        const desc = post.seo_description || post.excerpt;
        const canonical = post.canonical_url || `https://codextechit.com/blog/${post.slug}`;
        const coverUrl = post.cover_image.startsWith('http') ? post.cover_image : `https://codextechit.com${post.cover_image}`;

        // JSON-LD Schemas: BlogPosting + BreadcrumbList + FAQPage
        const jsonLdArticle = {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          'headline': post.title,
          'description': post.excerpt,
          'image': [coverUrl],
          'datePublished': post.published_at ? new Date(post.published_at).toISOString() : new Date().toISOString(),
          'dateModified': new Date(post.updated_at).toISOString(),
          'author': {
            '@type': 'Person',
            'name': post.author.name,
            'jobTitle': post.author.role
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'Codex Tech-IT',
            'url': 'https://codextechit.com',
            'logo': {
              '@type': 'ImageObject',
              'url': 'https://codextechit.com/assets/logo.png'
            }
          },
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': canonical
          }
        };

        const jsonLdBreadcrumbs = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://codextechit.com/'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Blog',
              'item': 'https://codextechit.com/blog'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': post.title,
              'item': canonical
            }
          ]
        };

        const jsonLdFaq = post.faqs.length > 0 ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': post.faqs.map((f) => ({
            '@type': 'Question',
            'name': f.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': f.answer
            }
          }))
        } : null;

        const schemasHtml = `
  <script type="application/ld+json">${JSON.stringify(jsonLdArticle)}</script>
  <script type="application/ld+json">${JSON.stringify(jsonLdBreadcrumbs)}</script>
  ${jsonLdFaq ? `<script type="application/ld+json">${JSON.stringify(jsonLdFaq)}</script>` : ''}
        `;

        // Inject dynamic tags into HTML
        html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
        if (html.includes('<meta name="description"')) {
          html = html.replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${desc}" />`);
        } else {
          html = html.replace('</head>', `<meta name="description" content="${desc}" />\n</head>`);
        }

        const ogTags = `
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="article" />
    <meta property="og:image" content="${coverUrl}" />
    <meta property="article:published_time" content="${post.published_at ? new Date(post.published_at).toISOString() : ''}" />
    <meta property="article:section" content="${post.category.name}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />
    <meta name="twitter:image" content="${coverUrl}" />
    ${schemasHtml}
        `;
        html = html.replace('</head>', `${ogTags}\n</head>`);

        // Inject prerendered semantic article HTML inside <div id="root"> for curl & crawlers
        const prerenderedArticle = `
          <div id="root">
            <article class="blog-prerendered-content" style="max-width:800px;margin:40px auto;padding:0 20px;">
              <nav aria-label="Breadcrumb">
                <p><a href="/">Home</a> / <a href="/blog">Blog</a> / <span>${post.title}</span></p>
              </nav>
              <h1 style="font-size:32px;font-weight:bold;margin:20px 0;">${post.title}</h1>
              <div class="meta" style="color:#64748b;margin-bottom:20px;">
                <span>By ${post.author.name} (${post.author.role})</span> | 
                <span>${post.reading_time_min} min read</span>
              </div>
              <p class="lead" style="font-size:18px;color:#334155;margin-bottom:30px;">${post.excerpt}</p>
              <div class="article-body">
                ${post.content_html}
              </div>
              ${post.faqs.length > 0 ? `
              <section class="faqs" style="margin-top:40px;">
                <h2>Frequently Asked Questions</h2>
                ${post.faqs.map(f => `<div class="faq-item" style="margin-bottom:16px;"><h3>${f.question}</h3><p>${f.answer}</p></div>`).join('')}
              </section>
              ` : ''}
            </article>
          </div>
        `;
        html = html.replace(/<div id="root">[\s\S]*<\/div>\s*(?=<script|<\/body)/i, prerenderedArticle);

        return res.send(html);
      }

      let html = fs.readFileSync(indexPath, 'utf8');

      // For non-home routes, clear prerendered home markup from root so client hydration mounts cleanly
      if (reqPath !== '/') {
        html = html.replace(/<div id="root">[\s\S]*<\/div>\s*(?=<script|<\/body)/i, '<div id="root"></div>');
      }

      // Default static routes fallback
      const seo = routeSeoMap[reqPath] || routeSeoMap['/'];

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
    } catch (err) {
      next(err);
    }
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

// reload trigger 1792847634722