'use client';

import { Resource } from '@/types';

interface ResourceCardProps {
  resource: Resource;
  onRequestAccess?: (resourceId: string) => void;
}

/**
 * ResourceCard component displays a single resource in a card format
 * Requirements: 4.1
 */
export function ResourceCard({ resource, onRequestAccess }: ResourceCardProps) {
  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'contact':
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'group':
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'third-party':
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
    }
  };

  const getTypeLabel = (type: Resource['type']) => {
    switch (type) {
      case 'contact':
        return '联系方式';
      case 'group':
        return '交流群';
      case 'third-party':
        return '第三方资源';
    }
  };

  const getTypeColor = (type: Resource['type']) => {
    switch (type) {
      case 'contact':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'group':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'third-party':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
    }
  };

  return (
    <article className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${getTypeColor(resource.type)}`}>
          {getTypeIcon(resource.type)}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {resource.name}
            </h3>
            <span className={`px-2 py-0.5 text-xs rounded-full ${getTypeColor(resource.type)}`}>
              {getTypeLabel(resource.type)}
            </span>
          </div>
          
          {resource.description && (
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              {resource.description}
            </p>
          )}
          
          {resource.isProtected ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                需要申请访问
              </span>
              {onRequestAccess && (
                <button
                  onClick={() => onRequestAccess(resource.id)}
                  className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  申请访问
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {resource.value}
              </span>
              {resource.attribution && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  (来源: {resource.attribution})
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
