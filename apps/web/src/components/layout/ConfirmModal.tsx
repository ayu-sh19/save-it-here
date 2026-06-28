import { X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmModal({ isOpen, title, message, onClose, onConfirm }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--ink)]/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-[var(--paper)] border-4 border-[var(--ink)] shadow-[8px_8px_0_var(--ink)]">
        <div className="flex justify-between items-center p-4 border-b-4 border-[var(--ink)] bg-white">
          <h2 className="font-display font-bold text-lg uppercase tracking-wider text-[var(--crimson)]">{title}</h2>
          <button onClick={onClose} className="hover:text-[var(--crimson)] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <p className="font-sans font-bold text-base text-[var(--ink)]">
            {message}
          </p>
          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 p-3 font-display font-bold uppercase tracking-widest bg-white border-4 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)] hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button onClick={onConfirm} className="flex-1 p-3 font-display font-bold uppercase tracking-widest bg-[var(--crimson)] text-white border-4 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)] hover:shadow-none hover:translate-y-0.5 transition-all">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
