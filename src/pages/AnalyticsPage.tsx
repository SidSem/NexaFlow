import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { format, subDays, isAfter, parseISO } from 'date-fns';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useTheme } from '../hooks/useTheme';
import { Card, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const AnalyticsPage: React.FC = () => {
  const { isDark } = useTheme();
  const { tasks, projects, members } = useWorkspaceStore();

  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | '90d'>('30d');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<string>('all');

  // Filter tasks based on selected controls
  const filteredTasks = useMemo(() => {
    const now = new Date();
    const rangeDays = dateRange === 'today' ? 1 : dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    const cutoffDate = subDays(now, rangeDays);

    return tasks.filter((t) => {
      if (selectedProject !== 'all' && t.projectId !== selectedProject) return false;
      if (selectedMember !== 'all' && t.assigneeId !== selectedMember) return false;

      // Check date range using task created or updated
      try {
        const taskDate = parseISO(t.updatedAt || t.createdAt);
        return isAfter(taskDate, cutoffDate);
      } catch {
        return true;
      }
    });
  }, [tasks, dateRange, selectedProject, selectedMember]);

  // Key KPI stats
  const totalTasksCount = filteredTasks.length;
  const completedCount = filteredTasks.filter((t) => t.status === 'done').length;
  const completionRate = totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 100) : 0;
  const overdueCount = filteredTasks.filter((t) => {
    if (!t.dueDate || t.status === 'done') return false;
    return new Date(t.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));
  }).length;
  const activeProjectsCount = projects.filter((p) => p.status === 'active').length;

  // 1. Completion Over Time Data
  const completionOverTimeData = useMemo(() => {
    const daysCount = dateRange === '7d' ? 7 : 14;
    const points = [];
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const dayLabel = format(d, 'MMM d');
      const completedOnDay = filteredTasks.filter(
        (t) => t.status === 'done' && format(parseISO(t.updatedAt || t.createdAt), 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd')
      ).length;

      const createdOnDay = filteredTasks.filter((t) => {
        try {
          return format(parseISO(t.createdAt), 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd');
        } catch {
          return false;
        }
      }).length;

      points.push({
        date: dayLabel,
        completed: completedOnDay,
        created: createdOnDay,
      });
    }
    return points;
  }, [filteredTasks, dateRange]);

  // 2. Tasks by Status Data (Donut)
  const statusPieData = useMemo(() => {
    const statuses = [
      { key: 'backlog', name: 'Backlog', color: '#94a3b8' },
      { key: 'todo', name: 'To Do', color: '#38bdf8' },
      { key: 'in_progress', name: 'In Progress', color: '#6366f1' },
      { key: 'review', name: 'Review', color: '#fbbf24' },
      { key: 'done', name: 'Done', color: '#10b981' },
    ];

    return statuses.map((s) => ({
      name: s.name,
      value: filteredTasks.filter((t) => t.status === s.key).length,
      color: s.color,
    }));
  }, [filteredTasks]);

  // 3. Tasks by Priority Data (Bar)
  const priorityBarData = useMemo(() => {
    const priorities = [
      { key: 'low', name: 'Low', color: '#64748b' },
      { key: 'medium', name: 'Medium', color: '#3b82f6' },
      { key: 'high', name: 'High', color: '#f59e0b' },
      { key: 'urgent', name: 'Urgent', color: '#ef4444' },
    ];

    return priorities.map((p) => ({
      priority: p.name,
      tasks: filteredTasks.filter((t) => t.priority === p.key).length,
      fill: p.color,
    }));
  }, [filteredTasks]);

  // 4. Project Progress Data (Horizontal Bar)
  const projectProgressData = useMemo(() => {
    return projects.map((p) => {
      const projTasks = tasks.filter((t) => t.projectId === p.id);
      const total = projTasks.length;
      const done = projTasks.filter((t) => t.status === 'done').length;
      const progress = total > 0 ? Math.round((done / total) * 100) : 0;

      return {
        name: p.name.length > 15 ? p.name.substring(0, 14) + '...' : p.name,
        progress,
        tasks: total,
      };
    });
  }, [projects, tasks]);

  // 5. Team Workload Data (Assigned vs Completed)
  const teamWorkloadData = useMemo(() => {
    return members.map((m) => {
      const assigned = tasks.filter((t) => t.assigneeId === m.id).length;
      const completed = tasks.filter((t) => t.assigneeId === m.id && t.status === 'done').length;

      return {
        name: m.name.split(' ')[0],
        assigned,
        completed,
      };
    });
  }, [members, tasks]);

  // 6. Task Distribution across Projects
  const taskDistributionData = useMemo(() => {
    return projects.map((p) => ({
      name: p.name.split(' ')[0],
      count: tasks.filter((t) => t.projectId === p.id).length,
    }));
  }, [projects, tasks]);

  const tooltipStyle = {
    backgroundColor: isDark ? '#0f172a' : '#ffffff',
    borderColor: isDark ? '#1e293b' : '#e2e8f0',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
    fontSize: '11px',
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Workspace Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time delivery telemetry, throughput analysis, and workload distribution.
          </p>
        </div>

        {/* Global Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range Selector */}
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5 text-xs">
            {(['today', '7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setDateRange(r)}
                className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                  dateRange === r
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {r === 'today' ? 'Today' : r.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Project Filter */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none max-w-[150px]"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Member Filter */}
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none max-w-[150px]"
          >
            <option value="all">All Members</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 5 Top Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <Card className="p-4">
          <span className="text-[11px] font-medium text-slate-500">Filtered Tasks</span>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {totalTasksCount}
          </div>
          <span className="text-[10px] text-slate-400">In selected window</span>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] font-medium text-slate-500">Completed</span>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {completedCount}
          </div>
          <span className="text-[10px] text-emerald-500 font-medium">Verified deliverables</span>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] font-medium text-slate-500">Completion Rate</span>
          <div className="text-xl font-bold text-brand-600 dark:text-brand-400 mt-1">
            {completionRate}%
          </div>
          <span className="text-[10px] text-slate-400">Throughput velocity</span>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] font-medium text-slate-500">Overdue</span>
          <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            {overdueCount}
          </div>
          <span className="text-[10px] text-rose-400">Past target due</span>
        </Card>

        <Card className="p-4 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-medium text-slate-500">Active Projects</span>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {activeProjectsCount}
          </div>
          <span className="text-[10px] text-slate-400">Tracked initiatives</span>
        </Card>
      </div>

      {/* 6 Recharts Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Task Completion Over Time (Area Chart) */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>1. Task Velocity Over Time</CardTitle>
              <CardDescription>Daily tasks finished across active sprints</CardDescription>
            </div>
            <Badge variant="brand" size="sm">Velocity</Badge>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={completionOverTimeData}>
                <defs>
                  <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="date" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} tickLine={false} />
                <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="completed" name="Completed" stroke="#6366f1" strokeWidth={2} fill="url(#areaColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Tasks by Status (Donut/Pie Chart) */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>2. Tasks by Status</CardTitle>
              <CardDescription>Workflow column breakdown</CardDescription>
            </div>
            <Badge variant="neutral" size="sm">Pipeline</Badge>
          </div>
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 3: Tasks by Priority (Bar Chart) */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>3. Tasks by Priority</CardTitle>
              <CardDescription>Risk and urgency distribution</CardDescription>
            </div>
            <Badge variant="warning" size="sm">Priorities</Badge>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="priority" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
                <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="tasks" name="Tasks Count" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 4: Project Progress Comparison (Horizontal Bar Chart) */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>4. Project Milestone Progress</CardTitle>
              <CardDescription>Percentage completed by initiative</CardDescription>
            </div>
            <Badge variant="info" size="sm">Completion %</Badge>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectProgressData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                <XAxis type="number" domain={[0, 100]} stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} />
                <YAxis dataKey="name" type="category" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} width={80} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="progress" name="Progress %" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 5: Team Workload (Composed Bar) */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>5. Team Workload & Throughput</CardTitle>
              <CardDescription>Assigned tasks vs completed by member</CardDescription>
            </div>
            <Badge variant="brand" size="sm">Members</Badge>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamWorkloadData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="name" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
                <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey="assigned" name="Assigned" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 6: Task Distribution (Bar Chart) */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>6. Task Distribution by Project</CardTitle>
              <CardDescription>Task allocation footprint</CardDescription>
            </div>
            <Badge variant="neutral" size="sm">Distribution</Badge>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="name" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
                <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" name="Total Tasks" fill="#ec4899" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
