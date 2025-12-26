import { NextRequest, NextResponse } from 'next/server';
import { verifySession, extractTokenFromHeader, isTokenExpired } from '@/services/auth';
import { ErrorCode } from '@/types';

/**
 * GET /api/auth/verify
 * Verify session token and return user info
 * Requirements: 10.2, 10.3, 10.4
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.UNAUTHORIZED,
            message: 'No token provided',
          },
        },
        { status: 401 }
      );
    }

    // Check if token is expired (Requirements: 10.4)
    if (isTokenExpired(token)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.SESSION_EXPIRED,
            message: 'Session has expired. Please log in again.',
          },
        },
        { status: 401 }
      );
    }

    // Verify token
    const result = verifySession(token);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: result.payload?.userId,
        username: result.payload?.username,
        role: result.payload?.role,
      },
    });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'An unexpected error occurred',
        },
      },
      { status: 500 }
    );
  }
}
