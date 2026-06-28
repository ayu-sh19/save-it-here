import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWishlist, createWishlist, discoverBooks } from '../lib/api';
import { MediaSearchDropdown } from '../components/media/MediaSearchDropdown';
import { MediaCard } from '../components/media/MediaCard';

export function Books() {
  const queryClient = useQueryClient();
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  // Fetch saved books (using wishlist API but filtered)
  const { data: allItems, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist,
  });

  const saveMutation = useMutation({
    mutationFn: createWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    }
  });

  const savedBooks = useMemo(() => {
    return (allItems || []).filter((item: any) => item.category === 'BOOK');
  }, [allItems]);

  // Extract unique genres from saved books
  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    savedBooks.forEach((m: any) => {
      if (m.genre) {
        m.genre.split(',').forEach((g: string) => genres.add(g.trim()));
      }
    });
    return Array.from(genres).sort();
  }, [savedBooks]);

  const filteredBooks = useMemo(() => {
    return savedBooks.filter((m: any) => {
      const matchState = selectedState === 'all' || m.status === selectedState;
      const matchGenre = selectedGenre === 'all' || (m.genre && m.genre.includes(selectedGenre));
      return matchState && matchGenre;
    });
  }, [savedBooks, selectedState, selectedGenre]);

  const handleSelectBook = (book: any) => {
    const existing = savedBooks.find((m: any) => m.title === book.title);
    if (existing) {
      const matchState = selectedState === 'all' || existing.status === selectedState;
      const matchGenre = selectedGenre === 'all' || (existing.genre && existing.genre.includes(selectedGenre));
      
      if (!matchState) setSelectedState('all');
      if (!matchGenre) setSelectedGenre('all');
      
      setTimeout(() => {
        const el = document.getElementById(`media-${existing.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.style.transition = 'box-shadow 0.3s';
          el.style.boxShadow = '0 0 0 4px var(--crimson), 6px 6px 0 var(--ink)';
          setTimeout(() => {
            el.style.boxShadow = '';
          }, 2000);
        }
      }, 100);
      return;
    }

    saveMutation.mutate({
      title: book.title,
      description: book.description,
      url: `https://books.google.com/books?id=${book.id}`,
      imageUrl: book.imageUrl || '',
      category: 'BOOK',
      status: 'to_read',
      author: book.authors && book.authors.length > 0 ? book.authors.join(', ') : '',
      genre: book.categories && book.categories.length > 0 ? book.categories.join(', ') : '',
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-[var(--ink)]">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-[var(--ink)]">
          BOOKS & READING
        </h1>
      </div>

      <div className="mb-8 max-w-2xl">
        <MediaSearchDropdown 
          type="books"
          searchFn={discoverBooks}
          onSelect={handleSelectBook}
        />
      </div>

      {savedBooks.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-8 p-4 bg-[var(--paper-soft)] border-[3px] border-[var(--ink)] shadow-[4px_4px_0_var(--ink)]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--ink-60)]">State:</span>
            <select 
              value={selectedState} 
              onChange={e => setSelectedState(e.target.value)}
              className="bg-[var(--white)] border-2 border-[var(--ink)] p-1 text-sm outline-none font-bold shadow-[2px_2px_0_var(--ink)]"
            >
              <option value="all">All</option>
              <option value="to_read">To Read</option>
              <option value="reading">Reading</option>
              <option value="read">Read</option>
              <option value="favorites">Favorites</option>
            </select>
          </div>
          
          {allGenres.length > 0 && (
            <div className="flex items-center gap-2 ml-4">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--ink-60)]">Genre:</span>
              <select 
                value={selectedGenre} 
                onChange={e => setSelectedGenre(e.target.value)}
                className="bg-[var(--white)] border-2 border-[var(--ink)] p-1 text-sm outline-none font-bold shadow-[2px_2px_0_var(--ink)]"
              >
                <option value="all">All Genres</option>
                {allGenres.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[var(--ink)] border-t-[var(--crimson)] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book: any) => (
            <MediaCard key={book.id} item={book} type="books" />
          ))}
          {filteredBooks.length === 0 && savedBooks.length > 0 && (
            <div className="col-span-full p-12 text-center border-2 border-dashed border-[var(--ink-30)] font-mono text-[var(--ink-60)]">
              No books match your filters.
            </div>
          )}
          {savedBooks.length === 0 && (
            <div className="col-span-full p-12 text-center border-[3px] border-[var(--ink)] shadow-[6px_6px_0_var(--ink)] bg-[var(--white)] font-mono text-lg font-bold">
              Start by searching for a book above!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
