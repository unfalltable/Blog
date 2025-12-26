import { Suspense } from 'react';
import { getNotes, getCategories } from '@/services/notes';
import { NoteList, NoteSearch } from '@/components/notes';

interface NotesPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    category?: string;
  }>;
}

/**
 * Notes page - displays paginated list of notes with search and filter
 * Requirements: 1.1, 1.3, 1.4
 */
export default async function NotesPage({ searchParams }: NotesPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const pageSize = parseInt(params.pageSize || '9', 10);
  const search = params.search || undefined;
  const category = params.category || undefined;

  const [notesResult, categories] = await Promise.all([
    getNotes({ page, pageSize, search, category }),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            笔记
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            浏览和搜索所有笔记内容
          </p>
        </header>

        <Suspense fallback={<div>加载中...</div>}>
          <NoteSearch categories={categories} />
        </Suspense>

        <NoteList
          notes={notesResult.data}
          total={notesResult.total}
          page={notesResult.page}
          pageSize={notesResult.pageSize}
          totalPages={notesResult.totalPages}
        />
      </div>
    </div>
  );
}

export const metadata = {
  title: '笔记 - 个人博客',
  description: '浏览和搜索博主的笔记内容',
};
