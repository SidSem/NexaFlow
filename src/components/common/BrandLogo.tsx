import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Geometric SVG Icon */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-900 p-1.5 shadow-md shadow-brand-600/25 border border-brand-500/30 flex-shrink-0`}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white">
          <path
            d="M4 7L12 3L20 7L12 11L4 7Z"
            fill="currentColor"
            fillOpacity="0.9"
          />
          <path
            d="M4 12L12 16L20 12L12 8L4 12Z"
            fill="currentColor"
            fillOpacity="0.65"
          />
          <path
            d="M4 17L12 21L20 17L12 13L4 17Z"
            fill="currentColor"
            fillOpacity="0.4"
          />
          <circle cx="12" cy="3" r="1.5" fill="#c7d2fe" />
          <circle cx="20" cy="7" r="1.2" fill="#a5b4fc" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-extrabold tracking-tight text-slate-900 dark:text-white ${textSizes[size]} leading-none`}
          >
            Nexa<span className="text-brand-600 dark:text-brand-400">Flow</span>
          </span>
        </div>
      )}
    </div>
  );
};
