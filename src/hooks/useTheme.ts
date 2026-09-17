import { useWorkspaceStore } from '../store/workspaceStore';

export function useTheme() {
  const preferences = useWorkspaceStore((state) => state.preferences);
  const updatePreferences = useWorkspaceStore((state) => state.updatePreferences);

  const isDark =
    preferences.theme === 'dark' ||
    (preferences.theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const setTheme = (theme: 'dark' | 'light' | 'system') => {
    updatePreferences({ theme });
  };

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return {
    theme: preferences.theme,
    isDark,
    setTheme,
    toggleTheme,
  };
}
