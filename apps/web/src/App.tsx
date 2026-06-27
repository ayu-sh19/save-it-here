import { Routes, Route } from 'react-router-dom';
import { GlobalShell } from './components/layout/GlobalShell';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<GlobalShell />}>
        <Route index element={<Dashboard />} />
        {/* Placeholders for future routes */}
        <Route path="transactions" element={<div className="p-8 font-mono text-[var(--ink-60)]">Transactions Page (WIP)</div>} />
        <Route path="budget" element={<div className="p-8 font-mono text-[var(--ink-60)]">Budget Page (WIP)</div>} />
        <Route path="ideas" element={<div className="p-8 font-mono text-[var(--ink-60)]">Ideas Page (WIP)</div>} />
        <Route path="wishlist" element={<div className="p-8 font-mono text-[var(--ink-60)]">Wishlist Page (WIP)</div>} />
        <Route path="*" element={<div className="p-8 font-mono text-xl text-[var(--status-error)]">404 - Page not found</div>} />
      </Route>
    </Routes>
  );
}

export default App;
