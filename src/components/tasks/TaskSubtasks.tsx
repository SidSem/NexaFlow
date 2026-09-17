import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Subtask } from '../../types';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { Progress } from '../ui/Progress';
import { IconButton } from '../ui/IconButton';

interface TaskSubtasksProps {
  taskId: string;
  subtasks: Subtask[];
}

export const TaskSubtasks: React.FC<TaskSubtasksProps> = ({ taskId, subtasks }) => {
  const { createSubtask, updateSubtask, deleteSubtask } = useWorkspaceStore();
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const completedCount = subtasks.filter((s) => s.completed).length;
  const totalCount = subtasks.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createSubtask(taskId, newTitle.trim());
    setNewTitle('');
  };

  const handleStartEdit = (sub: Subtask) => {
    setEditingId(sub.id);
    setEditTitle(sub.title);
  };

  const handleSaveEdit = (subId: string) => {
    if (editTitle.trim()) {
      updateSubtask(taskId, subId, { title: editTitle.trim() });
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-3">
      {/* Header & Progress Bar */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>Subtasks</span>
          <span className="text-[11px] font-mono text-slate-400">
            {completedCount} / {totalCount}
          </span>
        </h4>
        <span className="text-xs font-mono font-medium text-brand-600 dark:text-brand-400">
          {Math.round(progressPercent)}%
        </span>
      </div>

      <Progress value={progressPercent} size="sm" />

      {/* Subtasks List */}
      <div className="space-y-1.5 pt-1">
        {subtasks.map((sub) => (
          <div
            key={sub.id}
            className="group flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-xs"
          >
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <button
                type="button"
                onClick={() => updateSubtask(taskId, sub.id, { completed: !sub.completed })}
                className="text-slate-400 hover:text-brand-600 transition-colors flex-shrink-0"
              >
                {sub.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {editingId === sub.id ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => handleSaveEdit(sub.id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(sub.id)}
                  autoFocus
                  className="w-full bg-white dark:bg-slate-900 border border-brand-500 rounded px-1.5 py-0.5 text-xs focus:outline-none"
                />
              ) : (
                <span
                  onClick={() => handleStartEdit(sub)}
                  className={`cursor-pointer truncate ${
                    sub.completed
                      ? 'line-through text-slate-400'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                  title="Click to edit"
                >
                  {sub.title}
                </span>
              )}
            </div>

            <IconButton
              icon={<Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-rose-500" />}
              aria-label="Delete subtask"
              size="xs"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => deleteSubtask(taskId, sub.id)}
            />
          </div>
        ))}
      </div>

      {/* Add Subtask Input */}
      <form onSubmit={handleAdd} className="flex items-center gap-2 pt-1">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new subtask..."
          className="flex-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs px-3 py-1.5 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <button
          type="submit"
          disabled={!newTitle.trim()}
          className="px-2.5 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-medium hover:bg-brand-500 disabled:opacity-50 transition-colors flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>
    </div>
  );
};
