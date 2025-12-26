import Link from 'next/link';
import { getDiscussions } from '@/services/discussions';
import { DiscussionList } from '@/components/discussions';

interface DiscussionsPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
  }>;
}

/**
 * Discussions page - displays list of discussions sorted by activity
 * Requirements: 7.1, 7.4
 */
export default async function DiscussionsPage({ searchParams }: DiscussionsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const pageSize = parseInt(params.pageSize || '10', 10);

  const result = await getDiscussions({ page, pageSize });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              讨论区
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              与博主和其他访客交流想法
            </p>
          </div>
          <Link
            href="/discussions/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            发起讨论
          </Link>
        </header>

        <DiscussionList
          discussions={result.data}
          total={result.total}
          page={result.page}
          pageSize={result.pageSize}
          totalPages={result.totalPages}
        />
      </div>
    </div>
  );
}

export const metadata = {
  title: '讨论区 - 个人博客',
  description: '与博主和其他访客交流想法',
};
