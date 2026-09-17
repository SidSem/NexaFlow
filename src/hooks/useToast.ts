import { useToastStore } from '../store/toastStore';

export function useToast() {
  const store = useToastStore();

  return {
    toasts: store.toasts,
    toast: store.addToast,
    success: store.success,
    error: store.error,
    warning: store.warning,
    info: store.info,
    remove: store.removeToast,
    clearAll: store.clearAll,
  };
}
