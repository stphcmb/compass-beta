-- =============================================================================
-- ICP PHASE 0: Create User Content Defaults Table
-- =============================================================================
-- Part of Compass v1 (ICP) - Integrated Content Platform
-- Stores user preferences for Content Builder defaults
-- =============================================================================
-- Run this in Supabase SQL Editor
-- =============================================================================

-- User content defaults table
CREATE TABLE IF NOT EXISTS user_content_defaults (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL UNIQUE,

  -- Default values for Content Builder
  default_format TEXT,              -- 'blog', 'linkedin', 'memo', 'byline'
  default_audience TEXT,            -- e.g., "Tech executives"
  default_content_domain TEXT,      -- 'ai_discourse', 'anduin_product', 'hybrid'
  default_voice_profile_id UUID REFERENCES voice_profiles(id) ON DELETE SET NULL,

  -- Additional preferences (for future use)
  preferences JSONB DEFAULT '{}',   -- Extensible preferences object

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add constraint for default_format values
ALTER TABLE user_content_defaults
ADD CONSTRAINT user_content_defaults_format_check
CHECK (default_format IS NULL OR default_format IN ('blog', 'linkedin', 'memo', 'byline'));

-- Add constraint for default_content_domain values
ALTER TABLE user_content_defaults
ADD CONSTRAINT user_content_defaults_domain_check
CHECK (default_content_domain IS NULL OR default_content_domain IN ('ai_discourse', 'anduin_product', 'hybrid'));

-- Index for user lookup
CREATE INDEX IF NOT EXISTS idx_user_content_defaults_user ON user_content_defaults(clerk_user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE user_content_defaults ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access their own defaults
CREATE POLICY "Users can view own defaults"
  ON user_content_defaults FOR SELECT
  USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own defaults"
  ON user_content_defaults FOR INSERT
  WITH CHECK (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own defaults"
  ON user_content_defaults FOR UPDATE
  USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete own defaults"
  ON user_content_defaults FOR DELETE
  USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_content_defaults_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS user_content_defaults_updated_at ON user_content_defaults;
CREATE TRIGGER user_content_defaults_updated_at
  BEFORE UPDATE ON user_content_defaults
  FOR EACH ROW
  EXECUTE FUNCTION update_user_content_defaults_updated_at();

-- =============================================================================
-- VERIFICATION: Check the table was created correctly
-- =============================================================================
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_content_defaults'
ORDER BY ordinal_position;
