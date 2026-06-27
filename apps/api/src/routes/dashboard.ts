import { Hono } from 'hono';
import { prisma as db, MOCK_USER_ID } from '../lib/db';

const dashboard = new Hono();

dashboard.get('/financial', async (c) => {
  try {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Fetch all transactions for the current month
    const transactions = await db.transaction.findMany({
      where: {
        userId: MOCK_USER_ID,
        date: {
          gte: firstDayOfMonth,
        }
      },
      include: {
        category: true
      }
    });

    let totalIncome = 0;
    let totalExpense = 0;
    let categorySpend: Record<string, { name: string; amount: number; budgetAmount?: number; icon?: string }> = {};
    let dailySpend: Record<string, number> = {};

    transactions.forEach((txn: any) => {
      const amount = Number(txn.amount);
      const dateStr = new Date(txn.date).toISOString().split('T')[0];

      if (txn.type === 'INCOME') {
        totalIncome += amount;
      } else if (txn.type === 'EXPENSE') {
        totalExpense += amount;
        
        // Track category spend
        if (txn.category) {
          if (!categorySpend[txn.categoryId!]) {
            categorySpend[txn.categoryId!] = {
              name: txn.category.name,
              amount: 0,
              budgetAmount: txn.category.budgetAmount ? Number(txn.category.budgetAmount) : undefined,
              icon: txn.category.icon || undefined
            };
          }
          categorySpend[txn.categoryId!].amount += amount;
        }

        // Track daily spend
        if (!dailySpend[dateStr]) {
          dailySpend[dateStr] = 0;
        }
        dailySpend[dateStr] += amount;
      }
    });

    return c.json({
      success: true,
      data: {
        currentMonth: {
          income: totalIncome,
          expense: totalExpense,
          net: totalIncome - totalExpense
        },
        categorySpend: Object.values(categorySpend),
        dailySpend: Object.keys(dailySpend).sort().map(date => ({
          date,
          amount: dailySpend[date]
        }))
      }
    });
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

export default dashboard;
