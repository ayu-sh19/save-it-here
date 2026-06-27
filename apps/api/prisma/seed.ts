import { PrismaClient } from '@prisma/client';
import { MOCK_USER_ID, MOCK_ACCOUNT_ID, MOCK_CATEGORY_ID } from '../src/lib/db';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Ensure mock user exists
  const user = await prisma.user.upsert({
    where: { id: MOCK_USER_ID },
    update: {},
    create: {
      id: MOCK_USER_ID,
      name: 'Demo User',
      email: 'demo@example.com',
    },
  });

  // Ensure mock account exists
  await prisma.account.upsert({
    where: { id: MOCK_ACCOUNT_ID },
    update: {},
    create: {
      id: MOCK_ACCOUNT_ID,
      userId: MOCK_USER_ID,
      name: 'Main Bank',
      type: 'BANK',
      balance: 50000,
    }
  });

  // Ensure mock category exists
  await prisma.category.upsert({
    where: { id: MOCK_CATEGORY_ID },
    update: {},
    create: {
      id: MOCK_CATEGORY_ID,
      userId: MOCK_USER_ID,
      name: 'General',
      type: 'EXPENSE',
    }
  });

  // Ensure basic tags exist
  await prisma.tag.upsert({
    where: { userId_name: { userId: MOCK_USER_ID, name: 'DESIGN' } },
    update: {},
    create: { userId: MOCK_USER_ID, name: 'DESIGN', color: '#1A1108' }
  });

  await prisma.tag.upsert({
    where: { userId_name: { userId: MOCK_USER_ID, name: 'DEV' } },
    update: {},
    create: { userId: MOCK_USER_ID, name: 'DEV', color: '#8B1A1A' }
  });

  // Seed Ideas for Kanban Board
  const ideas = [
    { title: 'Neo-Brutalist Portfolio', content: 'Use stark ink borders and offset shadows for the new portfolio.', status: 'SPARK', priority: 'HIGH' },
    { title: 'Save-It-Here Extension', content: 'Build a chrome extension to clip things quickly.', status: 'IN_PROG', priority: 'CRITICAL' },
    { title: 'Local-first Architecture', content: 'Explore CRDTs and IndexedDB for local-first sync.', status: 'EXPLORING', priority: 'MEDIUM' },
    { title: 'Write Blog Post on CSS', content: 'Write about @layer and Tailwind V4.', status: 'DONE', priority: 'LOW' }
  ];

  for (const idea of ideas) {
    await prisma.idea.create({
      data: {
        userId: MOCK_USER_ID,
        title: idea.title,
        content: idea.content,
        status: idea.status,
        priority: idea.priority,
        tags: {
          connect: [{ userId_name: { userId: MOCK_USER_ID, name: 'DEV' } }]
        }
      }
    });
  }

  // Seed Social Archives
  const archives = [
    { platform: 'INSTAGRAM', url: 'https://instagram.com/p/mock123', authorHandle: '@design_inspo', caption: 'Crazy brutalist poster design.', userCategory: 'Design' },
    { platform: 'TWITTER', url: 'https://twitter.com/dev/status/123456', authorHandle: '@dev_tips', caption: 'Here is how to use React Server Components...', userCategory: 'Tech' },
  ];

  for (const archive of archives) {
    await prisma.archiveItem.create({
      data: {
        userId: MOCK_USER_ID,
        platform: archive.platform,
        url: archive.url,
        authorHandle: archive.authorHandle,
        caption: archive.caption,
        userCategory: archive.userCategory,
      }
    });
  }

  // Seed Wishlist
  const wishlist = [
    { title: 'Fuji X100V', description: 'Compact mirrorless camera', url: 'https://fujifilm.com', price: 150000, category: 'TECH', status: 'WANT' },
    { title: 'Dune Messiah', author: 'Frank Herbert', price: 499, category: 'BOOK', status: 'WANT' } // changed CONSIDERING to WANT (must be WANT, BOUGHT, DROPPED)
  ];

  for (const item of wishlist) {
    await prisma.wishlistItem.create({
      data: {
        userId: MOCK_USER_ID,
        title: item.title,
        description: item.description,
        url: item.url,
        price: item.price,
        category: item.category,
        status: item.status,
      }
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
