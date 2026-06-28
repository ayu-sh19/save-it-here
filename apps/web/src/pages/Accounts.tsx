import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAccounts, fetchCategories, deleteAccount, updateAccount, deleteCategory, updateCategoryBudget } from '../lib/api';
import { Wallet, PiggyBank, CreditCard, Plus, Trash2, Edit2 } from 'lucide-react';
import { useQuickAddStore } from '../store/quickAdd';
import { PromptModal } from '../components/layout/PromptModal';
import { ConfirmModal } from '../components/layout/ConfirmModal';

export function Accounts() {
  const queryClient = useQueryClient();
  const openQuickAdd = useQuickAddStore(state => state.openQuickAdd);
  
  // Modal states
  const [promptState, setPromptState] = useState<{isOpen: boolean, title: string, defaultValue: string, type: 'text'|'number', action: (v: string) => void}>({
    isOpen: false, title: '', defaultValue: '', type: 'text', action: () => {}
  });
  const [confirmState, setConfirmState] = useState<{isOpen: boolean, title: string, message: string, action: () => void}>({
    isOpen: false, title: '', message: '', action: () => {}
  });

  const { data: accounts, isLoading: isAccountsLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts,
  });

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const delAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] })
  });

  const updateAccountMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => updateAccount(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] })
  });

  const delCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
  });

  const updateBudgetMutation = useMutation({
    mutationFn: ({ id, amount }: { id: string, amount: number }) => updateCategoryBudget(id, amount),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
  });

  const handleEditBalance = (acc: any) => {
    setPromptState({
      isOpen: true,
      title: `Edit Balance: ${acc.name}`,
      defaultValue: String(acc.balance),
      type: 'number',
      action: (val: string) => {
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) {
          updateAccountMutation.mutate({ id: acc.id, data: { balance: parsed } });
        }
        setPromptState(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleDeleteAccount = (id: string, name: string) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete Account',
      message: `Are you sure you want to delete ${name}? This will also remove any transactions associated with this account.`,
      action: () => {
        delAccountMutation.mutate(id);
        setConfirmState(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleEditBudget = (cat: any) => {
    setPromptState({
      isOpen: true,
      title: `Edit Budget: ${cat.name}`,
      defaultValue: String(cat.budgetAmount || 0),
      type: 'number',
      action: (val: string) => {
        const parsed = parseFloat(val);
        if (!isNaN(parsed) && parsed >= 0) {
          updateBudgetMutation.mutate({ id: cat.id, amount: parsed });
        }
        setPromptState(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleDeleteCategory = (id: string, name: string) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete Category',
      message: `Are you sure you want to delete the category "${name}"?`,
      action: () => {
        delCategoryMutation.mutate(id);
        setConfirmState(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  if (isAccountsLoading || isCategoriesLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-[var(--ink)] border-t-[var(--crimson)] rounded-full animate-spin"></div>
        <p className="mt-4 font-mono text-sm tracking-widest uppercase">Loading Accounts...</p>
      </div>
    );
  }

  const accountItems = accounts || [];
  const categoryItems = categories || [];

  return (
    <div className="w-full max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-[var(--ink)]">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-[var(--ink)]">
          ACCOUNTS & BUDGETS
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Accounts Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-xl font-bold uppercase border-l-4 border-[var(--crimson)] pl-3">Your Accounts</h2>
            <button 
              onClick={() => openQuickAdd('account')}
              className="flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-widest text-[var(--ink)] border-2 border-[var(--ink)] px-2 py-1 shadow-[2px_2px_0_var(--ink)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[0_0_0_var(--ink)] transition-all bg-[var(--gold)]"
            >
              <Plus className="w-3 h-3" /> Add Account
            </button>
          </div>
          <div className="space-y-4">
            {accountItems.map((acc: any) => (
              <div key={acc.id} className="bg-[var(--paper-soft)] border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--ink)] transition-all gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[var(--ink)] text-[var(--paper)] p-2 rounded-none">
                    {acc.type === 'BANK' ? <PiggyBank className="w-5 h-5" /> : 
                     acc.type === 'CREDIT_CARD' ? <CreditCard className="w-5 h-5" /> : 
                     <Wallet className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-[var(--ink)]">{acc.name}</h3>
                    <p className="font-mono text-[10px] text-[var(--ink-60)]">{acc.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                  <p className="font-mono text-lg font-bold">
                    <span className="text-[var(--ink-60)] mr-1">₹</span>
                    {Number(acc.balance).toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditBalance(acc)} className="text-[var(--blue)] hover:bg-[var(--blue)] hover:text-white p-1 border border-transparent hover:border-[var(--ink)] transition-colors" title="Edit Balance">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteAccount(acc.id, acc.name)} className="text-[var(--crimson)] hover:bg-[var(--crimson)] hover:text-white p-1 border border-transparent hover:border-[var(--ink)] transition-colors" title="Delete Account">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {accountItems.length === 0 && (
              <div className="p-8 text-center border-2 border-dashed border-[var(--ink-30)] font-mono text-sm text-[var(--ink-60)]">
                No accounts set up yet. Click "Add Account" to get started.
              </div>
            )}
          </div>
        </div>

        {/* Categories Section */}
        <div>
          <div className="mb-6 p-4 border-2 border-[var(--ink)] bg-[var(--gold)] shadow-[4px_4px_0_var(--ink)] flex justify-between items-center">
            <div>
              <h2 className="font-display text-lg font-bold uppercase tracking-wider">Global Monthly Budget</h2>
              <p className="font-mono text-[10px] text-[var(--ink-60)]">Set an overall limit or let it sum from categories.</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xl font-bold">
                ₹{localStorage.getItem('global_budget') || categoryItems.reduce((acc: number, cat: any) => acc + (cat.budgetAmount || 0), 0) || 50000}
              </span>
              <button 
                onClick={() => {
                  const current = localStorage.getItem('global_budget') || '';
                  setPromptState({
                    isOpen: true,
                    title: 'Set Global Budget',
                    defaultValue: current,
                    type: 'number',
                    action: (val: string) => {
                      if (!val) {
                        localStorage.removeItem('global_budget');
                      } else {
                        const parsed = parseFloat(val);
                        if (!isNaN(parsed) && parsed > 0) {
                          localStorage.setItem('global_budget', parsed.toString());
                        }
                      }
                      setPromptState(prev => ({ ...prev, isOpen: false }));
                      // trigger re-render
                      window.dispatchEvent(new Event('storage'));
                    }
                  });
                }}
                className="text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--white)] p-2 border-2 border-[var(--ink)] bg-white transition-colors shadow-[2px_2px_0_var(--ink)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5" title="Edit Global Budget">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-xl font-bold uppercase border-l-4 border-[var(--blue)] pl-3">Budget Categories</h2>
            <button 
              onClick={() => openQuickAdd('category')}
              className="flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-widest text-[var(--ink)] border-2 border-[var(--ink)] px-2 py-1 shadow-[2px_2px_0_var(--ink)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[0_0_0_var(--ink)] transition-all bg-[var(--paper)]"
            >
              <Plus className="w-3 h-3" /> New
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {categoryItems.map((cat: any) => (
              <div key={cat.id} className="flex justify-between items-center border-2 border-[var(--ink)] bg-[var(--white)] p-3 shadow-[2px_2px_0_var(--ink)]">
                <div>
                  <span className="font-display font-bold">{cat.icon || '📌'} {cat.name}</span>
                  <span className="ml-2 font-mono text-[9px] bg-[var(--ink)] text-[var(--white)] px-1.5 py-0.5 uppercase tracking-widest">{cat.type}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-mono text-sm">
                    Budget: <span className="font-bold">{cat.budgetAmount ? `₹${cat.budgetAmount}` : 'Unset'}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEditBudget(cat)} className="text-[var(--blue)] hover:bg-[var(--blue)] hover:text-white p-1 border border-transparent hover:border-[var(--ink)] transition-colors" title="Edit Budget">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteCategory(cat.id, cat.name)} className="text-[var(--crimson)] hover:bg-[var(--crimson)] hover:text-white p-1 border border-transparent hover:border-[var(--ink)] transition-colors" title="Delete Category">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <PromptModal
        isOpen={promptState.isOpen}
        title={promptState.title}
        defaultValue={promptState.defaultValue}
        type={promptState.type}
        onClose={() => setPromptState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={promptState.action}
      />

      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmState.action}
      />
    </div>
  );
}
