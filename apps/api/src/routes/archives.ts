import { Hono } from 'hono';
import { prisma as db, MOCK_USER_ID } from '../lib/db';
import { ArchiveItemSchema } from '@save-it-here/shared';

const archives = new Hono();

// GET all archive items
archives.get('/', async (c) => {
  try {
    const items = await db.archiveItem.findMany({
      where: { userId: MOCK_USER_ID },
      orderBy: { updatedAt: 'desc' },
      include: {
        tags: true,
        media: true,
      },
    });
    return c.json({ success: true, data: items });
  } catch (error) {
    console.error('Failed to fetch archive items:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

// GET check if url exists in archives
archives.get('/check-duplicate', async (c) => {
  try {
    const url = c.req.query('url');
    if (!url) {
      return c.json({ success: false, error: 'URL is required' }, 400);
    }
    const item = await db.archiveItem.findFirst({
      where: { userId: MOCK_USER_ID, url },
    });
    return c.json({ success: true, isDuplicate: !!item, data: item });
  } catch (error) {
    console.error('Failed to check duplicate:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

// POST new archive item
archives.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const result = ArchiveItemSchema.safeParse(body);
    
    if (!result.success) {
      return c.json({ success: false, error: result.error.errors }, 400);
    }

    const { platform, url, authorHandle, caption, ocrText, userCategory, tags = [], mediaUrls = [], embedHtml } = result.data;

    const item = await db.archiveItem.create({
      data: {
        userId: MOCK_USER_ID,
        platform,
        url,
        authorHandle,
        caption,
        ocrText,
        userCategory,
        embedHtml,
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { userId_name: { userId: MOCK_USER_ID, name: tag.trim().toLowerCase() } },
            create: { userId: MOCK_USER_ID, name: tag.trim().toLowerCase() }
          }))
        },
        media: {
          create: mediaUrls.map((mediaUrl: string, idx: number) => ({
            url: mediaUrl,
            type: 'IMAGE',
            order: idx
          }))
        }
      },
      include: {
        tags: true,
        media: true,
      }
    });

    return c.json({ success: true, data: item }, 201);
  } catch (error) {
    console.error('Failed to create archive item:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

// PATCH archive item (tags etc)
archives.patch('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { tags } = await c.req.json();

    if (tags !== undefined) {
      await db.archiveItem.update({
        where: { id, userId: MOCK_USER_ID },
        data: {
          tags: {
            set: [], // Disconnect old
            connectOrCreate: tags.map((tag: string) => ({
              where: { userId_name: { userId: MOCK_USER_ID, name: tag.trim().toLowerCase() } },
              create: { userId: MOCK_USER_ID, name: tag.trim().toLowerCase() }
            }))
          }
        }
      });
    }

    return c.json({ success: true, message: 'Archive item updated' });
  } catch (error) {
    console.error('Failed to update archive item:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

// DELETE archive item
archives.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    await db.archiveItem.delete({
      where: { id, userId: MOCK_USER_ID },
    });

    return c.json({ success: true, message: 'Archive item deleted' });
  } catch (error) {
    console.error('Failed to delete archive item:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

export default archives;
