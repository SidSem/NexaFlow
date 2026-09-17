import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpanded?: string[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultExpanded = [],
  className = '',
}) => {
  const [expandedIds, setExpandedIds] = useState<string[]>(defaultExpanded);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setExpandedIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setExpandedIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800 ${className}`}>
      {items.map((item) => {
        const isExpanded = expandedIds.includes(item.id);

        return (
          <div key={item.id} className="overflow-hidden">
            <button
              type="button"
              disabled={item.disabled}
              onClick={() => toggleItem(item.id)}
              aria-expanded={isExpanded}
              className={`w-full py-4 px-1 flex items-center justify-between text-left transition-colors select-none focus:outline-none ${
                item.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:text-brand-600 dark:hover:text-brand-400'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon && (
                  <span className="text-slate-400 dark:text-slate-500">{item.icon}</span>
                )}
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {item.title}
                </span>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180 text-brand-500' : ''
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="pb-4 pt-1 px-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
