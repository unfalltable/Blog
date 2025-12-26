import { notFound } from 'next/navigation';
import { getProjectById } from '@/services/projects';
import { ProjectDetail } from '@/components/projects';
import { Metadata } from 'next';

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Project detail page - displays full content of a single project
 * Requirements: 3.2
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProjectDetail project={project} />
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return {
      title: '项目未找到 - 个人博客',
    };
  }

  return {
    title: `${project.name} - 个人博客`,
    description: project.description,
  };
}
