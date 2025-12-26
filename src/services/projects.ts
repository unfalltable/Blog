import { Project, ProjectStatus } from '@/types';
import { projectsRepository } from './repositories';

// Re-export utility functions for backward compatibility
export { getStatusIndicatorClass, getStatusLabel } from '@/lib/project-utils';

// ============================================
// Projects Service
// CRUD operations with status management
// Requirements: 3.1, 3.2, 3.3
// ============================================

/**
 * Generate a unique ID for new projects
 */
function generateId(): string {
  return `project_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get all projects
 * Requirements: 3.1
 */
export async function getProjects(): Promise<Project[]> {
  const projects = await projectsRepository.getAll();
  
  // Sort by creation date (newest first)
  projects.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  return projects;
}

/**
 * Get a single project by ID
 * Requirements: 3.2
 */
export async function getProjectById(id: string): Promise<Project | null> {
  return projectsRepository.getById(id);
}

/**
 * Create a new project
 * Requirements: 3.1
 */
export async function createProject(
  data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Project> {
  const now = new Date().toISOString();
  const project: Project = {
    id: generateId(),
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  return projectsRepository.create(project);
}

/**
 * Update an existing project
 * Requirements: 3.2
 */
export async function updateProject(
  id: string,
  data: Partial<Omit<Project, 'id' | 'createdAt'>>
): Promise<Project | null> {
  const existingProject = await projectsRepository.getById(id);
  if (!existingProject) {
    return null;
  }

  const updates = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  return projectsRepository.update(id, updates);
}

/**
 * Delete a project by ID
 * Requirements: 3.1
 */
export async function deleteProject(id: string): Promise<boolean> {
  return projectsRepository.delete(id);
}

/**
 * Update project status
 * Requirements: 3.3
 */
export async function updateProjectStatus(
  id: string,
  status: ProjectStatus
): Promise<Project | null> {
  return updateProject(id, { status });
}

/**
 * Filter projects by status
 */
export async function filterByStatus(status: ProjectStatus): Promise<Project[]> {
  const projects = await projectsRepository.getAll();
  return projects.filter((project) => project.status === status);
}
