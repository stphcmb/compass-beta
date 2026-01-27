-- =============================================================================
-- ICP PHASE: Add Citations Column to Projects Table
-- =============================================================================
-- Adds citations array to persist expert citations in projects
-- Run this in Supabase SQL Editor
-- =============================================================================

-- Add citations column as JSONB array
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS citations JSONB DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN projects.citations IS 'Array of citations: [{id, authorName, authorSlug?, quote, position?, addedAt}]';

-- =============================================================================
-- VERIFICATION: Check the column was added
-- =============================================================================
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'projects' AND column_name = 'citations';
