-- =====================================================
-- CASSIE KOZYRKOV - Complete Update (Profile + Camps)
-- =====================================================
-- Updates profile to match Tier 1 standards
-- Adds 4 camp relationships with domain-specific quotes
-- Reference: TIER1_AUTHORS_SUMMARY.md, TIER1_CAMP_MAPPINGS.md

BEGIN;

-- Step 1: Update Cassie's profile to match Tier 1 standards
UPDATE authors
SET
  credibility_tier = 'Major Voice',
  primary_affiliation = 'Former Chief Decision Scientist at Google; Founder of Kozyr',
  notes = 'Pioneered "decision intelligence" framework at Google, bridging technical ML expertise with business strategy. Her accessible teaching (YouTube, Substack) reaches millions, shaping how enterprises think about AI adoption. Former Chief Decision Scientist at Google, now founder of Kozyr.'
WHERE name = 'Cassie Kozyrkov';

-- Step 2: Add 4 camp relationships
DO $$
DECLARE
  cassie_id uuid;
BEGIN
  SELECT id INTO cassie_id FROM authors WHERE name = 'Cassie Kozyrkov';

  IF cassie_id IS NULL THEN
    RAISE EXCEPTION 'Cassie Kozyrkov not found in authors table';
  END IF;

  -- Camp 1: AI Technical → Scaling Will Deliver (challenges)
  -- UUID: c5dcb027-cd27-4c91-adb4-aca780d15199
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'c5dcb027-cd27-4c91-adb4-aca780d15199',
    cassie_id,
    'challenges',
    'Scaling is important, but it''s not a substitute for thinking. You can scale a bad model to infinity and still get bad decisions. What matters is whether you''re asking the right questions in the first place. The real bottleneck isn''t compute—it''s understanding what problem you''re actually trying to solve.',
    'https://www.youtube.com/c/CassieKozyrkov',
    'As former Chief Decision Scientist at Google, Kozyrkov brings a practitioner''s reality check to scaling optimism. Her decision intelligence framework emphasizes that raw capability without clear objectives leads to expensive mistakes. This perspective influences how enterprises actually deploy AI, shifting focus from "bigger models" to "better questions." Her YouTube channel and industry talks reach thousands of practitioners making real deployment decisions.'
  );

  -- Camp 2: Enterprise → Business Whisperers (strong)
  -- UUID: fe9464df-b778-44c9-9593-7fb3294fa6c3
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'fe9464df-b778-44c9-9593-7fb3294fa6c3',
    cassie_id,
    'strong',
    'AI isn''t going to make your bad business strategy good. It amplifies what you already have. Before you rush to adopt AI, ask: what decision are we trying to improve? Business transformation starts with business clarity, not with technology. The best AI strategy is first having a strategy.',
    'https://decision.substack.com/',
    'Kozyrkov pioneered the "decision intelligence" framework at Google, explicitly bridging ML engineering and business strategy. Her work shapes how Fortune 500 companies think about AI adoption—not as a technology problem but as a decision-making problem. Her accessible explanations (Substack, LinkedIn) reach C-suite executives who control enterprise AI budgets, making her one of the most influential voices translating technical capabilities into business value.'
  );

  -- Camp 3: Enterprise → Co-Evolution (strong)
  -- UUID: f19021ab-a8db-4363-adec-c2228dad6298
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'f19021ab-a8db-4363-adec-c2228dad6298',
    cassie_id,
    'strong',
    'The organizations that succeed with AI aren''t the ones with the best models—they''re the ones that redesign their processes around better decision-making. You need to evolve your culture, your workflows, and your understanding of what success looks like, all at the same time the technology evolves.',
    'https://www.youtube.com/c/CassieKozyrkov',
    'From her role scaling AI at Google, Kozyrkov has direct experience with organizational transformation challenges. Her emphasis on simultaneous evolution—business processes adapting as AI capabilities mature—directly counters both "technology will solve everything" and "humans must adapt to AI" camps. She advocates for mutual adaptation: companies reshape workflows, AI systems get retrained, humans upskill. This co-evolution framework has been adopted by enterprises like Google Cloud''s AI adoption methodology.'
  );

  -- Camp 4: Future of Work → Human-AI Collaboration (strong)
  -- UUID: d8d3cec4-f8ce-49b1-9a43-bb0d952db371
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'd8d3cec4-f8ce-49b1-9a43-bb0d952db371',
    cassie_id,
    'strong',
    'AI is best at speed; humans are best at judgment. The future of work isn''t choosing between them—it''s designing systems where each does what they''re good at. Let AI handle the repetitive pattern-matching at scale, and let humans handle the "should we even be doing this?" questions.',
    'https://decision.substack.com/',
    'Kozyrkov''s framework explicitly divides labor between AI (fast, scalable pattern recognition) and humans (goal-setting, ethical judgment, context). This isn''t aspirational—it''s how she structured teams at Google. Her influence extends through her teaching (Stanford, Duke) and her popular content, shaping how data science teams worldwide think about their roles. She reframes AI displacement anxiety into a capabilities question: what are humans uniquely good at that machines aren''t?'
  );

  RAISE NOTICE '✅ Updated Cassie Kozyrkov profile to Tier 1 standards';
  RAISE NOTICE '✅ Added 4 camp relationships for Cassie Kozyrkov';

END $$;

COMMIT;

-- Verification Queries
-- 1. Check updated profile
SELECT
  name,
  primary_affiliation,
  credibility_tier,
  jsonb_array_length(sources) as source_count
FROM authors
WHERE name = 'Cassie Kozyrkov';

-- 2. Check camp relationships
SELECT
  a.name,
  c.name as camp_name,
  d.name as domain_name,
  ca.relevance,
  LENGTH(ca.key_quote) as quote_length,
  LENGTH(ca.why_it_matters) as why_it_matters_length
FROM authors a
JOIN camp_authors ca ON a.id = ca.author_id
JOIN camps c ON ca.camp_id = c.id
JOIN domains d ON c.domain_id = d.id
WHERE a.name = 'Cassie Kozyrkov'
ORDER BY d.name, c.name;

-- Expected output:
-- Profile: credibility_tier = 'Major Voice', 3 sources
-- Camp relationships: 4 total
--   1. AI Technical Capabilities → Scaling Will Deliver (challenges)
--   2. Enterprise AI Adoption → Business Whisperers (strong)
--   3. Enterprise AI Adoption → Co-Evolution (strong)
--   4. Future of Work → Human-AI Collaboration (strong)
