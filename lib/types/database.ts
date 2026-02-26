// =============================================================================
// Database Types — Client Dashboard
// Matches public schema in supabase/migrations/20260225000000_client_dashboard_schema.sql
// =============================================================================

// ---------------------------------------------------------------------------
// Enums / Union Types
// ---------------------------------------------------------------------------

export type UserRole = 'admin' | 'client';

export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived';

export type BillingType = 'paid' | 'pro_bono';

export type MemberRole = 'owner' | 'viewer';

export type RequestType = 'bug' | 'feature' | 'improvement';

export type RequestStatus =
  | 'pending'
  | 'approved'
  | 'in_progress'
  | 'completed'
  | 'rejected';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

// ---------------------------------------------------------------------------
// Base Table Types
// ---------------------------------------------------------------------------

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  company: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: ProjectStatus;
  billing_type: BillingType;
  tech_stack: string[];
  github_repo_owner: string | null;
  github_repo_name: string | null;
  github_default_branch: string;
  website_url: string | null;
  monthly_credit_quota: number;
  current_period_start: string; // date as ISO string (YYYY-MM-DD)
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  profile_id: string;
  role: MemberRole;
  created_at: string;
}

export interface Request {
  id: string;
  project_id: string;
  submitted_by: string;
  type: RequestType;
  title: string;
  description: string;
  priority_preference: Priority;
  admin_priority: Priority | null;
  status: RequestStatus;
  rejection_reason: string | null;
  credit_cost: number;
  github_issue_number: number | null;
  github_issue_url: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface RequestComment {
  id: string;
  request_id: string;
  author_id: string;
  body: string;
  is_internal: boolean;
  created_at: string;
}

export interface RequestAttachment {
  id: string;
  request_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
  created_at: string;
}

export interface CreditAllocation {
  id: string;
  project_id: string;
  period_start: string; // date as ISO string (YYYY-MM-DD)
  quota: number;
  used: number;
  created_at: string;
}

export interface CreditTransaction {
  id: string;
  project_id: string;
  allocation_id: string;
  request_id: string | null;
  amount: number;       // positive = debit (consumption), negative = credit (refund)
  balance_after: number;
  description: string;
  created_by: string;
  created_at: string;
}

export interface WebhookEvent {
  id: string;
  github_delivery_id: string;
  event_type: string;
  action: string;
  payload: Record<string, unknown>;
  processed: boolean;
  processed_at: string | null;
  error: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  project_id: string | null;
  actor_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Extended / Composite Types
// ---------------------------------------------------------------------------

/** Project enriched with computed stats for dashboard listings. */
export interface ProjectWithStats extends Project {
  member_count: number;
  open_requests: number;
  credit_used: number;
  credit_quota: number;
}

/** Request enriched with related data for list/detail views. */
export interface RequestWithRelations extends Request {
  project_name: string;
  submitter_name: string;
  comment_count: number;
}

/** Snapshot of credit consumption for the current billing period. */
export interface CreditSummary {
  quota: number;
  used: number;
  remaining: number;
  percentage: number; // 0–100, representing the fraction of quota consumed
}
