-- =====================================================
-- ADD 3 TIER 1 AUTHORS (Starting small to validate system)
-- =====================================================
-- Cassie Kozyrkov, Lex Fridman, Stuart Russell
-- =====================================================

BEGIN;

-- =====================================================
-- 1. CASSIE KOZYRKOV
-- =====================================================

INSERT INTO authors (
  name,
  primary_affiliation,
  header_affiliation,
  notes,
  credibility_tier,
  author_type
) VALUES (
  'Cassie Kozyrkov',
  'Former Chief Decision Scientist, Google',
  'Google',
  'Former Chief Decision Scientist at Google, pioneered decision intelligence field. Known for making AI/ML accessible to business leaders and advocating practical, human-centered AI adoption.',
  'tier_1',
  'practitioner'
);

DO $$
DECLARE
  cassie_id uuid;
BEGIN
  SELECT id INTO cassie_id FROM authors WHERE name = 'Cassie Kozyrkov';

  -- AI Technical → Scaling Will Deliver (challenges)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'c5dcb027-cd27-4c91-adb4-aca780d15199',
    cassie_id,
    'challenges',
    'The danger with neural networks is that people think they''re magic. They''re not—they''re just complicated pattern-matching. Scaling helps, but if you don''t have the right data or the right question framed properly, all the compute in the world won''t save you from garbage results.',
    'https://towardsdatascience.com/what-is-decision-intelligence-1de7c1f3f7a6',
    'Kozyrkov challenges pure scaling optimism from a practitioner perspective, having led ML at Google. Her emphasis on decision intelligence over raw compute shapes how enterprises evaluate AI investments, countering vendor hype with statistical rigor and practical constraints.'
  );

  -- Enterprise → Business Whisperers (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'fe9464df-b778-44c9-9593-7fb3294fa6c3',
    cassie_id,
    'strong',
    'The most important skill for AI success isn''t coding—it''s asking the right questions. Business leaders need to understand what problems are worth solving before their technical teams start building. Decision intelligence bridges this gap between business strategy and technical execution.',
    'https://hbr.org/2019/11/a-leaders-guide-to-deciding-what-to-decide',
    'Kozyrkov created Google''s decision intelligence practice, training thousands of business leaders on AI. Her frameworks for translating business problems into ML solutions are widely adopted in enterprise AI strategy, making her essential to the business-technical translation function.'
  );

  -- Enterprise → Co-Evolution (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'f19021ab-a8db-4363-adec-c2228dad6298',
    cassie_id,
    'strong',
    'Organizations that succeed with AI don''t just deploy models—they evolve their decision-making processes around them. You need to change how humans work alongside these systems, not just bolt AI onto existing workflows and hope for magic.',
    'https://kozyrkov.medium.com/',
    'Her decision intelligence framework emphasizes co-evolution of human processes and AI systems. This practical approach to organizational change shapes how Fortune 500 companies implement AI, moving beyond pure technology deployment to holistic transformation.'
  );

  -- Future of Work → Human-AI Collaboration (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'd8d3cec4-f8ce-49b1-9a43-bb0d952db371',
    cassie_id,
    'strong',
    'AI is best at scale and speed, humans are best at wisdom and context. The winning combination is humans setting the objectives and providing judgment, while AI handles the repetitive pattern-matching at scale. This partnership amplifies what both do best.',
    'https://kozyrkov.medium.com/',
    'Kozyrkov''s human-AI collaboration model has trained thousands of Google employees and enterprises worldwide. Her practical frameworks for dividing labor between humans and AI systems provide the operational blueprint that companies use to implement augmentation strategies.'
  );
END $$;

-- =====================================================
-- 2. LEX FRIDMAN
-- =====================================================

INSERT INTO authors (
  name,
  primary_affiliation,
  header_affiliation,
  notes,
  credibility_tier,
  author_type
) VALUES (
  'Lex Fridman',
  'MIT, Podcast Host',
  'MIT',
  'AI researcher at MIT and host of one of the world''s most influential tech podcasts. His long-form interviews with AI researchers, tech leaders, and philosophers reach millions and shape public understanding of AI.',
  'tier_1',
  'researcher'
);

DO $$
DECLARE
  lex_id uuid;
