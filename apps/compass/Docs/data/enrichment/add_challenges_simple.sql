-- Add challenging and emerging perspectives to camp_authors
-- Copy and paste this into Supabase SQL Editor

-- Challenging perspectives
INSERT INTO camp_authors (camp_id, author_id, relevance)
SELECT c.id, a.id, 'challenges'
FROM camps c, authors a
WHERE c.label = 'Scaling Maximalist' AND a.name IN ('Gary Marcus', 'Yann LeCun', 'Emily M. Bender', 'Timnit Gebru')
ON CONFLICT (camp_id, author_id) DO NOTHING;

INSERT INTO camp_authors (camp_id, author_id, relevance)
SELECT c.id, a.id, 'challenges'
FROM camps c, authors a
WHERE c.label = 'Grounding Realist' AND a.name IN ('Sam Altman', 'Dario Amodei', 'Marc Andreessen')
ON CONFLICT (camp_id, author_id) DO NOTHING;

INSERT INTO camp_authors (camp_id, author_id, relevance)
SELECT c.id, a.id, 'challenges'
FROM camps c, authors a
WHERE c.label = 'Tech Utopian' AND a.name IN ('Emily M. Bender', 'Timnit Gebru', 'Kate Crawford', 'Geoffrey Hinton')
ON CONFLICT (camp_id, author_id) DO NOTHING;

INSERT INTO camp_authors (camp_id, author_id, relevance)
SELECT c.id, a.id, 'challenges'
FROM camps c, authors a
WHERE c.label = 'Ethical Steward' AND a.name IN ('Marc Andreessen', 'Balaji Srinivasan', 'Mark Zuckerberg')
ON CONFLICT (camp_id, author_id) DO NOTHING;

INSERT INTO camp_authors (camp_id, author_id, relevance)
SELECT c.id, a.id, 'challenges'
FROM camps c, authors a
WHERE c.label = 'Tech First' AND a.name IN ('Ethan Mollick', 'Erik Brynjolfsson', 'Fei-Fei Li')
ON CONFLICT (camp_id, author_id) DO NOTHING;

INSERT INTO camp_authors (camp_id, author_id, relevance)
SELECT c.id, a.id, 'challenges'
FROM camps c, authors a
WHERE c.label = 'Human–AI Collaboration' AND a.name IN ('Azeem Azhar', 'Gary Marcus')
ON CONFLICT (camp_id, author_id) DO NOTHING;

INSERT INTO camp_authors (camp_id, author_id, relevance)
SELECT c.id, a.id, 'challenges'
FROM camps c, authors a
WHERE c.label = 'Displacement Realist' AND a.name IN ('Andrew Ng', 'Satya Nadella')
ON CONFLICT (camp_id, author_id) DO NOTHING;

INSERT INTO camp_authors (camp_id, author_id, relevance)
SELECT c.id, a.id, 'challenges'
FROM camps c, authors a
WHERE c.label = 'Regulatory Interventionist' AND a.name IN ('Marc Andreessen', 'Balaji Srinivasan', 'Mark Zuckerberg')
ON CONFLICT (camp_id, author_id) DO NOTHING;

INSERT INTO camp_authors (camp_id, author_id, relevance)
SELECT c.id, a.id, 'challenges'
FROM camps c, authors a
WHERE c.label = 'Innovation First' AND a.name IN ('Max Tegmark', 'Geoffrey Hinton', 'Yoshua Bengio', 'Sam Harris', 'Emily M. Bender')
ON CONFLICT (camp_id, author_id) DO NOTHING;

-- Emerging perspectives
INSERT INTO camp_authors (camp_id, author_id, relevance)
SELECT c.id, a.id, 'emerging'
FROM camps c, authors a
WHERE c.label = 'Grounding Realist' AND a.name IN ('Ilya Sutskever', 'Yann LeCun')
ON CONFLICT (camp_id, author_id) DO NOTHING;

INSERT INTO camp_authors (camp_id, author_id, relevance)
SELECT c.id, a.id, 'emerging'
FROM camps c, authors a
WHERE c.label = 'Adaptive Governance' AND a.name IN ('Mustafa Suleyman', 'Elon Musk')
ON CONFLICT (camp_id, author_id) DO NOTHING;

INSERT INTO camp_authors (camp_id, author_id, relevance)
SELECT c.id, a.id, 'emerging'
FROM camps c, authors a
WHERE c.label = 'Tech Utopian' AND a.name IN ('Andrej Karpathy')
ON CONFLICT (camp_id, author_id) DO NOTHING;
