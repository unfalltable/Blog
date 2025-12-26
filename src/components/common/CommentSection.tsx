'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Comment, CommentTargetType } from '@/types';

interface CommentWithReplies extends Comment {
  replies: Comment[];
}

interface CommentSectionProps {
  targetType: CommentTargetType;
  targetId: string;
}

export function CommentSection({ targetType, targetId }: CommentSectionProps) {
  const { user, isLoggedIn, token, isLoading: authLoading } = useAuth();
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [targetType, targetId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `/api/comments?targetType=${targetType}&targetId=${targetId}`
      );
      const data = await response.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !isLoggedIn) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetType, targetId, content }),
      });

      const data = await response.json();

      if (data.success) {
        setComments([{ ...data.data, replies: [] }, ...comments]);
        setContent('');
      } else {
        setError(data.error?.message || '评论失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim() || !isLoggedIn) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetType, targetId, content: replyContent, parentId }),
      });

      const data = await response.json();

      if (data.success) {
        // 更新评论列表
        setComments(
          comments.map((c) =>
            c.id === parentId
              ? { ...c, replies: [...c.replies, data.data], replyCount: c.replyCount + 1 }
              : c
          )
        );
        setReplyContent('');
        setReplyingTo(null);
      }
    } catch (err) {
      console.error('Reply failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalCount = comments.reduce((acc, c) => acc + 1 + c.replies.length, 0);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-white mb-6">评论 ({totalCount})</h2>

      {/* Comment Form */}
      {authLoading ? (
        <div className="text-gray-400 text-center py-4">加载中...</div>
      ) : isLoggedIn ? (
        <form onSubmit={handleSubmit} className="mb-8">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-t-lg">
            <span className="text-sm text-emerald-400">
              以 <span className="font-semibold">{user?.username}</span> 的身份评论
            </span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写下你的评论..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 border-t-0 rounded-b-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="mt-3 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-medium rounded-lg transition-colors"
          >
            {isSubmitting ? '发布中...' : '发布评论'}
          </button>
        </form>
      ) : (
        <div className="mb-8 p-6 bg-gray-900/50 rounded-xl border border-gray-800 text-center">
          <p className="text-gray-400 mb-4">登录后即可发表评论</p>
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
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="text-gray-400 text-center py-8">加载评论中...</div>
      ) : comments.length === 0 ? (
        <div className="text-gray-500 text-center py-8">暂无评论，来发表第一条评论吧</div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
              {/* Main Comment */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-emerald-400">{comment.username}</span>
                <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="text-gray-300 whitespace-pre-wrap mb-3">{comment.content}</p>

              {/* Reply Button */}
              {isLoggedIn && (
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  {replyingTo === comment.id ? '取消回复' : `回复 ${comment.replyCount > 0 ? `(${comment.replyCount})` : ''}`}
                </button>
              )}

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <div className="mt-3 pl-4 border-l-2 border-gray-700">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={`回复 ${comment.username}...`}
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm resize-none"
                  />
                  <button
                    onClick={() => handleReply(comment.id)}
                    disabled={isSubmitting || !replyContent.trim()}
                    className="mt-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white text-sm rounded-lg transition-colors"
                  >
                    {isSubmitting ? '发送中...' : '发送回复'}
                  </button>
                </div>
              )}

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-gray-700 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="pt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-cyan-400 text-sm">{reply.username}</span>
                        <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                      </div>
                      <p className="text-gray-400 text-sm whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
