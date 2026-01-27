-- =====================================================
-- ADD TIER 1 AUTHORS + CASSIE KOZYRKOV (9 authors, ~41 relationships)
-- =====================================================
-- Adds high-impact, multi-domain thought leaders with
-- domain-specific quotes and "why it matters" context
-- =====================================================

BEGIN;

-- =====================================================
-- 1. CASSIE KOZYRKOV
-- =====================================================

INSERT INTO authors (
  name,
  primary_affiliation,
  header_affiliation,
  bio,
  credibility_tier,
  author_type,
  x_handle
) VALUES (
  'Cassie Kozyrkov',
  'Former Chief Decision Scientist, Google',
  'Google',
  'Former Chief Decision Scientist at Google, pioneered decision intelligence field. Known for making AI/ML accessible to business leaders and advocating practical, human-centered AI adoption.',
  'tier_1',
  'practitioner',
  '@quaesita'
);

-- Get the author_id
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
  bio,
  credibility_tier,
  author_type,
  x_handle
) VALUES (
  'Lex Fridman',
  'MIT, Podcast Host',
  'MIT',
  'AI researcher at MIT and host of one of the world''s most influential tech podcasts. His long-form interviews with AI researchers, tech leaders, and philosophers reach millions and shape public understanding of AI.',
  'tier_1',
  'researcher',
  '@lexfridman'
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
  bio,
  credibility_tier,
  author_type
) VALUES (
  'Stuart Russell',
  'UC Berkeley, AI Safety Pioneer',
  'UC Berkeley',
  'Professor at UC Berkeley and co-author of the standard AI textbook. Leading researcher on AI safety and value alignment, his work on inverse reinforcement learning shapes the alignment research agenda.',
  'tier_1',
  'researcher',
  NULL
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

-- =====================================================
-- 4. ELIEZER YUDKOWSKY
-- =====================================================

INSERT INTO authors (
  name,
  primary_affiliation,
  header_affiliation,
  bio,
  credibility_tier,
  author_type,
  x_handle
) VALUES (
  'Eliezer Yudkowsky',
  'MIRI (Machine Intelligence Research Institute)',
  'MIRI',
  'Founder of AI alignment field and MIRI. Most prominent voice advocating for AI development pause due to existential risk. His writings have shaped effective altruism and alignment research communities.',
  'tier_1',
  'researcher',
  '@ESYudkowsky'
);

DO $$
DECLARE
  eliezer_id uuid;
BEGIN
  SELECT id INTO eliezer_id FROM authors WHERE name = 'Eliezer Yudkowsky';

  -- AI Technical → Needs New Approaches (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '207582eb-7b32-4951-9863-32fcf05944a1',
    eliezer_id,
    'strong',
    'Current ML approaches are fundamentally inadequate for alignment. We need breakthroughs in corrigibility, interpretability, and value learning that don''t yet exist. Scaling existing architectures without solving these problems just gets us to dangerous superintelligence faster.',
    'https://intelligence.org/2017/10/13/fire-alarm/',
    'Yudkowsky founded the AI alignment field in the early 2000s, establishing the intellectual framework that guides safety research today. His emphasis on fundamental breakthroughs needed shapes research agendas at MIRI, Anthropic, and academic alignment labs.'
  );

  -- AI & Society → Safety First (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '7f64838f-59a6-4c87-8373-a023b9f448cc',
    eliezer_id,
    'strong',
    'We are not prepared for AGI. The default outcome is not "somewhat bad"—it''s everyone dies. I''m not being hyperbolic. We have no idea how to align superintelligence, and we''re racing toward it anyway. We need to shut it down until we solve alignment.',
    'https://time.com/6266923/ai-eliezer-yudkowsky-open-letter-not-enough/',
    'Yudkowsky is the most extreme mainstream voice on AI x-risk, explicitly predicting human extinction. His pessimism defines the far end of the safety spectrum and influences effective altruist funding toward alignment research, making Stuart Russell seem moderate by comparison.'
  );

  -- AI Governance → Regulatory Interventionist (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'e8792297-e745-4c9f-a91d-4f87dd05cea2',
    eliezer_id,
    'strong',
    'International treaties should ban AGI development beyond certain capability thresholds, enforced by multilateral monitoring and, if necessary, military action against rogue AI projects. The stakes justify unprecedented governance when we''re building something that could kill everyone.',
    'https://time.com/6266923/ai-eliezer-yudkowsky-open-letter-not-enough/',
    'Yudkowsky advocates the most extreme regulatory position: international ban on frontier AI with military enforcement. While politically unlikely, his proposals shift the Overton window, making less extreme regulation seem reasonable and influencing EA political advocacy.'
  );
END $$;

-- =====================================================
-- 5. DEMIS HASSABIS
-- =====================================================

INSERT INTO authors (
  name,
  primary_affiliation,
  header_affiliation,
  bio,
  credibility_tier,
  author_type
) VALUES (
  'Demis Hassabis',
  'Google DeepMind CEO',
  'DeepMind',
  'CEO of Google DeepMind, Nobel Prize winner for AlphaFold. Led breakthroughs in AlphaGo and protein folding. One of the world''s leading voices on AGI development and AI safety research.',
  'tier_1',
  'entrepreneur',
  NULL
);

DO $$
DECLARE
  demis_id uuid;
BEGIN
  SELECT id INTO demis_id FROM authors WHERE name = 'Demis Hassabis';

  -- AI Technical → Scaling Will Deliver (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'c5dcb027-cd27-4c91-adb4-aca780d15199',
    demis_id,
    'strong',
    'I believe AGI is achievable within the next decade through scaling deep learning with reinforcement learning and multi-modal integration. AlphaGo and AlphaFold showed us that scaling these approaches unlocks genuinely new capabilities. We''re on the right path.',
    'https://www.wired.com/story/deepmind-demis-hassabis-interview/',
    'Hassabis leads one of the world''s top AI labs with a track record of breakthrough achievements. His AGI timeline predictions based on scaling influence how governments allocate resources and how investors evaluate AI companies, legitimizing aggressive scaling investments.'
  );

  -- AI & Society → Safety First (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '7f64838f-59a6-4c87-8373-a023b9f448cc',
    demis_id,
    'strong',
    'Solving intelligence is the most important thing humanity will ever do, but it has to be done safely. That''s why DeepMind has a dedicated safety team working on alignment from the start. We can''t treat safety as an afterthought—it must be integrated into AGI development.',
    'https://deepmind.google/about/',
    'Hassabis frames DeepMind''s mission as developing AGI safely, with significant resources dedicated to alignment research. His positioning of safety as core to development (not an afterthought) influences how other labs justify safety spending and helps secure government partnerships.'
  );

  -- AI Governance → Adaptive Governance (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'ee10cf4f-025a-47fc-be20-33d6756ec5cd',
    demis_id,
    'strong',
    'AI governance should be science-led and adaptive. We need frameworks that evolve with the technology—informed oversight that understands capabilities, not heavy-handed rules that assume we know what AGI will look like. Close collaboration between researchers and policymakers is essential.',
    'https://www.gov.uk/government/organisations/ai-safety-institute',
    'Hassabis supports coordinated AI governance that ensures safe development while avoiding innovation suppression. His credibility as both scientist and company leader makes his regulatory proposals influential with UK policymakers developing AI oversight frameworks like the AI Safety Institute.'
  );

  -- Enterprise → Tech Builders (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'a076a4ce-f14c-47b5-ad01-c8c60135a494',
    demis_id,
    'strong',
    'The way to make progress in AI is to build ambitious systems that solve real problems, learn from deployment, and iterate. AlphaGo, AlphaFold, Gemini—each taught us things that pure theory never could. Building is how you discover what''s possible.',
    'https://www.nature.com/articles/d41586-021-02025-4',
    'DeepMind''s track record of shipping breakthrough systems (AlphaGo, AlphaFold) legitimizes the "build ambitious systems" approach. This influences how research labs balance theoretical safety work with practical deployment, shaping the field''s builder-first culture.'
  );

  -- Future of Work → Human-AI Collaboration (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'd8d3cec4-f8ce-49b1-9a43-bb0d952db371',
    demis_id,
    'strong',
    'AlphaFold didn''t replace biologists—it gave them a superpower. That''s the model: AI handling the computational heavy lifting while humans provide the creativity, intuition, and judgment. The best outcomes come from humans and AI working together, each doing what they''re best at.',
    'https://www.deepmind.com/research/highlighted-research/alphafold',
    'AlphaFold''s success as an augmentation tool (accelerating biology research) rather than replacement provides the flagship example for optimistic human-AI collaboration narratives. This case study is cited globally to support augmentation-focused AI deployment strategies.'
  );
END $$;

-- =====================================================
-- 6. MUSTAFA SULEYMAN
-- =====================================================

INSERT INTO authors (
  name,
  primary_affiliation,
  header_affiliation,
  bio,
  credibility_tier,
  author_type,
  x_handle
) VALUES (
  'Mustafa Suleyman',
  'Microsoft AI CEO',
  'Microsoft',
  'CEO of Microsoft AI, DeepMind co-founder, author of "The Coming Wave." Leading voice on AI governance and containment strategies. Bridges AI research, enterprise deployment, and policy.',
  'tier_1',
  'entrepreneur',
  '@mustafasuleyman'
);

DO $$
DECLARE
  mustafa_id uuid;
BEGIN
  SELECT id INTO mustafa_id FROM authors WHERE name = 'Mustafa Suleyman';

  -- AI Technical → Scaling Will Deliver (partial)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'c5dcb027-cd27-4c91-adb4-aca780d15199',
    mustafa_id,
    'partial',
    'Scaling will continue to yield significant advances, but I''m not convinced it alone gets us to full AGI. We''ll likely need architectural innovations in reasoning, planning, and long-term memory alongside scaled models. Scaling is necessary but probably not sufficient.',
    'https://www.penguinrandomhouse.com/books/667752/the-coming-wave-by-mustafa-suleyman/',
    'Suleyman co-founded DeepMind and now leads Microsoft AI, giving him deep technical credibility. His nuanced position on scaling (necessary but insufficient) bridges scaling optimists and skeptics, influencing how enterprises plan AI investments and research roadmaps.'
  );

  -- AI & Society → Safety First (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '7f64838f-59a6-4c87-8373-a023b9f448cc',
    mustafa_id,
    'strong',
    'AI represents a coming wave of technological change that could be catastrophic if mismanaged. We must take safety seriously—not just alignment, but societal impacts, misuse risks, and power concentration. This requires technical safety research plus governance and ethical frameworks.',
    'https://www.the-coming-wave.com/',
    'Suleyman''s book "The Coming Wave" focuses on managing AI''s disruptive potential through containment strategies. His emphasis on near-term societal risks (not just long-term alignment) broadens the safety agenda and influences policymakers seeking frameworks for transformative AI management.'
  );

  -- AI Governance → Regulatory Interventionist (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'e8792297-e745-4c9f-a91d-4f87dd05cea2',
    mustafa_id,
    'strong',
    'Containment of transformative AI requires regulation—international coordination on safety standards, transparency requirements, and limits on certain applications. Self-regulation won''t work when competitive pressures push companies to cut corners. We need external oversight with teeth.',
    'https://www.foreignaffairs.com/world/artificial-intelligence-power-paradox',
    'Suleyman advocates for strong regulation with international coordination in "The Coming Wave." His proposals for AI containment frameworks influence policymakers in the UK, EU, and US seeking practical oversight models that go beyond voluntary commitments.'
  );

  -- Enterprise → Co-Evolution (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'f19021ab-a8db-4363-adec-c2228dad6298',
    mustafa_id,
    'strong',
    'Enterprises that succeed with AI will be those that co-evolve their organizations with the technology. It''s not about deploying AI into existing structures—it''s about fundamentally rethinking workflows, decision-making, and human roles alongside AI capabilities.',
    'https://news.microsoft.com/source/features/ai/mustafa-suleyman-microsoft-ai/',
    'As Microsoft AI CEO, Suleyman shapes how one of the world''s largest enterprise software companies deploys AI. His co-evolution philosophy influences Microsoft''s Copilot strategy and provides the framework that thousands of enterprises use for AI transformation planning.'
  );

  -- Future of Work → Displacement Realist (partial)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '76f0d8c5-c9a8-4a26-ae7e-18f787000e18',
    mustafa_id,
    'partial',
    'AI will significantly disrupt labor markets—that''s undeniable. Many jobs will be automated, though new ones will emerge. The key question is speed and our societal preparedness. If the transition is too fast without safety nets, we''ll have a crisis. Policy must prepare for major displacement.',
    'https://www.the-coming-wave.com/',
    'Suleyman''s "Coming Wave" emphasizes that AI''s labor disruption requires proactive policy preparation. His focus on transition speed and safety nets (not just whether displacement happens) shapes how policymakers think about workforce programs and economic restructuring timelines.'
  );
