import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const blogPosts = await prisma.blogPost.findMany({
    select: { id: true, slug: true, cover_image: true, published_at: true, featured: true },
    orderBy: { id: 'asc' }
  });
  console.log('All 12 Blog Posts by ID:');
  blogPosts.forEach((b) => {
    console.log(`ID ${b.id}: Cover=${b.cover_image}, Date=${b.published_at.toISOString().slice(0, 10)}, Featured=${b.featured}, Slug=${b.slug}`);
  });
}

main().finally(() => prisma.$disconnect());
