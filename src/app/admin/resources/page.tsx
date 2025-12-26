'use client';

import { useEffect, useState } from 'react';
import { Resource } from '@/types';
import AdminTable from '@/components/admin/AdminTable';
import ResourceForm from '@/components/admin/ResourceForm';

/**
 * Resources Management Page
 * CRUD operations for resources
 * Requirements: 10.1, 10.2
 */
export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Resource | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources');
      const result = await response.json();
      if (result.success) {
        setResources(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingResource(null);
    setShowForm(true);
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setShowForm(true);
  };

  const handleDelete = async (resource: Resource) => {
    setDeleteConfirm(resource);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/resources/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        setResources(resources.filter(r => r.id !== deleteConfirm.id));
      }
    } catch (error) {
      console.error('Failed to delete resource:', error);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleFormSubmit = async (data: Partial<Resource>) => {
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    try {
      if (editingResource) {
        const response = await fetch(`/api/resources/${editingResource.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(data),
        });
        if (response.ok) {
          const result = await response.json();
          setResources(resources.map(r => r.id === editingResource.id ? result.data : r));
        }
      } else {
        const response = await fetch('/api/resources', {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
        });
        if (response.ok) {
          const result = await response.json();
          setResources([result.data, ...resources]);
        }
      }
      setShowForm(false);
      setEditingResource(null);
    } catch (error) {
      console.error('Failed to save resource:', error);
    }
  };

  const typeLabels: Record<string, string> = {
    'contact': '联系方式',
    'group': '群组',
    'third-party': '第三方',
  };

  const columns = [
    { key: 'name', label: '名称' },
    {
      key: 'type',
      label: '类型',
      render: (resource: Resource) => (
        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded">
          {typeLabels[resource.type]}
        </span>
      ),
    },
    { key: 'description', label: '描述' },
    {
      key: 'isProtected',
      label: '受保护',
      render: (resource: Resource) => (
        <span className={resource.isProtected ? 'text-yellow-400' : 'text-gray-400'}>
          {resource.isProtected ? '🔒 是' : '🔓 否'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">资源管理</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          ➕ 新建资源
        </button>
      </div>

      <AdminTable
        columns={columns}
        data={resources}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        keyField="id"
      />

      {showForm && (
        <ResourceForm
          resource={editingResource}
          onSubmit={handleFormSubmit}
          onCancel={() => { setShowForm(false); setEditingResource(null); }}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0d0d14] border border-emerald-500/20 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">确认删除</h3>
            <p className="text-gray-400 mb-6">
              确定要删除资源 &quot;{deleteConfirm.name}&quot; 吗？此操作不可撤销。
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
