import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { updateWishlistItem, deleteWishlistItem } from '../../lib/api';

export interface WishlistItem {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  price: number | null;
  currency: string;
  status: string; // "WANT", "BOUGHT", "DROPPED" or "watchlist", "read", etc.
  category: string; // "TECH", "BOOK", "MOVIE", "OTHER"
  imageUrl: string | null;
  author?: string | null;
  genre?: string | null;
  createdAt: string;
  updatedAt: string;
  tags?: { id: string; name: string }[];
}

interface WishlistCardProps {
  item: WishlistItem;
  allCategories?: string[];
}

export function WishlistCard({ item, allCategories = [] }: WishlistCardProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editImageUrl, setEditImageUrl] = useState(item.imageUrl || '');
  const [editPrice, setEditPrice] = useState(item.price ? item.price.toString() : '');
  const [editTags, setEditTags] = useState(item.tags?.map(t => t.name).join(', ') || '');

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<WishlistItem>) => updateWishlistItem(item.id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      setIsEditing(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteWishlistItem(item.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    }
  });

  const addedDate = new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  // Combine default categories with any custom ones found in allCategories
  const defaultCategories = ['TECH', 'BOOK', 'MOVIE', 'OTHER'];

  // Category editing state
  const [editCategory, setEditCategory] = useState(item.category);
  const [isAddingCustomCategory, setIsAddingCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  const displayCategories = Array.from(new Set([...defaultCategories, ...allCategories, editCategory]));

  if (isEditing) {
    return (
      <div className="bg-[var(--bone)] border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] flex flex-col p-4 h-full">
        <h3 className="font-display font-bold mb-4">EDIT ITEM</h3>
        
        <div className="flex-1 overflow-y-auto mb-4 -mx-2 px-2 scrollbar-hide space-y-3">
          <div>
            <label className="text-[10px] font-mono font-bold uppercase mb-1 block">Title</label>
            <input 
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              className="p-2 border-2 border-[var(--ink)] w-full text-sm font-sans outline-none focus:border-[var(--crimson)]"
              placeholder="Title"
            />
          </div>
          
          <div>
            <label className="text-[10px] font-mono font-bold uppercase mb-1 block">Category</label>
            <div className="flex flex-wrap gap-1">
              {displayCategories.map(c => (
                <button 
                  key={c} 
                  type="button"
                  onClick={() => setEditCategory(c)}
                  className={`px-2 py-1 font-mono font-bold text-[9px] uppercase tracking-wider border-2 border-[var(--ink)] transition-all ${editCategory === c ? 'bg-[var(--crimson)] text-white shadow-[1px_1px_0_var(--ink)]' : 'bg-white text-[var(--ink)] hover:bg-gray-50'}`}
                >
                  {c}
                </button>
              ))}
              {isAddingCustomCategory ? (
                <div className="flex items-center gap-1 mt-1 w-full">
                  <input 
                    type="text" 
                    className="flex-1 px-2 py-1 font-mono text-[9px] border-2 border-[var(--ink)] outline-none focus:border-[var(--crimson)]" 
                    placeholder="New Category" 
                    value={customCategoryInput} 
                    onChange={e => setCustomCategoryInput(e.target.value)} 
                    autoFocus 
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      if (customCategoryInput.trim()) {
                        setEditCategory(customCategoryInput.trim().toUpperCase());
                        setIsAddingCustomCategory(false);
                        setCustomCategoryInput('');
                      }
                    }} 
                    className="px-2 py-1 font-bold text-[9px] uppercase bg-[var(--ink)] text-white border-2 border-[var(--ink)] hover:bg-[var(--crimson)]"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => setIsAddingCustomCategory(true)}
                  className="px-2 py-1 font-mono font-bold text-[9px] uppercase tracking-wider border-2 border-[var(--ink)] border-dashed bg-[var(--paper-soft)] hover:bg-[var(--gold)]"
                >
                  + New
                </button>
              )}
            </div>
          </div>
          
          <div>
            <label className="text-[10px] font-mono font-bold uppercase mb-1 block">Image URL</label>
            <input 
              value={editImageUrl}
              onChange={e => setEditImageUrl(e.target.value)}
              className="p-2 border-2 border-[var(--ink)] w-full text-sm font-sans outline-none focus:border-[var(--crimson)]"
              placeholder="https://..."
            />
          </div>
          
          <div>
            <label className="text-[10px] font-mono font-bold uppercase mb-1 block">Price</label>
            <input 
              value={editPrice}
              onChange={e => setEditPrice(e.target.value)}
              className="p-2 border-2 border-[var(--ink)] w-full text-sm font-sans outline-none focus:border-[var(--crimson)]"
              placeholder="0.00"
              type="number"
            />
          </div>
          
          <div>
            <label className="text-[10px] font-mono font-bold uppercase mb-1 block">Tags (comma separated)</label>
            <input 
              value={editTags}
              onChange={e => setEditTags(e.target.value)}
              className="p-2 border-2 border-[var(--ink)] w-full text-sm font-sans outline-none focus:border-[var(--crimson)]"
              placeholder="gift, home"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-auto pt-2 border-t-2 border-[var(--ink)]">
          <button 
            onClick={() => setIsEditing(false)}
            className="flex-1 py-2 border-2 border-[var(--ink)] bg-[var(--white)] font-bold text-xs uppercase hover:bg-[var(--ink-10)]"
          >
            Cancel
          </button>
          <button 
            onClick={() => updateMutation.mutate({
              title: editTitle,
              category: editCategory,
              imageUrl: editImageUrl || null,
              price: editPrice ? parseFloat(editPrice) : null,
              tags: editTags ? editTags.split(',').map(t => t.trim()).filter(Boolean) : []
            } as any)}
            className="flex-1 py-2 border-2 border-[var(--ink)] bg-[var(--crimson)] text-white font-bold text-xs uppercase hover:bg-[var(--ink)]"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bone)] border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] flex flex-col hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--ink)] transition-all">
      <a 
        href={item.url || '#'} 
        target={item.url ? "_blank" : undefined} 
        rel="noreferrer" 
        className="aspect-[4/3] border-b-2 border-[var(--ink)] overflow-hidden bg-[var(--ink-04)] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
      >
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <span className="font-mono text-[10px]">No Image</span>
        )}
      </a>
      
      <div className="p-4 pt-0 flex-1 flex flex-col">
        {/* Category Pill breaking the border */}
        <div className="self-start -mt-3 mb-3 px-3 py-1 font-display text-[10px] font-bold tracking-[0.14em] uppercase bg-[var(--ink)] text-[var(--paper)] border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--crimson)] relative">
          {item.category}
        </div>
        
        <a 
          href={item.url || '#'} 
          target={item.url ? "_blank" : undefined} 
          rel="noreferrer" 
          className="font-display text-base font-semibold leading-tight mb-2 hover:text-[var(--crimson)] transition-colors line-clamp-2"
        >
          {item.title}
        </a>
        
        {item.price !== null && (
          <div className="font-mono text-lg font-medium text-[var(--crimson)] mb-2">
            {item.currency === 'INR' ? '₹' : '$'}{item.price.toLocaleString()}
          </div>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.map(tag => (
              <span key={tag.id} className="px-1.5 py-0.5 bg-[var(--ink-10)] border border-[var(--ink-30)] font-mono text-[9px] uppercase tracking-wider text-[var(--ink-60)]">
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-[var(--ink-15)] flex justify-between items-center">
          <span className="font-mono text-[9px] text-[var(--ink-60)] uppercase tracking-widest">
            Added {addedDate}
          </span>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-[var(--ink-60)] hover:text-[var(--ink)] transition-colors"
              title="Edit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 Z"></path></svg>
            </button>
            <button
              onClick={() => {
                if (confirm('Delete this item?')) {
                  deleteMutation.mutate();
                }
              }}
              className="p-1 text-[var(--ink-60)] hover:text-[var(--crimson)] transition-colors"
              title="Delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
