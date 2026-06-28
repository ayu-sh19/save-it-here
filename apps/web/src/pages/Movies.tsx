import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { discoverMovies, createWishlist } from '../lib/api';
import { Search, Film, Loader2 } from 'lucide-react';

export function Movies() {
  const [query, setQuery] = useState('Inception');
  const [searchQuery, setSearchQuery] = useState('Inception');
  const [savingId, setSavingId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: movies, isLoading } = useQuery({
    queryKey: ['movies', searchQuery],
    queryFn: () => discoverMovies(searchQuery),
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

  const handleSaveToWishlist = (movie: any) => {
    setSavingId(movie.id);
    wishlistMutation.mutate({
      title: movie.title,
      description: movie.description,
      url: `https://www.themoviedb.org/movie/${movie.id}`,
      imageUrl: movie.imageUrl || '',
      category: 'MOVIE',
      status: 'WANT'
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-[var(--ink)]">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-[var(--ink)]">
          MOVIES & TV
        </h1>
      </div>

      <form onSubmit={handleSearch} className="mb-8 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--ink-60)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search TMDB for movies..."
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
          {movies?.map((movie: any) => (
            <div key={movie.id} className="bg-[var(--paper)] border-4 border-[var(--ink)] shadow-[6px_6px_0_var(--ink)] flex flex-col hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--ink)] transition-all">
              {movie.imageUrl ? (
                <img 
                  src={movie.imageUrl} 
                  alt={movie.title}
                  className="w-full aspect-[2/3] object-cover border-b-4 border-[var(--ink)]"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-[var(--paper-soft)] border-b-4 border-[var(--ink)] flex items-center justify-center">
                  <Film className="w-12 h-12 text-[var(--ink-30)]" />
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-display font-bold text-lg leading-tight mb-2 line-clamp-2">{movie.title}</h3>
                <p className="font-mono text-xs text-[var(--ink-60)] mb-4">{movie.releaseDate?.substring(0, 4)}</p>
                <div className="mt-auto pt-4 border-t-2 border-dashed border-[var(--ink-30)]">
                  <button 
                    onClick={() => handleSaveToWishlist(movie)}
                    disabled={savingId === movie.id}
                    className="w-full flex items-center justify-center py-2 bg-[var(--paper-soft)] border-2 border-[var(--ink)] font-display text-xs font-bold uppercase tracking-widest hover:bg-[var(--gold)] transition-colors disabled:opacity-50"
                  >
                    {savingId === movie.id ? <Loader2 className="w-4 h-4 animate-spin" /> : '+ Wishlist'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
