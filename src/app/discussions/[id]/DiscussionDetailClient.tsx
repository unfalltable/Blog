'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Discussion, Reply } from '@/types';
import { DiscussionDetail } from '@/components/discussions';

interface DiscussionDetailClientProps {
  discussion: Discussion;
  initialReplies: Reply[];
}

/**
 * Client component wrapper for DiscussionDetail to handle reply refresh
 * Requirements: 7.3, 7.4
 */
export function DiscussionDetailClient({
  discussion,
  initialReplies,
}: DiscussionDetailClientProps) {
  const router = useRouter();
  const [replies, setReplies] = useState(initialReplies);
  const [currentDiscussion, setCurrentDiscussion] = useState(discussion);

  const handleReplyAdded = useCallback(async () => {
    // Refresh the page data
    try {
      const response = await fetch(`/api/discussions/${discussion.id}`);
      const data = await response.json();
      
      if (data.success) {
        setReplies(data.data.replies);
        setCurrentDiscussion(data.data.discussion);
      }
    } catch (error) {
      // Fallback to router refresh if fetch fails
      router.refresh();
    }
  }, [discussion.id, router]);

  return (
    <DiscussionDetail
      discussion={currentDiscussion}
      replies={replies}
      onReplyAdded={handleReplyAdded}
    />
  );
}
