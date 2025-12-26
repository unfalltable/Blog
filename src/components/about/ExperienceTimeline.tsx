'use client';

import { Experience } from '@/types';

interface ExperienceTimelineProps {
  experience: Experience[];
}

/**
 * ExperienceTimeline component displays the blogger's career milestones
 * Requirements: 2.3
 */
export function ExperienceTimeline({ experience }: ExperienceTimelineProps) {
  if (!experience || experience.length === 0) {
    return null;
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Experience
      </h2>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600" />

        {/* Timeline items */}
        <div className="space-y-8">
          {experience.map((exp, index) => (
            <div key={index} className="relative pl-12">
              {/* Timeline dot */}
              <div className="absolute left-2 top-1 w-5 h-5 rounded-full bg-blue-500 border-4 border-white dark:border-gray-800 shadow" />

              {/* Content */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {exp.title}
                  </h3>
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    {exp.period}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium mt-1">
                  {exp.company}
                </p>
                {exp.description && (
                  <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
