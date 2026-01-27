-- =============================================================================
-- ICP PHASE 0: Create Projects Table
-- =============================================================================
-- Part of Compass v1 (ICP) - Integrated Content Platform
-- Tracks content from brief to export
-- =============================================================================
-- Run this in Supabase SQL Editor
-- =============================================================================

-- Main projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,

  -- Brief
  title TEXT,
  format TEXT,                    -- 'blog', 'linkedin', 'memo', 'byline'
  audience TEXT,
  key_points JSONB,               -- ["point 1", "point 2"]
  additional_context TEXT,        -- Optional extra context
  content_domain TEXT,            -- 'ai_discourse', 'anduin_product', 'hybrid'

  -- Voice
  voice_profile_id UUID REFERENCES voice_profiles(id) ON DELETE SET NULL,

  -- Current draft (always latest version)
  current_draft TEXT,
  current_version INTEGER DEFAULT 0,
  word_count INTEGER,

  -- Validation results (JSONB for flexibility)
  last_voice_check JSONB,         -- { score, suggestions[], checked_at }
  last_canon_check JSONB,         -- { camps[], authors[], checked_at }
  last_brief_coverage JSONB,      -- { covered[], missing[], checked_at }

  -- Status
  status TEXT DEFAULT 'brief',    -- 'brief', 'draft', 'editing', 'complete'

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add constraint for format values
ALTER TABLE projects
ADD CONSTRAINT projects_format_check
CHECK (format IS NULL OR format IN ('blog', 'linkedin', 'memo', 'byline'));

-- Add constraint for content_domain values
ALTER TABLE projects
ADD CONSTRAINT projects_content_domain_check
CHECK (content_domain IS NULL OR content_domain IN ('ai_discourse', 'anduin_product', 'hybrid'));

-- Add constraint for status values
ALTER TABLE projects
ADD CONSTRAINT projects_status_check
CHECK (status IN ('brief', 'draft', 'editing', 'complete'));

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_updated ON projects(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_voice_profile ON projects(voice_profile_id);

-- Enable RLS (Row Level Security)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access their own projects
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_projects_updated_at();

-- =============================================================================
-- VERIFICATION: Check the table was created correctly
-- =============================================================================
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'projects'
ORDER BY ordinal_position;
