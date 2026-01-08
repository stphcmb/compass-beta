-- =============================================================================
-- FIX CHIP HUYEN CAMP ASSIGNMENTS
-- =============================================================================
-- Issue: Chip Huyen was added to authors table but has NO camp assignments
-- Her philosophy emphasizes people & process as failure points (Co-Evolution)
-- Not pure technical infrastructure (Tech Builders)
-- =============================================================================

BEGIN;

-- Camp IDs for reference:
-- Co-Evolution: f19021ab-a8db-4363-adec-c2228dad6298
-- Tech Builders: a076a4ce-f14c-47b5-ad01-c8c60135a494
-- Human-AI Collaboration: d8d3cec4-f8ce-49b1-9a43-bb0d952db371
-- Business Whisperers: fe9464df-b778-44c9-9593-7fb3294fa6c3

-- 1. PRIMARY: Co-Evolution (STRONG)
-- Her core thesis: ML failures are organizational, not just technical
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  a.id,
  'f19021ab-a8db-4363-adec-c2228dad6298'::uuid,
  'strong',
  'Most ML projects fail not because of the algorithms, but because of data issues, unclear problem framing, or lack of organizational readiness. The gap between ML research and production is fundamentally about people and process.',
  'https://huyenchip.com/ml-systems-design',
  'Chip Huyen''s "Designing Machine Learning Systems" is the definitive guide to production ML. Her emphasis on organizational readiness over pure technical capability makes her a leading voice for co-evolutionary thinking in enterprise AI adoption.'
FROM authors a WHERE a.name = 'Chip Huyen'
ON CONFLICT (author_id, camp_id) DO UPDATE SET
  relevance = EXCLUDED.relevance,
  key_quote = EXCLUDED.key_quote,
  quote_source_url = EXCLUDED.quote_source_url,
  why_it_matters = EXCLUDED.why_it_matters;

-- 2. SECONDARY: Tech Builders (PARTIAL)
-- She IS a builder, but her building serves organizational transformation
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  a.id,
  'a076a4ce-f14c-47b5-ad01-c8c60135a494'::uuid,
  'partial',
  'MLOps is as important as model architecture. Getting AI systems into production reliably requires serious engineering discipline around data pipelines, model serving, and monitoring.',
  'https://huyenchip.com/',
  'As founder of Claypot AI and author of the leading ML systems book, Huyen has hands-on credibility as a builder. Her technical depth grounds her organizational insights in practical reality.'
FROM authors a WHERE a.name = 'Chip Huyen'
ON CONFLICT (author_id, camp_id) DO UPDATE SET
  relevance = EXCLUDED.relevance,
  key_quote = EXCLUDED.key_quote,
  quote_source_url = EXCLUDED.quote_source_url,
  why_it_matters = EXCLUDED.why_it_matters;

-- 3. TERTIARY: Human-AI Collaboration (PARTIAL)
-- Her focus on ML systems inherently involves human-in-the-loop design
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  a.id,
  'd8d3cec4-f8ce-49b1-9a43-bb0d952db371'::uuid,
  'partial',
  'Production ML systems are not autonomous—they require continuous human oversight for data quality, model monitoring, and feedback loops. The best systems are designed for human-machine collaboration, not replacement.',
  'https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/',
  'Her ML systems design principles emphasize human-in-the-loop workflows, monitoring dashboards for human review, and feedback mechanisms. This collaborative approach distinguishes production ML from research demos.'
FROM authors a WHERE a.name = 'Chip Huyen'
ON CONFLICT (author_id, camp_id) DO UPDATE SET
  relevance = EXCLUDED.relevance,
  key_quote = EXCLUDED.key_quote,
  quote_source_url = EXCLUDED.quote_source_url,
  why_it_matters = EXCLUDED.why_it_matters;

COMMIT;

-- Verify the assignments
SELECT
  a.name,
  c.name as camp_name,
  c.domain,
  ca.relevance,
  LEFT(ca.key_quote, 80) as quote_preview
FROM authors a
JOIN camp_authors ca ON a.id = ca.author_id
JOIN camps c ON c.id = ca.camp_id
WHERE a.name = 'Chip Huyen'
ORDER BY
  CASE ca.relevance
    WHEN 'strong' THEN 1
    WHEN 'partial' THEN 2
    WHEN 'emerging' THEN 3
    ELSE 4
  END;
