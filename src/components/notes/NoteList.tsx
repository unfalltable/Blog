'use client';

import { Note } from '@/types';
import { NoteCard } from './NoteCard';
import { Pagination } from './Pagination';

interface NoteListProps {
  notes: Note[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * NoteList component displays a paginated list of notes
 * Requirements: 1.1
 */
export function NoteList({
  notes,
  total,
  page,
  pageSize,
  totalPages,
}: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          暂无笔记
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          没有找到符合条件的笔记
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        共 {total} 篇笔记
      </p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
        />
      )}
    </div>
  );
}
