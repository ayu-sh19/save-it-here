import { X } from 'lucide-react';

interface PromptModalProps {
  isOpen: boolean;
  title: string;
  defaultValue?: string;
  type?: 'text' | 'number';
  onClose: () => void;
  onConfirm: (value: string) => void;
}

export function PromptModal({ isOpen, title, defaultValue = '', type = 'text', onClose, onConfirm }: PromptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--ink)]/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-[var(--paper)] border-4 border-[var(--ink)] shadow-[8px_8px_0_var(--ink)]">
        <div className="flex justify-between items-center p-4 border-b-4 border-[var(--ink)] bg-white">
          <h2 className="font-display font-bold text-lg uppercase tracking-wider">{title}</h2>
          <button onClick={onClose} className="hover:text-[var(--crimson)] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const val = new FormData(e.currentTarget).get('promptInput') as string;
            onConfirm(val);
          }}
          className="p-6 space-y-6"
        >
          <input 
            autoFocus
            type={type} 
            name="promptInput"
            defaultValue={defaultValue} 
            className="w-full p-4 border-4 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-mono font-bold text-xl shadow-[4px_4px_0_var(--ink)] bg-white"
          />
          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 p-3 font-display font-bold uppercase tracking-widest bg-white border-4 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)] hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 p-3 font-display font-bold uppercase tracking-widest bg-[var(--ink)] text-white border-4 border-[var(--ink)] shadow-[2px_2px_0_var(--crimson)] hover:bg-[var(--crimson)] hover:shadow-none hover:translate-y-0.5 transition-all">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
