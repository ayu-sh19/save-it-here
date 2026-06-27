import { cn } from '../../lib/utils';

export interface WishlistItem {
  id: string;
  title: string;
  price?: number;
  rating?: number;
  category: 'Product' | 'Book' | 'Movie';
  status: 'SAVED' | 'CONSIDERING' | 'PLANNED' | 'PURCHASED' | 'CONSUMED' | 'ABANDONED';
  imageUrl: string;
  tags: string[];
}

interface WishlistCardProps {
  item: WishlistItem;
}

export function WishlistCard({ item }: WishlistCardProps) {
  let statusClass = '';
  switch (item.status) {
    case 'SAVED': statusClass = 'border-[var(--ink-30)] text-[var(--ink-60)]'; break;
    case 'CONSIDERING': statusClass = 'border-[var(--gold)] text-[var(--gold)] bg-[var(--status-warning-bg)]'; break;
    case 'PLANNED': statusClass = 'border-[var(--status-info)] text-[var(--status-info)] bg-[var(--status-info-bg)]'; break;
    case 'PURCHASED': 
    case 'CONSUMED': statusClass = 'border-[var(--status-success)] text-[var(--status-success)] bg-[var(--status-success-bg)]'; break;
    case 'ABANDONED': statusClass = 'border-[var(--status-error)] text-[var(--status-error)] line-through'; break;
  }

  return (
    <div className="bg-[var(--bone)] border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] flex flex-col hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--ink)] transition-all">
      <div className="aspect-[4/3] border-b-2 border-[var(--ink)] overflow-hidden bg-[var(--ink-04)]">
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
      </div>
      
      <div className="p-4 pt-0 flex-1 flex flex-col">
        {/* Category Pill breaking the border */}
        <div className="self-start -mt-3 mb-3 px-3 py-1 font-display text-[10px] font-bold tracking-[0.14em] uppercase bg-[var(--ink)] text-[var(--paper)] border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--crimson)]">
          {item.category}
        </div>
        
        <h3 className="font-display text-base font-semibold leading-tight mb-2">
          {item.title}
        </h3>
        
        {item.price && (
          <div className="font-mono text-lg font-medium text-[var(--crimson)] mb-3">
            ₹{item.price.toLocaleString()}
          </div>
        )}

        {item.rating && (
          <div className="font-mono text-sm font-medium text-[var(--gold)] mb-3">
            ★ {item.rating}
          </div>
        )}

        <div className="flex gap-2 flex-wrap mb-4">
          {item.tags.map(tag => (
            <span key={tag} className="font-mono text-[10px] font-bold uppercase tracking-widest bg-[var(--ink-04)] border border-[var(--ink-15)] px-1.5 py-0.5">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-[var(--ink-15)]">
          <span className={cn(
            "inline-block px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] border-2",
            statusClass
          )}>
            STATUS: {item.status}
          </span>
        </div>
      </div>
    </div>
  );
}
