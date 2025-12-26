import Link from 'next/link';
import { NewDiscussionForm } from '@/components/discussions';

/**
 * New Discussion page - form to create a new discussion topic
 * Requirements: 7.2
 */
export default function NewDiscussionPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/discussions"
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
          返回讨论列表
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            发起新讨论
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            分享您的想法，与大家一起交流
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
          <NewDiscussionForm />
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: '发起新讨论 - 个人博客',
  description: '发起一个新的讨论话题',
};
