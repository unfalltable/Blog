'use client';

import Link from 'next/link';
import { Note } from '@/types';

interface NoteCardProps {
  note: Note;
}

/**
 * NoteCard component displays a single note in a card format
 * Requirements: 1.1
 */
export function NoteCard({ note }: NoteCardProps) {
  const formattedDate = new Date(note.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/notes/${note.id}`}>
      <article className="group p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {note.title}
        </h2>
        
        <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">
          {note.summary || note.content.substring(0, 150)}
        </p>
        
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
            {note.category}
          </span>
          
          {note.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
            >
              #{tag}
            </span>
          ))}
          
          {note.tags.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{note.tags.length - 3}
            </span>
          )}
        </div>
        
        <time className="mt-3 block text-sm text-gray-500 dark:text-gray-400">
          {formattedDate}
        </time>
      </article>
    </Link>
  );
}