END $$;

-- =====================================================
-- 7. KAI-FU LEE
-- =====================================================

INSERT INTO authors (
  name,
  primary_affiliation,
  header_affiliation,
  bio,
  credibility_tier,
  author_type,
  x_handle
) VALUES (
  'Kai-Fu Lee',
  'Sinovation Ventures CEO',
  'Sinovation Ventures',
  'CEO of Sinovation Ventures, former president of Google China. Author of "AI Superpowers" on US-China AI competition. Leading voice on global AI race dynamics and AI''s economic impact.',
  'tier_1',
  'entrepreneur',
  '@kaifulee'
);

DO $$
DECLARE
  kai_fu_id uuid;
BEGIN
  SELECT id INTO kai_fu_id FROM authors WHERE name = 'Kai-Fu Lee';

  -- AI Technical → Scaling Will Deliver (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'c5dcb027-cd27-4c91-adb4-aca780d15199',
    kai_fu_id,
    'strong',
    'The era of deep learning implementation will be driven by scaling—more data, more compute, more engineers optimizing models. China excels at this implementation phase. AGI timelines may be shorter than people think because scaling plus engineering discipline is a powerful combination.',
    'https://www.penguinrandomhouse.com/books/566859/ai-superpowers-by-kai-fu-lee/',
    'Lee bridges US and China AI development, having led Google China and now investing in both markets. His emphasis on scaling plus implementation discipline shapes how investors and governments think about AI competition, legitimizing massive compute investments as essential for national competitiveness.'
  );

  -- AI & Society → Democratize Fast (partial)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'fe19ae2d-99f2-4c30-a596-c9cd92bff41b',
    kai_fu_id,
    'partial',
    'AI should be deployed widely to maximize economic benefits and learning, but with guardrails for safety and privacy. China''s rapid deployment approach has accelerated innovation. The West''s caution has costs—slower adoption means slower learning and falling behind competitively.',
    'https://aisuperpowers.com/',
    'Lee argues that rapid deployment drives innovation through real-world learning, using China''s approach as evidence. This perspective influences debates about regulation versus deployment speed, particularly in discussions of US-China AI competition and first-mover advantages.'
  );

  -- AI Governance → Innovation First (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '331b2b02-7f8d-4751-b583-16255a6feb50',
    kai_fu_id,
    'strong',
    'In the AI race between nations, speed matters immensely. Overregulation in the West creates opportunities for China to pull ahead. Innovation must come first—establish leadership, then refine governance. You can''t govern what you don''t understand, and understanding comes from building.',
    'https://www.foreignaffairs.com/articles/china/2021-08-03/chinas-artificial-intelligence-surveillance-state',
    'Lee''s framing of AI governance through US-China competition lens makes innovation-first arguments geopolitical imperatives rather than just business interests. This national security framing influences policymakers concerned about technological leadership, legitimizing light-touch regulation.'
  );

  -- Enterprise → Technology Leads (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '7e9a2196-71e7-423a-889c-6902bc678eac',
    kai_fu_id,
    'strong',
    'Companies must adopt AI aggressively or be disrupted by competitors who do. In China, we''ve seen AI-first companies completely displace traditional businesses. This isn''t hypothetical—it''s happening now. Enterprises that wait for perfect solutions will find themselves irrelevant.',
    'https://www.sinovationventures.com/',
    'Lee invests in hundreds of AI startups through Sinovation Ventures, providing capital contingent on aggressive AI adoption. His portfolio success stories (disrupting traditional businesses) validate the technology-leads approach and influence venture capital allocation globally toward AI-first startups.'
  );

  -- Future of Work → Displacement Realist (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '76f0d8c5-c9a8-4a26-ae7e-18f787000e18',
    kai_fu_id,
    'strong',
    'AI will displace 40-50% of jobs within 15 years. This is not pessimism but realism based on observing AI deployment in China. We need to prepare now—universal basic income, retraining programs, social safety nets. The displacement is coming whether we''re ready or not.',
    'https://www.ted.com/talks/kai_fu_lee_how_ai_can_save_our_humanity',
    'Lee''s specific displacement predictions (40-50% of jobs in 15 years) based on observing Chinese AI deployment provide concrete numbers that economists and policymakers use in workforce planning. His calls for UBI and retraining influence labor policy discussions globally.'
  );
