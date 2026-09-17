import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Moon,
  Sun,
  Laptop,
  Menu,
  RotateCcw,
  Keyboard,
  Settings,
  User,
  Sliders,
} from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useTheme } from '../../hooks/useTheme';
import { Breadcrumb } from '../ui/Breadcrumb';
import { IconButton } from '../ui/IconButton';
import { Avatar } from '../ui/Avatar';
import { Dropdown } from '../ui/Dropdown';
import { NotificationCenter } from './NotificationCenter';

interface NavbarProps {
  onOpenMobileNav: () => void;
  onOpenCommandPalette: () => void;
  onOpenShortcuts: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileNav,
  onOpenCommandPalette,
  onOpenShortcuts,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { members, resetDemoData } = useWorkspaceStore();
  const currentUser = members[0];

  // Route title mapping
  const routeTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/projects': 'Projects Explorer',
    '/tasks': 'Task Management',
    '/calendar': 'Calendar Workspace',
    '/analytics': 'Analytics & Velocity',
    '/team': 'Team Members',
    '/components': 'Component Showcase',
    '/settings': 'Settings',
    '/about': 'About NexaFlow',
  };

  const pathname = location.pathname;
  let pageTitle = routeTitles[pathname] || 'Workspace';
  if (pathname.startsWith('/projects/')) {
    pageTitle = 'Project Workspace';
  }

  // Generate breadcrumb items
  const breadcrumbItems = [{ label: pageTitle }];

  const themeDropdownItems = [
    {
      key: 'dark',
      label: 'Dark Mode',
      icon: <Moon className="w-3.5 h-3.5" />,
      onClick: () => setTheme('dark'),
    },
    {
      key: 'light',
      label: 'Light Mode',
      icon: <Sun className="w-3.5 h-3.5" />,
      onClick: () => setTheme('light'),
    },
    {
      key: 'system',
      label: 'System Preference',
      icon: <Laptop className="w-3.5 h-3.5" />,
      onClick: () => setTheme('system'),
    },
  ];

  const userDropdownItems = [
    {
      key: 'profile',
      label: (
        <div className="flex flex-col">
          <span className="font-semibold">{currentUser?.name || 'Alex Morgan'}</span>
          <span className="text-[10px] text-slate-400 font-normal">{currentUser?.email}</span>
        </div>
      ),
      icon: <User className="w-3.5 h-3.5" />,
      onClick: () => navigate('/settings'),
    },
    {
      key: 'prefs',
      label: 'Preferences',
      icon: <Sliders className="w-3.5 h-3.5" />,
      onClick: () => navigate('/settings'),
    },
    {
      key: 'shortcuts',
      label: 'Keyboard Shortcuts',
      icon: <Keyboard className="w-3.5 h-3.5" />,
      shortcut: '?',
      onClick: onOpenShortcuts,
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <Settings className="w-3.5 h-3.5" />,
      onClick: () => navigate('/settings'),
    },
    {
      key: 'reset',
      label: 'Reset Demo Data',
      icon: <RotateCcw className="w-3.5 h-3.5" />,
      danger: true,
      dividerBefore: true,
      onClick: () => resetDemoData(),
    },
  ];

  return (
    <header className="sticky top-0 z-30 h-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 transition-colors">
      {/* Left side: Hamburger (mobile) + Breadcrumbs / Title */}
      <div className="flex items-center gap-3">
        <div className="lg:hidden">
          <IconButton
            icon={<Menu className="w-5 h-5" />}
            aria-label="Open Navigation"
            variant="ghost"
            size="sm"
            onClick={onOpenMobileNav}
          />
        </div>

        <div className="hidden sm:block">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <div className="sm:hidden text-xs font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[140px]">
          {pageTitle}
        </div>
      </div>

      {/* Right side: Global Search + Notifications + Theme + User */}
      <div className="flex items-center gap-2">
        {/* Global Search trigger */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 text-xs transition-colors cursor-pointer select-none"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline-block">Search or command...</span>
          <span className="md:hidden">Search</span>
          <kbd className="hidden sm:inline-block text-[10px] font-mono px-1 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-700">
            ⌘K
          </kbd>
        </button>

        {/* Notification Center */}
        <NotificationCenter />

        {/* Theme Switcher */}
        <Dropdown
          align="right"
          trigger={
            <IconButton
              icon={
                theme === 'dark' ? (
                  <Moon className="w-4 h-4" />
                ) : theme === 'light' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Laptop className="w-4 h-4" />
                )
              }
              aria-label="Toggle Theme"
              tooltip="Theme"
              variant="ghost"
              size="sm"
            />
          }
          items={themeDropdownItems}
        />

        {/* User Menu */}
        <Dropdown
          align="right"
          trigger={
            <button
              type="button"
              aria-label="User account menu"
              className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 cursor-pointer"
            >
              <Avatar
                src={currentUser?.avatar}
                name={currentUser?.name || 'Alex Morgan'}
                size="sm"
                status="online"
              />
            </button>
          }
          items={userDropdownItems}
        />
      </div>
    </header>
  );
};
