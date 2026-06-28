import { Link } from 'react-router-dom';
import type { Transaction } from '@save-it-here/shared';
import { cn } from '../../lib/utils';
import { Plus, ArrowRight, Trash2 } from 'lucide-react';
import { useQuickAddStore } from '../../store/quickAdd';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ConfirmModal } from '../layout/ConfirmModal';

interface TransactionLedgerProps {
  transactions: Transaction[];
}

export function TransactionLedger({ transactions }: TransactionLedgerProps) {
  const { openQuickAdd } = useQuickAddStore();
  const queryClient = useQueryClient();
  const [confirmState, setConfirmState] = useState<{isOpen: boolean, title: string, message: string, action: () => void}>({
    isOpen: false, title: '', message: '', action: () => {}
  });

  return (
    <div className="bg-[var(--bone)] border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] col-span-1 md:col-span-2">
      <div className="p-4 border-b-2 border-[var(--ink)] flex justify-between items-center bg-[var(--paper)]">
        <h3 className="font-display text-[13px] font-semibold tracking-[0.12em] uppercase text-[var(--ink)]">
          RECENT TRANSACTIONS
        </h3>
        <div className="flex items-center gap-4">
          <Link to="/transactions" className="flex items-center gap-1 font-display text-[11px] font-bold tracking-widest text-[var(--ink-60)] hover:text-[var(--ink)] transition-colors uppercase">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
          <button 
            onClick={() => openQuickAdd('transaction')}
            className="flex items-center gap-1 font-display text-[11px] font-bold tracking-widest text-[var(--crimson)] hover:text-[var(--ink)] transition-colors uppercase"
          >
            Quick-Add <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-[var(--ink-60)] font-body text-sm italic">
            No recent transactions.
          </div>
        ) : (
          transactions.map((t) => (
            <div 
              key={t.id}
              className="grid grid-cols-[80px_1fr_auto] md:grid-cols-[100px_1fr_auto_auto_auto] gap-3 items-center p-3 md:px-5 md:py-3 border-b border-[var(--ink-15)] last:border-b-0 hover:bg-[var(--ink-04)] transition-colors"
            >
              <div className={cn(
                "font-mono font-medium text-[15px]",
                t.type === 'EXPENSE' ? 'text-[var(--crimson)]' : 'text-[var(--status-success)]'
              )}>
                {t.type === 'EXPENSE' ? '-' : '+'}₹{t.amount.toLocaleString()}
              </div>
              
              <div className="flex flex-col overflow-hidden">
                <span className="font-body text-sm font-semibold text-[var(--ink)] truncate">
                  {t.merchant || 'Transfer'}
                </span>
                <span className="font-body text-[11px] text-[var(--ink-60)] truncate md:hidden">
                  {t.note || 'No note'}
                </span>
              </div>

              <div className="hidden md:flex font-body text-xs text-[var(--ink-60)]">
                {t.note || 'No note'}
              </div>

              <div className="font-mono text-[10px] font-medium px-2 py-0.5 border border-[var(--ink-15)] bg-[var(--paper-soft)] uppercase tracking-widest hidden sm:block">
                {t.paymentMethod}
              </div>

              <div className="flex gap-1 justify-end">
                <button 
                  onClick={() => openQuickAdd('transaction', t)} 
                  className="p-1.5 text-[var(--ink-60)] hover:text-[var(--ink)] transition-colors"
                  title="Edit Transaction"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 Z"></path></svg>
                </button>
                <button 
                  onClick={() => {
                    setConfirmState({
                      isOpen: true,
                      title: 'Delete Transaction',
                      message: `Are you sure you want to delete this transaction for ${t.merchant}?`,
                      action: async () => {
                        await fetch(`http://localhost:3000/api/v1/transactions/${t.id}`, { method: 'DELETE' });
                        queryClient.invalidateQueries({ queryKey: ['transactions'] });
                        queryClient.invalidateQueries({ queryKey: ['dashboard-financial'] });
                        queryClient.invalidateQueries({ queryKey: ['accounts'] });
                        queryClient.invalidateQueries({ queryKey: ['investments'] });
                        setConfirmState(prev => ({ ...prev, isOpen: false }));
                      }
                    });
                  }} 
                  className="p-1.5 text-[var(--ink-60)] hover:text-[var(--crimson)] transition-colors"
                  title="Delete Transaction"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
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