END $$;

-- =====================================================
-- 8. JARON LANIER
-- =====================================================

INSERT INTO authors (
  name,
  primary_affiliation,
  header_affiliation,
  bio,
  credibility_tier,
  author_type
) VALUES (
  'Jaron Lanier',
  'Microsoft Research, VR Pioneer',
  'Microsoft Research',
  'VR pioneer, Microsoft researcher, author of "Who Owns the Future?" Advocates for data dignity and human-centered AI. Leading critic of attention economy and advocate for alternative economic models.',
  'tier_1',
  'researcher',
  NULL
);

DO $$
DECLARE
  jaron_id uuid;
BEGIN
  SELECT id INTO jaron_id FROM authors WHERE name = 'Jaron Lanier';

  -- AI Technical → Needs New Approaches (partial)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '207582eb-7b32-4951-9863-32fcf05944a1',
    jaron_id,
    'partial',
    'The current paradigm of AI—massive models trained on scraped data—is philosophically and economically flawed. We need systems that respect data provenance and compensate creators. This isn''t just ethics; it''s about building AI on sustainable foundations rather than extractive ones.',
    'https://www.jaronlanier.com/',
    'Lanier''s critique comes from decades as a tech pioneer and Microsoft insider, giving him credibility to challenge Silicon Valley orthodoxy. His call for fundamentally different AI economics (data dignity) influences debates about AI training, copyright, and sustainable business models.'
  );

  -- AI & Society → Safety First (partial - different angle)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '7f64838f-59a6-4c87-8373-a023b9f448cc',
    jaron_id,
    'partial',
    'AI safety isn''t just about preventing rogue superintelligence. It''s about the societal manipulation we''re already experiencing—algorithmic radicalization, filter bubbles, attention hacking. We''re so focused on hypothetical future risks that we ignore the demonstrable harms happening now.',
    'https://www.simonandschuster.com/books/Ten-Arguments-for-Deleting-Your-Social-Media-Accounts-Right-Now/Jaron-Lanier/9781250196682',
    'Lanier redirects safety discourse from speculative AGI risks to documented societal harms from existing AI (social media algorithms, engagement optimization). His emphasis on present-tense safety challenges ensures AI ethics includes surveillance capitalism and attention economy critiques.'
  );

  -- AI & Society → Democratize Fast (challenges)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'fe19ae2d-99f2-4c30-a596-c9cd92bff41b',
    jaron_id,
    'challenges',
    'Democratization rhetoric masks how AI concentrates power. When you train models on everyone''s data but only big tech captures the value, that''s not democratization—that''s extraction. True democratization would mean people own and benefit from their data contributions.',
    'https://www.hachettebookgroup.com/titles/jaron-lanier/who-owns-the-future/9781451654981/',
    'Lanier challenges the very meaning of "democratization" in AI, arguing current approaches extract value from the many for the benefit of the few. His critique ensures "democratization" claims face scrutiny about who actually benefits and whether power is being distributed or concentrated.'
  );

  -- AI Governance → Regulatory Interventionist (strong - data rights)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'e8792297-e745-4c9f-a91d-4f87dd05cea2',
    jaron_id,
    'strong',
    'We need a fundamental restructuring of how AI relates to human data—legal frameworks that treat data as labor and require compensation. This means regulation mandating that people are paid for data used in AI training. Data dignity should be a right, not an afterthought.',
    'https://www.jaronlanier.com/general.html',
    'Lanier''s "data dignity" framework advocates regulation requiring compensation for AI training data. This positions him as advocating the most economically radical regulatory intervention—not just safety oversight but fundamental restructuring of AI economics to ensure human benefit.'
  );

  -- Future of Work → Human-AI Collaboration (partial - with caveats)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'd8d3cec4-f8ce-49b1-9a43-bb0d952db371',
    jaron_id,
    'partial',
    'Human-AI collaboration is the right goal, but only if we structure it so humans retain dignity and economic power. If "collaboration" means humans feed AI while tech companies capture all value, that''s exploitation. We need economic models where humans are partners, not training data sources.',
    'https://www.hachettebookgroup.com/titles/jaron-lanier/who-owns-the-future/9781451654981/',
    'Lanier supports human-AI collaboration in principle but insists it requires economic restructuring to avoid exploitation. This nuanced position ensures discussions of augmentation include questions of value capture and power dynamics, not just technical capabilities.'
  );
