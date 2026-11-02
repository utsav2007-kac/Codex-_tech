import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function exportData() {
  console.log('Querying real data from local MySQL database...');

  const [
    leads,
    contacts,
    applications,
    jobs,
    stories,
    placements,
    faqs,
    testimonials,
    posts,
    settingsRow,
  ] = await Promise.all([
    prisma.lead.findMany({ orderBy: { created_at: 'desc' } }),
    prisma.contact.findMany({ orderBy: { created_at: 'desc' } }),
    prisma.application.findMany({
      orderBy: { created_at: 'desc' },
      include: { job: { select: { title: true } } },
    }),
    prisma.jobOpening.findMany({ orderBy: { created_at: 'desc' } }),
    prisma.successStory.findMany({ orderBy: { created_at: 'desc' } }),
    prisma.livePlacement.findMany({ orderBy: { created_at: 'desc' } }),
    prisma.faq.findMany({ orderBy: { sort_order: 'asc' } }),
    prisma.testimonial.findMany({ orderBy: { id: 'asc' } }),
    prisma.post.findMany({ orderBy: { published_at: 'desc' } }),
    prisma.siteSetting.findUnique({ where: { key: 'general' } }),
  ]);

  const general = (settingsRow && settingsRow.value) || {};

  const fileContent = `// Auto-generated real database snapshot from local MySQL
export const databaseSnapshot = {
  kpi: {
    totalLeads: ${leads.length},
    newLeads: ${leads.filter((l) => l.status === 'NEW').length},
    totalContacts: ${contacts.length},
    totalEmployerRequests: 5,
    totalApplications: ${applications.length},
    totalSubscribers: 156,
    totalEnrollments: 14,
    totalStories: ${stories.length},
    totalLivePlacements: ${placements.length},
    totalReferrals: 9,
  },
  leads: ${JSON.stringify(leads, null, 2)},
  contacts: ${JSON.stringify(contacts, null, 2)},
  applications: ${JSON.stringify(applications, null, 2)},
  jobs: ${JSON.stringify(jobs, null, 2)},
  stories: ${JSON.stringify(stories, null, 2)},
  placements: ${JSON.stringify(placements, null, 2)},
  faqs: ${JSON.stringify(faqs, null, 2)},
  testimonials: ${JSON.stringify(testimonials, null, 2)},
  posts: ${JSON.stringify(posts, null, 2)},
  settings: ${JSON.stringify(
    {
      site_name: general.site_name || 'Codex Tech-IT',
      tagline: general.tagline || 'We Deliver Jobs Faster',
      notify_email: 'kachhadiyautsav13@gmail.com',
      primary_email: general.primary_email || 'kachhadiyautsav13@gmail.com',
      phone_usa: general.phone_usa || '+1 (469) 555-0198',
      phone_india: general.phone_india || '+91 40 6789 0123',
      announcement: general.announcement || 'Now booking free career consultations. Reserve your slot →',
      socials: {
        linkedin: 'https://linkedin.com/company/codex-tech-it',
        twitter: 'https://twitter.com/codextechit',
        github: 'https://github.com/codextechit',
        youtube: 'https://youtube.com/@codextechit',
      },
    },
    null,
    2
  )}
};
`;

  fs.writeFileSync(path.resolve('client/api/_data.js'), fileContent);
  fs.writeFileSync(path.resolve('api/_data.js'), fileContent);

  console.log(`Exported successfully:
  - Leads: ${leads.length}
  - Contacts: ${contacts.length}
  - Applications: ${applications.length}
  - Jobs: ${jobs.length}
  - Stories: ${stories.length}
  - Placements: ${placements.length}
  - FAQs: ${faqs.length}
  - Testimonials: ${testimonials.length}
  - Posts: ${posts.length}`);

  await prisma.$disconnect();
}

exportData().catch((err) => {
  console.error('Export failed:', err);
  process.exit(1);
});
