import { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface TagAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  onBlur?: () => void;
  tags: { id: string; name: string }[];
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function TagAutocomplete({
  value,
  onChange,
  onEnter,
  onBlur,
  tags,
  placeholder = 'Add a tag...',
  className,
  autoFocus
}: TagAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filter tags based on input (if input is not empty, and exclude exact match if it's the only one)
  const filteredTags = tags.filter(t => 
    t.name.toLowerCase().includes(value.toLowerCase()) && 
    t.name.toLowerCase() !== value.toLowerCase()
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (onBlur) onBlur();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onBlur]);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input
        type="text"
        className={cn(
          "w-full border-2 border-[var(--ink)] focus:border-[var(--crimson)] outline-none font-sans font-bold shadow-[2px_2px_0_var(--ink)] bg-white",
          className
        )}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            setIsOpen(false);
            if (onEnter) onEnter();
          }
        }}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
      
      {isOpen && filteredTags.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] max-h-48 overflow-y-auto">
          {filteredTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              className="w-full text-left px-3 py-2 font-mono text-sm uppercase hover:bg-[var(--ink)] hover:text-white transition-colors border-b-2 last:border-b-0 border-[var(--ink)]"
              onClick={() => {
                onChange(tag.name);
                setIsOpen(false);
                if (onEnter) onEnter(); // Optionally trigger submit immediately
              }}
            >
              #{tag.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
