import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../services/db';
import { config } from '../config';
import { storageService } from '../middleware/upload';
import { adminLoginSchema } from '@codex/shared';
import { AuthRequest } from '../middleware/auth';

export const adminController = {
  // Login
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = adminLoginSchema.parse(req.body);

      const user = await prisma.adminUser.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
        });
      }

      const isValid = await bcrypt.compare(data.password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        config.jwtSecret,
        { expiresIn: '7d' }
      );

      res.cookie('codex_admin_token', token, {
        httpOnly: true,
        secure: config.env === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        data: {
          user: { id: user.id, email: user.email, name: user.name, role: user.role },
          token,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  // Logout
  async logout(req: Request, res: Response) {
    res.clearCookie('codex_admin_token');
    res.json({ success: true, data: { message: 'Logged out successfully' } });
  },

  // Me
  async getMe(req: AuthRequest, res: Response) {
    res.json({ success: true, data: req.user });
  },

  // Stats / Dashboard KPI summary
  async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const [
        totalLeads,
        newLeads,
        totalContacts,
        totalEmployerRequests,
        totalApplications,
        totalSubscribers,
        totalEnrollments,
        totalStories,
        totalLivePlacements,
        totalReferrals,
      ] = await Promise.all([
        prisma.lead.count(),
        prisma.lead.count({ where: { status: 'NEW' } }),
        prisma.contact.count(),
        prisma.employerRequest.count(),
        prisma.application.count(),
        prisma.subscriber.count({ where: { is_active: true } }),
        prisma.enrollment.count(),
        prisma.successStory.count(),
        prisma.livePlacement.count(),
        prisma.referral.count(),
      ]);

      const recentLeads = await prisma.lead.findMany({
        take: 6,
        orderBy: { created_at: 'desc' },
      });

      const recentApplications = await prisma.application.findMany({
        take: 6,
        orderBy: { created_at: 'desc' },
        include: { job: { select: { title: true } } },
      });

      res.json({
        success: true,
        data: {
          kpi: {
            totalLeads,
            newLeads,
            totalContacts,
            totalEmployerRequests,
            totalApplications,
            totalSubscribers,
            totalEnrollments,
            totalStories,
            totalLivePlacements,
            totalReferrals,
          },
          leads: totalLeads,
          new_leads: newLeads,
          contacts: totalContacts,
          employer_requests: totalEmployerRequests,
          applications: totalApplications,
          subscribers: totalSubscribers,
          enrollments: totalEnrollments,
          stories: totalStories,
          live_placements: totalLivePlacements,
          referrals: totalReferrals,
          recentLeads,
          recentApplications,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  // Submissions generic handlers
  async getSubmissions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { type } = req.params;
      const status = req.query.status as string;
      const search = req.query.search as string;

      let items: any[] = [];
      const where: any = {};
      if (status && status !== 'all') where.status = status;

      switch (type) {
        case 'leads':
          if (search) where.OR = [{ name: { contains: search } }, { email: { contains: search } }];
          items = await prisma.lead.findMany({ where, orderBy: { created_at: 'desc' } });
          break;
        case 'contacts':
          if (search) where.OR = [{ name: { contains: search } }, { email: { contains: search } }];
          items = await prisma.contact.findMany({ where, orderBy: { created_at: 'desc' } });
          break;
        case 'employer-requests':
          if (search) where.OR = [{ company: { contains: search } }, { email: { contains: search } }];
          items = await prisma.employerRequest.findMany({ where, orderBy: { created_at: 'desc' } });
          break;
        case 'applications':
          if (search) where.OR = [{ name: { contains: search } }, { email: { contains: search } }];
          items = await prisma.application.findMany({
            where,
            orderBy: { created_at: 'desc' },
            include: { job: { select: { title: true } } },
          });
          break;
        case 'referrals':
          if (search) where.OR = [{ referee_name: { contains: search } }, { referee_email: { contains: search } }];
          items = await prisma.referral.findMany({ where, orderBy: { created_at: 'desc' } });
          break;
        case 'subscribers':
          items = await prisma.subscriber.findMany({ orderBy: { created_at: 'desc' } });
          break;
        case 'enrollments':
          items = await prisma.enrollment.findMany({
            orderBy: { created_at: 'desc' },
            include: { course: { select: { title: true } } },
          });
          break;
        case 'downloads':
          items = await prisma.download.findMany({ orderBy: { created_at: 'desc' } });
          break;
        case 'tool-reports':
          items = await prisma.toolReport.findMany({ orderBy: { created_at: 'desc' } });
          break;
        default:
          return res.status(400).json({ success: false, error: { code: 'INVALID_TYPE', message: 'Unknown submission type' } });
      }

      res.json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  },

  // Update submission status
  async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { type, id } = req.params;
      const parsedId = parseInt(id, 10);
      const { status } = req.body;

      let updated;
      switch (type) {
        case 'leads':
          updated = await prisma.lead.update({ where: { id: parsedId }, data: { status } });
          break;
        case 'contacts':
          updated = await prisma.contact.update({ where: { id: parsedId }, data: { status } });
          break;
        case 'employer-requests':
          updated = await prisma.employerRequest.update({ where: { id: parsedId }, data: { status } });
          break;
        case 'applications':
          updated = await prisma.application.update({ where: { id: parsedId }, data: { status } });
          break;
        case 'referrals':
          updated = await prisma.referral.update({ where: { id: parsedId }, data: { status } });
          break;
        case 'enrollments':
          updated = await prisma.enrollment.update({ where: { id: parsedId }, data: { status } });
          break;
        case 'subscribers': {
          const isActive = status === 'ACTIVE' || status === 'true' || status === true;
          updated = await prisma.subscriber.update({
            where: { id: parsedId },
            data: { is_active: isActive },
          });
          break;
        }
        default:
          return res.status(400).json({ success: false, error: { code: 'INVALID_TYPE', message: 'Unsupported type' } });
      }

      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },

  // Delete submission
  async deleteSubmission(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { type, id } = req.params;
      const parsedId = parseInt(id, 10);

      switch (type) {
        case 'leads':
          await prisma.lead.delete({ where: { id: parsedId } });
          break;
        case 'contacts':
          await prisma.contact.delete({ where: { id: parsedId } });
          break;
        case 'employer-requests':
          await prisma.employerRequest.delete({ where: { id: parsedId } });
          break;
        case 'applications': {
          const app = await prisma.application.findUnique({ where: { id: parsedId } });
          if (app && app.resume_path) {
            storageService.deleteFile(app.resume_path);
          }
          await prisma.application.delete({ where: { id: parsedId } });
          break;
        }
        case 'referrals':
          await prisma.referral.delete({ where: { id: parsedId } });
          break;
        case 'subscribers':
          await prisma.subscriber.delete({ where: { id: parsedId } });
          break;
        case 'enrollments':
          await prisma.enrollment.delete({ where: { id: parsedId } });
          break;
        default:
          return res.status(400).json({ success: false, error: { code: 'INVALID_TYPE', message: 'Unsupported type' } });
      }

      res.json({ success: true, data: { message: 'Deleted successfully' } });
    } catch (err) {
      next(err);
    }
  },

  // Export CSV
  async exportCsv(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { type } = req.params;
      let rows: any[] = [];

      switch (type) {
        case 'leads':
          rows = await prisma.lead.findMany({ orderBy: { created_at: 'desc' } });
          break;
        case 'contacts':
          rows = await prisma.contact.findMany({ orderBy: { created_at: 'desc' } });
          break;
        case 'employer-requests':
          rows = await prisma.employerRequest.findMany({ orderBy: { created_at: 'desc' } });
          break;
        case 'applications':
          rows = await prisma.application.findMany({ orderBy: { created_at: 'desc' } });
          break;
        case 'referrals':
          rows = await prisma.referral.findMany({ orderBy: { created_at: 'desc' } });
          break;
        case 'subscribers':
          rows = await prisma.subscriber.findMany({ orderBy: { created_at: 'desc' } });
          break;
        case 'enrollments':
          rows = await prisma.enrollment.findMany({ orderBy: { created_at: 'desc' } });
          break;
        default:
          return res.status(400).send('Invalid export type');
      }

      if (rows.length === 0) {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${type}-export.csv"`);
        return res.send('No data');
      }

      const headers = Object.keys(rows[0]).join(',');
      const csvLines = rows.map((r) =>
        Object.values(r)
          .map((val) => `"${String(val ?? '').replace(/"/g, '""')}"`)
          .join(',')
      );
      const csvContent = [headers, ...csvLines].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${type}-export.csv"`);
      res.send(csvContent);
    } catch (err) {
      next(err);
    }
  },

  // Authorized Resume Download
  async downloadResume(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const app = await prisma.application.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!app) {
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Application not found' } });
      }

      const filePath = storageService.getFilePath(app.resume_path);
      if (!storageService.fileExists(app.resume_path)) {
        return res.status(404).json({ success: false, error: { code: 'FILE_MISSING', message: 'Resume file not found on server' } });
      }

      res.download(filePath, app.resume_original_name);
    } catch (err) {
      next(err);
    }
  },

  // Site Settings
  async getSettings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const settings = await prisma.siteSetting.findMany();
      const mapped: Record<string, any> = {};
      settings.forEach((s) => {
        mapped[s.key] = s.value;
      });

      const general = mapped['general'] || {};
      const stats = mapped['stats'] || {};
      const socials = mapped['socials'] || {};

      res.json({
        success: true,
        data: {
          ...general,
          site_name: general.site_name || 'Codex Tech-IT',
          tagline: general.tagline || 'We Deliver Jobs Faster',
          notify_email: general.notify_email || general.careers_email || 'admin@codextechit.com',
          primary_email: general.primary_email || 'contact@codextechit.com',
          phone_usa: general.primary_phone || '+1 (469) 555-0198',
          phone_india: general.phone_india || '+91 40 6789 0123',
          announcement: general.announcement || '',
          general,
          stats,
          socials,
          raw: settings,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async updateSettings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { key, value } = req.body;

      if (key && value !== undefined) {
        const updated = await prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
        return res.json({ success: true, data: updated });
      }

      // Handle general multi-field update payload
      const generalRow = await prisma.siteSetting.findUnique({ where: { key: 'general' } });
      const currentGeneral = (generalRow?.value as Record<string, any>) || {};

      const newGeneral = {
        ...currentGeneral,
        site_name: req.body.site_name ?? currentGeneral.site_name ?? 'Codex Tech-IT',
        tagline: req.body.tagline ?? currentGeneral.tagline ?? 'We Deliver Jobs Faster',
        primary_phone: req.body.phone_usa ?? currentGeneral.primary_phone ?? '+1 (469) 555-0198',
        phone_usa: req.body.phone_usa ?? currentGeneral.phone_usa ?? '+1 (469) 555-0198',
        phone_india: req.body.phone_india ?? currentGeneral.phone_india ?? '+91 40 6789 0123',
        notify_email: req.body.notify_email ?? currentGeneral.notify_email ?? 'admin@codextechit.com',
        primary_email: req.body.primary_email ?? currentGeneral.primary_email ?? 'contact@codextechit.com',
        careers_email: req.body.careers_email ?? req.body.notify_email ?? currentGeneral.careers_email,
        announcement: req.body.announcement ?? currentGeneral.announcement,
      };

      const updatedGeneral = await prisma.siteSetting.upsert({
        where: { key: 'general' },
        update: { value: newGeneral },
        create: { key: 'general', value: newGeneral },
      });

      // Update socials if provided
      if (req.body.socials) {
        await prisma.siteSetting.upsert({
          where: { key: 'socials' },
          update: { value: req.body.socials },
          create: { key: 'socials', value: req.body.socials },
        });
      }

      // Update stats if provided
      if (req.body.stats) {
        await prisma.siteSetting.upsert({
          where: { key: 'stats' },
          update: { value: req.body.stats },
          create: { key: 'stats', value: req.body.stats },
        });
      }

      return res.json({
        success: true,
        data: {
          ...newGeneral,
          general: updatedGeneral.value,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  // Create Content Item
  async createContentItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { model } = req.params;
      const data = req.body;
      let created;

      switch (model) {
        case 'jobs': {
          const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + `-${Date.now().toString().slice(-4)}`;
          created = await prisma.jobOpening.create({
            data: {
              slug,
              title: data.title,
              department: data.department || 'Engineering',
              location: data.location || 'Remote, US',
              type: data.type || 'Full-time',
              description: data.description || '',
              requirements: data.requirements || '',
              is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
            },
          });
          break;
        }
        case 'stories': {
          const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + `-${Date.now().toString().slice(-4)}`;
          created = await prisma.successStory.create({
            data: {
              slug,
              name: data.name,
              role: data.role || 'Software Engineer',
              company_type: data.company_type || 'Fortune 500 Enterprise',
              location: data.location || 'USA',
              situation: data.situation || '',
              approach: data.approach || '',
              results: data.results || '',
              is_sample: false,
              is_published: data.is_published !== undefined ? Boolean(data.is_published) : true,
            },
          });
          break;
        }
        case 'live-placements': {
          created = await prisma.livePlacement.create({
            data: {
              role: data.role,
              company_type: data.company_type || 'Tech Enterprise',
              location: data.location || 'Remote, US',
              package_range: data.package_range || '$110k - $130k',
              summary: data.summary || '',
              is_sample: false,
              is_published: data.is_published !== undefined ? Boolean(data.is_published) : true,
            },
          });
          break;
        }
        case 'faqs': {
          created = await prisma.faq.create({
            data: {
              category: data.category || 'General',
              question: data.question,
              answer: data.answer,
              sort_order: data.sort_order ? parseInt(data.sort_order, 10) : 0,
              is_published: data.is_published !== undefined ? Boolean(data.is_published) : true,
            },
          });
          break;
        }
        case 'testimonials': {
          created = await prisma.testimonial.create({
            data: {
              name: data.name,
              role: data.role || 'Alumni / Placed Candidate',
              quote: data.quote,
              is_sample: false,
              is_published: data.is_published !== undefined ? Boolean(data.is_published) : true,
            },
          });
          break;
        }
        default:
          return res.status(400).json({ success: false, error: { code: 'INVALID_MODEL', message: 'Unknown content model' } });
      }

      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  },

  // Update Content Item
  async updateContentItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { model, id } = req.params;
      const parsedId = parseInt(id, 10);
      const data = req.body;
      let updated;

      switch (model) {
        case 'jobs':
          updated = await prisma.jobOpening.update({
            where: { id: parsedId },
            data: {
              title: data.title,
              department: data.department,
              location: data.location,
              type: data.type,
              description: data.description,
              requirements: data.requirements,
              is_active: data.is_active !== undefined ? Boolean(data.is_active) : undefined,
            },
          });
          break;
        case 'stories':
          updated = await prisma.successStory.update({
            where: { id: parsedId },
            data: {
              name: data.name,
              role: data.role,
              company_type: data.company_type,
              location: data.location,
              situation: data.situation,
              approach: data.approach,
              results: data.results,
              is_published: data.is_published !== undefined ? Boolean(data.is_published) : undefined,
            },
          });
          break;
        case 'live-placements':
          updated = await prisma.livePlacement.update({
            where: { id: parsedId },
            data: {
              role: data.role,
              company_type: data.company_type,
              location: data.location,
              package_range: data.package_range,
              summary: data.summary,
              is_published: data.is_published !== undefined ? Boolean(data.is_published) : undefined,
            },
          });
          break;
        case 'faqs':
          updated = await prisma.faq.update({
            where: { id: parsedId },
            data: {
              category: data.category,
              question: data.question,
              answer: data.answer,
              sort_order: data.sort_order !== undefined ? parseInt(data.sort_order, 10) : undefined,
              is_published: data.is_published !== undefined ? Boolean(data.is_published) : undefined,
            },
          });
          break;
        case 'testimonials':
          updated = await prisma.testimonial.update({
            where: { id: parsedId },
            data: {
              name: data.name,
              role: data.role,
              quote: data.quote,
              is_published: data.is_published !== undefined ? Boolean(data.is_published) : undefined,
            },
          });
          break;
        default:
          return res.status(400).json({ success: false, error: { code: 'INVALID_MODEL', message: 'Unknown content model' } });
      }

      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },

  // Toggle Content Status (Active/Published)
  async toggleContentStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { model, id } = req.params;
      const parsedId = parseInt(id, 10);
      let updated;

      switch (model) {
        case 'jobs': {
          const item = await prisma.jobOpening.findUnique({ where: { id: parsedId } });
          if (!item) return res.status(404).json({ success: false, error: { message: 'Item not found' } });
          updated = await prisma.jobOpening.update({
            where: { id: parsedId },
            data: { is_active: !item.is_active },
          });
          break;
        }
        case 'stories': {
          const item = await prisma.successStory.findUnique({ where: { id: parsedId } });
          if (!item) return res.status(404).json({ success: false, error: { message: 'Item not found' } });
          updated = await prisma.successStory.update({
            where: { id: parsedId },
            data: { is_published: !item.is_published },
          });
          break;
        }
        case 'live-placements': {
          const item = await prisma.livePlacement.findUnique({ where: { id: parsedId } });
          if (!item) return res.status(404).json({ success: false, error: { message: 'Item not found' } });
          updated = await prisma.livePlacement.update({
            where: { id: parsedId },
            data: { is_published: !item.is_published },
          });
          break;
        }
        case 'faqs': {
          const item = await prisma.faq.findUnique({ where: { id: parsedId } });
          if (!item) return res.status(404).json({ success: false, error: { message: 'Item not found' } });
          updated = await prisma.faq.update({
            where: { id: parsedId },
            data: { is_published: !item.is_published },
          });
          break;
        }
        case 'testimonials': {
          const item = await prisma.testimonial.findUnique({ where: { id: parsedId } });
          if (!item) return res.status(404).json({ success: false, error: { message: 'Item not found' } });
          updated = await prisma.testimonial.update({
            where: { id: parsedId },
            data: { is_published: !item.is_published },
          });
          break;
        }
        default:
          return res.status(400).json({ success: false, error: { code: 'INVALID_MODEL', message: 'Unknown content model' } });
      }

      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },

  // Content Management Delete Handler
  async deleteContentItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { model, id } = req.params;
      const parsedId = parseInt(id, 10);

      switch (model) {
        case 'posts':
          await prisma.post.delete({ where: { id: parsedId } });
          break;
        case 'jobs':
          await prisma.jobOpening.delete({ where: { id: parsedId } });
          break;
        case 'courses':
          await prisma.course.delete({ where: { id: parsedId } });
          break;
        case 'stories':
          await prisma.successStory.delete({ where: { id: parsedId } });
          break;
        case 'live-placements':
          await prisma.livePlacement.delete({ where: { id: parsedId } });
          break;
        case 'faqs':
          await prisma.faq.delete({ where: { id: parsedId } });
          break;
        case 'testimonials':
          await prisma.testimonial.delete({ where: { id: parsedId } });
          break;
        case 'webinars':
          await prisma.webinar.delete({ where: { id: parsedId } });
          break;
        case 'interview-questions':
          await prisma.interviewQuestion.delete({ where: { id: parsedId } });
          break;
        default:
          return res.status(400).json({ success: false, error: { code: 'INVALID_MODEL', message: 'Unknown content model' } });
      }

      res.json({ success: true, message: 'Content item deleted successfully' });
    } catch (err) {
      next(err);
    }
  },
};
