import React from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Activity, Clock, CheckCircle, ArrowRight, User, MessageSquare } from 'lucide-react';
import { ActivityEvent } from '../../types';

interface TaskActivityLogProps {
  activity: ActivityEvent[];
}

export const TaskActivityLog: React.FC<TaskActivityLogProps> = ({ activity }) => {
  const getIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'task_created':
        return <Activity className="w-3.5 h-3.5 text-brand-500" />;
      case 'status_changed':
        return <ArrowRight className="w-3.5 h-3.5 text-sky-500" />;
      case 'subtask_completed':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
      case 'assignee_changed':
        return <User className="w-3.5 h-3.5 text-indigo-500" />;
      case 'comment_added':
        return <MessageSquare className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const formatEventDate = (iso: string) => {
    try {
      return formatDistanceToNow(parseISO(iso), { addSuffix: true });
    } catch {
      return 'recently';
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <Activity className="w-3.5 h-3.5 text-brand-500" />
        <span>Activity History</span>
      </h4>

      <div className="relative pl-5 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-slate-200 dark:before:bg-slate-800">
        {activity.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No activity recorded yet.</p>
        ) : (
          activity.map((event) => (
            <div key={event.id} className="relative text-xs group">
              <span className="absolute -left-5 top-0.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                {getIcon(event.type)}
              </span>

              <div className="pl-1">
                <p className="text-slate-800 dark:text-slate-200 leading-snug">
                  {event.description}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {event.user} • {formatEventDate(event.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
