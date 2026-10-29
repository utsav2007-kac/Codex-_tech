import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Invert dates so ID 1 (#01) is newest and ID 12 (#12) is oldest
// That way, descending order (newest first) produces 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12!
const dates = [
  { id: 1, date: new Date('2026-10-23T09:00:00Z'), featured: 1 },
  { id: 2, date: new Date('2026-10-21T09:00:00Z'), featured: 1 },
  { id: 3, date: new Date('2026-10-18T09:00:00Z'), featured: 0 },
  { id: 4, date: new Date('2026-10-15T09:00:00Z'), featured: 0 },
  { id: 5, date: new Date('2026-10-12T09:00:00Z'), featured: 0 },
  { id: 6, date: new Date('2026-10-09T09:00:00Z'), featured: 0 },
  { id: 7, date: new Date('2026-10-05T09:00:00Z'), featured: 0 },
  { id: 8, date: new Date('2026-10-02T09:00:00Z'), featured: 0 },
  { id: 9, date: new Date('2026-09-29T09:00:00Z'), featured: 0 },
  { id: 10, date: new Date('2026-09-25T09:00:00Z'), featured: 0 },
  { id: 11, date: new Date('2026-09-20T09:00:00Z'), featured: 0 },
  { id: 12, date: new Date('2026-09-15T09:00:00Z'), featured: 0 },
];

async function updateSequence() {
  console.log('Updating blog dates to display in perfect numerical sequence (1 to 12)...');
  for (const item of dates) {
    await prisma.blogPost.update({
      where: { id: item.id },
      data: {
        published_at: item.date,
        featured: item.featured
      }
    });
    console.log(`✓ Updated Post ID ${item.id} -> ${item.date.toISOString().slice(0, 10)}`);
  }

  // Verify descending order query
  const posts = await prisma.blogPost.findMany({
    select: { id: true, slug: true, cover_image: true, published_at: true },
    orderBy: { published_at: 'desc' }
  });

  console.log('\nVerified New Display Order:');
  posts.forEach((p, idx) => {
    console.log(`Position ${idx + 1}: Report #${String(p.id).padStart(2, '0')} (${p.cover_image}) -> ${p.published_at.toISOString().slice(0, 10)} [${p.slug}]`);
  });
}

updateSequence()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
