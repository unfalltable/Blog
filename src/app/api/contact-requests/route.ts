import { NextRequest, NextResponse } from 'next/server';
import {
  submitContactRequest,
  getContactRequests,
  getContactRequestsByStatus,
} from '@/services/resources';
import {
  extractTokenFromHeader,
  verifyToken,
  isAdmin,
} from '@/services/auth';
import { ErrorCode, ContactRequestStatus } from '@/types';

/**
 * GET /api/contact-requests
 * List contact requests (admin only)
 * Requirements: 4.4
 */
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as ContactRequestStatus | null;

    let requests;
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      requests = await getContactRequestsByStatus(status);
    } else {
      requests = await getContactRequests();
    }

    return NextResponse.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error('Error fetching contact requests:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'Failed to fetch contact requests',
        },
      },
      { status: 500 }
    );
  }
}


/**
 * POST /api/contact-requests
 * Submit a contact request (public endpoint)
 * Requirements: 4.2, 4.3
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { resourceId, requesterName, requesterEmail, reason } = body;

    const result = await submitContactRequest({
      resourceId,
      requesterName,
      requesterEmail,
      reason,
    });

    if (!result.success) {
      const statusCode = result.error?.code === ErrorCode.NOT_FOUND ? 404 : 400;
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.request,
        message: 'Contact request submitted successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting contact request:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'Failed to submit contact request',
        },
      },
      { status: 500 }
    );
  }
}
