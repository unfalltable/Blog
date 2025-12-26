'use client';

import { Resource } from '@/types';
import { ResourceCard } from './ResourceCard';

interface ResourceListProps {
  resources: Resource[];
  onRequestAccess?: (resourceId: string) => void;
}

/**
 * ResourceList component displays a list of resources grouped by type
 * Requirements: 4.1
 */
export function ResourceList({ resources, onRequestAccess }: ResourceListProps) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          暂无资源
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          目前没有可用的资源
        </p>
      </div>
    );
  }

  // Group resources by type
  const contactResources = resources.filter((r) => r.type === 'contact');
  const groupResources = resources.filter((r) => r.type === 'group');
  const thirdPartyResources = resources.filter((r) => r.type === 'third-party');

  return (
    <div className="space-y-8">
      {contactResources.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            联系方式
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {contactResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onRequestAccess={onRequestAccess}
              />
            ))}
          </div>
        </section>
      )}

      {groupResources.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            交流群
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {groupResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onRequestAccess={onRequestAccess}
              />
            ))}
          </div>
        </section>
      )}

      {thirdPartyResources.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            第三方资源
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {thirdPartyResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onRequestAccess={onRequestAccess}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
