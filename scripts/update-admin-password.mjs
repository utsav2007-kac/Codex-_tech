import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function updateAdminPassword() {
  const newPassword = 'CodexAdmin2026';
  const email = 'admin@codextechit.com';
  
  console.log(`Hashing new password for ${email}...`);
  const passwordHash = await bcrypt.hash(newPassword, 10);

  const updatedUser = await prisma.adminUser.upsert({
    where: { email },
    update: {
      password_hash: passwordHash
    },
    create: {
      email,
      name: 'System Administrator',
      password_hash: passwordHash,
      role: 'superadmin'
    }
  });

  console.log(`Successfully updated admin user: ${updatedUser.email}`);
  
  // Verify verification
  const isMatch = await bcrypt.compare(newPassword, updatedUser.password_hash);
  console.log(`Password verification check for '${newPassword}': ${isMatch ? 'PASSED ✅' : 'FAILED ❌'}`);

  await prisma.$disconnect();
}

updateAdminPassword().catch(err => {
  console.error('Failed to update admin password:', err);
  process.exit(1);
});
