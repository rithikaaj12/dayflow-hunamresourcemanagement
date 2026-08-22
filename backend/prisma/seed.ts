import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash('Demo@123', 10);
  const employeeHash = await bcrypt.hash('Demo@123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@dayflow.io' },
    update: {},
    create: {
      employeeId: 'DF-0001',
      name: 'Marcus Vance',
      email: 'admin@dayflow.io',
      password: adminHash,
      role: 'ADMIN',
      department: 'Executive Leadership',
    },
  });

  await prisma.user.upsert({
    where: { email: 'employee@dayflow.io' },
    update: {},
    create: {
      employeeId: 'DF-8834',
      name: 'Alexandre Chen',
      email: 'employee@dayflow.io',
      password: employeeHash,
      role: 'EMPLOYEE',
      department: 'Engineering',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
