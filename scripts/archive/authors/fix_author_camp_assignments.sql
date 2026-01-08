-- =============================================================================
-- FIX AUTHOR CAMP ASSIGNMENTS
-- =============================================================================
-- Based on audit of 55 recently-added authors
-- Fixing misalignments between author positions and camp assignments
-- =============================================================================

BEGIN;

-- =============================================================================
-- Camp IDs Reference:
-- Co-Evolution:           f19021ab-a8db-4363-adec-c2228dad6298
-- Tech Builders:          a076a4ce-f14c-47b5-ad01-c8c60135a494
-- Human-AI Collaboration: d8d3cec4-f8ce-49b1-9a43-bb0d952db371
-- Safety First:           7f64838f-59a6-4c87-8373-a023b9f448cc
-- Democratize Fast:       fe19ae2d-99f2-4c30-a596-c9cd92bff41b
-- Regulatory Interventionist: e8792297-e745-4c9f-a91d-4f87dd05cea2
-- Needs New Approaches:   207582eb-7b32-4951-9863-32fcf05944a1
-- Business Whisperers:    fe9464df-b778-44c9-9593-7fb3294fa6c3
-- =============================================================================

-- =============================================================================
-- 1. CHIP HUYEN
-- =============================================================================
-- Issue: Currently only in Tech Builders (strong)
-- Her "Designing Machine Learning Systems" emphasizes organizational readiness
-- and people/process as primary failure points - core Co-Evolution philosophy
-- =============================================================================

-- Update existing Tech Builders assignment to partial
UPDATE camp_authors
SET relevance = 'partial',
    key_quote = 'MLOps is as important as model architecture. Getting AI systems into production reliably requires serious engineering discipline around data pipelines, model serving, and monitoring.',
    why_it_matters = 'As founder of Claypot AI and author of the leading ML systems book, Huyen has hands-on credibility as a builder. Her technical depth grounds her organizational insights in practical reality.'
WHERE author_id = (SELECT id FROM authors WHERE name = 'Chip Huyen')
  AND camp_id = 'a076a4ce-f14c-47b5-ad01-c8c60135a494';

-- Add Co-Evolution as PRIMARY (strong)
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

-- Add Human-AI Collaboration as SECONDARY (partial)
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

-- =============================================================================
-- 2. JOY BUOLAMWINI
-- =============================================================================
-- Issue: Currently only in Democratize Fast (strong)
-- Founder of Algorithmic Justice League, exposed bias in facial recognition
-- Her work is about CAUTION and SAFETY, not speed - the opposite of Democratize Fast!
-- =============================================================================

-- Delete incorrect Democratize Fast assignment
DELETE FROM camp_authors
WHERE author_id = (SELECT id FROM authors WHERE name = 'Joy Buolamwini')
  AND camp_id = 'fe19ae2d-99f2-4c30-a596-c9cd92bff41b';

-- Add Safety First as PRIMARY (strong)
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  a.id,
  '7f64838f-59a6-4c87-8373-a023b9f448cc'::uuid,
  'strong',
  'If we fail to make ethical and inclusive AI the norm, we risk creating a technological apparatus that encodes inequity at unprecedented scale.',
  'https://www.ajl.org/',
  'Buolamwini''s "Gender Shades" research exposed how commercial facial recognition systems fail women and people of color. Her Algorithmic Justice League advocates for accountability and transparency in AI systems.'
FROM authors a WHERE a.name = 'Joy Buolamwini'
ON CONFLICT (author_id, camp_id) DO UPDATE SET
  relevance = EXCLUDED.relevance,
  key_quote = EXCLUDED.key_quote,
  quote_source_url = EXCLUDED.quote_source_url,
  why_it_matters = EXCLUDED.why_it_matters;

-- Add Regulatory Interventionist as SECONDARY (partial)
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  a.id,
  'e8792297-e745-4c9f-a91d-4f87dd05cea2'::uuid,
  'partial',
  'We need meaningful regulation and oversight of AI systems before they are deployed, not after harm has occurred.',
  'https://www.ted.com/speakers/joy_buolamwini',
  'Through the Algorithmic Justice League, Buolamwini has testified before Congress and advocated for facial recognition moratoriums. Her work bridges technical research with policy advocacy.'
FROM authors a WHERE a.name = 'Joy Buolamwini'
ON CONFLICT (author_id, camp_id) DO UPDATE SET
  relevance = EXCLUDED.relevance,
  key_quote = EXCLUDED.key_quote,
  quote_source_url = EXCLUDED.quote_source_url,
  why_it_matters = EXCLUDED.why_it_matters;

-- =============================================================================
-- 3. ANDREW McAFEE
-- =============================================================================
-- Issue: Currently only in Human-AI Collaboration (strong)
-- Co-authored "The Second Machine Age" with Erik Brynjolfsson
-- Should also be in Co-Evolution (they share similar philosophy on org change)
-- =============================================================================

