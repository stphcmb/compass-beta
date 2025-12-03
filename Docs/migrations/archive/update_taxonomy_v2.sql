-- STATUS: DEPRECATED - Superseded by UPDATE_LABELS_FINAL.sql
-- 
-- This is an earlier iteration of the taxonomy update. Use UPDATE_LABELS_FINAL.sql for the canonical version.
--
-- ============================================================================
-- Update Taxonomy to V2 - New Camp Names and Domain Names
-- Based on compass-implementation-spec-v2.md
-- ============================================================================

-- OPTION A: Add 'label' column (RECOMMENDED)
-- This preserves the old names in 'name' and adds new intuitive labels
-- ============================================================================

-- Step 1: Add label column if it doesn't exist
ALTER TABLE camps ADD COLUMN IF NOT EXISTS label TEXT;

-- Step 2: Update camp labels with new intuitive names
-- AI Progress / Technology camps (dimension_id = 1)
UPDATE camps SET label = 'Needs New Approaches' WHERE name = 'Grounding Realists';
UPDATE camps SET label = 'Scaling Will Deliver' WHERE name = 'Scaling Maximalists';

-- Society camps (dimension_id = 2)
UPDATE camps SET label = 'Safety First' WHERE name = 'Ethical Stewards';
UPDATE camps SET label = 'Iterate Responsibly' WHERE name = 'Tech Realists';
UPDATE camps SET label = 'Democratize Fast' WHERE name = 'Tech Utopians';

-- Governance camps (dimension_id = 4)
UPDATE camps SET label = 'Regulate Now' WHERE name = 'Regulatory Interventionists';
UPDATE camps SET label = 'Evolve Together' WHERE name = 'Adaptive Governance';
UPDATE camps SET label = 'Let Industry Lead' WHERE name = 'Innovation-First';

-- Future of Work camps (dimension_id = 5)
UPDATE camps SET label = 'Jobs Will Disappear' WHERE name = 'Displacement Realists';
UPDATE camps SET label = 'Humans + AI Together' WHERE name = 'Human-AI Collaboration';

-- Enterprise camps (dimension_id = 3)
UPDATE camps SET label = 'Technology Leads' WHERE name = 'Tech-First';
UPDATE camps SET label = 'Evolve Together' WHERE name = 'Co-Evolution';
UPDATE camps SET label = 'Measure After' WHERE name = 'Proof Seekers';
UPDATE camps SET label = 'Measure As You Go' WHERE name = 'Learning Architects';
UPDATE camps SET label = 'Build It, They''ll Come' WHERE name = 'Tech Builders';
UPDATE camps SET label = 'Translation Is Key' WHERE name = 'Business Whisperers';

-- Step 3: Handle camps that might not have matches yet
-- Set label = name for any camps without a label
UPDATE camps SET label = name WHERE label IS NULL;

-- Step 4: Verify updates
SELECT
  c.id,
  c.name as original_name,
  c.label as display_label,
  CASE
    WHEN d.name = 'Technology' THEN 'AI Technical Capabilities'
    WHEN d.name = 'Society' THEN 'AI & Society'
    WHEN d.name = 'Business' THEN 'Enterprise AI Adoption'
    WHEN d.name = 'Policy & Regulation' THEN 'AI Governance & Oversight'
    WHEN d.name = 'Workers' THEN 'Future of Work'
    ELSE d.name
  END as domain_name,
  d.name as domain_original
FROM camps c
LEFT JOIN dimensions d ON c.dimension_id = d.id
ORDER BY d.name, c.label;

-- Note: The domain names are updated in the application code (DOMAIN_MAP)
-- not in the database to maintain referential integrity
