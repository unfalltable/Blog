import { Discussion, Reply, PaginatedResponse } from '@/types';
import { discussionsRepository, repliesRepository } from './repositories';

// ============================================
// Discussion Service
// CRUD operations with reply functionality and content filter
// Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
// ============================================

export interface DiscussionsQueryOptions {
  page?: number;
  pageSize?: number;
}

// ============================================
// Prohibited Content Filter
// Requirements: 7.5
// ============================================

const PROHIBITED_WORDS = [
  'spam',
  'scam',
  'hack',
  'illegal',
  'porn',
  'xxx',
  'casino',
  'gambling',
  'drugs',
  'violence',
];

/**
 * Check if content contains prohibited words
 * Requirements: 7.5
 */
export function containsProhibitedContent(content: string): boolean {
  const lowerContent = content.toLowerCase();
  return PROHIBITED_WORDS.some((word) => lowerContent.includes(word));
}

/**
 * Get the list of prohibited words (for testing)
 */
export function getProhibitedWords(): string[] {
  return [...PROHIBITED_WORDS];
}

// ============================================
// ID Generation
// ============================================

function generateDiscussionId(): string {
  return `disc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function generateReplyId(): string {
  return `reply_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// ============================================
// Discussion CRUD Operations
// ============================================

/**
 * Get all discussions sorted by recent activity
 * Requirements: 7.1
 */
export async function getDiscussions(
  options: DiscussionsQueryOptions = {}
): Promise<PaginatedResponse<Discussion>> {
  const { page = 1, pageSize = 10 } = options;

  let discussions = await discussionsRepository.getAll();

  // Sort by lastActivityAt (most recent first)
  // Requirements: 7.1
  discussions = sortDiscussionsByActivity(discussions);

  // Calculate pagination
  const total = discussions.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedDiscussions = discussions.slice(startIndex, startIndex + pageSize);

  return {
    data: paginatedDiscussions,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Sort discussions by lastActivityAt in descending order
 * Requirements: 7.1
 */
export function sortDiscussionsByActivity(discussions: Discussion[]): Discussion[] {
  return [...discussions].sort(
    (a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
  );
}

/**
 * Get a single discussion by ID
 * Requirements: 7.4
 */
export async function getDiscussionById(id: string): Promise<Discussion | null> {
  return discussionsRepository.getById(id);
}

/**
 * Get a discussion with its replies
 * Requirements: 7.4
 */
export async function getDiscussionWithReplies(
  id: string
): Promise<{ discussion: Discussion; replies: Reply[] } | null> {
  const discussion = await discussionsRepository.getById(id);
  if (!discussion) {
    return null;
  }

  const replies = await getRepliesByDiscussionId(id);
  return { discussion, replies };
}


/**
 * Create a new discussion topic
 * Requirements: 7.2, 7.5
 */
export async function createDiscussion(
  data: Omit<Discussion, 'id' | 'replyCount' | 'lastActivityAt' | 'createdAt'>
): Promise<Discussion> {
  // Check for prohibited content
  if (containsProhibitedContent(data.title) || containsProhibitedContent(data.content)) {
    throw new Error('Content contains prohibited words');
  }

  const now = new Date().toISOString();
  const discussion: Discussion = {
    id: generateDiscussionId(),
    ...data,
    replyCount: 0,
    lastActivityAt: now,
    createdAt: now,
  };

  return discussionsRepository.create(discussion);
}

/**
 * Update an existing discussion
 */
export async function updateDiscussion(
  id: string,
  data: Partial<Omit<Discussion, 'id' | 'createdAt'>>
): Promise<Discussion | null> {
  const existingDiscussion = await discussionsRepository.getById(id);
  if (!existingDiscussion) {
    return null;
  }

  // Check for prohibited content if title or content is being updated
  if (data.title && containsProhibitedContent(data.title)) {
    throw new Error('Content contains prohibited words');
  }
  if (data.content && containsProhibitedContent(data.content)) {
    throw new Error('Content contains prohibited words');
  }

  return discussionsRepository.update(id, data);
}

/**
 * Delete a discussion and all its replies
 */
export async function deleteDiscussion(id: string): Promise<boolean> {
  // First delete all replies for this discussion
  const replies = await repliesRepository.getAll();
  const remainingReplies = replies.filter((reply) => reply.discussionId !== id);
  await repliesRepository.replaceAll(remainingReplies);

  // Then delete the discussion
  return discussionsRepository.delete(id);
}

// ============================================
// Reply Operations
// Requirements: 7.3
// ============================================

/**
 * Get all replies for a discussion
 */
export async function getRepliesByDiscussionId(discussionId: string): Promise<Reply[]> {
  const replies = await repliesRepository.find(
    (reply) => reply.discussionId === discussionId
  );
  // Sort by creation date (oldest first for chronological order)
  return replies.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

/**
 * Add a reply to a discussion
 * Requirements: 7.3, 7.5
 */
export async function addReply(
  data: Omit<Reply, 'id' | 'createdAt'>
): Promise<Reply> {
  // Check for prohibited content
  if (containsProhibitedContent(data.content)) {
    throw new Error('Content contains prohibited words');
  }

  // Verify discussion exists
  const discussion = await discussionsRepository.getById(data.discussionId);
  if (!discussion) {
    throw new Error('Discussion not found');
  }

  const now = new Date().toISOString();
  const reply: Reply = {
    id: generateReplyId(),
    ...data,
    createdAt: now,
  };

  // Create the reply
  await repliesRepository.create(reply);

  // Update discussion's lastActivityAt and replyCount
  // Requirements: 7.3
  await discussionsRepository.update(discussion.id, {
    lastActivityAt: now,
    replyCount: discussion.replyCount + 1,
  });

  return reply;
}

/**
 * Delete a reply
 */
export async function deleteReply(replyId: string): Promise<boolean> {
  const reply = await repliesRepository.getById(replyId);
  if (!reply) {
    return false;
  }

  // Update discussion's reply count
  const discussion = await discussionsRepository.getById(reply.discussionId);
  if (discussion) {
    await discussionsRepository.update(discussion.id, {
      replyCount: Math.max(0, discussion.replyCount - 1),
    });
  }

  return repliesRepository.delete(replyId);
}

/**
 * Get reply by ID
 */
export async function getReplyById(id: string): Promise<Reply | null> {
  return repliesRepository.getById(id);
}
