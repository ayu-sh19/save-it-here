import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { searchGlobal } from '../../lib/api';

interface SearchResult {
  id: string;
  headline: string;
  description: string;
  source: 'IDEA' | 'TRANSACTION' | 'WISHLIST' | 'ARCHIVE';
  rank: number;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length > 0) {
        handleSearch(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = async (q: string) => {
    setLoading(true);
    try {
      const response = await searchGlobal(q);
      setResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 bg-[var(--color-ink)]/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[var(--color-paper)] border-4 border-[var(--color-ink)] shadow-[8px_8px_0_var(--color-ink)] flex flex-col max-h-[80vh]">
        
        <div className="p-4 border-b-4 border-[var(--color-ink)] flex items-center gap-3">
          <Search className="w-6 h-6 text-[var(--color-ink)]" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search ideas, transactions, wishlist..." 
            className="flex-1 bg-transparent text-xl font-sans font-bold placeholder-[var(--color-ink)]/50 focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading ? (
            <Loader2 className="w-6 h-6 text-[var(--color-ink)] animate-spin" />
          ) : (
            <button onClick={onClose} className="hover:text-[var(--color-crimson)] transition-colors">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2 min-h-[300px]">
          {query.trim().length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-opacity-50 text-[var(--color-ink)] p-8">
              <Search className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-display font-bold uppercase text-lg">Cmd + K Search</p>
              <p className="font-sans font-medium text-sm">Start typing to search your entire Second Brain.</p>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <p className="font-display font-bold uppercase text-lg">No results found.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {results.map((result) => (
                <div 
                  key={`${result.source}-${result.id}`} 
                  className="flex items-start gap-4 p-4 border-2 border-[var(--color-ink)] bg-white hover:bg-[var(--color-paper)] transition-colors cursor-pointer group"
                >
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border border-ink ${getSourceColor(result.source)}`}>
                        {result.source}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-lg truncate group-hover:text-[var(--color-crimson)] transition-colors">{result.headline}</h4>
                    {result.description && (
                      <p className="font-sans text-sm text-gray-600 line-clamp-2 mt-1">{result.description}</p>
                    )}
                  </div>
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity mt-2 text-[var(--color-crimson)]" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getSourceColor(source: string) {
  switch (source) {
    case 'IDEA': return 'bg-[var(--color-gold)] text-ink';
    case 'TRANSACTION': return 'bg-green-300 text-ink';
    case 'WISHLIST': return 'bg-[var(--color-crimson)] text-white';
    case 'ARCHIVE': return 'bg-blue-300 text-ink';
    default: return 'bg-gray-200 text-ink';
  }
}
