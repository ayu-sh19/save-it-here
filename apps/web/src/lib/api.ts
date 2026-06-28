import axios from 'axios';
import type { Transaction, Idea } from '@save-it-here/shared';

// The backend is running on port 3000
const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchTransactions = async (params?: { month?: number; year?: number; categoryId?: string; search?: string }): Promise<Transaction[]> => {
  let url = '/transactions';
  if (params) {
    const searchParams = new URLSearchParams();
    if (params.month !== undefined) searchParams.append('month', params.month.toString());
    if (params.year !== undefined) searchParams.append('year', params.year.toString());
    if (params.categoryId) searchParams.append('categoryId', params.categoryId);
    if (params.search) searchParams.append('search', params.search);
    const qString = searchParams.toString();
    if (qString) url += `?${qString}`;
  }
  const { data } = await api.get(url);
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

export const createIdea = async (idea: Partial<Idea>): Promise<Idea> => {
  const { data } = await api.post('/ideas', idea);
  return data.data;
};

export const updateIdea = async ({ id, updates }: { id: string; updates: Partial<Idea> }): Promise<Idea> => {
  const { data } = await api.patch(`/ideas/${id}`, updates);
  return data.data;
};

export const fetchWishlist = async () => {
  const { data } = await api.get('/wishlist');
  return data.data;
};

export const fetchArchives = async () => {
  const { data } = await api.get('/archives');
  return data.data;
};

export const fetchDashboard = async (params?: { month?: number; year?: number }) => {
  let url = '/dashboard/financial';
  if (params) {
    const searchParams = new URLSearchParams();
    if (params.month !== undefined) searchParams.append('month', params.month.toString());
    if (params.year !== undefined) searchParams.append('year', params.year.toString());
    const qString = searchParams.toString();
    if (qString) url += `?${qString}`;
  }
  const { data } = await api.get(url);
  return data.data;
};

export const fetchAccounts = async () => {
  const { data } = await api.get('/accounts');
  return data.data;
};

export const updateAccount = async (id: string, account: any) => {
  const { data } = await api.put(`/accounts/${id}`, account);
  return data.data;
};

export const deleteAccount = async (id: string) => {
  const { data } = await api.delete(`/accounts/${id}`);
  return data.data;
};

export const fetchCategories = async () => {
  const { data } = await api.get('/categories');
  return data.data;
};

export const updateCategory = async (id: string, category: any) => {
  const { data } = await api.put(`/categories/${id}`, category);
  return data.data;
};

export const updateCategoryBudget = async (id: string, budgetAmount: number) => {
  const { data } = await api.put(`/categories/${id}/budget`, { budgetAmount });
  return data.data;
};

export const deleteCategory = async (id: string) => {
  const { data } = await api.delete(`/categories/${id}`);
  return data.data;
};

export const fetchLending = async () => {
  const { data } = await api.get('/lending');
  return data.data;
};

export const fetchInvestments = async () => {
  const { data } = await api.get('/investments');
  return data.data;
};

export const createInvestmentAccount = async (account: any) => {
  const { data } = await api.post('/investments/accounts', account);
  return data.data;
};

export const createSavingsGoal = async (goal: any) => {
  const { data } = await api.post('/investments/goals', goal);
  return data.data;
};

export const createTransaction = async (transaction: Partial<Transaction>) => {
  const { data } = await api.post('/transactions', transaction);
  return data.data;
};

export const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
  const { data } = await api.put(`/transactions/${id}`, transaction);
  return data.data;
};

export const refundTransaction = async (id: string, amount?: number) => {
  const { data } = await api.post(`/transactions/${id}/refund`, amount ? { amount } : {});
  return data.data;
};

export const createWishlist = async (item: any) => {
  const { data } = await api.post('/wishlist', item);
  return data.data;
};

export const createAccount = async (account: any) => {
  const { data } = await api.post('/accounts', account);
  return data.data;
};

export const createCategory = async (category: any) => {
  const { data } = await api.post('/categories', category);
  return data.data;
};

export const createLending = async (lending: any) => {
  const { data } = await api.post('/lending', lending);
  return data.data;
};

export const addLendingRepayment = async (id: string, repayment: any) => {
  const { data } = await api.post(`/lending/${id}/repayment`, repayment);
  return data.data;
};

export const searchGlobal = async (query: string) => {
  const { data } = await api.get(`/search/global?q=${encodeURIComponent(query)}`);
  return data;
};

export const discoverMovies = async (query: string) => {
  const { data } = await api.get(`/discover/movies?q=${encodeURIComponent(query)}`);
  return data.data;
};

export const discoverBooks = async (query: string) => {
  const { data } = await api.get(`/discover/books?q=${encodeURIComponent(query)}`);
  return data.data;
};

export const updateWishlistItem = async (id: string, updates: any) => {
  const { data } = await api.patch(`/wishlist/${id}`, updates);
  return data;
};

export const deleteWishlistItem = async (id: string) => {
  const { data } = await api.delete(`/wishlist/${id}`);
  return data;
};

export const parseUrl = async (url: string) => {
  const { data } = await api.post('/metadata/parse-url', { url });
  return data.data;
};
