import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const wishlistIds = await prisma.$queryRaw`SELECT id, title, "userId" FROM "WishlistItem"`;
    console.log('Wishlist User IDs:', wishlistIds);
  } catch (e) {
    console.error('Error:', e);
  }
}

main().finally(() => prisma.$disconnect());
