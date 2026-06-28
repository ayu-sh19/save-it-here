import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { prisma, MOCK_USER_ID } from '../lib/db';
import { TransactionSchema } from '@save-it-here/shared';

const transactionsRouter = new Hono();

// GET /api/v1/transactions
transactionsRouter.get('/', async (c) => {
  const monthQuery = c.req.query('month');
  const yearQuery = c.req.query('year');
  const categoryIdQuery = c.req.query('categoryId');
  const searchQuery = c.req.query('search');

  let whereClause: any = { userId: MOCK_USER_ID };

  if (monthQuery && yearQuery) {
    const month = parseInt(monthQuery); // 0-indexed
    const year = parseInt(yearQuery);
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0, 23, 59, 59, 999);
    whereClause.date = { gte: firstDay, lte: lastDay };
  }

  if (categoryIdQuery) {
    whereClause.categoryId = categoryIdQuery;
  }
  
  if (searchQuery) {
    whereClause.merchant = { contains: searchQuery, mode: 'insensitive' };
  }

  const transactions = await prisma.transaction.findMany({
    where: whereClause,
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

  return await prisma.$transaction(async (tx) => {
    let finalAmount = body.amount;
    let transactionType = body.type;

    if (body.type === 'GROUP_EXPENSE') {
      finalAmount = body.myShare;
      transactionType = 'EXPENSE';

      if (body.participants && body.participants.length > 0) {
        for (const p of body.participants) {
          await tx.lendingEntry.create({
            data: {
              userId: MOCK_USER_ID,
              personName: p.name,
              amount: p.amount,
              type: 'LENT',
              status: 'PENDING',
              note: `Group Expense: ${body.merchant || 'Shared Bill'}`
            }
          });
        }
      }
    }

    const transactionData: any = {
      amount: finalAmount,
      type: transactionType,
      paymentMethod: body.paymentMethod,
      date: new Date(body.date),
      merchant: body.merchant,
      note: body.note,
      accountId: body.accountId,
      categoryId: body.categoryId,
      userId: MOCK_USER_ID,
    };

    if (body.splits && body.splits.length > 0) {
      transactionData.splits = {
        create: body.splits.map((s: any) => ({
          amount: s.amount,
          categoryId: s.categoryId,
          note: s.note
        }))
      };
    }

    const transaction = await tx.transaction.create({
      data: transactionData,
      include: { category: true, account: true, splits: true }
    });

    // Update account balance
    let balanceChange = 0;
    if (transactionType === 'INCOME') {
      balanceChange = finalAmount;
    } else if (transactionType === 'EXPENSE' || transactionType === 'INVESTMENT') {
      balanceChange = -finalAmount;
    }

    if (balanceChange !== 0) {
      await tx.account.update({
        where: { id: body.accountId },
        data: { balance: { increment: balanceChange } }
      });
    }

    return c.json({ data: transaction }, 201);
  });
});

// PUT /api/v1/transactions/:id
transactionsRouter.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();

  try {
    return await prisma.$transaction(async (tx) => {
      const original = await tx.transaction.findUnique({ where: { id, userId: MOCK_USER_ID } });
      if (!original) throw new Error('Not found');

      // Revert original balance
      let revertBalanceChange = 0;
      if (original.type === 'INCOME') revertBalanceChange = -original.amount;
      else if (original.type === 'EXPENSE' || original.type === 'INVESTMENT') revertBalanceChange = original.amount;

      if (revertBalanceChange !== 0) {
        await tx.account.update({
          where: { id: original.accountId },
          data: { balance: { increment: revertBalanceChange } }
        });
      }

      const transactionData: any = {
        amount: body.amount,
        type: body.type,
        paymentMethod: body.paymentMethod,
        date: new Date(body.date),
        merchant: body.merchant,
        note: body.note,
        accountId: body.accountId,
        categoryId: body.categoryId,
      };

      if (body.splits) {
        await tx.transactionSplit.deleteMany({ where: { transactionId: id } });
        if (body.splits.length > 0) {
          transactionData.splits = {
            create: body.splits.map((s: any) => ({
              amount: s.amount,
              categoryId: s.categoryId,
              note: s.note
            }))
          };
        }
      }

      const updated = await tx.transaction.update({
        where: { id, userId: MOCK_USER_ID },
        data: transactionData,
        include: { category: true, account: true, splits: true }
      });

      // Apply new balance
      let newBalanceChange = 0;
      if (updated.type === 'INCOME') newBalanceChange = updated.amount;
      else if (updated.type === 'EXPENSE' || updated.type === 'INVESTMENT') newBalanceChange = -updated.amount;

      if (newBalanceChange !== 0) {
        await tx.account.update({
          where: { id: updated.accountId },
          data: { balance: { increment: newBalanceChange } }
        });
      }

      return c.json({ data: updated });
    });
  } catch (e) {
    return c.json({ error: 'Failed to update transaction' }, 500);
  }
});

// POST /api/v1/transactions/:id/refund
transactionsRouter.post('/:id/refund', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json(); 

  try {
    return await prisma.$transaction(async (tx) => {
      const original = await tx.transaction.findUnique({ where: { id, userId: MOCK_USER_ID } });
      if (!original) throw new Error('Not found');

      const refundAmount = body.amount || original.amount;

      const refundTx = await tx.transaction.create({
        data: {
          amount: refundAmount,
          type: 'INCOME', // Refund is cash in
          paymentMethod: original.paymentMethod,
          date: new Date(),
          merchant: `Refund: ${original.merchant}`,
          accountId: original.accountId,
          categoryId: original.categoryId,
          userId: MOCK_USER_ID,
          refundOfId: original.id
        }
      });

      // Increase account balance for refund (Cash IN)
      await tx.account.update({
        where: { id: original.accountId },
        data: { balance: { increment: refundAmount } }
      });

      return c.json({ data: refundTx });
    });
  } catch (e) {
    return c.json({ error: 'Failed to process refund' }, 500);
  }
});

// DELETE /api/v1/transactions/:id
transactionsRouter.delete('/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    await prisma.$transaction(async (tx) => {
      const original = await tx.transaction.findUnique({ where: { id, userId: MOCK_USER_ID } });
      if (!original) throw new Error('Not found');

      await tx.transaction.delete({
        where: { id, userId: MOCK_USER_ID }
      });

      // Revert balance
      let revertBalanceChange = 0;
      if (original.type === 'INCOME') revertBalanceChange = -original.amount;
      else if (original.type === 'EXPENSE' || original.type === 'INVESTMENT') revertBalanceChange = original.amount;

      if (revertBalanceChange !== 0) {
        await tx.account.update({
          where: { id: original.accountId },
          data: { balance: { increment: revertBalanceChange } }
        });
      }
    });
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: 'Transaction not found or could not be deleted' }, 404);
  }
});

export { transactionsRouter };
