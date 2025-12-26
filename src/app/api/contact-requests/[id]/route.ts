import { NextRequest, NextResponse } from 'next/server';
import {
  getContactRequestById,
  updateContactRequestStatus,
  deleteContactRequest,
} from '@/services/resources';
import {
  extractTokenFromHeader,
  verifyToken,
  isAdmin,
} from '@/services/auth';
import { ErrorCode, ContactRequestStatus } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/contact-requests/[id]
 * Get a single contact request by ID (admin only)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
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
    const contactRequest = await getContactRequestById(id);

    if (!contactRequest) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.NOT_FOUND,
            message: 'Contact request not found',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: contactRequest,
    });
  } catch (error) {
    console.error('Error fetching contact request:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'Failed to fetch contact request',
        },
      },
      { status: 500 }
    );
  }
}


/**
 * PUT /api/contact-requests/[id]
 * Update contact request status (approve/reject) - admin only
 * Requirements: 4.4
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
    const { status } = body;

    // Validate status
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: 'Invalid status. Must be pending, approved, or rejected',
          },
        },
        { status: 400 }
      );
    }

    const result = await updateContactRequestStatus(id, status as ContactRequestStatus);

    if (!result.success) {
      const statusCode = result.error?.code === ErrorCode.NOT_FOUND ? 404 : 500;
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: statusCode }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.request,
      message: `Contact request ${status}`,
    });
  } catch (error) {
    console.error('Error updating contact request:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'Failed to update contact request',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/contact-requests/[id]
 * Delete a contact request (admin only)
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
    const deleted = await deleteContactRequest(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.NOT_FOUND,
            message: 'Contact request not found',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contact request deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting contact request:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'Failed to delete contact request',
        },
      },
      { status: 500 }
    );
  }
}
