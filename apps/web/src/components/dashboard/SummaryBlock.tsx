interface SummaryBlockProps {
  totalExpense: number;
}

export function SummaryBlock({ totalExpense }: SummaryBlockProps) {
  return (
    <div className="bg-[var(--bone)] border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--ink)]">
      <div className="p-4 border-b-2 border-[var(--ink)]">
        <h3 className="font-display text-[13px] font-semibold tracking-[0.12em] uppercase text-[var(--ink)]">
          MONTHLY EXPENSES
        </h3>
      </div>
      <div className="p-8 font-mono flex flex-col items-center justify-center">
        <div className="text-sm font-bold text-[var(--ink-60)] mb-2 uppercase tracking-widest">
          Total Spent
        </div>
        <div className="text-4xl md:text-5xl font-bold text-[var(--crimson)]">
          ₹ {totalExpense.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
