import React, { useState, useRef } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Clock,
  MessageSquare,
  TrendingUp,
  UserPlus,
  Trash2,
  X,
} from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { NotificationItem, NotificationType } from '../../types';
import { useClickOutside } from '../../hooks/useClickOutside';
import { IconButton } from '../ui/IconButton';

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
  } = useWorkspaceStore();

  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'task_due':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'project_progress':
        return <TrendingUp className="w-4 h-4 text-brand-500" />;
      case 'new_member':
        return <UserPlus className="w-4 h-4 text-sky-500" />;
      case 'comment_added':
        return <MessageSquare className="w-4 h-4 text-violet-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  const formatTimestamp = (iso: string) => {
    try {
      return formatDistanceToNow(parseISO(iso), { addSuffix: true });
    } catch {
      return 'recently';
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <div className="relative">
        <IconButton
          icon={<Bell className="w-4 h-4" />}
          aria-label="Notifications"
          tooltip="Notifications"
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
        />
        {unreadCount > 0 && (
          <span className="absolute 0 top-0.5 right-0.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 pointer-events-none animate-pulse" />
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-50 focus:outline-none"
          >
            {/* Header */}
            <div className="p-3.5 px-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-mono font-medium">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => markAllNotificationsRead()}
                    className="text-[11px] text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 font-medium flex items-center gap-1 px-1.5 py-1 rounded transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400">
                  No notifications yet
                </div>
              ) : (
                notifications.map((notif: NotificationItem) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group ${
                      notif.read
                        ? 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 opacity-75 hover:opacity-100'
                        : 'bg-brand-50/40 dark:bg-brand-950/20 hover:bg-brand-50/70 dark:hover:bg-brand-950/30'
                    }`}
                  >
                    <div className="mt-0.5 p-1 rounded-md bg-white dark:bg-slate-800 shadow-xs border border-slate-100 dark:border-slate-800">
                      {getNotificationIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">
                          {formatTimestamp(notif.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                        {notif.message}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-all p-1"
                      title="Delete notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
