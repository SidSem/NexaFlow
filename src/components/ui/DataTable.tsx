import React, { useState, useMemo } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Columns,
  Search,
  CheckSquare,
  Square,
  MinusSquare,
} from 'lucide-react';
import { TableColumn } from '../../types';
import { Input } from './Input';
import { Pagination } from './Pagination';
import { Popover } from './Popover';
import { Button } from './Button';

export interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyExtractor: (item: T) => string;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  bulkActions?: React.ReactNode;
  searchPlaceholder?: string;
  defaultPageSize?: number;
  mobileCardRender?: (item: T) => React.ReactNode;
  emptyState?: React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  selectedIds = [],
  onSelectionChange,
  bulkActions,
  searchPlaceholder = 'Filter records...',
  defaultPageSize = 10,
  mobileCardRender,
  emptyState,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(
    columns.map((c) => c.key)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Search filter
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const query = searchTerm.toLowerCase();

    return data.filter((item) => {
      return Object.values(item).some((val) => {
        if (val === null || val === undefined) return false;
        if (typeof val === 'string' || typeof val === 'number') {
          return String(val).toLowerCase().includes(query);
        }
        if (Array.isArray(val)) {
          return val.some((v) => String(v).toLowerCase().includes(query));
        }
        return false;
      });
    });
  }, [data, searchTerm]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      return sortDirection === 'asc' ? 1 : -1;
    });
  }, [filteredData, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Selection
  const allCurrentPageSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedIds.includes(keyExtractor(item)));
  const someCurrentPageSelected =
    paginatedData.some((item) => selectedIds.includes(keyExtractor(item))) &&
    !allCurrentPageSelected;

  const toggleSelectAll = () => {
    if (!onSelectionChange) return;
    if (allCurrentPageSelected) {
      const currentPageIds = paginatedData.map(keyExtractor);
      onSelectionChange(selectedIds.filter((id) => !currentPageIds.includes(id)));
    } else {
      const currentPageIds = paginatedData.map(keyExtractor);
      const newSelected = Array.from(new Set([...selectedIds, ...currentPageIds]));
      onSelectionChange(newSelected);
    }
  };

  const toggleSelectOne = (id: string) => {
    if (!onSelectionChange) return;
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((item) => item !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const toggleColumnVisibility = (key: string) => {
    setVisibleColumnKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const activeColumns = columns.filter((c) => visibleColumnKeys.includes(c.key));

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex-1 max-w-sm">
          <Input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            leftIcon={<Search className="w-4 h-4" />}
            className="h-9"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Column Visibility */}
          <Popover
            position="bottom-right"
            trigger={
              <Button variant="outline" size="sm" leftIcon={<Columns className="w-3.5 h-3.5" />}>
                Columns
              </Button>
            }
            content={
              <div className="w-48 flex flex-col gap-2 p-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
                  Toggle Columns
                </span>
                <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                  {columns.map((col) => (
                    <label
                      key={col.key}
                      className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 px-1 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumnKeys.includes(col.key)}
                        onChange={() => toggleColumnVisibility(col.key)}
                        className="rounded text-brand-600 focus:ring-brand-500"
                      />
                      <span>{col.header}</span>
                    </label>
                  ))}
                </div>
              </div>
            }
          />
        </div>
      </div>

      {/* Bulk Action Bar if items selected */}
      {selectedIds.length > 0 && bulkActions && (
        <div className="flex items-center justify-between p-2.5 px-4 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-700 dark:text-brand-300 text-xs animate-fade-in">
          <div className="flex items-center gap-2 font-medium">
            <CheckSquare className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>
              <strong>{selectedIds.length}</strong> {selectedIds.length === 1 ? 'item' : 'items'} selected
            </span>
          </div>
          <div className="flex items-center gap-2">{bulkActions}</div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 font-semibold select-none">
              {onSelectionChange && (
                <th className="w-10 px-3 py-3 text-center">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    aria-label="Select all"
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    {allCurrentPageSelected ? (
                      <CheckSquare className="w-4 h-4 text-brand-600" />
                    ) : someCurrentPageSelected ? (
                      <MinusSquare className="w-4 h-4 text-brand-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
              )}

              {activeColumns.map((column) => (
                <th
                  key={column.key}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={`px-3 py-3 whitespace-nowrap ${
                    column.sortable
                      ? 'cursor-pointer hover:text-slate-900 dark:hover:text-slate-100'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <span className="text-slate-400">
                        {sortKey === column.key ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="w-3.5 h-3.5 text-brand-600" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-brand-600" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-3 h-3 opacity-40" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={activeColumns.length + (onSelectionChange ? 1 : 0)}
                  className="py-12 text-center text-slate-400"
                >
                  {emptyState || 'No records found.'}
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => {
                const id = keyExtractor(row);
                const isSelected = selectedIds.includes(id);

                return (
                  <tr
                    key={id}
                    className={`transition-colors table-row-dense ${
                      isSelected
                        ? 'bg-brand-50/50 dark:bg-brand-950/20'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {onSelectionChange && (
                      <td className="w-10 px-3 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSelectOne(id)}
                          aria-label="Select row"
                          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-brand-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    )}

                    {activeColumns.map((col) => (
                      <td key={col.key} className="px-3 py-3 text-slate-700 dark:text-slate-300">
                        {col.render ? col.render(row) : String(row[col.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View */}
      <div className="block md:hidden space-y-2.5">
        {paginatedData.length === 0 ? (
          <div className="py-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            {emptyState || 'No records found.'}
          </div>
        ) : (
          paginatedData.map((row) => {
            const id = keyExtractor(row);
            const isSelected = selectedIds.includes(id);

            return (
              <div
                key={id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/30 dark:bg-brand-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                {onSelectionChange && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => toggleSelectOne(id)}
                      className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-brand-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                      <span>Select</span>
                    </button>
                  </div>
                )}

                {mobileCardRender
                  ? mobileCardRender(row)
                  : activeColumns.map((col) => (
                      <div key={col.key} className="flex items-center justify-between py-1 text-xs">
                        <span className="font-medium text-slate-500">{col.header}</span>
                        <span>{col.render ? col.render(row) : String(row[col.key] ?? '')}</span>
                      </div>
                    ))}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Footer */}
      {sortedData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedData.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      )}
    </div>
  );
}
