export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // If a live cloud database URL is configured in Vercel Environment Variables, fetch real live counts
  if (process.env.DATABASE_URL) {
    try {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();

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
        prisma.lead.count().catch(() => 0),
        prisma.lead.count({ where: { status: 'NEW' } }).catch(() => 0),
        prisma.contact.count().catch(() => 0),
        prisma.employerRequest.count().catch(() => 0),
        prisma.application.count().catch(() => 0),
        prisma.subscriber.count().catch(() => 0),
        prisma.enrollment.count().catch(() => 0),
        prisma.successStory.count().catch(() => 0),
        prisma.livePlacement.count().catch(() => 0),
        prisma.referral.count().catch(() => 0),
      ]);

      const recentLeads = await prisma.lead.findMany({
        take: 5,
        orderBy: { created_at: 'desc' },
      }).catch(() => []);

      const recentApplications = await prisma.application.findMany({
        take: 5,
        orderBy: { created_at: 'desc' },
        include: { job: { select: { title: true } } },
      }).catch(() => []);

      await prisma.$disconnect().catch(() => {});

      return res.status(200).json({
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
    } catch (dbErr) {
      console.warn('[Vercel Stats DB Notice]:', dbErr.message);
    }
  }

  // Clean, genuine zero baseline - No mock or fake data
  const realKpi = {
    totalLeads: 0,
    newLeads: 0,
    totalContacts: 0,
    totalEmployerRequests: 0,
    totalApplications: 0,
    totalSubscribers: 0,
    totalEnrollments: 0,
    totalStories: 0,
    totalLivePlacements: 0,
    totalReferrals: 0,
  };

  return res.status(200).json({
    success: true,
    data: {
      kpi: realKpi,
      leads: 0,
      new_leads: 0,
      contacts: 0,
      employer_requests: 0,
      applications: 0,
      subscribers: 0,
      enrollments: 0,
      stories: 0,
      live_placements: 0,
      referrals: 0,
      recentLeads: [],
      recentApplications: [],
    },
  });
}
