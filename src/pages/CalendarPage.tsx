import React, { useState, useMemo } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  subDays,
  parseISO,
} from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { useWorkspaceStore } from '../store/workspaceStore';
import { Priority } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CreateTaskModal } from '../components/tasks/CreateTaskModal';
import { TaskDetailsDrawer } from '../components/tasks/TaskDetailsDrawer';

export const CalendarPage: React.FC = () => {
  const { tasks } = useWorkspaceStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'agenda'>('month');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedDateForNewTask, setSelectedDateForNewTask] = useState<string>('');
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const prevPeriod = () => {
    if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(subDays(currentDate, 7));
    else setCurrentDate(subMonths(currentDate, 1));
  };

  const nextPeriod = () => {
    if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(addDays(currentDate, 7));
    else setCurrentDate(addMonths(currentDate, 1));
  };

  const goToToday = () => setCurrentDate(new Date());

  const handleCellClick = (d: Date) => {
    setSelectedDateForNewTask(format(d, 'yyyy-MM-dd'));
    setCreateModalOpen(true);
  };

  const monthStart = startOfMonth(currentDate);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const days: Date[] = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentDate]);

  // Week days generation
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [currentDate]);

  // Agenda tasks (sorted by due date)
  const agendaTasks = useMemo(() => {
    return [...tasks]
      .filter((t) => !!t.dueDate)
      .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
  }, [tasks]);

  const priorityColors: Record<Priority, string> = {
    low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    medium: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-300 dark:border-sky-800',
    high: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    urgent: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-300 dark:border-rose-800',
  };

  const weekDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6 text-left">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Calendar Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualize deadlines, track milestone sprints, and schedule project activities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
          >
            Today
          </Button>
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={prevPeriod}
              aria-label="Previous period"
              title="Previous period"
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-l-lg transition-colors text-slate-500"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextPeriod}
              aria-label="Next period"
              title="Next period"
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-r-lg transition-colors text-slate-500"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setSelectedDateForNewTask(format(new Date(), 'yyyy-MM-dd'));
              setCreateModalOpen(true);
            }}
          >
            New Task
          </Button>
        </div>
      </div>

      {/* Controls & View Switcher */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-brand-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            {format(currentDate, viewMode === 'month' ? 'MMMM yyyy' : 'MMMM d, yyyy')}
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMode('month')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              viewMode === 'month'
                ? 'bg-brand-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Month
          </button>
          <button
            type="button"
            onClick={() => setViewMode('week')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              viewMode === 'week'
                ? 'bg-brand-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Week
          </button>
          <button
            type="button"
            onClick={() => setViewMode('agenda')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              viewMode === 'agenda'
                ? 'bg-brand-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Agenda
          </button>
        </div>
      </div>

      {/* MONTH VIEW */}
      {viewMode === 'month' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-center py-2 text-xs font-semibold text-slate-500">
            {weekDayNames.map((d, i) => (
              <div key={i}>{d}</div>
            ))}
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800/80">
            {calendarDays.map((d, idx) => {
              const dateStr = format(d, 'yyyy-MM-dd');
              const isCurrentMonth = isSameMonth(d, monthStart);
              const isToday = isSameDay(d, new Date());
              const dayTasks = tasks.filter((t) => t.dueDate === dateStr);

              return (
                <div
                  key={idx}
                  onClick={() => handleCellClick(d)}
                  className={`min-h-[110px] p-2 transition-colors cursor-pointer flex flex-col justify-between group ${
                    isCurrentMonth
                      ? 'bg-white dark:bg-slate-900 hover:bg-slate-50/70 dark:hover:bg-slate-800/30'
                      : 'bg-slate-50/50 dark:bg-slate-950/40 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {format(d, 'd')}
                    </span>

                    <span className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-brand-500 transition-opacity">
                      <Plus className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Tasks on this day */}
                  <div className="space-y-1 my-1 overflow-y-auto max-h-20">
                    {dayTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTaskId(t.id);
                        }}
                        className={`text-[10px] px-1.5 py-0.5 rounded border font-medium truncate ${
                          priorityColors[t.priority]
                        } ${t.status === 'done' ? 'line-through opacity-60' : ''}`}
                        title={t.title}
                      >
                        {t.title}
                      </div>
                    ))}
                  </div>

                  <div className="text-[10px] text-slate-400 font-mono">
                    {dayTasks.length > 0 && `${dayTasks.length} tasks`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {viewMode === 'week' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
          <div className="grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800/80 min-h-[450px]">
            {weekDays.map((d, i) => {
              const dateStr = format(d, 'yyyy-MM-dd');
              const isToday = isSameDay(d, new Date());
              const dayTasks = tasks.filter((t) => t.dueDate === dateStr);

              return (
                <div
                  key={i}
                  className="flex flex-col p-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                >
                  <div className="text-center pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase block">
                      {format(d, 'EEE')}
                    </span>
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold mt-1 ${
                        isToday
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {format(d, 'd')}
                    </span>
                  </div>

                  <div className="flex-1 space-y-2 overflow-y-auto">
                    {dayTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setActiveTaskId(t.id)}
                        className={`p-2 rounded-lg border text-xs cursor-pointer hover:shadow-xs transition-shadow ${
                          priorityColors[t.priority]
                        }`}
                      >
                        <p className="font-semibold line-clamp-2">{t.title}</p>
                        <span className="text-[10px] opacity-75 mt-1 block capitalize">
                          {t.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCellClick(d)}
                    className="mt-2 text-center text-xs text-brand-600 dark:text-brand-400 hover:underline py-1"
                  >
                    + Add Task
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AGENDA VIEW */}
      {viewMode === 'agenda' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs divide-y divide-slate-100 dark:divide-slate-800">
          {agendaTasks.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              No upcoming scheduled tasks with due dates.
            </div>
          ) : (
            agendaTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => setActiveTaskId(t.id)}
                className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="text-center w-14 flex-shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      {format(parseISO(t.dueDate), 'MMM')}
                    </span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      {format(parseISO(t.dueDate), 'd')}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {t.title}
                    </h4>
                    <p className="text-slate-400 text-[11px] truncate">{t.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <Badge variant={t.status === 'done' ? 'success' : 'neutral'} size="sm">
                    {t.status.replace('_', ' ')}
                  </Badge>
                  <span className={`text-[11px] px-2 py-0.5 rounded border font-medium ${priorityColors[t.priority]}`}>
                    {t.priority}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modals & Drawers */}
      <CreateTaskModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        defaultDueDate={selectedDateForNewTask}
      />

      <TaskDetailsDrawer
        taskId={activeTaskId}
        isOpen={!!activeTaskId}
        onClose={() => setActiveTaskId(null)}
      />
    </div>
  );
};
