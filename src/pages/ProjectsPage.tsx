import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import {
  Search,
  LayoutGrid,
  List,
  Plus,
  MoreVertical,
  Calendar,
  Copy,
  Archive,
  Trash2,
  FolderKanban,
} from 'lucide-react';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useDebounce } from '../hooks/useDebounce';
import { Project, Priority, ProjectStatus } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { Avatar } from '../components/ui/Avatar';
import { Dropdown } from '../components/ui/Dropdown';
import { Card } from '../components/ui/Card';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { CreateProjectModal } from '../components/projects/CreateProjectModal';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { projects, tasks, members, deleteProject, duplicateProject, archiveProject } =
    useWorkspaceStore();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 250);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<'all' | ProjectStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');
  const [sortBy, setSortBy] = useState<
    'updated' | 'dueDate' | 'progress' | 'alphabetical'
  >('updated');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Compute tasks progress per project
  const projectsWithStats = useMemo(() => {
    return projects.map((p) => {
      const projTasks = tasks.filter((t) => t.projectId === p.id);
      const totalTasks = projTasks.length;
      const completedTasks = projTasks.filter((t) => t.status === 'done').length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      const projMembers = members.filter((m) => p.memberIds.includes(m.id));

      return {
        ...p,
        totalTasks,
        completedTasks,
        progress,
        projMembers,
      };
    });
  }, [projects, tasks, members]);

  // Filtering & Searching
  const filteredProjects = useMemo(() => {
    let result = [...projectsWithStats];

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      result = result.filter((p) => p.priority === priorityFilter);
    }

    // Debounced search
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.labels.some((l) => l.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'alphabetical') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'progress') {
        return b.progress - a.progress;
      }
      if (sortBy === 'dueDate') {
        return (a.dueDate || '').localeCompare(b.dueDate || '');
      }
      // default: updated
      return (b.updatedAt || '').localeCompare(a.updatedAt || '');
    });

    return result;
  }, [projectsWithStats, statusFilter, priorityFilter, debouncedSearch, sortBy]);

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  const priorityBadges: Record<Priority, { label: string; variant: 'neutral' | 'info' | 'warning' | 'danger' }> = {
    low: { label: 'Low', variant: 'neutral' },
    medium: { label: 'Medium', variant: 'info' },
    high: { label: 'High', variant: 'warning' },
    urgent: { label: 'Urgent', variant: 'danger' },
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Projects
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage everything you're building across teams and timelines.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setCreateModalOpen(true)}
        >
          New Project
        </Button>
      </div>

      {/* Control Bar: Search + Filters + Sort + View Toggle */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
        {/* Search */}
        <div className="w-full lg:w-72">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            leftIcon={<Search className="w-4 h-4" />}
            className="h-8 text-xs"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
            <option value="on_hold">On Hold</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent Priority</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="updated">Recently Updated</option>
            <option value="dueDate">Target Due Date</option>
            <option value="progress">Progress %</option>
            <option value="alphabetical">Alphabetical (A-Z)</option>
          </select>

          {/* Grid / List View Toggle */}
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              title="Grid view"
              className={`p-1 rounded ${
                viewMode === 'grid'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="List view"
              title="List view"
              className={`p-1 rounded ${
                viewMode === 'list'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="w-6 h-6" />}
          title="No projects match your filter"
          description="Try clearing your search query or adjusting your status and priority filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('all');
            setPriorityFilter('all');
          }}
        />
      ) : viewMode === 'grid' ? (
        /* Grid Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const dropdownItems = [
              {
                key: 'open',
                label: 'Open Workspace',
                onClick: () => navigate(`/projects/${project.id}`),
              },
              {
                key: 'duplicate',
                label: 'Duplicate Project',
                icon: <Copy className="w-3.5 h-3.5" />,
                onClick: () => duplicateProject(project.id),
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
                onClick: () => setProjectToDelete(project),
              },
            ];

            return (
              <Card
                key={project.id}
                hoverEffect
                onClick={() => navigate(`/projects/${project.id}`)}
                className="p-5 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      <Badge
                        variant={priorityBadges[project.priority].variant}
                        size="sm"
                        dot
                      >
                        {priorityBadges[project.priority].label}
                      </Badge>
                      {project.status === 'archived' && (
                        <Badge variant="neutral" size="sm">
                          Archived
                        </Badge>
                      )}
                    </div>

                    <div onClick={(e) => e.stopPropagation()}>
                      <Dropdown
                        align="right"
                        trigger={
                          <button
                            type="button"
                            aria-label="Project actions"
                            title="Project actions"
                            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        }
                        items={dropdownItems}
                      />
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-slate-900 dark:text-white line-clamp-1 mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {project.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Labels */}
                  {project.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.labels.map((l) => (
                        <span
                          key={l}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Completion</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {project.progress}%
                    </span>
                  </div>
                  <Progress value={project.progress} size="sm" color={project.color} />

                  <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{project.dueDate ? format(parseISO(project.dueDate), 'MMM d, yyyy') : 'No date'}</span>
                    </div>

                    <div className="flex -space-x-1.5">
                      {project.projMembers.map((m) => (
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
              </Card>
            );
          })}
        </div>
      ) : (
        /* List Mode */
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-xs divide-y divide-slate-100 dark:divide-slate-800">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer text-xs"
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <span
                  className="w-3.5 h-3.5 rounded-full mt-0.5 flex-shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                      {project.name}
                    </h3>
                    <Badge variant={priorityBadges[project.priority].variant} size="sm">
                      {project.priority}
                    </Badge>
                  </div>
                  <p className="text-slate-500 line-clamp-1">{project.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 flex-shrink-0">
                <div className="w-28 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Progress</span>
                    <span className="font-bold">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} size="sm" color={project.color} />
                </div>

                <div className="flex items-center gap-1.5 text-slate-400 w-24">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{project.dueDate ? format(parseISO(project.dueDate), 'MMM d') : '-'}</span>
                </div>

                <div className="flex -space-x-1.5 w-16">
                  {project.projMembers.slice(0, 3).map((m) => (
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
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Project"
        message={`Are you sure you want to permanently delete "${projectToDelete?.name}"? All associated tasks will also be removed.`}
        confirmLabel="Delete Project"
        danger
      />
    </div>
  );
};
