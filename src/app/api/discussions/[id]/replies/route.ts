import { NextRequest, NextResponse } from 'next/server';
import { addReply, getRepliesByDiscussionId, getDiscussionById } from '@/services/discussions';
import { ErrorCode } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/discussions/[id]/replies
 * Get all replies for a discussion
 * Requirements: 7.4
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // Check if discussion exists
    const discussion = await getDiscussionById(id);
    if (!discussion) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.NOT_FOUND,
            message: 'Discussion not found',
          },
        },
        { status: 404 }
      );
    }

    const replies = await getRepliesByDiscussionId(id);

    return NextResponse.json({
      success: true,
      data: replies,
    });
  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'Failed to fetch replies',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/discussions/[id]/replies
 * Add a reply to a discussion
 * Requirements: 7.3, 7.5
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, authorName, authorEmail } = body;

    // Validate required fields
    if (!content || !authorName || !authorEmail) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.MISSING_REQUIRED_FIELD,
            message: 'Content, author name, and email are required',
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

    const reply = await addReply({
      discussionId: id,
      content,
      authorName,
      authorEmail,
    });

    return NextResponse.json(
      {
        success: true,
        data: reply,
      },
      { status: 201 }
    );
  } catch (error) {
    // Check for specific errors
    if (error instanceof Error) {
      if (error.message === 'Content contains prohibited words') {
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
      if (error.message === 'Discussion not found') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: ErrorCode.NOT_FOUND,
              message: 'Discussion not found',
            },
          },
          { status: 404 }
        );
      }
    }

    console.error('Error adding reply:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'Failed to add reply',
        },
      },
      { status: 500 }
    );
  }
}
