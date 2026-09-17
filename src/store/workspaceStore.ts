import { create } from 'zustand';
import {
  Project,
  Task,
  TeamMember,
  NotificationItem,
  UserPreferences,
  TaskStatus,
  WorkspaceData,
  Subtask,
  Comment,
  ActivityEvent,
} from '../types';
import {
  initialProjects,
  initialTasks,
  initialMembers,
  initialNotifications,
  initialPreferences,
} from '../data/seedData';
import { useToastStore } from './toastStore';

const STORAGE_KEY = 'nexaflow_workspace_v1';
const PREFS_STORAGE_KEY = 'nexaflow_preferences';

function sanitizeProjects(input: unknown): Project[] {
  if (!Array.isArray(input)) return initialProjects;
  const sanitized = input
    .filter((p): p is Project => {
      return Boolean(
        p &&
        typeof p === 'object' &&
        typeof (p as any).id === 'string' &&
        typeof (p as any).name === 'string'
      );
    })
    .map((p) => ({
      id: String(p.id),
      name: String(p.name || 'Untitled Project'),
      description: String(p.description || ''),
      status: (['active', 'completed', 'archived', 'on_hold'].includes(p.status)
        ? p.status
        : 'active') as Project['status'],
      priority: (['low', 'medium', 'high', 'urgent'].includes(p.priority)
        ? p.priority
        : 'medium') as Project['priority'],
      startDate: String(p.startDate || new Date().toISOString().split('T')[0]),
      dueDate: String(p.dueDate || new Date().toISOString().split('T')[0]),
      color: typeof p.color === 'string' ? p.color : '#6366f1',
      icon: String((p as any).icon || 'FolderKanban'),
      memberIds: Array.isArray(p.memberIds) ? p.memberIds.map(String) : [],
      labels: Array.isArray((p as any).labels) ? (p as any).labels.map(String) : [],
      createdAt: String(p.createdAt || new Date().toISOString()),
      updatedAt: String(p.updatedAt || new Date().toISOString()),
    }));
  return sanitized.length > 0 ? sanitized : initialProjects;
}

function sanitizeTasks(input: unknown): Task[] {
  if (!Array.isArray(input)) return initialTasks;
  const sanitized = input
    .filter((t): t is Task => {
      return Boolean(
        t &&
        typeof t === 'object' &&
        typeof (t as any).id === 'string' &&
        typeof (t as any).title === 'string'
      );
    })
    .map((t) => ({
      id: String(t.id),
      title: String(t.title || 'Untitled Task'),
      description: String(t.description || ''),
      projectId: String(t.projectId || 'proj-1'),
      status: (['backlog', 'todo', 'in_progress', 'review', 'done'].includes(t.status)
        ? t.status
        : 'todo') as TaskStatus,
      priority: (['low', 'medium', 'high', 'urgent'].includes(t.priority)
        ? t.priority
        : 'medium') as Task['priority'],
      assigneeId: String(t.assigneeId || ''),
      dueDate: String(t.dueDate || ''),
      labels: Array.isArray(t.labels) ? t.labels.map(String) : [],
      subtasks: Array.isArray(t.subtasks)
        ? t.subtasks
            .filter((s: any) => s && typeof s.id === 'string')
            .map((s: any) => ({
              id: String(s.id),
              title: String(s.title || ''),
              completed: Boolean(s.completed),
            }))
        : [],
      attachments: Array.isArray(t.attachments) ? t.attachments : [],
      comments: Array.isArray(t.comments) ? t.comments : [],
      activity: Array.isArray(t.activity) ? t.activity : [],
      createdAt: String(t.createdAt || new Date().toISOString()),
      updatedAt: String(t.updatedAt || new Date().toISOString()),
    }));
  return sanitized.length > 0 ? sanitized : initialTasks;
}

function sanitizeMembers(input: unknown): TeamMember[] {
  if (!Array.isArray(input)) return initialMembers;
  const sanitized = input.filter((m): m is TeamMember => {
    return Boolean(
      m &&
      typeof m === 'object' &&
      typeof (m as any).id === 'string' &&
      typeof (m as any).name === 'string'
    );
  });
  return sanitized.length > 0 ? sanitized : initialMembers;
}

