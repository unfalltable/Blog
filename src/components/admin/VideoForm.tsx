'use client';

import { useState } from 'react';
import { Video, VideoType } from '@/types';

interface VideoFormProps {
  video: Video | null;
  onSubmit: (data: Partial<Video>) => void;
  onCancel: () => void;
}

/**
 * Video Form Component
 * Create/Edit form for videos
 * Requirements: 10.1, 10.2
 */
export default function VideoForm({ video, onSubmit, onCancel }: VideoFormProps) {
  const [formData, setFormData] = useState({
    title: video?.title || '',
    description: video?.description || '',
    thumbnail: video?.thumbnail || '',
    category: video?.category || '',
    type: video?.type || 'external' as VideoType,
    source: video?.source || '',
    author: video?.author || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d0d14] border border-emerald-500/20 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-white mb-6">
          {video ? '编辑视频' : '新建视频'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">标题</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-emerald-500/20 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-emerald-500/20 rounded-lg text-white focus:outline-none focus:border-emerald-500/50 h-20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">分类</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0f] border border-emerald-500/20 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">类型</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as VideoType })}
                className="w-full px-4 py-3 bg-[#0a0a0f] border border-emerald-500/20 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
              >
                <option value="external">外链</option>
                <option value="embedded">内嵌</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {formData.type === 'embedded' ? '嵌入代码/URL' : '视频链接'}
            </label>
            <input
              type="text"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-emerald-500/20 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
              placeholder={formData.type === 'embedded' ? 'https://...' : 'https://...'}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">缩略图URL</label>
            <input
              type="text"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-emerald-500/20 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">作者</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-emerald-500/20 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              {video ? '保存' : '创建'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
