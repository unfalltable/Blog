'use client';

import Link from 'next/link';
import { Project } from '@/types';
import { getStatusIndicatorClass, getStatusLabel } from '@/lib/project-utils';

interface ProjectCardProps {
  project: Project;
}

/**
 * ProjectCard component displays a single project in a card format with status indicator
 * Requirements: 3.1, 3.3
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const formattedDate = new Date(project.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const statusClass = getStatusIndicatorClass(project.status);
  const statusLabel = getStatusLabel(project.status);

  return (
    <Link href={`/projects/${project.id}`}>
      <article className="group p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {project.name}
          </h2>
          <span
            className={`flex items-center px-3 py-1 text-xs font-medium text-white rounded-full ${statusClass}`}
          >
            {statusLabel}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
          {project.description}
        </p>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>进度</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                project.progress === 100
                  ? 'bg-green-500'
                  : project.progress >= 50
                  ? 'bg-blue-500'
                  : 'bg-yellow-500'
              }`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <time className="block text-sm text-gray-500 dark:text-gray-400">
          创建于 {formattedDate}
        </time>
      </article>
    </Link>
  );
}
