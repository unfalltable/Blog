'use client';

import { useState } from 'react';
import { Note } from '@/types';

interface NoteFormProps {
  note: Note | null;
  onSubmit: (data: Partial<Note>) => void;
  onCancel: () => void;
}

/**
 * Note Form Component
 * Create/Edit form for notes
 * Requirements: 10.1, 10.2
 */
export default function NoteForm({ note, onSubmit, onCancel }: NoteFormProps) {
  const [formData, setFormData] = useState({
    title: note?.title || '',
    content: note?.content || '',
    summary: note?.summary || '',
    category: note?.category || '',
    tags: note?.tags.join(', ') || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d0d14] border border-emerald-500/20 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-white mb-6">
          {note ? '编辑笔记' : '新建笔记'}
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
            <label className="block text-sm font-medium text-gray-300 mb-2">摘要</label>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-emerald-500/20 rounded-lg text-white focus:outline-none focus:border-emerald-500/50 h-20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">内容</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-emerald-500/20 rounded-lg text-white focus:outline-none focus:border-emerald-500/50 h-48"
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
              <label className="block text-sm font-medium text-gray-300 mb-2">标签 (逗号分隔)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0f] border border-emerald-500/20 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
                placeholder="标签1, 标签2, 标签3"
              />
            </div>
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
              {note ? '保存' : '创建'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
