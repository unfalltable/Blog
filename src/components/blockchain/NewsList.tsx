'use client';

import { BlockchainNews } from '@/types';
import { formatRelativeTime } from '@/services/blockchain';

interface NewsListProps {
  news: BlockchainNews[];
}

/**
 * NewsList component displays blockchain news articles
 * sorted by publication date (newest first)
 * Requirements: 6.3
 */
export function NewsList({ news }: NewsListProps) {
  if (news.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
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
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          暂无新闻
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          没有找到区块链相关新闻
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {news.map((article) => (
        <article
          key={article.id}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
        >
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {article.title}
            </h3>
            
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {article.summary}
            </p>

            <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                  {article.source}
                </span>
                <span>{formatRelativeTime(article.publishedAt)}</span>
              </div>
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                阅读更多
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </span>
            </div>
          </a>
        </article>
      ))}
    </div>
  );
}
