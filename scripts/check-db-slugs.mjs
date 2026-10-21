import { PrismaClient } from '../server/node_modules/@prisma/client/index.js';

const prisma = new PrismaClient();

async function main() {
  const stories = await prisma.successStory.findMany();
  console.log('Stories in DB:', stories.map((s) => ({ slug: s.slug, title: s.title, is_published: s.is_published })));

  const posts = await prisma.post.findMany();
  console.log('Posts in DB:', posts.map((p) => ({ slug: p.slug, title: p.title, is_published: p.is_published })));

  const jobs = await prisma.jobOpening.findMany();
  console.log('Jobs in DB:', jobs.map((j) => ({ slug: j.slug, title: j.title, is_active: j.is_active })));

  const courses = await prisma.course.findMany();
  console.log('Courses in DB:', courses.map((c) => ({ slug: c.slug, title: c.title, is_active: c.is_active })));
}

main().finally(() => prisma.$disconnect());
