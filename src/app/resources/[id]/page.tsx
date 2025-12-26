import { notFound } from 'next/navigation';
import Link from 'next/link';
import { resourcesRepository } from '@/services/repositories';
import { CommentSection } from '@/components/common/CommentSection';

interface ResourceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const { id } = await params;
  const resource = await resourcesRepository.getById(id);

  if (!resource) {
    notFound();
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'contact':
        return '联系方式';
      case 'group':
        return '交流群';
      case 'third-party':
        return '第三方资源';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'contact':
        return 'bg-blue-500/20 text-blue-400';
      case 'group':
        return 'bg-green-500/20 text-green-400';
      case 'third-party':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/resources"
          className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mb-6"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          返回资源列表
        </Link>

        <article className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">{resource.name}</h1>
            <span className={`px-3 py-1 text-sm rounded-full ${getTypeColor(resource.type)}`}>
              {getTypeLabel(resource.type)}
            </span>
          </div>

          <p className="text-gray-300 mb-6">{resource.description}</p>

          {!resource.isProtected && (
            <div className="p-4 bg-gray-800/50 rounded-lg mb-6">
              <p className="text-sm text-gray-400 mb-1">资源内容</p>
              <p className="text-emerald-400 font-mono">{resource.value}</p>
            </div>
          )}

          {resource.isProtected && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg mb-6">
              <p className="text-amber-400 text-sm">
                此资源受保护，请在资源列表页面申请访问权限
              </p>
            </div>
          )}

          {resource.attribution && (
            <p className="text-sm text-gray-500">来源: {resource.attribution}</p>
          )}
        </article>

        {/* Comments Section */}
        <CommentSection targetType="resource" targetId={resource.id} />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: ResourceDetailPageProps) {
  const { id } = await params;
  const resource = await resourcesRepository.getById(id);

  if (!resource) {
    return { title: '资源未找到' };
  }

  return {
    title: `${resource.name} - 资源交流`,
    description: resource.description,
  };
}
