import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

export type DrawerPosition = 'right' | 'left' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  position?: DrawerPosition;
  size?: DrawerSize;
  closeOnOverlayClick?: boolean;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  position = 'right',
  size = 'md',
  closeOnOverlayClick = true,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  const sizeStylesHorizontal = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
    full: 'max-w-full',
  };

  const getMotionVariants = () => {
    switch (position) {
      case 'left':
        return {
          initial: { x: '-100%', opacity: 0.5 },
          animate: { x: 0, opacity: 1 },
          exit: { x: '-100%', opacity: 0.5 },
        };
      case 'bottom':
        return {
          initial: { y: '100%', opacity: 0.5 },
          animate: { y: 0, opacity: 1 },
          exit: { y: '100%', opacity: 0.5 },
        };
      case 'right':
      default:
        return {
          initial: { x: '100%', opacity: 0.5 },
          animate: { x: 0, opacity: 1 },
          exit: { x: '100%', opacity: 0.5 },
        };
    }
  };

  const positionClasses = {
    right: `right-0 top-0 bottom-0 w-full ${sizeStylesHorizontal[size]} border-l`,
    left: `left-0 top-0 bottom-0 w-full ${sizeStylesHorizontal[size]} border-r`,
    bottom: 'bottom-0 left-0 right-0 w-full max-h-[85vh] rounded-t-2xl border-t',
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => closeOnOverlayClick && onClose()}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            {...getMotionVariants()}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            className={`fixed ${positionClasses[position]} z-50 flex flex-col bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden`}
          >
            {/* Header */}
            {(title || description) && (
              <div className="flex items-start justify-between p-5 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                <div className="space-y-1 pr-6">
                  {title && (
                    <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {description}
                    </p>
                  )}
                </div>
                <IconButton
                  icon={<X className="w-4 h-4" />}
                  aria-label="Close drawer"
                  size="sm"
                  variant="ghost"
                  onClick={onClose}
                />
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-5">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex-shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
