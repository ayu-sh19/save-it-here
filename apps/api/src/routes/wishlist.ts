import { Hono } from 'hono';
import { prisma as db, MOCK_USER_ID } from '../lib/db';
import { WishlistItemSchema } from '@save-it-here/shared';

const wishlist = new Hono();

// GET all wishlist items
wishlist.get('/', async (c) => {
  try {
    const items = await db.wishlistItem.findMany({
      where: { userId: MOCK_USER_ID },
      orderBy: { updatedAt: 'desc' },
      include: {
        tags: true,
      },
    });
    return c.json({ success: true, data: items });
  } catch (error) {
    console.error('Failed to fetch wishlist items:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});
// GET check if url exists in wishlist
wishlist.get('/check-duplicate', async (c) => {
  try {
    const url = c.req.query('url');
    if (!url) {
      return c.json({ success: false, error: 'URL is required' }, 400);
    }
    const item = await db.wishlistItem.findFirst({
      where: { userId: MOCK_USER_ID, url },
    });
    return c.json({ success: true, isDuplicate: !!item, data: item });
  } catch (error) {
    console.error('Failed to check duplicate:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});
// POST new wishlist item
wishlist.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const result = WishlistItemSchema.safeParse(body);
    
    if (!result.success) {
      return c.json({ success: false, error: result.error.errors }, 400);
    }

    const { title, description, url, price, currency, status, category, author, genre, imageUrl, tags } = result.data;

    const item = await db.wishlistItem.create({
      data: {
        userId: MOCK_USER_ID,
        title,
        description,
        url,
        price,
        currency: currency || "INR",
        status,
        category,
        author,
        genre,
        imageUrl,
        tags: tags && tags.length > 0 ? {
          connectOrCreate: tags.map(tag => ({
            where: { userId_name: { userId: MOCK_USER_ID, name: tag.trim() } },
            create: { userId: MOCK_USER_ID, name: tag.trim() }
          }))
        } : undefined,
      },
      include: {
        tags: true,
      }
    });

    return c.json({ success: true, data: item }, 201);
  } catch (error) {
    console.error('Failed to create wishlist item:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

// PATCH update wishlist item
wishlist.patch('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    // Partial validation
    const result = WishlistItemSchema.partial().safeParse(body);
    if (!result.success) {
      return c.json({ success: false, error: result.error.errors }, 400);
    }

    const { tags, ...data } = result.data;
    const updateData: any = { ...data };

    if (tags !== undefined) {
      updateData.tags = {
        set: [], // clear existing tags
        connectOrCreate: tags.map(tag => ({
          where: { userId_name: { userId: MOCK_USER_ID, name: tag.trim() } },
          create: { userId: MOCK_USER_ID, name: tag.trim() }
        }))
      };
    }

    const item = await db.wishlistItem.update({
      where: { id, userId: MOCK_USER_ID },
      data: updateData,
      include: {
        tags: true,
      }
    });

    return c.json({ success: true, data: item });
  } catch (error) {
    console.error('Failed to update wishlist item:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

// DELETE wishlist item
wishlist.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    await db.wishlistItem.delete({
      where: { id, userId: MOCK_USER_ID },
    });

    return c.json({ success: true, message: 'Wishlist item deleted' });
  } catch (error) {
    console.error('Failed to delete wishlist item:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

export default wishlist;
