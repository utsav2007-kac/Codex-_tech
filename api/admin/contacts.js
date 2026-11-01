import { databaseSnapshot } from '../_data.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (process.env.DATABASE_URL) {
    try {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      const contacts = await prisma.contact.findMany({ orderBy: { created_at: 'desc' } });
      await prisma.$disconnect();
      return res.status(200).json({ success: true, data: contacts });
    } catch (_) {}
  }

  return res.status(200).json({ success: true, data: databaseSnapshot.contacts });
}
