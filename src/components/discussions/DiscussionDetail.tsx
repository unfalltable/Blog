'use client';

import Link from 'next/link';
import { Discussion, Reply } from '@/types';
import { ReplyForm } from './ReplyForm';

interface DiscussionDetailProps {
  discussion: Discussion;
  replies: Reply[];
  onReplyAdded?: () => void;
}

/**
 * DiscussionDetail component displays the full content of a discussion with replies
 * Requirements: 7.4
 */
export function DiscussionDetail({
  discussion,
  replies,
  onReplyAdded,
}: DiscussionDetailProps) {
  const formattedCreatedDate = new Date(discussion.createdAt).toLocaleDateString(
    'zh-CN',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  return (
    <article className="max-w-4xl mx-auto">
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

      {/* Discussion Header */}
      <header className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {discussion.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center">
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

          <time dateTime={discussion.createdAt}>
            发布于 {formattedCreatedDate}
          </time>

          <div className="flex items-center">
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
            <span>{discussion.replyCount} 条回复</span>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          {discussion.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-800 dark:text-gray-200">
              {paragraph}
            </p>
          ))}
        </div>
      </header>

      {/* Replies Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          回复 ({replies.length})
        </h2>

        {replies.length === 0 ? (
          <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
            <p className="text-gray-500 dark:text-gray-400">
              暂无回复，成为第一个回复的人吧！
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {replies.map((reply) => (
              <ReplyCard key={reply.id} reply={reply} />
            ))}
          </div>
        )}
      </section>

      {/* Reply Form */}
      <section className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <ReplyForm discussionId={discussion.id} onReplyAdded={onReplyAdded} />
      </section>
    </article>
  );
}

/**
 * ReplyCard component displays a single reply
 */
function ReplyCard({ reply }: { reply: Reply }) {
  const formattedDate = new Date(reply.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
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
          <span className="font-medium text-gray-900 dark:text-white">
            {reply.authorName}
          </span>
        </div>
        <time
          dateTime={reply.createdAt}
          className="text-xs text-gray-500 dark:text-gray-400"
        >
          {formattedDate}
        </time>
      </div>

      <div className="text-gray-800 dark:text-gray-200">
        {reply.content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-2 last:mb-0">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