function sanitizeNotifications(input: unknown): NotificationItem[] {
  if (!Array.isArray(input)) return initialNotifications;
  return input.filter((n): n is NotificationItem => {
    return Boolean(
      n &&
      typeof n === 'object' &&
      typeof (n as any).id === 'string' &&
      typeof (n as any).title === 'string'
    );
  });
}

function sanitizePreferences(input: unknown): UserPreferences {
  if (!input || typeof input !== 'object') return initialPreferences;
  const p = input as Partial<UserPreferences>;
  return {
    theme: (['light', 'dark', 'system'].includes(p.theme as string) ? p.theme : 'system') as any,
    density: (p.density === 'compact' ? 'compact' : 'comfortable') as any,
    sidebarCollapsed: Boolean(p.sidebarCollapsed),
    highContrast: Boolean(p.highContrast),
    largerText: Boolean(p.largerText),
    reduceMotion: Boolean(p.reduceMotion),
  };
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading ${key} from storage:`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
    useToastStore.getState().error('Failed to save changes to local storage.');
  }
}

function applyPreferencesToDOM(prefs: UserPreferences) {
  const root = document.documentElement;

  // Theme
  if (prefs.theme === 'dark') {
    root.classList.add('dark');
  } else if (prefs.theme === 'light') {
    root.classList.remove('dark');
  } else {
    // system
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  // Accessibility
  if (prefs.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }

  if (prefs.largerText) {
    root.classList.add('text-lg-base');
  } else {
    root.classList.remove('text-lg-base');
  }

  if (prefs.reduceMotion) {
    root.classList.add('reduced-motion');
  } else {
    root.classList.remove('reduced-motion');
  }

  // Density
  if (prefs.density === 'compact') {
    root.classList.add('density-compact');
  } else {
    root.classList.remove('density-compact');
  }
}

interface WorkspaceState {
  workspace: {
    id: string;
    name: string;
    plan: string;
    owner: string;
  };
  projects: Project[];
  tasks: Task[];
  members: TeamMember[];
  notifications: NotificationItem[];
  preferences: UserPreferences;

  // Project actions
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => Project | null;
  archiveProject: (id: string) => void;

  // Task actions
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'subtasks' | 'attachments' | 'comments' | 'activity'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  duplicateTask: (id: string) => Task | null;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;

  // Subtask actions
  createSubtask: (taskId: string, title: string) => void;
  updateSubtask: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  // Comment actions
  createComment: (taskId: string, text: string) => void;
  deleteComment: (taskId: string, commentId: string) => void;

  // Team Member actions
  createMember: (member: Omit<TeamMember, 'id' | 'initials'>) => TeamMember;
  updateMember: (id: string, updates: Partial<TeamMember>) => void;
  deleteMember: (id: string) => void;

  // Notification actions
  createNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;

  // Preferences & Data actions
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetDemoData: () => void;
  importWorkspaceData: (data: WorkspaceData) => boolean;
  clearLocalData: () => void;
}

// Initial state loaded from localStorage or seeded
const rawSavedPrefs = loadFromStorage<UserPreferences>(PREFS_STORAGE_KEY, initialPreferences);
const savedPrefs = sanitizePreferences(rawSavedPrefs);
applyPreferencesToDOM(savedPrefs);

const rawSavedWorkspace = loadFromStorage<{
  workspace?: { id: string; name: string; plan: string; owner: string };
  projects?: unknown;
  tasks?: unknown;
  members?: unknown;
  notifications?: unknown;
}>(STORAGE_KEY, {});

const savedWorkspace = {
  workspace:
    rawSavedWorkspace &&
    typeof rawSavedWorkspace.workspace === 'object' &&
    rawSavedWorkspace.workspace?.name
      ? rawSavedWorkspace.workspace
      : {
          id: 'ws-1',
          name: 'Personal Workspace',
          plan: 'Enterprise Pro',
          owner: 'Alex Morgan',
        },
  projects: sanitizeProjects(rawSavedWorkspace?.projects),
  tasks: sanitizeTasks(rawSavedWorkspace?.tasks),
  members: sanitizeMembers(rawSavedWorkspace?.members),
  notifications: sanitizeNotifications(rawSavedWorkspace?.notifications),
};

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspace: savedWorkspace.workspace,
  projects: savedWorkspace.projects,
  tasks: savedWorkspace.tasks,
  members: savedWorkspace.members,
  notifications: savedWorkspace.notifications,
  preferences: savedPrefs,

  // Helper to persist everything
  _persist: () => {
    const s = get();
    saveToStorage(STORAGE_KEY, {
      workspace: s.workspace,
      projects: s.projects,
      tasks: s.tasks,
      members: s.members,
      notifications: s.notifications,
    });
  },

  // Project Actions
  createProject: (projectData) => {
    const id = 'proj-' + Date.now();
    const now = new Date().toISOString();
    const newProject: Project = {
      ...projectData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    set((state) => {
      const nextProjects = [newProject, ...state.projects];
      saveToStorage(STORAGE_KEY, {
        workspace: state.workspace,
        projects: nextProjects,
        tasks: state.tasks,
        members: state.members,
        notifications: state.notifications,
      });
      return { projects: nextProjects };
    });

    useToastStore.getState().success(`Project "${newProject.name}" created.`);
    return newProject;
  },

  updateProject: (id, updates) => {
    const now = new Date().toISOString();
    set((state) => {
      const nextProjects = state.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: now } : p
      );
      saveToStorage(STORAGE_KEY, {
        workspace: state.workspace,
        projects: nextProjects,
        tasks: state.tasks,
        members: state.members,
        notifications: state.notifications,
      });
      return { projects: nextProjects };
    });
    useToastStore.getState().info('Project updated.');
  },

  deleteProject: (id) => {
    const project = get().projects.find((p) => p.id === id);
    set((state) => {
      const nextProjects = state.projects.filter((p) => p.id !== id);
      const nextTasks = state.tasks.filter((t) => t.projectId !== id);
      saveToStorage(STORAGE_KEY, {
        workspace: state.workspace,
        projects: nextProjects,
        tasks: nextTasks,
        members: state.members,
        notifications: state.notifications,
      });
      return { projects: nextProjects, tasks: nextTasks };
    });
    useToastStore.getState().warning(`Project "${project?.name || 'Project'}" deleted.`);
  },

  duplicateProject: (id) => {
    const project = get().projects.find((p) => p.id === id);
    if (!project) return null;

    const newId = 'proj-' + Date.now();
    const now = new Date().toISOString();
    const duplicated: Project = {
      ...project,
      id: newId,
      name: `${project.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
    };

    // Duplicate project tasks as well
    const originalTasks = get().tasks.filter((t) => t.projectId === id);
    const duplicatedTasks: Task[] = originalTasks.map((t, idx) => ({
      ...t,
      id: 'task-' + Date.now() + '-' + idx,
      projectId: newId,
      createdAt: now,
      updatedAt: now,
    }));

    set((state) => {
      const nextProjects = [duplicated, ...state.projects];
      const nextTasks = [...state.tasks, ...duplicatedTasks];
      saveToStorage(STORAGE_KEY, {
        workspace: state.workspace,
        projects: nextProjects,
        tasks: nextTasks,
        members: state.members,
        notifications: state.notifications,
      });
      return { projects: nextProjects, tasks: nextTasks };
    });

    useToastStore.getState().success(`Duplicated project "${project.name}".`);
    return duplicated;
  },

  archiveProject: (id) => {
    set((state) => {
      const nextProjects = state.projects.map((p) => {
        if (p.id === id) {
          const newStatus = p.status === 'archived' ? 'active' : 'archived';
          return { ...p, status: newStatus as any, updatedAt: new Date().toISOString() };
        }
        return p;
      });
      saveToStorage(STORAGE_KEY, {
        workspace: state.workspace,
        projects: nextProjects,
        tasks: state.tasks,
        members: state.members,
        notifications: state.notifications,
      });
      return { projects: nextProjects };
    });
    useToastStore.getState().info('Project archive status updated.');
  },

  // Task Actions
  createTask: (taskData) => {
    const id = 'task-' + Date.now();
    const now = new Date().toISOString();
    const currentUserName = 'Alex Morgan';

    const newTask: Task = {
      ...taskData,
      id,
      createdAt: now,
      updatedAt: now,
      subtasks: [],
      attachments: [],
      comments: [],
      activity: [
        {
          id: 'act-' + Date.now(),
          type: 'task_created',
          description: `Task created by ${currentUserName}`,
          timestamp: now,
          user: currentUserName,
        },
      ],
    };

    set((state) => {
      const nextTasks = [newTask, ...state.tasks];
      saveToStorage(STORAGE_KEY, {
        workspace: state.workspace,
        projects: state.projects,
        tasks: nextTasks,
        members: state.members,
        notifications: state.notifications,
      });
      return { tasks: nextTasks };
    });

    useToastStore.getState().success(`Task "${newTask.title}" created.`);
    return newTask;
  },

  updateTask: (id, updates) => {
    const now = new Date().toISOString();
    const currentUserName = 'Alex Morgan';

    set((state) => {
      const nextTasks = state.tasks.map((task) => {
        if (task.id !== id) return task;

        const newActivities: ActivityEvent[] = [...task.activity];

        if (updates.status && updates.status !== task.status) {
          const statusLabels: Record<TaskStatus, string> = {
            backlog: 'Backlog',
            todo: 'To Do',
            in_progress: 'In Progress',
            review: 'Review',
            done: 'Done',
          };
          newActivities.unshift({
            id: 'act-' + Date.now() + '-status',
            type: 'status_changed',
            description: `Status changed to ${statusLabels[updates.status]}`,
            timestamp: now,
            user: currentUserName,
          });
        }

        if (updates.priority && updates.priority !== task.priority) {
          newActivities.unshift({
            id: 'act-' + Date.now() + '-priority',
            type: 'priority_changed',
            description: `Priority changed to ${updates.priority.toUpperCase()}`,
            timestamp: now,
            user: currentUserName,
          });
        }

        if (updates.assigneeId && updates.assigneeId !== task.assigneeId) {
          const member = state.members.find((m) => m.id === updates.assigneeId);
          newActivities.unshift({
            id: 'act-' + Date.now() + '-assignee',
            type: 'assignee_changed',
            description: `Reassigned to ${member?.name || 'Unassigned'}`,
            timestamp: now,
            user: currentUserName,
          });
        }

        return {
          ...task,
          ...updates,
          activity: newActivities,
          updatedAt: now,
        };
      });

      saveToStorage(STORAGE_KEY, {
        workspace: state.workspace,
        projects: state.projects,
        tasks: nextTasks,
        members: state.members,
        notifications: state.notifications,
      });
      return { tasks: nextTasks };
    });
  },

  deleteTask: (id) => {
    const task = get().tasks.find((t) => t.id === id);
    set((state) => {
      const nextTasks = state.tasks.filter((t) => t.id !== id);
      saveToStorage(STORAGE_KEY, {
        workspace: state.workspace,
        projects: state.projects,
        tasks: nextTasks,
        members: state.members,
        notifications: state.notifications,
      });
      return { tasks: nextTasks };
    });
    useToastStore.getState().warning(`Task "${task?.title || 'Task'}" deleted.`);
  },

  duplicateTask: (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return null;

    const newId = 'task-' + Date.now();
    const now = new Date().toISOString();
    const duplicated: Task = {
      ...task,
      id: newId,
      title: `${task.title} (Copy)`,
      createdAt: now,
      updatedAt: now,
      activity: [
        {
          id: 'act-' + Date.now(),
          type: 'task_created',
          description: `Duplicated from "${task.title}"`,
          timestamp: now,
          user: 'Alex Morgan',
        },
      ],
    };

    set((state) => {
      const nextTasks = [duplicated, ...state.tasks];
      saveToStorage(STORAGE_KEY, {
        workspace: state.workspace,
        projects: state.projects,
        tasks: nextTasks,
        members: state.members,
        notifications: state.notifications,
      });
      return { tasks: nextTasks };
    });

    useToastStore.getState().success(`Duplicated task "${task.title}".`);
    return duplicated;
  },

  moveTask: (taskId, newStatus) => {
    const now = new Date().toISOString();
    const statusLabels: Record<TaskStatus, string> = {
      backlog: 'Backlog',
      todo: 'To Do',
      in_progress: 'In Progress',
      review: 'Review',
      done: 'Done',
    };

    set((state) => {
      const task = state.tasks.find((t) => t.id === taskId);
      if (!task || task.status === newStatus) return state;

      const newActivities: ActivityEvent[] = [
        {
          id: 'act-' + Date.now(),
          type: 'status_changed',
          description: `Moved to ${statusLabels[newStatus]}`,
          timestamp: now,
          user: 'Alex Morgan',
        },
        ...task.activity,
      ];

      const nextTasks = state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: newStatus,
              updatedAt: now,
              activity: newActivities,
            }
          : t
      );

      // Trigger notification if marked done
      let nextNotifications = state.notifications;
      if (newStatus === 'done') {
        const notif: NotificationItem = {
          id: 'notif-' + Date.now(),
          type: 'task_completed',
          title: 'Task Completed',
          message: `Alex Morgan completed "${task.title}"`,
          timestamp: now,
          read: false,
          link: `/projects/${task.projectId}`,
        };
        nextNotifications = [notif, ...state.notifications];
      }

      saveToStorage(STORAGE_KEY, {
        workspace: state.workspace,
        projects: state.projects,
        tasks: nextTasks,
        members: state.members,
        notifications: nextNotifications,
      });

      return { tasks: nextTasks, notifications: nextNotifications };
    });

    useToastStore.getState().info(`Task moved to ${statusLabels[newStatus]}.`);
  },

  // Subtasks
  createSubtask: (taskId, title) => {
    const subId = 'sub-' + Date.now();
    set((state) => {
      const nextTasks = state.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const newSubtask: Subtask = { id: subId, title, completed: false };
        return {
          ...t,
          subtasks: [...t.subtasks, newSubtask],
          updatedAt: new Date().toISOString(),
        };
      });
      saveToStorage(STORAGE_KEY, {
        workspace: state.workspace,
        projects: state.projects,
        tasks: nextTasks,
        members: state.members,
        notifications: state.notifications,
      });
      return { tasks: nextTasks };
    });
    useToastStore.getState().success('Subtask added.');
  },

  updateSubtask: (taskId, subtaskId, updates) => {
    const now = new Date().toISOString();
    set((state) => {
      const nextTasks = state.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSubs = t.subtasks.map((s) => (s.id === subtaskId ? { ...s, ...updates } : s));

        const newActivities = [...t.activity];
        if (updates.completed !== undefined) {
          const targetSub = t.subtasks.find((s) => s.id === subtaskId);
          newActivities.unshift({
            id: 'act-' + Date.now(),
            type: 'subtask_completed',
            description: updates.completed
              ? `Completed subtask "${targetSub?.title || ''}"`
              : `Marked subtask "${targetSub?.title || ''}" incomplete`,
            timestamp: now,
            user: 'Alex Morgan',
          });
        }

        return {
          ...t,
          subtasks: updatedSubs,
          activity: newActivities,
          updatedAt: now,
        };
      });
      saveToStorage(STORAGE_KEY, {
        workspace: state.workspace,
        projects: state.projects,
        tasks: nextTasks,
        members: state.members,
        notifications: state.notifications,
      });
      return { tasks: nextTasks };
    });
  },

  deleteSubtask: (taskId, subtaskId) => {
    set((state) => {
      const nextTasks = state.tasks.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: t.subtasks.filter((s) => s.id !== subtaskId),
          updatedAt: new Date().toISOString(),
        };
      });
      saveToStorage(STORAGE_KEY, {
        workspace: state.workspace,
        projects: state.projects,
        tasks: nextTasks,
        members: state.members,
        notifications: state.notifications,
      });
      return { tasks: nextTasks };
    });
    useToastStore.getState().info('Subtask removed.');
  },

  // Comments
  createComment: (taskId, text) => {
    const now = new Date().toISOString();
    const commentId = 'c-' + Date.now();
    const currentMember = get().members[0] || initialMembers[0];

    const newComment: Comment = {
      id: commentId,
      authorName: currentMember.name,
      authorAvatar: currentMember.avatar,
      authorRole: currentMember.role,
      text,
      createdAt: now,
    };

    set((state) => {
      let taskTitle = '';
      const nextTasks = state.tasks.map((t) => {
        if (t.id !== taskId) return t;
        taskTitle = t.title;
        return {
          ...t,
          comments: [...t.comments, newComment],
          activity: [
            {
              id: 'act-' + Date.now(),
              type: 'comment_added' as const,
              description: `Added a comment`,
              timestamp: now,
              user: currentMember.name,
            },
            ...t.activity,
          ],
          updatedAt: now,
        };
      });

      const notif: NotificationItem = {
        id: 'notif-' + Date.now(),
        type: 'comment_added',
        title: 'New Comment',
        message: `${currentMember.name} commented on "${taskTitle}"`,
        timestamp: now,
        read: false,
        link: `/tasks`,
      };

      const nextNotifications = [notif, ...state.notifications];

      saveToStorage(STORAGE_KEY, {
        workspace: state.workspace,
        projects: state.projects,
        tasks: nextTasks,
        members: state.members,
        notifications: nextNotifications,
      });

      return { tasks: nextTasks, notifications: nextNotifications };
    });

    useToastStore.getState().success('Comment added.');
  },

  deleteComment: (taskId, commentId) => {
    set((state) => {
      const nextTasks = state.tasks.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          comments: t.comments.filter((c) => c.id !== commentId),
          updatedAt: new Date().toISOString(),
        };
      });
      saveToStorage(STORAGE_KEY, {
        workspace: state.workspace,
        projects: state.projects,
        tasks: nextTasks,
        members: state.members,
        notifications: state.notifications,
      });
      return { tasks: nextTasks };
    });
    useToastStore.getState().info('Comment deleted.');
  },

  // Team Members
  createMember: (memberData) => {
    const id = 'mem-' + Date.now();
    const initials = memberData.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newMember: TeamMember = {
      ...memberData,
      id,
      initials,
    };

    set((state) => {
      const nextMembers = [...state.members, newMember];
      const notif: NotificationItem = {
        id: 'notif-' + Date.now(),
        type: 'new_member',
        title: 'New Team Member',
        message: `${newMember.name} joined the ${newMember.department} team`,
        timestamp: new Date().toISOString(),
        read: false,
        link: '/team',
      };
      const nextNotifications = [notif, ...state.notifications];

      saveToStorage(STORAGE_KEY, {
        workspace: state.workspace,
        projects: state.projects,
        tasks: state.tasks,
        members: nextMembers,
        notifications: nextNotifications,
      });

      return { members: nextMembers, notifications: nextNotifications };
    });

    useToastStore.getState().success(`Team member ${newMember.name} added.`);
    return newMember;
  },

  updateMember: (id, updates) => {
    set((state) => {
      const nextMembers = state.members.map((m) => {
        if (m.id !== id) return m;
        const updated = { ...m, ...updates };
        if (updates.name) {
          updated.initials = updates.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
        }
        return updated;
      });
      saveToStorage(STORAGE_KEY, {
        workspace: state.workspace,
        projects: state.projects,
        tasks: state.tasks,
        members: nextMembers,
        notifications: state.notifications,
      });
      return { members: nextMembers };
    });
    useToastStore.getState().info('Team member profile updated.');
  },

  deleteMember: (id) => {
    const member = get().members.find((m) => m.id === id);
    set((state) => {
      const nextMembers = state.members.filter((m) => m.id !== id);
      // Reassign or keep unassigned
      const nextTasks = state.tasks.map((t) =>
        t.assigneeId === id ? { ...t, assigneeId: '' } : t
      );
      saveToStorage(STORAGE_KEY, {
        workspace: state.workspace,
        projects: state.projects,
        tasks: nextTasks,
        members: nextMembers,
        notifications: state.notifications,
      });
      return { members: nextMembers, tasks: nextTasks };
    });
    useToastStore.getState().warning(`Team member ${member?.name || ''} removed.`);
  },

  // Notifications
  createNotification: (notifData) => {
    const newNotif: NotificationItem = {
      ...notifData,
      id: 'notif-' + Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    set((state) => {
      const nextNotifications = [newNotif, ...state.notifications];
      saveToStorage(STORAGE_KEY, {
        workspace: state.workspace,
        projects: state.projects,
        tasks: state.tasks,
        members: state.members,
        notifications: nextNotifications,
      });
      return { notifications: nextNotifications };
    });
  },

  markNotificationRead: (id) => {
    set((state) => {
      const nextNotifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      saveToStorage(STORAGE_KEY, {
        workspace: state.workspace,
        projects: state.projects,
        tasks: state.tasks,
        members: state.members,
        notifications: nextNotifications,
      });
      return { notifications: nextNotifications };
    });
  },

  markAllNotificationsRead: () => {
    set((state) => {
      const nextNotifications = state.notifications.map((n) => ({ ...n, read: true }));
      saveToStorage(STORAGE_KEY, {
        workspace: state.workspace,
        projects: state.projects,
        tasks: state.tasks,
        members: state.members,
        notifications: nextNotifications,
      });
      return { notifications: nextNotifications };
    });
    useToastStore.getState().info('All notifications marked as read.');
  },

  deleteNotification: (id) => {
    set((state) => {
      const nextNotifications = state.notifications.filter((n) => n.id !== id);
      saveToStorage(STORAGE_KEY, {
        workspace: state.workspace,
        projects: state.projects,
        tasks: state.tasks,
        members: state.members,
        notifications: nextNotifications,
      });
      return { notifications: nextNotifications };
    });
  },

  // Preferences & Data
  updatePreferences: (updates) => {
    set((state) => {
      const nextPreferences = { ...state.preferences, ...updates };
      saveToStorage(PREFS_STORAGE_KEY, nextPreferences);
      applyPreferencesToDOM(nextPreferences);
      return { preferences: nextPreferences };
    });
  },

  resetDemoData: () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PREFS_STORAGE_KEY);
    applyPreferencesToDOM(initialPreferences);
    set({
      workspace: {
        id: 'ws-1',
        name: 'Personal Workspace',
        plan: 'Enterprise Pro',
        owner: 'Alex Morgan',
      },
      projects: initialProjects,
      tasks: initialTasks,
      members: initialMembers,
      notifications: initialNotifications,
      preferences: initialPreferences,
    });
    useToastStore.getState().success('Workspace reset to original demo state.');
  },

  importWorkspaceData: (data: WorkspaceData) => {
    try {
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid JSON format: root object is required.');
      }
      if (!Array.isArray(data.projects)) {
        throw new Error('Invalid schema: "projects" must be an array.');
      }
      if (!Array.isArray(data.tasks)) {
        throw new Error('Invalid schema: "tasks" must be an array.');
      }

      // Check required fields for first item as a sanity test
      for (const p of data.projects) {
        if (!p || typeof p !== 'object' || !p.id || !p.name) {
          throw new Error(`Invalid project entry: missing required id or name.`);
        }
      }
      for (const t of data.tasks) {
        if (!t || typeof t !== 'object' || !t.id || !t.title || !t.projectId) {
          throw new Error(`Invalid task entry: missing required id, title, or projectId.`);
        }
      }

      const validProjects = sanitizeProjects(data.projects);
      const validTasks = sanitizeTasks(data.tasks);
      const validMembers = sanitizeMembers(data.members);
      const validNotifications = sanitizeNotifications(data.notifications);
      const validPreferences = data.preferences ? sanitizePreferences(data.preferences) : get().preferences;

      set({
        projects: validProjects,
        tasks: validTasks,
        members: validMembers,
        notifications: validNotifications,
        preferences: validPreferences,
      });

      saveToStorage(STORAGE_KEY, {
        workspace: get().workspace,
        projects: validProjects,
        tasks: validTasks,
        members: validMembers,
        notifications: validNotifications,
      });

      if (data.preferences) {
        saveToStorage(PREFS_STORAGE_KEY, validPreferences);
        applyPreferencesToDOM(validPreferences);
      }

      useToastStore.getState().success('Workspace state imported and validated successfully.');
      return true;
    } catch (err: any) {
      useToastStore.getState().error(err?.message || 'Failed to import workspace JSON.');
      return false;
    }
  },

  clearLocalData: () => {
    set({
      projects: [],
      tasks: [],
      notifications: [],
    });
    localStorage.removeItem(STORAGE_KEY);
    useToastStore.getState().warning('Local workspace data cleared.');
  },
}));
