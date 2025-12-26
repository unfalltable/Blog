'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

/**
 * NewDiscussionForm component for creating new discussion topics
 * Requirements: 7.2
 */
export function NewDiscussionForm() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fill author name if logged in
  useEffect(() => {
    if (user) {
      setAuthorName(user.username);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      setError('请先登录后再发布讨论');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/discussions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          authorName: user?.username || authorName,
          authorEmail: authorEmail || `${user?.username}@user.local`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || '创建失败');
      }

      // Redirect to the new discussion
      router.push(`/discussions/${data.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-4">请先登录</h2>
        <p className="text-gray-400 mb-6">登录后即可发起新的讨论</p>
        <div className="flex justify-center gap-4">
          <Link
            href="/auth/login"
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
          >
            登录
          </Link>
          <Link
            href="/auth/register"
            className="px-6 py-2 border border-gray-600 hover:border-gray-500 text-gray-300 rounded-lg transition-colors"
          >
            注册
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
        <p className="text-sm text-emerald-400">
          以 <span className="font-semibold">{user?.username}</span> 的身份发布
        </p>
      </div>

      <div>
        <label
          htmlFor="authorEmail"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          邮箱（可选，用于接收回复通知）
        </label>
        <input
          type="email"
          id="authorEmail"
          value={authorEmail}
          onChange={(e) => setAuthorEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          placeholder="请输入您的邮箱"
        />
      </div>

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          标题 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          placeholder="请输入讨论标题"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          内容 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={6}
          className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          placeholder="请输入讨论内容..."
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-medium rounded-lg transition-colors"
        >
          {isSubmitting ? '发布中...' : '发布讨论'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-lg transition-colors"
        >
          取消
        </button>
      </div>
    </form>
  );
}
