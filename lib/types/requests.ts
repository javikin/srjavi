// =============================================================================
// API Request / Response Types — Client Dashboard
// =============================================================================

import type { BillingType, MemberRole, Priority, RequestType } from './database';

// ---------------------------------------------------------------------------
// Generic API Response Wrapper
// ---------------------------------------------------------------------------

export interface ApiResponse<T = null> {
  data: T | null;
  error: string | null;
}

// ---------------------------------------------------------------------------
// Project Payloads
// ---------------------------------------------------------------------------

export interface CreateProjectPayload {
  name: string;
  slug: string;
  description?: string;
  status?: 'active' | 'paused' | 'completed' | 'archived';
  billing_type?: BillingType;
  tech_stack?: string[];
  github_repo_owner?: string;
  github_repo_name?: string;
  github_default_branch?: string;
  website_url?: string;
  monthly_credit_quota?: number;
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string;
  status?: 'active' | 'paused' | 'completed' | 'archived';
  billing_type?: BillingType;
  tech_stack?: string[];
  github_repo_owner?: string | null;
  github_repo_name?: string | null;
  github_default_branch?: string;
  website_url?: string | null;
  monthly_credit_quota?: number;
}

// ---------------------------------------------------------------------------
// Request Payloads
// ---------------------------------------------------------------------------

export interface CreateRequestPayload {
  project_id: string;
  type: RequestType;
  title: string;
  description: string;
  priority_preference?: Priority;
}

export interface UpdateRequestPayload {
  title?: string;
  description?: string;
  priority_preference?: Priority;
}

export interface ApproveRequestPayload {
  credit_cost: number;
  admin_priority: Priority;
  create_github_issue?: boolean;
}

export interface RejectRequestPayload {
  rejection_reason: string;
}

// ---------------------------------------------------------------------------
// Comment Payloads
// ---------------------------------------------------------------------------

export interface CreateCommentPayload {
  request_id: string;
  body: string;
  is_internal?: boolean;
}

// ---------------------------------------------------------------------------
// Credit Payloads
// ---------------------------------------------------------------------------

export interface AdjustCreditsPayload {
  /** Positive = add credits, negative = subtract credits. */
  amount: number;
  description: string;
}

// ---------------------------------------------------------------------------
// Client / Invite Payloads
// ---------------------------------------------------------------------------

export interface InviteClientPayload {
  email: string;
  full_name: string;
  project_id: string;
  role: MemberRole;
}
