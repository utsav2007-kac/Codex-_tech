import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function setAdminUser() {
  const email = 'admin@codex.com';
  const password = 'admin@123';

  console.log(`Setting up admin user: ${email}...`);
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.adminUser.upsert({
    where: { email },
    update: {
      password_hash: passwordHash,
      role: 'SUPERADMIN'
    },
    create: {
      email,
      name: 'Codex Administrator',
      password_hash: passwordHash,
      role: 'SUPERADMIN'
    }
  });

  console.log(`Admin user '${user.email}' configured successfully with ID ${user.id}!`);

  const isValid = await bcrypt.compare(password, user.password_hash);
  console.log(`Password verification test for '${password}': ${isValid ? 'PASSED ✅' : 'FAILED ❌'}`);

  await prisma.$disconnect();
}

setAdminUser().catch(err => {
  console.error('Failed to configure admin user:', err);
  process.exit(1);
});
