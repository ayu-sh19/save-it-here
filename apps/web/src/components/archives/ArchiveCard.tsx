import { useState } from 'react';
import { cn } from '../../lib/utils';
import { ExternalLink, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteArchive, updateArchiveItem, fetchTags } from '../../lib/api';
import { useEffect } from 'react';
import { Tweet } from 'react-tweet';
import { TagAutocomplete } from '../ui/TagAutocomplete';

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
    twttr?: {
      widgets: {
        load: () => void;
      };
    };
  }
}

export interface ArchiveItem {
  id: string;
  platform: 'INSTAGRAM' | 'TWITTER' | 'WEB';
  authorHandle?: string;
  caption?: string;
  url: string;
  isDeadLink: boolean;
  media: { url: string; type: string; order: number }[];
  tags: { name: string; color?: string }[];
  embedHtml?: string;
}

interface ArchiveCardProps {
  item: ArchiveItem;
}

export function ArchiveCard({ item }: ArchiveCardProps) {
  const queryClient = useQueryClient();
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const { data: globalTags } = useQuery({ queryKey: ['tags'], queryFn: fetchTags });

  const deleteMutation = useMutation({
    mutationFn: () => deleteArchive(item.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['archives'] })
  });

  const updateMutation = useMutation({
    mutationFn: (tags: string[]) => updateArchiveItem(item.id, { tags }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['archives'] })
  });

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    const currentTags = item.tags.map(t => t.name);
    if (!currentTags.includes(newTag.trim())) {
      updateMutation.mutate([...currentTags, newTag.trim()]);
    }
    setNewTag('');
    setIsEditingTags(false);
  };

  const handleRemoveTag = (tagName: string) => {
    const currentTags = item.tags.map(t => t.name).filter(t => t !== tagName);
    updateMutation.mutate(currentTags);
  };

  const images = item.media?.filter(m => m.type === 'IMAGE').sort((a, b) => a.order - b.order) || [];
  const hasMultipleImages = images.length > 1;

  // Process embed scripts
  useEffect(() => {
    if (item.embedHtml) {
      if (item.platform === 'INSTAGRAM') {
        if (!window.instgrm) {
          const script = document.createElement('script');
          script.src = '//www.instagram.com/embed.js';
          script.async = true;
          document.body.appendChild(script);
        } else {
          window.instgrm.Embeds.process();
        }
      }
    }
  }, [item.embedHtml, item.platform]);

  return (
    <div 
      id={item.id}
      className={cn(
      "bg-[var(--bone)] border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] overflow-hidden transition-all group mb-4",
      "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--ink)] relative flex flex-col"
    )}>
      {item.isDeadLink && (
        <div className="absolute top-2 right-2 z-10 font-mono text-[9px] font-bold px-2 py-0.5 bg-[var(--status-error)] text-[var(--white)] border-[1.5px] border-[var(--ink)] tracking-[0.1em] uppercase">
          🔗 DEAD
        </div>
      )}

      {/* Embed HTML rendering */}
      {item.platform === 'TWITTER' ? (
        <div className="w-full bg-white border-b-2 border-[var(--ink)] flex justify-center overflow-hidden" data-theme="light">
           <Tweet id={item.url.match(/(?:twitter\.com|x\.com)\/[^/]+\/status\/(\d+)/)?.[1] || ''} />
        </div>
      ) : item.embedHtml ? (
        <div className="w-full bg-white border-b-2 border-[var(--ink)] flex justify-center overflow-hidden">
           <div 
             className="w-full max-w-full [&_blockquote]:!m-0 [&_iframe]:!m-0 [&_iframe]:!w-full [&_iframe]:!min-h-[480px]"
             dangerouslySetInnerHTML={{ __html: item.embedHtml }}
           />
        </div>
      ) : images.length > 0 ? (
        <div className="relative border-b-2 border-[var(--ink)] bg-[var(--ink)]">
          <a href={item.url} target="_blank" rel="noreferrer" className="block w-full relative">
            <img src={images[currentImageIdx].url} alt="Archive content" className="w-full object-cover aspect-square" loading="lazy" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </a>
          
          {hasMultipleImages && (
            <>
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImageIdx(prev => prev === 0 ? images.length - 1 : prev - 1); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-[var(--white)] border-2 border-[var(--ink)] p-1 hover:bg-[var(--gold)] transition-colors opacity-0 group-hover:opacity-100 z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImageIdx(prev => (prev + 1) % images.length); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--white)] border-2 border-[var(--ink)] p-1 hover:bg-[var(--gold)] transition-colors opacity-0 group-hover:opacity-100 z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 bg-black/50 px-2 py-1 rounded-full z-10">
                {images.map((_, idx) => (
                  <div key={idx} className={cn("w-1.5 h-1.5 rounded-full", idx === currentImageIdx ? "bg-white" : "bg-white/40")} />
                ))}
              </div>
            </>
          )}
        </div>
      ) : null}

      <div className="p-3">
        <div className="flex justify-between items-start mb-1.5">
          <div className="font-mono text-[11px] font-bold text-[var(--crimson)] truncate max-w-[80%]">
            {item.authorHandle ? `@${item.authorHandle}` : item.platform}
          </div>
          <button 
            onClick={() => deleteMutation.mutate()}
            className="text-[var(--ink-40)] hover:text-[var(--crimson)] transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <p className="font-body text-[13px] text-[var(--ink-90)] leading-snug line-clamp-4 mb-2">
          {item.caption || 'No caption available.'}
        </p>

        {/* Tags Section */}
        <div className="flex flex-wrap gap-1.5 mb-3 items-center min-h-[24px]">
          {item.tags?.map(tag => (
            <span key={tag.name} className="group/tag inline-flex items-center text-[10px] text-[var(--ink-60)] bg-[var(--ink-10)] px-1.5 py-0.5 relative">
              #{tag.name}
              <button 
                onClick={() => handleRemoveTag(tag.name)}
                className="ml-1 text-[var(--ink-40)] hover:text-[var(--crimson)] hidden group-hover/tag:block"
              >
                <XIcon className="w-2 h-2" />
              </button>
            </span>
          ))}
          
          {isEditingTags ? (
            <div className="flex items-center gap-1">
                <TagAutocomplete
                  value={newTag}
                  onChange={setNewTag}
                  onEnter={handleAddTag}
                  onBlur={handleAddTag}
                  tags={globalTags || []}
                  placeholder="new tag"
                  className="w-24 text-[10px] p-1 h-6"
                  autoFocus
                />
              </div>
          ) : (
            <button 
              onClick={() => setIsEditingTags(true)}
              className="text-[var(--ink-40)] hover:text-[var(--ink)] p-0.5 border border-dashed border-[var(--ink-40)] hover:border-[var(--ink)] transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[var(--ink-15)]">
          <span className={cn(
            "inline-flex items-center gap-1 font-display text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 border-[1.5px] border-[var(--ink)]",
            item.platform === 'INSTAGRAM' ? "bg-[linear-gradient(135deg,#F58529,#DD2A7B,#8134AF)] text-white" : 
            item.platform === 'TWITTER' ? "bg-[#1DA1F2] text-white" : "bg-[var(--ink)] text-[var(--paper)]"
          )}>
            {item.platform}
          </span>
          <a href={item.url} target="_blank" rel="noreferrer" className="text-[var(--ink-60)] hover:text-[var(--ink)] transition-colors">
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
