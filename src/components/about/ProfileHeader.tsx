'use client';

import Image from 'next/image';
import { Profile } from '@/types';

interface ProfileHeaderProps {
  profile: Profile;
}

/**
 * ProfileHeader component displays the blogger's name, avatar, and bio
 * Requirements: 2.1
 */
export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      {/* Avatar */}
      <div className="flex-shrink-0">
        {profile.avatar ? (
          <Image
            src={profile.avatar}
            alt={profile.name || 'Profile avatar'}
            width={150}
            height={150}
            className="rounded-full object-cover border-4 border-blue-500 dark:border-blue-400"
          />
        ) : (
          <div className="w-[150px] h-[150px] rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-5xl text-white font-bold">
              {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
            </span>
          </div>
        )}
      </div>

      {/* Name and Bio */}
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {profile.name || 'Anonymous'}
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {profile.bio || 'No bio available.'}
        </p>
      </div>
    </div>
  );
}
