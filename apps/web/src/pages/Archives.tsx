import { useState, useRef, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { useQuery } from '@tanstack/react-query';
import { ArchiveCard, type ArchiveItem } from '../components/archives/ArchiveCard';
import { fetchArchives } from '../lib/api';
import { cn } from '../lib/utils';
import { useQuickAddStore } from '../store/quickAdd';
import { Search, ChevronDown } from 'lucide-react';

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  768: 2,
  500: 1
};

function TagFilterDropdown({ uniqueTags, selectedTag, onSelectTag }: { uniqueTags: string[], selectedTag: string | null, onSelectTag: (t: string | null) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTags = uniqueTags.filter(t => t.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)] bg-white font-mono font-bold text-sm uppercase tracking-wider hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0_var(--ink)] transition-all"
      >
        <span>{selectedTag ? `#${selectedTag}` : 'Filter by Tag...'}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] max-h-64 flex flex-col">
          <div className="p-2 border-b-2 border-[var(--ink)] flex items-center gap-2 bg-[var(--bone)]">
            <Search className="w-4 h-4 text-[var(--ink)]" />
            <input 
              type="text" 
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tags..."
              className="w-full bg-transparent outline-none font-mono text-sm"
            />
          </div>
          <div className="overflow-y-auto flex-1">
            <button
              onClick={() => { onSelectTag(null); setIsOpen(false); setSearch(''); }}
              className={cn(
                "w-full text-left px-4 py-3 font-mono text-sm uppercase transition-colors border-b-2 border-[var(--ink)]",
                !selectedTag ? "bg-[var(--ink)] text-white" : "hover:bg-[var(--ink-10)]"
              )}
            >
              All Tags
            </button>
            {filteredTags.map(tag => (
              <button
                key={tag}
                onClick={() => { onSelectTag(tag); setIsOpen(false); setSearch(''); }}
                className={cn(
                  "w-full text-left px-4 py-3 font-mono text-sm uppercase transition-colors border-b-2 last:border-b-0 border-[var(--ink)]",
                  selectedTag === tag ? "bg-[var(--ink)] text-white" : "hover:bg-[var(--ink-10)]"
                )}
              >
                #{tag}
              </button>
            ))}
            {filteredTags.length === 0 && (
              <div className="p-4 text-center font-mono text-sm text-[var(--ink-50)]">
                No tags found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function Archives() {
  const { openQuickAdd } = useQuickAddStore();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { data: items, isLoading } = useQuery({
    queryKey: ['archives'],
    queryFn: fetchArchives,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-[var(--ink)] border-t-[var(--crimson)] rounded-full animate-spin"></div>
        <p className="mt-4 font-mono text-sm tracking-widest uppercase">Loading Archives...</p>
      </div>
    );
  }

  const allItems: ArchiveItem[] = items || [];
  
  // Extract unique tags from current archive items
  const uniqueTags = Array.from(new Set(allItems.flatMap(item => item.tags?.map(t => t.name) || []))).sort();
  
  // Filter items by selected tag
  const archiveItems = selectedTag 
    ? allItems.filter(item => item.tags?.some(t => t.name === selectedTag))
    : allItems;

  return (
    <div className="w-full max-w-7xl mx-auto pb-12">
      <div className="flex flex-col gap-4 mb-8 pb-4 border-b-2 border-[var(--ink)] px-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-[var(--ink)]">
            SOCIAL ARCHIVES
          </h1>
          <div className="flex gap-4">
            <button 
              onClick={() => openQuickAdd('archive')}
              className="bg-[var(--crimson)] text-[var(--white)] px-4 py-2 font-display text-xs font-bold tracking-[0.1em] uppercase border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--ink)] transition-all"
            >
              + Add Link
            </button>
            <button className="bg-[var(--white)] text-[var(--ink)] px-4 py-2 font-display text-xs font-bold tracking-[0.1em] uppercase border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--ink)] transition-all">
              Platform ▾
            </button>
          </div>
        </div>
        
        {/* Tag Filters */}
        {uniqueTags.length > 0 && (
          <div className="relative pt-2 w-64" id="tag-filter-container">
            <TagFilterDropdown 
              uniqueTags={uniqueTags}
              selectedTag={selectedTag}
              onSelectTag={setSelectedTag}
            />
          </div>
        )}
      </div>

      {archiveItems.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-[var(--ink-30)] font-mono text-[var(--ink-60)] mx-4">
          {selectedTag ? `No archives found with tag #${selectedTag}.` : "Your archive is empty. Add a social media link to save it forever."}
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto -ml-4"
          columnClassName="pl-4 bg-clip-padding"
        >
          {archiveItems.map(item => (
            <ArchiveCard key={item.id} item={item} />
          ))}
        </Masonry>
      )}
    </div>
  );
}
