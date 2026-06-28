import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useQuickAddStore, type QuickAddTab } from '../../store/quickAdd';
import { createIdea, createTransaction, updateTransaction, createWishlist, fetchAccounts, fetchCategories, createAccount, createCategory, createLending, createInvestmentAccount, createSavingsGoal } from '../../lib/api';
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
  const [txAccountId, setTxAccountId] = useState(prefillData.txAccountId || '');
  const [txCategoryId, setTxCategoryId] = useState(prefillData.txCategoryId || 'none');
  const [isEditMode, setIsEditMode] = useState(!!prefillData.id);

  // Group Expense & Splits State
  const [isGroupExpense, setIsGroupExpense] = useState(prefillData.type === 'GROUP_EXPENSE');
  const [myShare, setMyShare] = useState('');
  const [participants, setParticipants] = useState<{name: string, amount: string}[]>([]);
  
  const [isSplit, setIsSplit] = useState(!!(prefillData.splits && prefillData.splits.length > 0));
  const [splits, setSplits] = useState<{categoryId: string, amount: string, note: string}[]>(prefillData.splits || []);

  const [wishlistUrl, setWishlistUrl] = useState('');

  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('BANK');
  const [accountBalance, setAccountBalance] = useState('');

  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState('EXPENSE');

  // Inline category creation
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // New states for Lending, Investment, Goal
  const [lendingPerson, setLendingPerson] = useState('');
  const [lendingAmount, setLendingAmount] = useState('');
  const [lendingType, setLendingType] = useState('LENT');
  const [lendingNote, setLendingNote] = useState('');

  const [invName, setInvName] = useState('');
  const [invType, setInvType] = useState('MUTUAL_FUND');
  const [invAmount, setInvAmount] = useState('');

  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');

  // Pre-select first account when loaded
  useEffect(() => {
    if (accounts.length > 0 && !txAccountId) setTxAccountId(accounts[0].id);
  }, [accounts, txAccountId]);

  useEffect(() => {
    if (isOpen) {
      if (prefillData.ideaTitle) setIdeaTitle(prefillData.ideaTitle);
      if (prefillData.ideaContent) setIdeaContent(prefillData.ideaContent);
      if (prefillData.amount) setTxAmount(prefillData.amount.toString());
      if (prefillData.merchant) setTxMerchant(prefillData.merchant);
      if (prefillData.type) setTxType(prefillData.type);
      if (prefillData.accountId) setTxAccountId(prefillData.accountId);
      if (prefillData.categoryId) setTxCategoryId(prefillData.categoryId);
      
      setIsEditMode(!!prefillData.id);
      setIsGroupExpense(prefillData.type === 'GROUP_EXPENSE');
      setMyShare('');
      setParticipants([]);
      setIsSplit(!!(prefillData.splits && prefillData.splits.length > 0));
      setSplits(prefillData.splits || []);
    } else {
      setError('');
      setIdeaTitle(''); setIdeaContent('');
      setTxAmount(''); setTxMerchant('');
      setTxType('EXPENSE');
      setTxCategoryId('none');
      setIsEditMode(false);
      setIsGroupExpense(false); setMyShare(''); setParticipants([]);
      setIsSplit(false); setSplits([]);
      setWishlistUrl('');
      setAccountName(''); setAccountBalance('');
      setCategoryName('');
      setIsAddingCategory(false); setNewCategoryName('');
      setLendingPerson(''); setLendingAmount(''); setLendingNote('');
      setInvName(''); setInvAmount('');
      setGoalName(''); setGoalTarget('');
    }
  }, [isOpen, prefillData]);

  const handleCreateCategoryInline = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const newCat = await createCategory({ name: newCategoryName, type: txType as any });
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
      setTxCategoryId(newCat.id);
      setIsAddingCategory(false);
      setNewCategoryName('');
    } catch(err: any) {
      setError(err.message || 'Failed to create category');
    }
  };

  const ideaMutation = useMutation({
    mutationFn: createIdea,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ideas'] }); closeQuickAdd(); }
  });

  const txMutation = useMutation({
    mutationFn: (data: any) => isEditMode ? updateTransaction(prefillData.id, data) : createTransaction(data),
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

  const lendingMutation = useMutation({
    mutationFn: createLending,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['lending'] }); closeQuickAdd(); }
  });

  const invMutation = useMutation({
    mutationFn: createInvestmentAccount,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['investments'] }); closeQuickAdd(); }
  });

  const goalMutation = useMutation({
    mutationFn: createSavingsGoal,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['investments'] }); closeQuickAdd(); }
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
        
        let txPayload: any = {
          amount: parseFloat(txAmount),
          merchant: txMerchant,
          type: txType,
          paymentMethod: 'UPI',
          date: prefillData.date ? prefillData.date : new Date().toISOString(),
          accountId: txAccountId,
          categoryId: txCategoryId === 'none' ? undefined : txCategoryId
        };

        if (isGroupExpense) {
          txPayload.type = 'GROUP_EXPENSE';
          txPayload.myShare = parseFloat(myShare);
          txPayload.participants = participants.map(p => ({ ...p, amount: parseFloat(p.amount) }));
        }

        if (isSplit && splits.length > 0) {
          txPayload.splits = splits.map(s => ({ ...s, amount: parseFloat(s.amount) }));
          const totalSplit = txPayload.splits.reduce((acc: number, s: any) => acc + s.amount, 0);
          if (Math.abs(totalSplit - txPayload.amount) > 0.01) {
            throw new Error(`Splits sum (₹${totalSplit}) must equal total amount (₹${txPayload.amount})`);
          }
        }

        await txMutation.mutateAsync(txPayload);
      } else if (activeTab === 'wishlist') {
        if (!wishlistUrl) throw new Error('URL is required');
        await wishlistMutation.mutateAsync({ url: wishlistUrl, title: 'Pending Extraction...', status: 'WANT', category: 'OTHER' });
      } else if (activeTab === 'account') {
        if (!accountName) throw new Error('Name is required');
        await accountMutation.mutateAsync({ name: accountName, type: accountType, balance: parseFloat(accountBalance) || 0, currency: 'INR' });
      } else if (activeTab === 'category') {
        if (!categoryName) throw new Error('Name is required');
        await categoryMutation.mutateAsync({ name: categoryName, type: categoryType as any });
      } else if (activeTab === 'lending') {
        if (!lendingPerson || !lendingAmount) throw new Error('Person name and amount are required');
        await lendingMutation.mutateAsync({ personName: lendingPerson, amount: parseFloat(lendingAmount), type: lendingType, status: 'PENDING' });
      } else if (activeTab === 'investment') {
        if (!invName) throw new Error('Name is required');
        await invMutation.mutateAsync({ name: invName, type: invType, initialValue: parseFloat(invAmount || '0') });
      } else if (activeTab === 'goal') {
        if (!goalName || !goalTarget) throw new Error('Name and Target are required');
        await goalMutation.mutateAsync({ name: goalName, targetAmount: parseFloat(goalTarget), color: 'var(--gold)' });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add entry');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const tabs: QuickAddTab[] = ['transaction', 'idea', 'wishlist', 'lending', 'investment', 'goal', 'account', 'category'];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-end md:items-center md:justify-center pt-[10vh] md:pt-0 bg-[var(--ink)]/50 backdrop-blur-sm">
      <div className="w-full h-full md:h-[80vh] md:max-w-md bg-[var(--paper)] md:border-4 md:border-[var(--ink)] md:shadow-[8px_8px_0_var(--ink)] flex flex-col">
        
        <div className="p-4 border-b-4 border-[var(--ink)] flex items-center justify-between bg-white shrink-0">
          <h2 className="font-display font-bold text-xl uppercase tracking-wider">
            {isEditMode && activeTab === 'transaction' ? 'Edit Transaction' : 'Quick Add'}
          </h2>
          <button onClick={closeQuickAdd} className="hover:text-[var(--crimson)] transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {!isEditMode && (
          <div className="flex overflow-x-auto border-b-4 border-[var(--ink)] bg-white font-display text-xs font-bold uppercase tracking-widest shrink-0 scrollbar-hide">
            {tabs.map(tab => (
              <button 
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-4 py-3 border-r-4 border-b-4 border-[var(--ink)] transition-colors ${activeTab === tab ? 'bg-[var(--crimson)] text-white' : 'hover:bg-gray-100'} border-b-0 -mb-1`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

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
            <div className="space-y-6">
              <div>
                <label className="block font-sans font-bold text-xs mb-2 uppercase tracking-widest text-[var(--ink)]">Total Amount (₹)</label>
                <input type="number" autoFocus className="w-full p-4 border-4 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-mono font-bold text-3xl shadow-[4px_4px_0_var(--ink)] bg-[var(--white)]" value={txAmount} onChange={e => setTxAmount(e.target.value)} placeholder="0.00" />
              </div>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <button type="button" onClick={() => setTxType('EXPENSE')} className={`p-2 sm:p-3 font-display font-bold text-xs sm:text-sm uppercase tracking-wider border-4 border-[var(--ink)] transition-all ${txType === 'EXPENSE' ? 'bg-[var(--crimson)] text-white shadow-[4px_4px_0_var(--ink)] -translate-y-1' : 'bg-white text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] hover:bg-gray-50'}`} disabled={isGroupExpense}>
                  Expense
                </button>
                <button type="button" onClick={() => setTxType('INCOME')} className={`p-2 sm:p-3 font-display font-bold text-xs sm:text-sm uppercase tracking-wider border-4 border-[var(--ink)] transition-all ${txType === 'INCOME' ? 'bg-[var(--success)] text-white shadow-[4px_4px_0_var(--ink)] -translate-y-1' : 'bg-white text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] hover:bg-gray-50'}`} disabled={isGroupExpense}>
                  Income
                </button>
                <button type="button" onClick={() => setTxType('INVESTMENT')} className={`p-2 sm:p-3 font-display font-bold text-xs sm:text-sm uppercase tracking-wider border-4 border-[var(--ink)] transition-all ${txType === 'INVESTMENT' ? 'bg-[var(--blue)] text-white shadow-[4px_4px_0_var(--ink)] -translate-y-1' : 'bg-white text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] hover:bg-gray-50'}`} disabled={isGroupExpense}>
                  Invest
                </button>
              </div>

              <div>
                <label className="block font-sans font-bold text-xs mb-2 uppercase tracking-widest text-[var(--ink)]">Merchant</label>
                <input type="text" className="w-full p-3 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-sans font-bold shadow-[2px_2px_0_var(--ink)] bg-[var(--white)] text-lg" value={txMerchant} onChange={e => setTxMerchant(e.target.value)} placeholder="e.g. Swiggy" />
              </div>

              <div>
                <label className="block font-sans font-bold text-xs mb-2 uppercase tracking-widest text-[var(--ink)]">Account</label>
                <div className="flex flex-wrap gap-2">
                  {accounts.map((acc: any) => (
                    <button key={acc.id} type="button" onClick={() => setTxAccountId(acc.id)} className={`px-4 py-2 font-mono font-bold text-xs uppercase tracking-wider border-2 border-[var(--ink)] transition-all ${txAccountId === acc.id ? 'bg-[var(--ink)] text-white shadow-[2px_2px_0_var(--ink)] -translate-y-0.5' : 'bg-white text-[var(--ink)] shadow-[1px_1px_0_var(--ink)] hover:bg-gray-50'}`}>
                      {acc.name}
                    </button>
                  ))}
                  {accounts.length === 0 && <span className="text-sm font-mono text-gray-500">No accounts. Add one first.</span>}
                </div>
              </div>

              {!isSplit && (
                <div>
                  <label className="block font-sans font-bold text-xs mb-2 uppercase tracking-widest text-[var(--ink)]">Category (Optional)</label>
                  <div className="flex flex-wrap gap-2 items-center">
                    <button type="button" onClick={() => setTxCategoryId('none')} className={`px-3 py-1 font-mono font-bold text-[10px] uppercase tracking-wider border-2 border-[var(--ink)] transition-all ${txCategoryId === 'none' ? 'bg-[var(--gold)] text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] -translate-y-0.5' : 'bg-white text-[var(--ink)] shadow-[1px_1px_0_var(--ink)] hover:bg-gray-50'}`}>
                      None
                    </button>
                    {categories.map((cat: any) => (
                      <button key={cat.id} type="button" onClick={() => setTxCategoryId(cat.id)} className={`px-3 py-1 font-mono font-bold text-[10px] uppercase tracking-wider border-2 border-[var(--ink)] transition-all ${txCategoryId === cat.id ? 'bg-[var(--crimson)] text-white shadow-[2px_2px_0_var(--ink)] -translate-y-0.5' : 'bg-white text-[var(--ink)] shadow-[1px_1px_0_var(--ink)] hover:bg-gray-50'}`}>
                        {cat.name}
                      </button>
                    ))}
                    {isAddingCategory ? (
                       <div className="flex items-center gap-1">
                          <input type="text" className="px-2 py-1 font-mono text-[10px] border-2 border-[var(--ink)] w-24 outline-none focus:border-[var(--crimson)] shadow-[1px_1px_0_var(--ink)]" placeholder="Name" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} autoFocus />
                          <button type="button" onClick={handleCreateCategoryInline} className="px-2 py-1 font-bold text-[10px] uppercase bg-[var(--ink)] text-white border-2 border-[var(--ink)] hover:bg-[var(--crimson)] shadow-[1px_1px_0_var(--ink)] transition-all -translate-y-0.5">Save</button>
                          <button type="button" onClick={() => setIsAddingCategory(false)} className="px-2 py-1 font-bold text-[10px] uppercase bg-white border-2 border-[var(--ink)] text-[var(--ink)] hover:bg-gray-50 shadow-[1px_1px_0_var(--ink)] transition-all">Cancel</button>
                       </div>
                    ) : (
                      <button type="button" onClick={() => setIsAddingCategory(true)} className="px-3 py-1 font-mono font-bold text-[10px] uppercase tracking-wider border-2 border-[var(--ink)] border-dashed bg-[var(--paper-soft)] hover:bg-[var(--gold)] transition-colors">
                        + New
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-6 py-4 border-y-4 border-[var(--ink)] bg-[var(--paper-soft)] px-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={isGroupExpense} onChange={(e) => setIsGroupExpense(e.target.checked)} className="w-5 h-5 border-2 border-[var(--ink)] accent-[var(--crimson)]" />
                  <span className="font-display font-bold text-sm uppercase tracking-widest group-hover:text-[var(--crimson)] transition-colors">Group Expense</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={isSplit} onChange={(e) => setIsSplit(e.target.checked)} className="w-5 h-5 border-2 border-[var(--ink)] accent-[var(--crimson)]" />
                  <span className="font-display font-bold text-sm uppercase tracking-widest group-hover:text-[var(--crimson)] transition-colors">Split Expense</span>
                </label>
              </div>

              {isGroupExpense && (
                <div className="p-4 border-4 border-dashed border-[var(--ink)] space-y-4 bg-white shadow-[4px_4px_0_var(--ink)]">
                  <h3 className="font-display font-bold text-sm uppercase tracking-widest text-[var(--crimson)] mb-2">Group Details</h3>
                  <div>
                    <label className="block font-sans font-bold text-xs mb-1 uppercase text-[var(--ink)]">My Share (₹)</label>
                    <input type="number" className="w-full p-2 border-2 border-[var(--ink)] font-mono text-sm shadow-[2px_2px_0_var(--ink)]" value={myShare} onChange={e => setMyShare(e.target.value)} placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block font-sans font-bold text-xs mb-2 uppercase text-[var(--ink)]">Participants</label>
                    {participants.map((p, i) => (
                      <div key={i} className="flex gap-2 mb-3">
                        <input type="text" placeholder="Name" className="flex-1 p-2 border-2 border-[var(--ink)] font-sans text-sm shadow-[2px_2px_0_var(--ink)]" value={p.name} onChange={e => { const newP = [...participants]; newP[i].name = e.target.value; setParticipants(newP); }} />
                        <input type="number" placeholder="₹" className="w-24 p-2 border-2 border-[var(--ink)] font-mono text-sm shadow-[2px_2px_0_var(--ink)]" value={p.amount} onChange={e => { const newP = [...participants]; newP[i].amount = e.target.value; setParticipants(newP); }} />
                        <button type="button" onClick={() => setParticipants(participants.filter((_, idx) => idx !== i))} className="w-10 flex items-center justify-center bg-[var(--ink)] text-white font-bold hover:bg-[var(--crimson)] border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)] transition-colors"><X className="w-4 h-4"/></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setParticipants([...participants, {name: '', amount: ''}])} className="text-xs font-bold uppercase tracking-wider hover:underline text-[var(--gold)] mt-2">+ Add Participant</button>
                  </div>
                </div>
              )}

              {isSplit && (
                <div className="p-4 border-4 border-dashed border-[var(--ink)] space-y-4 bg-white shadow-[4px_4px_0_var(--ink)]">
                  <h3 className="font-display font-bold text-sm uppercase tracking-widest text-[var(--blue)] mb-2">Splits</h3>
                  {splits.map((s, i) => (
                    <div key={i} className="flex gap-2 mb-3">
                      <select className="flex-1 p-2 border-2 border-[var(--ink)] font-sans font-bold text-xs shadow-[2px_2px_0_var(--ink)]" value={s.categoryId} onChange={e => { const newS = [...splits]; newS[i].categoryId = e.target.value; setSplits(newS); }}>
                        <option value="">Category...</option>
                        {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                      </select>
                      <input type="number" placeholder="₹" className="w-24 p-2 border-2 border-[var(--ink)] font-mono text-xs shadow-[2px_2px_0_var(--ink)]" value={s.amount} onChange={e => { const newS = [...splits]; newS[i].amount = e.target.value; setSplits(newS); }} />
                      <button type="button" onClick={() => setSplits(splits.filter((_, idx) => idx !== i))} className="w-10 flex items-center justify-center bg-[var(--ink)] text-white font-bold hover:bg-[var(--crimson)] border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)] transition-colors"><X className="w-4 h-4"/></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setSplits([...splits, {categoryId: '', amount: '', note: ''}])} className="text-xs font-bold uppercase tracking-wider hover:underline text-[var(--blue)] mt-2">+ Add Split</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div>
                <label className="block font-sans font-bold text-sm mb-2 uppercase tracking-widest text-[var(--ink)]">Product / Media URL</label>
                <input type="url" autoFocus className="w-full p-4 border-4 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-sans font-bold shadow-[4px_4px_0_var(--ink)] bg-white text-lg" value={wishlistUrl} onChange={e => setWishlistUrl(e.target.value)} placeholder="https://..." />
                <p className="mt-3 text-xs font-mono font-bold text-[var(--ink)]/60 bg-[var(--gold)]/20 p-2 border-l-4 border-[var(--gold)]">Metadata will be automatically extracted.</p>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-6">
              <div>
                <label className="block font-sans font-bold text-xs mb-2 uppercase tracking-widest text-[var(--ink)]">Account Name</label>
                <input type="text" autoFocus className="w-full p-3 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-sans font-bold shadow-[2px_2px_0_var(--ink)] bg-white text-lg" value={accountName} onChange={e => setAccountName(e.target.value)} placeholder="e.g. HDFC Bank" />
              </div>
              <div>
                <label className="block font-sans font-bold text-xs mb-2 uppercase tracking-widest text-[var(--ink)]">Type</label>
                <div className="flex flex-wrap gap-2">
                  {['BANK', 'CREDIT_CARD', 'WALLET', 'CASH'].map((t) => (
                    <button key={t} type="button" onClick={() => setAccountType(t)} className={`px-4 py-2 font-mono font-bold text-xs uppercase tracking-wider border-2 border-[var(--ink)] transition-all ${accountType === t ? 'bg-[var(--blue)] text-white shadow-[2px_2px_0_var(--ink)] -translate-y-0.5' : 'bg-white text-[var(--ink)] shadow-[1px_1px_0_var(--ink)] hover:bg-gray-50'}`}>
                      {t.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-sans font-bold text-xs mb-2 uppercase tracking-widest text-[var(--ink)]">Current Balance (₹)</label>
                <input type="number" className="w-full p-3 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-mono font-bold text-xl shadow-[2px_2px_0_var(--ink)] bg-white" value={accountBalance} onChange={e => setAccountBalance(e.target.value)} placeholder="0.00" />
              </div>
            </div>
          )}

          {activeTab === 'category' && (
            <div className="space-y-6">
              <div>
                <label className="block font-sans font-bold text-xs mb-2 uppercase tracking-widest text-[var(--ink)]">Category Name</label>
                <input type="text" autoFocus className="w-full p-3 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-sans font-bold shadow-[2px_2px_0_var(--ink)] bg-white text-lg" value={categoryName} onChange={e => setCategoryName(e.target.value)} placeholder="e.g. Food & Dining" />
              </div>
              <div>
                <label className="block font-sans font-bold text-xs mb-2 uppercase tracking-widest text-[var(--ink)]">Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" onClick={() => setCategoryType('EXPENSE')} className={`p-3 font-display font-bold text-sm uppercase tracking-wider border-4 border-[var(--ink)] transition-all ${categoryType === 'EXPENSE' ? 'bg-[var(--crimson)] text-white shadow-[4px_4px_0_var(--ink)] -translate-y-1' : 'bg-white text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] hover:bg-gray-50'}`}>
                    Expense
                  </button>
                  <button type="button" onClick={() => setCategoryType('INCOME')} className={`p-3 font-display font-bold text-sm uppercase tracking-wider border-4 border-[var(--ink)] transition-all ${categoryType === 'INCOME' ? 'bg-[var(--success)] text-white shadow-[4px_4px_0_var(--ink)] -translate-y-1' : 'bg-white text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] hover:bg-gray-50'}`}>
                    Income
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lending' && (
            <div className="space-y-6">
              <div>
                <label className="block font-sans font-bold text-xs mb-2 uppercase tracking-widest text-[var(--ink)]">Person Name</label>
                <input type="text" autoFocus className="w-full p-3 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-sans font-bold shadow-[2px_2px_0_var(--ink)] bg-white text-lg" value={lendingPerson} onChange={e => setLendingPerson(e.target.value)} placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="block font-sans font-bold text-xs mb-2 uppercase tracking-widest text-[var(--ink)]">Amount (₹)</label>
                <input type="number" className="w-full p-3 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-mono font-bold text-xl shadow-[2px_2px_0_var(--ink)] bg-white" value={lendingAmount} onChange={e => setLendingAmount(e.target.value)} placeholder="0.00" />
              </div>
              <div>
                <label className="block font-sans font-bold text-xs mb-2 uppercase tracking-widest text-[var(--ink)]">Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" onClick={() => setLendingType('LENT')} className={`p-3 font-display font-bold text-sm uppercase tracking-wider border-4 border-[var(--ink)] transition-all ${lendingType === 'LENT' ? 'bg-[var(--gold)] text-[var(--ink)] shadow-[4px_4px_0_var(--ink)] -translate-y-1' : 'bg-white text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] hover:bg-gray-50'}`}>
                    I Lent Money
                  </button>
                  <button type="button" onClick={() => setLendingType('BORROWED')} className={`p-3 font-display font-bold text-sm uppercase tracking-wider border-4 border-[var(--ink)] transition-all ${lendingType === 'BORROWED' ? 'bg-[var(--blue)] text-[var(--white)] shadow-[4px_4px_0_var(--ink)] -translate-y-1' : 'bg-white text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] hover:bg-gray-50'}`}>
                    I Borrowed Money
                  </button>
                </div>
              </div>
              <div>
                <label className="block font-sans font-bold text-xs mb-2 uppercase tracking-widest text-[var(--ink)]">Note (Optional)</label>
                <input type="text" className="w-full p-3 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-sans font-bold shadow-[2px_2px_0_var(--ink)] bg-white" value={lendingNote} onChange={e => setLendingNote(e.target.value)} placeholder="Dinner splitting..." />
              </div>
            </div>
          )}

          {activeTab === 'investment' && (
            <div className="space-y-6">
              <div>
                <label className="block font-sans font-bold text-xs mb-2 uppercase tracking-widest text-[var(--ink)]">Investment Name</label>
                <input type="text" autoFocus className="w-full p-3 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-sans font-bold shadow-[2px_2px_0_var(--ink)] bg-white text-lg" value={invName} onChange={e => setInvName(e.target.value)} placeholder="e.g. NIFTY 50" />
              </div>
              <div>
                <label className="block font-sans font-bold text-xs mb-2 uppercase tracking-widest text-[var(--ink)]">Type</label>
                <div className="flex flex-wrap gap-2">
                  {['MUTUAL_FUND', 'STOCKS', 'FD', 'CRYPTO'].map((t) => (
                    <button key={t} type="button" onClick={() => setInvType(t)} className={`px-4 py-2 font-mono font-bold text-xs uppercase tracking-wider border-2 border-[var(--ink)] transition-all ${invType === t ? 'bg-[var(--success)] text-white shadow-[2px_2px_0_var(--ink)] -translate-y-0.5' : 'bg-white text-[var(--ink)] shadow-[1px_1px_0_var(--ink)] hover:bg-gray-50'}`}>
                      {t.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-sans font-bold text-xs mb-2 uppercase tracking-widest text-[var(--ink)]">Current Value (₹)</label>
                <input type="number" className="w-full p-3 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-mono font-bold text-xl shadow-[2px_2px_0_var(--ink)] bg-white" value={invAmount} onChange={e => setInvAmount(e.target.value)} placeholder="0.00" />
              </div>
            </div>
          )}

          {activeTab === 'goal' && (
            <div className="space-y-6">
              <div>
                <label className="block font-sans font-bold text-xs mb-2 uppercase tracking-widest text-[var(--ink)]">Goal Name</label>
                <input type="text" autoFocus className="w-full p-3 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-sans font-bold shadow-[2px_2px_0_var(--ink)] bg-white text-lg" value={goalName} onChange={e => setGoalName(e.target.value)} placeholder="e.g. New Car" />
              </div>
              <div>
                <label className="block font-sans font-bold text-xs mb-2 uppercase tracking-widest text-[var(--ink)]">Target Amount (₹)</label>
                <input type="number" className="w-full p-3 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-mono font-bold text-xl shadow-[2px_2px_0_var(--ink)] bg-white" value={goalTarget} onChange={e => setGoalTarget(e.target.value)} placeholder="0.00" />
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
