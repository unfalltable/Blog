import { NextRequest, NextResponse } from 'next/server';
import { getDiscussions, createDiscussion } from '@/services/discussions';
import { ErrorCode } from '@/types';

/**
 * GET /api/discussions
 * List discussions sorted by recent activity
 * Requirements: 7.1, 7.4
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

    const result = await getDiscussions({ page, pageSize });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'Failed to fetch discussions',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/discussions
 * Create a new discussion topic
 * Requirements: 7.2, 7.5
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, authorName, authorEmail } = body;

    // Validate required fields
    if (!title || !content || !authorName || !authorEmail) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.MISSING_REQUIRED_FIELD,
            message: 'Title, content, author name, and email are required',
          },
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authorEmail)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.INVALID_EMAIL,
            message: 'Invalid email format',
          },
        },
        { status: 400 }
      );
    }

    const discussion = await createDiscussion({
      title,
      content,
      authorName,
      authorEmail,
    });

    return NextResponse.json(
      {
        success: true,
        data: discussion,
      },
      { status: 201 }
    );
  } catch (error) {
    // Check for prohibited content error
    if (error instanceof Error && error.message === 'Content contains prohibited words') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.PROHIBITED_CONTENT,
            message: 'Your submission contains prohibited content',
          },
        },
        { status: 400 }
      );
    }

    console.error('Error creating discussion:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'Failed to create discussion',
        },
      },
      { status: 500 }
    );
  }
}
