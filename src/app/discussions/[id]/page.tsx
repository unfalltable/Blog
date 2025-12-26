import { notFound } from 'next/navigation';
import { getDiscussionWithReplies } from '@/services/discussions';
import { DiscussionDetailClient } from './DiscussionDetailClient';

interface DiscussionPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Discussion detail page - displays a discussion with its replies
 * Requirements: 7.4
 */
export default async function DiscussionPage({ params }: DiscussionPageProps) {
  const { id } = await params;
  const result = await getDiscussionWithReplies(id);

  if (!result) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DiscussionDetailClient
          discussion={result.discussion}
          initialReplies={result.replies}
        />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: DiscussionPageProps) {
  const { id } = await params;
  const result = await getDiscussionWithReplies(id);

  if (!result) {
    return {
      title: '讨论未找到 - 个人博客',
    };
  }

  return {
    title: `${result.discussion.title} - 讨论区`,
    description: result.discussion.content.substring(0, 160),
  };
}
