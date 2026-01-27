-- STATUS: DEPRECATED - Superseded by UPDATE_LABELS_FINAL.sql
-- 
-- This is an earlier iteration of the taxonomy update. Use UPDATE_LABELS_FINAL.sql for the canonical version.
--
-- ============================================================================
-- Update Taxonomy to V2 - CORRECT VERSION for actual schema
-- Based on Docs/schema.sql and seed_from_mvp_database.sql
-- ============================================================================

-- STEP 1: Add 'label' column to camps table
-- ============================================================================
ALTER TABLE camps ADD COLUMN IF NOT EXISTS label TEXT;

-- STEP 2: Update existing camps with new intuitive labels
-- Match exact camp names from seed_from_mvp_database.sql
-- ============================================================================

-- Technology domain camps
UPDATE camps SET label = 'Scaling Will Deliver' WHERE name = 'Scaling Maximalists';
UPDATE camps SET label = 'Needs New Approaches' WHERE name = 'Grounding Realists';
UPDATE camps SET label = 'Safety Focus' WHERE name = 'Capabilities Realist with Safety Focus';

-- Society domain camps
UPDATE camps SET label = 'Democratize Fast' WHERE name = 'Tech Utopians';
UPDATE camps SET label = 'Iterate Responsibly' WHERE name = 'Tech Realists';
UPDATE camps SET label = 'Safety First' WHERE name = 'Ethical Stewards';

-- Business domain camps
UPDATE camps SET label = 'Technology Leads' WHERE name = 'Tech-First';
UPDATE camps SET label = 'People First' WHERE name = 'Human-Centric';
UPDATE camps SET label = 'Build Ecosystems' WHERE name = 'Platform/Ecosystem';

-- Workers domain camps
UPDATE camps SET label = 'Humans + AI Together' WHERE name = 'Human-AI Collaboration';
UPDATE camps SET label = 'Jobs Will Disappear' WHERE name = 'Displacement Realists';

-- Policy & Regulation domain camps
UPDATE camps SET label = 'Regulate Now' WHERE name = 'Regulatory Interventionists';
UPDATE camps SET label = 'Let Industry Lead' WHERE name = 'Innovation-First';
UPDATE camps SET label = 'Evolve Together' WHERE name = 'Adaptive Governance';

-- STEP 3: Set label = name for any camps without a label (fallback)
-- ============================================================================
UPDATE camps SET label = name WHERE label IS NULL OR label = '';

-- STEP 4: Verify the updates
-- ============================================================================
SELECT
  id,
  name as original_name,
  label as display_label,
  domain
FROM camps
ORDER BY domain, name;

-- Expected results should show:
-- Business domain: Tech-First → Technology Leads, Human-Centric → People First, etc.
-- Society domain: Ethical Stewards → Safety First, Tech Realists → Iterate Responsibly, etc.
-- Technology domain: Scaling Maximalists → Scaling Will Deliver, Grounding Realists → Needs New Approaches
-- Workers domain: Human-AI Collaboration → Humans + AI Together
-- Policy & Regulation domain: Regulatory Interventionists → Regulate Now, etc.
