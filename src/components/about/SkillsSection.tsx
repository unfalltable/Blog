'use client';

interface SkillsSectionProps {
  skills: string[];
}

/**
 * SkillsSection component displays the blogger's skills
 * Requirements: 2.1
 */
export function SkillsSection({ skills }: SkillsSectionProps) {
  if (!skills || skills.length === 0) {
    return null;
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Skills
      </h2>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
