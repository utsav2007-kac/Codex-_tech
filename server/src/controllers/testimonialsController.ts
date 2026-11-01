import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../services/db';
import { StorageAdapter } from '../services/storageAdapter';

// Input Validation Schemas
const testimonialInputSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  role: z.string().min(2, 'Role must be at least 2 characters').max(100),
  company_name: z.string().max(150).optional().nullable(),
  placement: z.string().max(150).optional().nullable(),
  quote: z.string().min(10, 'Quote must be between 10 and 500 characters').max(500),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  reviewer_type: z.enum(['candidate', 'employer']).default('candidate'),
  source: z.string().max(50).default('LinkedIn'),
  highlight_metric: z.string().max(150).optional().nullable(),
  avatar_url: z.string().max(255).optional().nullable(),
  show_in_spotlight: z.coerce.boolean().default(false),
  is_main_highlight: z.coerce.boolean().default(false),
  show_in_cards: z.coerce.boolean().default(true),
  spotlight_order: z.coerce.number().int().default(0),
  card_order: z.coerce.number().int().default(0),
  is_published: z.coerce.boolean().default(true),
  permission_confirmed: z.coerce.boolean().refine((val) => val === true, {
    message: 'You must confirm permission to publish this review.'
  })
});

/**
 * Ensures there is always exactly one main highlight among published spotlight reviews.
 */
async function ensureMainHighlightInvariant() {
  const publishedSpotlight = await prisma.testimonial.findMany({
    where: { is_published: true, show_in_spotlight: true },
    orderBy: [{ spotlight_order: 'asc' }, { id: 'asc' }]
  });

  if (publishedSpotlight.length === 0) return;

  const currentHighlights = publishedSpotlight.filter((t) => t.is_main_highlight);

  if (currentHighlights.length === 0) {
    // Auto-promote the first published spotlight review
    await prisma.testimonial.update({
      where: { id: publishedSpotlight[0].id },
      data: { is_main_highlight: true }
    });
  } else if (currentHighlights.length > 1) {
    // Keep only the first one as highlight, unset the others
    const keepId = currentHighlights[0].id;
    const removeIds = currentHighlights.slice(1).map((t) => t.id);
    await prisma.testimonial.updateMany({
      where: { id: { in: removeIds } },
      data: { is_main_highlight: false }
    });
  }
}

