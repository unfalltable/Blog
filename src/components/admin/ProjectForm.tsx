'use client';

import { useState } from 'react';
import { Project, ProjectStatus } from '@/types';

interface ProjectFormProps {
  project: Project | null;
  onSubmit: (data: Partial<Project>) => void;
  onCancel: () => void;
}

/**
 * Project Form Component
 * Create/Edit form for projects
 * Requirements: 10.1, 10.2
 */
export default function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    introduction: project?.introduction || '',
    progress: project?.progress || 0,
    status: project?.status || 'planning' as ProjectStatus,
    currentState: project?.currentState || '',
    prospects: project?.prospects || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d0d14] border border-emerald-500/20 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-white mb-6">
          {project ? '编辑项目' : '新建项目'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">项目名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-emerald-500/20 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">简介</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-emerald-500/20 rounded-lg text-white focus:outline-none focus:border-emerald-500/50 h-20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">详细介绍</label>
            <textarea
              value={formData.introduction}
              onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-emerald-500/20 rounded-lg text-white focus:outline-none focus:border-emerald-500/50 h-32"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">状态</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                className="w-full px-4 py-3 bg-[#0a0a0f] border border-emerald-500/20 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
              >
                <option value="planning">规划中</option>
                <option value="in-progress">进行中</option>
                <option value="completed">已完成</option>
                <option value="paused">已暂停</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">进度 ({formData.progress}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                className="w-full h-3 bg-[#0a0a0f] rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">当前状态</label>
            <textarea
              value={formData.currentState}
              onChange={(e) => setFormData({ ...formData, currentState: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-emerald-500/20 rounded-lg text-white focus:outline-none focus:border-emerald-500/50 h-20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">未来展望</label>
            <textarea
              value={formData.prospects}
              onChange={(e) => setFormData({ ...formData, prospects: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-emerald-500/20 rounded-lg text-white focus:outline-none focus:border-emerald-500/50 h-20"
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
              {project ? '保存' : '创建'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