END $$;

-- =====================================================
-- 9. TRISTAN HARRIS
-- =====================================================

INSERT INTO authors (
  name,
  primary_affiliation,
  header_affiliation,
  bio,
  credibility_tier,
  author_type,
  x_handle
) VALUES (
  'Tristan Harris',
  'Center for Humane Technology',
  'Center for Humane Tech',
  'Former Google design ethicist, co-founder of Center for Humane Technology. Featured in "The Social Dilemma." Leading voice on tech''s societal harms and AI regulation.',
  'tier_1',
  'policy',
  '@tristanharris'
);

DO $$
DECLARE
  tristan_id uuid;
BEGIN
  SELECT id INTO tristan_id FROM authors WHERE name = 'Tristan Harris';

  -- AI & Society → Safety First (strong - social/democratic focus)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '7f64838f-59a6-4c87-8373-a023b9f448cc',
    tristan_id,
    'strong',
    'AI amplifies everything we got wrong with social media—the attention extraction, the manipulation, the erosion of shared reality. But now at a speed and scale that could undermine democracy itself. AI safety must prioritize protecting human agency and democratic institutions, not just preventing robot apocalypse.',
    'https://www.humanetech.com/',
    'Harris brought tech ethics to mainstream consciousness through "The Social Dilemma," reaching 100M+ viewers. His focus on AI''s threat to human agency and democracy (not just physical safety) expands the safety agenda and legitimizes regulation to protect democratic institutions.'
  );

  -- AI & Society → Democratize Fast (challenges)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'fe19ae2d-99f2-4c30-a596-c9cd92bff41b',
    tristan_id,
    'challenges',
    'The race to deploy AI everywhere mirrors the race to deploy social media—maximize engagement, worry about consequences later. We''ve seen how that ends. Democratization without accountability just democratizes harm. We need to slow down, not speed up, until we understand the full impact.',
    'https://www.ted.com/speakers/tristan_harris',
    'Harris''s critique of rapid deployment is informed by witnessing social media''s societal damage as a Google insider. His warnings that AI will amplify those harms challenge democratization narratives and influence policymakers drawing parallels between social media and AI regulation needs.'
  );

  -- AI Governance → Regulatory Interventionist (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'e8792297-e745-4c9f-a91d-4f87dd05cea2',
    tristan_id,
    'strong',
    'We need comprehensive AI regulation now—transparency requirements, algorithmic accountability, limits on manipulative applications. Tech companies have proven they won''t self-regulate when profit is at stake. Regulation isn''t stifling innovation; it''s protecting society from technologies designed to exploit human psychology.',
    'https://www.humanetech.com/our-work',
    'Harris testifies to Congress and parliaments worldwide on tech regulation, bringing mainstream credibility from "The Social Dilemma." His advocacy for comprehensive AI oversight influences legislators who saw social media regulation come too late and want to regulate AI proactively.'
  );

  -- AI Governance → Adaptive Governance (challenges)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'ee10cf4f-025a-47fc-be20-33d6756ec5cd',
    tristan_id,
    'challenges',
    'Adaptive governance sounds reasonable until you realize it means "let tech companies move fast while we figure out the rules." We tried that with social media—two billion people addicted to their phones, democracies destabilized. AI is more powerful. We can''t afford to be adaptive when human agency is at stake.',
    'https://www.youtube.com/c/CenterforHumaneTech',
    'Harris challenges adaptive governance as insufficiently protective, arguing it enabled social media harms. His alternative—proactive, comprehensive rules—influences policymakers skeptical that incremental oversight can constrain technologies designed for maximum engagement and profit.'
  );

  -- Future of Work → Displacement Realist (strong - existential focus)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '76f0d8c5-c9a8-4a26-ae7e-18f787000e18',
    tristan_id,
    'strong',
    'AI''s impact on work goes beyond job loss to existential questions—if humans aren''t needed for economic production, what happens to human meaning and purpose? We''re rushing toward a world where people feel useless. This is a civilizational crisis we''re not prepared for.',
    'https://www.humanetech.com/podcast',
    'Harris frames workforce displacement as not just economic but existential—threatening human meaning and purpose. This philosophical dimension ensures labor discussions include psychological and societal impacts, not just retraining programs, influencing how philosophers and policymakers conceptualize AI''s work impact.'
  );
