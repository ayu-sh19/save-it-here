import { Routes, Route } from 'react-router-dom';
import { GlobalShell } from './components/layout/GlobalShell';
import { Dashboard } from './pages/Dashboard';
import { Ideas } from './pages/Ideas';
import { Wishlist } from './pages/Wishlist';
import { Archives } from './pages/Archives';
import { Accounts } from './pages/Accounts';
import { Lending } from './pages/Lending';
import { Investments } from './pages/Investments';

function App() {
  return (
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
        
        {/* Placeholders for future routes */}
        <Route path="transactions" element={<div className="p-8 font-mono text-[var(--ink-60)]">Transactions Page (WIP)</div>} />
        <Route path="budget" element={<div className="p-8 font-mono text-[var(--ink-60)]">Budget Page (WIP)</div>} />
        <Route path="movies" element={<div className="p-8 font-mono text-[var(--ink-60)]">Movies Page (WIP)</div>} />
        <Route path="books" element={<div className="p-8 font-mono text-[var(--ink-60)]">Books Page (WIP)</div>} />
        
        <Route path="*" element={<div className="p-8 font-mono text-xl text-[var(--status-error)]">404 - Page not found</div>} />
      </Route>
    </Routes>
  );
}

export default App;
