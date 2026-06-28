import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTransactions, fetchCategories } from '../lib/api';
import { ArrowUpRight, ArrowDownRight, Search, FilterX } from 'lucide-react';
import { useQuickAddStore } from '../store/quickAdd';
import type { Transaction } from '@save-it-here/shared';
import { ConfirmModal } from '../components/layout/ConfirmModal';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const YEARS = [2024, 2025, 2026, 2027];

export function Transactions() {
  const today = new Date();
  const [filterMonth, setFilterMonth] = useState<number | ''>(today.getMonth());
  const [filterYear, setFilterYear] = useState<number | ''>(today.getFullYear());
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [search, setSearch] = useState('');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', filterMonth, filterYear, filterCategory, search],
    queryFn: () => fetchTransactions({ 
      month: filterMonth === '' ? undefined : filterMonth, 
      year: filterYear === '' ? undefined : filterYear, 
      categoryId: filterCategory || undefined,
      search: search || undefined
    }),
  });

  const { openQuickAdd } = useQuickAddStore();

  const [confirmState, setConfirmState] = useState<{isOpen: boolean, title: string, message: string, action: () => void}>({
    isOpen: false, title: '', message: '', action: () => {}
  });

  const txs: Transaction[] = transactions || [];

  return (
    <div className="w-full max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-[var(--ink)]">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-[var(--ink)]">
          TRANSACTION LEDGER
        </h1>
        <button 
          onClick={() => openQuickAdd('transaction')}
          className="bg-[var(--ink)] text-[var(--paper)] px-4 py-2 font-display text-xs font-bold tracking-[0.1em] uppercase border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--crimson)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--crimson)] transition-all"
        >
          + Quick Add
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-[var(--bone)] border-4 border-[var(--ink)] shadow-[6px_6px_0_var(--ink)] p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-60)]" />
            <input 
              type="text" 
              placeholder="Search merchants..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border-2 border-[var(--ink)] bg-[var(--paper)] outline-none focus:border-[var(--crimson)] font-mono text-sm"
            />
          </div>
          
          <select 
            value={filterMonth} 
            onChange={(e) => setFilterMonth(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-3 py-2 border-2 border-[var(--ink)] bg-[var(--paper)] outline-none focus:border-[var(--crimson)] font-mono text-sm appearance-none"
          >
            <option value="">All Months</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>

          <select 
            value={filterYear} 
            onChange={(e) => setFilterYear(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-3 py-2 border-2 border-[var(--ink)] bg-[var(--paper)] outline-none focus:border-[var(--crimson)] font-mono text-sm appearance-none"
          >
            <option value="">All Years</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="flex-1 px-3 py-2 border-2 border-[var(--ink)] bg-[var(--paper)] outline-none focus:border-[var(--crimson)] font-mono text-sm appearance-none truncate"
            >
              <option value="">All Categories</option>
              {categories?.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            
            <button 
              title="Reset Filters"
              onClick={() => {
                setFilterMonth(today.getMonth());
                setFilterYear(today.getFullYear());
                setFilterCategory('');
                setSearch('');
              }}
              className="shrink-0 w-10 h-10 flex items-center justify-center border-2 border-[var(--ink)] bg-[var(--paper)] hover:bg-[var(--gold)] transition-colors"
            >
              <FilterX className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-4 border-[var(--ink)] shadow-[8px_8px_0_var(--ink)] relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="w-8 h-8 border-4 border-[var(--ink)] border-t-[var(--crimson)] rounded-full animate-spin"></div>
          </div>
        )}
        
        {txs.length === 0 && !isLoading ? (
          <div className="p-12 text-center border-2 border-dashed border-[var(--ink-30)] font-mono text-[var(--ink-60)] m-4">
            No transactions found for the selected filters.
          </div>
        ) : (
          <div className="flex flex-col">
            {txs.map((tx) => (
              <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-2 border-b border-[var(--ink-15)] last:border-b-0 hover:bg-[var(--paper-soft)] transition-colors gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 border border-[var(--ink)] flex items-center justify-center shrink-0 ${tx.type === 'INCOME' ? 'bg-[var(--status-success)] text-white' : 'bg-[var(--crimson)] text-[var(--paper)]'}`}>
                    {tx.type === 'INCOME' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm flex items-center gap-2">
                      {tx.merchant}
                      {tx.refundOfId && <span className="text-[9px] bg-[var(--gold)] text-[var(--ink)] px-1 border border-[var(--ink)]">REFUND</span>}
                    </h3>
                    <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--ink-60)]">
                      <span>{new Date(tx.date).toLocaleDateString()}</span>
                      {(tx as any).category && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[120px]">{(tx as any).category.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                  <div className="text-right flex-1 sm:flex-none">
                    <p className={`font-mono font-bold text-sm ${tx.type === 'INCOME' ? 'text-[var(--status-success)]' : 'text-[var(--crimson)]'}`}>
                      {tx.type === 'INCOME' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openQuickAdd('transaction', tx)} className="px-2 py-0.5 border border-[var(--ink)] bg-[var(--paper)] text-[9px] font-bold uppercase hover:bg-[var(--gold)] transition-colors">
                      Edit
                    </button>
                    {tx.type === 'EXPENSE' && !tx.refundOfId && (
                      <button onClick={() => {
                        setConfirmState({
                          isOpen: true,
                          title: 'Process Refund',
                          message: `Are you sure you want to process a full refund for ${tx.merchant} (₹${tx.amount})?`,
                          action: async () => {
                            await fetch(`http://localhost:3000/api/v1/transactions/${tx.id}/refund`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
                            window.location.reload();
                          }
                        });
                      }} className="px-2 py-0.5 border border-[var(--ink)] bg-[var(--paper)] text-[9px] font-bold uppercase hover:bg-[var(--status-success)] hover:text-white transition-colors">
                        Refund
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
