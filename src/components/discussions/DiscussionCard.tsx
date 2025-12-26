'use client';

import Link from 'next/link';
import { Discussion } from '@/types';

interface DiscussionCardProps {
  discussion: Discussion;
}

/**
 * DiscussionCard component displays a single discussion in a card format
 * Requirements: 7.1, 7.4
 */
export function DiscussionCard({ discussion }: DiscussionCardProps) {
  const formattedDate = new Date(discussion.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedActivityDate = new Date(discussion.lastActivityAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Link href={`/discussions/${discussion.id}`}>
      <article className="group p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-1">
            {discussion.title}
          </h2>
          <span className="ml-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {discussion.replyCount}
          </span>
        </div>

        <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">
          {discussion.content.substring(0, 150)}
          {discussion.content.length > 150 && '...'}
        </p>

        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-500 dark:text-gray-400">
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>{discussion.authorName}</span>
          </div>

          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
            <time dateTime={discussion.createdAt}>
              发布于 {formattedDate}
            </time>
            <span className="text-xs">
              最后活动: {formattedActivityDate}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
