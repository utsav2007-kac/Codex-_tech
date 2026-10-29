import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { prisma } from '../services/db';
import { BlogStatus } from '@prisma/client';
import { blogPostInputSchema, blogQuerySchema } from '@codex/shared';
import jwt from 'jsonwebtoken';
import { config } from '../config';

// ══════════════════════════════════════════════════════════════════════
// IN-MEMORY RESPONSE CACHE & VIEW RATE LIMITER
// ══════════════════════════════════════════════════════════════════════
interface CacheEntry {
  data: any;
  timestamp: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

function getCached(key: string): any | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

export function clearBlogCache() {
  cache.clear();
}

// Session View Deduplicator: Map<"ip:slug", expireTimestamp>
const viewThrottle = new Map<string, number>();
const VIEW_THROTTLE_TTL_MS = 60 * 60 * 1000; // 1 hour per IP/session

function shouldCountView(ip: string, slug: string): boolean {
  const key = `${ip}:${slug}`;
  const now = Date.now();
  const expire = viewThrottle.get(key);
  if (expire && expire > now) {
    return false;
  }
  viewThrottle.set(key, now + VIEW_THROTTLE_TTL_MS);
  return true;
}

// HTML Sanitizer Configuration
const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
    'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
    'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'span', 'img'
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel', 'class'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'class'],
    div: ['class', 'id'],
    span: ['class', 'id'],
    table: ['class'],
    th: ['class', 'scope'],
    td: ['class'],
    tr: ['class'],
    pre: ['class'],
    code: ['class'],
    blockquote: ['class'],
    h1: ['class', 'id'],
    h2: ['class', 'id'],
    h3: ['class', 'id'],
    h4: ['class', 'id'],
    h5: ['class', 'id'],
    h6: ['class', 'id'],
    p: ['class'],
    ul: ['class'],
    ol: ['class']
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowProtocolRelative: false
};

function calculateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.ceil(words / 200));
}

