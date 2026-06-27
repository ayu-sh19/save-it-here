export function MarqueeTicker() {
  return (
    <div className="bg-[var(--ink)] text-[var(--paper)] py-2.5 border-2 border-[var(--ink)] mb-6 overflow-hidden">
      <div className="flex animate-[ticker-scroll_30s_linear_infinite] whitespace-nowrap">
        <div className="font-body text-[13px] font-medium tracking-[0.08em] px-8 flex items-center">
          ✦ June 2026 <span className="text-[var(--gold)] mx-4">·</span> 
          ₹37,600 spent <span className="text-[var(--gold)] mx-4">·</span> 
          ₹12,400 remaining <span className="text-[var(--gold)] mx-4">·</span> 
          23 txns
        </div>
        {/* Duplicate for seamless looping */}
        <div className="font-body text-[13px] font-medium tracking-[0.08em] px-8 flex items-center">
          ✦ June 2026 <span className="text-[var(--gold)] mx-4">·</span> 
          ₹37,600 spent <span className="text-[var(--gold)] mx-4">·</span> 
          ₹12,400 remaining <span className="text-[var(--gold)] mx-4">·</span> 
          23 txns
        </div>
      </div>
    </div>
  );
}
