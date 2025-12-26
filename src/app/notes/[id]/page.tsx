import { notFound } from 'next/navigation';
import { getNoteById } from '@/services/notes';
import { NoteDetail } from '@/components/notes';
import { Metadata } from 'next';

interface NotePageProps {
  params: Promise<{ id: string }>;
}

/**
 * Note detail page - displays full content of a single note
 * Requirements: 1.2
 */
export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;
  const note = await getNoteById(id);

  if (!note) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <NoteDetail note={note} />
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: NotePageProps): Promise<Metadata> {
  const { id } = await params;
  const note = await getNoteById(id);

  if (!note) {
    return {
      title: '笔记未找到 - 个人博客',
    };
  }

  return {
    title: `${note.title} - 个人博客`,
    description: note.summary || note.content.substring(0, 160),
  };
}
