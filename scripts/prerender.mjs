import { createServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CLIENT_DIR = path.join(ROOT_DIR, 'client');
const DIST_DIR = path.join(CLIENT_DIR, 'dist');
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html');

async function prerender() {
  console.log('🚀 Running Real-Component SSG Pre-rendering for Home route...');

  if (!fs.existsSync(INDEX_HTML_PATH)) {
    throw new Error(`dist/index.html not found at ${INDEX_HTML_PATH}`);
  }

  let indexHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');

  // Find generated CSS file in dist/assets
  const assets = fs.readdirSync(path.join(DIST_DIR, 'assets'));
  const cssFile = assets.find((f) => f.startsWith('index-') && f.endsWith('.css'));
  const soraFont = assets.find((f) => f.startsWith('sora-latin-700-normal') && f.endsWith('.woff2'));
  const interFont = assets.find((f) => f.startsWith('inter-latin-400-normal') && f.endsWith('.woff2'));

  if (!cssFile) {
    throw new Error('Could not find compiled index-*.css in dist/assets');
  }

  console.log(`  Found compiled CSS: /assets/${cssFile}`);

  // Create temporary Vite server for SSR execution of real React components
  const vite = await createServer({
    root: CLIENT_DIR,
    server: { middlewareMode: true },
    appType: 'custom',
  });

  let appHtml = '';
  try {
    const { renderHome } = await vite.ssrLoadModule('/src/entry-server.tsx');
    const result = renderHome();
    appHtml = result.html;
    console.log(`  Rendered real component HTML: ${appHtml.length} characters`);
  } finally {
    await vite.close();
  }

  // Copy 3D monogram image assets to dist/assets
  const publicAssetsDir = path.join(CLIENT_DIR, 'public', 'assets');
  const distAssetsDir = path.join(DIST_DIR, 'assets');
  if (!fs.existsSync(distAssetsDir)) {
    fs.mkdirSync(distAssetsDir, { recursive: true });
  }
  if (fs.existsSync(path.join(publicAssetsDir, 'codex-3d-monogram.webp'))) {
    fs.copyFileSync(path.join(publicAssetsDir, 'codex-3d-monogram.webp'), path.join(distAssetsDir, 'codex-3d-monogram.webp'));
  }
  if (fs.existsSync(path.join(publicAssetsDir, 'codex-3d-monogram.png'))) {
    fs.copyFileSync(path.join(publicAssetsDir, 'codex-3d-monogram.png'), path.join(distAssetsDir, 'codex-3d-monogram.png'));
  }

  // Critical inlined CSS safety net (covering navbar, logo sizing, hero layout, buttons, unstyled links prevention)
  const criticalCss = `
    /* Critical Layout Preservation & Sizing Safety Net */
    :root {
      --announcement-h: 37px;
      --navbar-h: 80px;
      --hero-pt-desktop: 112px;
      --hero-pt-mobile: 64px;
    }
    aside[aria-label="Announcement"] {
      height: var(--announcement-h) !important;
      min-height: var(--announcement-h) !important;
      max-height: var(--announcement-h) !important;
      box-sizing: border-box !important;
    }
    header {
      height: var(--navbar-h) !important;
      min-height: var(--navbar-h) !important;
      box-sizing: border-box !important;
    }
    .hero-section {
      padding-top: var(--hero-pt-mobile) !important;
    }
    @media (min-width: 1024px) {
      .hero-section {
        padding-top: var(--hero-pt-desktop) !important;
      }
    }
    header img[alt*="Codex Tech-IT"] {
      width: auto !important;
      height: 48px !important;
      max-width: 200px !important;
      object-fit: contain !important;
      display: block !important;
    }
    [data-hero-scene="codex-stage"] img {
      width: 100% !important;
      height: 100% !important;
      max-width: 548px !important;
      max-height: 550px !important;
      object-fit: contain !important;
      display: block !important;
    }
    a {
      text-decoration: none !important;
      color: inherit;
    }
    header a {
      color: #0B1B2E !important;
      text-decoration: none !important;
    }
    .text-display {
      font-size: clamp(2.75rem, 1.6rem + 5vw, 5.5rem);
      line-height: 1.15;
      letter-spacing: -0.03em;
      font-weight: 800;
      color: #0B1B2E;
    }
    .text-brand-gradient {
      background: linear-gradient(135deg, #F15A34 0%, #D14316 45%, #1F6AA5 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .text-body-lg {
      font-size: clamp(1.0625rem, 1rem + 0.4vw, 1.25rem);
      line-height: 1.7;
      font-weight: 400;
    }
    .max-w-xl {
      max-width: 36rem;
    }
    .hero-anim-para {
      max-width: 36rem;
      font-family: 'Inter', 'Inter Fallback', system-ui, -apple-system, sans-serif;
      font-size: clamp(1.0625rem, 1rem + 0.4vw, 1.25rem);
      line-height: 1.625;
      font-weight: 500;
      margin-bottom: 2rem;
    }
    .hero-anim-cta {
      margin-bottom: 2.5rem;
    }
    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #D14316;
      margin-bottom: 1rem;
    }

    /* Smooth Hero Entrance Keyframes */
    @keyframes heroTextRise {
      0% { opacity: 0; transform: translateY(14px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes heroCardRise {
      0% { opacity: 0; transform: translateY(9px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes heroLogoScale {
      0% { opacity: 0.1; transform: scale(0.96); }
      100% { opacity: 1; transform: scale(1); }
    }
    .hero-entrance-eyebrow {
      animation: heroTextRise 800ms cubic-bezier(0.22, 1, 0.36, 1) 0ms both;
    }
    .hero-anim-line-1 {
      animation: heroTextRise 800ms cubic-bezier(0.22, 1, 0.36, 1) 60ms both;
    }
    .hero-anim-line-2 {
      animation: heroTextRise 800ms cubic-bezier(0.22, 1, 0.36, 1) 120ms both;
    }
    .hero-entrance-para {
      animation: heroTextRise 850ms cubic-bezier(0.22, 1, 0.36, 1) 180ms both;
    }
    .hero-entrance-cta {
      animation: heroTextRise 850ms cubic-bezier(0.22, 1, 0.36, 1) 240ms both;
    }
    .hero-entrance-chips {
      animation: heroTextRise 850ms cubic-bezier(0.22, 1, 0.36, 1) 300ms both;
    }
    .hero-entrance-logo {
      animation: heroLogoScale 900ms cubic-bezier(0.22, 1, 0.36, 1) 50ms both;
    }
    .hero-card-inner-1 {
      animation: heroCardRise 800ms cubic-bezier(0.22, 1, 0.36, 1) 200ms both;
    }
    .hero-card-inner-2 {
      animation: heroCardRise 800ms cubic-bezier(0.22, 1, 0.36, 1) 260ms both;
    }
    .hero-card-inner-3 {
      animation: heroCardRise 800ms cubic-bezier(0.22, 1, 0.36, 1) 320ms both;
    }
    .hero-card-inner-4 {
      animation: heroCardRise 800ms cubic-bezier(0.22, 1, 0.36, 1) 380ms both;
    }
    .hero-entrance-eyebrow,
    .hero-anim-line-1,
    .hero-anim-line-2,
    .hero-entrance-para,
    .hero-entrance-cta,
    .hero-entrance-chips,
    .hero-entrance-logo,
    .hero-card-inner-1,
    .hero-card-inner-2,
    .hero-card-inner-3,
    .hero-card-inner-4 {
      animation-fill-mode: forwards;
    }
    @media (prefers-reduced-motion: reduce) {
      .hero-entrance-eyebrow,
      .hero-anim-line-1,
      .hero-anim-line-2,
      .hero-entrance-para,
      .hero-entrance-cta,
      .hero-entrance-chips,
      .hero-entrance-logo,
      .hero-card-inner-1,
      .hero-card-inner-2,
      .hero-card-inner-3,
      .hero-card-inner-4 {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
    }
  `;

  // Ensure render-blocking CSS link and preloads are at top of <head>
  const headInject = `
    <!-- Render-blocking Main CSS & Preload -->
    <link rel="preload" as="style" href="/assets/${cssFile}">
    <link rel="stylesheet" href="/assets/${cssFile}">
    <link rel="preload" as="image" href="/assets/codex-3d-monogram.webp" type="image/webp" fetchpriority="high">
    ${soraFont ? `<link rel="preload" as="font" type="font/woff2" href="/assets/${soraFont}" crossorigin>` : ''}
    ${interFont ? `<link rel="preload" as="font" type="font/woff2" href="/assets/${interFont}" crossorigin>` : ''}
    <style id="critical-theme-css">${criticalCss}</style>
  `;

  // Remove existing redundant link to index-*.css if present to avoid duplicate tags
  indexHtml = indexHtml.replace(new RegExp(`<link rel="stylesheet"[^>]*${cssFile}[^>]*>`, 'g'), '');
  indexHtml = indexHtml.replace(/<style id="critical-theme-css">[\s\S]*?<\/style>/g, '');
  indexHtml = indexHtml.replace(/<!-- Render-blocking Main CSS & Preload -->[\s\S]*?(?=<style id="critical-hero-css">|<meta name="theme-color")/g, '');

  // Inject head styles right after <meta name="theme-color" ...>
  indexHtml = indexHtml.replace(
    /(<meta name="theme-color"[^>]*>)/i,
    `$1\n${headInject}`
  );

  // Preserve clean base template with empty root for subsequent SSG routes
  const cleanTemplate = indexHtml.replace(
    /<div id="root">[\s\S]*?<\/div>/i,
    '<div id="root"></div>'
  );

  // Inject pre-rendered real component HTML into <div id="root">
  indexHtml = indexHtml.replace(
    /<div id="root">[\s\S]*?<\/div>/i,
    `<div id="root">${appHtml}</div>`
  );

  // ── BUILD CHECK: Verify No Leaked JSX Expressions or {' '} ──
  console.log('🔍 Auditing dist/index.html for leaked JSX expressions...');
  if (indexHtml.includes("{' '}") || indexHtml.includes("{ ' ' }")) {
    throw new Error('❌ BUILD FAILED: Found literal "{\' \'}" in generated HTML!');
  }
  if (indexHtml.includes("{'") || indexHtml.includes("{`")) {
    throw new Error('❌ BUILD FAILED: Found leaked JSX curly brace expression in generated HTML!');
  }
  if (!indexHtml.includes('We Deliver Jobs') || !indexHtml.includes('Faster.')) {
    throw new Error('❌ BUILD FAILED: Headline missing from pre-rendered HTML!');
  }

  fs.writeFileSync(INDEX_HTML_PATH, indexHtml, 'utf-8');
  console.log('✅ Real-component pre-rendering complete with 0 leaked JSX expressions and render-blocking CSS in <head>!\n');

  // ══════════════════════════════════════════════════════════════════════
  // BLOG PRE-RENDERING (SSG for /insights, /blog, and all /insights/:slug)
  // ══════════════════════════════════════════════════════════════════════
  console.log('🚀 Pre-rendering Blog Routes (/insights, /blog, and published articles)...');
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const [posts, categories] = await Promise.all([
      prisma.blogPost.findMany({
        where: { status: 'published' },
        include: {
          author: true,
          category: true,
          faqs: { orderBy: { sort_order: 'asc' } }
        }
      }),
      prisma.blogCategory.findMany()
    ]);

    // Base template from cleanTemplate (with root cleared for page injection)
    const baseTemplate = cleanTemplate;

    // 1. Pre-render /blog listing page
    const blogDir = path.join(DIST_DIR, 'blog');
    if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });

    const listingTitle = 'Blogs | Codex Tech-IT';
    const listingDesc = 'Practical insights, technical architectures, and career strategies authored by Codex Tech-IT’s senior advisors and enterprise recruitment leads.';
    const listingCanonical = 'https://codextechit.com/blog';

    const listingHtml = baseTemplate
      .replace(/<title>.*?<\/title>/i, `<title>${listingTitle}</title>`)
      .replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${listingDesc}" />`)
      .replace('</head>', `
        <link rel="canonical" href="${listingCanonical}" />
        <meta property="og:title" content="${listingTitle}" />
        <meta property="og:description" content="${listingDesc}" />
        <meta property="og:url" content="${listingCanonical}" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${listingTitle}" />
        <meta name="twitter:description" content="${listingDesc}" />
      </head>`)
      .replace(
        '<div id="root"></div>',
        `<div id="root">
          <main style="max-width:1200px;margin:40px auto;padding:0 24px;">
            <header style="margin-bottom:40px;">
              <h1 style="font-size:36px;font-weight:900;color:#0F172A;margin-bottom:12px;">Blogs</h1>
              <p style="font-size:18px;color:#475569;line-height:1.6;">${listingDesc}</p>
            </header>
            <section style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:32px;">
              ${posts.map(p => `
                <article style="border:1px solid #e2e8f0;border-radius:24px;overflow:hidden;background:#fff;padding:24px;display:flex;flex-direction:column;justify-content:space-between;">
                  <div>
                    <span style="font-size:11px;font-weight:700;color:#F25C2A;text-transform:uppercase;">${p.category.name}</span>
                    <h2 style="font-size:20px;font-weight:800;color:#0F172A;margin:8px 0 12px;line-height:1.3;">
                      <a href="/blog/${p.slug}" style="color:inherit;text-decoration:none;">${p.title}</a>
                    </h2>
                    <p style="font-size:14px;color:#64748b;line-height:1.6;margin-bottom:20px;">${p.excerpt}</p>
                  </div>
                  <div style="font-size:12px;color:#94a3b8;border-top:1px solid #f1f5f9;padding-top:16px;">
                    <span>By ${p.author.name} • ${p.reading_time_min} min read</span>
                  </div>
                </article>
              `).join('')}
            </section>
          </main>
        </div>`
      );

    fs.writeFileSync(path.join(blogDir, 'index.html'), listingHtml, 'utf-8');
    console.log(`  ✓ Pre-rendered /blog listing page`);

    // 2. Pre-render every published article into /blog/:slug
    for (const post of posts) {
      const postBlogSlugDir = path.join(blogDir, post.slug);
      if (!fs.existsSync(postBlogSlugDir)) fs.mkdirSync(postBlogSlugDir, { recursive: true });

      const title = post.seo_title || `${post.title} | Codex Tech-IT Blog`;
      const desc = post.seo_description || post.excerpt;
      const canonical = post.canonical_url || `https://codextechit.com/blog/${post.slug}`;
      const coverUrl = post.cover_image.startsWith('http') ? post.cover_image : `https://codextechit.com${post.cover_image}`;

      const jsonLdArticle = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: [coverUrl],
        datePublished: post.published_at ? new Date(post.published_at).toISOString() : new Date().toISOString(),
        dateModified: new Date(post.updated_at).toISOString(),
        author: {
          '@type': 'Person',
          name: post.author.name,
          jobTitle: post.author.role
        },
        publisher: {
          '@type': 'Organization',
          name: 'Codex Tech-IT',
          url: 'https://codextechit.com',
          logo: {
            '@type': 'ImageObject',
            url: 'https://codextechit.com/assets/logo.png'
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonical
        }
      };

      const jsonLdBreadcrumbs = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://codextechit.com/' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://codextechit.com/blog' },
          { '@type': 'ListItem', position: 3, name: post.title, item: canonical }
        ]
      };

      const jsonLdFaq = post.faqs.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqs.map(f => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer }
        }))
      } : null;

      const schemasHtml = `
  <script type="application/ld+json">${JSON.stringify(jsonLdArticle)}</script>
  <script type="application/ld+json">${JSON.stringify(jsonLdBreadcrumbs)}</script>
  ${jsonLdFaq ? `<script type="application/ld+json">${JSON.stringify(jsonLdFaq)}</script>` : ''}
      `;

      const detailHtml = baseTemplate
        .replace(/<title>.*?<\/title>/i, `<title>${title}</title>`)
        .replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${desc}" />`)
        .replace('</head>', `
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
        </head>`)
        .replace(
          '<div id="root"></div>',
          `<div id="root">
            <article class="blog-prerendered-content" style="max-width:760px;margin:40px auto;padding:0 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1e293b;line-height:1.75;">
              <nav aria-label="Breadcrumbs" style="font-size:13px;color:#64748b;margin-bottom:20px;">
                <a href="/" style="color:#64748b;text-decoration:none;">Home</a> / 
                <a href="/blog" style="color:#64748b;text-decoration:none;">Blog</a> / 
                <span style="color:#f25c2a;">${post.title}</span>
              </nav>
              <h1 style="font-size:36px;font-weight:900;color:#0F172A;line-height:1.2;margin-bottom:16px;">${post.title}</h1>
              <div class="meta" style="font-size:13px;color:#64748b;padding-bottom:16px;border-bottom:1px solid #e2e8f0;margin-bottom:24px;">
                <span>By <strong>${post.author.name}</strong> (${post.author.role})</span> • 
                <span>${post.reading_time_min} min read</span> • 
                <span>${new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div style="aspect-ratio:16/9;overflow:hidden;border-radius:24px;margin-bottom:32px;background:#0b1120;">
                <img src="${post.cover_image}" alt="${post.cover_alt}" width="1200" height="675" style="width:100%;height:100%;object-fit:cover;" />
              </div>
              <p style="font-size:18px;font-weight:500;color:#0f172a;background:#fff7ed;padding:20px;border-radius:16px;border:1px solid #ffedd5;margin-bottom:32px;">
                ${post.excerpt}
              </p>
              <div class="article-body" style="font-size:17px;">
                ${(() => {
                  let headingIndex = 0;
                  return post.content_html.replace(/<(h[23])(?:\s+id="([^"]*)")?([^>]*)>(.*?)<\/\1>/gi, (_full, tag, existingId, attrs, text) => {
                    const rawText = text.replace(/<[^>]*>/g, '').trim();
                    const id = existingId || `section-${headingIndex}-${rawText.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                    headingIndex++;
                    return `<${tag} id="${id}" ${attrs || ''}>${text}</${tag}>`;
                  });
                })()}
              </div>
              ${post.faqs.length > 0 ? `
              <section style="margin-top:48px;padding-top:32px;border-top:1px solid #e2e8f0;">
                <h2 style="font-size:24px;font-weight:800;color:#0F172A;margin-bottom:20px;">Frequently Asked Questions</h2>
                ${post.faqs.map(f => `
                  <div style="background:#f8fafc;padding:16px 20px;border-radius:16px;border:1px solid #e2e8f0;margin-bottom:12px;">
                    <h3 style="font-size:16px;font-weight:700;color:#0F172A;margin-bottom:8px;">${f.question}</h3>
                    <p style="font-size:14px;color:#475569;line-height:1.6;margin:0;">${f.answer}</p>
                  </div>
                `).join('')}
              </section>
              ` : ''}
            </article>
          </div>`
        );

      fs.writeFileSync(path.join(postBlogSlugDir, 'index.html'), detailHtml, 'utf-8');
    }
    console.log(`  ✓ Pre-rendered ${posts.length} published blog articles with /blog/... canonicals, Open Graph, and JSON-LD!`);

    await prisma.$disconnect();
  } catch (err) {
    console.warn('  ⚠️ Note: Blog pre-rendering warning:', err.message);
  }
}

prerender().catch((err) => {
  console.error(err);
  process.exit(1);
});
