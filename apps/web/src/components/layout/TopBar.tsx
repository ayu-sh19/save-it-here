import { Search, User } from 'lucide-react';
import { useSearchStore } from '../../store/search';

export function TopBar() {
  const openSearch = useSearchStore((state) => state.openSearch);

  return (
    <div className="fixed top-0 left-0 right-0 h-[60px] bg-[rgba(244,235,215,0.95)] border-b-[3px] border-[var(--ink)] flex items-center px-6 z-50 backdrop-blur-sm">
      <div className="font-display font-bold text-base uppercase tracking-[0.2em] flex items-center shrink-0">
        SAVE<span className="text-[var(--crimson)] px-0.5">·</span>IT<span className="text-[var(--crimson)] px-0.5">·</span>HERE
      </div>

      <div className="flex-1 max-w-[560px] mx-8 relative hidden md:block" onClick={openSearch}>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-60)]" />
        <input 
          type="text" 
          placeholder="Global Search............." 
          className="w-full py-2.5 pl-11 pr-4 bg-[var(--white)] border-2 border-[var(--ink)] font-body text-sm shadow-[3px_3px_0_var(--ink)] cursor-pointer focus:shadow-[0_0_0_var(--ink)] focus:border-[var(--crimson)] transition-all outline-none"
          readOnly
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[9px] font-bold tracking-widest uppercase border border-[var(--ink)] px-2 py-0.5 text-[var(--ink-60)]">
          ⌘K
        </div>
      </div>

      <div className="ml-auto">
        <button className="w-10 h-10 border-2 border-[var(--ink)] bg-[var(--white)] shadow-[3px_3px_0_var(--ink)] flex items-center justify-center hover:bg-[var(--ink-04)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0_0_0_var(--ink)] transition-all">
          <User className="w-5 h-5 text-[var(--ink)]" />
        </button>
      </div>
    </div>
  );
}
