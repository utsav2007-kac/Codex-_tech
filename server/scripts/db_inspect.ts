import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function inspect() {
  const dbUrl = process.env.DATABASE_URL || '';
  // Redact password
  const redactedUrl = dbUrl.replace(/:([^@:]+)@/, ':****@');
  console.log('DATABASE CONFIG:', redactedUrl);

  const tablesResult: any[] = await prisma.$queryRawUnsafe('SHOW TABLES;');
  console.log('--- SHOW TABLES ---');
  const tableNames = tablesResult.map(r => Object.values(r)[0] as string);
  console.log(tableNames.join(', '));

  console.log('\n--- ROW COUNTS & LATEST RECORDS ---');
  for (const table of tableNames) {
    try {
      const countRes: any[] = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as c FROM \`${table}\``);
      const count = Number(countRes[0]?.c || 0);

      let latestDate = 'N/A';
      try {
        const latestRes: any[] = await prisma.$queryRawUnsafe(`SELECT created_at FROM \`${table}\` ORDER BY created_at DESC LIMIT 1`);
        if (latestRes.length > 0 && latestRes[0]?.created_at) {
          latestDate = new Date(latestRes[0].created_at).toISOString();
        }
      } catch {
        try {
          const latestRes: any[] = await prisma.$queryRawUnsafe(`SELECT createdAt FROM \`${table}\` ORDER BY createdAt DESC LIMIT 1`);
          if (latestRes.length > 0 && latestRes[0]?.createdAt) {
            latestDate = new Date(latestRes[0].createdAt).toISOString();
          }
        } catch {
          latestDate = 'No date col';
        }
      }

      console.log(`Table: ${table.padEnd(25)} | Rows: ${String(count).padStart(5)} | Latest: ${latestDate}`);
    } catch (e: any) {
      console.log(`Table: ${table} | Error: ${e.message}`);
    }
  }
}

inspect()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

