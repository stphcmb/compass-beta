-- =============================================================================
-- AUDIT: Check camp assignments for 42 recently-added authors
-- =============================================================================
-- These authors were added in the 2026-01-08 expansion
-- Need to verify they all have proper camp assignments
-- =============================================================================

-- List of 42 authors added in recent expansion
WITH recent_authors AS (
  SELECT name FROM (VALUES
    -- Enterprise & Business
    ('Thomas Davenport'), ('Ethan Mollick'), ('Azeem Azhar'), ('Andrew McAfee'),
    ('Ajay Agrawal'), ('Avi Goldfarb'), ('Chip Huyen'), ('Cassie Kozyrkov'),
    -- AI Safety & Alignment
    ('Jan Leike'), ('Paul Christiano'), ('Connor Leahy'), ('Chris Olah'),
    ('Robert Miles'), ('Max Tegmark'),
    -- Policy & Governance
    ('Alondra Nelson'), ('Amba Kak'), ('Woodrow Hartzog'), ('Margot Kaminski'),
    ('Bruce Schneier'), ('Marietje Schaake'),
    -- AI Ethics & Society
    ('Joy Buolamwini'), ('Meredith Broussard'), ('Ruha Benjamin'),
    ('Kate Crawford'), ('Safiya Noble'), ('Rumman Chowdhury'),
    -- Startups & Industry
    ('Aravind Srinivas'), ('David Luan'), ('Noam Shazeer'), ('Emad Mostaque'),
    ('Mira Murati'), ('Kevin Scott'), ('Lisa Su'), ('Douwe Kiela'),
    -- Research & Academia
    ('Yejin Choi'), ('Percy Liang'), ('Oriol Vinyals'), ('John Schulman'),
    ('Pushmeet Kohli'), ('Daphne Koller'), ('Chelsea Finn'), ('Sergey Levine'),
    ('David Silver'), ('Josh Tenenbaum'), ('Daniela Rus'), ('Pieter Abbeel'),
    ('Been Kim'), ('Rediet Abebe'),
    -- International
    ('Francesca Rossi'), ('Ricardo Baeza-Yates'), ('Ying Lu'), ('Jianfeng Gao'),
    -- Creative & Media
    ('Holly Herndon'), ('Mat Dryhurst'), ('Yannic Kilcher')
  ) AS t(name)
)

-- AUDIT 1: Authors with NO camp assignments (invisible in app)
SELECT
  '=== AUTHORS WITH NO CAMP ASSIGNMENTS ===' as section;

SELECT
  a.name,
  a.author_type,
  a.credibility_tier,
  COALESCE(a.primary_affiliation, a.header_affiliation) as affiliation
FROM authors a
LEFT JOIN camp_authors ca ON a.id = ca.author_id
WHERE a.name IN (SELECT name FROM recent_authors)
  AND ca.id IS NULL
ORDER BY a.name;

-- AUDIT 2: Authors with only 1 camp (may need more)
SELECT
  '=== AUTHORS WITH ONLY 1 CAMP ASSIGNMENT ===' as section;

SELECT
  a.name,
  c.name as camp_name,
  c.domain,
  ca.relevance
FROM authors a
JOIN camp_authors ca ON a.id = ca.author_id
JOIN camps c ON c.id = ca.camp_id
WHERE a.name IN (SELECT name FROM recent_authors)
GROUP BY a.id, a.name, c.id, c.name, c.domain, ca.relevance
HAVING COUNT(*) OVER (PARTITION BY a.id) = 1
ORDER BY a.name;

-- AUDIT 3: Full camp assignment summary
SELECT
  '=== FULL CAMP ASSIGNMENT SUMMARY ===' as section;

SELECT
  a.name,
  COUNT(ca.id) as camp_count,
  STRING_AGG(c.name || ' (' || ca.relevance || ')', ', ' ORDER BY
    CASE ca.relevance
      WHEN 'strong' THEN 1
      WHEN 'partial' THEN 2
      WHEN 'emerging' THEN 3
      ELSE 4
    END
  ) as camps
FROM authors a
LEFT JOIN camp_authors ca ON a.id = ca.author_id
LEFT JOIN camps c ON c.id = ca.camp_id
WHERE a.name IN (SELECT name FROM recent_authors)
GROUP BY a.id, a.name
ORDER BY camp_count ASC, a.name;

-- AUDIT 4: Check for potential mismatches (Enterprise authors in wrong camps)
SELECT
  '=== POTENTIAL MISMATCHES: Enterprise authors NOT in Enterprise camps ===' as section;

SELECT
  a.name,
  a.author_type,
  STRING_AGG(DISTINCT c.domain, ', ') as assigned_domains,
  STRING_AGG(c.name || ' (' || ca.relevance || ')', ', ') as camps
FROM authors a
JOIN camp_authors ca ON a.id = ca.author_id
JOIN camps c ON c.id = ca.camp_id
WHERE a.name IN (
  'Thomas Davenport', 'Ethan Mollick', 'Azeem Azhar', 'Andrew McAfee',
  'Ajay Agrawal', 'Avi Goldfarb', 'Chip Huyen', 'Cassie Kozyrkov'
)
GROUP BY a.id, a.name, a.author_type
HAVING NOT STRING_AGG(DISTINCT c.domain, ', ') LIKE '%Enterprise%'
ORDER BY a.name;
