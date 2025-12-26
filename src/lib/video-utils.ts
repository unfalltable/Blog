import { Video, VideoType } from '@/types';

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
