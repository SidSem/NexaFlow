import React from 'react';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string; // hex or tailwind class
  showLabel?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  color,
  showLabel = false,
  className = '',
  ...props
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={`w-full flex items-center gap-2.5 ${className}`} {...props}>
      <div
        className={`flex-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden ${sizeStyles[size]}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${
            color ? '' : 'bg-brand-500'
          }`}
          style={{
            width: `${percentage}%`,
            backgroundColor: color || undefined,
          }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {showLabel && (
        <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 w-8 text-right">
          {percentage}%
        </span>
      )}
    </div>
  );
};
