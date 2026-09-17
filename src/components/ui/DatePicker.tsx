import React, { useState, useRef } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  parseISO,
  isValid,
} from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';

export interface DatePickerProps {
  value?: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  minDate?: string;
  maxDate?: string;
  containerClassName?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Select date...',
  error,
  minDate,
  maxDate,
  containerClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const parsedValue = value && isValid(parseISO(value)) ? parseISO(value) : null;
  const [currentMonth, setCurrentMonth] = useState(parsedValue || new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDayClick = (day: Date) => {
    const formatted = format(day, 'yyyy-MM-dd');
    onChange(formatted);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  const setPreset = (daysToAdd: number) => {
    const target = addDays(new Date(), daysToAdd);
    onChange(format(target, 'yyyy-MM-dd'));
    setCurrentMonth(target);
    setIsOpen(false);
  };

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows: Date[][] = [];
  let days: Date[] = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      days.push(day);
      day = addDays(day, 1);
    }
    rows.push(days);
    days = [];
  }

  const weekDayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

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
          className={`flex items-center justify-between w-full rounded-lg bg-white dark:bg-slate-900 border text-slate-900 dark:text-slate-100 text-sm px-3 py-2 cursor-pointer transition-colors ${
            error
              ? 'border-rose-500'
              : 'border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2 text-xs truncate">
            <CalendarIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
            {parsedValue ? (
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {format(parsedValue, 'MMM d, yyyy')}
              </span>
            ) : (
              <span className="text-slate-400">{placeholder}</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {parsedValue && (
              <button
                type="button"
                onClick={handleClear}
                className="text-slate-400 hover:text-rose-500 rounded p-0.5"
                title="Clear date"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {isOpen && (
          <div className="absolute left-0 top-full mt-1.5 z-50 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-3 w-72">
            {/* Presets */}
            <div className="flex items-center gap-1 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
              <button
                type="button"
                onClick={() => setPreset(0)}
                className="text-[11px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-brand-500/10 hover:text-brand-600 transition-colors whitespace-nowrap"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setPreset(1)}
                className="text-[11px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-brand-500/10 hover:text-brand-600 transition-colors whitespace-nowrap"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => setPreset(7)}
                className="text-[11px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-brand-500/10 hover:text-brand-600 transition-colors whitespace-nowrap"
              >
                +1 Week
              </button>
              <button
                type="button"
                onClick={() => setPreset(30)}
                className="text-[11px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-brand-500/10 hover:text-brand-600 transition-colors whitespace-nowrap"
              >
                +1 Month
              </button>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-2 px-1">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {weekDayNames.map((d, i) => (
                <div key={i} className="text-[10px] font-semibold text-slate-400">
                  {d}
                </div>
              ))}
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-7 gap-1">
              {rows.flat().map((d, idx) => {
                const isCurrentMonth = isSameMonth(d, monthStart);
                const isSelected = parsedValue ? isSameDay(d, parsedValue) : false;
                const isToday = isSameDay(d, new Date());
                const isBeforeMin = minDate && isValid(parseISO(minDate)) ? d < parseISO(minDate) : false;
                const isAfterMax = maxDate && isValid(parseISO(maxDate)) ? d > parseISO(maxDate) : false;
                const isDisabled = Boolean(isBeforeMin || isAfterMax);

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => !isDisabled && handleDayClick(d)}
                    className={`h-7 w-7 rounded-md text-xs flex items-center justify-center transition-colors mx-auto ${
                      isDisabled
                        ? 'opacity-25 cursor-not-allowed'
                        : isSelected
                        ? 'bg-brand-600 text-white font-semibold shadow-sm'
                        : isToday
                        ? 'border border-brand-500/60 font-semibold text-brand-600 dark:text-brand-400'
                        : isCurrentMonth
                        ? 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  >
                    {format(d, 'd')}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
};
