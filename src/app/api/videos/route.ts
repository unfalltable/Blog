import { NextRequest, NextResponse } from 'next/server';
import { getVideos, getVideosByCategory, createVideo, getCategories } from '@/services/videos';
import {
  extractTokenFromHeader,
  verifyToken,
  isAdmin,
} from '@/services/auth';
import { ErrorCode } from '@/types';

/**
 * GET /api/videos
 * List videos with optional category filter
 * Requirements: 5.1
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;

    let videos;
    if (category) {
      videos = await getVideosByCategory(category);
    } else {
      videos = await getVideos();
    }

    const categories = await getCategories();

    return NextResponse.json({
      success: true,
      data: videos,
      categories,
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'Failed to fetch videos',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/videos
 * Create a new video (admin only)
 * Requirements: 5.4
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
    const { title, description, thumbnail, category, type, source, author } = body;

    // Validate required fields
    if (!title || !category || !type || !source) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.MISSING_REQUIRED_FIELD,
            message: 'Title, category, type, and source are required',
          },
        },
        { status: 400 }
      );
    }

    // Validate video type
    if (type !== 'embedded' && type !== 'external') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: 'Video type must be either "embedded" or "external"',
          },
        },
        { status: 400 }
      );
    }

    const video = await createVideo({
      title,
      description: description || '',
      thumbnail: thumbnail || '',
      category,
      type,
      source,
      author: author || '',
    });

    return NextResponse.json(
      {
        success: true,
        data: video,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'Failed to create video',
        },
      },
      { status: 500 }
    );
  }
}
