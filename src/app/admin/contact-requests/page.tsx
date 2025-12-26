'use client';

import { useEffect, useState } from 'react';
import { ContactRequest } from '@/types';
import AdminTable from '@/components/admin/AdminTable';

/**
 * Contact Requests Management Page
 * Approve/Reject contact requests
 * Requirements: 10.1, 10.2
 */
export default function AdminContactRequestsPage() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [actionConfirm, setActionConfirm] = useState<{ request: ContactRequest; action: 'approve' | 'reject' } | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/contact-requests', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setRequests(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (request: ContactRequest, action: 'approve' | 'reject') => {
    setActionConfirm({ request, action });
  };

  const confirmAction = async () => {
    if (!actionConfirm) return;
    
    const { request, action } = actionConfirm;
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/contact-requests/${request.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        setRequests(requests.map(r => 
          r.id === request.id ? { ...r, status: newStatus } : r
        ));
      }
    } catch (error) {
      console.error('Failed to update request:', error);
    } finally {
      setActionConfirm(null);
    }
  };

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status === filter);

  const statusColors: Record<string, string> = {
    'pending': 'text-yellow-400 bg-yellow-500/10',
    'approved': 'text-emerald-400 bg-emerald-500/10',
    'rejected': 'text-red-400 bg-red-500/10',
  };

  const statusLabels: Record<string, string> = {
    'pending': '待处理',
    'approved': '已批准',
    'rejected': '已拒绝',
  };

  const columns = [
    { key: 'requesterName', label: '申请人' },
    { key: 'requesterEmail', label: '邮箱' },
    {
      key: 'reason',
      label: '申请理由',
      render: (request: ContactRequest) => (
        <span className="line-clamp-2 max-w-xs">{request.reason}</span>
      ),
    },
    {
      key: 'status',
      label: '状态',
      render: (request: ContactRequest) => (
        <span className={`px-2 py-1 rounded text-xs ${statusColors[request.status]}`}>
          {statusLabels[request.status]}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: '申请时间',
      render: (request: ContactRequest) => new Date(request.createdAt).toLocaleDateString('zh-CN'),
    },
    {
      key: 'actions',
      label: '操作',
      render: (request: ContactRequest) => (
        request.status === 'pending' ? (
          <div className="flex space-x-2">
            <button
              onClick={(e) => { e.stopPropagation(); handleAction(request, 'approve'); }}
              className="px-3 py-1 text-sm text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors"
            >
              批准
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleAction(request, 'reject'); }}
              className="px-3 py-1 text-sm text-red-400 hover:bg-red-500/10 rounded transition-colors"
            >
              拒绝
            </button>
          </div>
        ) : (
          <span className="text-gray-500 text-sm">已处理</span>
        )
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">联系申请管理</h1>
        
        {/* Filter Tabs */}
        <div className="flex space-x-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filter === status
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {status === 'all' ? '全部' : statusLabels[status]}
              {status === 'pending' && (
                <span className="ml-1 px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                  {requests.filter(r => r.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <AdminTable
        columns={columns}
        data={filteredRequests}
        isLoading={isLoading}
        keyField="id"
      />

      {/* Action Confirmation */}
      {actionConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0d0d14] border border-emerald-500/20 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              确认{actionConfirm.action === 'approve' ? '批准' : '拒绝'}
            </h3>
            <p className="text-gray-400 mb-2">
              申请人: {actionConfirm.request.requesterName}
            </p>
            <p className="text-gray-400 mb-2">
              邮箱: {actionConfirm.request.requesterEmail}
            </p>
            <p className="text-gray-400 mb-6">
              理由: {actionConfirm.request.reason}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setActionConfirm(null)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  actionConfirm.action === 'approve'
                    ? 'bg-emerald-500 hover:bg-emerald-600'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {actionConfirm.action === 'approve' ? '批准' : '拒绝'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
