-- ============================================================================
-- STEP 1: Drop Old Tables
-- Run this first to clean up the old structure
-- ============================================================================

DROP TABLE IF EXISTS search_history CASCADE;
DROP TABLE IF EXISTS saved_searches CASCADE;
DROP TABLE IF EXISTS source_topics CASCADE;
DROP TABLE IF EXISTS topics CASCADE;
DROP TABLE IF EXISTS sources CASCADE;
DROP TABLE IF EXISTS camp_authors CASCADE;
DROP TABLE IF EXISTS camps CASCADE;
DROP TABLE IF EXISTS authors CASCADE;

-- Drop any old views
DROP VIEW IF EXISTS taxonomy_hierarchy CASCADE;
DROP VIEW IF EXISTS camps_by_domain CASCADE;
DROP VIEW IF EXISTS domain_summary CASCADE;

-- Drop old dimensions/domains if they exist
DROP TABLE IF EXISTS dimensions CASCADE;
DROP TABLE IF EXISTS domains CASCADE;

-- Success message
SELECT 'Old tables dropped successfully' AS status;
