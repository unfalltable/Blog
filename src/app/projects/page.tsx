import { getProjects } from '@/services/projects';
import { ProjectList } from '@/components/projects';

/**
 * Projects page - displays list of all projects
 * Requirements: 3.1
 */
export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            项目
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            查看我正在进行和已完成的项目
          </p>
        </header>

        <ProjectList projects={projects} />
      </div>
    </div>
  );
}

export const metadata = {
  title: '项目 - 个人博客',
  description: '查看博主正在进行和已完成的项目',
};
