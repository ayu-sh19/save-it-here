import { WishlistCard, type WishlistItem } from '../components/wishlist/WishlistCard';

// MOCK DATA for Phase 5 (until API is built)
const MOCK_WISHLIST: WishlistItem[] = [
  {
    id: '1',
    title: 'Sony WH-1000XM6 Headphones',
    price: 24999,
    category: 'Product',
    status: 'CONSIDERING',
    imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=450&fit=crop',
    tags: ['Tech', 'Audio']
  },
  {
    id: '2',
    title: 'Designing Data-Intensive Applications',
    price: 599,
    category: 'Book',
    status: 'SAVED',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=450&fit=crop',
    tags: ['Learning', 'System Design']
  },
  {
    id: '3',
    title: 'Oppenheimer (2023)',
    rating: 8.5,
    category: 'Movie',
    status: 'CONSUMED',
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=450&fit=crop',
    tags: ['Nolan', 'Drama']
  },
  {
    id: '4',
    title: 'Mechanical Keyboard (Keychron K2)',
    price: 8500,
    category: 'Product',
    status: 'PLANNED',
    imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&h=450&fit=crop',
    tags: ['Tech', 'Setup']
  }
];

export function Wishlist() {
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
          <button className="bg-[var(--crimson)] text-[var(--paper)] px-4 py-2 font-display text-xs font-bold tracking-[0.1em] uppercase border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--ink)] transition-all">
            + Add URL
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_WISHLIST.map(item => (
          <WishlistCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
