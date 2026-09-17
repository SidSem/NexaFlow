import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { ToastItem, ToastType } from '../../types';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  const iconMap: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    error: <AlertCircle className="w-4 h-4 text-rose-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    info: <Info className="w-4 h-4 text-sky-500" />,
  };

  const borderColors: Record<ToastType, string> = {
    success: 'border-emerald-500/30 dark:border-emerald-500/20',
    error: 'border-rose-500/30 dark:border-rose-500/20',
    warning: 'border-amber-500/30 dark:border-amber-500/20',
    info: 'border-sky-500/30 dark:border-sky-500/20',
  };

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast: ToastItem) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto rounded-xl bg-white dark:bg-slate-900 border p-3.5 shadow-xl text-slate-800 dark:text-slate-100 flex items-start gap-3 backdrop-blur-md ${
              borderColors[toast.type]
            }`}
          >
            <div className="mt-0.5 flex-shrink-0">{iconMap[toast.type]}</div>

            <div className="flex-1 text-xs pr-2">
              {toast.title && <p className="font-semibold mb-0.5">{toast.title}</p>}
              <p className="text-slate-600 dark:text-slate-300 leading-snug">{toast.message}</p>
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
