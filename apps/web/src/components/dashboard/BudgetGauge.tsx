import { cn } from '../../lib/utils';

interface BudgetGaugeProps {
  spent: number;
  limit: number;
}

export function BudgetGauge({ spent, limit }: BudgetGaugeProps) {
  const percentage = Math.min((spent / limit) * 100, 100);
  
  let statusClass = "bg-[var(--status-success)]";
  if (percentage >= 100) statusClass = "bg-[repeating-linear-gradient(45deg,var(--status-error),var(--status-error)_4px,transparent_4px,transparent_8px)]";
  else if (percentage >= 75) statusClass = "bg-[var(--status-warning)]";

  return (
    <div className="bg-[var(--bone)] border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--ink)]">
      <div className="p-4 border-b-2 border-[var(--ink)]">
        <h3 className="font-display text-[13px] font-semibold tracking-[0.12em] uppercase text-[var(--ink)]">
          BUDGET GAUGE
        </h3>
      </div>
      <div className="p-5">
        <div className="h-3.5 bg-[var(--ink-08)] border-[1.5px] border-[var(--ink)] relative overflow-hidden mb-4">
          <div 
            className={cn("h-full transition-all duration-500 ease-out", statusClass)}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <div className="font-mono flex justify-between items-end mb-6">
          <div>
            <span className="text-xl font-bold text-[var(--ink)]">₹{spent.toLocaleString()}</span>
            <span className="text-sm text-[var(--ink-60)]"> / ₹{limit.toLocaleString()}</span>
          </div>
          <span className="text-xl font-bold">{percentage.toFixed(0)}%</span>
        </div>

        {/* Dummy Categories */}
        <div className="grid grid-cols-2 gap-4 font-mono text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--ink)] border border-[var(--ink)]" />
            <span>Food 22%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--ink-60)] border border-[var(--ink)]" />
            <span>Travel 16%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--ink-30)] border border-[var(--ink)]" />
            <span>Shop 13%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--paper)] border border-[var(--ink)]" />
            <span>Other 49%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
