import { useQuery } from '@tanstack/react-query';
import { fetchInvestments } from '../lib/api';
import { TrendingUp, Target, Plus } from 'lucide-react';
import { useQuickAddStore } from '../store/quickAdd';

export function Investments() {
  const openQuickAdd = useQuickAddStore(state => state.openQuickAdd);
  const { data: investmentsData, isLoading } = useQuery({
    queryKey: ['investments'],
    queryFn: fetchInvestments,
  });

  const handleAddGoal = () => {
    openQuickAdd('goal');
  };

  const handleAddInvestment = () => {
    openQuickAdd('investment');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-[var(--ink)] border-t-[var(--crimson)] rounded-full animate-spin"></div>
        <p className="mt-4 font-mono text-sm tracking-widest uppercase">Loading Investments...</p>
      </div>
    );
  }

  const accounts = investmentsData?.accounts || [];
  const goals = investmentsData?.goals || [];

  const totalInvested = accounts.reduce((acc: number, val: any) => acc + Number(val.investedAmount), 0);
  const totalCurrent = accounts.reduce((acc: number, val: any) => acc + Number(val.currentValue), 0);
  const totalGain = totalCurrent - totalInvested;
  const gainPercentage = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

  return (
    <div className="w-full max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-[var(--ink)]">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-[var(--ink)] flex items-center gap-2">
          <TrendingUp className="w-6 h-6" /> Investments & Goals
        </h1>
        <div className="flex gap-2">
          <button onClick={handleAddGoal} className="flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-widest text-[var(--ink)] border-2 border-[var(--ink)] px-2 py-1 shadow-[2px_2px_0_var(--ink)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[0_0_0_var(--ink)] transition-all bg-[var(--paper-soft)]">
            <Plus className="w-3 h-3" /> Add Goal
          </button>
          <button onClick={handleAddInvestment} className="flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-widest text-[var(--ink)] border-2 border-[var(--ink)] px-2 py-1 shadow-[2px_2px_0_var(--ink)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[0_0_0_var(--ink)] transition-all bg-[var(--gold)]">
            <Plus className="w-3 h-3" /> Add Investment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[var(--white)] border-2 border-[var(--ink)] p-4 shadow-[4px_4px_0_var(--ink)]">
          <p className="font-mono text-[10px] uppercase text-[var(--ink-60)] mb-1">Total Invested</p>
          <p className="font-mono text-2xl font-bold text-[var(--ink)]">₹{totalInvested.toLocaleString()}</p>
        </div>
        <div className="bg-[var(--white)] border-2 border-[var(--ink)] p-4 shadow-[4px_4px_0_var(--ink)]">
          <p className="font-mono text-[10px] uppercase text-[var(--ink-60)] mb-1">Current Value</p>
          <p className="font-mono text-2xl font-bold text-[var(--ink)]">₹{totalCurrent.toLocaleString()}</p>
        </div>
        <div className={`bg-[var(--white)] border-2 border-[var(--ink)] p-4 shadow-[4px_4px_0_var(--ink)]`}>
          <p className="font-mono text-[10px] uppercase text-[var(--ink-60)] mb-1">Unrealized Gain</p>
          <p className={`font-mono text-2xl font-bold ${totalGain >= 0 ? 'text-[var(--success)]' : 'text-[var(--crimson)]'}`}>
            {totalGain >= 0 ? '+' : ''}₹{Math.abs(totalGain).toLocaleString()} 
            <span className="text-sm ml-2">({gainPercentage.toFixed(2)}%)</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Investment Accounts */}
        <div>
          <h2 className="font-display text-xl font-bold uppercase border-l-4 border-[var(--ink)] pl-3 mb-4">Portfolio</h2>
          <div className="space-y-4">
            {accounts.map((acc: any) => (
              <div key={acc.id} className="bg-[var(--paper-soft)] border-2 border-[var(--ink)] p-4 shadow-[4px_4px_0_var(--ink)] flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-[var(--ink)]">{acc.name}</h3>
                  <div className="font-mono text-[10px] uppercase text-[var(--ink-60)] flex gap-2">
                    <span>{acc.type}</span>
                    {acc.institution && <span>• {acc.institution}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-lg">₹{Number(acc.currentValue).toLocaleString()}</p>
                  <p className="font-mono text-[10px] text-[var(--ink-60)]">
                    Invested: ₹{Number(acc.investedAmount).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {accounts.length === 0 && (
              <div className="p-8 text-center border-2 border-dashed border-[var(--ink-30)] font-mono text-sm text-[var(--ink-60)]">
                No investment accounts tracking yet.
              </div>
            )}
          </div>
        </div>

        {/* Savings Goals */}
        <div>
          <h2 className="font-display text-xl font-bold uppercase border-l-4 border-[var(--blue)] pl-3 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" /> Savings Goals
          </h2>
          <div className="space-y-4">
            {goals.map((goal: any) => {
              const current = Number(goal.currentAmount);
              const target = Number(goal.targetAmount);
              const progress = Math.min((current / target) * 100, 100);

              return (
                <div key={goal.id} className="bg-[var(--white)] border-2 border-[var(--ink)] p-4 shadow-[4px_4px_0_var(--ink)]">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-display font-bold text-[var(--ink)]">{goal.name}</h3>
                    <span className="font-mono font-bold text-sm">
                      ₹{current.toLocaleString()} / ₹{target.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-4 bg-[var(--paper)] border-2 border-[var(--ink)] w-full relative overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full border-r-2 border-[var(--ink)]"
                      style={{ 
                        width: `${progress}%`,
                        backgroundColor: goal.color || 'var(--gold)'
                      }}
                    />
                  </div>
                  <div className="mt-2 text-right">
                    <span className="font-mono text-[10px] text-[var(--ink-60)]">{progress.toFixed(1)}% Completed</span>
                  </div>
                </div>
              );
            })}
            {goals.length === 0 && (
              <div className="p-8 text-center border-2 border-dashed border-[var(--ink-30)] font-mono text-sm text-[var(--ink-60)]">
                No savings goals set.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
