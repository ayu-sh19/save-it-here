import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchIdeas, updateIdea } from '../lib/api';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { KanbanColumn } from '../components/ideas/KanbanColumn';
import type { Idea } from '@save-it-here/shared';
import { useQuickAddStore } from '../store/quickAdd';

const COLUMNS = [
  { id: 'SPARK', title: '💡 Spark', status: 'SPARK' },
  { id: 'EXPLORING', title: '🔬 Exploring', status: 'EXPLORING' },
  { id: 'IN_PROGRESS', title: '🛠️ In Prog', status: 'IN_PROGRESS' },
  { id: 'DONE', title: '✅ Done', status: 'DONE' },
];

export function Ideas() {
  const queryClient = useQueryClient();
  const { openQuickAdd } = useQuickAddStore();

  const { data: ideas, isLoading } = useQuery({
    queryKey: ['ideas'],
    queryFn: fetchIdeas,
  });

  const updateIdeaMutation = useMutation({
    mutationFn: updateIdea,
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['ideas'] });
      const previousIdeas = queryClient.getQueryData<Idea[]>(['ideas']);
      
      // Optimistically update
      if (previousIdeas) {
        queryClient.setQueryData<Idea[]>(['ideas'], (old) => 
          old?.map(idea => idea.id === id ? { ...idea, ...updates } : idea)
        );
      }
      return { previousIdeas };
    },
    onError: (_, __, context) => {
      if (context?.previousIdeas) {
        queryClient.setQueryData(['ideas'], context.previousIdeas);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    },
  });

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // We only support moving between columns (status updates) right now, 
    // as our DB doesn't have an explicit 'order' field.
    if (destination.droppableId !== source.droppableId) {
      updateIdeaMutation.mutate({
        id: draggableId,
        updates: { status: destination.droppableId as Idea['status'] }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-[var(--ink)] border-t-[var(--crimson)] rounded-full animate-spin"></div>
        <p className="mt-4 font-mono text-sm tracking-widest uppercase">Loading Ideas...</p>
      </div>
    );
  }

  const ideasList = ideas || [];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-[var(--ink)]">
          IDEAS
        </h1>
        <button 
          onClick={() => openQuickAdd('idea')}
          className="bg-[var(--ink)] text-[var(--paper)] px-4 py-2 font-display text-xs font-bold tracking-[0.1em] uppercase border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--crimson)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--crimson)] transition-all"
        >
          + New Idea
        </button>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 h-full min-w-max items-start">
          <DragDropContext onDragEnd={onDragEnd}>
            {COLUMNS.map(col => (
              <KanbanColumn 
                key={col.id} 
                id={col.id} 
                title={col.title} 
                status={col.status} 
                ideas={ideasList.filter(idea => idea.status === col.status)} 
              />
            ))}
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}
