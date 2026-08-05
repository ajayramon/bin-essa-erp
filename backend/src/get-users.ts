import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany({
    include: { branch: true },
    orderBy: { createdAt: 'asc' },
  });

  console.log(`Total Users in Database: ${users.length}\n`);
  users.forEach((u, i) => {
    console.log(`User #${i + 1}:`);
    console.log(`  ID       : ${u.id}`);
    console.log(`  Username : ${u.username}`);
    console.log(`  Full Name: ${u.fullName}`);
    console.log(`  Role     : ${u.role}`);
    console.log(`  Branch   : ${u.branch ? `${u.branch.name} (${u.branch.code})` : 'Head Office (All Branches)'}`);
    console.log(`  Active   : ${u.isActive}`);
    console.log('--------------------------------------------------');
  });

  await prisma.$disconnect();
}

main().catch(console.error);
