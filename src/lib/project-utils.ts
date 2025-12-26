import { ProjectStatus } from '@/types';

/**
 * Get visual indicator class for project status
 * Requirements: 3.3
 */
export function getStatusIndicatorClass(status: ProjectStatus): string {
  switch (status) {
    case 'planning':
      return 'bg-blue-500';
    case 'in-progress':
      return 'bg-yellow-500';
    case 'completed':
      return 'bg-green-500';
    case 'paused':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
}

/**
 * Get human-readable status label
 * Requirements: 3.3
 */
export function getStatusLabel(status: ProjectStatus): string {
  switch (status) {
    case 'planning':
      return '规划中';
    case 'in-progress':
      return '进行中';
    case 'completed':
      return '已完成';
    case 'paused':
      return '已暂停';
    default:
      return '未知';
  }
}
