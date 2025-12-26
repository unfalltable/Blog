import { NextRequest, NextResponse } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/services/projects';
import {
  extractTokenFromHeader,
  verifyToken,
  isAdmin,
} from '@/services/auth';
import { ErrorCode } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/projects/[id]
 * Get a single project by ID
 * Requirements: 3.2
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.NOT_FOUND,
            message: 'Project not found',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'Failed to fetch project',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/projects/[id]
 * Update a project (admin only)
 * Requirements: 3.2, 3.3
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
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
    const { name, description, introduction, progress, status, currentState, prospects } = body;

    // Validate progress if provided
    if (progress !== undefined && (progress < 0 || progress > 100)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: 'Progress must be between 0 and 100',
          },
        },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status !== undefined) {
      const validStatuses = ['planning', 'in-progress', 'completed', 'paused'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: ErrorCode.VALIDATION_ERROR,
              message: 'Invalid status value',
            },
          },
          { status: 400 }
        );
      }
    }

    const updatedProject = await updateProject(id, {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(introduction !== undefined && { introduction }),
      ...(progress !== undefined && { progress }),
      ...(status !== undefined && { status }),
      ...(currentState !== undefined && { currentState }),
      ...(prospects !== undefined && { prospects }),
    });

    if (!updatedProject) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.NOT_FOUND,
            message: 'Project not found',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'Failed to update project',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projects/[id]
 * Delete a project (admin only)
 * Requirements: 3.1
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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
    const deleted = await deleteProject(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.NOT_FOUND,
            message: 'Project not found',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'Failed to delete project',
        },
      },
      { status: 500 }
    );
  }
}
