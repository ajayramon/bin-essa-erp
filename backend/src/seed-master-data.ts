import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function seedMasterData() {
  console.log('=== Seeding Master Setup Data (Branches, Users, Chart of Accounts) ===');

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
  console.log(`Seeded ${branches.length} branches across Bin Essa Smoking, Khiran & JM Art Zone.`);

  const mainBranch = branches[0];
  const passwordHash = await bcrypt.hash('demo1234', 10);

  const seedUsers = [
    { username: 'admin', fullName: 'System Admin', role: 'ADMIN' as const, branchId: mainBranch.id },
    { username: 'manager', fullName: 'Branch Manager', role: 'MANAGER' as const, branchId: mainBranch.id },
    { username: 'cashier', fullName: 'Retail Cashier', role: 'CASHIER' as const, branchId: mainBranch.id },
    { username: 'accountant', fullName: 'Head Accountant', role: 'ACCOUNTANT' as const, branchId: mainBranch.id },
    { username: 'storekeeper', fullName: 'Warehouse Storekeeper', role: 'STOREKEEPER' as const, branchId: mainBranch.id },
    { username: 'sales_rep', fullName: 'B2B Sales Representative', role: 'SALES_REP' as const, branchId: mainBranch.id },
  ];

  for (const u of seedUsers) {
    await prisma.user.upsert({
      where: { username: u.username },
      update: { passwordHash, fullName: u.fullName, role: u.role, branchId: u.branchId },
      create: {
        username: u.username,
        passwordHash,
        fullName: u.fullName,
        role: u.role,
        branchId: u.branchId,
      },
    });
  }
  console.log(`Seeded ${seedUsers.length} system users with verified roles.`);

  const standardAccounts = [
    { code: '1000', name: 'Cash on Hand', type: 'ASSET' as const },
    { code: '1010', name: 'Commercial Bank Account', type: 'ASSET' as const },
    { code: '1100', name: 'Accounts Receivable (Customers)', type: 'ASSET' as const },
    { code: '1200', name: 'Inventory Asset', type: 'ASSET' as const },
    { code: '2000', name: 'Accounts Payable (Vendors)', type: 'LIABILITY' as const },
    { code: '4000', name: 'Sales Revenue', type: 'REVENUE' as const },
    { code: '5000', name: 'Cost of Goods Sold (COGS)', type: 'EXPENSE' as const },
    { code: '6000', name: 'Operating Expenses', type: 'EXPENSE' as const },
  ];

  for (const acc of standardAccounts) {
    await prisma.account.upsert({
      where: { code: acc.code },
      update: { name: acc.name, type: acc.type },
      create: acc,
    });
  }
  console.log(`Seeded ${standardAccounts.length} standard Chart of Accounts.`);

  const [bCount, uCount, aCount] = await Promise.all([
    prisma.branch.count(),
    prisma.user.count(),
    prisma.account.count(),
  ]);

  console.log(`Summary: ${bCount} Branches, ${uCount} Users, ${aCount} GL Accounts.`);
}

seedMasterData()
  .catch((e) => {
    console.error('Error seeding master data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
