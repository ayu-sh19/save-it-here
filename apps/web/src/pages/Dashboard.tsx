import { useQuery } from '@tanstack/react-query';
import { fetchTransactions, fetchTransactionSummary } from '../lib/api';
import { MarqueeTicker } from '../components/dashboard/MarqueeTicker';
import { SummaryBlock } from '../components/dashboard/SummaryBlock';
import { BudgetGauge } from '../components/dashboard/BudgetGauge';
import { TransactionLedger } from '../components/dashboard/TransactionLedger';
import { Lightbulb, Heart, Grid3X3 } from 'lucide-react';

import { Link } from 'react-router-dom';

function PlaceholderCard({ title, icon: Icon, to }: { title: string; icon: any; to: string }) {
  return (
    <div className="bg-[var(--paper-soft)] border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] opacity-90 transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--ink)]">
      <div className="p-3 border-b-2 border-[var(--ink)] flex items-center gap-2">
        <Icon className="w-4 h-4 text-[var(--ink)]" />
        <h3 className="font-display text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--ink)]">
          {title}
        </h3>
      </div>
      <div className="p-6 flex flex-col items-center justify-center text-center">
        <div className="font-mono text-xs text-[var(--ink-60)] mb-3">Module Ready</div>
        <Link to={to} className="text-[10px] uppercase font-bold tracking-widest bg-[var(--crimson)] text-[var(--paper)] px-3 py-1.5 border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)] hover:shadow-[0_0_0_var(--ink)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
          Open Module
        </Link>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['transactions-summary'],
    queryFn: fetchTransactionSummary,
  });

  const { data: transactions, isLoading: isTxnsLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  const isLoading = isSummaryLoading || isTxnsLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-[var(--ink)] border-t-[var(--crimson)] rounded-full animate-spin"></div>
        <p className="mt-4 font-mono text-sm tracking-widest uppercase">Loading Data...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto pb-24 md:pb-8">
      <MarqueeTicker />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <SummaryBlock 
          totalIncome={summary?.totalIncome || 0} 
          totalExpense={summary?.totalExpense || 0} 
        />
        {/* Hardcoding budget limit for now since it's not in the DB yet */}
        <BudgetGauge 
          spent={summary?.totalExpense || 0} 
          limit={50000} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <TransactionLedger transactions={(transactions || []).slice(0, 5)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PlaceholderCard title="Recent Ideas" icon={Lightbulb} to="/ideas" />
        <PlaceholderCard title="Wishlist" icon={Heart} to="/wishlist" />
        <PlaceholderCard title="Archives" icon={Grid3X3} to="/archive/ig" />
      </div>
    </div>
  );
}
