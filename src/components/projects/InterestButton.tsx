'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface InterestButtonProps {
  projectId: string;
  initialCount?: number;
}

export function InterestButton({ projectId, initialCount = 0 }: InterestButtonProps) {
  const { isLoggedIn, token } = useAuth();
  const [isInterested, setIsInterested] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchInterestStatus();
  }, [projectId, token]);

  const fetchInterestStatus = async () => {
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`/api/projects/${projectId}/interest`, { headers });
      const data = await response.json();

      if (data.success) {
        setIsInterested(data.data.isInterested);
        setCount(data.data.count);
      }
    } catch (err) {
      console.error('Failed to fetch interest status:', err);
    }
  };

  const handleToggle = async () => {
    if (!isLoggedIn) {
      alert('请先登录');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/interest`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setIsInterested(data.data.isInterested);
        setCount(data.data.count);
      }
    } catch (err) {
      console.error('Failed to toggle interest:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        isInterested
          ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50 hover:bg-pink-500/30'
          : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-pink-500/50 hover:text-pink-400'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <svg
        className={`w-5 h-5 transition-transform ${isInterested ? 'scale-110' : ''}`}
        fill={isInterested ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{isInterested ? '已感兴趣' : '感兴趣'}</span>
      {count > 0 && <span className="text-sm">({count})</span>}
    </button>
  );
}