export const blogController = {
  // ────────────────────────────────────────────────────────────────────
  // PUBLIC ENDPOINTS
  // ────────────────────────────────────────────────────────────────────

  // GET /api/blog/posts
  getPosts: async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    try {
      const parsed = blogQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({ success: false, error: parsed.error.format() });
      }

      const { page, limit, category, tag, q, sort } = parsed.data;
      const cacheKey = `posts:${page}:${limit}:${category || ''}:${tag || ''}:${q || ''}:${sort}`;
      const cached = getCached(cacheKey);
      if (cached) {
        return res.json({
          ...cached,
          durationMs: Date.now() - startTime,
          cached: true
        });
      }

      // Build Prisma Where Clause
      const where: any = {
        status: BlogStatus.published,
      };

      if (category && category.toLowerCase() !== 'all') {
        where.category = {
          slug: category.toLowerCase()
        };
      }

      if (tag && tag.toLowerCase() !== 'all') {
        where.tags = {
          some: {
            tag: {
              slug: tag.toLowerCase()
            }
          }
        };
      }

      if (q && q.trim()) {
        const queryTerm = q.trim();
        where.OR = [
          { title: { contains: queryTerm } },
          { excerpt: { contains: queryTerm } },
          { content_html: { contains: queryTerm } }
        ];
      }

      const orderBy: any =
        sort === 'most-read'
          ? [{ view_count: 'desc' }, { published_at: 'desc' }]
          : [{ published_at: 'desc' }, { id: 'desc' }];

      const [total, posts] = await Promise.all([
        prisma.blogPost.count({ where }),
        prisma.blogPost.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy,
          include: {
            category: { select: { id: true, slug: true, name: true } },
            author: { select: { id: true, name: true, role: true, avatar: true } },
            tags: {
              include: {
                tag: { select: { id: true, slug: true, name: true } }
              }
            }
          }
        })
      ]);

      const formatted = posts.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        cover_image: p.cover_image,
        cover_alt: p.cover_alt,
        reading_time_min: p.reading_time_min,
        view_count: p.view_count,
        featured: p.featured,
        published_at: p.published_at,
        category: p.category.name,
        category_slug: p.category.slug,
        author_name: p.author.name,
        author_role: p.author.role,
        author_avatar: p.author.avatar,
        tags: p.tags.map((t) => t.tag.name),
        tag_slugs: p.tags.map((t) => t.tag.slug),
        seo_title: p.seo_title,
        seo_description: p.seo_description
      }));

      const totalPages = Math.ceil(total / limit) || 1;
      const responsePayload = {
        success: true,
        data: {
          items: formatted,
          total,
          page,
          limit,
          totalPages
        }
      };

      setCached(cacheKey, responsePayload);

      return res.json({
        ...responsePayload,
        durationMs: Date.now() - startTime,
        cached: false
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/blog/posts/:slug
  getPostBySlug: async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    try {
      const { slug } = req.params;
      const isPreview = req.query.preview === 'true';

      // Check if admin is requesting preview
      let isAdmin = false;
      const token = req.cookies?.codex_admin_token || req.headers.authorization?.replace('Bearer ', '');
      if (token) {
        try {
          jwt.verify(token, config.jwtSecret);
          isAdmin = true;
        } catch {
          isAdmin = false;
        }
      }

      const cacheKey = `post:${slug}:${isAdmin && isPreview ? 'admin' : 'public'}`;
      if (!isPreview) {
        const cached = getCached(cacheKey);
        if (cached) {
          return res.json({
            ...cached,
            durationMs: Date.now() - startTime,
            cached: true
          });
        }
      }

      const post = await prisma.blogPost.findUnique({
        where: { slug },
        include: {
          category: { select: { id: true, slug: true, name: true, description: true } },
          author: { select: { id: true, name: true, role: true, avatar: true, bio: true } },
          tags: {
            include: {
              tag: { select: { id: true, slug: true, name: true } }
            }
          },
          faqs: {
            orderBy: { sort_order: 'asc' }
          }
        }
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Article not found' }
        });
      }

      // If not published and not authorized admin preview, return 404
      if (post.status !== BlogStatus.published && !(isAdmin && isPreview)) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Article is not published' }
        });
      }

      // Find Previous & Next Published Posts
      const [prevPost, nextPost, relatedPosts] = await Promise.all([
        prisma.blogPost.findFirst({
          where: {
            status: BlogStatus.published,
            published_at: { lt: post.published_at || new Date() }
          },
          orderBy: { published_at: 'desc' },
          select: { slug: true, title: true, cover_image: true, category: { select: { name: true } } }
        }),
        prisma.blogPost.findFirst({
          where: {
            status: BlogStatus.published,
            published_at: { gt: post.published_at || new Date() }
          },
          orderBy: { published_at: 'asc' },
          select: { slug: true, title: true, cover_image: true, category: { select: { name: true } } }
        }),
        prisma.blogPost.findMany({
          where: {
            status: BlogStatus.published,
            id: { not: post.id },
            category_id: post.category_id
          },
          take: 3,
          orderBy: { published_at: 'desc' },
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            cover_image: true,
            cover_alt: true,
            reading_time_min: true,
            published_at: true,
            category: { select: { name: true, slug: true } },
            author: { select: { name: true, role: true } }
          }
        })
      ]);

      const formatted = {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content_html: post.content_html,
        cover_image: post.cover_image,
        cover_alt: post.cover_alt,
        reading_time_min: post.reading_time_min,
        view_count: post.view_count,
        featured: post.featured,
        status: post.status,
        published_at: post.published_at,
        updated_at: post.updated_at,
        category: post.category,
        author: post.author,
        tags: post.tags.map((t) => t.tag),
        faqs: post.faqs,
        prev: prevPost
          ? { slug: prevPost.slug, title: prevPost.title, cover_image: prevPost.cover_image, category: prevPost.category.name }
          : null,
        next: nextPost
          ? { slug: nextPost.slug, title: nextPost.title, cover_image: nextPost.cover_image, category: nextPost.category.name }
          : null,
        related: relatedPosts.map((r) => ({
          slug: r.slug,
          title: r.title,
          excerpt: r.excerpt,
          cover_image: r.cover_image,
          cover_alt: r.cover_alt,
          reading_time_min: r.reading_time_min,
          published_at: r.published_at,
          category: r.category.name,
          category_slug: r.category.slug,
          author_name: r.author.name
        })),
        seo_title: post.seo_title || `${post.title} | Codex Tech-IT Insights`,
        seo_description: post.seo_description || post.excerpt,
        canonical_url: post.canonical_url || `https://codextechit.com/insights/${post.slug}`,
        og_image: post.og_image || post.cover_image
      };

      const responsePayload = {
        success: true,
        data: formatted
      };

      if (!isPreview) {
        setCached(cacheKey, responsePayload);
      }

      return res.json({
        ...responsePayload,
        durationMs: Date.now() - startTime,
        cached: false
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/blog/categories
  getCategories: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const cacheKey = 'blog:categories';
      const cached = getCached(cacheKey);
      if (cached) return res.json(cached);

      const categories = await prisma.blogCategory.findMany({
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: { posts: { where: { status: BlogStatus.published } } }
          }
        }
      });

      const data = categories.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        description: c.description,
        postCount: c._count.posts
      }));

      const payload = { success: true, data };
      setCached(cacheKey, payload);
      return res.json(payload);
    } catch (err) {
      next(err);
    }
  },

  // GET /api/blog/featured
  getFeatured: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const cacheKey = 'blog:featured';
      const cached = getCached(cacheKey);
      if (cached) return res.json(cached);

      let featured = await prisma.blogPost.findMany({
        where: {
          status: BlogStatus.published,
          featured: 1
        },
        take: 3,
        orderBy: { published_at: 'desc' },
        include: {
          category: { select: { name: true, slug: true } },
          author: { select: { name: true, role: true, avatar: true } }
        }
      });

      if (featured.length === 0) {
        featured = await prisma.blogPost.findMany({
          where: { status: BlogStatus.published },
          take: 3,
          orderBy: { published_at: 'desc' },
          include: {
            category: { select: { name: true, slug: true } },
            author: { select: { name: true, role: true, avatar: true } }
          }
        });
      }

      const data = featured.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        cover_image: p.cover_image,
        cover_alt: p.cover_alt,
        reading_time_min: p.reading_time_min,
        published_at: p.published_at,
        category: p.category.name,
        category_slug: p.category.slug,
        author_name: p.author.name,
        author_role: p.author.role,
        author_avatar: p.author.avatar
      }));

      const payload = { success: true, data };
      setCached(cacheKey, payload);
      return res.json(payload);
    } catch (err) {
      next(err);
    }
  },

  // POST /api/blog/posts/:slug/view
  recordPostView: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

      const post = await prisma.blogPost.findUnique({
        where: { slug },
        select: { id: true, view_count: true }
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Article not found' }
        });
      }

      if (!shouldCountView(clientIp, slug)) {
        return res.json({
          success: true,
          view_count: post.view_count,
          incremented: false
        });
      }

      const updated = await prisma.blogPost.update({
        where: { slug },
        data: { view_count: { increment: 1 } },
        select: { view_count: true }
      });

      return res.json({
        success: true,
        view_count: updated.view_count,
        incremented: true
      });
    } catch (err) {
      next(err);
    }
  },

  // ────────────────────────────────────────────────────────────────────
  // ADMIN CRUD & MANAGEMENT
  // ────────────────────────────────────────────────────────────────────

  // GET /api/admin/blog/posts
  adminGetPosts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.max(1, Math.min(50, parseInt(req.query.limit as string) || 10));
      const status = req.query.status as string;
      const q = req.query.q as string;

      const where: any = {};
      if (status && ['draft', 'published', 'scheduled'].includes(status)) {
        where.status = status as BlogStatus;
      }

      if (q && q.trim()) {
        const queryTerm = q.trim();
        where.OR = [
          { title: { contains: queryTerm } },
          { slug: { contains: queryTerm } },
          { excerpt: { contains: queryTerm } }
        ];
      }

      const [total, items] = await Promise.all([
        prisma.blogPost.count({ where }),
        prisma.blogPost.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { updated_at: 'desc' },
          include: {
            category: { select: { id: true, name: true, slug: true } },
            author: { select: { id: true, name: true } },
            _count: { select: { faqs: true, tags: true } }
          }
        })
      ]);

      return res.json({
        success: true,
        data: {
          items,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/admin/blog/posts/:id
  adminGetPost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, error: 'Invalid post ID' });
      }

      const post = await prisma.blogPost.findUnique({
        where: { id },
        include: {
          category: true,
          author: true,
          tags: { include: { tag: true } },
          faqs: { orderBy: { sort_order: 'asc' } }
        }
      });

      if (!post) {
        return res.status(404).json({ success: false, error: 'Post not found' });
      }

      return res.json({
        success: true,
        data: {
          ...post,
          tag_ids: post.tags.map((t) => t.tag_id)
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/admin/blog/posts
  adminCreatePost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = blogPostInputSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, error: parsed.error.format() });
      }

      const data = parsed.data;

      // Check slug uniqueness
      const existingSlug = await prisma.blogPost.findUnique({
        where: { slug: data.slug }
      });
      if (existingSlug) {
        return res.status(400).json({
          success: false,
          error: { slug: { _errors: ['Slug is already in use by another article'] } }
        });
      }

      // Sanitize Content HTML
      const cleanHtml = sanitizeHtml(data.content_html, sanitizeOptions);
      const readingTime = calculateReadingTime(cleanHtml);

      const post = await prisma.blogPost.create({
        data: {
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt,
          content_html: cleanHtml,
          category_id: data.category_id || 1,
          author_id: data.author_id || 1,
          cover_image: data.cover_image,
          cover_alt: data.cover_alt,
          status: (data.status?.toLowerCase() || 'draft') as BlogStatus,
          published_at: data.status?.toLowerCase() === 'published' ? (data.published_at ? new Date(data.published_at) : new Date()) : null,
          reading_time_min: readingTime,
          featured: data.featured ? 1 : 0,
          seo_title: data.seo_title,
          seo_description: data.seo_description,
          canonical_url: data.canonical_url,
          og_image: data.og_image,
          tags: {
            create: (data.tag_ids || []).map((tagId: number) => ({
              tag: { connect: { id: tagId } }
            }))
          },
          faqs: {
            create: (data.faqs || []).map((faq: any, idx: number) => ({
              question: faq.question,
              answer: faq.answer,
              sort_order: faq.sort_order || idx + 1
            }))
          }
        },
        include: {
          category: true,
          author: true,
          tags: { include: { tag: true } },
          faqs: true
        }
      });

      clearBlogCache();
      return res.status(201).json({ success: true, data: post });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/admin/blog/posts/:id
  adminUpdatePost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, error: 'Invalid post ID' });
      }

      const parsed = blogPostInputSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, error: parsed.error.format() });
      }

      const data = parsed.data;

      // Check slug uniqueness with other posts
      const conflict = await prisma.blogPost.findFirst({
        where: {
          slug: data.slug,
          id: { not: id }
        }
      });
      if (conflict) {
        return res.status(400).json({
          success: false,
          error: { slug: { _errors: ['Slug is already in use by another article'] } }
        });
      }

      // Sanitize Content HTML
      const cleanHtml = sanitizeHtml(data.content_html, sanitizeOptions);
      const readingTime = calculateReadingTime(cleanHtml);

      // Delete existing relations to recreate
      await prisma.blogPostTag.deleteMany({ where: { post_id: id } });
      await prisma.blogFaq.deleteMany({ where: { post_id: id } });

      const updated = await prisma.blogPost.update({
        where: { id },
        data: {
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt,
          content_html: cleanHtml,
          category_id: data.category_id || undefined,
          author_id: data.author_id || undefined,
          cover_image: data.cover_image,
          cover_alt: data.cover_alt,
          status: data.status ? (data.status.toLowerCase() as BlogStatus) : undefined,
          published_at: data.status?.toLowerCase() === 'published' ? (data.published_at ? new Date(data.published_at) : new Date()) : null,
          reading_time_min: readingTime,
          featured: data.featured !== undefined ? (data.featured ? 1 : 0) : undefined,
          seo_title: data.seo_title,
          seo_description: data.seo_description,
          canonical_url: data.canonical_url,
          og_image: data.og_image,
          tags: {
            create: (data.tag_ids || []).map((tagId: number) => ({
              tag: { connect: { id: tagId } }
            }))
          },
          faqs: {
            create: (data.faqs || []).map((faq: any, idx: number) => ({
              question: faq.question,
              answer: faq.answer,
              sort_order: faq.sort_order || idx + 1
            }))
          }
        },
        include: {
          category: true,
          author: true,
          tags: { include: { tag: true } },
          faqs: true
        }
      });

      clearBlogCache();
      return res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/admin/blog/posts/:id
  adminDeletePost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, error: 'Invalid post ID' });
      }

      await prisma.blogPost.delete({ where: { id } });
      clearBlogCache();
      return res.json({ success: true, message: 'Article deleted successfully' });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/admin/blog/posts/:id/status
  adminUpdateStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      if (!['draft', 'published', 'scheduled'].includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid status value' });
      }

      const updated = await prisma.blogPost.update({
        where: { id },
        data: {
          status: status as BlogStatus,
          published_at: status === 'published' ? new Date() : undefined
        }
      });

      clearBlogCache();
      return res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/admin/blog/upload-image
  adminUploadImage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No image file uploaded' });
      }

      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
      if (!allowedMimes.includes(req.file.mimetype)) {
        return res.status(400).json({
          success: false,
          error: 'Only JPEG, PNG, WebP, or SVG images are accepted'
        });
      }

      const uploadsDir = path.resolve(__dirname, '../../uploads/blog');
      const publicBlogDir = path.resolve(__dirname, '../../../client/public/assets/blog');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
      if (!fs.existsSync(publicBlogDir)) fs.mkdirSync(publicBlogDir, { recursive: true });

      const filename = `blog-upload-${Date.now()}.webp`;
      const outPathPublic = path.join(publicBlogDir, filename);
      const outPathUploads = path.join(uploadsDir, filename);

      // Convert to WebP using sharp with high quality and 16:9 bounds
      await sharp(req.file.buffer)
        .resize(1200, 675, { fit: 'cover' })
        .webp({ quality: 88 })
        .toFile(outPathPublic);

      // Also copy to uploads for redundancy
      fs.copyFileSync(outPathPublic, outPathUploads);

      return res.json({
        success: true,
        data: {
          url: `/assets/blog/${filename}`,
          filename
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/admin/blog/meta (Authors, Categories, Tags for Editor Dropdowns)
  adminGetMeta: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const [authors, categories, tags] = await Promise.all([
        prisma.blogAuthor.findMany({ orderBy: { name: 'asc' } }),
        prisma.blogCategory.findMany({ orderBy: { name: 'asc' } }),
        prisma.blogTag.findMany({ orderBy: { name: 'asc' } })
      ]);

      return res.json({
        success: true,
        data: { authors, categories, tags }
      });
    } catch (err) {
      next(err);
    }
  }
};
