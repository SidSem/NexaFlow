import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar,
  BarChart3,
  Users,
  Settings,
  Plus,
  SunMoon,
  Component,
  Info,
  ArrowRight,
} from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useTheme } from '../../hooks/useTheme';

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Actions' | 'Projects' | 'Tasks' | 'Settings';
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateTask?: () => void;
  onOpenCreateProject?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenCreateTask,
  onOpenCreateProject,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { projects, tasks } = useWorkspaceStore();
  const { toggleTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setQuery('');
    setSelectedIndex(0);
    onClose();
  };

  const allCommands = useMemo<CommandItem[]>(() => {
    const staticCommands: CommandItem[] = [
      // Navigation
      {
        id: 'nav-dash',
        title: 'Go to Dashboard',
        category: 'Navigation',
        icon: <LayoutDashboard className="w-4 h-4" />,
        action: () => {
          navigate('/dashboard');
          onClose();
        },
      },
      {
        id: 'nav-proj',
        title: 'Go to Projects',
        category: 'Navigation',
        icon: <FolderKanban className="w-4 h-4" />,
        action: () => {
          navigate('/projects');
          onClose();
        },
      },
      {
        id: 'nav-task',
        title: 'Go to Tasks',
        category: 'Navigation',
        icon: <CheckSquare className="w-4 h-4" />,
        action: () => {
          navigate('/tasks');
          onClose();
        },
      },
      {
        id: 'nav-cal',
        title: 'Go to Calendar',
        category: 'Navigation',
        icon: <Calendar className="w-4 h-4" />,
        action: () => {
          navigate('/calendar');
          onClose();
        },
      },
      {
        id: 'nav-ana',
        title: 'Go to Analytics',
        category: 'Navigation',
        icon: <BarChart3 className="w-4 h-4" />,
        action: () => {
          navigate('/analytics');
          onClose();
        },
      },
      {
        id: 'nav-team',
        title: 'Go to Team',
        category: 'Navigation',
        icon: <Users className="w-4 h-4" />,
        action: () => {
          navigate('/team');
          onClose();
        },
      },
      {
        id: 'nav-comp',
        title: 'Go to Component Showcase',
        category: 'Navigation',
        icon: <Component className="w-4 h-4" />,
        action: () => {
          navigate('/components');
          onClose();
        },
      },
      {
        id: 'nav-about',
        title: 'Go to About NexaFlow',
        category: 'Navigation',
        icon: <Info className="w-4 h-4" />,
        action: () => {
          navigate('/about');
          onClose();
        },
      },

      // Actions
      {
        id: 'act-new-task',
        title: 'Create Task',
        category: 'Actions',
        icon: <Plus className="w-4 h-4" />,
        shortcut: 'N',
        action: () => {
          onClose();
          if (onOpenCreateTask) onOpenCreateTask();
        },
      },
      {
        id: 'act-new-proj',
        title: 'Create Project',
        category: 'Actions',
        icon: <Plus className="w-4 h-4" />,
        shortcut: 'P',
        action: () => {
          onClose();
          if (onOpenCreateProject) onOpenCreateProject();
        },
      },
      {
        id: 'act-theme',
        title: 'Toggle Dark / Light Theme',
        category: 'Actions',
        icon: <SunMoon className="w-4 h-4" />,
        action: () => {
          toggleTheme();
          onClose();
        },
      },

      // Settings
      {
        id: 'nav-settings',
        title: 'Open Settings',
        category: 'Settings',
        icon: <Settings className="w-4 h-4" />,
        action: () => {
          navigate('/settings');
          onClose();
        },
      },
    ];

    // Dynamic project commands
    const projectCommands: CommandItem[] = projects.slice(0, 6).map((p) => ({
      id: `proj-${p.id}`,
      title: `Project: ${p.name}`,
      category: 'Projects',
      icon: <FolderKanban className="w-4 h-4 text-brand-500" />,
      action: () => {
        navigate(`/projects/${p.id}`);
        onClose();
      },
    }));

    // Dynamic task commands
    const taskCommands: CommandItem[] = tasks.slice(0, 6).map((t) => ({
      id: `task-${t.id}`,
      title: `Task: ${t.title}`,
      category: 'Tasks',
      icon: <CheckSquare className="w-4 h-4 text-emerald-500" />,
      action: () => {
        navigate(`/tasks?taskId=${t.id}`);
        onClose();
      },
    }));

    return [...staticCommands, ...projectCommands, ...taskCommands];
  }, [projects, tasks, navigate, onClose, onOpenCreateTask, onOpenCreateProject, toggleTheme]);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return allCommands;
    const q = query.toLowerCase();
    return allCommands.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(q) || cmd.category.toLowerCase().includes(q)
    );
  }, [allCommands, query]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeElement = listRef.current.querySelector('[aria-selected="true"]');
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  // Group commands
  const categories = Array.from(new Set(filteredCommands.map((c) => c.category)));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10"
        >
          {/* Search Header */}
          <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
            <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 mr-3 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Type a command, project, or task name..."
              className="w-full py-4 text-sm bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            />
            <kbd className="hidden sm:inline-block text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>
          </div>

          {/* Commands List */}
          <div ref={listRef} className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/40">
            {filteredCommands.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-500">
                No matching commands found for "{query}"
              </div>
            ) : (
              categories.map((category) => {
                const categoryCommands = filteredCommands.filter(
                  (c) => c.category === category
                );

                return (
                  <div key={category} className="py-1">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1.5">
                      {category}
                    </div>

                    <div className="space-y-0.5">
                      {categoryCommands.map((cmd) => {
                        const globalIndex = filteredCommands.indexOf(cmd);
                        const isSelected = globalIndex === selectedIndex;

                        return (
                          <button
                            key={cmd.id}
                            type="button"
                            aria-selected={isSelected}
                            onClick={cmd.action}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors select-none text-left ${
                              isSelected
                                ? 'bg-brand-600 text-white font-medium shadow-xs'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            <div className="flex items-center gap-3 truncate">
                              <span
                                className={`w-4 h-4 flex items-center justify-center ${
                                  isSelected ? 'text-white' : 'text-slate-400'
                                }`}
                              >
                                {cmd.icon}
                              </span>
                              <span className="truncate">{cmd.title}</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {cmd.shortcut && (
                                <kbd
                                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                    isSelected
                                      ? 'bg-brand-700 text-white border border-brand-500'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                                  }`}
                                >
                                  {cmd.shortcut}
                                </kbd>
                              )}
                              {isSelected && <ArrowRight className="w-3.5 h-3.5 opacity-80" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Palette Footer */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <span>
                <kbd className="font-mono bg-white dark:bg-slate-800 px-1 rounded border border-slate-200 dark:border-slate-700">
                  ↑
                </kbd>{' '}
                <kbd className="font-mono bg-white dark:bg-slate-800 px-1 rounded border border-slate-200 dark:border-slate-700">
                  ↓
                </kbd>{' '}
                to navigate
              </span>
              <span>
                <kbd className="font-mono bg-white dark:bg-slate-800 px-1 rounded border border-slate-200 dark:border-slate-700">
                  ↵
                </kbd>{' '}
                to select
              </span>
            </div>
            <span>NexaFlow Quick Actions</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
