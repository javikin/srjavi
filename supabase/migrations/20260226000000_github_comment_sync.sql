-- =============================================================================
-- Migration: GitHub Comment Sync Support
-- Created: 2026-02-26
-- Description: Adds columns to request_comments to support syncing GitHub issue
--              comments into the dashboard, and enables repo-scoped matching for
--              issue status updates.
-- =============================================================================

-- Add source column to distinguish dashboard vs GitHub-originated comments
ALTER TABLE public.request_comments
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'dashboard'
    CHECK (source IN ('dashboard', 'github'));

-- Add metadata column for extra context (GitHub author info, comment URL, etc.)
ALTER TABLE public.request_comments
  ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}';

-- Add github_comment_id for deduplication on re-delivery
ALTER TABLE public.request_comments
  ADD COLUMN IF NOT EXISTS github_comment_id bigint;

-- Allow author_id to be NULL for GitHub-sourced comments (no local profile)
ALTER TABLE public.request_comments
  ALTER COLUMN author_id DROP NOT NULL;

-- Unique index to prevent duplicate GitHub comments on re-delivery
CREATE UNIQUE INDEX IF NOT EXISTS idx_comments_github_comment_id
  ON public.request_comments (github_comment_id)
  WHERE github_comment_id IS NOT NULL;

COMMENT ON COLUMN public.request_comments.source IS
  'Origin of the comment: ''dashboard'' (created by a user in the app) or ''github'' (synced from a GitHub issue comment).';

COMMENT ON COLUMN public.request_comments.metadata IS
  'Arbitrary extra data. For GitHub comments: { "github_author": "login", "github_author_url": "...", "github_comment_url": "..." }';

COMMENT ON COLUMN public.request_comments.github_comment_id IS
  'GitHub comment ID used for deduplication. NULL for dashboard comments.';
