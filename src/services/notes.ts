import { Note, PaginatedResponse } from '@/types';
import { notesRepository } from './repositories';

// ============================================
// Notes Service
// CRUD operations with search and filter
// Requirements: 1.1, 1.2, 1.3, 1.4
// ============================================

export interface NotesQueryOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
}

/**
 * Generate a unique ID for new notes
 */
function generateId(): string {
  return `note_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Search notes by matching query in title, content, or tags
 * Requirements: 1.3
 */
export function matchesSearch(note: Note, query: string): boolean {
  const lowerQuery = query.toLowerCase();
  return (
    note.title.toLowerCase().includes(lowerQuery) ||
    note.content.toLowerCase().includes(lowerQuery) ||
    note.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Filter notes by category
 * Requirements: 1.4
 */
export function matchesCategory(note: Note, category: string): boolean {
  return note.category === category;
}

/**
 * Get all notes with optional pagination, search, and category filter
 * Requirements: 1.1, 1.3, 1.4
 */
export async function getNotes(
  options: NotesQueryOptions = {}
): Promise<PaginatedResponse<Note>> {
  const { page = 1, pageSize = 10, search, category } = options;

  let notes = await notesRepository.getAll();

  // Apply search filter
  if (search && search.trim()) {
    notes = notes.filter((note) => matchesSearch(note, search.trim()));
  }

  // Apply category filter
  if (category && category.trim()) {
    notes = notes.filter((note) => matchesCategory(note, category.trim()));
  }

  // Sort by creation date (newest first)
  notes.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Calculate pagination
  const total = notes.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedNotes = notes.slice(startIndex, startIndex + pageSize);

  return {
    data: paginatedNotes,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Get a single note by ID
 * Requirements: 1.2
 */
export async function getNoteById(id: string): Promise<Note | null> {
  return notesRepository.getById(id);
}

/**
 * Create a new note
 * Requirements: 1.1
 */
export async function createNote(
  data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Note> {
  const now = new Date().toISOString();
  const note: Note = {
    id: generateId(),
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  return notesRepository.create(note);
}

/**
 * Update an existing note
 * Requirements: 1.1
 */
export async function updateNote(
  id: string,
  data: Partial<Omit<Note, 'id' | 'createdAt'>>
): Promise<Note | null> {
  const existingNote = await notesRepository.getById(id);
  if (!existingNote) {
    return null;
  }

  const updates = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  return notesRepository.update(id, updates);
}

/**
 * Delete a note by ID
 * Requirements: 1.1
 */
export async function deleteNote(id: string): Promise<boolean> {
  return notesRepository.delete(id);
}

/**
 * Get all unique categories from notes
 */
export async function getCategories(): Promise<string[]> {
  const notes = await notesRepository.getAll();
  const categories = new Set(notes.map((note) => note.category));
  return Array.from(categories).sort();
}

/**
 * Search notes and return matching results
 * Requirements: 1.3
 */
export async function searchNotes(query: string): Promise<Note[]> {
  if (!query || !query.trim()) {
    return [];
  }

  const notes = await notesRepository.getAll();
  return notes.filter((note) => matchesSearch(note, query.trim()));
}

/**
 * Filter notes by category
 * Requirements: 1.4
 */
export async function filterByCategory(category: string): Promise<Note[]> {
  if (!category || !category.trim()) {
    return [];
  }

  const notes = await notesRepository.getAll();
  return notes.filter((note) => matchesCategory(note, category.trim()));
}
