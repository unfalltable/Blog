'use client';

import Link from 'next/link';
import { Project } from '@/types';
import { getStatusIndicatorClass, getStatusLabel } from '@/lib/project-utils';

interface ProjectDetailProps {
  project: Project;
}

/**
 * ProjectDetail component displays the full content of a project
 * Requirements: 3.2
 */
export function ProjectDetail({ project }: ProjectDetailProps) {
  const formattedCreatedDate = new Date(project.createdAt).toLocaleDateString(
    'zh-CN',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  const formattedUpdatedDate = new Date(project.updatedAt).toLocaleDateString(
    'zh-CN',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  const statusClass = getStatusIndicatorClass(project.status);
  const statusLabel = getStatusLabel(project.status);

  return (
    <article className="max-w-4xl mx-auto">
      <Link
        href="/projects"
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6"
      >
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        返回项目列表
      </Link>

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {project.name}
          </h1>
          <span
            className={`px-4 py-1 text-sm font-medium text-white rounded-full ${statusClass}`}
          >
            {statusLabel}
          </span>
        </div>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
          {project.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <time dateTime={project.createdAt}>创建于 {formattedCreatedDate}</time>

          {project.createdAt !== project.updatedAt && (
            <time dateTime={project.updatedAt}>
              更新于 {formattedUpdatedDate}
            </time>
          )}
        </div>
      </header>

      {/* Progress Section */}
      <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          项目进度
        </h2>
        <div className="mb-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>完成度</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${
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
      </section>

      {/* Introduction Section */}
      {project.introduction && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            项目介绍
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {project.introduction.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-800 dark:text-gray-200">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Current State Section */}
      {project.currentState && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            当前状态
          </h2>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {project.currentState.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-2 text-gray-700 dark:text-gray-300">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Prospects Section */}
      {project.prospects && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            未来展望
          </h2>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {project.prospects.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-2 text-gray-700 dark:text-gray-300">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
