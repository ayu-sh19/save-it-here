interface SummaryBlockProps {
  totalIncome: number;
  totalExpense: number;
}

export function SummaryBlock({ totalIncome, totalExpense }: SummaryBlockProps) {
  const net = totalIncome - totalExpense;
  const ratio = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;

  return (
    <div className="bg-[var(--bone)] border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--ink)]">
      <div className="p-4 border-b-2 border-[var(--ink)]">
        <h3 className="font-display text-[13px] font-semibold tracking-[0.12em] uppercase text-[var(--ink)]">
          INCOME VS EXPENSE
        </h3>
      </div>
      <div className="p-5 font-mono">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-[var(--ink-60)]">INCOME</span>
          <span className="text-lg text-[var(--status-success)]">₹ {totalIncome.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-[var(--ink-15)]">
          <span className="text-sm font-medium text-[var(--ink-60)]">EXPENSE</span>
          <span className="text-lg text-[var(--crimson)]">₹ {totalExpense.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-[var(--ink)]">NET</span>
          <span className="text-lg font-bold text-[var(--ink)]">₹ {net.toLocaleString()}</span>
        </div>
        
        {/* Visual Ratio Bar */}
        <div className="mt-4 flex items-center gap-3">
          <div className="h-3 flex-1 bg-[var(--ink-08)] border-1.5 border-[var(--ink)] relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 bottom-0 bg-[var(--ink)]"
              style={{ width: `${Math.min(ratio, 100)}%` }}
            />
          </div>
          <span className="text-[11px] font-bold">{ratio.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}
