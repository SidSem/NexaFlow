import React from 'react';
import { Modal } from '../ui/Modal';
import { Keyboard } from 'lucide-react';

export interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const shortcutGroups = [
    {
      group: 'General & Navigation',
      items: [
        { keys: ['Ctrl', 'K'], description: 'Open global command palette' },
        { keys: ['/'], description: 'Quick search workspace' },
        { keys: ['?'], description: 'Show keyboard shortcuts' },
        { keys: ['Esc'], description: 'Close modals, drawers and overlays' },
      ],
    },
    {
      group: 'Actions',
      items: [
        { keys: ['N'], description: 'Create new task modal' },
        { keys: ['P'], description: 'Create new project modal' },
        { keys: ['Enter'], description: 'Select item or submit form' },
      ],
    },
    {
      group: 'Command Palette',
      items: [
        { keys: ['↑', '↓'], description: 'Navigate commands' },
        { keys: ['Enter'], description: 'Execute command' },
        { keys: ['Esc'], description: 'Close palette' },
      ],
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={
        <div className="flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-brand-500" />
          <span>Keyboard Shortcuts</span>
        </div>
      }
      description="Navigate and manage NexaFlow at high speed with keyboard controls."
    >
      <div className="space-y-5">
        {shortcutGroups.map((group, idx) => (
          <div key={idx} className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {group.group}
            </h4>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              {group.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 px-3 text-xs">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {item.description}
                  </span>
                  <div className="flex items-center gap-1">
                    {item.keys.map((k, kIdx) => (
                      <kbd
                        key={kIdx}
                        className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono text-[11px] shadow-xs"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};
