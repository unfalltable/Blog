import { NextRequest, NextResponse } from 'next/server';
import { logout, extractTokenFromHeader } from '@/services/auth';
import { ErrorCode } from '@/types';

/**
 * POST /api/auth/logout
 * Logout user and invalidate session
 * Requirements: 10.1
 */
export async function POST(request: NextRequest) {
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

    // Perform logout
    const result = logout(token);

    return NextResponse.json({
      success: result.success,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
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
