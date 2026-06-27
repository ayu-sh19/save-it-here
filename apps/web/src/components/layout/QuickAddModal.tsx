import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useQuickAddStore, type QuickAddTab } from '../../store/quickAdd';
import { createIdea, createTransaction, createWishlist, fetchAccounts, fetchCategories, createAccount, createCategory } from '../../lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function QuickAddModal() {
  const { isOpen, closeQuickAdd, activeTab, setActiveTab, prefillData } = useQuickAddStore();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch accounts & categories for dropdowns
  const { data: accountsData } = useQuery({ queryKey: ['accounts'], queryFn: fetchAccounts, enabled: isOpen });
  const { data: categoriesData } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories, enabled: isOpen });
  const accounts = accountsData || [];
  const categories = categoriesData || [];

  // Form States
  const [ideaTitle, setIdeaTitle] = useState(prefillData.ideaTitle || '');
  const [ideaContent, setIdeaContent] = useState(prefillData.ideaContent || '');
  const [ideaPriority, setIdeaPriority] = useState(prefillData.ideaPriority || 'MEDIUM');
  
  const [txAmount, setTxAmount] = useState(prefillData.txAmount || '');
  const [txMerchant, setTxMerchant] = useState(prefillData.txMerchant || '');
  const [txType, setTxType] = useState(prefillData.txType || 'EXPENSE');
  const [txAccountId, setTxAccountId] = useState('');
  const [txCategoryId, setTxCategoryId] = useState('');

  const [wishlistUrl, setWishlistUrl] = useState('');

  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('BANK');
  const [accountBalance, setAccountBalance] = useState('');

  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState('EXPENSE');

  // Pre-select first account/category when loaded
  useEffect(() => {
    if (accounts.length > 0 && !txAccountId) setTxAccountId(accounts[0].id);
    if (categories.length > 0 && !txCategoryId) setTxCategoryId(categories[0].id);
  }, [accounts, categories, txAccountId, txCategoryId]);

  useEffect(() => {
    if (isOpen) {
      if (prefillData.ideaTitle) setIdeaTitle(prefillData.ideaTitle);
      if (prefillData.ideaContent) setIdeaContent(prefillData.ideaContent);
      if (prefillData.txAmount) setTxAmount(prefillData.txAmount);
      if (prefillData.txMerchant) setTxMerchant(prefillData.txMerchant);
    } else {
      setError('');
      setIdeaTitle(''); setIdeaContent('');
      setTxAmount(''); setTxMerchant('');
      setWishlistUrl('');
      setAccountName(''); setAccountBalance('');
      setCategoryName('');
    }
  }, [isOpen, prefillData]);

  const ideaMutation = useMutation({
    mutationFn: createIdea,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ideas'] }); closeQuickAdd(); }
  });

  const txMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-financial'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      closeQuickAdd(); 
    }
  });

  const wishlistMutation = useMutation({
    mutationFn: createWishlist,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['wishlist'] }); closeQuickAdd(); }
  });

  const accountMutation = useMutation({
    mutationFn: createAccount,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['accounts'] }); closeQuickAdd(); }
  });

  const categoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); closeQuickAdd(); }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (activeTab === 'idea') {
        if (!ideaTitle) throw new Error('Title is required');
        await ideaMutation.mutateAsync({ title: ideaTitle, content: ideaContent, priority: ideaPriority as any, status: 'SPARK' });
      } else if (activeTab === 'transaction') {
        if (!txAmount || !txMerchant) throw new Error('Amount and Merchant are required');
        if (!txAccountId) throw new Error('Please select an account (create one first if empty)');
        await txMutation.mutateAsync({
          amount: parseFloat(txAmount),
          merchant: txMerchant,
          type: txType as any,
          paymentMethod: 'UPI',
          date: new Date().toISOString(),
          accountId: txAccountId,
          categoryId: txCategoryId || undefined
        });
      } else if (activeTab === 'wishlist') {
        if (!wishlistUrl) throw new Error('URL is required');
        await wishlistMutation.mutateAsync({ url: wishlistUrl, title: 'Pending Extraction...', status: 'WANT', category: 'OTHER' });
      } else if (activeTab === 'account') {
        if (!accountName) throw new Error('Name is required');
        await accountMutation.mutateAsync({ name: accountName, type: accountType, balance: parseFloat(accountBalance) || 0, currency: 'INR' });
      } else if (activeTab === 'category') {
        if (!categoryName) throw new Error('Name is required');
        await categoryMutation.mutateAsync({ name: categoryName, type: categoryType as any });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add entry');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const tabs: QuickAddTab[] = ['idea', 'transaction', 'wishlist', 'account', 'category'];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-end md:items-center md:justify-center pt-[10vh] md:pt-0 bg-[var(--ink)]/50 backdrop-blur-sm">
      <div className="w-full h-full md:h-[80vh] md:max-w-md bg-[var(--paper)] md:border-4 md:border-[var(--ink)] md:shadow-[8px_8px_0_var(--ink)] flex flex-col">
        
        <div className="p-4 border-b-4 border-[var(--ink)] flex items-center justify-between bg-white shrink-0">
          <h2 className="font-display font-bold text-xl uppercase tracking-wider">Quick Add</h2>
          <button onClick={closeQuickAdd} className="hover:text-[var(--crimson)] transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-wrap border-b-4 border-[var(--ink)] bg-white font-display text-xs font-bold uppercase tracking-widest shrink-0">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 p-2 border-r-4 border-b-4 border-[var(--ink)] min-w-[30%] transition-colors ${activeTab === tab ? 'bg-[var(--crimson)] text-white' : 'hover:bg-gray-100'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border-2 border-[var(--ink)] text-red-700 font-sans font-bold text-sm">
              {error}
            </div>
          )}

          {activeTab === 'idea' && (
            <div className="space-y-4">
              <div>
                <label className="block font-sans font-bold text-sm mb-1 uppercase tracking-widest text-[var(--ink)]/60">Title</label>
                <input type="text" autoFocus className="w-full p-3 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-sans font-bold shadow-[2px_2px_0_var(--ink)]" value={ideaTitle} onChange={e => setIdeaTitle(e.target.value)} placeholder="App idea, thought, or note" />
              </div>
              <div>
                <label className="block font-sans font-bold text-sm mb-1 uppercase tracking-widest text-[var(--ink)]/60">Priority</label>
                <select className="w-full p-3 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-sans font-bold shadow-[2px_2px_0_var(--ink)]" value={ideaPriority} onChange={e => setIdeaPriority(e.target.value)}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div>
                <label className="block font-sans font-bold text-sm mb-1 uppercase tracking-widest text-[var(--ink)]/60">Content</label>
                <textarea className="w-full p-3 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-sans font-bold shadow-[2px_2px_0_var(--ink)] min-h-[100px]" value={ideaContent} onChange={e => setIdeaContent(e.target.value)} placeholder="Optional details..." />
              </div>
            </div>
          )}

          {activeTab === 'transaction' && (
            <div className="space-y-4">
              <div>
                <label className="block font-sans font-bold text-sm mb-1 uppercase tracking-widest text-[var(--ink)]/60">Amount (₹)</label>
                <input type="number" autoFocus className="w-full p-3 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-mono font-bold text-xl shadow-[2px_2px_0_var(--ink)]" value={txAmount} onChange={e => setTxAmount(e.target.value)} placeholder="0.00" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans font-bold text-sm mb-1 uppercase tracking-widest text-[var(--ink)]/60">Type</label>
                  <select className="w-full p-3 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-sans font-bold shadow-[2px_2px_0_var(--ink)]" value={txType} onChange={e => setTxType(e.target.value)}>
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                  </select>
                </div>
                <div>
                  <label className="block font-sans font-bold text-sm mb-1 uppercase tracking-widest text-[var(--ink)]/60">Merchant</label>
                  <input type="text" className="w-full p-3 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-sans font-bold shadow-[2px_2px_0_var(--ink)]" value={txMerchant} onChange={e => setTxMerchant(e.target.value)} placeholder="e.g. Swiggy" />
                </div>
              </div>
              <div>
                <label className="block font-sans font-bold text-sm mb-1 uppercase tracking-widest text-[var(--ink)]/60">Account</label>
                <select className="w-full p-3 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-sans font-bold shadow-[2px_2px_0_var(--ink)]" value={txAccountId} onChange={e => setTxAccountId(e.target.value)}>
                  <option value="">Select Account...</option>
                  {accounts.map((acc: any) => <option key={acc.id} value={acc.id}>{acc.name} (₹{acc.balance})</option>)}
                </select>
              </div>
              <div>
                <label className="block font-sans font-bold text-sm mb-1 uppercase tracking-widest text-[var(--ink)]/60">Category (Optional)</label>
                <select className="w-full p-3 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-sans font-bold shadow-[2px_2px_0_var(--ink)]" value={txCategoryId} onChange={e => setTxCategoryId(e.target.value)}>
                  <option value="">None</option>
                  {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <div>
                <label className="block font-sans font-bold text-sm mb-1 uppercase tracking-widest text-[var(--ink)]/60">Product / Media URL</label>
                <input type="url" autoFocus className="w-full p-3 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-sans font-bold shadow-[2px_2px_0_var(--ink)]" value={wishlistUrl} onChange={e => setWishlistUrl(e.target.value)} placeholder="https://..." />
                <p className="mt-2 text-xs font-mono text-[var(--ink)]/60">Metadata will be automatically extracted.</p>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-4">
              <div>
                <label className="block font-sans font-bold text-sm mb-1 uppercase tracking-widest text-[var(--ink)]/60">Account Name</label>
                <input type="text" autoFocus className="w-full p-3 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-sans font-bold shadow-[2px_2px_0_var(--ink)]" value={accountName} onChange={e => setAccountName(e.target.value)} placeholder="e.g. HDFC Bank" />
              </div>
              <div>
                <label className="block font-sans font-bold text-sm mb-1 uppercase tracking-widest text-[var(--ink)]/60">Type</label>
                <select className="w-full p-3 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-sans font-bold shadow-[2px_2px_0_var(--ink)]" value={accountType} onChange={e => setAccountType(e.target.value)}>
                  <option value="BANK">Bank</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="WALLET">Wallet</option>
                  <option value="CASH">Cash</option>
                </select>
              </div>
              <div>
                <label className="block font-sans font-bold text-sm mb-1 uppercase tracking-widest text-[var(--ink)]/60">Current Balance (₹)</label>
                <input type="number" className="w-full p-3 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-mono font-bold text-xl shadow-[2px_2px_0_var(--ink)]" value={accountBalance} onChange={e => setAccountBalance(e.target.value)} placeholder="0.00" />
              </div>
            </div>
          )}

          {activeTab === 'category' && (
            <div className="space-y-4">
              <div>
                <label className="block font-sans font-bold text-sm mb-1 uppercase tracking-widest text-[var(--ink)]/60">Category Name</label>
                <input type="text" autoFocus className="w-full p-3 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-sans font-bold shadow-[2px_2px_0_var(--ink)]" value={categoryName} onChange={e => setCategoryName(e.target.value)} placeholder="e.g. Food & Dining" />
              </div>
              <div>
                <label className="block font-sans font-bold text-sm mb-1 uppercase tracking-widest text-[var(--ink)]/60">Type</label>
                <select className="w-full p-3 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-sans font-bold shadow-[2px_2px_0_var(--ink)]" value={categoryType} onChange={e => setCategoryType(e.target.value)}>
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                </select>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full mt-8 bg-[var(--ink)] text-white p-4 font-display font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[var(--crimson)] transition-colors border-2 border-transparent focus:border-[var(--ink)] shadow-[4px_4px_0_var(--crimson)] active:translate-y-1 active:translate-x-1 active:shadow-[0_0_0_var(--crimson)]">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Entry'}
          </button>
        </form>
      </div>
    </div>
  );
}
