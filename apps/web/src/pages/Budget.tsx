import { useQuery } from '@tanstack/react-query';
import { fetchDashboard } from '../lib/api';
import { PieChart, Activity } from 'lucide-react';

export function Budget() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-[var(--ink)] border-t-[var(--crimson)] rounded-full animate-spin"></div>
        <p className="mt-4 font-mono text-sm tracking-widest uppercase">Loading Budgets...</p>
      </div>
    );
  }

  const { totalExpense } = dashboard?.summary || { totalExpense: 0 };
  const budgetLimit = 100000; // Mock global budget limit
  const percentUsed = Math.min((totalExpense / budgetLimit) * 100, 100);

  return (
    <div className="w-full max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-[var(--ink)]">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-[var(--ink)]">
          BUDGET & ANALYSIS
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--paper)] border-4 border-[var(--ink)] shadow-[8px_8px_0_var(--ink)] p-6">
          <div className="flex items-center gap-3 mb-6 border-b-2 border-[var(--ink)] pb-4">
            <PieChart className="w-6 h-6 text-[var(--crimson)]" />
            <h2 className="font-display font-bold text-xl uppercase tracking-widest">Global Budget</h2>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between font-mono font-bold text-sm mb-2">
              <span>USED: ₹{totalExpense.toLocaleString()}</span>
              <span>LIMIT: ₹{budgetLimit.toLocaleString()}</span>
            </div>
            <div className="h-8 border-2 border-[var(--ink)] bg-[var(--paper-soft)] relative overflow-hidden w-full">
              <div 
                className={`absolute top-0 left-0 bottom-0 transition-all duration-1000 ${percentUsed > 80 ? 'bg-[var(--crimson)]' : 'bg-green-400'} border-r-2 border-[var(--ink)]`}
                style={{ width: `${percentUsed}%` }}
              >
                <div className="w-full h-full opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}></div>
              </div>
            </div>
            <p className="font-sans font-bold text-xs mt-2 uppercase tracking-widest text-[var(--ink-60)]">
              {percentUsed.toFixed(1)}% of budget consumed
            </p>
          </div>
        </div>

        <div className="bg-[var(--gold)] border-4 border-[var(--ink)] shadow-[8px_8px_0_var(--ink)] p-6 flex flex-col items-center justify-center text-center">
          <Activity className="w-12 h-12 mb-4 text-[var(--ink)]" />
          <h2 className="font-display font-bold text-xl uppercase tracking-widest mb-2">Categorical Budgets</h2>
          <p className="font-mono text-sm">Granular category-level budgeting is coming in a future update.</p>
        </div>
      </div>
    </div>
  );
}
