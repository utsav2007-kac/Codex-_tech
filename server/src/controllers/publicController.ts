import { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/db';

let lastHealthCheck = 0;
let cachedHealthData: any = null;

export const publicController = {
  // Health check with 5s in-memory TTL caching to prevent database connection spikes
  async health(req: Request, res: Response, next: NextFunction) {
    const now = Date.now();
    if (cachedHealthData && now - lastHealthCheck < 5000) {
      return res.json({
        success: true,
        data: {
          ...cachedHealthData,
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
          cached: true,
        },
      });
    }

    try {
      const dbCheck = await prisma.$queryRaw`SELECT 1 as is_alive`;
      cachedHealthData = {
        status: 'ok',
        database: 'connected',
        dbCheck,
      };
      lastHealthCheck = now;

      res.json({
        success: true,
        data: {
          ...cachedHealthData,
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
          cached: false,
        },
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'DATABASE_DISCONNECTED',
          message: err.message,
        },
      });
    }
  },

  // Posts / Insights
  async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 9));
      const category = (req.query.category as string) || undefined;
      const search = (req.query.search as string) || undefined;
      const skip = (page - 1) * limit;

      const where: any = { is_published: true };
      if (category && category !== 'all') {
        where.category = category;
      }
      if (search) {
        where.OR = [
          { title: { contains: search } },
          { excerpt: { contains: search } },
          { content: { contains: search } },
        ];
      }

      const [total, posts] = await Promise.all([
        prisma.post.count({ where }),
        prisma.post.findMany({
          where,
          skip,
          take: limit,
          orderBy: { published_at: 'desc' },
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            category: true,
            author_name: true,
            author_role: true,
            cover_alt: true,
            read_minutes: true,
            published_at: true,
          },
        }),
      ]);

      res.json({
        success: true,
        data: {
          items: posts,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async getPostBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const post = await prisma.post.findUnique({
        where: { slug },
      });

      if (!post || !post.is_published) {
        // Fallback: Check if this article exists in the blog system
        const blogPost = await prisma.blogPost.findUnique({
          where: { slug },
          include: {
            author: true,
            category: true,
          },
        });

        if (blogPost && blogPost.status === 'published') {
          return res.json({
            success: true,
            redirect: `/blog/${slug}`,
            data: {
              ...blogPost,
              author_name: blogPost.author?.name || 'Codex Editorial',
              author_role: blogPost.author?.role || 'Staff Advisor',
              category: blogPost.category?.name || 'Career Strategy',
              content: blogPost.content_html,
              read_minutes: blogPost.reading_time_min || 5,
            },
          });
        }

        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Article not found' },
        });
      }

      // Related posts
      const related = await prisma.post.findMany({
        where: {
          is_published: true,
          category: post.category,
          slug: { not: slug },
        },
        take: 3,
        select: {
          slug: true,
          title: true,
          excerpt: true,
          read_minutes: true,
          published_at: true,
        },
      });

      res.json({ success: true, data: { ...post, related } });
    } catch (err) {
      next(err);
    }
  },

  // Job Openings
  async getJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const jobs = await prisma.jobOpening.findMany({
        where: { is_active: true },
        orderBy: { created_at: 'desc' },
      });
      res.json({ success: true, data: jobs });
    } catch (err) {
      next(err);
    }
  },

  async getJobBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const job = await prisma.jobOpening.findUnique({
        where: { slug },
      });

      if (!job || !job.is_active) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Job opening not found' },
        });
      }

      res.json({ success: true, data: job });
    } catch (err) {
      next(err);
    }
  },

  // Courses
  async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await prisma.course.findMany({
        where: { is_active: true },
        orderBy: { created_at: 'asc' },
      });
      res.json({ success: true, data: courses });
    } catch (err) {
      next(err);
    }
  },

  async getCourseBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const course = await prisma.course.findUnique({
        where: { slug },
      });

      if (!course || !course.is_active) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Course not found' },
        });
      }

      res.json({ success: true, data: course });
    } catch (err) {
      next(err);
    }
  },

  // Success Stories
  async getStories(req: Request, res: Response, next: NextFunction) {
    try {
      const stories = await prisma.successStory.findMany({
        where: { is_published: true },
        orderBy: { created_at: 'desc' },
      });
      res.json({ success: true, data: stories });
    } catch (err) {
      next(err);
    }
  },

  async getStoryBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const story = await prisma.successStory.findUnique({
        where: { slug },
      });

      if (!story || !story.is_published) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Case study not found' },
        });
      }

      res.json({ success: true, data: story });
    } catch (err) {
      next(err);
    }
  },

  // Live Placements Feed
  async getLivePlacements(req: Request, res: Response, next: NextFunction) {
    try {
      const placements = await prisma.livePlacement.findMany({
        where: { is_published: true },
        orderBy: { created_at: 'desc' },
        take: 20,
      });
      res.json({ success: true, data: placements });
    } catch (err) {
      next(err);
    }
  },

  // FAQs
  async getFaqs(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as string;
      const where: any = { is_published: true };
      if (category && category !== 'all') {
        where.category = category;
      }

      const faqs = await prisma.faq.findMany({
        where,
        orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
      });
      res.json({ success: true, data: faqs });
    } catch (err) {
      next(err);
    }
  },

  // Testimonials
  async getTestimonials(req: Request, res: Response, next: NextFunction) {
    try {
      const testimonials = await prisma.testimonial.findMany({
        where: { is_published: true },
      });
      res.json({ success: true, data: testimonials });
    } catch (err) {
      next(err);
    }
  },

  // Webinars
  async getWebinars(req: Request, res: Response, next: NextFunction) {
    try {
      const webinars = await prisma.webinar.findMany({
        orderBy: { starts_at: 'asc' },
      });
      res.json({ success: true, data: webinars });
    } catch (err) {
      next(err);
    }
  },

  // Interview Questions Bank
  async getInterviewQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const role_track = req.query.role_track as string;
      const level = req.query.level as string;
      const search = req.query.search as string;

      const where: any = {};
      if (role_track && role_track !== 'all') where.role_track = role_track;
      if (level && level !== 'all') where.level = level;
      if (search) {
        where.OR = [
          { question: { contains: search } },
          { answer: { contains: search } },
        ];
      }

      const questions = await prisma.interviewQuestion.findMany({
        where,
        orderBy: [{ role_track: 'asc' }, { sort_order: 'asc' }],
      });
      res.json({ success: true, data: questions });
    } catch (err) {
      next(err);
    }
  },

  // Public Site Settings
  async getPublicSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await prisma.siteSetting.findMany();
      const mapped: Record<string, any> = {};
      settings.forEach((s) => {
        mapped[s.key] = s.value;
      });
      res.json({ success: true, data: mapped });
    } catch (err) {
      next(err);
    }
  },

  // Rule-based Chat FAQ answer
  async getChatAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const query = ((req.query.q as string) || '').trim().toLowerCase();
      if (!query) {
        return res.json({
          success: true,
          data: {
            answer: 'Hello! I can answer questions about our IT training, job placement timeline, visa support, or employer staffing models. How can I help you today?',
          },
        });
      }

      const faqs = await prisma.chatFaq.findMany();
      const matched = faqs.find((f) => {
        const words = f.keywords.toLowerCase().split(',');
        return words.some((w) => query.includes(w.trim()));
      });

      if (matched) {
        return res.json({ success: true, data: { answer: matched.answer } });
      }

      return res.json({
        success: true,
        data: {
          answer: "I couldn't find an exact match for your question. Would you like to speak with our career advisory team directly? You can book a free consultation or message us on WhatsApp!",
          fallback: true,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
