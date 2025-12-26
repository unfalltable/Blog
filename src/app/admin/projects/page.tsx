'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Project } from '@/types';
import AdminTable from '@/components/admin/AdminTable';
import ProjectForm from '@/components/admin/ProjectForm';

/**
 * Projects Management Page
 * CRUD operations for projects
 * Requirements: 10.1, 10.2
 */
export default function AdminProjectsPage() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
    if (searchParams.get('action') === 'new') {
      setShowForm(true);
    }
  }, [searchParams]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const result = await response.json();
      if (result.success) {
        setProjects(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async (project: Project) => {
    setDeleteConfirm(project);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/projects/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        setProjects(projects.filter(p => p.id !== deleteConfirm.id));
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleFormSubmit = async (data: Partial<Project>) => {
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    try {
      if (editingProject) {
        const response = await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(data),
        });
        if (response.ok) {
          const result = await response.json();
          setProjects(projects.map(p => p.id === editingProject.id ? result.data : p));
        }
      } else {
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
        });
        if (response.ok) {
          const result = await response.json();
          setProjects([result.data, ...projects]);
        }
      }
      setShowForm(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const statusColors: Record<string, string> = {
    'planning': 'text-yellow-400 bg-yellow-500/10',
    'in-progress': 'text-blue-400 bg-blue-500/10',
    'completed': 'text-emerald-400 bg-emerald-500/10',
    'paused': 'text-gray-400 bg-gray-500/10',
  };

  const statusLabels: Record<string, string> = {
    'planning': '规划中',
    'in-progress': '进行中',
    'completed': '已完成',
    'paused': '已暂停',
  };

  const columns = [
    { key: 'name', label: '项目名称' },
    {
      key: 'status',
      label: '状态',
      render: (project: Project) => (
        <span className={`px-2 py-1 rounded text-xs ${statusColors[project.status]}`}>
          {statusLabels[project.status]}
        </span>
      ),
    },
    {
      key: 'progress',
      label: '进度',
      render: (project: Project) => (
        <div className="flex items-center space-x-2">
          <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">{project.progress}%</span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: '创建时间',
      render: (project: Project) => new Date(project.createdAt).toLocaleDateString('zh-CN'),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">项目管理</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          ➕ 新建项目
        </button>
      </div>

      <AdminTable
        columns={columns}
        data={projects}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        keyField="id"
      />

      {showForm && (
        <ProjectForm
          project={editingProject}
          onSubmit={handleFormSubmit}
          onCancel={() => { setShowForm(false); setEditingProject(null); }}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0d0d14] border border-emerald-500/20 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">确认删除</h3>
            <p className="text-gray-400 mb-6">
              确定要删除项目 &quot;{deleteConfirm.name}&quot; 吗？此操作不可撤销。
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
