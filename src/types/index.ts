export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type ProjectStatus = 'active' | 'completed' | 'archived' | 'on_hold';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadedAt: string;
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorRole?: string;
  text: string;
  createdAt: string;
}

export interface ActivityEvent {
  id: string;
  type:
    | 'task_created'
    | 'status_changed'
    | 'priority_changed'
    | 'assignee_changed'
    | 'comment_added'
    | 'subtask_completed'
    | 'attachment_added';
  description: string;
  timestamp: string;
  user: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  labels: string[];
  subtasks: Subtask[];
  attachments: Attachment[];
  comments: Comment[];
  activity: ActivityEvent[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  startDate: string;
  dueDate: string;
  color: string;
  icon: string;
  memberIds: string[];
  labels: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
  initials: string;
}

export type NotificationType =
  | 'task_completed'
  | 'task_due'
  | 'project_progress'
  | 'new_member'
  | 'task_reassigned'
  | 'comment_added';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  density: 'comfortable' | 'compact';
  sidebarCollapsed: boolean;
  reduceMotion: boolean;
  largerText: boolean;
  highContrast: boolean;
}

export interface WorkspaceData {
  version: string;
  exportedAt: string;
  projects: Project[];
  tasks: Task[];
  members: TeamMember[];
  notifications: NotificationItem[];
  preferences: UserPreferences;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

export interface TableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (row: T) => React.ReactNode;
}
