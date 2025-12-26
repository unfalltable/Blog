'use client';

import Link from 'next/link';
import { Note } from '@/types';

interface NoteDetailProps {
  note: Note;
}

/**
 * NoteDetail component displays the full content of a note
 * Requirements: 1.2
 */
export function NoteDetail({ note }: NoteDetailProps) {
  const formattedCreatedDate = new Date(note.createdAt).toLocaleDateString(
    'zh-CN',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  const formattedUpdatedDate = new Date(note.updatedAt).toLocaleDateString(
    'zh-CN',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  return (
    <article className="max-w-4xl mx-auto">
      <Link
        href="/notes"
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6"
      >
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        返回笔记列表
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {note.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
            {note.category}
          </span>

          <time dateTime={note.createdAt}>创建于 {formattedCreatedDate}</time>

          {note.createdAt !== note.updatedAt && (
            <time dateTime={note.updatedAt}>
              更新于 {formattedUpdatedDate}
            </time>
          )}
        </div>

        {note.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {note.summary && (
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
          <p className="text-gray-700 dark:text-gray-300 italic">
            {note.summary}
          </p>
        </div>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none">
        {note.content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4 text-gray-800 dark:text-gray-200">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
