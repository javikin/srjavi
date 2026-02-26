-- =============================================================================
-- Migration: Client Dashboard Schema
-- Created: 2026-02-25
-- Description: Creates all tables, indexes, RLS policies, and triggers for the
--              client management dashboard (admin + client portal).
-- =============================================================================

-- =============================================================================
-- 1. HELPER FUNCTIONS
-- =============================================================================

-- Function: automatically update updated_at on row modification
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.handle_updated_at() IS
  'Trigger function that sets updated_at to now() on every UPDATE.';

-- Function: create a profiles row when a new auth.users row is inserted
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_app_meta_data ->> 'role', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_new_user() IS
  'Trigger function that creates a profiles row when a new user signs up or is invited via Supabase Auth.';

-- Helper: check if the current JWT has admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION public.is_admin() IS
  'Returns true if the current authenticated user has the admin role in app_metadata.';

-- Helper: check if the current user is a member of a given project
CREATE OR REPLACE FUNCTION public.is_project_member(p_project_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_id = p_project_id
      AND profile_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION public.is_project_member(uuid) IS
  'Returns true if the current authenticated user is a member of the specified project.';

-- Helper: check if the current user is an owner member of a given project
CREATE OR REPLACE FUNCTION public.is_project_owner(p_project_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_id = p_project_id
      AND profile_id = auth.uid()
      AND role = 'owner'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION public.is_project_owner(uuid) IS
  'Returns true if the current authenticated user is an owner-level member of the specified project.';


-- =============================================================================
-- 2. TABLES
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Table: profiles
-- Extends auth.users with application-specific data.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text        NOT NULL,
  full_name   text        NOT NULL,
  avatar_url  text,
  role        text        NOT NULL DEFAULT 'client'
                          CHECK (role IN ('admin', 'client')),
  company     text,
  phone       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS
  'Application profiles extending auth.users. Contains display name, role, and contact info.';

-- ---------------------------------------------------------------------------
-- Table: projects
-- Core entity representing a client project.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                    text        NOT NULL,
  slug                    text        NOT NULL UNIQUE,
  description             text,
  status                  text        NOT NULL DEFAULT 'active'
                                      CHECK (status IN ('active', 'paused', 'completed', 'archived')),
  billing_type            text        NOT NULL DEFAULT 'paid'
                                      CHECK (billing_type IN ('paid', 'pro_bono')),
  tech_stack              text[]      DEFAULT '{}',
  github_repo_owner       text,
  github_repo_name        text,
  github_default_branch   text        DEFAULT 'main',
  website_url             text,
  monthly_credit_quota    integer     NOT NULL DEFAULT 10,
  current_period_start    date        NOT NULL DEFAULT date_trunc('month', now())::date,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now(),

  -- Both GitHub fields must be set together or both null
  CONSTRAINT github_repo_both_or_none
    CHECK (
      (github_repo_owner IS NULL AND github_repo_name IS NULL)
      OR (github_repo_owner IS NOT NULL AND github_repo_name IS NOT NULL)
    )
);

COMMENT ON TABLE public.projects IS
  'Core project entity. Each project belongs to one or more clients and tracks credits, GitHub repo, and lifecycle status.';

-- ---------------------------------------------------------------------------
-- Table: project_members
-- Links clients to projects (many-to-many).
-- Admin sees all projects by role, not by membership.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_members (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  profile_id  uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role        text        NOT NULL DEFAULT 'viewer'
                          CHECK (role IN ('owner', 'viewer')),
  created_at  timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT uq_project_member UNIQUE (project_id, profile_id)
);

COMMENT ON TABLE public.project_members IS
  'Many-to-many link between profiles and projects. owner = primary contact who can submit requests; viewer = read-only stakeholder.';

-- ---------------------------------------------------------------------------
-- Table: requests
-- Bug reports, feature requests, and improvements submitted by clients.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.requests (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id            uuid        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  submitted_by          uuid        NOT NULL REFERENCES public.profiles(id),
  type                  text        NOT NULL
                                    CHECK (type IN ('bug', 'feature', 'improvement')),
  title                 text        NOT NULL,
  description           text        NOT NULL,
  priority_preference   text        NOT NULL DEFAULT 'medium'
                                    CHECK (priority_preference IN ('low', 'medium', 'high', 'critical')),
  admin_priority        text
                                    CHECK (admin_priority IS NULL OR admin_priority IN ('low', 'medium', 'high', 'critical')),
  status                text        NOT NULL DEFAULT 'pending'
                                    CHECK (status IN ('pending', 'approved', 'in_progress', 'completed', 'rejected')),
  rejection_reason      text,
  credit_cost           integer     NOT NULL DEFAULT 0,
  github_issue_number   integer,
  github_issue_url      text,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  completed_at          timestamptz
);

COMMENT ON TABLE public.requests IS
  'Client-submitted requests (bugs, features, improvements). Tracks lifecycle from pending through completion, credit cost, and optional GitHub issue link.';

-- ---------------------------------------------------------------------------
-- Table: request_attachments
-- Files attached to requests, stored in Supabase Storage.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.request_attachments (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id  uuid        NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  file_name   text        NOT NULL,
  file_url    text        NOT NULL,
  file_size   integer     NOT NULL,
  mime_type   text        NOT NULL,
  uploaded_by uuid        NOT NULL REFERENCES public.profiles(id),
  created_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.request_attachments IS
  'File attachments for requests. Actual files live in Supabase Storage bucket "request-attachments".';

-- ---------------------------------------------------------------------------
-- Table: request_comments
-- Threaded comments on requests, with support for admin-only internal notes.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.request_comments (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id  uuid        NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  author_id   uuid        NOT NULL REFERENCES public.profiles(id),
  body        text        NOT NULL,
  is_internal boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.request_comments IS
  'Comments on requests. When is_internal = true, the comment is only visible to admins (private notes).';

-- ---------------------------------------------------------------------------
-- Table: credit_allocations
-- Monthly credit budgets per project. One row per project per period.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.credit_allocations (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    uuid        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  period_start  date        NOT NULL,
  quota         integer     NOT NULL,
  used          integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT uq_credit_allocation_period UNIQUE (project_id, period_start)
);

COMMENT ON TABLE public.credit_allocations IS
  'Monthly credit budgets per project. quota defaults to project.monthly_credit_quota but can be overridden. Remaining credits = quota - used.';

-- ---------------------------------------------------------------------------
-- Table: credit_transactions
-- Audit log of every credit debit/credit.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      uuid        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  allocation_id   uuid        NOT NULL REFERENCES public.credit_allocations(id),
  request_id      uuid        REFERENCES public.requests(id) ON DELETE SET NULL,
  amount          integer     NOT NULL,
  balance_after   integer     NOT NULL,
  description     text        NOT NULL,
  created_by      uuid        NOT NULL REFERENCES public.profiles(id),
  created_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.credit_transactions IS
  'Immutable audit log of every credit movement. Positive amount = debit (consumption), negative = credit (refund). balance_after enables quick balance lookups.';

-- ---------------------------------------------------------------------------
-- Table: webhook_events
-- Raw GitHub webhook payloads for debugging and idempotency.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  github_delivery_id    text        NOT NULL UNIQUE,
  event_type            text        NOT NULL,
  action                text        NOT NULL,
  payload               jsonb       NOT NULL,
  processed             boolean     NOT NULL DEFAULT false,
  processed_at          timestamptz,
  error                 text,
  created_at            timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.webhook_events IS
  'Stores raw GitHub webhook payloads. github_delivery_id ensures idempotent processing. Unprocessed events can be retried.';

-- ---------------------------------------------------------------------------
-- Table: activity_log
-- General-purpose audit trail for admin dashboard analytics.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_log (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    uuid        REFERENCES public.projects(id) ON DELETE SET NULL,
  actor_id      uuid        NOT NULL REFERENCES public.profiles(id),
  action        text        NOT NULL,
  entity_type   text        NOT NULL,
  entity_id     uuid,
  metadata      jsonb       DEFAULT '{}',
  created_at    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.activity_log IS
  'General-purpose audit trail. Tracks who did what, on which entity, within which project. Used for admin dashboard analytics and activity feeds.';


-- =============================================================================
-- 3. INDEXES
-- =============================================================================

-- profiles: no extra indexes needed (PK is the only lookup)

-- projects
CREATE INDEX IF NOT EXISTS idx_projects_status
  ON public.projects (status);

-- project_members
-- Note: uq_project_member already creates a unique index on (project_id, profile_id)
CREATE INDEX IF NOT EXISTS idx_pm_profile
  ON public.project_members (profile_id);

-- requests
CREATE INDEX IF NOT EXISTS idx_requests_project
  ON public.requests (project_id);

CREATE INDEX IF NOT EXISTS idx_requests_status
  ON public.requests (status);

CREATE INDEX IF NOT EXISTS idx_requests_project_status
  ON public.requests (project_id, status);

CREATE INDEX IF NOT EXISTS idx_requests_submitted_by
  ON public.requests (submitted_by);

CREATE INDEX IF NOT EXISTS idx_requests_github
  ON public.requests (github_issue_number)
  WHERE github_issue_number IS NOT NULL;

-- request_comments
CREATE INDEX IF NOT EXISTS idx_comments_request
  ON public.request_comments (request_id);

-- request_attachments
CREATE INDEX IF NOT EXISTS idx_attachments_request
  ON public.request_attachments (request_id);

-- credit_allocations
-- Note: uq_credit_allocation_period already creates a unique index on (project_id, period_start)

-- credit_transactions
CREATE INDEX IF NOT EXISTS idx_ct_project
  ON public.credit_transactions (project_id);

CREATE INDEX IF NOT EXISTS idx_ct_allocation
  ON public.credit_transactions (allocation_id);

-- webhook_events
-- Note: github_delivery_id UNIQUE already creates a unique index
CREATE INDEX IF NOT EXISTS idx_we_unprocessed
  ON public.webhook_events (processed)
  WHERE processed = false;

-- activity_log
CREATE INDEX IF NOT EXISTS idx_al_project
  ON public.activity_log (project_id);

CREATE INDEX IF NOT EXISTS idx_al_created
  ON public.activity_log (created_at);


-- =============================================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_comments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log       ENABLE ROW LEVEL SECURITY;


-- =============================================================================
-- 5. RLS POLICIES
-- =============================================================================

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
CREATE POLICY "Admin reads all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "User reads own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "User updates own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin updates any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Allow the trigger function to insert profiles (runs as SECURITY DEFINER)
CREATE POLICY "Service inserts profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
CREATE POLICY "Admin full access to projects"
  ON public.projects FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Client reads own projects"
  ON public.projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.project_members
      WHERE project_members.project_id = projects.id
        AND project_members.profile_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- project_members
-- ---------------------------------------------------------------------------
CREATE POLICY "Admin full access to project_members"
  ON public.project_members FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Members read own project membership"
  ON public.project_members FOR SELECT
  USING (profile_id = auth.uid());

-- ---------------------------------------------------------------------------
-- requests
-- ---------------------------------------------------------------------------
CREATE POLICY "Admin full access to requests"
  ON public.requests FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Client reads own project requests"
  ON public.requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.project_members
      WHERE project_members.project_id = requests.project_id
        AND project_members.profile_id = auth.uid()
    )
  );

CREATE POLICY "Client creates requests on own project"
  ON public.requests FOR INSERT
  WITH CHECK (
    submitted_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.project_members
      WHERE project_members.project_id = requests.project_id
        AND project_members.profile_id = auth.uid()
        AND project_members.role = 'owner'
    )
  );

-- ---------------------------------------------------------------------------
-- request_attachments
-- ---------------------------------------------------------------------------
CREATE POLICY "Admin full access to request_attachments"
  ON public.request_attachments FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Client reads own project attachments"
  ON public.request_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.requests r
      JOIN public.project_members pm ON pm.project_id = r.project_id
      WHERE r.id = request_attachments.request_id
        AND pm.profile_id = auth.uid()
    )
  );

