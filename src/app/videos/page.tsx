import { getVideos, getVideosByCategory, getCategories } from '@/services/videos';
import { VideoList } from '@/components/videos';

interface VideosPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

/**
 * Videos page - displays categorized list of teaching videos
 * Requirements: 5.1
 */
export default async function VideosPage({ searchParams }: VideosPageProps) {
  const params = await searchParams;
  const category = params.category || undefined;

  const [videos, categories] = await Promise.all([
    category ? getVideosByCategory(category) : getVideos(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            教学视频
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            浏览教学实盘视频，学习交易技巧和策略
          </p>
        </header>

        <VideoList
          videos={videos}
          categories={categories}
          selectedCategory={category}
        />
      </div>
    </div>
  );
}

export const metadata = {
  title: '教学视频 - 个人博客',
  description: '浏览教学实盘视频，学习交易技巧和策略',
};