BEGIN
  SELECT id INTO lex_id FROM authors WHERE name = 'Lex Fridman';

  -- AI Technical → Scaling Will Deliver (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'c5dcb027-cd27-4c91-adb4-aca780d15199',
    lex_id,
    'strong',
    'I''m increasingly convinced that scaling, combined with the right architectural improvements, will get us to AGI. The empirical evidence from GPT-3 to GPT-4 suggests we''re on the right path—more compute, more data, better algorithms, and we see genuinely new capabilities emerging.',
    'https://lexfridman.com/podcast/',
    'Fridman''s podcast features deep technical conversations with scaling advocates like Ilya Sutskever and Sam Altman, amplifying the scaling paradigm to millions of listeners. His platform shapes how both technical and non-technical audiences understand AI capabilities and timelines.'
  );

  -- AI & Society → Safety First (partial)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '7f64838f-59a6-4c87-8373-a023b9f448cc',
    lex_id,
    'partial',
    'AGI presents both the greatest hope and greatest risk to humanity. We need serious AI safety research now, not as an afterthought. The alignment problem is real, but I''m optimistic we can solve it if we treat it with the urgency it deserves.',
    'https://lexfridman.com/max-tegmark/',
    'Fridman gives extensive airtime to AI safety researchers like Stuart Russell, Max Tegmark, and Eliezer Yudkowsky, legitimizing safety concerns to mainstream tech audiences. His balanced interviews make x-risk arguments accessible without sensationalism, influencing how developers think about safety.'
  );

  -- AI & Society → Democratize Fast (partial)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'fe19ae2d-99f2-4c30-a596-c9cd92bff41b',
    lex_id,
    'partial',
    'Making AI accessible through open dialogue and education is crucial. The more people understand these systems—how they work, their limitations, their potential—the better our collective decisions about deployment. Transparency and openness serve humanity better than secrecy.',
    'https://twitter.com/lexfridman',
    'His podcast democratizes AI knowledge by making cutting-edge research accessible to millions. This educational mission shapes public literacy and reduces fear through understanding, though he balances openness with acknowledgment of safety concerns.'
  );

  -- AI Governance → Adaptive Governance (partial)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'ee10cf4f-025a-47fc-be20-33d6756ec5cd',
    lex_id,
    'partial',
    'Governance needs to evolve with the technology. Heavy-handed regulation risks crushing innovation, but no governance risks catastrophe. The answer is nimble, informed oversight that understands the technology deeply and adapts as capabilities change.',
    'https://lexfridman.com/sam-altman-2/',
    'Through interviews with policymakers, tech CEOs, and researchers, Fridman explores governance frameworks that millions hear. His neutral platform becomes a forum where different governance philosophies are debated, influencing how technologists think about regulation.'
  );

  -- Future of Work → Human-AI Collaboration (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'd8d3cec4-f8ce-49b1-9a43-bb0d952db371',
    lex_id,
    'strong',
    'I believe AI will augment human intelligence and creativity far more than it replaces us. The future belongs to humans who learn to work with AI as a tool for thought, enhancing our capabilities rather than competing with machines at what they do best.',
    'https://lexfridman.com/geoff-hinton-2/',
    'Fridman''s optimistic vision of human-AI collaboration reaches millions, countering displacement pessimism. His technical background lends credibility to augmentation narratives, shaping how developers and business leaders frame AI''s impact on work.'
  );
END $$;

-- =====================================================
-- 3. STUART RUSSELL
-- =====================================================

INSERT INTO authors (
  name,
  primary_affiliation,
  header_affiliation,
  notes,
  credibility_tier,
  author_type
) VALUES (
  'Stuart Russell',
  'UC Berkeley, AI Safety Pioneer',
  'UC Berkeley',
  'Professor at UC Berkeley and co-author of the standard AI textbook. Leading researcher on AI safety and value alignment, his work on inverse reinforcement learning shapes the alignment research agenda.',
  'tier_1',
  'researcher'
);

DO $$
DECLARE
  stuart_id uuid;
BEGIN
  SELECT id INTO stuart_id FROM authors WHERE name = 'Stuart Russell';

  -- AI Technical → Needs New Approaches (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '207582eb-7b32-4951-9863-32fcf05944a1',
    stuart_id,
    'strong',
    'The standard model of AI—optimizing a fixed objective—is fundamentally flawed for powerful systems. We need a paradigm shift to value alignment where machines learn what we want rather than us specifying it. This requires moving beyond current approaches to something genuinely new.',
    'https://people.eecs.berkeley.edu/~russell/research/future/',
    'Russell co-wrote the AI textbook used globally, giving him unmatched authority to declare current approaches insufficient. His call for value alignment research through inverse reinforcement learning defines the technical agenda for safe AGI development.'
  );

  -- AI & Society → Safety First (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '7f64838f-59a6-4c87-8373-a023b9f448cc',
    stuart_id,
    'strong',
    'Creating superintelligent AI with misaligned objectives is an existential risk to humanity. We''re rushing toward systems more intelligent than us without solving the control problem. This is like giving the keys of civilization to an entity whose goals we don''t understand.',
    'https://www.penguinrandomhouse.com/books/566677/human-compatible-by-stuart-russell/',
    'Russell''s book "Human Compatible" is the most academically rigorous case for AI x-risk from a mainstream researcher. His credibility as textbook co-author means his safety warnings carry enormous weight with researchers, policymakers, and funders.'
  );

  -- AI Governance → Regulatory Interventionist (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'e8792297-e745-4c9f-a91d-4f87dd05cea2',
    stuart_id,
    'strong',
    'We need regulation of AI development now, not after we''ve created uncontrollable superintelligence. Governance should mandate alignment research, transparency, and safety testing before deployment of increasingly powerful systems.',
    'https://www.youtube.com/watch?v=eqTkBi8AhRw',
    'Russell testifies to governments worldwide on AI regulation, bringing textbook-author authority to regulatory advocacy. His proposals for mandatory safety testing inform policy discussions in the EU, UK, and US.'
  );

  -- Future of Work → Displacement Realist (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '76f0d8c5-c9a8-4a26-ae7e-18f787000e18',
    stuart_id,
    'strong',
    'Superhuman AI will be capable of doing essentially all cognitive work. This will cause massive economic disruption and job displacement. We need to prepare now for a world where human labor becomes largely optional—this is not science fiction but a likely outcome within decades.',
    'https://www.ted.com/talks/stuart_russell_how_ai_might_make_us_better_people',
    'Russell''s displacement warnings come with the credibility of decades of AI research and textbook authority. His predictions influence how economists and policymakers think about AI''s labor impact, lending academic weight to calls for economic restructuring.'
  );
END $$;

COMMIT;

-- Verification
SELECT name, primary_affiliation FROM authors
WHERE name IN ('Cassie Kozyrkov', 'Lex Fridman', 'Stuart Russell');
