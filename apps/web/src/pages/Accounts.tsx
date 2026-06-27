import { useQuery } from '@tanstack/react-query';
import { fetchAccounts, fetchCategories } from '../lib/api';
import { Wallet, PiggyBank, CreditCard, Plus } from 'lucide-react';

export function Accounts() {
  const { data: accounts, isLoading: isAccountsLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts,
  });

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

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
            <button className="flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-widest text-[var(--ink)] border-2 border-[var(--ink)] px-2 py-1 shadow-[2px_2px_0_var(--ink)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[0_0_0_var(--ink)] transition-all bg-[var(--gold)]">
              <Plus className="w-3 h-3" /> Add Account
            </button>
          </div>
          <div className="space-y-4">
            {accountItems.map((acc: any) => (
              <div key={acc.id} className="bg-[var(--paper-soft)] border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] p-4 flex justify-between items-center">
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
                <div className="text-right">
                  <p className="font-mono text-lg font-bold">
                    <span className="text-[var(--ink-60)] mr-1">₹</span>
                    {Number(acc.balance).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {accountItems.length === 0 && (
              <div className="p-8 text-center border-2 border-dashed border-[var(--ink-30)] font-mono text-sm text-[var(--ink-60)]">
                No accounts set up yet.
              </div>
            )}
          </div>
        </div>

        {/* Categories Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-xl font-bold uppercase border-l-4 border-[var(--blue)] pl-3">Budget Categories</h2>
            <button className="flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-widest text-[var(--ink)] border-2 border-[var(--ink)] px-2 py-1 shadow-[2px_2px_0_var(--ink)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[0_0_0_var(--ink)] transition-all bg-[var(--paper)]">
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
                <div className="font-mono text-sm">
                  Budget: <span className="font-bold">{cat.budgetAmount ? `₹${cat.budgetAmount}` : 'Unset'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
