import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar,
  BarChart3,
  Users,
  Component,
  Settings,
  Info,
  ChevronLeft,
  ChevronRight,
  Briefcase,
} from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { BrandLogo } from '../common/BrandLogo';
import { Tooltip } from '../ui/Tooltip';
import { Avatar } from '../ui/Avatar';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const { workspace, members, preferences, updatePreferences } = useWorkspaceStore();
  const isCollapsed = preferences.sidebarCollapsed;
  const currentUser = members[0];

  const toggleCollapse = () => {
    updatePreferences({ sidebarCollapsed: !isCollapsed });
  };

  const workspaceNav = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" /> },
    { to: '/tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { to: '/calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
    { to: '/analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { to: '/team', label: 'Team', icon: <Users className="w-4 h-4" /> },
  ];

  const systemNav = [
    { to: '/components', label: 'Components', icon: <Component className="w-4 h-4" /> },
    { to: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { to: '/about', label: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  const renderNavLink = (item: { to: string; label: string; icon: React.ReactNode }) => {
    const linkContent = (
      <NavLink
        to={item.to}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl transition-all duration-150 select-none group relative ${
            isActive
              ? 'bg-brand-600/10 text-brand-600 dark:text-brand-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          } ${isCollapsed ? 'justify-center px-2' : ''}`
        }
      >
        {({ isActive }) => (
          <>
            <span
              className={`transition-colors ${
                isActive
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
              }`}
            >
              {item.icon}
            </span>

            {!isCollapsed && <span className="truncate">{item.label}</span>}

            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-brand-600 dark:bg-brand-500 rounded-r-full" />
            )}
          </>
        )}
      </NavLink>
    );

    if (isCollapsed) {
      return (
        <Tooltip key={item.to} content={item.label} position="right">
          {linkContent}
        </Tooltip>
      );
    }

    return <div key={item.to}>{linkContent}</div>;
  };

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white dark:bg-slate-950/60 border-r border-slate-200/80 dark:border-slate-800/80 transition-all duration-300 ease-in-out h-screen sticky top-0 z-40 select-none ${
        isCollapsed ? 'w-16' : 'w-60'
      } ${className}`}
    >
      {/* Brand & Collapse Header */}
      <div className="h-14 flex items-center justify-between px-3.5 border-b border-slate-100 dark:border-slate-800/80">
        {!isCollapsed && <BrandLogo size="sm" />}
        {isCollapsed && (
          <div className="mx-auto">
            <BrandLogo size="sm" showText={false} />
          </div>
        )}

        <button
          type="button"
          onClick={toggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors ${
            isCollapsed ? 'hidden' : 'block'
          }`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Collapse button for collapsed mode */}
      {isCollapsed && (
        <div className="pt-2 px-2 flex justify-center">
          <Tooltip content="Expand sidebar" position="right">
            <button
              type="button"
              onClick={toggleCollapse}
              aria-label="Expand sidebar"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      )}

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-6">
        {/* Workspace Section */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Workspace
            </div>
          )}
          {workspaceNav.map(renderNavLink)}
        </div>

        {/* System Section */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              System
            </div>
          )}
          {systemNav.map(renderNavLink)}
        </div>
      </div>

      {/* Bottom Section: Workspace Selector & User */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
        {/* Workspace Card */}
        {!isCollapsed ? (
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate leading-tight">
                  {workspace.name}
                </p>
                <p className="text-[10px] text-slate-400 leading-tight truncate">
                  {workspace.plan}
                </p>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
          </div>
        ) : (
          <Tooltip content={`${workspace.name} (${workspace.plan})`} position="right">
            <div className="w-10 h-10 mx-auto rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-brand-600 dark:text-brand-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </Tooltip>
        )}

        {/* Current user */}
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <Avatar
              src={currentUser?.avatar}
              name={currentUser?.name}
              size="sm"
              status="online"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate leading-tight">
                {currentUser?.name}
              </p>
              <p className="text-[10px] text-slate-400 truncate leading-tight">
                {currentUser?.role}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
