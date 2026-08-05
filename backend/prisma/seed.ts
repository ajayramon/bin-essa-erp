import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

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

  const seedUsers = [
    { username: 'admin', fullName: 'System Admin', role: 'ADMIN' as const, branchId: branch.id },
    { username: 'manager', fullName: 'Branch Manager', role: 'MANAGER' as const, branchId: branch.id },
    { username: 'cashier', fullName: 'Retail Cashier', role: 'CASHIER' as const, branchId: branch.id },
    { username: 'accountant', fullName: 'Head Accountant', role: 'ACCOUNTANT' as const, branchId: branch.id },
    { username: 'storekeeper', fullName: 'Warehouse Storekeeper', role: 'STOREKEEPER' as const, branchId: branch.id },
    { username: 'sales_rep', fullName: 'B2B Sales Representative', role: 'SALES_REP' as const, branchId: branch.id },
  ];

  for (const u of seedUsers) {
    await prisma.user.upsert({
      where: { username: u.username },
      update: { passwordHash },
      create: {
        username: u.username,
        passwordHash,
        fullName: u.fullName,
        role: u.role,
        branchId: u.branchId,
      },
    });
  }


  const cashAccount = await prisma.account.upsert({
    where: { code: '1000' },
    update: {},
    create: {
      code: '1000',
      name: 'Cash',
      type: 'ASSET',
    },
  });

  const salesRevenueAccount = await prisma.account.upsert({
    where: { code: '4000' },
    update: {},
    create: {
      code: '4000',
      name: 'Sales Revenue',
      type: 'REVENUE',
    },
  });

  const inventoryAccount = await prisma.account.upsert({
    where: { code: '1200' },
    update: {},
    create: {
      code: '1200',
      name: 'Inventory',
      type: 'ASSET',
    },
  });

  const accountsPayableAccount = await prisma.account.upsert({
    where: { code: '2000' },
    update: {},
    create: {
      code: '2000',
      name: 'Accounts Payable',
      type: 'LIABILITY',
    },
  });

  console.log('Seeded branch:', branch.code);
  console.log('Seeded users:', seedUsers.map((u) => u.username).join(', '), '(password for all: demo1234)');

  console.log('Seeded account:', cashAccount.code, cashAccount.name, '- id:', cashAccount.id);
  console.log('Seeded account:', inventoryAccount.code, inventoryAccount.name, '- id:', inventoryAccount.id);
  console.log('Seeded account:', accountsPayableAccount.code, accountsPayableAccount.name, '- id:', accountsPayableAccount.id);
  console.log('Seeded account:', salesRevenueAccount.code, salesRevenueAccount.name, '- id:', salesRevenueAccount.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
