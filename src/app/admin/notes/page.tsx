'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Note } from '@/types';
import AdminTable from '@/components/admin/AdminTable';
import NoteForm from '@/components/admin/NoteForm';

/**
 * Notes Management Page
 * CRUD operations for notes
 * Requirements: 10.1, 10.2
 */
export default function AdminNotesPage() {
  const searchParams = useSearchParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Note | null>(null);

  useEffect(() => {
    fetchNotes();
    if (searchParams.get('action') === 'new') {
      setShowForm(true);
    }
  }, [searchParams]);

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes?pageSize=100');
      const result = await response.json();
      if (result.success) {
        setNotes(result.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingNote(null);
    setShowForm(true);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleDelete = async (note: Note) => {
    setDeleteConfirm(note);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/notes/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        setNotes(notes.filter(n => n.id !== deleteConfirm.id));
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleFormSubmit = async (data: Partial<Note>) => {
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    try {
      if (editingNote) {
        const response = await fetch(`/api/notes/${editingNote.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(data),
        });
        if (response.ok) {
          const result = await response.json();
          setNotes(notes.map(n => n.id === editingNote.id ? result.data : n));
        }
      } else {
        const response = await fetch('/api/notes', {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
        });
        if (response.ok) {
          const result = await response.json();
          setNotes([result.data, ...notes]);
        }
      }
      setShowForm(false);
      setEditingNote(null);
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const columns = [
    { key: 'title', label: '标题' },
    { key: 'category', label: '分类' },
    {
      key: 'tags',
      label: '标签',
      render: (note: Note) => (
        <div className="flex flex-wrap gap-1">
          {note.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded">
              {tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="text-gray-500 text-xs">+{note.tags.length - 3}</span>
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: '创建时间',
      render: (note: Note) => new Date(note.createdAt).toLocaleDateString('zh-CN'),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">笔记管理</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          ➕ 新建笔记
        </button>
      </div>

      <AdminTable
        columns={columns}
        data={notes}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        keyField="id"
      />

      {/* Form Modal */}
      {showForm && (
        <NoteForm
          note={editingNote}
          onSubmit={handleFormSubmit}
          onCancel={() => { setShowForm(false); setEditingNote(null); }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0d0d14] border border-emerald-500/20 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">确认删除</h3>
            <p className="text-gray-400 mb-6">
              确定要删除笔记 &quot;{deleteConfirm.title}&quot; 吗？此操作不可撤销。
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
