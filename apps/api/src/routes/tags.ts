import { Hono } from 'hono';
import { prisma, MOCK_USER_ID } from '../lib/db';

const tags = new Hono();

tags.get('/', async (c) => {
  try {
    const allTags = await prisma.tag.findMany({
      where: { userId: MOCK_USER_ID },
      orderBy: { name: 'asc' }
    });
    
    return c.json({ data: allTags });
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

export default tags;
