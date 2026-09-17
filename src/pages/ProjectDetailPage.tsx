import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import {
  Calendar,
  MoreVertical,
  Plus,
  ArrowLeft,
  Copy,
  Archive,
  Trash2,
  Kanban,
  List as ListIcon,
  Info,
} from 'lucide-react';
import { useWorkspaceStore } from '../store/workspaceStore';
import { Priority } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { Avatar } from '../components/ui/Avatar';
import { Tabs } from '../components/ui/Tabs';
import { Dropdown } from '../components/ui/Dropdown';
import { Card } from '../components/ui/Card';
import { KanbanBoard } from '../components/tasks/KanbanBoard';
import { DataTable } from '../components/ui/DataTable';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { CreateTaskModal } from '../components/tasks/CreateTaskModal';
import { TaskDetailsDrawer } from '../components/tasks/TaskDetailsDrawer';

export const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const {
    projects,
    tasks,
    members,
    deleteProject,
    duplicateProject,
    archiveProject,
  } = useWorkspaceStore();

  const project = projects.find((p) => p.id === projectId);
  const [activeTab, setActiveTab] = useState('board');
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Project tasks
  const projectTasks = useMemo(() => {
    return tasks.filter((t) => t.projectId === projectId);
  }, [tasks, projectId]);

  if (!project) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Project not found
        </h2>
        <p className="text-xs text-slate-500">
          The requested project ID "{projectId}" does not exist or was deleted.
        </p>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/projects')}
        >
          Back to Projects
        </Button>
      </div>
    );
  }

  // Calculated metrics
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter((t) => t.status === 'done').length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const projectMembers = members.filter((m) => project.memberIds.includes(m.id));

  const priorityBadges: Record<Priority, { label: string; variant: 'neutral' | 'info' | 'warning' | 'danger' }> = {
    low: { label: 'Low', variant: 'neutral' },
    medium: { label: 'Medium', variant: 'info' },
    high: { label: 'High', variant: 'warning' },
    urgent: { label: 'Urgent', variant: 'danger' },
  };

  const projectDropdownItems = [
    {
      key: 'duplicate',
      label: 'Duplicate Project',
      icon: <Copy className="w-3.5 h-3.5" />,
      onClick: () => {
        const dup = duplicateProject(project.id);
        if (dup) navigate(`/projects/${dup.id}`);
      },
    },
    {
      key: 'archive',
      label: project.status === 'archived' ? 'Unarchive' : 'Archive',
      icon: <Archive className="w-3.5 h-3.5" />,
      onClick: () => archiveProject(project.id),
    },
    {
      key: 'delete',
      label: 'Delete Project',
      icon: <Trash2 className="w-3.5 h-3.5 text-rose-500" />,
      danger: true,
      dividerBefore: true,
      onClick: () => setShowDeleteConfirm(true),
    },
  ];

  const tabsList = [
    { id: 'board', label: 'Kanban Board', icon: <Kanban className="w-3.5 h-3.5" /> },
    { id: 'list', label: 'Tasks List', icon: <ListIcon className="w-3.5 h-3.5" />, count: totalTasks },
    { id: 'overview', label: 'Overview', icon: <Info className="w-3.5 h-3.5" /> },
  ];

  const taskTableColumns = [
    {
      key: 'title',
      header: 'Task Title',
      sortable: true,
      render: (task: any) => (
        <span
          onClick={() => setSelectedTaskId(task.id)}
          className="font-medium text-slate-900 dark:text-slate-100 hover:text-brand-600 cursor-pointer"
        >
          {task.title}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (task: any) => (
        <Badge
          variant={
            task.status === 'done'
              ? 'success'
              : task.status === 'in_progress'
              ? 'brand'
              : task.status === 'review'
              ? 'warning'
              : 'neutral'
          }
          size="sm"
        >
          {task.status.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: (task: any) => (
        <Badge variant={priorityBadges[task.priority as Priority].variant} size="sm">
          {task.priority}
        </Badge>
      ),
    },
    {
      key: 'assigneeId',
      header: 'Assignee',
      render: (task: any) => {
        const mem = members.find((m) => m.id === task.assigneeId);
        return mem ? (
          <div className="flex items-center gap-1.5">
            <Avatar src={mem.avatar} name={mem.name} size="xs" />
            <span className="truncate max-w-[110px]">{mem.name}</span>
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
      render: (task: any) => (
        <span>{task.dueDate ? format(parseISO(task.dueDate), 'MMM d, yyyy') : '-'}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Project Details Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <button
              type="button"
              onClick={() => navigate('/projects')}
              aria-label="Back to Projects"
              title="Back to Projects"
              className="mt-0.5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <span
              className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
              style={{ backgroundColor: project.color }}
            />

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {project.name}
                </h1>
                <Badge variant={priorityBadges[project.priority].variant} size="sm">
                  {project.priority}
                </Badge>
                {project.status === 'archived' && (
                  <Badge variant="neutral" size="sm">
                    Archived
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setCreateTaskModalOpen(true)}
            >
              Add Task
            </Button>

            <Dropdown
              align="right"
              trigger={
                <button
                  type="button"
                  aria-label="Project actions"
                  title="Project actions"
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              }
              items={projectDropdownItems}
            />
          </div>
        </div>

        {/* Milestone Meta Bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Completion:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {progressPercent}%
              </span>
              <div className="w-24">
                <Progress value={progressPercent} size="sm" color={project.color} />
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>Target Due: {project.dueDate ? format(parseISO(project.dueDate), 'MMM d, yyyy') : 'No due date'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Team:</span>
            <div className="flex -space-x-1.5">
              {projectMembers.map((m) => (
                <Avatar
                  key={m.id}
                  src={m.avatar}
                  name={m.name}
                  size="xs"
                  className="ring-2 ring-white dark:ring-slate-900"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <Tabs
        tabs={tabsList}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="underline"
      />

      {/* Tab Contents */}
      {activeTab === 'board' && (
        <div className="h-[calc(100vh-320px)] min-h-[500px]">
          <KanbanBoard tasks={projectTasks} projectId={project.id} />
        </div>
      )}

      {activeTab === 'list' && (
        <DataTable
          data={projectTasks}
          columns={taskTableColumns}
          keyExtractor={(t) => t.id}
          searchPlaceholder="Filter project tasks..."
        />
      )}

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Project Blueprint & Scope
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {project.description}
            </p>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Timeline Dates
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Start Date</span>
                  <span className="font-semibold">{project.startDate}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Due Date</span>
                  <span className="font-semibold">{project.dueDate}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Assigned Team ({projectMembers.length})
            </h3>
            <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
              {projectMembers.map((member) => (
                <div key={member.id} className="pt-2.5 first:pt-0 flex items-center gap-3">
                  <Avatar src={member.avatar} name={member.name} size="sm" />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {member.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Task Details Drawer */}
      <TaskDetailsDrawer
        taskId={selectedTaskId}
        isOpen={!!selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={createTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
        defaultProjectId={project.id}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          deleteProject(project.id);
          setShowDeleteConfirm(false);
          navigate('/projects');
        }}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.name}"?`}
        danger
      />
    </div>
  );
};
