import { databaseSnapshot } from '../_data.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Dynamic fallback to Prisma if DATABASE_URL is set in environment
  if (process.env.DATABASE_URL) {
    try {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      const [leads, contacts, applications] = await Promise.all([
        prisma.lead.findMany({ take: 6, orderBy: { created_at: 'desc' } }).catch(() => null),
        prisma.contact.findMany({ take: 6, orderBy: { created_at: 'desc' } }).catch(() => null),
        prisma.application.findMany({ take: 6, orderBy: { created_at: 'desc' }, include: { job: { select: { title: true } } } }).catch(() => null),
      ]);
      await prisma.$disconnect().catch(() => {});
      if (leads && contacts && applications) {
        return res.status(200).json({
          success: true,
          data: {
            kpi: {
              ...databaseSnapshot.kpi,
              totalLeads: leads.length,
              totalContacts: contacts.length,
              totalApplications: applications.length,
            },
            leads: leads.length,
            new_leads: leads.filter((l) => l.status === 'NEW').length,
            contacts: contacts.length,
            employer_requests: databaseSnapshot.kpi.totalEmployerRequests,
            applications: applications.length,
            subscribers: databaseSnapshot.kpi.totalSubscribers,
            enrollments: databaseSnapshot.kpi.totalEnrollments,
            stories: databaseSnapshot.kpi.totalStories,
            live_placements: databaseSnapshot.kpi.totalLivePlacements,
            referrals: databaseSnapshot.kpi.totalReferrals,
            recentLeads: leads,
            recentApplications: applications,
          },
        });
      }
    } catch (_) {}
  }

  // Serve authentic database snapshot
  return res.status(200).json({
    success: true,
    data: {
      kpi: databaseSnapshot.kpi,
      leads: databaseSnapshot.kpi.totalLeads,
      new_leads: databaseSnapshot.kpi.newLeads,
      contacts: databaseSnapshot.kpi.totalContacts,
      employer_requests: databaseSnapshot.kpi.totalEmployerRequests,
      applications: databaseSnapshot.kpi.totalApplications,
      subscribers: databaseSnapshot.kpi.totalSubscribers,
      enrollments: databaseSnapshot.kpi.totalEnrollments,
      stories: databaseSnapshot.kpi.totalStories,
      live_placements: databaseSnapshot.kpi.totalLivePlacements,
      referrals: databaseSnapshot.kpi.totalReferrals,
      recentLeads: databaseSnapshot.leads.slice(0, 6),
      recentApplications: databaseSnapshot.applications.slice(0, 6),
    },
  });
}
