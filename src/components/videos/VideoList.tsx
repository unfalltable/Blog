'use client';

import { Video } from '@/types';
import { VideoCard } from './VideoCard';

interface VideoListProps {
  videos: Video[];
  categories: string[];
  selectedCategory?: string;
}

/**
 * VideoList component displays a categorized list of videos
 * Requirements: 5.1
 */
export function VideoList({
  videos,
  categories,
  selectedCategory,
}: VideoListProps) {
  if (videos.length === 0) {
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
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          暂无视频
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {selectedCategory
            ? `没有找到 "${selectedCategory}" 分类的视频`
            : '没有找到任何视频'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Category filter */}
      {categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <a
            href="/videos"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            全部
          </a>
          {categories.map((category) => (
            <a
              key={category}
              href={`/videos?category=${encodeURIComponent(category)}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </a>
          ))}
        </div>
      )}

      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        共 {videos.length} 个视频
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
