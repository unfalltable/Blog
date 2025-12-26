import { NextRequest, NextResponse } from 'next/server';
import { getResources, getVisibleResources, createResource } from '@/services/resources';
import {
  extractTokenFromHeader,
  verifyToken,
  isAdmin,
} from '@/services/auth';
import { ErrorCode } from '@/types';

/**
 * GET /api/resources
 * List resources (public endpoint, but protected resources are filtered)
 * Requirements: 4.1, 4.5
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const visitorEmail = searchParams.get('email') || undefined;
    const showAll = searchParams.get('all') === 'true';

    // Check if admin is requesting all resources
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (token && showAll) {
      const verifyResult = verifyToken(token);
      if (verifyResult.success && verifyResult.payload && isAdmin(verifyResult.payload)) {
        // Admin can see all resources
        const resources = await getResources();
        return NextResponse.json({
          success: true,
          data: resources,
        });
      }
    }

    // For visitors, filter based on protection status and approved requests
    const resources = await getVisibleResources(visitorEmail);

    return NextResponse.json({
      success: true,
      data: resources,
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'Failed to fetch resources',
        },
      },
      { status: 500 }
    );
  }
}


/**
 * POST /api/resources
 * Create a new resource (admin only)
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
    const { type, name, description, value, isProtected, attribution } = body;

    // Validate required fields
    if (!type || !name || !value) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.MISSING_REQUIRED_FIELD,
            message: 'Type, name, and value are required',
          },
        },
        { status: 400 }
      );
    }

    // Validate type
    if (!['contact', 'group', 'third-party'].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: 'Invalid resource type',
          },
        },
        { status: 400 }
      );
    }

    const resource = await createResource({
      type,
      name,
      description: description || '',
      value,
      isProtected: isProtected ?? false,
      attribution,
    });

    return NextResponse.json(
      {
        success: true,
        data: resource,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'Failed to create resource',
        },
      },
      { status: 500 }
    );
  }
}
