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
      <article className="group p-6 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-emerald-500/50 transition-all duration-200">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">
            {project.name}
          </h2>
          <span
            className={`flex items-center px-3 py-1 text-xs font-medium text-white rounded-full ${statusClass}`}
          >
            {statusLabel}
          </span>
        </div>

        <p className="text-gray-400 line-clamp-2 mb-4">
          {project.description}
        </p>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>进度</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                project.progress === 100
                  ? 'bg-green-500'
                  : project.progress >= 50
                  ? 'bg-emerald-500'
                  : 'bg-yellow-500'
              }`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <time className="text-sm text-gray-500">
            创建于 {formattedDate}
          </time>
          {(project.interestCount ?? 0) > 0 && (
            <span className="flex items-center text-sm text-pink-400">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              {project.interestCount}
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}