export const testimonialsController = {
  // ────────────────────────────────────────────────────────────────────
  // PUBLIC ENDPOINTS
  // ────────────────────────────────────────────────────────────────────

  // GET /api/testimonials (Compatible with existing ReviewsWall client fetch)
  getPublicTestimonials: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await prisma.testimonial.findMany({
        where: { is_published: true },
        orderBy: [{ spotlight_order: 'asc' }, { card_order: 'asc' }, { id: 'asc' }]
      });

      // Map to ReviewItem format expected by ReviewsWall
      const formatted = items.map((t) => ({
        id: t.id,
        name: t.name,
        role: t.role,
        placement: t.placement || (t.company_name ? `Placed at ${t.company_name}` : undefined),
        quote: t.quote,
        type: t.reviewer_type as 'candidate' | 'employer',
        highlightMetric: t.highlight_metric || undefined,
        avatar: t.avatar_url || t.avatar || undefined,
        avatar_url: t.avatar_url || t.avatar || undefined,
        rating: t.rating,
        show_in_spotlight: t.show_in_spotlight,
        is_main_highlight: t.is_main_highlight,
        show_in_cards: t.show_in_cards,
        is_sample: t.is_sample
      }));

      return res.json({
        success: true,
        data: formatted
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/testimonials/home (High-efficiency endpoint specifically for Home page showcase)
  getHomeTestimonials: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      await ensureMainHighlightInvariant();

      const [publishedReviews, spotlightReviews, cardReviews] = await Promise.all([
        prisma.testimonial.findMany({
          where: { is_published: true },
          orderBy: [{ spotlight_order: 'asc' }, { id: 'asc' }]
        }),
        prisma.testimonial.findMany({
          where: { is_published: true, show_in_spotlight: true },
          orderBy: [{ spotlight_order: 'asc' }, { id: 'asc' }]
        }),
        prisma.testimonial.findMany({
          where: { is_published: true, show_in_cards: true },
          orderBy: [{ card_order: 'asc' }, { id: 'asc' }],
          take: 6
        })
      ]);

      const formatItem = (t: any) => ({
        id: t.id,
        name: t.name,
        role: t.role,
        placement: t.placement || (t.company_name ? `Placed at ${t.company_name}` : undefined),
        quote: t.quote,
        type: t.reviewer_type as 'candidate' | 'employer',
        highlightMetric: t.highlight_metric || undefined,
        avatar: t.avatar_url || t.avatar || undefined,
        avatar_url: t.avatar_url || t.avatar || undefined,
        rating: t.rating,
        show_in_spotlight: t.show_in_spotlight,
        is_main_highlight: t.is_main_highlight,
        show_in_cards: t.show_in_cards,
        is_sample: t.is_sample
      });

      const formattedPublished = publishedReviews.map(formatItem);
      const formattedSpotlight = (spotlightReviews.length > 0 ? spotlightReviews : publishedReviews).map(formatItem);
      const formattedCards = (cardReviews.length > 0 ? cardReviews : publishedReviews.slice(0, 6)).map(formatItem);

      const mainHighlight =
        formattedSpotlight.find((t) => t.is_main_highlight) ||
        formattedSpotlight[0] ||
        formattedPublished[0] ||
        null;

      return res.json({
        success: true,
        data: {
          reviews: formattedPublished,
          spotlight: formattedSpotlight,
          cards: formattedCards,
          mainHighlight,
          counts: {
            all: formattedPublished.length,
            candidate: formattedPublished.filter((t) => t.type === 'candidate').length,
            employer: formattedPublished.filter((t) => t.type === 'employer').length
          }
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // ────────────────────────────────────────────────────────────────────
  // ADMIN CONTROL ENDPOINTS
  // ────────────────────────────────────────────────────────────────────

  // GET /api/admin/testimonials
  adminGetTestimonials: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tab, q } = req.query as { tab?: string; q?: string };

      const where: any = {};

      if (tab === 'main_highlight') {
        where.is_main_highlight = true;
      } else if (tab === 'spotlight') {
        where.show_in_spotlight = true;
      } else if (tab === 'cards') {
        where.show_in_cards = true;
      } else if (tab === 'unpublished') {
        where.is_published = false;
      }

      if (q && q.trim()) {
        const query = q.trim();
        where.OR = [
          { name: { contains: query } },
          { role: { contains: query } },
          { quote: { contains: query } },
          { company_name: { contains: query } },
          { placement: { contains: query } }
        ];
      }

      const [items, totalAll, totalHighlight, totalSpotlight, totalCards, totalUnpublished] =
        await Promise.all([
          prisma.testimonial.findMany({
            where,
            orderBy: [{ is_main_highlight: 'desc' }, { spotlight_order: 'asc' }, { card_order: 'asc' }, { id: 'asc' }]
          }),
          prisma.testimonial.count(),
          prisma.testimonial.count({ where: { is_main_highlight: true } }),
          prisma.testimonial.count({ where: { show_in_spotlight: true } }),
          prisma.testimonial.count({ where: { show_in_cards: true } }),
          prisma.testimonial.count({ where: { is_published: false } })
        ]);

      return res.json({
        success: true,
        data: items,
        counts: {
          all: totalAll,
          main_highlight: totalHighlight,
          spotlight: totalSpotlight,
          cards: totalCards,
          unpublished: totalUnpublished
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/admin/testimonials
  adminCreateTestimonial: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = testimonialInputSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, error: parsed.error.format() });
      }

      const data = parsed.data;

      // If user sets is_main_highlight, unset others first
      if (data.is_main_highlight) {
        await prisma.testimonial.updateMany({
          data: { is_main_highlight: false }
        });
      }

      const created = await prisma.testimonial.create({
        data: {
          name: data.name,
          role: data.role,
          company_name: data.company_name,
          placement: data.placement,
          quote: data.quote,
          rating: data.rating,
          reviewer_type: data.reviewer_type,
          source: data.source,
          highlight_metric: data.highlight_metric,
          avatar_url: data.avatar_url,
          avatar: data.avatar_url,
          show_in_spotlight: data.show_in_spotlight,
          is_main_highlight: data.is_main_highlight,
          show_in_cards: data.show_in_cards,
          spotlight_order: data.spotlight_order,
          card_order: data.card_order,
          is_published: data.is_published,
          permission_confirmed: data.permission_confirmed,
          permission_confirmed_at: new Date(),
          is_sample: false
        }
      });

      await ensureMainHighlightInvariant();

      return res.json({
        success: true,
        data: created,
        message: 'Review created successfully'
      });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/admin/testimonials/:id
  adminUpdateTestimonial: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid ID' });

      const parsed = testimonialInputSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, error: parsed.error.format() });
      }

      const data = parsed.data;

      if (data.is_main_highlight) {
        // Unset any other main highlight
        await prisma.testimonial.updateMany({
          where: { id: { not: id } },
          data: { is_main_highlight: false }
        });
      }

      const updated = await prisma.testimonial.update({
        where: { id },
        data: {
          name: data.name,
          role: data.role,
          company_name: data.company_name,
          placement: data.placement,
          quote: data.quote,
          rating: data.rating,
          reviewer_type: data.reviewer_type,
          source: data.source,
          highlight_metric: data.highlight_metric,
          avatar_url: data.avatar_url,
          avatar: data.avatar_url,
          show_in_spotlight: data.show_in_spotlight,
          is_main_highlight: data.is_main_highlight,
          show_in_cards: data.show_in_cards,
          spotlight_order: data.spotlight_order,
          card_order: data.card_order,
          is_published: data.is_published,
          permission_confirmed: data.permission_confirmed,
          permission_confirmed_at: new Date()
        }
      });

      await ensureMainHighlightInvariant();

      return res.json({
        success: true,
        data: updated,
        message: 'Review updated successfully'
      });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/admin/testimonials/:id
  adminDeleteTestimonial: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid ID' });

      const existing = await prisma.testimonial.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ success: false, error: 'Review not found' });

      // Clean up avatar file if uploaded
      if (existing.avatar_url) {
        StorageAdapter.deleteFile(existing.avatar_url);
      }

      await prisma.testimonial.delete({ where: { id } });

      // If the deleted review was the main highlight, ensure another spotlight review is promoted
      await ensureMainHighlightInvariant();

      return res.json({
        success: true,
        message: 'Review deleted successfully'
      });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/admin/testimonials/:id/highlight (Set single main highlight)
  adminSetHighlight: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid ID' });

      // Unset all highlights
      await prisma.testimonial.updateMany({
        data: { is_main_highlight: false }
      });

      // Set target review as highlight and ensure it is also in spotlight and published
      const updated = await prisma.testimonial.update({
        where: { id },
        data: {
          is_main_highlight: true,
          show_in_spotlight: true,
          is_published: true
        }
      });

      return res.json({
        success: true,
        data: updated,
        message: `${updated.name} set as the Placed Candidate Spotlight main highlight`
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/admin/testimonials/upload-avatar
  adminUploadAvatar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No photo uploaded' });
      }

      const name = req.body.name || 'reviewer';
      const saved = await StorageAdapter.saveAvatar(req.file.buffer, name);

      return res.json({
        success: true,
        data: {
          url: saved.url,
          filename: saved.filename
        }
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: err.message || 'Avatar upload failed'
      });
    }
  },

  // POST /api/admin/testimonials/bulk
  adminBulkAction: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ids, action } = req.body as { ids: number[]; action: 'publish' | 'unpublish' | 'delete' };
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, error: 'No review IDs provided' });
      }

      if (action === 'publish') {
        await prisma.testimonial.updateMany({
          where: { id: { in: ids } },
          data: { is_published: true }
        });
      } else if (action === 'unpublish') {
        await prisma.testimonial.updateMany({
          where: { id: { in: ids } },
          data: { is_published: false, is_main_highlight: false }
        });
      } else if (action === 'delete') {
        // Fetch items to delete avatars
        const toDelete = await prisma.testimonial.findMany({
          where: { id: { in: ids } }
        });
        for (const item of toDelete) {
          if (item.avatar_url) StorageAdapter.deleteFile(item.avatar_url);
        }
        await prisma.testimonial.deleteMany({
          where: { id: { in: ids } }
        });
      } else {
        return res.status(400).json({ success: false, error: 'Invalid bulk action' });
      }

      await ensureMainHighlightInvariant();

      return res.json({
        success: true,
        message: `Successfully processed ${ids.length} reviews`
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/admin/testimonials/reorder
  adminReorder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { items } = req.body as { items: { id: number; spotlight_order?: number; card_order?: number }[] };
      if (!Array.isArray(items)) {
        return res.status(400).json({ success: false, error: 'Invalid items array' });
      }

      for (const item of items) {
        const updateData: any = {};
        if (typeof item.spotlight_order === 'number') updateData.spotlight_order = item.spotlight_order;
        if (typeof item.card_order === 'number') updateData.card_order = item.card_order;

        if (Object.keys(updateData).length > 0) {
          await prisma.testimonial.update({
            where: { id: item.id },
            data: updateData
          });
        }
      }

      return res.json({ success: true, message: 'Display order updated' });
    } catch (err) {
      next(err);
    }
  }
};

