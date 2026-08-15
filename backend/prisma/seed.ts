import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({ adapter });

async function main() {
  const branchesData = [
    { code: 'br-01', name: 'Bin Essa Smoking Center - Shuwaikh Main (HQ)', brandId: 'BIN_ESSA_SMOKING_CENTER' as const },
    { code: 'br-02', name: 'Bin Essa Smoking Center - Salmiya Counter', brandId: 'BIN_ESSA_SMOKING_CENTER' as const },
    { code: 'br-03', name: 'Bin Essa Smoking Center - Hawally Counter', brandId: 'BIN_ESSA_SMOKING_CENTER' as const },
    { code: 'br-04', name: 'Bin Essa Smoking Center - Kuwait City', brandId: 'BIN_ESSA_SMOKING_CENTER' as const },
    { code: 'br-05', name: 'Bin Essa Smoking Center - Farwaniya', brandId: 'BIN_ESSA_SMOKING_CENTER' as const },
    { code: 'br-06', name: 'Bin Essa Smoking Center - Fahaheel', brandId: 'BIN_ESSA_SMOKING_CENTER' as const },
    { code: 'br-07', name: 'Bin Essa Smoking Center - Jahra', brandId: 'BIN_ESSA_SMOKING_CENTER' as const },
    { code: 'br-08', name: 'Bin Essa Smoking Center - Mahboula', brandId: 'BIN_ESSA_SMOKING_CENTER' as const },
    { code: 'br-09', name: 'Bin Essa Smoking Center - Mangaf', brandId: 'BIN_ESSA_SMOKING_CENTER' as const },
    { code: 'br-10', name: 'Bin Essa Khiran - Marine & Outdoor', brandId: 'BIN_ESSA_KHIRAN' as const },
    { code: 'br-11', name: 'Bin Essa Smoking Center - Avenues Mall', brandId: 'BIN_ESSA_SMOKING_CENTER' as const },
    { code: 'br-12', name: 'Bin Essa Smoking Center - Egaila', brandId: 'BIN_ESSA_SMOKING_CENTER' as const },
    { code: 'br-13', name: 'JM Art Zone - Shuwaikh Design Center', brandId: 'JM_ART_ZONE' as const },
    { code: 'br-14', name: 'JM Art Zone - Salmiya Studio', brandId: 'JM_ART_ZONE' as const },
  ];

  const branches: any[] = [];
  for (const b of branchesData) {
    const created = await prisma.branch.upsert({
      where: { code: b.code },
      update: { name: b.name, brandId: b.brandId },
      create: b,
    });
    branches.push(created);
  }

  const branch = branches[0];
  const salmiyaBranch = branches[1];

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
