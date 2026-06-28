import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchLending, addLendingRepayment, fetchAccounts } from '../lib/api';
import { Handshake, Plus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useQuickAddStore } from '../store/quickAdd';

export function Lending() {
  const openQuickAdd = useQuickAddStore(state => state.openQuickAdd);
  const queryClient = useQueryClient();
  
  const { data: lendingEntries, isLoading } = useQuery({
    queryKey: ['lending'],
    queryFn: fetchLending,
  });

  const { data: accountsData } = useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts,
  });
  const accounts = accountsData || [];

  const repayMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => addLendingRepayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lending'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setRepayModal(null);
    }
  });

  const [repayModal, setRepayModal] = useState<{ id: string, amount: string, accountId: string } | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-[var(--ink)] border-t-[var(--crimson)] rounded-full animate-spin"></div>
        <p className="mt-4 font-mono text-sm tracking-widest uppercase">Loading Ledger...</p>
      </div>
    );
  }

  const entries = lendingEntries || [];
  
  const totalLent = entries.filter((e: any) => e.type === 'LEND').reduce((acc: number, e: any) => acc + Number(e.outstandingAmount), 0);
  const totalBorrowed = entries.filter((e: any) => e.type === 'BORROW').reduce((acc: number, e: any) => acc + Number(e.outstandingAmount), 0);

  const handleRepay = (e: React.FormEvent) => {
    e.preventDefault();
    if (repayModal && repayModal.amount && repayModal.accountId) {
      repayMutation.mutate({
        id: repayModal.id,
        data: {
          amount: parseFloat(repayModal.amount),
          accountId: repayModal.accountId,
          date: new Date().toISOString(),
        }
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-[var(--ink)]">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-[var(--ink)] flex items-center gap-2">
          <Handshake className="w-6 h-6" /> Lending Ledger
        </h1>
        <button onClick={() => openQuickAdd('lending')} className="flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-widest text-[var(--ink)] border-2 border-[var(--ink)] px-3 py-1.5 shadow-[4px_4px_0_var(--ink)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[0_0_0_var(--ink)] transition-all bg-[var(--gold)]">
          <Plus className="w-4 h-4" /> New Entry
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[var(--white)] border-2 border-[var(--ink)] p-4 shadow-[4px_4px_0_var(--ink)]">
          <p className="font-mono text-[10px] uppercase text-[var(--ink-60)] mb-1">To Collect (Lent)</p>
          <p className="font-mono text-xl font-bold text-[var(--success)]">₹{totalLent.toLocaleString()}</p>
        </div>
        <div className="bg-[var(--white)] border-2 border-[var(--ink)] p-4 shadow-[4px_4px_0_var(--ink)]">
          <p className="font-mono text-[10px] uppercase text-[var(--ink-60)] mb-1">To Pay (Borrowed)</p>
          <p className="font-mono text-xl font-bold text-[var(--crimson)]">₹{totalBorrowed.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-4">
        {entries.map((entry: any) => (
          <div key={entry.id} className="bg-[var(--paper-soft)] border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className={`p-3 border-2 border-[var(--ink)] ${entry.type === 'LEND' ? 'bg-[var(--success)]' : 'bg-[var(--crimson)]'} text-[var(--white)]`}>
                  {entry.type === 'LEND' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg">{entry.personName}</h3>
                  <div className="flex gap-2 items-center font-mono text-[10px] uppercase">
                    <span className="bg-[var(--ink)] text-[var(--white)] px-1.5 py-0.5">{entry.type}</span>
                    <span className={entry.status === 'SETTLED' ? 'text-[var(--success)] font-bold' : 'text-[var(--gold)] font-bold'}>
                      {entry.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <div>
                  <p className="font-mono text-xs text-[var(--ink-60)]">Original: ₹{Number(entry.principalAmount).toLocaleString()}</p>
                  <p className="font-mono text-xl font-bold text-[var(--ink)]">
                    Outstanding: ₹{Number(entry.outstandingAmount).toLocaleString()}
                  </p>
                </div>
                {entry.status !== 'SETTLED' && (
                  <button onClick={() => setRepayModal({ id: entry.id, amount: entry.outstandingAmount, accountId: '' })} className="px-3 py-1 bg-[var(--ink)] text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-[var(--crimson)] transition-colors">
                    Repay
                  </button>
                )}
              </div>
            </div>
            {repayModal?.id === entry.id && (
              <form onSubmit={handleRepay} className="mt-4 p-4 border-t-2 border-dashed border-[var(--ink)] bg-white grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block font-sans font-bold text-[10px] mb-1 uppercase tracking-widest text-[var(--ink)]/60">Amount</label>
                  <input type="number" max={entry.outstandingAmount} className="w-full p-2 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-mono font-bold text-sm shadow-[2px_2px_0_var(--ink)]" value={repayModal?.amount || ''} onChange={e => setRepayModal(prev => prev ? {...prev, amount: e.target.value} : null)} required />
                </div>
                <div>
                  <label className="block font-sans font-bold text-[10px] mb-1 uppercase tracking-widest text-[var(--ink)]/60">Account</label>
                  <select className="w-full p-2 border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-sans font-bold text-sm shadow-[2px_2px_0_var(--ink)]" value={repayModal?.accountId || ''} onChange={e => setRepayModal(prev => prev ? {...prev, accountId: e.target.value} : null)} required>
                    <option value="">Select Account...</option>
                    {accounts.map((acc: any) => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={repayMutation.isPending} className="flex-1 py-2 bg-[var(--crimson)] text-white font-mono text-xs font-bold uppercase border-2 border-[var(--crimson)]">
                    Confirm
                  </button>
                  <button type="button" onClick={() => setRepayModal(null)} className="px-3 py-2 border-2 border-[var(--ink)] bg-[var(--paper)] text-xs font-bold uppercase hover:bg-gray-200">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ))}
        {entries.length === 0 && (
          <div className="py-12 text-center border-2 border-dashed border-[var(--ink-30)] font-mono text-sm text-[var(--ink-60)]">
            No active lending entries found.
          </div>
        )}
      </div>
    </div>
  );
}
