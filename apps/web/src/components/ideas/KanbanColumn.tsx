import { Droppable } from '@hello-pangea/dnd';
import type { Idea } from '@save-it-here/shared';
import { IdeaCard } from './IdeaCard';
import { cn } from '../../lib/utils';

interface KanbanColumnProps {
  id: string;
  title: string;
  status: string;
  ideas: Idea[];
}

export function KanbanColumn({ id, title, status, ideas }: KanbanColumnProps) {
  let borderClass = 'border-t-[var(--ink-30)]';
  if (status === 'SPARK') borderClass = 'border-t-[var(--crimson)]';
  if (status === 'EXPLORING') borderClass = 'border-t-[var(--gold)]';
  if (status === 'IN_PROGRESS') borderClass = 'border-t-[var(--status-info)]';
  if (status === 'DONE') borderClass = 'border-t-[var(--status-success)]';

  return (
    <div className={cn(
      "flex flex-col min-w-[280px] w-[320px] bg-[var(--paper-soft)] border-2 border-[var(--ink)] border-t-[5px]",
      borderClass
    )}>
      <div className="flex items-center justify-between px-4 py-3.5 border-b-2 border-[var(--ink)] bg-[var(--paper)]">
        <h3 className="font-display text-xs font-semibold tracking-[0.12em] uppercase text-[var(--ink)]">
          {title}
        </h3>
        <span className="font-mono text-[11px] bg-[var(--ink)] text-[var(--paper)] px-2 py-0.5 min-w-[24px] text-center">
          {ideas.length}
        </span>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 p-1 overflow-y-auto min-h-[500px] transition-colors",
              snapshot.isDraggingOver ? "bg-[var(--ink-04)]" : ""
            )}
          >
            {ideas.map((idea, index) => (
              <IdeaCard key={idea.id!} idea={idea} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
