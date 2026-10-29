import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const posts = await prisma.blogPost.findMany({
    include: {
      faqs: true
    }
  });

  console.log(`Found ${posts.length} posts:`);
  for (const p of posts) {
    const text = p.content_html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = text ? text.split(' ').length : 0;
    const h2s = (p.content_html.match(/<h2/gi) || []).length;
    const h3s = (p.content_html.match(/<h3/gi) || []).length;
    const uls = (p.content_html.match(/<ul/gi) || []).length;
    const ols = (p.content_html.match(/<ol/gi) || []).length;
    const tables = (p.content_html.match(/<table/gi) || []).length;
    console.log(`- ${p.slug}:`);
    console.log(`  Words: ${words} | Reading time: ${p.reading_time_min}m | H2s: ${h2s} | H3s: ${h3s} | ULs: ${uls} | OLs: ${ols} | Tables: ${tables} | FAQs: ${p.faqs.length}`);
  }
  await prisma.$disconnect();
}

check().catch(console.error);
