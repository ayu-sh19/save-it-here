import { useQuery } from '@tanstack/react-query';
import { WishlistCard, type WishlistItem } from '../components/wishlist/WishlistCard';
import { fetchWishlist } from '../lib/api';
import { useQuickAddStore } from '../store/quickAdd';

export function Wishlist() {
  const { data: items, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist,
  });
  
  const { openQuickAdd } = useQuickAddStore();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-[var(--ink)] border-t-[var(--crimson)] rounded-full animate-spin"></div>
        <p className="mt-4 font-mono text-sm tracking-widest uppercase">Loading Wishlist...</p>
      </div>
    );
  }

  const wishlistItems: WishlistItem[] = items || [];

  return (
    <div className="w-full max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-[var(--ink)]">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-[var(--ink)]">
          WISHLIST
        </h1>
        <div className="flex gap-4">
          <button className="bg-[var(--white)] text-[var(--ink)] px-4 py-2 font-display text-xs font-bold tracking-[0.1em] uppercase border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--ink)] transition-all">
            Filter ▾
          </button>
          <button 
            onClick={() => openQuickAdd('wishlist')}
            className="bg-[var(--crimson)] text-[var(--paper)] px-4 py-2 font-display text-xs font-bold tracking-[0.1em] uppercase border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--ink)] transition-all"
          >
            + Add URL
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.length === 0 ? (
          <div className="col-span-full p-12 text-center border-2 border-dashed border-[var(--ink-30)] font-mono text-[var(--ink-60)]">
            Your wishlist is empty. Add a product URL to start!
          </div>
        ) : (
          wishlistItems.map(item => (
            <WishlistCard key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}
