import { Hono } from 'hono';
import { prisma as db, MOCK_USER_ID } from '../lib/db';
import { CategorySchema } from '@save-it-here/shared';

const categories = new Hono();

// GET all categories
categories.get('/', async (c) => {
  try {
    const items = await db.category.findMany({
      where: { userId: MOCK_USER_ID },
      include: {
        subCategories: true,
      },
      orderBy: { name: 'asc' },
    });
    return c.json({ success: true, data: items });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

// POST new category
categories.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const result = CategorySchema.safeParse(body);
    
    if (!result.success) {
      return c.json({ success: false, error: result.error.errors }, 400);
    }

    const { name, icon, budgetAmount } = result.data;

    // By default all user-created categories are EXPENSE unless specified otherwise (for now)
    const item = await db.category.create({
      data: {
        userId: MOCK_USER_ID,
        name,
        type: 'EXPENSE',
        icon,
        budgetAmount,
      }
    });

    return c.json({ success: true, data: item }, 201);
  } catch (error) {
    console.error('Failed to create category:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

// PUT update category budget
categories.put('/:id/budget', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    // Only expect budgetAmount
    const amount = Number(body.budgetAmount);
    if (isNaN(amount) || amount < 0) {
      return c.json({ success: false, error: 'Invalid budget amount' }, 400);
    }

    const item = await db.category.update({
      where: { id, userId: MOCK_USER_ID },
      data: { budgetAmount: amount },
    });

    return c.json({ success: true, data: item });
  } catch (error) {
    console.error('Failed to update category budget:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

// PUT update category
categories.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const result = CategorySchema.partial().safeParse(body);
    if (!result.success) {
      return c.json({ success: false, error: result.error.errors }, 400);
    }

    const item = await db.category.update({
      where: { id, userId: MOCK_USER_ID },
      data: result.data,
    });

    return c.json({ success: true, data: item });
  } catch (error) {
    console.error('Failed to update category:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

// DELETE category
categories.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    await db.category.delete({
      where: { id, userId: MOCK_USER_ID },
    });

    return c.json({ success: true });
  } catch (error) {
    console.error('Failed to delete category:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

export default categories;
