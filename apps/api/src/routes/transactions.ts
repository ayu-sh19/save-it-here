import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { prisma, MOCK_USER_ID } from '../lib/db';
import { TransactionSchema } from '@save-it-here/shared';

const transactionsRouter = new Hono();

// GET /api/v1/transactions
transactionsRouter.get('/', async (c) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId: MOCK_USER_ID },
    orderBy: { date: 'desc' },
    include: {
      category: true,
      account: true,
    }
  });
  return c.json({ data: transactions });
});

// GET /api/v1/transactions/summary
transactionsRouter.get('/summary', async (c) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId: MOCK_USER_ID },
    select: { amount: true, type: true }
  });

  let totalIncome = 0;
  let totalExpense = 0;

  for (const t of transactions) {
    if (t.type === 'INCOME') totalIncome += t.amount;
    if (t.type === 'EXPENSE') totalExpense += t.amount;
  }

  return c.json({ data: { totalIncome, totalExpense } });
});

// POST /api/v1/transactions
transactionsRouter.post('/', async (c) => {
  const body = await c.req.json();

  const transaction = await prisma.transaction.create({
    data: {
      amount: body.amount,
      type: body.type,
      paymentMethod: body.paymentMethod,
      date: new Date(body.date),
      merchant: body.merchant,
      note: body.note,
      accountId: body.accountId,
      categoryId: body.categoryId,
      userId: MOCK_USER_ID,
    },
    include: { category: true, account: true }
  });

  return c.json({ data: transaction }, 201);
});

// DELETE /api/v1/transactions/:id
transactionsRouter.delete('/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    await prisma.transaction.delete({
      where: { id, userId: MOCK_USER_ID }
    });
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: 'Transaction not found or could not be deleted' }, 404);
  }
});

export { transactionsRouter };
