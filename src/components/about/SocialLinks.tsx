'use client';

import { SocialLink } from '@/types';

interface SocialLinksProps {
  socialLinks: SocialLink[];
}

// Icon mapping for common social platforms
const platformIcons: Record<string, string> = {
  github: '🐙',
  twitter: '🐦',
  linkedin: '💼',
  facebook: '📘',
  instagram: '📷',
  youtube: '📺',
  weibo: '🔴',
  wechat: '💬',
  email: '📧',
  website: '🌐',
  blog: '📝',
  telegram: '✈️',
  discord: '🎮',
};

/**
 * SocialLinks component displays the blogger's social media links
 * Requirements: 2.1
 */
export function SocialLinks({ socialLinks }: SocialLinksProps) {
  if (!socialLinks || socialLinks.length === 0) {
    return null;
  }

  const getIcon = (link: SocialLink): string => {
    // Use custom icon if provided
    if (link.icon) {
      return link.icon;
    }
    // Fall back to platform-based icon
    const platform = link.platform.toLowerCase();
    return platformIcons[platform] || '🔗';
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Connect
      </h2>
      <div className="flex flex-wrap gap-4">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group"
            title={link.platform}
          >
            <span className="text-xl">{getIcon(link)}</span>
            <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {link.platform}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
