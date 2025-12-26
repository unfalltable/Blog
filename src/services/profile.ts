import { Profile, Experience, SocialLink } from '@/types';
import { ProfileStorageService } from './storage';

// ============================================
// Profile Service
// Requirements: 2.1, 2.3
// ============================================

const profileStorage = new ProfileStorageService<Profile>('profile.json');

/**
 * Get the blogger's profile
 */
export async function getProfile(): Promise<Profile | null> {
  return profileStorage.get();
}

/**
 * Update the blogger's profile
 */
export async function updateProfile(profile: Profile): Promise<Profile> {
  return profileStorage.save(profile);
}

/**
 * Update specific profile fields
 */
export async function updateProfileFields(
  updates: Partial<Profile>
): Promise<Profile | null> {
  const currentProfile = await getProfile();
  if (!currentProfile) {
    return null;
  }

  const updatedProfile: Profile = {
    ...currentProfile,
    ...updates,
  };

  return profileStorage.save(updatedProfile);
}

/**
 * Get profile skills
 */
export async function getSkills(): Promise<string[]> {
  const profile = await getProfile();
  return profile?.skills || [];
}

/**
 * Get profile experience timeline
 */
export async function getExperience(): Promise<Experience[]> {
  const profile = await getProfile();
  return profile?.experience || [];
}

/**
 * Get profile social links
 */
export async function getSocialLinks(): Promise<SocialLink[]> {
  const profile = await getProfile();
  return profile?.socialLinks || [];
}

/**
 * Create default profile if none exists
 */
export async function ensureProfileExists(): Promise<Profile> {
  const profile = await getProfile();
  if (profile) {
    return profile;
  }

  const defaultProfile: Profile = {
    name: '',
    avatar: '',
    bio: '',
    skills: [],
    experience: [],
    socialLinks: [],
  };

  return profileStorage.save(defaultProfile);
}
