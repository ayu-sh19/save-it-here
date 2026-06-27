import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Bookmark, CheckCircle2 } from 'lucide-react';
import './index.css';

function Popup() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  useEffect(() => {
    // Get current tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
      if (tabs[0]) {
        setUrl(tabs[0].url || '');
        setTitle(tabs[0].title || '');
      }
    });
  }, []);

  const handleSave = async () => {
    setStatus('saving');
    try {
      // Hardcoded local API url for now
      const apiUrl = 'http://localhost:3000/api/v1/wishlist';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          url,
          status: 'WANT',
          category: 'OTHER',
        }),
      });
      if (response.ok) {
        setStatus('success');
        setTimeout(() => window.close(), 1500);
      } else {
        setStatus('idle');
      }
    } catch (e) {
      console.error(e);
      setStatus('idle');
    }
  };

  return (
    <div className="w-[320px] p-4 bg-[var(--color-paper)] font-sans border-4 border-[var(--color-ink)]">
      <h1 className="font-display text-lg uppercase font-bold border-b-2 border-ink pb-2 mb-4 flex items-center gap-2">
        <Bookmark className="w-5 h-5 text-[var(--color-crimson)]" />
        Save-It-Here
      </h1>

      <div className="flex flex-col gap-3">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)] block mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white border-2 border-ink px-2 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)] block mb-1">URL</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-white border-2 border-ink px-2 py-1.5 text-xs font-mono text-gray-500 truncate focus:outline-none"
            readOnly
          />
        </div>

        <button
          onClick={handleSave}
          disabled={status !== 'idle'}
          className="mt-2 w-full bg-[var(--color-crimson)] text-white font-display font-bold uppercase py-2 border-2 border-ink shadow-[4px_4px_0_var(--color-ink)] transition-all hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_var(--color-ink)] disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {status === 'success' ? (
            <><CheckCircle2 className="w-4 h-4" /> Saved!</>
          ) : (
            'Clip to Second Brain'
          )}
        </button>
      </div>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}
