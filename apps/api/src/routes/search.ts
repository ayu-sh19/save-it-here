import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { prisma, MOCK_USER_ID } from '../lib/db';

const search = new Hono();

search.get(
  '/global',
  async (c) => {
    const q = c.req.query('q');
    if (!q) {
      return c.json({ error: 'Query parameter q is required' }, 400);
    }

    try {
      // We use plainto_tsquery to safely parse user input into a tsquery
      const results = await prisma.$queryRaw`
        SELECT 
          id, 
          title as headline, 
          content as description, 
          'IDEA' as source, 
          ts_rank(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '')), plainto_tsquery('english', ${q})) as rank
        FROM "Idea"
        WHERE "userId" = ${MOCK_USER_ID} AND to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '')) @@ plainto_tsquery('english', ${q})
        
        UNION ALL
        
        SELECT 
          id, 
          merchant as headline, 
          note as description, 
          'TRANSACTION' as source, 
          ts_rank(to_tsvector('english', coalesce(merchant, '') || ' ' || coalesce(note, '')), plainto_tsquery('english', ${q})) as rank
        FROM "Transaction"
        WHERE "userId" = ${MOCK_USER_ID} AND to_tsvector('english', coalesce(merchant, '') || ' ' || coalesce(note, '')) @@ plainto_tsquery('english', ${q})

        UNION ALL

        SELECT 
          id, 
          title as headline, 
          description as description, 
          'WISHLIST' as source, 
          ts_rank(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')), plainto_tsquery('english', ${q})) as rank
        FROM "WishlistItem"
        WHERE "userId" = ${MOCK_USER_ID} AND to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')) @@ plainto_tsquery('english', ${q})

        UNION ALL

        SELECT 
          id, 
          caption as headline, 
          "authorHandle" as description, 
          'ARCHIVE' as source, 
          ts_rank(to_tsvector('english', coalesce(caption, '') || ' ' || coalesce("authorHandle", '')), plainto_tsquery('english', ${q})) as rank
        FROM "ArchiveItem"
        WHERE "userId" = ${MOCK_USER_ID} AND to_tsvector('english', coalesce(caption, '') || ' ' || coalesce("authorHandle", '')) @@ plainto_tsquery('english', ${q})

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
