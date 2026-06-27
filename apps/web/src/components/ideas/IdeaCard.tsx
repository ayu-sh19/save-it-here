import type { Idea } from '@save-it-here/shared';
import { Draggable } from '@hello-pangea/dnd';
import { cn } from '../../lib/utils';
import { GripVertical } from 'lucide-react';

interface IdeaCardProps {
  idea: Idea;
  index: number;
}

export function IdeaCard({ idea, index }: IdeaCardProps) {
  let priorityClass = 'text-[var(--ink-60)]';
  if (idea.priority === 'HIGH' || idea.priority === 'CRITICAL') priorityClass = 'text-[var(--status-error)]';
  if (idea.priority === 'MEDIUM') priorityClass = 'text-[var(--gold)]';

  return (
    <Draggable draggableId={idea.id!} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "m-3 p-4 bg-[var(--bone)] border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] transition-transform group relative",
            snapshot.isDragging && "opacity-90 rotate-2 scale-105 shadow-[8px_8px_0_var(--ink)] z-50",
            !snapshot.isDragging && "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--ink)]"
          )}
        >
          <div 
            {...provided.dragHandleProps} 
            className="absolute top-2 right-2 text-[var(--ink-30)] hover:text-[var(--ink)] cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          <h4 className="font-display text-[15px] font-semibold leading-tight pr-6 mb-2">
            {idea.title}
          </h4>
          
          <p className="font-body text-[13px] text-[var(--ink-60)] line-clamp-3 mb-3 leading-snug">
            {idea.content}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex gap-2">
              {idea.tags && idea.tags.map((tag: string) => (
                <span key={tag} className="font-mono text-[10px] font-bold uppercase tracking-widest bg-[var(--ink-04)] border border-[var(--ink-15)] px-1.5 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className={cn("font-mono text-[10px] font-bold uppercase tracking-wider", priorityClass)}>
              ♥ {idea.priority}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
