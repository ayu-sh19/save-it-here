import axios from 'axios';
import type { Transaction, Idea } from '@save-it-here/shared';

// The backend is running on port 3000
const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const { data } = await api.get('/transactions');
  return data.data;
};

export const fetchTransactionSummary = async (): Promise<{ totalIncome: number; totalExpense: number }> => {
  const { data } = await api.get('/transactions/summary');
  return data.data;
};

export const fetchIdeas = async (): Promise<Idea[]> => {
  const { data } = await api.get('/ideas');
  return data.data;
};
