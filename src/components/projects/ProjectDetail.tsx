'use client';

import Link from 'next/link';
import { Project } from '@/types';
import { getStatusIndicatorClass, getStatusLabel } from '@/lib/project-utils';
import { InterestButton } from './InterestButton';
import { ProjectComments } from './ProjectComments';

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
        className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mb-6"
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
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {project.name}
          </h1>
          <span
            className={`px-4 py-1 text-sm font-medium text-white rounded-full ${statusClass}`}
          >
            {statusLabel}
          </span>
        </div>

        <p className="text-lg text-gray-300 mb-4">
          {project.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
          <time dateTime={project.createdAt}>创建于 {formattedCreatedDate}</time>

          {project.createdAt !== project.updatedAt && (
            <time dateTime={project.updatedAt}>
              更新于 {formattedUpdatedDate}
            </time>
          )}
        </div>

        {/* Interest Button */}
        <InterestButton projectId={project.id} initialCount={project.interestCount || 0} />
      </header>

      {/* Progress Section */}
      <section className="mb-8 p-6 bg-gray-900/50 rounded-xl border border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-4">
          项目进度
        </h2>
        <div className="mb-2">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>完成度</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${
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
      </section>

      {/* Introduction Section */}
      {project.introduction && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            项目介绍
          </h2>
          <div className="prose prose-lg prose-invert max-w-none">
            {project.introduction.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-300">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Current State Section */}
      {project.currentState && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            当前状态
          </h2>
          <div className="p-4 bg-gray-900/50 rounded-xl border-l-4 border-blue-500">
            <div className="prose prose-lg prose-invert max-w-none">
              {project.currentState.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-2 text-gray-300">
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
          <h2 className="text-xl font-semibold text-white mb-4">
            未来展望
          </h2>
          <div className="p-4 bg-emerald-900/20 rounded-xl border-l-4 border-emerald-500">
            <div className="prose prose-lg prose-invert max-w-none">
              {project.prospects.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-2 text-gray-300">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Comments Section */}
      <ProjectComments projectId={project.id} />
    </article>
  );
}
