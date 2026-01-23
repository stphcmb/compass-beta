-- =============================================================================
-- ICP PHASE 0: Create Project Drafts Table
-- =============================================================================
-- Part of Compass v1 (ICP) - Integrated Content Platform
-- Tracks draft version history for each project
-- =============================================================================
-- Run this in Supabase SQL Editor AFTER 001_create_projects_table.sql
-- =============================================================================

-- Draft history table (tracks all versions)
CREATE TABLE IF NOT EXISTS project_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  content TEXT NOT NULL,
  word_count INTEGER,

  -- What triggered this version
  change_source TEXT,             -- 'generated', 'user_edit', 'regenerated', 'ai_suggestion'
  change_summary TEXT,            -- Optional: "Applied voice check suggestions"

  -- Snapshot of validation at this version
  voice_check_snapshot JSONB,
  canon_check_snapshot JSONB,

  created_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(project_id, version)
);

-- Add constraint for change_source values
ALTER TABLE project_drafts
ADD CONSTRAINT project_drafts_change_source_check
CHECK (change_source IS NULL OR change_source IN ('generated', 'user_edit', 'regenerated', 'ai_suggestion'));

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_project_drafts_project ON project_drafts(project_id);
CREATE INDEX IF NOT EXISTS idx_project_drafts_version ON project_drafts(project_id, version DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE project_drafts ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access drafts for their own projects
-- Uses a subquery to check project ownership
CREATE POLICY "Users can view own project drafts"
  ON project_drafts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_drafts.project_id
      AND projects.clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "Users can insert own project drafts"
  ON project_drafts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_drafts.project_id
      AND projects.clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "Users can update own project drafts"
  ON project_drafts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_drafts.project_id
      AND projects.clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "Users can delete own project drafts"
  ON project_drafts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_drafts.project_id
      AND projects.clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- =============================================================================
-- VERIFICATION: Check the table was created correctly
-- =============================================================================
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'project_drafts'
ORDER BY ordinal_position;

-- Verify foreign key constraint
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'project_drafts';
