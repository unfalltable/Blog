'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  notes: number;
  projects: number;
  videos: number;
  discussions: number;
  pendingRequests: number;
}

/**
 * Admin Dashboard Page
 * Overview of blog statistics and quick actions
 * Requirements: 10.1
 */
export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    notes: 0,
    projects: 0,
    videos: 0,
    discussions: 0,
    pendingRequests: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [notesRes, projectsRes, videosRes, discussionsRes, requestsRes] = await Promise.all([
        fetch('/api/notes'),
        fetch('/api/projects'),
        fetch('/api/videos'),
        fetch('/api/discussions'),
        fetch('/api/contact-requests', { headers }),
      ]);

      const [notesData, projectsData, videosData, discussionsData, requestsData] = await Promise.all([
        notesRes.json(),
        projectsRes.json(),
        videosRes.json(),
        discussionsRes.json(),
        requestsRes.json(),
      ]);

      setStats({
        notes: notesData.data?.total || notesData.data?.length || 0,
        projects: projectsData.data?.length || 0,
        videos: videosData.data?.length || 0,
        discussions: discussionsData.data?.length || 0,
        pendingRequests: requestsData.data?.filter((r: { status: string }) => r.status === 'pending').length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { label: '笔记', value: stats.notes, icon: '📝', href: '/admin/notes', color: 'emerald' },
    { label: '项目', value: stats.projects, icon: '🚀', href: '/admin/projects', color: 'cyan' },
    { label: '视频', value: stats.videos, icon: '🎬', href: '/admin/videos', color: 'purple' },
    { label: '讨论', value: stats.discussions, icon: '💬', href: '/admin/discussions', color: 'blue' },
    { label: '待处理申请', value: stats.pendingRequests, icon: '📬', href: '/admin/contact-requests', color: 'orange' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">仪表盘</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-[#0d0d14] border border-emerald-500/20 rounded-xl p-6 hover:border-emerald-500/40 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{card.icon}</span>
              <span className={`text-3xl font-bold text-${card.color}-400`}>
                {isLoading ? '-' : card.value}
              </span>
            </div>
            <p className="text-gray-400 group-hover:text-white transition-colors">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-[#0d0d14] border border-emerald-500/20 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">快捷操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/notes?action=new"
            className="flex items-center space-x-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition-colors"
          >
            <span>➕</span>
            <span>新建笔记</span>
          </Link>
          <Link
            href="/admin/projects?action=new"
            className="flex items-center space-x-2 px-4 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition-colors"
          >
            <span>➕</span>
            <span>新建项目</span>
          </Link>
          <Link
            href="/admin/videos?action=new"
            className="flex items-center space-x-2 px-4 py-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/20 transition-colors"
          >
            <span>➕</span>
            <span>新建视频</span>
          </Link>
          <Link
            href="/admin/contact-requests"
            className="flex items-center space-x-2 px-4 py-3 bg-orange-500/10 border border-orange-500/30 rounded-lg text-orange-400 hover:bg-orange-500/20 transition-colors"
          >
            <span>📋</span>
            <span>处理申请</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
