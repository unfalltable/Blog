import { NextRequest, NextResponse } from 'next/server';
import { getNotes, createNote } from '@/services/notes';
import {
  extractTokenFromHeader,
  verifyToken,
  isAdmin,
} from '@/services/auth';
import { ErrorCode } from '@/types';

/**
 * GET /api/notes
 * List notes with pagination, search, and category filter
 * Requirements: 1.1, 1.3, 1.4
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;

    const result = await getNotes({ page, pageSize, search, category });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'Failed to fetch notes',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notes
 * Create a new note (admin only)
 * Requirements: 1.1
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.UNAUTHORIZED,
            message: 'Authentication required',
          },
        },
        { status: 401 }
      );
    }

    const verifyResult = verifyToken(token);
    if (!verifyResult.success || !verifyResult.payload) {
      return NextResponse.json(
        {
          success: false,
          error: verifyResult.error,
        },
        { status: 401 }
      );
    }

    // Check admin role
    if (!isAdmin(verifyResult.payload)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.FORBIDDEN,
            message: 'Admin access required',
          },
        },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { title, content, summary, category, tags } = body;

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.MISSING_REQUIRED_FIELD,
            message: 'Title, content, and category are required',
          },
        },
        { status: 400 }
      );
    }

    const note = await createNote({
      title,
      content,
      summary: summary || '',
      category,
      tags: tags || [],
    });

    return NextResponse.json(
      {
        success: true,
        data: note,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'Failed to create note',
        },
      },
      { status: 500 }
    );
  }
}
