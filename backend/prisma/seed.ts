import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const branch = await prisma.branch.upsert({
    where: { code: 'br-01' },
    update: {},
    create: {
      code: 'br-01',
      name: 'Bin Essa Smoking Center - Branch 1',
      brandId: 'BIN_ESSA_SMOKING_CENTER',
    },
  });

  const passwordHash = await bcrypt.hash('demo1234', 10);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash,
      fullName: 'Demo Admin',
      role: 'ADMIN',
      branchId: branch.id,
    },
  });

  console.log('Seeded branch:', branch.code);
  console.log('Seeded user:', admin.username, '(password: demo1234)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