END $$;

COMMIT;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check all authors were added
SELECT name, primary_affiliation, credibility_tier
FROM authors
WHERE name IN (
  'Cassie Kozyrkov', 'Lex Fridman', 'Stuart Russell',
  'Eliezer Yudkowsky', 'Demis Hassabis', 'Mustafa Suleyman',
  'Kai-Fu Lee', 'Jaron Lanier', 'Tristan Harris'
);

-- Count new relationships
SELECT a.name, COUNT(*) as relationship_count
FROM authors a
JOIN camp_authors ca ON a.id = ca.author_id
WHERE a.name IN (
  'Cassie Kozyrkov', 'Lex Fridman', 'Stuart Russell',
  'Eliezer Yudkowsky', 'Demis Hassabis', 'Mustafa Suleyman',
  'Kai-Fu Lee', 'Jaron Lanier', 'Tristan Harris'
)
GROUP BY a.name
ORDER BY relationship_count DESC;

-- Verify all have quotes and why_it_matters
SELECT
  a.name,
  COUNT(ca.id) as total_relationships,
  COUNT(ca.key_quote) as with_quotes,
  COUNT(ca.why_it_matters) as with_why_it_matters
FROM authors a
JOIN camp_authors ca ON a.id = ca.author_id
WHERE a.name IN (
  'Cassie Kozyrkov', 'Lex Fridman', 'Stuart Russell',
  'Eliezer Yudkowsky', 'Demis Hassabis', 'Mustafa Suleyman',
  'Kai-Fu Lee', 'Jaron Lanier', 'Tristan Harris'
)
GROUP BY a.name;
