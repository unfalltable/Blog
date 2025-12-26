// ============================================
// Shared Types and Enums
// ============================================

export type ProjectStatus = 'planning' | 'in-progress' | 'completed' | 'paused';
export type ResourceType = 'contact' | 'group' | 'third-party';
export type ContactRequestStatus = 'pending' | 'approved' | 'rejected';
export type VideoType = 'embedded' | 'external';
export type UserRole = 'admin' | 'visitor';

// ============================================
// Note Interface
// Requirements: 1.5, 1.6
// ============================================

export interface Note {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Project Interface
// Requirements: 3.4, 3.5
// ============================================

export interface Project {
  id: string;
  name: string;
  description: string;
  introduction: string;
  progress: number; // 0-100
  status: ProjectStatus;
  currentState: string;
  prospects: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Resource Interfaces
// ============================================

export interface Resource {
  id: string;
  type: ResourceType;
  name: string;
  description: string;
  value: string;
  isProtected: boolean;
  attribution?: string;
}

export interface ContactRequest {
  id: string;
  resourceId: string;
  requesterName: string;
  requesterEmail: string;
  reason: string;
  status: ContactRequestStatus;
  createdAt: string;
}


// ============================================
// Video Interface
// Requirements: 5.5, 5.6
// ============================================

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  type: VideoType;
  source: string; // URL or embed code
  author: string;
  createdAt: string;
}

// ============================================
// Blockchain Interfaces
// ============================================

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  lastUpdated: string;
}

export interface BlockchainNews {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
}

// ============================================
// Discussion Interfaces
// Requirements: 7.6, 7.7
// ============================================

export interface Discussion {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorEmail: string;
  replyCount: number;
  lastActivityAt: string;
  createdAt: string;
}

export interface Reply {
  id: string;
  discussionId: string;
  content: string;
  authorName: string;
  authorEmail: string;
  createdAt: string;
}

// ============================================
// User Interface
// ============================================

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
}

// ============================================
// Profile Interfaces
// ============================================

export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface Profile {
  name: string;
  avatar: string;
  bio: string;
  skills: string[];
  experience: Experience[];
  socialLinks: SocialLink[];
}

// ============================================
// Error Handling Types
// ============================================

export enum ErrorCode {
  // Validation errors (400)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_EMAIL = 'INVALID_EMAIL',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  PROHIBITED_CONTENT = 'PROHIBITED_CONTENT',

  // Authentication errors (401)
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  // Permission errors (403)
  FORBIDDEN = 'FORBIDDEN',

  // Resource errors (404)
  NOT_FOUND = 'NOT_FOUND',

  // Server errors (500)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
}

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

// ============================================
// API Response Types
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: AppError;
}
