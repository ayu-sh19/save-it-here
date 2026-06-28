import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useDebounce } from 'use-debounce';

interface MediaSearchDropdownProps {
  type: 'movies' | 'books';
  onSelect: (item: any) => void;
  searchFn: (query: string) => Promise<any[]>;
}

export function MediaSearchDropdown({ type, onSelect, searchFn }: MediaSearchDropdownProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 500);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    async function performSearch() {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await searchFn(debouncedQuery);
        setResults(data);
        setIsOpen(true);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsLoading(false);
      }
    }

    performSearch();
  }, [debouncedQuery, searchFn]);

  return (
    <div className="relative w-full z-30" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search for a ${type === 'movies' ? 'movie or TV show' : 'book'}...`}
          className="w-full p-4 pl-12 border-[3px] border-[var(--ink)] bg-[var(--white)] font-display font-bold text-lg outline-none focus:border-[var(--crimson)] transition-colors shadow-[4px_4px_0_var(--ink)]"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink)]">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--paper)] border-[3px] border-[var(--ink)] shadow-[6px_6px_0_var(--ink)] max-h-[400px] overflow-y-auto">
          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelect(item);
                setIsOpen(false);
                setQuery('');
              }}
              className="flex items-center gap-4 p-3 border-b-2 border-[var(--ink)] cursor-pointer hover:bg-[var(--gold)] transition-colors group"
            >
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} className="w-12 h-16 object-cover border-2 border-[var(--ink)]" />
              ) : (
                <div className="w-12 h-16 bg-[var(--ink-10)] border-2 border-[var(--ink)] flex items-center justify-center font-mono text-[10px] text-center">
                  No Image
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-bold text-[var(--ink)] truncate group-hover:text-[var(--ink)]">
                  {item.title}
                </h4>
                <div className="flex gap-2 font-mono text-[10px] text-[var(--ink-60)] mt-1">
                  {type === 'movies' ? (
                    <>
                      {item.releaseDate && <span>{item.releaseDate.split('-')[0]}</span>}
                      {item.mediaType && <span className="uppercase border border-[var(--ink-30)] px-1">{item.mediaType}</span>}
                    </>
                  ) : (
                    <span>{item.authors?.join(', ')}</span>
                  )}
                </div>
                {(item.genres || (item.categories && item.categories.length > 0)) && (
                  <p className="font-mono text-[10px] text-[var(--crimson)] mt-1 truncate">
                    {item.genres || item.categories?.join(', ')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {isOpen && results.length === 0 && !isLoading && debouncedQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-[var(--paper)] border-[3px] border-[var(--ink)] font-mono text-sm text-center">
          No results found for "{debouncedQuery}"
        </div>
      )}
    </div>
  );
}
