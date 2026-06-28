import { type WishlistItem } from '../wishlist/WishlistCard';
import { Check, Clock, Heart, BookOpen } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateWishlistItem, deleteWishlistItem } from '../../lib/api';

interface MediaCardProps {
  item: WishlistItem;
  type: 'movies' | 'books';
}

const STATUS_ICONS: Record<string, any> = {
  watchlist: Clock,
  watched: Check,
  favorites: Heart,
  to_read: Clock,
  reading: BookOpen,
  read: Check,
};

const STATUS_LABELS: Record<string, string> = {
  watchlist: 'Watchlist',
  watched: 'Watched',
  favorites: 'Favorites',
  to_read: 'To Read',
  reading: 'Reading',
  read: 'Read',
};

export function MediaCard({ item, type }: MediaCardProps) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (newStatus: string) => updateWishlistItem(item.id, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteWishlistItem(item.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    }
  });

  const statuses = type === 'movies' 
    ? ['watchlist', 'watched', 'favorites'] 
    : ['to_read', 'reading', 'read', 'favorites'];

  const StatusIcon = STATUS_ICONS[item.status] || Clock;

  return (
    <div id={`media-${item.id}`} className="bg-[var(--white)] border-[3px] border-[var(--ink)] p-4 shadow-[4px_4px_0_var(--ink)] flex flex-col h-full transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--ink)]">
      <div className="flex gap-4">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="w-24 h-36 object-cover border-[3px] border-[var(--ink)]" />
        ) : (
          <div className="w-24 h-36 bg-[var(--ink-10)] border-[3px] border-[var(--ink)] flex items-center justify-center p-2 text-center font-mono text-[10px]">
            No Image
          </div>
        )}
        
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <h3 className="font-display font-bold text-lg text-[var(--ink)] leading-tight line-clamp-2">
              {item.title}
            </h3>
            <p className="font-mono text-xs text-[var(--ink-60)] mt-1">
              {item.author || ''}
            </p>
            {item.genre && (
              <p className="font-mono text-[10px] text-[var(--crimson)] mt-2 line-clamp-2">
                {item.genre}
              </p>
            )}
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <div className="relative inline-flex items-center border-2 border-[var(--ink)] bg-[var(--gold)] font-mono text-[10px] font-bold uppercase shadow-[2px_2px_0_var(--ink)]">
              <StatusIcon className="w-3 h-3 ml-2" />
              <select 
                value={item.status}
                onChange={(e) => updateMutation.mutate(e.target.value)}
                className="appearance-none bg-transparent pl-1 pr-6 py-1 outline-none cursor-pointer"
              >
                {statuses.map(s => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-[var(--ink)]">
                ▾
              </div>
            </div>
            
            <button
              onClick={() => {
                if (confirm('Delete this item?')) {
                  deleteMutation.mutate();
                }
              }}
              className="ml-auto p-1 text-[var(--ink-60)] hover:text-[var(--crimson)] transition-colors"
              title="Delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
