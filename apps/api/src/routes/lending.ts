import { Hono } from 'hono';
import { prisma as db, MOCK_USER_ID } from '../lib/db';
import { LendingEntrySchema } from '@save-it-here/shared';

const lending = new Hono();

// GET all lending entries
lending.get('/', async (c) => {
  try {
    const items = await db.lendingEntry.findMany({
      where: { userId: MOCK_USER_ID },
      include: {
        repayments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    // Map to frontend expected shape
    const formattedItems = items.map(item => {
      const repaidAmount = item.repayments.reduce((acc, r) => acc + r.amount, 0);
      return {
        ...item,
        type: item.type === 'LENT' ? 'LEND' : 'BORROW', // map DB enum to frontend
        principalAmount: item.amount,
        outstandingAmount: Math.max(0, item.amount - repaidAmount),
      };
    });
    return c.json({ success: true, data: formattedItems });
  } catch (error) {
    console.error('Failed to fetch lending entries:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

// POST new repayment
lending.post('/:id/repayment', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const amount = Number(body.amount);
    const { date, note } = body;

    if (isNaN(amount) || amount <= 0 || !date) {
      return c.json({ success: false, error: 'Invalid repayment data' }, 400);
    }

    // Wrap in a transaction to ensure atomic updates
    const result = await db.$transaction(async (tx: any) => {
      const entry = await tx.lendingEntry.findUnique({
        where: { id, userId: MOCK_USER_ID },
        include: { repayments: true }
      });

      if (!entry) {
        throw new Error('Entry not found');
      }

      // Create repayment
      const repayment = await tx.lendingRepayment.create({
        data: {
          lendingEntryId: id,
          amount,
          date: new Date(date),
          note,
        }
      });

      const totalRepaid = entry.repayments.reduce((acc: number, r: any) => acc + r.amount, 0) + amount;
      const newOutstanding = entry.amount - totalRepaid;
      const newStatus = newOutstanding <= 0 ? 'SETTLED' : 'PARTIAL';

      const updatedEntry = await tx.lendingEntry.update({
        where: { id },
        data: {
          status: newStatus,
        }
      });

      return { repayment, updatedEntry };
    });

    return c.json({ success: true, data: result }, 201);
  } catch (error) {
    console.error('Failed to log repayment:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

export default lending;
