'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Discussion } from '@/types';

interface RecentDiscussionsProps {
  discussions: Discussion[];
}

/**
 * RecentDiscussions Component
 * Displays recent discussions on homepage
 * Requirements: 8.4
 */
export default function RecentDiscussions({ discussions }: RecentDiscussionsProps) {
  if (discussions.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
            热门讨论
          </h2>
          <p className="text-gray-400 text-center mb-12">
            加入社区讨论，分享你的见解
          </p>
        </motion.div>

        <div className="space-y-4">
          {discussions.slice(0, 5).map((discussion, index) => (
            <motion.div
              key={discussion.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/discussions/${discussion.id}`}>
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white mb-2 truncate">
                        {discussion.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-1">
                        {discussion.content}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="flex items-center gap-1 text-emerald-400 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {discussion.replyCount}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(discussion.lastActivityAt).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                    <span className="text-emerald-400">{discussion.authorName}</span>
                    <span>发起于</span>
                    <span>{new Date(discussion.createdAt).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10"
        >
          <Link
            href="/discussions"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            查看全部讨论
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
