import { Hono } from 'hono';
import { prisma as db, MOCK_USER_ID } from '../lib/db';

const investments = new Hono();

// GET all investment accounts and savings goals
investments.get('/', async (c) => {
  try {
    const [accounts, goals] = await Promise.all([
      db.investmentAccount.findMany({
        where: { userId: MOCK_USER_ID },
        orderBy: { currentValue: 'desc' },
      }),
      db.savingsGoal.findMany({
        where: { userId: MOCK_USER_ID },
        orderBy: { targetAmount: 'desc' },
      }),
    ]);

    return c.json({ success: true, data: { accounts, goals } });
  } catch (error) {
    console.error('Failed to fetch investments:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

// POST new investment account
investments.post('/accounts', async (c) => {
  try {
    const body = await c.req.json();
    const { name, type, initialValue } = body;

    if (!name || !type) {
      return c.json({ success: false, error: 'Name and type are required' }, 400);
    }

    const item = await db.investmentAccount.create({
      data: {
        userId: MOCK_USER_ID,
        name,
        type,
        currentValue: Number(initialValue || 0),
        investedAmount: Number(initialValue || 0),
      }
    });

    return c.json({ success: true, data: item }, 201);
  } catch (error) {
    console.error('Failed to create investment account:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

// POST new savings goal
investments.post('/goals', async (c) => {
  try {
    const body = await c.req.json();
    const { name, targetAmount, deadline, color } = body;

    if (!name || !targetAmount) {
      return c.json({ success: false, error: 'Name and target amount are required' }, 400);
    }

    const item = await db.savingsGoal.create({
      data: {
        userId: MOCK_USER_ID,
        name,
        targetAmount: Number(targetAmount),
        deadline: deadline ? new Date(deadline) : null,
        color,
      }
    });

    return c.json({ success: true, data: item }, 201);
  } catch (error) {
    console.error('Failed to create savings goal:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

export default investments;
