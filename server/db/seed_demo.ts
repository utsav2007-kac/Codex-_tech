import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dbUrl = process.env.DATABASE_URL || '';
  const nodeEnv = process.env.NODE_ENV || 'development';

  // PRODUCTION SAFETY GUARDS
  if (nodeEnv === 'production') {
    console.error('SAFETY BLOCK: Cannot run demo seeding when NODE_ENV is "production"!');
    process.exit(1);
  }

  const isLocalHost = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');
  if (!isLocalHost) {
    console.error('SAFETY BLOCK: Cannot run demo seeding on a non-local database host!');
    process.exit(1);
  }

  console.log('[DEMO SEED] Inserting sample demo submissions into local MySQL...');

  // 1. Demo Leads
  await prisma.lead.createMany({
    data: [
      {
        name: '[DEMO] John Carter',
        email: 'demo.john@example.com',
        phone: '5551001001',
        country_code: '+1',
        current_role: 'Cloud Architect',
        experience_level: 'MID',
        visa_status: 'US_CITIZEN_GC',
        service_interest: 'JOB_PLACEMENT',
        source: 'demo_seed',
        status: 'NEW',
        consent: true,
      },
      {
        name: '[DEMO] Priya Sharma',
        email: 'demo.priya@example.com',
        phone: '5551001002',
        country_code: '+1',
        current_role: 'Data Engineer',
        experience_level: 'SENIOR',
        visa_status: 'H1B_H4',
        service_interest: 'INTERVIEW_PREP',
        source: 'demo_seed',
        status: 'CONTACTED',
        consent: true,
      },
    ],
    skipDuplicates: true,
  });

  // 2. Demo Employer Request
  await prisma.employerRequest.createMany({
    data: [
      {
        company: '[DEMO] Apex Cloud Innovations',
        contact_person: '[DEMO] Rachel Green',
        email: 'demo.rachel@apexcloud.io',
        phone: '5552002001',
        roles_needed: 'Full-Stack React & Node Engineers',
        tech_stack: 'React, Node, TypeScript, AWS',
        headcount: '3',
        hiring_model: 'Direct Hire',
        timeline: 'Immediate',
        status: 'NEW',
      },
    ],
    skipDuplicates: true,
  });

  // 3. Demo Referral
  await prisma.referral.createMany({
    data: [
      {
        referrer_name: '[DEMO] Alex Vance',
        referrer_email: 'demo.alex@example.com',
        referrer_phone: '5553003001',
        referee_name: '[DEMO] Marcus Brody',
        referee_email: 'demo.marcus@example.com',
        referee_phone: '5553003002',
        role_skill: 'DevOps / Kubernetes Specialist',
        status: 'NEW',
      },
    ],
    skipDuplicates: true,
  });

  // 4. Demo Enrollment (find first course)
  const firstCourse = await prisma.course.findFirst();
  if (firstCourse) {
    await prisma.enrollment.createMany({
      data: [
        {
          course_id: firstCourse.id,
          name: '[DEMO] Elena Rostova',
          email: 'demo.elena@example.com',
          phone: '5554004001',
          batch_pref: 'Weekend Batch',
          status: 'NEW',
        },
      ],
      skipDuplicates: true,
    });
  }

  console.log('[DEMO SEED] Successfully inserted sample submissions with [DEMO] prefix!');
}

main()
  .catch(err => {
    console.error('Demo seed error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
