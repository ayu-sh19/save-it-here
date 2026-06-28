import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { discoverBooks, createWishlist } from '../lib/api';
import { Search, Book, Loader2 } from 'lucide-react';

export function Books() {
  const [query, setQuery] = useState('Dune');
  const [searchQuery, setSearchQuery] = useState('Dune');
  const [savingId, setSavingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: books, isLoading } = useQuery({
    queryKey: ['books', searchQuery],
    queryFn: () => discoverBooks(searchQuery),
    enabled: !!searchQuery,
  });

  const wishlistMutation = useMutation({
    mutationFn: createWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      setSavingId(null);
    },
    onError: () => setSavingId(null)
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(query);
  };

  const handleSaveToWishlist = (book: any) => {
    setSavingId(book.id);
    wishlistMutation.mutate({
      title: book.title,
      description: book.description || '',
      url: `https://books.google.com/books?id=${book.id}`,
      imageUrl: book.imageUrl || '',
      category: 'BOOK',
      status: 'WANT',
      author: book.authors && book.authors.length > 0 ? book.authors[0] : undefined,
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-[var(--ink)]">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-[var(--ink)]">
          BOOKS & READING
        </h1>
      </div>

      <form onSubmit={handleSearch} className="mb-8 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--ink-60)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Google Books..."
            className="w-full pl-12 pr-4 py-4 border-4 border-[var(--ink)] font-sans font-bold text-lg outline-none focus:border-[var(--crimson)] shadow-[4px_4px_0_var(--ink)]"
          />
        </div>
        <button type="submit" className="bg-[var(--ink)] text-[var(--paper)] px-8 font-display font-bold uppercase tracking-widest border-4 border-[var(--ink)] shadow-[4px_4px_0_var(--crimson)] hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--crimson)] transition-all">
          Search
        </button>
      </form>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-[var(--ink)] border-t-[var(--crimson)] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books?.map((book: any) => {
            return (
              <div key={book.id} className="bg-[var(--paper)] border-4 border-[var(--ink)] shadow-[6px_6px_0_var(--ink)] flex flex-col hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--ink)] transition-all">
                {book.imageUrl ? (
                  <img 
                    src={book.imageUrl} 
                    alt={book.title}
                    className="w-full aspect-[2/3] object-cover border-b-4 border-[var(--ink)]"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-[var(--paper-soft)] border-b-4 border-[var(--ink)] flex items-center justify-center">
                    <Book className="w-12 h-12 text-[var(--ink-30)]" />
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-display font-bold text-lg leading-tight mb-1 line-clamp-2">{book.title}</h3>
                  <p className="font-mono text-xs text-[var(--ink-60)] mb-4">{book.authors?.[0] || 'Unknown Author'}</p>
                  <div className="mt-auto pt-4 border-t-2 border-dashed border-[var(--ink-30)]">
                    <button 
                      onClick={() => handleSaveToWishlist(book)}
                      disabled={savingId === book.id}
                      className="w-full flex items-center justify-center py-2 bg-[var(--paper-soft)] border-2 border-[var(--ink)] font-display text-xs font-bold uppercase tracking-widest hover:bg-[var(--gold)] transition-colors disabled:opacity-50"
                    >
                      {savingId === book.id ? <Loader2 className="w-4 h-4 animate-spin" /> : '+ Wishlist'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
