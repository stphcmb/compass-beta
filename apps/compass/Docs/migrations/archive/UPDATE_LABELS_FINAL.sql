-- ============================================================================
-- Update Camp Labels - FINAL VERSION
-- Based on actual schema: camps has (id, domain_id, code, label, description)
-- ============================================================================

-- Update labels based on CODE column (which exists and is unique)

-- Technology domain (domain_id = 1)
UPDATE camps SET label = 'Scaling Will Deliver' WHERE code = 'SCALING_MAXIMALIST';
UPDATE camps SET label = 'Needs New Approaches' WHERE code = 'GROUNDING_REALIST';

-- Society domain (domain_id = 2)
UPDATE camps SET label = 'Safety First' WHERE code = 'ETHICAL_STEWARD';
UPDATE camps SET label = 'Democratize Fast' WHERE code = 'TECH_UTOPIAN';
UPDATE camps SET label = 'Iterate Responsibly' WHERE code = 'TECH_REALIST';

-- Business domain (domain_id = 3)
UPDATE camps SET label = 'Technology Leads' WHERE code = 'ADOPTION_TECH_FIRST';
UPDATE camps SET label = 'People First' WHERE code = 'ADOPTION_HUMAN_CENTRIC';
UPDATE camps SET label = 'Build Ecosystems' WHERE code = 'ADOPTION_PLATFORM_ECOSYSTEM';

-- Workers domain (domain_id = 5)
UPDATE camps SET label = 'Humans + AI Together' WHERE code = 'WORK_HUMAN_AI_COLLAB';
UPDATE camps SET label = 'Jobs Will Disappear' WHERE code = 'WORK_DISPLACEMENT';

-- Policy & Regulation domain (domain_id = 4)
UPDATE camps SET label = 'Regulate Now' WHERE code = 'POLICY_REGULATORY';
UPDATE camps SET label = 'Let Industry Lead' WHERE code = 'POLICY_INNOVATION_FIRST';
UPDATE camps SET label = 'Evolve Together' WHERE code = 'POLICY_ADAPTIVE';

-- Verify the changes
SELECT
  code,
  label,
  domain_id,
  CASE domain_id
    WHEN 1 THEN 'AI Technical Capabilities'
    WHEN 2 THEN 'AI & Society'
    WHEN 3 THEN 'Enterprise AI Adoption'
    WHEN 4 THEN 'AI Governance & Oversight'
    WHEN 5 THEN 'Future of Work'
    ELSE 'Other'
  END as domain_display_name
FROM camps
ORDER BY domain_id, code;
