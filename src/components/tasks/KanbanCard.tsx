import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { format, parseISO } from 'date-fns';
import {
  Calendar,
  CheckSquare,
  Paperclip,
  MessageSquare,
  MoreVertical,
  Copy,
  Trash2,
} from 'lucide-react';
import { Task, Priority } from '../../types';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { Dropdown } from '../ui/Dropdown';

interface KanbanCardProps {
  task: Task;
  index: number;
  onOpenDetails: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  task,
  index,
  onOpenDetails,
  onDelete,
}) => {
  const { members, duplicateTask } = useWorkspaceStore();
  const assignee = members.find((m) => m.id === task.assigneeId);

  const priorityBadges: Record<Priority, { label: string; variant: 'neutral' | 'info' | 'warning' | 'danger' }> = {
    low: { label: 'Low', variant: 'neutral' },
    medium: { label: 'Medium', variant: 'info' },
    high: { label: 'High', variant: 'warning' },
    urgent: { label: 'Urgent', variant: 'danger' },
  };

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;

  const isOverdue =
    task.dueDate &&
    task.status !== 'done' &&
    new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  const dropdownItems = [
    {
      key: 'open',
      label: 'Open Details',
      onClick: () => onOpenDetails(task.id),
    },
    {
      key: 'duplicate',
      label: 'Duplicate',
      icon: <Copy className="w-3.5 h-3.5" />,
      onClick: () => duplicateTask(task.id),
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <Trash2 className="w-3.5 h-3.5 text-rose-500" />,
      danger: true,
      dividerBefore: true,
      onClick: () => onDelete(task.id),
    },
  ];

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onOpenDetails(task.id)}
          className={`p-3.5 rounded-xl border bg-white dark:bg-slate-900 shadow-xs transition-all duration-150 cursor-pointer select-none group relative ${
            snapshot.isDragging
              ? 'ring-2 ring-brand-500 shadow-xl scale-[1.02] rotate-1 z-50 border-transparent bg-white/95 dark:bg-slate-800'
              : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
          }`}
        >
          {/* Top Row: Priority Badge & Action Menu */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <Badge
              variant={priorityBadges[task.priority].variant}
              size="sm"
              dot
            >
              {priorityBadges[task.priority].label}
            </Badge>

            <div
              onClick={(e) => e.stopPropagation()}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Dropdown
                align="right"
                trigger={
                  <button
                    type="button"
                    className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                }
                items={dropdownItems}
              />
            </div>
          </div>

          {/* Title */}
          <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug line-clamp-2 mb-2">
            {task.title}
          </h4>

          {/* Labels */}
          {task.labels.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 mb-3">
              {task.labels.slice(0, 3).map((label) => (
                <span
                  key={label}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
                >
                  {label}
                </span>
              ))}
              {task.labels.length > 3 && (
                <span className="text-[10px] text-slate-400">
                  +{task.labels.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Card Footer: Due Date, Subtasks, Attachments, Comments, Assignee */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              {/* Due Date */}
              {task.dueDate && (
                <div
                  className={`flex items-center gap-1 font-medium ${
                    isOverdue ? 'text-rose-500 font-semibold' : ''
                  }`}
                  title={isOverdue ? 'Task is overdue' : 'Due date'}
                >
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{format(parseISO(task.dueDate), 'MMM d')}</span>
                </div>
              )}

              {/* Subtasks Progress */}
              {totalSubtasks > 0 && (
                <div
                  className="flex items-center gap-1"
                  title={`${completedSubtasks} of ${totalSubtasks} subtasks completed`}
                >
                  <CheckSquare className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>
                    {completedSubtasks}/{totalSubtasks}
                  </span>
                </div>
              )}

              {/* Attachments */}
              {task.attachments.length > 0 && (
                <div
                  className="flex items-center gap-0.5"
                  title={`${task.attachments.length} attachments`}
                >
                  <Paperclip className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{task.attachments.length}</span>
                </div>
              )}

              {/* Comments */}
              {task.comments.length > 0 && (
                <div
                  className="flex items-center gap-0.5"
                  title={`${task.comments.length} comments`}
                >
                  <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{task.comments.length}</span>
                </div>
              )}
            </div>

            {/* Assignee Avatar */}
            {assignee && (
              <Avatar
                src={assignee.avatar}
                name={assignee.name}
                size="xs"
              />
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};
