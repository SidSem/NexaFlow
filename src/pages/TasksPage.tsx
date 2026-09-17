import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import {
  Trash2,
  Plus,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { useWorkspaceStore } from '../store/workspaceStore';
import { Task, Priority, TaskStatus, TableColumn } from '../types';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Dropdown } from '../components/ui/Dropdown';
import { CreateTaskModal } from '../components/tasks/CreateTaskModal';
import { TaskDetailsDrawer } from '../components/tasks/TaskDetailsDrawer';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const TasksPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { tasks, projects, members, moveTask, deleteTask } = useWorkspaceStore();

  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailTaskId, setDetailTaskId] = useState<string | null>(
    searchParams.get('taskId') || null
  );
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // URL state synchronization for filters
  const initialStatus = searchParams.get('status') || 'all';
  const initialPriority = searchParams.get('priority') || 'all';
  const initialProject = searchParams.get('projectId') || 'all';
  const initialAssignee = searchParams.get('assigneeId') || 'all';

  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [priorityFilter, setPriorityFilter] = useState<string>(initialPriority);
  const [projectFilter, setProjectFilter] = useState<string>(initialProject);
  const [assigneeFilter, setAssigneeFilter] = useState<string>(initialAssignee);

  // Update URL params when filters change
  useEffect(() => {
    const params: Record<string, string> = {};
    if (statusFilter !== 'all') params.status = statusFilter;
    if (priorityFilter !== 'all') params.priority = priorityFilter;
    if (projectFilter !== 'all') params.projectId = projectFilter;
    if (assigneeFilter !== 'all') params.assigneeId = assigneeFilter;
    if (detailTaskId) params.taskId = detailTaskId;
    setSearchParams(params, { replace: true });
  }, [statusFilter, priorityFilter, projectFilter, assigneeFilter, detailTaskId, setSearchParams]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
      if (projectFilter !== 'all' && task.projectId !== projectFilter) return false;
      if (assigneeFilter !== 'all' && task.assigneeId !== assigneeFilter) return false;
      return true;
    });
  }, [tasks, statusFilter, priorityFilter, projectFilter, assigneeFilter]);

  const priorityBadges: Record<Priority, { label: string; variant: 'neutral' | 'info' | 'warning' | 'danger' }> = {
    low: { label: 'Low', variant: 'neutral' },
    medium: { label: 'Medium', variant: 'info' },
    high: { label: 'High', variant: 'warning' },
    urgent: { label: 'Urgent', variant: 'danger' },
  };

  // Bulk Actions Handlers
  const handleBulkComplete = () => {
    selectedTaskIds.forEach((id) => moveTask(id, 'done'));
    setSelectedTaskIds([]);
  };

  const handleBulkDelete = () => {
    selectedTaskIds.forEach((id) => deleteTask(id));
    setSelectedTaskIds([]);
  };

  const handleBulkStatusChange = (newStatus: TaskStatus) => {
    selectedTaskIds.forEach((id) => moveTask(id, newStatus));
    setSelectedTaskIds([]);
  };

  const columns: TableColumn<Task>[] = [
    {
      key: 'title',
      header: 'Task Name',
      sortable: true,
      render: (task) => {
        const isDone = task.status === 'done';
        return (
          <div
            onClick={() => setDetailTaskId(task.id)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span
              className={`font-semibold text-xs group-hover:text-brand-600 transition-colors truncate max-w-xs ${
                isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {task.title}
            </span>
          </div>
        );
      },
    },
    {
      key: 'projectId',
      header: 'Project',
      sortable: true,
      render: (task) => {
        const proj = projects.find((p) => p.id === task.projectId);
        return proj ? (
          <div className="flex items-center gap-1.5 truncate max-w-[130px]">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: proj.color }}
            />
            <span className="text-slate-700 dark:text-slate-300 truncate">{proj.name}</span>
          </div>
        ) : (
          <span className="text-slate-400">-</span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (task) => {
        const statusVariants: Record<TaskStatus, 'neutral' | 'info' | 'brand' | 'warning' | 'success'> = {
          backlog: 'neutral',
          todo: 'info',
          in_progress: 'brand',
          review: 'warning',
          done: 'success',
        };

        return (
          <Badge variant={statusVariants[task.status]} size="sm">
            {task.status.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: (task) => (
        <Badge variant={priorityBadges[task.priority].variant} size="sm" dot>
          {priorityBadges[task.priority].label}
        </Badge>
      ),
    },
    {
      key: 'assigneeId',
      header: 'Assignee',
      render: (task) => {
        const assignee = members.find((m) => m.id === task.assigneeId);
        return assignee ? (
          <div className="flex items-center gap-1.5">
            <Avatar src={assignee.avatar} name={assignee.name} size="xs" />
            <span className="truncate max-w-[110px]">{assignee.name}</span>
          </div>
        ) : (
          <span className="text-slate-400 italic">Unassigned</span>
        );
      },
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      sortable: true,
      render: (task) => {
        if (!task.dueDate) return <span className="text-slate-400">-</span>;
        const isOverdue =
          task.status !== 'done' &&
          new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

        return (
          <span className={`font-mono ${isOverdue ? 'text-rose-500 font-bold' : ''}`}>
            {format(parseISO(task.dueDate), 'MMM d, yyyy')}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (task) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setDetailTaskId(task.id)}
            className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline px-1.5 py-0.5"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setTaskToDelete(task.id)}
            className="text-[11px] text-rose-500 hover:underline px-1.5 py-0.5"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Task Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Advanced tabular control with sorting, multi-faceted filtering, and bulk operations.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setCreateModalOpen(true)}
        >
          New Task
        </Button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-1 text-slate-400 font-semibold uppercase tracking-wider text-[10px] mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="backlog">Backlog</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>

        {/* Priority */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
          <option value="urgent">Urgent Priority</option>
        </select>

        {/* Project */}
        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none max-w-[160px]"
        >
          <option value="all">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Assignee */}
        <select
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none max-w-[160px]"
        >
          <option value="all">All Assignees</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        {(statusFilter !== 'all' ||
          priorityFilter !== 'all' ||
          projectFilter !== 'all' ||
          assigneeFilter !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setStatusFilter('all');
              setPriorityFilter('all');
              setProjectFilter('all');
              setAssigneeFilter('all');
            }}
            className="text-brand-600 dark:text-brand-400 font-medium hover:underline text-xs ml-auto"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Advanced Data Table with Bulk Actions */}
      <DataTable
        data={filteredTasks}
        columns={columns}
        keyExtractor={(t) => t.id}
        selectedIds={selectedTaskIds}
        onSelectionChange={setSelectedTaskIds}
        searchPlaceholder="Search task titles, assignees, or projects..."
        bulkActions={
          <>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
              onClick={handleBulkComplete}
            >
              Mark Done
            </Button>
            <Dropdown
              trigger={
                <Button variant="secondary" size="sm">
                  Change Status
                </Button>
              }
              items={[
                { key: 'todo', label: 'To Do', onClick: () => handleBulkStatusChange('todo') },
                { key: 'in_progress', label: 'In Progress', onClick: () => handleBulkStatusChange('in_progress') },
                { key: 'review', label: 'Review', onClick: () => handleBulkStatusChange('review') },
                { key: 'done', label: 'Done', onClick: () => handleBulkStatusChange('done') },
              ]}
            />
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={handleBulkDelete}
            >
              Delete
            </Button>
            <button
              type="button"
              onClick={() => setSelectedTaskIds([])}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 px-2"
            >
              Clear
            </button>
          </>
        }
        mobileCardRender={(task) => {
          const proj = projects.find((p) => p.id === task.projectId);
          const assignee = members.find((m) => m.id === task.assigneeId);

          return (
            <div
              onClick={() => setDetailTaskId(task.id)}
              className="space-y-2 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <Badge variant={priorityBadges[task.priority].variant} size="sm">
                  {task.priority}
                </Badge>
                <Badge variant="neutral" size="sm">
                  {task.status.replace('_', ' ')}
                </Badge>
              </div>

              <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                {task.title}
              </h4>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                <span>{proj?.name}</span>
                {assignee && (
                  <div className="flex items-center gap-1">
                    <Avatar src={assignee.avatar} name={assignee.name} size="xs" />
                    <span>{assignee.name}</span>
                  </div>
                )}
              </div>
            </div>
          );
        }}
      />

      {/* Task Details Drawer */}
      <TaskDetailsDrawer
        taskId={detailTaskId}
        isOpen={!!detailTaskId}
        onClose={() => setDetailTaskId(null)}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={() => {
          if (taskToDelete) {
            deleteTask(taskToDelete);
            setTaskToDelete(null);
          }
        }}
        title="Delete Task"
        message="Are you sure you want to permanently delete this task?"
        danger
      />
    </div>
  );
};
