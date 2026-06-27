import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, WalletCards, TrendingUp, Lightbulb, Grid3X3, Bookmark, Heart, Film, BookOpen } from 'lucide-react';
import { cn } from '../../lib/utils';

const SECTIONS = [
  {
    header: 'Overview',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    ]
  },
  {
    header: 'Finances',
    items: [
      { label: 'Transactions', icon: WalletCards, path: '/transactions' },
      { label: 'Budget', icon: TrendingUp, path: '/budget' },
    ]
  },
  {
    header: 'Second Brain',
    items: [
      { label: 'Ideas', icon: Lightbulb, path: '/ideas' },
      { label: 'IG Archive', icon: Grid3X3, path: '/archive/ig' },
    ]
  },
  {
    header: 'Discover',
    items: [
      { label: 'Wishlist', icon: Heart, path: '/wishlist' },
      { label: 'Movies & TV', icon: Film, path: '/movies' },
      { label: 'Books', icon: BookOpen, path: '/books' },
    ]
  }
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="fixed top-[60px] left-0 bottom-0 w-[260px] bg-[var(--paper-soft)] border-r-[3px] border-[var(--ink)] py-6 overflow-y-auto z-40 hidden md:block">
      {SECTIONS.map((section, idx) => (
        <div key={idx} className="mb-6">
          <div className="px-6 py-2 font-body text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--ink-30)]">
            ── {section.header} ──
          </div>
          {section.items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-6 py-3.5 font-display text-[13px] font-medium tracking-[0.08em] uppercase transition-all border-l-4",
                  isActive
                    ? "text-[var(--crimson)] bg-[var(--ink-04)] border-[var(--crimson)] font-semibold"
                    : "text-[var(--ink-60)] border-transparent hover:text-[var(--ink)] hover:bg-[var(--ink-04)]"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}

      {/* FAB - Quick Add positioned at bottom of sidebar on desktop */}
      <button className="fixed bottom-6 left-[102px] w-14 h-14 bg-[var(--crimson)] text-[var(--paper)] border-[3px] border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] flex items-center justify-center text-2xl cursor-pointer z-45 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--ink)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_var(--ink)]">
        +
      </button>
    </div>
  );
}
