import { useQuery } from '@tanstack/react-query';
import { fetchTransactions } from '../lib/api';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useQuickAddStore } from '../store/quickAdd';
import type { Transaction } from '@save-it-here/shared';

export function Transactions() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  const { openQuickAdd } = useQuickAddStore();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-[var(--ink)] border-t-[var(--crimson)] rounded-full animate-spin"></div>
        <p className="mt-4 font-mono text-sm tracking-widest uppercase">Loading Transactions...</p>
      </div>
    );
  }

  const txs: Transaction[] = transactions || [];

  return (
    <div className="w-full max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-[var(--ink)]">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-[var(--ink)]">
          ALL TRANSACTIONS
        </h1>
        <button 
          onClick={() => openQuickAdd('transaction')}
          className="bg-[var(--ink)] text-[var(--paper)] px-4 py-2 font-display text-xs font-bold tracking-[0.1em] uppercase border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--crimson)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--crimson)] transition-all"
        >
          + Quick Add
        </button>
      </div>

      <div className="bg-white border-4 border-[var(--ink)] shadow-[8px_8px_0_var(--ink)]">
        {txs.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-[var(--ink-30)] font-mono text-[var(--ink-60)] m-4">
            No transactions found.
          </div>
        ) : (
          <div className="flex flex-col">
            {txs.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 border-b-2 border-[var(--ink)] last:border-b-0 hover:bg-[var(--paper-soft)] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 border-2 border-[var(--ink)] flex items-center justify-center ${tx.type === 'INCOME' ? 'bg-green-300' : 'bg-red-300'}`}>
                    {tx.type === 'INCOME' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg">{tx.merchant}</h3>
                    <p className="font-mono text-xs text-[var(--ink-60)]">
                      {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-mono font-bold text-lg ${tx.type === 'INCOME' ? 'text-green-600' : 'text-[var(--crimson)]'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                  </p>
                  <p className="font-sans text-xs font-bold uppercase tracking-widest text-[var(--ink-60)] mt-1">
                    {tx.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
