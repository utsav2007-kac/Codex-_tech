const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const leads = await prisma.lead.count();
  const contacts = await prisma.contact.count();
  const employers = await prisma.employerRequest.count();
  const applications = await prisma.application.count();
  const subscribers = await prisma.subscriber.count();
  const enrollments = await prisma.enrollment.count();
  const stories = await prisma.successStory.count();
  const placements = await prisma.livePlacement.count();
  const referrals = await prisma.referral.count();

  console.log('--- REAL DATABASE COUNTS ---');
  console.log(JSON.stringify({
    leads,
    contacts,
    employers,
    applications,
    subscribers,
    enrollments,
    stories,
    placements,
    referrals
  }, null, 2));
}

main()
  .catch((e) => {
    console.error('Database connection error:', e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
