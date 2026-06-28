interface MarqueeTickerProps {
  monthName: string;
  year: number;
  spent: number;
  remaining: number;
  txnsCount: number;
}

export function MarqueeTicker({ monthName, year, spent, remaining, txnsCount }: MarqueeTickerProps) {
  return (
    <div className="bg-[var(--ink)] text-[var(--paper)] py-2.5 border-2 border-[var(--ink)] mb-6 overflow-hidden">
      <div className="flex animate-[ticker-scroll_30s_linear_infinite] whitespace-nowrap">
        <div className="font-body text-[13px] font-medium tracking-[0.08em] px-8 flex items-center">
          ✦ {monthName} {year} <span className="text-[var(--gold)] mx-4">·</span> 
          ₹{spent.toLocaleString()} spent <span className="text-[var(--gold)] mx-4">·</span> 
          ₹{remaining.toLocaleString()} remaining <span className="text-[var(--gold)] mx-4">·</span> 
          {txnsCount} txns
        </div>
        {/* Duplicate for seamless looping */}
        <div className="font-body text-[13px] font-medium tracking-[0.08em] px-8 flex items-center">
          ✦ {monthName} {year} <span className="text-[var(--gold)] mx-4">·</span> 
          ₹{spent.toLocaleString()} spent <span className="text-[var(--gold)] mx-4">·</span> 
          ₹{remaining.toLocaleString()} remaining <span className="text-[var(--gold)] mx-4">·</span> 
          {txnsCount} txns
        </div>
      </div>
    </div>
  );
}
