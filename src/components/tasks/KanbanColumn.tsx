import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { Task, TaskStatus } from '../../types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onOpenDetails: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (status: TaskStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  title,
  tasks,
  onOpenDetails,
  onDeleteTask,
  onAddTask,
}) => {
  const statusColors: Record<TaskStatus, string> = {
    backlog: 'border-slate-400 bg-slate-400',
    todo: 'border-sky-500 bg-sky-500',
    in_progress: 'border-brand-500 bg-brand-500',
    review: 'border-amber-500 bg-amber-500',
    done: 'border-emerald-500 bg-emerald-500',
  };

  return (
    <div className="w-72 sm:w-80 flex flex-col flex-shrink-0 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 max-h-full">
      {/* Column Header */}
      <div className="p-3 px-3.5 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
            {title}
          </h3>
          <span className="text-[11px] font-mono px-1.5 py-0.2 rounded-md bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
            {tasks.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onAddTask(status)}
            aria-label={`Add task to ${title}`}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            title="Add task"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Droppable Card List */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-2.5 overflow-y-auto space-y-2.5 min-h-[220px] transition-colors ${
              snapshot.isDraggingOver
                ? 'bg-brand-50/40 dark:bg-brand-950/20 rounded-b-2xl'
                : ''
            }`}
          >
            {tasks.map((task, index) => (
              <KanbanCard
                key={task.id}
                task={task}
                index={index}
                onOpenDetails={onOpenDetails}
                onDelete={onDeleteTask}
              />
            ))}
            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div
                onClick={() => onAddTask(status)}
                className="py-8 text-center border-2 border-dashed border-slate-200/60 dark:border-slate-800/60 rounded-xl cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <p className="text-xs text-slate-400">No tasks in {title}</p>
                <span className="text-[11px] text-brand-600 dark:text-brand-400 font-medium">
                  + Add task
                </span>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};
