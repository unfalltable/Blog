import { NextRequest, NextResponse } from 'next/server';
import { getResourceById, updateResource, deleteResource } from '@/services/resources';
import {
  extractTokenFromHeader,
  verifyToken,
  isAdmin,
} from '@/services/auth';
import { ErrorCode } from '@/types';

/**
 * GET /api/resources/[id]
 * Get a single resource by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resource = await getResourceById(id);

    if (!resource) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.NOT_FOUND,
            message: 'Resource not found',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: resource,
    });
  } catch (error) {
    console.error('Error fetching resource:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'Failed to fetch resource',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/resources/[id]
 * Update a resource (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();

    const resource = await updateResource(id, body);

    if (!resource) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.NOT_FOUND,
            message: 'Resource not found',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: resource,
    });
  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'Failed to update resource',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/resources/[id]
 * Delete a resource (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const success = await deleteResource(id);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.NOT_FOUND,
            message: 'Resource not found',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Resource deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'Failed to delete resource',
        },
      },
      { status: 500 }
    );
  }
}
