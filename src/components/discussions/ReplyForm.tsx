'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface ReplyFormProps {
  discussionId: string;
  onReplyAdded?: () => void;
}

/**
 * ReplyForm component for adding replies to a discussion
 * Requirements: 7.3
 */
export function ReplyForm({ discussionId, onReplyAdded }: ReplyFormProps) {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const [content, setContent] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      setError('请先登录后再回复');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/discussions/${discussionId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          authorName: user?.username,
          authorEmail: authorEmail || `${user?.username}@user.local`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || '提交失败');
      }

      setSuccess(true);
      setContent('');
      onReplyAdded?.();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="text-center py-4">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800 text-center">
        <p className="text-gray-400 mb-4">登录后即可参与讨论</p>
        <div className="flex justify-center gap-4">
          <Link
            href="/auth/login"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-sm"
          >
            登录
          </Link>
          <Link
            href="/auth/register"
            className="px-4 py-2 border border-gray-600 hover:border-gray-500 text-gray-300 rounded-lg transition-colors text-sm"
          >
            注册
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-white">发表回复</h3>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
          <p className="text-sm text-green-400">回复发表成功！</p>
        </div>
      )}

      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
        <p className="text-sm text-emerald-400">
          以 <span className="font-semibold">{user?.username}</span> 的身份回复
        </p>
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          回复内容 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}
          className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          placeholder="请输入您的回复内容..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-medium rounded-lg transition-colors"
      >
        {isSubmitting ? '提交中...' : '发表回复'}
      </button>
    </form>
  );
}
