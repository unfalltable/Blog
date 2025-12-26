'use client';

import { useState, useEffect } from 'react';
import { Resource } from '@/types';
import { ResourceList, ContactRequestForm } from '@/components/resources';

/**
 * Resources page - displays available resources and contact information
 * Requirements: 4.1, 4.2, 4.3
 */
export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/resources');
      const data = await response.json();

      if (data.success) {
        setResources(data.data);
      } else {
        setError(data.error?.message || '加载资源失败');
      }
    } catch {
      setError('加载资源失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccess = (resourceId: string) => {
    const resource = resources.find((r) => r.id === resourceId);
    if (resource) {
      setSelectedResource(resource);
    }
  };

  const handleSubmitRequest = async (data: {
    resourceId: string;
    requesterName: string;
    requesterEmail: string;
    reason: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/contact-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        return { success: true };
      } else {
        return { success: false, error: result.error?.message };
      }
    } catch {
      return { success: false, error: '提交失败，请稍后重试' };
    }
  };

  const handleCloseForm = () => {
    setSelectedResource(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              加载失败
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {error}
            </p>
            <button
              onClick={fetchResources}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            资源交流
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            获取联系方式和交流群信息，与博主或其他访客建立联系
          </p>
        </header>

        <ResourceList
          resources={resources}
          onRequestAccess={handleRequestAccess}
        />

        {selectedResource && (
          <ContactRequestForm
            resource={selectedResource}
            onSubmit={handleSubmitRequest}
            onCancel={handleCloseForm}
          />
        )}
      </div>
    </div>
  );
}
