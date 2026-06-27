import { Hono } from 'hono';
import { prisma as db, MOCK_USER_ID } from '../lib/db';
import { AccountSchema } from '@save-it-here/shared';

const accounts = new Hono();

// GET all accounts
accounts.get('/', async (c) => {
  try {
    const items = await db.account.findMany({
      where: { userId: MOCK_USER_ID },
      orderBy: { createdAt: 'asc' },
    });
    return c.json({ success: true, data: items });
  } catch (error) {
    console.error('Failed to fetch accounts:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

// POST new account
accounts.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const result = AccountSchema.safeParse(body);
    
    if (!result.success) {
      return c.json({ success: false, error: result.error.errors }, 400);
    }

    const { name, type, balance, currency, icon, color } = result.data;

    const item = await db.account.create({
      data: {
        userId: MOCK_USER_ID,
        name,
        type,
        balance,
        currency,
        icon,
        color,
      }
    });

    return c.json({ success: true, data: item }, 201);
  } catch (error) {
    console.error('Failed to create account:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

// PUT update account
accounts.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const result = AccountSchema.partial().safeParse(body);
    if (!result.success) {
      return c.json({ success: false, error: result.error.errors }, 400);
    }

    const item = await db.account.update({
      where: { id, userId: MOCK_USER_ID },
      data: result.data,
    });

    return c.json({ success: true, data: item });
  } catch (error) {
    console.error('Failed to update account:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

export default accounts;
