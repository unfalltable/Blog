import { Metadata } from 'next';
import { getProfile } from '@/services/profile';
import {
  ProfileHeader,
  SkillsSection,
  ExperienceTimeline,
  SocialLinks,
} from '@/components/about';

export const metadata: Metadata = {
  title: 'About - Personal Blog',
  description: 'Learn more about the blogger, their skills, and experience.',
};

/**
 * About page displays the blogger's profile information
 * Requirements: 2.1, 2.2, 2.3
 */
export default async function AboutPage() {
  const profile = await getProfile();

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Profile Not Found
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              The profile information is not available yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header with Avatar and Bio */}
        <ProfileHeader profile={profile} />

        {/* Skills Section */}
        <SkillsSection skills={profile.skills} />

        {/* Experience Timeline */}
        <ExperienceTimeline experience={profile.experience} />

        {/* Social Links */}
        <SocialLinks socialLinks={profile.socialLinks} />
      </div>
    </div>
  );
}
