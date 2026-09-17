import React, { useState, useRef } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select options...',
  helperText,
  error,
  containerClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  const toggleOption = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const removeOption = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== val));
  };

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={containerRef} className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`min-h-[38px] w-full rounded-lg bg-white dark:bg-slate-900 border text-slate-900 dark:text-slate-100 text-sm p-1.5 flex flex-wrap items-center gap-1.5 cursor-pointer transition-colors duration-150 focus-within:ring-2 focus-within:ring-brand-500/50 ${
            error
              ? 'border-rose-500'
              : 'border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
          }`}
        >
          {value.length === 0 && (
            <span className="text-slate-400 dark:text-slate-500 text-sm pl-2">
              {placeholder}
            </span>
          )}

          {value.map((val) => {
            const opt = options.find((o) => o.value === val);
            return (
              <span
                key={val}
                className="inline-flex items-center gap-1 bg-brand-500/10 text-brand-600 dark:text-brand-300 text-xs font-medium px-2 py-0.5 rounded-md border border-brand-500/20"
              >
                <span>{opt?.label || val}</span>
                <button
                  type="button"
                  onClick={(e) => removeOption(val, e)}
                  className="hover:text-rose-500 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}

          <div className="ml-auto pr-1">
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-150 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-1.5 max-h-56 overflow-y-auto">
            <div className="px-2 pb-1.5 pt-0.5">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full text-xs px-2.5 py-1.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {filteredOptions.length === 0 ? (
              <div className="text-xs text-slate-500 dark:text-slate-400 px-3 py-2 text-center">
                No matching options
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = value.includes(opt.value);
                return (
                  <div
                    key={opt.value}
                    onClick={() => toggleOption(opt.value)}
                    className={`flex items-center justify-between px-3 py-1.5 text-xs cursor-pointer select-none transition-colors ${
                      isSelected
                        ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-300 font-medium'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-brand-500" />}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
      {!error && helperText && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
};