CREATE POLICY "Client creates attachments on own project requests"
  ON public.request_attachments FOR INSERT
  WITH CHECK (
    uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.requests r
      JOIN public.project_members pm ON pm.project_id = r.project_id
      WHERE r.id = request_attachments.request_id
        AND pm.profile_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- request_comments
-- ---------------------------------------------------------------------------
CREATE POLICY "Admin full access to request_comments"
  ON public.request_comments FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Client reads non-internal comments on own project"
  ON public.request_comments FOR SELECT
  USING (
    is_internal = false
    AND EXISTS (
      SELECT 1 FROM public.requests r
      JOIN public.project_members pm ON pm.project_id = r.project_id
      WHERE r.id = request_comments.request_id
        AND pm.profile_id = auth.uid()
    )
  );

CREATE POLICY "Client creates comments on own project requests"
  ON public.request_comments FOR INSERT
  WITH CHECK (
    author_id = auth.uid()
    AND is_internal = false
    AND EXISTS (
      SELECT 1 FROM public.requests r
      JOIN public.project_members pm ON pm.project_id = r.project_id
      WHERE r.id = request_comments.request_id
        AND pm.profile_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- credit_allocations
-- ---------------------------------------------------------------------------
CREATE POLICY "Admin full access to credit_allocations"
  ON public.credit_allocations FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Client reads own project credit allocations"
  ON public.credit_allocations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.project_members
      WHERE project_members.project_id = credit_allocations.project_id
        AND project_members.profile_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- credit_transactions
-- ---------------------------------------------------------------------------
CREATE POLICY "Admin full access to credit_transactions"
  ON public.credit_transactions FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Client reads own project credit transactions"
  ON public.credit_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.project_members
      WHERE project_members.project_id = credit_transactions.project_id
        AND project_members.profile_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- webhook_events
-- ---------------------------------------------------------------------------
CREATE POLICY "Admin only access to webhook_events"
  ON public.webhook_events FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Allow service role insert for webhook handler (runs without auth context)
CREATE POLICY "Service inserts webhook events"
  ON public.webhook_events FOR INSERT
  WITH CHECK (true);

-- Allow service role update for webhook processing
CREATE POLICY "Service updates webhook events"
  ON public.webhook_events FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- activity_log
-- ---------------------------------------------------------------------------
CREATE POLICY "Admin reads all activity"
  ON public.activity_log FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Client reads own project activity"
  ON public.activity_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.project_members
      WHERE project_members.project_id = activity_log.project_id
        AND project_members.profile_id = auth.uid()
    )
  );

-- Allow inserts from authenticated users and service role (activity is logged by API routes)
CREATE POLICY "Authenticated users insert activity"
  ON public.activity_log FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow service role insert (for webhook-triggered activity)
CREATE POLICY "Service inserts activity"
  ON public.activity_log FOR INSERT
  WITH CHECK (true);


-- =============================================================================
-- 6. TRIGGERS
-- =============================================================================

-- Trigger: create profiles row on auth.users INSERT
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger: auto-update updated_at on profiles
CREATE OR REPLACE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger: auto-update updated_at on projects
CREATE OR REPLACE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger: auto-update updated_at on requests
CREATE OR REPLACE TRIGGER set_requests_updated_at
  BEFORE UPDATE ON public.requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();


-- =============================================================================
-- 7. REALTIME PUBLICATION
-- =============================================================================
-- Enable realtime for tables that need live updates in the client portal and admin dashboard.

ALTER PUBLICATION supabase_realtime ADD TABLE public.requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.request_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.credit_allocations;
