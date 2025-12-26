import { Video, VideoType } from '@/types';
import { videosRepository } from './repositories';

// ============================================
// Videos Service
// CRUD operations with category and type handling
// Requirements: 5.1, 5.2, 5.3, 5.4
// ============================================

/**
 * Generate a unique ID for new videos
 */
function generateId(): string {
  return `video_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get all videos
 * Requirements: 5.1
 */
export async function getVideos(): Promise<Video[]> {
  const videos = await videosRepository.getAll();

  // Sort by creation date (newest first)
  videos.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return videos;
}

/**
 * Get videos by category
 * Requirements: 5.1
 */
export async function getVideosByCategory(category: string): Promise<Video[]> {
  if (!category || !category.trim()) {
    return getVideos();
  }

  const videos = await videosRepository.getAll();
  const filtered = videos.filter(
    (video) => video.category.toLowerCase() === category.toLowerCase().trim()
  );

  // Sort by creation date (newest first)
  filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return filtered;
}

/**
 * Get a single video by ID
 * Requirements: 5.2, 5.3
 */
export async function getVideoById(id: string): Promise<Video | null> {
  return videosRepository.getById(id);
}

/**
 * Create a new video
 * Requirements: 5.4
 */
export async function createVideo(
  data: Omit<Video, 'id' | 'createdAt'>
): Promise<Video> {
  const now = new Date().toISOString();
  const video: Video = {
    id: generateId(),
    ...data,
    createdAt: now,
  };

  return videosRepository.create(video);
}

/**
 * Update an existing video
 * Requirements: 5.4
 */
export async function updateVideo(
  id: string,
  data: Partial<Omit<Video, 'id' | 'createdAt'>>
): Promise<Video | null> {
  const existingVideo = await videosRepository.getById(id);
  if (!existingVideo) {
    return null;
  }

  return videosRepository.update(id, data);
}

/**
 * Delete a video by ID
 * Requirements: 5.4
 */
export async function deleteVideo(id: string): Promise<boolean> {
  return videosRepository.delete(id);
}

/**
 * Get all unique categories from videos
 * Requirements: 5.1
 */
export async function getCategories(): Promise<string[]> {
  const videos = await videosRepository.getAll();
  const categories = new Set(videos.map((video) => video.category));
  return Array.from(categories).sort();
}

/**
 * Check if video is embedded type
 * Requirements: 5.2, 5.4
 */
export function isEmbeddedVideo(video: Video): boolean {
  return video.type === 'embedded';
}

/**
 * Check if video is external type
 * Requirements: 5.3
 */
export function isExternalVideo(video: Video): boolean {
  return video.type === 'external';
}

/**
 * Get video routing info based on type
 * Requirements: 5.2, 5.3
 */
export function getVideoRouting(video: Video): {
  type: 'inline' | 'external';
  target: string;
  openInNewTab: boolean;
} {
  if (video.type === 'embedded') {
    return {
      type: 'inline',
      target: video.source,
      openInNewTab: false,
    };
  } else {
    return {
      type: 'external',
      target: video.source,
      openInNewTab: true,
    };
  }
}

/**
 * Filter videos by type
 * Requirements: 5.2, 5.3
 */
export async function filterByType(type: VideoType): Promise<Video[]> {
  const videos = await videosRepository.getAll();
  return videos.filter((video) => video.type === type);
}
