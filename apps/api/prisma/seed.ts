import { PrismaClient } from '@prisma/client';
import { MOCK_USER_ID, MOCK_ACCOUNT_ID, MOCK_CATEGORY_ID } from '../src/lib/db';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding mock data...');

  const user = await prisma.user.upsert({
    where: { email: 'mock@saveithere.app' },
    update: {},
    create: {
      id: MOCK_USER_ID,
      email: 'mock@saveithere.app',
      name: 'Mock User',
    },
  });

  const account = await prisma.account.upsert({
    where: { id: MOCK_ACCOUNT_ID },
    update: {},
    create: {
      id: MOCK_ACCOUNT_ID,
      userId: user.id,
      name: 'Primary Bank',
      type: 'BANK',
      balance: 50000.0,
      currency: 'INR',
    },
  });

  const category = await prisma.category.upsert({
    where: { id: MOCK_CATEGORY_ID },
    update: {},
    create: {
      id: MOCK_CATEGORY_ID,
      userId: user.id,
      name: 'Food & Dining',
      type: 'EXPENSE',
      color: '#8B1A1A',
    },
  });

  console.log('Seed completed successfully!');
  console.log({ user: user.id, account: account.id, category: category.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
