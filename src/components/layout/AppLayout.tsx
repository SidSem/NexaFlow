import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileNavDrawer } from './MobileNavDrawer';
import { CommandPalette } from '../command/CommandPalette';
import { KeyboardShortcutsModal } from '../common/KeyboardShortcutsModal';
import { CreateTaskModal } from '../tasks/CreateTaskModal';
import { CreateProjectModal } from '../projects/CreateProjectModal';
import { ToastContainer } from '../ui/Toast';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';

export const AppLayout: React.FC = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false);

  // Global Keyboard Shortcuts
  // Ctrl + K -> Command Palette
  useKeyboardShortcut('k', () => setCommandPaletteOpen(true), { ctrl: true, ignoreInputs: false });
  // / -> Command Palette (ignore when typing in inputs)
  useKeyboardShortcut('/', () => setCommandPaletteOpen(true), { ignoreInputs: true });
  // N -> New Task
  useKeyboardShortcut('n', () => setCreateTaskModalOpen(true), { ignoreInputs: true });
  // P -> New Project
  useKeyboardShortcut('p', () => setCreateProjectModalOpen(true), { ignoreInputs: true });
  // ? -> Shortcuts Modal
  useKeyboardShortcut('?', () => setShortcutsModalOpen(true), { shift: true, ignoreInputs: true });

  return (
    <div className="flex min-h-screen bg-surface-light dark:bg-surface-dark text-slate-900 dark:text-slate-100 font-sans antialiased">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onOpenShortcuts={() => setShortcutsModalOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenCreateTask={() => setCreateTaskModalOpen(true)}
        onOpenCreateProject={() => setCreateProjectModalOpen(true)}
      />

      {/* Global Keyboard Shortcuts Cheat Sheet */}
      <KeyboardShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />

      {/* Global Quick Create Modals */}
      <CreateTaskModal
        isOpen={createTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
      />

      <CreateProjectModal
        isOpen={createProjectModalOpen}
        onClose={() => setCreateProjectModalOpen(false)}
      />

      {/* Global Toast Notifications Stack */}
      <ToastContainer />
    </div>
  );
};
