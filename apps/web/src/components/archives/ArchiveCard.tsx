import { cn } from '../../lib/utils';
import { ExternalLink } from 'lucide-react';

export interface ArchiveItem {
  id: string;
  platform: 'Instagram' | 'Twitter';
  handle: string;
  content: string;
  imageUrl?: string;
  url: string;
  isDeadLink: boolean;
  tags: string[];
}

interface ArchiveCardProps {
  item: ArchiveItem;
}

export function ArchiveCard({ item }: ArchiveCardProps) {
  return (
    <div className={cn(
      "bg-[var(--bone)] border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] overflow-hidden transition-all group mb-4",
      "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--ink)]"
    )}>
      {item.isDeadLink && (
        <div className="absolute top-2 right-2 z-10 font-mono text-[9px] font-bold px-2 py-0.5 bg-[var(--status-error)] text-[var(--white)] border-[1.5px] border-[var(--ink)] tracking-[0.1em] uppercase">
          🔗 DEAD
        </div>
      )}

      {item.imageUrl && (
        <a href={item.url} target="_blank" rel="noreferrer" className="block w-full border-b-2 border-[var(--ink)] relative">
          <img src={item.imageUrl} alt="Archive content" className="w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </a>
      )}

      <div className="p-3">
        <div className="font-mono text-[11px] font-bold text-[var(--crimson)] mb-1.5 truncate">
          @{item.handle}
        </div>
        
        <p className="font-body text-[13px] text-[var(--ink-90)] leading-snug line-clamp-4 mb-2">
          {item.content}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {item.tags.map(tag => (
            <span key={tag} className="text-[10px] text-[var(--ink-60)]">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[var(--ink-15)]">
          <span className={cn(
            "inline-flex items-center gap-1 font-display text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 border-[1.5px] border-[var(--ink)]",
            item.platform === 'Instagram' ? "bg-[linear-gradient(135deg,#F58529,#DD2A7B,#8134AF)] text-white" : "bg-[var(--ink)] text-[var(--paper)]"
          )}>
            {item.platform}
          </span>
          <a href={item.url} target="_blank" rel="noreferrer" className="text-[var(--ink-60)] hover:text-[var(--ink)] transition-colors">
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
