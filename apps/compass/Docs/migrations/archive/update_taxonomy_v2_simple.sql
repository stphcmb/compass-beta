-- STATUS: DEPRECATED - Superseded by UPDATE_LABELS_FINAL.sql
-- 
-- This is an earlier iteration of the taxonomy update. Use UPDATE_LABELS_FINAL.sql for the canonical version.
--
-- ============================================================================
-- Update Taxonomy to V2 - Simple Migration
-- Based on compass-implementation-spec-v2.md
-- ============================================================================

-- STEP 1: Add 'label' column to camps table
-- This allows us to have user-friendly display names while preserving original names
-- ============================================================================
ALTER TABLE camps ADD COLUMN IF NOT EXISTS label TEXT;

-- STEP 2: Update existing camps with new intuitive labels
-- ============================================================================

-- Technology / AI Progress camps
UPDATE camps SET label = 'Needs New Approaches' WHERE name = 'Grounding Realists';
UPDATE camps SET label = 'Scaling Will Deliver' WHERE name = 'Scaling Maximalists';

-- Society camps
UPDATE camps SET label = 'Safety First' WHERE name = 'Ethical Stewards';
UPDATE camps SET label = 'Iterate Responsibly' WHERE name = 'Tech Realists';
UPDATE camps SET label = 'Democratize Fast' WHERE name = 'Tech Utopians';

-- Governance camps
UPDATE camps SET label = 'Regulate Now' WHERE name = 'Regulatory Interventionists';
UPDATE camps SET label = 'Evolve Together' WHERE name = 'Adaptive Governance';
UPDATE camps SET label = 'Let Industry Lead' WHERE name = 'Innovation-First';

-- Future of Work camps
UPDATE camps SET label = 'Jobs Will Disappear' WHERE name = 'Displacement Realists';
UPDATE camps SET label = 'Humans + AI Together' WHERE name = 'Human-AI Collaboration';

-- Enterprise / Business camps
UPDATE camps SET label = 'Technology Leads' WHERE name = 'Tech-First';
UPDATE camps SET label = 'Evolve Together' WHERE name = 'Co-Evolution';
UPDATE camps SET label = 'Measure After' WHERE name = 'Proof Seekers';
UPDATE camps SET label = 'Measure As You Go' WHERE name = 'Learning Architects';
UPDATE camps SET label = 'Build It, They''ll Come' WHERE name = 'Tech Builders';
UPDATE camps SET label = 'Translation Is Key' WHERE name = 'Business Whisperers';

-- STEP 3: Set label = name for any camps without a label (fallback)
-- ============================================================================
UPDATE camps SET label = name WHERE label IS NULL OR label = '';

-- STEP 4: Verify the updates
-- ============================================================================
SELECT
  id,
  name as original_name,
  label as display_label,
  description
FROM camps
ORDER BY name;

-- Expected results:
-- You should see camps with their original names preserved and new display labels
-- For example:
--   original_name: 'Ethical Stewards', display_label: 'Safety First'
--   original_name: 'Tech-First', display_label: 'Technology Leads'
