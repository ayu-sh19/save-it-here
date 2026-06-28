import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { WishlistCard, type WishlistItem } from '../components/wishlist/WishlistCard';
import { fetchWishlist } from '../lib/api';
import { useQuickAddStore } from '../store/quickAdd';

export function Wishlist() {
  const { data: items, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist,
  });
  
  const { openQuickAdd } = useQuickAddStore();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterTag, setFilterTag] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const [openDropdown, setOpenDropdown] = useState<'CATEGORY' | 'TAG' | 'SORT' | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-[var(--ink)] border-t-[var(--crimson)] rounded-full animate-spin"></div>
        <p className="mt-4 font-mono text-sm tracking-widest uppercase">Loading Wishlist...</p>
      </div>
    );
  }

  const allTags = Array.from(new Set((items || []).flatMap((i: any) => i.tags?.map((t: any) => t.name) || [])));
  const allCategories = Array.from(new Set((items || []).map((i: any) => i.category).filter(Boolean)));

  let wishlistItems: WishlistItem[] = (items || []).filter(
    (item: WishlistItem) => {
      if (item.category === 'MOVIE' || item.category === 'BOOK') return false;
      if (filterCategory !== 'ALL' && item.category !== filterCategory) return false;
      if (filterTag !== 'ALL') {
        const itemTags = item.tags?.map(t => t.name) || [];
        if (!itemTags.includes(filterTag)) return false;
      }
      return true;
    }
  );

  wishlistItems.sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
  });

  return (
    <div className="w-full max-w-6xl mx-auto pb-12" onClick={() => setOpenDropdown(null)}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b-2 border-[var(--ink)] gap-4">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-[var(--ink)]">
          WISHLIST
        </h1>
        <div className="flex flex-wrap gap-4">
          
          <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpenDropdown(openDropdown === 'CATEGORY' ? null : 'CATEGORY')}
              className="bg-[var(--white)] text-[var(--ink)] px-4 py-2 font-display text-xs font-bold tracking-[0.1em] uppercase border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--ink)] transition-all flex items-center justify-between min-w-[160px]"
            >
              <span>{filterCategory === 'ALL' ? 'All Categories' : filterCategory}</span>
              <span className="ml-2">▾</span>
            </button>
            {openDropdown === 'CATEGORY' && (
              <div className="absolute top-full left-0 mt-2 w-full bg-[var(--white)] border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] z-10 flex flex-col">
                <button
                  onClick={() => { setFilterCategory('ALL'); setOpenDropdown(null); }}
                  className="px-4 py-2 text-left font-display text-xs font-bold tracking-[0.1em] uppercase hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors border-b border-[var(--ink-10)]"
                >
                  All Categories
                </button>
                {allCategories.map(c => (
                  <button
                    key={c as string}
                    onClick={() => { setFilterCategory(c as string); setOpenDropdown(null); }}
                    className="px-4 py-2 text-left font-display text-xs font-bold tracking-[0.1em] uppercase hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors border-b border-[var(--ink-10)]"
                  >
                    {c as string}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpenDropdown(openDropdown === 'TAG' ? null : 'TAG')}
              className="bg-[var(--white)] text-[var(--ink)] px-4 py-2 font-display text-xs font-bold tracking-[0.1em] uppercase border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--ink)] transition-all flex items-center justify-between min-w-[140px]"
            >
              <span>{filterTag === 'ALL' ? 'All Tags' : filterTag}</span>
              <span className="ml-2">▾</span>
            </button>
            {openDropdown === 'TAG' && (
              <div className="absolute top-full left-0 mt-2 w-full bg-[var(--white)] border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] z-10 flex flex-col">
                <button
                  onClick={() => { setFilterTag('ALL'); setOpenDropdown(null); }}
                  className="px-4 py-2 text-left font-display text-xs font-bold tracking-[0.1em] uppercase hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors border-b border-[var(--ink-10)]"
                >
                  All Tags
                </button>
                {allTags.map(t => (
                  <button
                    key={t as string}
                    onClick={() => { setFilterTag(t as string); setOpenDropdown(null); }}
                    className="px-4 py-2 text-left font-display text-xs font-bold tracking-[0.1em] uppercase hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors border-b border-[var(--ink-10)]"
                  >
                    {t as string}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpenDropdown(openDropdown === 'SORT' ? null : 'SORT')}
              className="bg-[var(--white)] text-[var(--ink)] px-4 py-2 font-display text-xs font-bold tracking-[0.1em] uppercase border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--ink)] transition-all flex items-center justify-between min-w-[120px]"
            >
              <span>{sortBy === 'newest' ? 'Newest' : 'Oldest'}</span>
              <span className="ml-2">▾</span>
            </button>
            {openDropdown === 'SORT' && (
              <div className="absolute top-full left-0 mt-2 w-full bg-[var(--white)] border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] z-10 flex flex-col">
                <button
                  onClick={() => { setSortBy('newest'); setOpenDropdown(null); }}
                  className="px-4 py-2 text-left font-display text-xs font-bold tracking-[0.1em] uppercase hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors border-b border-[var(--ink-10)]"
                >
                  Newest
                </button>
                <button
                  onClick={() => { setSortBy('oldest'); setOpenDropdown(null); }}
                  className="px-4 py-2 text-left font-display text-xs font-bold tracking-[0.1em] uppercase hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors border-b border-[var(--ink-10)]"
                >
                  Oldest
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => openQuickAdd('wishlist')}
            className="bg-[var(--crimson)] text-[var(--paper)] px-4 py-2 font-display text-xs font-bold tracking-[0.1em] uppercase border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--ink)] transition-all ml-auto md:ml-0"
          >
            + Add URL
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.length === 0 ? (
          <div className="col-span-full p-12 text-center border-2 border-dashed border-[var(--ink-30)] font-mono text-[var(--ink-60)]">
            Your wishlist is empty or no items match the filter.
          </div>
        ) : (
          wishlistItems.map(item => (
            <WishlistCard key={item.id} item={item} allCategories={allCategories as string[]} />
          ))
        )}
      </div>
    </div>
  );
}
