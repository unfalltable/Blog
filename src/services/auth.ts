import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, ErrorCode, AppError } from '@/types';
import { usersRepository } from './repositories';

// ============================================
// Authentication Configuration
// ============================================

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h'; // Session expires after 24 hours
const SALT_ROUNDS = 10;

// ============================================
// Token Payload Interface
// ============================================

export interface TokenPayload {
  userId: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

// ============================================
// Authentication Result Types
// ============================================

export interface AuthResult {
  success: boolean;
  token?: string;
  user?: Omit<User, 'passwordHash'>;
  error?: AppError;
}

export interface VerifyResult {
  success: boolean;
  payload?: TokenPayload;
  error?: AppError;
}

// ============================================
// Password Hashing Functions
// Requirements: 10.5
// ============================================

/**
 * Hash a plaintext password using bcrypt
 * @param password - The plaintext password to hash
 * @returns The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a plaintext password against a hash
 * @param password - The plaintext password to verify
 * @param hash - The hash to verify against
 * @returns True if the password matches the hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ============================================
// JWT Token Functions
// Requirements: 10.2, 10.3, 10.4
// ============================================

/**
 * Generate a JWT token for a user
 * @param user - The user to generate a token for
 * @returns The JWT token string
 */
export function generateToken(user: User): string {
  const payload: TokenPayload = {
    userId: user.id,
    username: user.username,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode a JWT token
 * @param token - The JWT token to verify
 * @returns The verification result with payload or error
 */
export function verifyToken(token: string): VerifyResult {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return {
      success: true,
      payload,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        success: false,
        error: {
          code: ErrorCode.SESSION_EXPIRED,
          message: 'Session has expired. Please log in again.',
        },
      };
    }
    return {
      success: false,
      error: {
        code: ErrorCode.UNAUTHORIZED,
        message: 'Invalid token',
      },
    };
  }
}

/**
 * Check if a token is expired
 * @param token - The JWT token to check
 * @returns True if the token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as TokenPayload | null;
    if (!decoded || !decoded.exp) {
      return true;
    }
    // exp is in seconds, Date.now() is in milliseconds
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

/**
 * Get token expiration time in milliseconds
 * @param token - The JWT token
 * @returns Expiration timestamp in milliseconds, or null if invalid
 */
export function getTokenExpiration(token: string): number | null {
  try {
    const decoded = jwt.decode(token) as TokenPayload | null;
    if (!decoded || !decoded.exp) {
      return null;
    }
    return decoded.exp * 1000;
  } catch {
    return null;
  }
}

// ============================================
// Authentication Service
// Requirements: 10.1, 10.2, 10.3
// ============================================

/**
 * Authenticate a user with username and password
 * @param username - The username
 * @param password - The plaintext password
 * @returns Authentication result with token or error
 */
export async function login(username: string, password: string): Promise<AuthResult> {
  // Validate input
  if (!username || !password) {
    return {
      success: false,
      error: {
        code: ErrorCode.MISSING_REQUIRED_FIELD,
        message: 'Username and password are required',
      },
    };
  }

  // Find user by username
  const users = await usersRepository.find((user) => user.username === username);
  const user = users[0];

  if (!user) {
    return {
      success: false,
      error: {
        code: ErrorCode.INVALID_CREDENTIALS,
        message: 'Invalid username or password',
      },
    };
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, user.passwordHash);

  if (!isValidPassword) {
    return {
      success: false,
      error: {
        code: ErrorCode.INVALID_CREDENTIALS,
        message: 'Invalid username or password',
      },
    };
  }

  // Generate token
  const token = generateToken(user);

  // Return success with token and user info (excluding passwordHash)
  const { passwordHash: _hash, ...userWithoutPassword } = user;

  return {
    success: true,
    token,
    user: userWithoutPassword,
  };
}

/**
 * Logout - invalidate a session
 * Note: With JWT, logout is typically handled client-side by removing the token.
 * This function is provided for API consistency and potential future token blacklisting.
 * @param _token - The token to invalidate (for future blacklist implementation)
 * @returns Success result
 */
export function logout(_token: string): { success: boolean } {
  // With stateless JWT, logout is handled client-side
  // This could be extended to maintain a token blacklist if needed
  return { success: true };
}

/**
 * Verify a session token and return user info
 * @param token - The JWT token to verify
 * @returns Verification result with user payload or error
 */
export function verifySession(token: string): VerifyResult {
  return verifyToken(token);
}

// ============================================
// User Management Functions
// ============================================

/**
 * Create a new user with hashed password
 * @param username - The username
 * @param password - The plaintext password
 * @param role - The user role (default: 'visitor')
 * @returns The created user (without passwordHash) or error
 */
export async function createUser(
  username: string,
  password: string,
  role: 'admin' | 'visitor' = 'visitor'
): Promise<{ success: boolean; user?: Omit<User, 'passwordHash'>; error?: AppError }> {
  // Check if username already exists
  const existingUsers = await usersRepository.find((user) => user.username === username);
  if (existingUsers.length > 0) {
    return {
      success: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Username already exists',
      },
    };
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user: User = {
    id: generateUserId(),
    username,
    passwordHash,
    role,
    createdAt: new Date().toISOString(),
  };

  await usersRepository.create(user);

  // Return user without passwordHash
  const { passwordHash: _ph, ...userWithoutPassword } = user;

  return {
    success: true,
    user: userWithoutPassword,
  };
}

/**
 * Generate a unique user ID
 */
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// ============================================
// Middleware Helper Functions
// ============================================

/**
 * Extract token from Authorization header
 * @param authHeader - The Authorization header value
 * @returns The token or null
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) {
    return null;
  }

  // Support "Bearer <token>" format
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return authHeader;
}

/**
 * Check if a user has admin role
 * @param payload - The token payload
 * @returns True if user is admin
 */
export function isAdmin(payload: TokenPayload): boolean {
  return payload.role === 'admin';
}
