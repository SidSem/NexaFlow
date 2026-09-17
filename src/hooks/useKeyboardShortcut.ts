import { useEffect, useRef } from 'react';

interface ShortcutOptions {
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  ignoreInputs?: boolean;
}

export function useKeyboardShortcut(
  key: string,
  callback: (e: KeyboardEvent) => void,
  options: ShortcutOptions = { ignoreInputs: true }
) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const { ctrl = false, meta = false, shift = false, alt = false, ignoreInputs = true } = options;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if user is typing in an editable field
      if (ignoreInputs) {
        const target = event.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.isContentEditable ||
            target.getAttribute('role') === 'textbox' ||
            Boolean(target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"]')))
        ) {
          // If the shortcut requires ctrl or meta (like Ctrl+K), we can still allow it
          if (!ctrl && !meta) {
            return;
          }
        }
      }

      const matchKey = event.key.toLowerCase() === key.toLowerCase();
      const matchCtrl = ctrl ? event.ctrlKey || event.metaKey : true;
      const matchShift = shift ? event.shiftKey : !event.shiftKey;
      const matchAlt = alt ? event.altKey : !event.altKey;

      if (matchKey && matchCtrl && matchShift && matchAlt) {
        event.preventDefault();
        callbackRef.current(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, ctrl, meta, shift, alt, ignoreInputs]);
}
