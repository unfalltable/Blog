import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getVideoById, getVideoRouting } from '@/services/videos';
import { VideoPlayer } from '@/components/videos';
import { CommentSection } from '@/components/common/CommentSection';

interface VideoDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Video detail page - displays video player for embedded videos
 * Requirements: 5.2, 5.4
 */
export default async function VideoDetailPage({ params }: VideoDetailPageProps) {
  const { id } = await params;
  const video = await getVideoById(id);

  if (!video) {
    notFound();
  }

  const routing = getVideoRouting(video);

  // If external video, redirect to external source
  if (routing.type === 'external') {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/videos"
            className="inline-flex items-center text-sm text-emerald-400 hover:text-emerald-300 mb-6"
          >
            <svg
              className="w-4 h-4 mr-2"
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
            返回视频列表
          </Link>

          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
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
            <h1 className="text-2xl font-bold text-white mb-2">
              {video.title}
            </h1>
            <p className="text-gray-400 mb-6">
              此视频托管在外部平台，点击下方按钮前往观看
            </p>
            <a
              href={routing.target}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              前往观看
              <svg
                className="w-4 h-4 ml-2"
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
            </a>
          </div>

          {/* Comments Section */}
          <CommentSection targetType="video" targetId={video.id} />
        </div>
      </div>
    );
  }

  const formattedDate = new Date(video.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/videos"
          className="inline-flex items-center text-sm text-emerald-400 hover:text-emerald-300 mb-6"
        >
          <svg
            className="w-4 h-4 mr-2"
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
          返回视频列表
        </Link>

        <article className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
          {/* Video Player */}
          <VideoPlayer video={video} />

          {/* Video Info */}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white">
              {video.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 text-sm bg-purple-500/20 text-purple-400 rounded-full">
                {video.category}
              </span>
              {video.author && (
                <span className="text-sm text-gray-400">
                  作者: {video.author}
                </span>
              )}
              <time className="text-sm text-gray-500">
                {formattedDate}
              </time>
            </div>

            {video.description && (
              <div className="mt-6 prose prose-invert max-w-none">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {video.description}
                </p>
              </div>
            )}
          </div>
        </article>

        {/* Comments Section */}
        <CommentSection targetType="video" targetId={video.id} />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: VideoDetailPageProps) {
  const { id } = await params;
  const video = await getVideoById(id);

  if (!video) {
    return {
      title: '视频未找到 - 个人博客',
    };
  }

  return {
    title: `${video.title} - 教学视频 - 个人博客`,
    description: video.description || `观看教学视频: ${video.title}`,
  };
}
