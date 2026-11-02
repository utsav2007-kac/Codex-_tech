import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('[DEMO CLEAR] Removing exclusively [DEMO] labeled rows...');

  const leads = await prisma.lead.deleteMany({
    where: { name: { startsWith: '[DEMO]' } },
  });

  const employerRequests = await prisma.employerRequest.deleteMany({
    where: { company: { startsWith: '[DEMO]' } },
  });

  const referrals = await prisma.referral.deleteMany({
    where: { referrer_name: { startsWith: '[DEMO]' } },
  });

  const enrollments = await prisma.enrollment.deleteMany({
    where: { name: { startsWith: '[DEMO]' } },
  });

  console.log(`[DEMO CLEAR] Removed:
  - Leads: ${leads.count}
  - Employer Requests: ${employerRequests.count}
  - Referrals: ${referrals.count}
  - Enrollments: ${enrollments.count}
No real production or user submissions were touched.`);
}

main()
  .catch(err => {
    console.error('Demo clear error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
