import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';

export function GlobalShell() {
  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-body grid grid-cols-1 md:grid-cols-[260px_1fr] grid-rows-[60px_1fr]">
      <TopBar />
      <Sidebar />
      <main className="col-start-1 md:col-start-2 row-start-2 p-4 md:p-6 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
