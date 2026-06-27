import { Link, useLocation } from 'react-router-dom';
import { Home, Lightbulb, Heart, Search, Grid3X3 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSearchStore } from '../../store/search';
import { useQuickAddStore } from '../../store/quickAdd';

const NAV_ITEMS = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Lightbulb, label: 'Ideas', path: '/ideas' },
  { icon: Grid3X3, label: 'Archives', path: '/archive/ig' },
  { icon: Heart, label: 'Wishlist', path: '/wishlist' },
];

export function MobileBottomNav() {
  const location = useLocation();
  const openSearch = useSearchStore(state => state.openSearch);
  const openQuickAdd = useQuickAddStore(state => state.openQuickAdd);

  return (
    <>
      <div className="fixed bottom-[72px] right-4 z-40 md:hidden">
        <button 
          onClick={() => openQuickAdd()}
          className="w-14 h-14 rounded-full bg-[var(--crimson)] text-[var(--paper)] border-[3px] border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] flex items-center justify-center text-2xl font-bold active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_var(--ink)] transition-all"
        >
          +
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-16 bg-[var(--paper-soft)] border-t-[3px] border-[var(--ink)] flex items-center justify-around px-2 z-50 md:hidden pb-safe">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-14 h-14 transition-colors",
                isActive ? "text-[var(--crimson)] font-bold" : "text-[var(--ink-60)]"
              )}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-[9px] font-display uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
        
        <button
          onClick={openSearch}
          className="flex flex-col items-center justify-center w-14 h-14 text-[var(--ink-60)] active:text-[var(--ink)] transition-colors"
        >
          <Search className="w-6 h-6 mb-1" />
          <span className="text-[9px] font-display uppercase tracking-wider font-bold">Search</span>
        </button>
      </div>
    </>
  );
}
