import { NextRequest, NextResponse } from 'next/server';
import { getProjects, createProject } from '@/services/projects';
import {
  extractTokenFromHeader,
  verifyToken,
  isAdmin,
} from '@/services/auth';
import { ErrorCode } from '@/types';

/**
 * GET /api/projects
 * List all projects
 * Requirements: 3.1
 */
export async function GET() {
  try {
    const projects = await getProjects();

    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'Failed to fetch projects',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 * Create a new project (admin only)
 * Requirements: 3.1
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
    const { name, description, introduction, progress, status, currentState, prospects } = body;

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.MISSING_REQUIRED_FIELD,
            message: 'Name and description are required',
          },
        },
        { status: 400 }
      );
    }

    // Validate progress range
    const progressValue = progress ?? 0;
    if (progressValue < 0 || progressValue > 100) {
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

    // Validate status
    const validStatuses = ['planning', 'in-progress', 'completed', 'paused'];
    const statusValue = status || 'planning';
    if (!validStatuses.includes(statusValue)) {
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

    const project = await createProject({
      name,
      description,
      introduction: introduction || '',
      progress: progressValue,
      status: statusValue,
      currentState: currentState || '',
      prospects: prospects || '',
    });

    return NextResponse.json(
      {
        success: true,
        data: project,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'Failed to create project',
        },
      },
      { status: 500 }
    );
  }
}
