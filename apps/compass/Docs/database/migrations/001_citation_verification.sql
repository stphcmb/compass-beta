-- =============================================================================
-- CITATION VERIFICATION MVP - Database Migration
-- =============================================================================
-- Run this in Supabase SQL Editor
-- =============================================================================

-- Add citation status columns to camp_authors
ALTER TABLE camp_authors
ADD COLUMN IF NOT EXISTS citation_status TEXT
DEFAULT 'unchecked'
CHECK (citation_status IN ('unchecked', 'valid', 'broken', 'timeout', 'checking'));

ALTER TABLE camp_authors
ADD COLUMN IF NOT EXISTS citation_last_checked TIMESTAMPTZ;

ALTER TABLE camp_authors
ADD COLUMN IF NOT EXISTS citation_http_status INTEGER;

ALTER TABLE camp_authors
ADD COLUMN IF NOT EXISTS citation_response_time_ms INTEGER;

-- Index for efficient status queries
CREATE INDEX IF NOT EXISTS idx_camp_authors_citation_status
ON camp_authors(citation_status);

-- =============================================================================
-- VERIFICATION: Check the new columns exist
-- =============================================================================
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'camp_authors'
AND column_name LIKE 'citation%';
