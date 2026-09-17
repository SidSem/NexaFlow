import React, { useState } from 'react';
import {
  Copy,
  Trash2,
} from 'lucide-react';
import { TaskStatus, Priority, Task } from '../../types';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { Drawer } from '../ui/Drawer';
import { Select } from '../ui/Select';
import { DatePicker } from '../ui/DatePicker';
import { MultiSelect } from '../ui/MultiSelect';
import { IconButton } from '../ui/IconButton';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { TaskSubtasks } from './TaskSubtasks';
import { TaskAttachments } from './TaskAttachments';
import { TaskComments } from './TaskComments';
import { TaskActivityLog } from './TaskActivityLog';

interface TaskDetailsDrawerProps {
  taskId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

interface TaskDetailsDrawerContentProps {
  task: Task;
  onClose: () => void;
}

const TaskDetailsDrawerContent: React.FC<TaskDetailsDrawerContentProps> = ({ task, onClose }) => {
  const { projects, members, updateTask, deleteTask, duplicateTask } = useWorkspaceStore();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const project = projects.find((p) => p.id === task.projectId);

  const handleTitleBlur = () => {
    if (title.trim() && title !== task.title) {
      updateTask(task.id, { title: title.trim() });
    }
  };

  const handleDescriptionBlur = () => {
    if (description !== task.description) {
      updateTask(task.id, { description });
    }
  };

  const statusOptions = [
    { value: 'backlog', label: 'Backlog' },
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'done', label: 'Done' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent Priority' },
  ];

  const memberOptions = [
    { value: '', label: 'Unassigned' },
    ...members.map((m) => ({
      value: m.id,
      label: `${m.name} (${m.role})`,
    })),
  ];

  const availableLabels = [
    { value: 'Frontend', label: 'Frontend' },
    { value: 'UI', label: 'UI' },
    { value: 'UX', label: 'UX' },
    { value: 'Design', label: 'Design' },
    { value: 'Accessibility', label: 'Accessibility' },
    { value: 'Performance', label: 'Performance' },
    { value: 'Mobile', label: 'Mobile' },
    { value: 'QA', label: 'QA' },
  ];

  const handleDelete = () => {
    deleteTask(task.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleDuplicate = () => {
    duplicateTask(task.id);
  };

  return (
    <>
      <div className="space-y-6 pb-6 text-left">
        {/* Header summary info */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 truncate text-xs text-slate-500">
            <span>{project?.name || 'Workspace'} /</span>
            <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
              {task.id}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <IconButton
              icon={<Copy className="w-3.5 h-3.5" />}
              aria-label="Duplicate Task"
              tooltip="Duplicate Task"
              size="xs"
              variant="outline"
              onClick={handleDuplicate}
            />
            <IconButton
              icon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
              aria-label="Delete Task"
              tooltip="Delete Task"
              size="xs"
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
            />
          </div>
        </div>

        {/* Editable Title */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className="w-full text-lg font-bold text-slate-900 dark:text-slate-100 bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-brand-500 focus:outline-none transition-colors py-1 leading-snug"
            placeholder="Task title..."
          />
        </div>

        {/* Key Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs">
          <Select
            label="Status"
            value={task.status}
            onChange={(e) => updateTask(task.id, { status: e.target.value as TaskStatus })}
            options={statusOptions}
          />

          <Select
            label="Priority"
            value={task.priority}
            onChange={(e) => updateTask(task.id, { priority: e.target.value as Priority })}
            options={priorityOptions}
          />

          <Select
            label="Assignee"
            value={task.assigneeId}
            onChange={(e) => updateTask(task.id, { assigneeId: e.target.value })}
            options={memberOptions}
          />

          <DatePicker
            label="Due Date"
            value={task.dueDate}
            onChange={(d) => updateTask(task.id, { dueDate: d })}
          />
        </div>

        {/* Labels */}
        <div>
          <MultiSelect
            label="Labels"
            options={availableLabels}
            value={task.labels}
            onChange={(newLabels) => updateTask(task.id, { labels: newLabels })}
            placeholder="Add labels..."
          />
        </div>

        {/* Editable Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            rows={4}
            placeholder="Add details or context for this task..."
            className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-y"
          />
        </div>

        {/* Subtasks Section */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <TaskSubtasks taskId={task.id} subtasks={task.subtasks} />
        </div>

        {/* Attachments UI */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <TaskAttachments taskId={task.id} attachments={task.attachments} />
        </div>

        {/* Comments Section */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <TaskComments taskId={task.id} comments={task.comments} />
        </div>

        {/* Activity Log */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <TaskActivityLog activity={task.activity} />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmLabel="Delete Task"
        danger
      />
    </>
  );
};

export const TaskDetailsDrawer: React.FC<TaskDetailsDrawerProps> = ({
  taskId,
  isOpen,
  onClose,
}) => {
  const { tasks } = useWorkspaceStore();
  const task = tasks.find((t) => t.id === taskId);

  return (
    <Drawer
      isOpen={isOpen && !!task}
      onClose={onClose}
      size="lg"
      title="Task Details"
      footer={
        <div className="flex items-center justify-end w-full">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Close Details
          </button>
        </div>
      }
    >
      {task && (
        <TaskDetailsDrawerContent
          key={task.id}
          task={task}
          onClose={onClose}
        />
      )}
    </Drawer>
  );
};

