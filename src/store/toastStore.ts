import { create } from 'zustand';
import { ToastItem, ToastType } from '../types';

interface ToastStore {
  toasts: ToastItem[];
  addToast: (toast: { type: ToastType; message: string; title?: string; duration?: number }) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
  success: (message: string, title?: string) => string;
  error: (message: string, title?: string) => string;
  warning: (message: string, title?: string) => string;
  info: (message: string, title?: string) => string;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  addToast: ({ type, message, title, duration = 4000 }) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const newToast: ToastItem = { id, type, message, title, duration };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }

    return id;
  },
  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
  clearAll: () => {
    set({ toasts: [] });
  },
  success: (message: string, title?: string) => {
    return get().addToast({ type: 'success', message, title });
  },
  error: (message: string, title?: string) => {
    return get().addToast({ type: 'error', message, title });
  },
  warning: (message: string, title?: string) => {
    return get().addToast({ type: 'warning', message, title });
  },
  info: (message: string, title?: string) => {
    return get().addToast({ type: 'info', message, title });
  },
}));
