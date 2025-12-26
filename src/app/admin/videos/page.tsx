'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Video } from '@/types';
import AdminTable from '@/components/admin/AdminTable';
import VideoForm from '@/components/admin/VideoForm';

/**
 * Videos Management Page
 * CRUD operations for videos
 * Requirements: 10.1, 10.2
 */
export default function AdminVideosPage() {
  const searchParams = useSearchParams();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Video | null>(null);

  useEffect(() => {
    fetchVideos();
    if (searchParams.get('action') === 'new') {
      setShowForm(true);
    }
  }, [searchParams]);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos');
      const result = await response.json();
      if (result.success) {
        setVideos(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingVideo(null);
    setShowForm(true);
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setShowForm(true);
  };

  const handleDelete = async (video: Video) => {
    setDeleteConfirm(video);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/videos/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        setVideos(videos.filter(v => v.id !== deleteConfirm.id));
      }
    } catch (error) {
      console.error('Failed to delete video:', error);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleFormSubmit = async (data: Partial<Video>) => {
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    try {
      if (editingVideo) {
        const response = await fetch(`/api/videos/${editingVideo.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(data),
        });
        if (response.ok) {
          const result = await response.json();
          setVideos(videos.map(v => v.id === editingVideo.id ? result.data : v));
        }
      } else {
        const response = await fetch('/api/videos', {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
        });
        if (response.ok) {
          const result = await response.json();
          setVideos([result.data, ...videos]);
        }
      }
      setShowForm(false);
      setEditingVideo(null);
    } catch (error) {
      console.error('Failed to save video:', error);
    }
  };

  const typeLabels: Record<string, string> = {
    'embedded': '内嵌',
    'external': '外链',
  };

  const columns = [
    { key: 'title', label: '标题' },
    { key: 'category', label: '分类' },
    {
      key: 'type',
      label: '类型',
      render: (video: Video) => (
        <span className={`px-2 py-1 text-xs rounded ${
          video.type === 'embedded' 
            ? 'bg-emerald-500/10 text-emerald-400' 
            : 'bg-blue-500/10 text-blue-400'
        }`}>
          {typeLabels[video.type]}
        </span>
      ),
    },
    { key: 'author', label: '作者' },
    {
      key: 'createdAt',
      label: '创建时间',
      render: (video: Video) => new Date(video.createdAt).toLocaleDateString('zh-CN'),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">视频管理</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          ➕ 新建视频
        </button>
      </div>

      <AdminTable
        columns={columns}
        data={videos}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        keyField="id"
      />

      {showForm && (
        <VideoForm
          video={editingVideo}
          onSubmit={handleFormSubmit}
          onCancel={() => { setShowForm(false); setEditingVideo(null); }}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0d0d14] border border-emerald-500/20 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">确认删除</h3>
            <p className="text-gray-400 mb-6">
              确定要删除视频 &quot;{deleteConfirm.title}&quot; 吗？此操作不可撤销。
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
