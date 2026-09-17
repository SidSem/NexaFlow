import React, { forwardRef } from 'react';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, description, checked = false, onChange, className = '', id, disabled, ...props }, ref) => {
    const switchId = id || (typeof label === 'string' ? `switch-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <label
        htmlFor={switchId}
        className={`flex items-center justify-between gap-3 cursor-pointer select-none ${
          disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
        } ${className}`}
      >
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-tight">
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {description}
              </span>
            )}
          </div>
        )}

        <div className="relative inline-flex items-center">
          <input
            ref={ref}
            type="checkbox"
            role="switch"
            id={switchId}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div
            className={`w-9 h-5 rounded-full transition-colors duration-200 ease-in-out ${
              checked ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700'
            } peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-1`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm transform mt-[3px] ml-[3px] ${
                checked ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </div>
        </div>
      </label>
    );
  }
);

Switch.displayName = 'Switch';
