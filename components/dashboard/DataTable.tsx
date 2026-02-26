'use client';

/**
 * DataTable — sortable, dark-themed data table with keyboard accessibility.
 *
 * Usage:
 *   const columns: Column<Request>[] = [
 *     { key: 'title', label: 'Título', sortable: true },
 *     { key: 'status', label: 'Estado', render: (r) => <StatusBadge status={r.status} /> },
 *   ];
 *   <DataTable columns={columns} data={requests} onRowClick={(r) => router.push(`/requests/${r.id}`)} />
 */

import { useState } from 'react';

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T extends { [key: string]: unknown }> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

type SortDirection = 'asc' | 'desc';

function SortIcon({ direction }: { direction?: SortDirection }) {
  if (!direction) {
    return (
      <svg
        className="w-3.5 h-3.5 text-text-muted"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
        />
      </svg>
    );
  }
  return direction === 'asc' ? (
    <svg
      className="w-3.5 h-3.5 text-primary"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  ) : (
    <svg
      className="w-3.5 h-3.5 text-primary"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function DataTable<T extends { [key: string]: unknown }>({
  columns,
  data,
  emptyMessage = 'Sin resultados',
  onRowClick,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>('asc');

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const aStr = String(a[sortKey] ?? '');
        const bStr = String(b[sortKey] ?? '');
        const cmp = aStr.localeCompare(bStr, 'es');
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : data;

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-white/5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5 bg-surface">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider select-none ${
                  col.sortable
                    ? 'cursor-pointer hover:text-text-secondary focus-visible:outline-none focus-visible:text-text-secondary'
                    : ''
                }`}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
                onKeyDown={
                  col.sortable
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSort(col.key);
                        }
                      }
                    : undefined
                }
                tabIndex={col.sortable ? 0 : undefined}
                aria-sort={
                  col.sortable
                    ? sortKey === col.key
                      ? sortDir === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                    : undefined
                }
              >
                <span className="inline-flex items-center gap-1.5">
                  {col.label}
                  {col.sortable && (
                    <SortIcon direction={sortKey === col.key ? sortDir : undefined} />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-white/5">
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-text-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((item, rowIdx) => {
              // Prefer an `id` field as stable key; fall back to index
              const rowKey = (item.id as string | number | undefined) ?? rowIdx;
              return (
                <tr
                  key={rowKey}
                  className={`bg-background transition-colors ${
                    onRowClick
                      ? 'cursor-pointer hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40'
                      : 'hover:bg-white/[0.02]'
                  }`}
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                  onKeyDown={
                    onRowClick
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onRowClick(item);
                          }
                        }
                      : undefined
                  }
                  tabIndex={onRowClick ? 0 : undefined}
                  role={onRowClick ? 'button' : undefined}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-text-secondary">
                      {col.render
                        ? col.render(item)
                        : (item[col.key] as React.ReactNode) ?? '—'}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