-- Add Co-Evolution as SECONDARY (strong)
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  a.id,
  'f19021ab-a8db-4363-adec-c2228dad6298'::uuid,
  'strong',
  'Technologies don''t change the world on their own. They need the right complement of organizational capabilities, human skills, and institutional adaptations to realize their potential.',
  'https://andrewmcafee.org/',
  'McAfee''s research at MIT, alongside Brynjolfsson, emphasizes that digital transformation requires concurrent evolution of technology, processes, and people. This co-evolutionary perspective is central to his "Second Machine Age" thesis.'
FROM authors a WHERE a.name = 'Andrew McAfee'
ON CONFLICT (author_id, camp_id) DO UPDATE SET
  relevance = EXCLUDED.relevance,
  key_quote = EXCLUDED.key_quote,
  quote_source_url = EXCLUDED.quote_source_url,
  why_it_matters = EXCLUDED.why_it_matters;

-- =============================================================================
-- 4. MEREDITH BROUSSARD
-- =============================================================================
-- Issue: Currently only in Needs New Approaches (strong)
-- Author of "Artificial Unintelligence" - about AI skepticism and hype critique
-- Safety First is a better primary camp for her critical stance
-- =============================================================================

-- Update existing Needs New Approaches to partial
UPDATE camp_authors
SET relevance = 'partial',
    key_quote = 'We need to move beyond the idea that AI will solve everything. The problems with AI are fundamentally about the humans who build it and the contexts in which it''s deployed.',
    why_it_matters = 'Broussard''s technical background combined with her media criticism provides a unique perspective on why current AI approaches have fundamental limitations.'
WHERE author_id = (SELECT id FROM authors WHERE name = 'Meredith Broussard')
  AND camp_id = '207582eb-7b32-4951-9863-32fcf05944a1';

-- Add Safety First as PRIMARY (strong)
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  a.id,
  '7f64838f-59a6-4c87-8373-a023b9f448cc'::uuid,
  'strong',
  'Technochauvinism—the belief that technology is always the solution—is blinding us to the real costs and limitations of AI systems.',
  'https://www.meredithbroussard.com/',
  'Broussard''s "Artificial Unintelligence" challenges the AI hype cycle with rigorous technical and journalistic analysis. She advocates for realistic assessment of AI capabilities and careful attention to deployment harms.'
FROM authors a WHERE a.name = 'Meredith Broussard'
ON CONFLICT (author_id, camp_id) DO UPDATE SET
  relevance = EXCLUDED.relevance,
  key_quote = EXCLUDED.key_quote,
  quote_source_url = EXCLUDED.quote_source_url,
  why_it_matters = EXCLUDED.why_it_matters;

COMMIT;

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Verify Chip Huyen assignments
SELECT 'Chip Huyen Assignments:' as section;
SELECT a.name, c.label as camp, ca.relevance, LEFT(ca.key_quote, 60) as quote_preview
FROM authors a
JOIN camp_authors ca ON a.id = ca.author_id
JOIN camps c ON c.id = ca.camp_id
WHERE a.name = 'Chip Huyen'
ORDER BY CASE ca.relevance WHEN 'strong' THEN 1 WHEN 'partial' THEN 2 ELSE 3 END;

-- Verify Joy Buolamwini assignments
SELECT 'Joy Buolamwini Assignments:' as section;
SELECT a.name, c.label as camp, ca.relevance, LEFT(ca.key_quote, 60) as quote_preview
FROM authors a
JOIN camp_authors ca ON a.id = ca.author_id
JOIN camps c ON c.id = ca.camp_id
WHERE a.name = 'Joy Buolamwini'
ORDER BY CASE ca.relevance WHEN 'strong' THEN 1 WHEN 'partial' THEN 2 ELSE 3 END;

-- Verify Andrew McAfee assignments
SELECT 'Andrew McAfee Assignments:' as section;
SELECT a.name, c.label as camp, ca.relevance, LEFT(ca.key_quote, 60) as quote_preview
FROM authors a
JOIN camp_authors ca ON a.id = ca.author_id
JOIN camps c ON c.id = ca.camp_id
WHERE a.name = 'Andrew McAfee'
ORDER BY CASE ca.relevance WHEN 'strong' THEN 1 WHEN 'partial' THEN 2 ELSE 3 END;

-- Verify Meredith Broussard assignments
SELECT 'Meredith Broussard Assignments:' as section;
SELECT a.name, c.label as camp, ca.relevance, LEFT(ca.key_quote, 60) as quote_preview
FROM authors a
JOIN camp_authors ca ON a.id = ca.author_id
JOIN camps c ON c.id = ca.camp_id
WHERE a.name = 'Meredith Broussard'
ORDER BY CASE ca.relevance WHEN 'strong' THEN 1 WHEN 'partial' THEN 2 ELSE 3 END;
