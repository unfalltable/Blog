'use client';

import { useState } from 'react';
import { Resource, ResourceType } from '@/types';

interface ResourceFormProps {
  resource: Resource | null;
  onSubmit: (data: Partial<Resource>) => void;
  onCancel: () => void;
}

/**
 * Resource Form Component
 * Create/Edit form for resources
 * Requirements: 10.1, 10.2
 */
export default function ResourceForm({ resource, onSubmit, onCancel }: ResourceFormProps) {
  const [formData, setFormData] = useState({
    name: resource?.name || '',
    type: resource?.type || 'contact' as ResourceType,
    description: resource?.description || '',
    value: resource?.value || '',
    isProtected: resource?.isProtected || false,
    attribution: resource?.attribution || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d0d14] border border-emerald-500/20 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-white mb-6">
          {resource ? '编辑资源' : '新建资源'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-emerald-500/20 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">类型</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ResourceType })}
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-emerald-500/20 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="contact">联系方式</option>
              <option value="group">群组</option>
              <option value="third-party">第三方</option>
            </select>
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

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">值 (链接/联系方式)</label>
            <input
              type="text"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-emerald-500/20 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
              required
            />
          </div>

          {formData.type === 'third-party' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">来源归属</label>
              <input
                type="text"
                value={formData.attribution}
                onChange={(e) => setFormData({ ...formData, attribution: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0f] border border-emerald-500/20 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          )}

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isProtected"
              checked={formData.isProtected}
              onChange={(e) => setFormData({ ...formData, isProtected: e.target.checked })}
              className="w-4 h-4 accent-emerald-500"
            />
            <label htmlFor="isProtected" className="text-sm text-gray-300">
              需要申请才能查看
            </label>
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
              {resource ? '保存' : '创建'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
