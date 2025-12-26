import { Resource, ContactRequest, ContactRequestStatus, ErrorCode, AppError } from '@/types';
import { resourcesRepository, contactRequestsRepository } from './repositories';

// ============================================
// Resources Service
// Resource listing and filtering
// Requirements: 4.1, 4.2, 4.5
// ============================================

/**
 * Generate a unique ID for new resources
 */
function generateResourceId(): string {
  return `resource_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate a unique ID for new contact requests
 */
function generateContactRequestId(): string {
  return `contact_req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Get all resources
 * Requirements: 4.1
 */
export async function getResources(): Promise<Resource[]> {
  return resourcesRepository.getAll();
}

/**
 * Get resources filtered by type
 * Requirements: 4.1
 */
export async function getResourcesByType(type: Resource['type']): Promise<Resource[]> {
  const resources = await resourcesRepository.getAll();
  return resources.filter((resource) => resource.type === type);
}


/**
 * Get visible resources for visitors
 * Protected resources are hidden unless the visitor has an approved contact request
 * Requirements: 4.5
 */
export async function getVisibleResources(visitorEmail?: string): Promise<Resource[]> {
  const resources = await resourcesRepository.getAll();
  
  // If no visitor email, only return non-protected resources
  if (!visitorEmail) {
    return resources.filter((resource) => !resource.isProtected);
  }

  // Get approved contact requests for this visitor
  const approvedRequests = await contactRequestsRepository.find(
    (request) => 
      request.requesterEmail === visitorEmail && 
      request.status === 'approved'
  );
  
  const approvedResourceIds = new Set(approvedRequests.map((r) => r.resourceId));

  // Return non-protected resources and protected resources with approved requests
  return resources.filter(
    (resource) => !resource.isProtected || approvedResourceIds.has(resource.id)
  );
}

/**
 * Get a single resource by ID
 */
export async function getResourceById(id: string): Promise<Resource | null> {
  return resourcesRepository.getById(id);
}

/**
 * Create a new resource (admin only)
 */
export async function createResource(
  data: Omit<Resource, 'id'>
): Promise<Resource> {
  const resource: Resource = {
    id: generateResourceId(),
    ...data,
  };

  return resourcesRepository.create(resource);
}

/**
 * Update an existing resource (admin only)
 */
export async function updateResource(
  id: string,
  data: Partial<Omit<Resource, 'id'>>
): Promise<Resource | null> {
  const existingResource = await resourcesRepository.getById(id);
  if (!existingResource) {
    return null;
  }

  return resourcesRepository.update(id, data);
}

/**
 * Delete a resource (admin only)
 */
export async function deleteResource(id: string): Promise<boolean> {
  return resourcesRepository.delete(id);
}


// ============================================
// Contact Request Service
// Contact request submission and management
// Requirements: 4.2, 4.3, 4.4
// ============================================

export interface ContactRequestInput {
  resourceId: string;
  requesterName: string;
  requesterEmail: string;
  reason: string;
}

export interface ContactRequestValidationResult {
  valid: boolean;
  error?: AppError;
}

/**
 * Validate contact request data
 * Requirements: 4.3
 */
export function validateContactRequest(
  data: ContactRequestInput
): ContactRequestValidationResult {
  // Check required fields
  if (!data.requesterName || !data.requesterName.trim()) {
    return {
      valid: false,
      error: {
        code: ErrorCode.MISSING_REQUIRED_FIELD,
        message: 'Name is required',
        details: { field: 'requesterName' },
      },
    };
  }

  if (!data.requesterEmail || !data.requesterEmail.trim()) {
    return {
      valid: false,
      error: {
        code: ErrorCode.MISSING_REQUIRED_FIELD,
        message: 'Email is required',
        details: { field: 'requesterEmail' },
      },
    };
  }

  // Validate email format
  if (!isValidEmail(data.requesterEmail)) {
    return {
      valid: false,
      error: {
        code: ErrorCode.INVALID_EMAIL,
        message: 'Invalid email format',
        details: { field: 'requesterEmail' },
      },
    };
  }

  if (!data.reason || !data.reason.trim()) {
    return {
      valid: false,
      error: {
        code: ErrorCode.MISSING_REQUIRED_FIELD,
        message: 'Reason is required',
        details: { field: 'reason' },
      },
    };
  }

  if (!data.resourceId || !data.resourceId.trim()) {
    return {
      valid: false,
      error: {
        code: ErrorCode.MISSING_REQUIRED_FIELD,
        message: 'Resource ID is required',
        details: { field: 'resourceId' },
      },
    };
  }

  return { valid: true };
}

/**
 * Submit a contact request
 * Requirements: 4.2, 4.3
 */
export async function submitContactRequest(
  data: ContactRequestInput
): Promise<{ success: boolean; request?: ContactRequest; error?: AppError }> {
  // Validate input
  const validation = validateContactRequest(data);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Check if resource exists
  const resource = await resourcesRepository.getById(data.resourceId);
  if (!resource) {
    return {
      success: false,
      error: {
        code: ErrorCode.NOT_FOUND,
        message: 'Resource not found',
        details: { resourceId: data.resourceId },
      },
    };
  }

  // Check if there's already a pending request from this email for this resource
  const existingRequests = await contactRequestsRepository.find(
    (request) =>
      request.resourceId === data.resourceId &&
      request.requesterEmail === data.requesterEmail &&
      request.status === 'pending'
  );

  if (existingRequests.length > 0) {
    return {
      success: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'A pending request already exists for this resource',
      },
    };
  }

  // Create the contact request
  const contactRequest: ContactRequest = {
    id: generateContactRequestId(),
    resourceId: data.resourceId,
    requesterName: data.requesterName.trim(),
    requesterEmail: data.requesterEmail.trim().toLowerCase(),
    reason: data.reason.trim(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  await contactRequestsRepository.create(contactRequest);

  return { success: true, request: contactRequest };
}


/**
 * Get all contact requests (admin only)
 */
export async function getContactRequests(): Promise<ContactRequest[]> {
  const requests = await contactRequestsRepository.getAll();
  // Sort by creation date (newest first)
  return requests.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Get contact requests by status (admin only)
 */
export async function getContactRequestsByStatus(
  status: ContactRequestStatus
): Promise<ContactRequest[]> {
  const requests = await contactRequestsRepository.find(
    (request) => request.status === status
  );
  return requests.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Get a single contact request by ID
 */
export async function getContactRequestById(id: string): Promise<ContactRequest | null> {
  return contactRequestsRepository.getById(id);
}

/**
 * Update contact request status (approve/reject)
 * Requirements: 4.4
 */
export async function updateContactRequestStatus(
  id: string,
  status: ContactRequestStatus
): Promise<{ success: boolean; request?: ContactRequest; error?: AppError }> {
  const existingRequest = await contactRequestsRepository.getById(id);
  
  if (!existingRequest) {
    return {
      success: false,
      error: {
        code: ErrorCode.NOT_FOUND,
        message: 'Contact request not found',
      },
    };
  }

  const updatedRequest = await contactRequestsRepository.update(id, { status });
  
  if (!updatedRequest) {
    return {
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: 'Failed to update contact request',
      },
    };
  }

  return { success: true, request: updatedRequest };
}

/**
 * Delete a contact request (admin only)
 */
export async function deleteContactRequest(id: string): Promise<boolean> {
  return contactRequestsRepository.delete(id);
}

/**
 * Get contact requests for a specific resource
 */
export async function getContactRequestsForResource(
  resourceId: string
): Promise<ContactRequest[]> {
  return contactRequestsRepository.find(
    (request) => request.resourceId === resourceId
  );
}

/**
 * Check if a visitor has an approved request for a resource
 */
export async function hasApprovedRequest(
  resourceId: string,
  visitorEmail: string
): Promise<boolean> {
  const requests = await contactRequestsRepository.find(
    (request) =>
      request.resourceId === resourceId &&
      request.requesterEmail === visitorEmail.toLowerCase() &&
      request.status === 'approved'
  );
  return requests.length > 0;
}
