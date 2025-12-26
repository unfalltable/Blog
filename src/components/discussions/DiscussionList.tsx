'use client';

import { Discussion } from '@/types';
import { DiscussionCard } from './DiscussionCard';

interface DiscussionListProps {
  discussions: Discussion[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * DiscussionList component displays a list of discussions sorted by activity
 * Requirements: 7.1
 */
export function DiscussionList({
  discussions,
  total,
  page,
  totalPages,
}: DiscussionListProps) {
  if (discussions.length === 0) {
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
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          暂无讨论
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          成为第一个发起讨论的人吧！
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        共 {total} 个讨论话题
      </p>

      <div className="space-y-4">
        {discussions.map((discussion) => (
          <DiscussionCard key={discussion.id} discussion={discussion} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center gap-2" aria-label="分页导航">
            {page > 1 && (
              <a
                href={`/discussions?page=${page - 1}`}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                上一页
              </a>
            )}
            <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
              第 {page} / {totalPages} 页
            </span>
            {page < totalPages && (
              <a
                href={`/discussions?page=${page + 1}`}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                下一页
              </a>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
