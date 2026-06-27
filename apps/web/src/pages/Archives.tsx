import Masonry from 'react-masonry-css';
import { useQuery } from '@tanstack/react-query';
import { ArchiveCard, type ArchiveItem } from '../components/archives/ArchiveCard';
import { fetchArchives } from '../lib/api';

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  768: 2,
  500: 1
};

export function Archives() {
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

  const archiveItems: ArchiveItem[] = items || [];

  return (
    <div className="w-full max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-[var(--ink)] px-4">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-[var(--ink)]">
          SOCIAL ARCHIVES
        </h1>
        <div className="flex gap-4">
          <button className="bg-[var(--white)] text-[var(--ink)] px-4 py-2 font-display text-xs font-bold tracking-[0.1em] uppercase border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--ink)] transition-all">
            Platform ▾
          </button>
        </div>
      </div>

      {archiveItems.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-[var(--ink-30)] font-mono text-[var(--ink-60)] mx-4">
          Your archive is empty. Add a social media link to save it forever.
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
