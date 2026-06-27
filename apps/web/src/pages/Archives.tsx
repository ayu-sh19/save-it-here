import Masonry from 'react-masonry-css';
import { ArchiveCard, type ArchiveItem } from '../components/archives/ArchiveCard';

// MOCK DATA for Phase 5
const MOCK_ARCHIVES: ArchiveItem[] = [
  {
    id: '1',
    platform: 'Instagram',
    handle: 'design_inspo',
    content: 'Brutalist architecture meets modern web design. The raw, unpolished look is taking over 2026. What do you think of these stark borders?',
    imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=800&fit=crop', // Tall image
    url: '#',
    isDeadLink: false,
    tags: ['ui', 'brutalism', 'design']
  },
  {
    id: '2',
    platform: 'Twitter',
    handle: 'tech_guru',
    content: 'Just launched my new open source project! It uses React, Hono, and Prisma. The developer experience is absolutely incredible. Check out the repo.',
    url: '#',
    isDeadLink: false,
    tags: ['react', 'hono', 'typescript']
  },
  {
    id: '3',
    platform: 'Instagram',
    handle: 'foodie_travels',
    content: 'Found this hidden gem in Tokyo. The ramen here is out of this world! 🍜✨',
    imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&h=600&fit=crop', // Square image
    url: '#',
    isDeadLink: true,
    tags: ['tokyo', 'ramen', 'food']
  },
  {
    id: '4',
    platform: 'Twitter',
    handle: 'naval',
    content: 'Play iterated games. All the returns in life, whether in wealth, relationships, or knowledge, come from compound interest.',
    url: '#',
    isDeadLink: false,
    tags: ['wisdom', 'wealth']
  },
  {
    id: '5',
    platform: 'Instagram',
    handle: 'architecture_hunter',
    content: 'Concrete jungle. The stark contrasts and heavy shadows create a dramatic atmosphere in this modern museum space.',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=900&fit=crop', // Very tall image
    url: '#',
    isDeadLink: false,
    tags: ['architecture', 'concrete', 'brutalism']
  }
];

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  768: 2,
  500: 1
};

export function Archives() {
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

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto -ml-4"
        columnClassName="pl-4 bg-clip-padding"
      >
        {MOCK_ARCHIVES.map(item => (
          <ArchiveCard key={item.id} item={item} />
        ))}
      </Masonry>
    </div>
  );
}
