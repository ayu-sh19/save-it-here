import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Setting up PostgreSQL Full-Text Search triggers...');

  // 1. Transaction Trigger
  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION update_transaction_search_vector() RETURNS trigger AS $$
    BEGIN
      NEW.search_vector :=
        setweight(to_tsvector('english', coalesce(NEW.merchant, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(NEW.note, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(NEW.type, '')), 'C') ||
        setweight(to_tsvector('english', coalesce(NEW."paymentMethod", '')), 'D');
      RETURN NEW;
    END
    $$ LANGUAGE plpgsql;
  `);

  await prisma.$executeRawUnsafe(`
    DROP TRIGGER IF EXISTS trigger_update_transaction_search_vector ON "Transaction";
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER trigger_update_transaction_search_vector
    BEFORE INSERT OR UPDATE ON "Transaction"
    FOR EACH ROW EXECUTE FUNCTION update_transaction_search_vector();
  `);

  // 2. Idea Trigger
  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION update_idea_search_vector() RETURNS trigger AS $$
    BEGIN
      NEW.search_vector :=
        setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(NEW.content, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(NEW.status, '')), 'C') ||
        setweight(to_tsvector('english', coalesce(NEW.priority, '')), 'D');
      RETURN NEW;
    END
    $$ LANGUAGE plpgsql;
  `);

  await prisma.$executeRawUnsafe(`
    DROP TRIGGER IF EXISTS trigger_update_idea_search_vector ON "Idea";
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER trigger_update_idea_search_vector
    BEFORE INSERT OR UPDATE ON "Idea"
    FOR EACH ROW EXECUTE FUNCTION update_idea_search_vector();
  `);

  // 3. WishlistItem Trigger
  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION update_wishlist_search_vector() RETURNS trigger AS $$
    BEGIN
      NEW.search_vector :=
        setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(NEW.author, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(NEW.genre, '')), 'C') ||
        setweight(to_tsvector('english', coalesce(NEW.category, '')), 'D');
      RETURN NEW;
    END
    $$ LANGUAGE plpgsql;
  `);

  await prisma.$executeRawUnsafe(`
    DROP TRIGGER IF EXISTS trigger_update_wishlist_search_vector ON "WishlistItem";
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER trigger_update_wishlist_search_vector
    BEFORE INSERT OR UPDATE ON "WishlistItem"
    FOR EACH ROW EXECUTE FUNCTION update_wishlist_search_vector();
  `);

  // 4. ArchiveItem Trigger
  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION update_archive_search_vector() RETURNS trigger AS $$
    BEGIN
      NEW.search_vector :=
        setweight(to_tsvector('english', coalesce(NEW.caption, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(NEW."ocrText", '')), 'B') ||
        setweight(to_tsvector('english', coalesce(NEW."authorHandle", '')), 'C') ||
        setweight(to_tsvector('english', coalesce(NEW.platform, '')), 'D');
      RETURN NEW;
    END
    $$ LANGUAGE plpgsql;
  `);

  await prisma.$executeRawUnsafe(`
    DROP TRIGGER IF EXISTS trigger_update_archive_search_vector ON "ArchiveItem";
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER trigger_update_archive_search_vector
    BEFORE INSERT OR UPDATE ON "ArchiveItem"
    FOR EACH ROW EXECUTE FUNCTION update_archive_search_vector();
  `);

  console.log('Successfully created PostgreSQL Full-Text Search triggers!');
  
  // Re-save existing records to trigger the search vector generation
  console.log('Generating vectors for existing records...');
  
  await prisma.$executeRawUnsafe(`UPDATE "Transaction" SET "updatedAt" = NOW();`);
  await prisma.$executeRawUnsafe(`UPDATE "Idea" SET "updatedAt" = NOW();`);
  await prisma.$executeRawUnsafe(`UPDATE "WishlistItem" SET "updatedAt" = NOW();`);
  await prisma.$executeRawUnsafe(`UPDATE "ArchiveItem" SET "updatedAt" = NOW();`);

  console.log('Finished updating vectors.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
