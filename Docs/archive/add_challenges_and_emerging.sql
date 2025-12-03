-- STATUS: DEPRECATED - Superseded by add_challenges_simple.sql which uses labels and conflict handling
-- 
-- This file uses the old schema (camp names) and lacks conflict handling.
-- Use data/enrichment/add_challenges_simple.sql for the canonical version which uses camp labels and ON CONFLICT clauses.
--
-- Add challenging and emerging perspectives to camp_authors
-- Run this after the main seed_from_mvp_database.sql has been executed

-- 3c) Challenging perspectives (authors who oppose or critique certain camps)
INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance)
SELECT c.id, a.id, 'Skeptical of pure scaling; emphasizes LLM limitations', 'challenges'
FROM camps c, authors a
WHERE c.name = 'Scaling Maximalists' AND a.name IN ('Gary Marcus', 'Yann LeCun', 'Emily M. Bender', 'Timnit Gebru');

INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance)
SELECT c.id, a.id, 'Pro-scaling optimists who challenge grounding skepticism', 'challenges'
FROM camps c, authors a
WHERE c.name = 'Grounding Realists' AND a.name IN ('Sam Altman', 'Dario Amodei', 'Marc Andreessen');

INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance)
SELECT c.id, a.id, 'Harms-first lens challenges utopian optimism', 'challenges'
FROM camps c, authors a
WHERE c.name = 'Tech Utopians' AND a.name IN ('Emily M. Bender', 'Timnit Gebru', 'Kate Crawford', 'Geoffrey Hinton');

INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance)
SELECT c.id, a.id, 'Innovation-first advocates challenge ethical constraints', 'challenges'
FROM camps c, authors a
WHERE c.name = 'Ethical Stewards' AND a.name IN ('Marc Andreessen', 'Balaji Srinivasan', 'Mark Zuckerberg');

INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance)
SELECT c.id, a.id, 'Human-centric approach challenges tech-first infrastructure focus', 'challenges'
FROM camps c, authors a
WHERE c.name = 'Tech-First' AND a.name IN ('Ethan Mollick', 'Erik Brynjolfsson', 'Fei-Fei Li');

INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance)
SELECT c.id, a.id, 'Displacement realists challenge collaboration optimism', 'challenges'
FROM camps c, authors a
WHERE c.name = 'Human-AI Collaboration' AND a.name IN ('Azeem Azhar', 'Gary Marcus');

INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance)
SELECT c.id, a.id, 'Augmentation optimists challenge displacement fears', 'challenges'
FROM camps c, authors a
WHERE c.name = 'Displacement Realists' AND a.name IN ('Andrew Ng', 'Satya Nadella');

INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance)
SELECT c.id, a.id, 'Anti-regulation innovators challenge interventionist stance', 'challenges'
FROM camps c, authors a
WHERE c.name = 'Regulatory Interventionists' AND a.name IN ('Marc Andreessen', 'Balaji Srinivasan', 'Mark Zuckerberg');

INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance)
SELECT c.id, a.id, 'Safety and regulation advocates challenge innovation-first approach', 'challenges'
FROM camps c, authors a
WHERE c.name = 'Innovation-First' AND a.name IN ('Max Tegmark', 'Geoffrey Hinton', 'Yoshua Bengio', 'Sam Harris', 'Emily M. Bender');

-- 3d) Emerging perspectives (new/contrarian views that don't fit existing camps)
INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance)
SELECT c.id, a.id, 'Beyond scaling paradigm; monk-mode safety represents emerging shift', 'emerging'
FROM camps c, authors a
WHERE c.name = 'Capabilities Realist with Safety Focus' AND a.name IN ('Ilya Sutskever');

INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance)
SELECT c.id, a.id, 'JEPA/world models represent emerging architectural paradigm shift', 'emerging'
FROM camps c, authors a
WHERE c.name = 'Grounding Realists' AND a.name IN ('Yann LeCun');

INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance)
SELECT c.id, a.id, 'Containment plus acceleration represents emerging middle ground', 'emerging'
FROM camps c, authors a
WHERE c.name = 'Adaptive Governance' AND a.name IN ('Mustafa Suleyman', 'Elon Musk');

INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance)
SELECT c.id, a.id, 'Pragmatic realism with measured 10y AGI timeline is emerging measured view', 'emerging'
FROM camps c, authors a
WHERE c.name = 'Tech Realists' AND a.name IN ('Andrej Karpathy');
