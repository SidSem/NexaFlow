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
  Briefcase,
} from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { BrandLogo } from '../common/BrandLogo';
import { Drawer } from '../ui/Drawer';
import { Avatar } from '../ui/Avatar';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ isOpen, onClose }) => {
  const { workspace, members } = useWorkspaceStore();
  const currentUser = members[0];

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" /> },
    { to: '/tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { to: '/calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
    { to: '/analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { to: '/team', label: 'Team', icon: <Users className="w-4 h-4" /> },
    { to: '/components', label: 'Components', icon: <Component className="w-4 h-4" /> },
    { to: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { to: '/about', label: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="left"
      size="sm"
      title={<BrandLogo size="sm" />}
    >
      <div className="flex flex-col h-full justify-between -m-5 p-5">
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                  isActive
                    ? 'bg-brand-600/10 text-brand-600 dark:text-brand-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Bottom Profile Info */}
        <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-500" />
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {workspace.name}
                </p>
                <p className="text-[10px] text-slate-400">{workspace.plan}</p>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>

          <div className="flex items-center gap-3 px-1">
            <Avatar src={currentUser?.avatar} name={currentUser?.name} size="sm" status="online" />
            <div className="truncate">
              <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                {currentUser?.name}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{currentUser?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
