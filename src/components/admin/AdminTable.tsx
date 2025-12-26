'use client';

import { ReactNode } from 'react';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  keyField: keyof T;
}

/**
 * Reusable Admin Table Component
 * Requirements: 10.1, 10.2
 */
function AdminTable<T>({
  columns,
  data,
  isLoading,
  onEdit,
  onDelete,
  keyField,
}: AdminTableProps<T>) {
  if (isLoading) {
    return (
      <div className="bg-[#0d0d14] border border-emerald-500/20 rounded-xl p-8 text-center">
        <div className="text-emerald-400">加载中...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-[#0d0d14] border border-emerald-500/20 rounded-xl p-8 text-center">
        <div className="text-gray-400">暂无数据</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0d0d14] border border-emerald-500/20 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-emerald-500/20">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-left text-sm font-medium text-gray-400"
                >
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">
                  操作
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={String(item[keyField])}
                className="border-b border-emerald-500/10 hover:bg-emerald-500/5 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-gray-300">
                    {col.render 
                      ? col.render(item) 
                      : String((item as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="px-3 py-1 text-sm text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors"
                        >
                          编辑
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="px-3 py-1 text-sm text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        >
                          删除
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminTable;
