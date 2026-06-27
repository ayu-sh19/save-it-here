import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { prisma, MOCK_USER_ID } from '../lib/db';

const search = new Hono();

search.get(
  '/global',
  zValidator('query', z.object({
    q: z.string().min(1)
  })),
  async (c) => {
    const { q } = c.req.valid('query');

    try {
      // We use plainto_tsquery to safely parse user input into a tsquery
      const results = await prisma.$queryRaw`
        SELECT 
          id, 
          title as headline, 
          content as description, 
          'IDEA' as source, 
          ts_rank(search_vector, plainto_tsquery('english', ${q})) as rank
        FROM "Idea"
        WHERE "userId" = ${MOCK_USER_ID} AND search_vector @@ plainto_tsquery('english', ${q})
        
        UNION ALL
        
        SELECT 
          id, 
          merchant as headline, 
          note as description, 
          'TRANSACTION' as source, 
          ts_rank(search_vector, plainto_tsquery('english', ${q})) as rank
        FROM "Transaction"
        WHERE "userId" = ${MOCK_USER_ID} AND search_vector @@ plainto_tsquery('english', ${q})

        UNION ALL

        SELECT 
          id, 
          title as headline, 
          description as description, 
          'WISHLIST' as source, 
          ts_rank(search_vector, plainto_tsquery('english', ${q})) as rank
        FROM "WishlistItem"
        WHERE "userId" = ${MOCK_USER_ID} AND search_vector @@ plainto_tsquery('english', ${q})

        UNION ALL

        SELECT 
          id, 
          caption as headline, 
          "authorHandle" as description, 
          'ARCHIVE' as source, 
          ts_rank(search_vector, plainto_tsquery('english', ${q})) as rank
        FROM "ArchiveItem"
        WHERE "userId" = ${MOCK_USER_ID} AND search_vector @@ plainto_tsquery('english', ${q})

        ORDER BY rank DESC
        LIMIT 50;
      `;

      return c.json({ data: results });
    } catch (error) {
      console.error('Global search error:', error);
      return c.json({ error: 'Failed to execute global search' }, 500);
    }
  }
);

export default search;
