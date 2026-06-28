import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTransactions, fetchDashboard } from '../lib/api';
import { MarqueeTicker } from '../components/dashboard/MarqueeTicker';
import { SummaryBlock } from '../components/dashboard/SummaryBlock';
import { BudgetGauge } from '../components/dashboard/BudgetGauge';
import { TransactionLedger } from '../components/dashboard/TransactionLedger';
import { DashboardCharts } from '../components/dashboard/DashboardCharts';
import { Lightbulb, Heart, Grid3X3, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const { data: dashboard, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['dashboard-financial', currentMonth, currentYear],
    queryFn: () => fetchDashboard({ month: currentMonth, year: currentYear }),
  });

  const { data: transactions, isLoading: isTxnsLoading } = useQuery({
    queryKey: ['transactions', currentMonth, currentYear],
    queryFn: () => fetchTransactions({ month: currentMonth, year: currentYear }),
  });

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const isLoading = isDashboardLoading || isTxnsLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-[var(--ink)] border-t-[var(--crimson)] rounded-full animate-spin"></div>
        <p className="mt-4 font-mono text-sm tracking-widest uppercase">Loading Data...</p>
      </div>
    );
  }

  // Calculate total budget from all categories that have a budget
  const localGlobal = localStorage.getItem('global_budget');
  const totalBudget = localGlobal ? parseFloat(localGlobal) : (dashboard?.categorySpend?.reduce((acc: number, cat: any) => acc + (cat.budgetAmount || 0), 0) || 50000);
  const monthName = MONTHS[currentMonth];

  return (
    <div className="w-full max-w-5xl mx-auto pb-24 md:pb-8">
      <MarqueeTicker 
        monthName={monthName}
        year={currentYear}
        spent={dashboard?.currentMonth?.expense || 0}
        remaining={totalBudget - (dashboard?.currentMonth?.expense || 0)}
        txnsCount={transactions?.length || 0}
      />

      <div className="flex items-center justify-between mb-6 bg-[var(--bone)] border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] p-3">
        <button onClick={handlePrevMonth} className="p-2 hover:bg-[var(--gold)] border-2 border-transparent hover:border-[var(--ink)] transition-colors">
          <ChevronLeft className="w-5 h-5 text-[var(--ink)]" />
        </button>
        <h2 className="font-display text-lg font-bold tracking-widest uppercase text-[var(--ink)]">
          {monthName} {currentYear}
        </h2>
        <button onClick={handleNextMonth} className="p-2 hover:bg-[var(--gold)] border-2 border-transparent hover:border-[var(--ink)] transition-colors">
          <ChevronRight className="w-5 h-5 text-[var(--ink)]" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <SummaryBlock 
          totalExpense={dashboard?.currentMonth?.expense || 0} 
        />
        <BudgetGauge 
          spent={dashboard?.currentMonth?.expense || 0} 
          limit={totalBudget > 0 ? totalBudget : 50000}
          categories={dashboard?.categorySpend || []}
        />
      </div>

      <DashboardCharts 
        dailySpend={dashboard?.dailySpend || []}
        categorySpend={dashboard?.categorySpend || []}
      />

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
