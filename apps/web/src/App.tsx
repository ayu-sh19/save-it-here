import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { GlobalShell } from './components/layout/GlobalShell';
import { GlobalSearch } from './components/layout/GlobalSearch';
import { QuickAddModal } from './components/layout/QuickAddModal';
import { useSearchStore } from './store/search';
import { useQuickAddStore } from './store/quickAdd';
import { Dashboard } from './pages/Dashboard';
import { Ideas } from './pages/Ideas';
import { Wishlist } from './pages/Wishlist';
import { Archives } from './pages/Archives';
import { Accounts } from './pages/Accounts';
import { Lending } from './pages/Lending';
import { Investments } from './pages/Investments';
import { Transactions } from './pages/Transactions';
import { Budget } from './pages/Budget';
import { Movies } from './pages/Movies';
import { Books } from './pages/Books';

function App() {
  const { isOpen, closeSearch, toggleSearch } = useSearchStore();
  const { toggleQuickAdd } = useQuickAddStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        toggleQuickAdd();
      }
      if (e.key === 'Escape') {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSearch, toggleQuickAdd, closeSearch]);

  return (
    <>
      <GlobalSearch isOpen={isOpen} onClose={closeSearch} />
      <QuickAddModal />
      <Routes>
        <Route path="/" element={<GlobalShell />}>
        <Route index element={<Dashboard />} />
        
        {/* Phase 5 Routes */}
        <Route path="accounts" element={<Accounts />} />
        <Route path="lending" element={<Lending />} />
        <Route path="investments" element={<Investments />} />
        <Route path="ideas" element={<Ideas />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="archive/ig" element={<Archives />} />
        
        {/* Placeholder Pages now wired */}
        <Route path="transactions" element={<Transactions />} />
        <Route path="budget" element={<Budget />} />
        <Route path="movies" element={<Movies />} />
        <Route path="books" element={<Books />} />
        
        <Route path="*" element={<div className="p-8 font-mono text-xl text-[var(--status-error)]">404 - Page not found</div>} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
