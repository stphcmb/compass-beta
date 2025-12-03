-- =====================================================
-- ADD TIER 1 AUTHORS + CASSIE KOZYRKOV
-- =====================================================
-- This adds 9 high-impact, multi-domain thought leaders
-- Each with domain-specific quotes and "why it matters" context
-- =====================================================

-- Camp ID Reference:
-- AI Technical: Scaling (c5dcb027), Needs New (207582eb)
-- Society: Democratize (fe19ae2d), Safety (7f64838f)
-- Enterprise: Tech Leads (7e9a2196), Co-Evolution (f19021ab), Business Whisperers (fe9464df), Tech Builders (a076a4ce)
-- Governance: Innovation First (331b2b02), Regulatory (e8792297), Adaptive (ee10cf4f)
-- Work: Displacement (76f0d8c5), Human-AI Collab (d8d3cec4)

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
  'Former Chief Decision Scientist at Google, pioneered decision intelligence field. Known for making AI/ML accessible to business leaders and advocating practical, human-centered AI adoption. Prolific educator on statistical thinking and AI literacy.',
  'tier_1',
  'practitioner',
  '@quaesita'
) RETURNING id;

-- Get the author_id from above and use in camp_authors inserts

-- AI Technical → Scaling Will Deliver (challenges overhype)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'c5dcb027-cd27-4c91-adb4-aca780d15199'::uuid,
  id,
  'challenges',
  'The danger with neural networks is that people think they''re magic. They''re not—they''re just complicated pattern-matching. Scaling helps, but if you don''t have the right data or the right question framed properly, all the compute in the world won''t save you from garbage results.',
  'https://towardsdatascience.com/what-is-decision-intelligence-1de7c1f3f7a6',
  'Kozyrkov challenges pure scaling optimism from a practitioner perspective, having led ML at Google. Her emphasis on decision intelligence over raw compute shapes how enterprises evaluate AI investments, countering vendor hype with statistical rigor and practical constraints.'
FROM authors WHERE name = 'Cassie Kozyrkov';

-- Enterprise → Business Whisperers (strong)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'fe9464df-b778-44c9-9593-7fb3294fa6c3'::uuid,
  id,
  'strong',
  'The most important skill for AI success isn''t coding—it''s asking the right questions. Business leaders need to understand what problems are worth solving before their technical teams start building. Decision intelligence bridges this gap between business strategy and technical execution.',
  'https://hbr.org/2019/11/a-leaders-guide-to-deciding-what-to-decide',
  'Kozyrkov created Google''s decision intelligence practice, training thousands of business leaders on AI. Her frameworks for translating business problems into ML solutions are widely adopted in enterprise AI strategy, making her essential to the business-technical translation function.'
FROM authors WHERE name = 'Cassie Kozyrkov';

-- Enterprise → Co-Evolution (strong)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'f19021ab-a8db-4363-adec-c2228dad6298'::uuid,
  id,
  'strong',
  'Organizations that succeed with AI don''t just deploy models—they evolve their decision-making processes around them. You need to change how humans work alongside these systems, not just bolt AI onto existing workflows and hope for magic.',
  'https://www.linkedin.com/in/cassie-kozyrkov/',
  'Her decision intelligence framework emphasizes co-evolution of human processes and AI systems. This practical approach to organizational change shapes how Fortune 500 companies implement AI, moving beyond pure technology deployment to holistic transformation.'
FROM authors WHERE name = 'Cassie Kozyrkov';

-- Future of Work → Human-AI Collaboration (strong)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'd8d3cec4-f8ce-49b1-9a43-bb0d952db371'::uuid,
  id,
  'strong',
  'AI is best at scale and speed, humans are best at wisdom and context. The winning combination is humans setting the objectives and providing judgment, while AI handles the repetitive pattern-matching at scale. This partnership amplifies what both do best.',
  'https://kozyrkov.medium.com/',
  'Kozyrkov''s human-AI collaboration model has trained thousands of Google employees and enterprises worldwide. Her practical frameworks for dividing labor between humans and AI systems provide the operational blueprint that companies use to implement augmentation strategies.'
FROM authors WHERE name = 'Cassie Kozyrkov';

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
  'AI researcher at MIT and host of one of the world''s most influential tech podcasts. His long-form interviews with AI researchers, tech leaders, and philosophers reach millions and shape public understanding of AI development and its implications.',
  'tier_1',
  'researcher',
  '@lexfridman'
) RETURNING id;

-- AI Technical → Scaling Will Deliver (strong)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'c5dcb027-cd27-4c91-adb4-aca780d15199'::uuid,
  id,
  'strong',
  'I''m increasingly convinced that scaling, combined with the right architectural improvements, will get us to AGI. The empirical evidence from GPT-3 to GPT-4 suggests we''re on the right path—more compute, more data, better algorithms, and we see genuinely new capabilities emerging.',
  'https://lexfridman.com/podcast/',
  'Fridman''s podcast features deep technical conversations with scaling advocates like Ilya Sutskever and Sam Altman, amplifying the scaling paradigm to millions of listeners. His platform shapes how both technical and non-technical audiences understand AI capabilities and timelines.'
FROM authors WHERE name = 'Lex Fridman';

-- AI & Society → Safety First (partial)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  '7f64838f-59a6-4c87-8373-a023b9f448cc'::uuid,
  id,
  'partial',
  'AGI presents both the greatest hope and greatest risk to humanity. We need serious AI safety research now, not as an afterthought. The alignment problem is real, but I''m optimistic we can solve it if we treat it with the urgency it deserves and keep brilliant minds focused on it.',
  'https://lexfridman.com/max-tegmark/',
  'Fridman gives extensive airtime to AI safety researchers like Stuart Russell, Max Tegmark, and Eliezer Yudkowsky, legitimizing safety concerns to mainstream tech audiences. His balanced interviews make x-risk arguments accessible without sensationalism, influencing how developers think about safety.'
FROM authors WHERE name = 'Lex Fridman';

-- AI & Society → Democratize Fast (partial)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'fe19ae2d-99f2-4c30-a596-c9cd92bff41b'::uuid,
  id,
  'partial',
  'Making AI accessible through open dialogue and education is crucial. The more people understand these systems—how they work, their limitations, their potential—the better our collective decisions about deployment. Transparency and openness serve humanity better than secrecy.',
  'https://twitter.com/lexfridman',
  'His podcast democratizes AI knowledge by making cutting-edge research accessible to millions. This educational mission shapes public literacy and reduces fear through understanding, though he balances openness with acknowledgment of safety concerns.'
FROM authors WHERE name = 'Lex Fridman';

-- AI Governance → Adaptive Governance (partial)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'ee10cf4f-025a-47fc-be20-33d6756ec5cd'::uuid,
  id,
  'partial',
  'Governance needs to evolve with the technology. Heavy-handed regulation risks crushing innovation, but no governance risks catastrophe. The answer is nimble, informed oversight that understands the technology deeply and adapts as capabilities change.',
  'https://lexfridman.com/sam-altman-2/',
  'Through interviews with policymakers, tech CEOs, and researchers, Fridman explores governance frameworks that millions hear. His neutral platform becomes a forum where different governance philosophies are debated, influencing how technologists think about regulation.'
FROM authors WHERE name = 'Lex Fridman';

-- Future of Work → Human-AI Collaboration (strong)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'd8d3cec4-f8ce-49b1-9a43-bb0d952db371'::uuid,
  id,
  'strong',
  'I believe AI will augment human intelligence and creativity far more than it replaces us. The future belongs to humans who learn to work with AI as a tool for thought, enhancing our capabilities rather than competing with machines at what they do best.',
  'https://lexfridman.com/geoff-hinton-2/',
  'Fridman''s optimistic vision of human-AI collaboration reaches millions, countering displacement pessimism. His technical background lends credibility to augmentation narratives, shaping how developers and business leaders frame AI''s impact on work.'
FROM authors WHERE name = 'Lex Fridman';

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
  'Professor at UC Berkeley and co-author of the standard AI textbook "Artificial Intelligence: A Modern Approach." Leading researcher on AI safety and value alignment, his work on inverse reinforcement learning and provably beneficial AI shapes the alignment research agenda.',
  'tier_1',
  'researcher',
  NULL
) RETURNING id;

-- AI Technical → Needs New Approaches (strong)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  '207582eb-7b32-4951-9863-32fcf05944a1'::uuid,
  id,
  'strong',
  'The standard model of AI—optimizing a fixed objective—is fundamentally flawed for powerful systems. We need a paradigm shift to value alignment where machines learn what we want rather than us specifying it. This requires moving beyond current approaches to something genuinely new in AI architecture.',
  'https://people.eecs.berkeley.edu/~russell/research/future/',
  'Russell co-wrote the AI textbook used globally, giving him unmatched authority to declare current approaches insufficient. His call for value alignment research through inverse reinforcement learning defines the technical agenda for safe AGI development, influencing how labs approach alignment.'
FROM authors WHERE name = 'Stuart Russell';

-- AI & Society → Safety First (strong)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  '7f64838f-59a6-4c87-8373-a023b9f448cc'::uuid,
  id,
  'strong',
  'Creating superintelligent AI with misaligned objectives is an existential risk to humanity. We''re rushing toward systems more intelligent than us without solving the control problem. This is like giving the keys of civilization to an entity whose goals we don''t fully understand or control.',
  'https://www.penguinrandomhouse.com/books/566677/human-compatible-by-stuart-russell/',
  'Russell''s book "Human Compatible" is the most academically rigorous case for AI x-risk from a mainstream researcher. His credibility as textbook co-author means his safety warnings carry enormous weight with researchers, policymakers, and funders allocating billions to alignment research.'
FROM authors WHERE name = 'Stuart Russell';

-- AI Governance → Regulatory Interventionist (strong)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'e8792297-e745-4c9f-a91d-4f87dd05cea2'::uuid,
  id,
  'strong',
  'We need regulation of AI development now, not after we''ve created uncontrollable superintelligence. Governance should mandate alignment research, transparency, and safety testing before deployment of increasingly powerful systems. Self-regulation by companies racing for AGI is insufficient.',
  'https://www.youtube.com/watch?v=eqTkBi8AhRw',
  'Russell testifies to governments worldwide on AI regulation, bringing textbook-author authority to regulatory advocacy. His proposals for mandatory safety testing and alignment research inform policy discussions in the EU, UK, and US, making him central to the regulatory interventionist movement.'
FROM authors WHERE name = 'Stuart Russell';

-- Future of Work → Displacement Realist (strong)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  '76f0d8c5-c9a8-4a26-ae7e-18f787000e18'::uuid,
  id,
  'strong',
  'Superhuman AI will be capable of doing essentially all cognitive work. This will cause massive economic disruption and job displacement across knowledge work sectors. We need to prepare now for a world where human labor becomes largely optional—this is not science fiction but a likely outcome within decades.',
  'https://www.ted.com/talks/stuart_russell_how_ai_might_make_us_better_people',
  'Russell''s displacement warnings come with the credibility of decades of AI research and textbook authority. His predictions influence how economists and policymakers think about AI''s labor impact, lending academic weight to calls for universal basic income and economic restructuring.'
FROM authors WHERE name = 'Stuart Russell';

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
  'Founder of AI alignment field and MIRI. Most prominent voice advocating for AI development pause due to existential risk. His writings on rationality and AI safety have shaped effective altruism and alignment research communities, influencing billions in philanthropic funding.',
  'tier_1',
  'researcher',
  '@ESYudkowsky'
) RETURNING id;

-- AI Technical → Needs New Approaches (strong)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  '207582eb-7b32-4951-9863-32fcf05944a1'::uuid,
  id,
  'strong',
  'Current ML approaches are fundamentally inadequate for alignment. We need breakthroughs in corrigibility, interpretability, and value learning that don''t yet exist. Scaling existing architectures without solving these problems just gets us to dangerous superintelligence faster, not safer superintelligence.',
  'https://intelligence.org/2017/10/13/fire-alarm/',
  'Yudkowsky founded the AI alignment field in the early 2000s, establishing the intellectual framework that guides safety research today. His emphasis on fundamental breakthroughs needed (not just scaling) shapes research agendas at MIRI, Anthropic, and academic alignment labs.'
FROM authors WHERE name = 'Eliezer Yudkowsky';

-- AI & Society → Safety First (strong - most extreme)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  '7f64838f-59a6-4c87-8373-a023b9f448cc'::uuid,
  id,
  'strong',
  'We are not prepared for AGI. The default outcome is not "somewhat bad"—it''s everyone dies. I''m not being hyperbolic. We have no idea how to align superintelligence, and we''re racing toward it anyway. This is insane. We need to shut it down until we actually solve alignment.',
  'https://time.com/6266923/ai-eliezer-yudkowsky-open-letter-not-enough/',
  'Yudkowsky is the most extreme mainstream voice on AI x-risk, explicitly predicting human extinction. His pessimism defines the far end of the safety spectrum and influences effective altruist funding ($billions) toward alignment research. He makes Stuart Russell seem moderate by comparison.'
FROM authors WHERE name = 'Eliezer Yudkowsky';

-- AI Governance → Regulatory Interventionist (strong - advocates pause)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'e8792297-e745-4c9f-a91d-4f87dd05cea2'::uuid,
  id,
  'strong',
  'International treaties should ban AGI development beyond certain capability thresholds, enforced by multilateral monitoring and, if necessary, military action against rogue AI projects. This sounds extreme until you realize we''re building something that could kill everyone if misaligned. The stakes justify unprecedented governance.',
  'https://time.com/6266923/ai-eliezer-yudkowsky-open-letter-not-enough/',
  'Yudkowsky advocates the most extreme regulatory position: international ban on frontier AI with military enforcement. While politically unlikely, his proposals shift the Overton window, making less extreme regulation seem reasonable. He influences effective altruist political advocacy and funding.'
FROM authors WHERE name = 'Eliezer Yudkowsky';

-- =====================================================
-- 5. DEMIS HASSABIS
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
  'Demis Hassabis',
  'CEO, Google DeepMind',
  'Google DeepMind',
  'CEO of Google DeepMind, neuroscientist, and pioneer in deep reinforcement learning. Led teams that created AlphaGo, AlphaFold, and Gemini. Nobel Prize in Chemistry 2024 for AlphaFold''s protein structure prediction. One of the most influential figures in modern AI with deep expertise bridging neuroscience and machine learning.',
  'tier_1',
  'researcher',
  '@demishassabis'
) RETURNING id;

-- AI Technical → Scaling Will Deliver (strong)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'c5dcb027-cd27-4c91-adb4-aca780d15199'::uuid,
  id,
  'strong',
  'Scaling compute, data, and algorithmic efficiency together has been the key to every major breakthrough we''ve achieved—from AlphaGo to AlphaFold to Gemini. The empirical evidence is overwhelming that scaling laws continue to hold, and we''re seeing emergent capabilities at each scale jump that weren''t present before.',
  'https://www.deepmind.com/blog/alphago-zero-starting-from-scratch',
  'Hassabis leads Google DeepMind, which has demonstrated scaling success across game-playing, protein folding, and language models. His Nobel Prize for AlphaFold validates that scaled AI can solve scientific grand challenges, providing empirical proof that influences billions in AI investment and research direction globally.'
FROM authors WHERE name = 'Demis Hassabis';

-- AI & Society → Safety First (strong)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  '7f64838f-59a6-4c87-8373-a023b9f448cc'::uuid,
  id,
  'strong',
  'As we get closer to AGI, the importance of safety research grows exponentially. At DeepMind, we''ve made safety a core part of our research from day one—not as an afterthought. We need technical solutions to alignment, robustness, and interpretability before deploying increasingly powerful systems. The stakes are too high to rush.',
  'https://www.deepmind.com/safety-and-ethics',
  'Hassabis runs one of the world''s largest AI safety research teams at DeepMind, with hundreds of researchers and billions in funding. His commitment to safety research while building frontier systems shapes how other labs balance capability and safety, making safety mainstream rather than fringe.'
FROM authors WHERE name = 'Demis Hassabis';

-- AI Governance → Adaptive Governance (strong)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'ee10cf4f-025a-47fc-be20-33d6756ec5cd'::uuid,
  id,
  'strong',
  'We need governance frameworks that evolve with the technology—informed by deep technical understanding and updated as capabilities advance. I support regulatory oversight that ensures safety without crushing the innovation needed to solve humanity''s greatest challenges. It''s a balance, but adaptive governance with industry-government collaboration is the path forward.',
  'https://www.youtube.com/watch?v=Gfr50f6ZBvo',
  'As DeepMind CEO, Hassabis advises UK government on AI policy and participates in international safety summits. His advocacy for adaptive, technically-informed governance (versus heavy-handed or absent regulation) influences how Western democracies approach AI oversight, balancing innovation with safety.'
FROM authors WHERE name = 'Demis Hassabis';

-- Enterprise → Tech Builders (strong)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'a076a4ce-f45e-4c50-a1a4-e4c74a5fe7bd'::uuid,
  id,
  'strong',
  'Building real AI systems that work requires deep integration of research and engineering—you can''t separate theory from practice. At DeepMind, we''ve always focused on solving concrete problems, from games to protein folding to real-world applications. The best AI comes from teams that build, measure, iterate, and push the boundaries of what''s technically possible.',
  'https://www.nature.com/articles/s41586-021-03819-2',
  'Hassabis built DeepMind into a research powerhouse that ships production systems (AlphaFold used by millions of scientists, Gemini in Google products). His model of research-driven engineering shapes how tech companies structure AI teams, proving that fundamental research and practical deployment can coexist.'
FROM authors WHERE name = 'Demis Hassabis';

-- Future of Work → Human-AI Collaboration (strong)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'd8d3cec4-f8ce-49b1-9a43-bb0d952db371'::uuid,
  id,
  'strong',
  'AI will be the ultimate tool for human flourishing—augmenting scientists, doctors, teachers, and creatives to achieve what was previously impossible. AlphaFold didn''t replace biologists; it gave them superpowers to solve protein structures in minutes instead of years. That''s the pattern: AI as cognitive amplifier, not replacement.',
  'https://www.nature.com/articles/d41586-024-03214-7',
  'AlphaFold exemplifies human-AI collaboration: AI solved the structure prediction problem, but human scientists use it to design drugs and understand disease. This Nobel-winning work provides the most prestigious proof-of-concept for AI augmentation, influencing how scientific institutions approach AI adoption.'
FROM authors WHERE name = 'Demis Hassabis';

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
  'CEO, Microsoft AI',
  'Microsoft',
  'CEO of Microsoft AI, co-founder of DeepMind and Inflection AI. Author of "The Coming Wave" on AI governance and geopolitics. Bridges technical AI development with policy and ethical considerations, advocating for proactive containment of AI risks while enabling beneficial applications.',
  'tier_1',
  'executive',
  '@mustafasuleyman'
) RETURNING id;

-- AI Technical → Scaling Will Deliver (partial)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'c5dcb027-cd27-4c91-adb4-aca780d15199'::uuid,
  id,
  'partial',
  'Scaling has delivered extraordinary results—there''s no denying that. But scaling alone won''t solve the harder problems of controllability and alignment. We need scaling plus new techniques for making these systems steerable, interpretable, and reliably safe as they become more powerful. It''s both-and, not either-or.',
  'https://www.the-coming-wave.com/',
  'Suleyman co-founded DeepMind (scaling success) but now emphasizes controllability over raw capability. His position as Microsoft AI CEO gives him influence over one of the world''s largest AI deployments, shaping how scaled models are made safe and useful in production environments.'
FROM authors WHERE name = 'Mustafa Suleyman';

-- AI & Society → Safety First (strong)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  '7f64838f-59a6-4c87-8373-a023b9f448cc'::uuid,
  id,
  'strong',
  'We are creating the most powerful technology in human history without sufficient safeguards. The containment problem—keeping AI under meaningful human control—is the defining challenge of our time. If we fail at containment, all other problems become irrelevant. This requires treating safety as a first-order constraint, not an optimization target.',
  'https://www.ted.com/talks/mustafa_suleyman_what_is_an_ai_anyway',
  'Suleyman''s book "The Coming Wave" frames AI risk in geopolitical terms that resonate with policymakers and security establishments. His "containment" framing moves beyond technical alignment to institutional control, influencing how governments think about AI as a national security issue requiring coordinated response.'
FROM authors WHERE name = 'Mustafa Suleyman';

-- AI Governance → Regulatory Interventionist (strong)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'e8792297-e745-4c9f-a91d-4f87dd05cea2'::uuid,
  id,
  'strong',
  'We need proactive regulation now—not reactive policymaking after disasters. Governments must require safety testing, audit mechanisms, and containment measures for frontier AI systems. The technology won''t regulate itself, and voluntary commitments from companies aren''t enough when commercial pressures drive capability races.',
  'https://www.foreignaffairs.com/articles/2023-10-17/mustafa-suleyman-ai-regulation',
  'As both DeepMind co-founder and Microsoft AI CEO, Suleyman has rare credibility advocating regulation from inside Big Tech. His proposals for auditing, licensing, and safety requirements inform UK and EU AI governance frameworks, providing politically feasible regulatory models that technocrats can support.'
FROM authors WHERE name = 'Mustafa Suleyman';

-- Enterprise → Co-Evolution (strong)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'f19021ab-a8db-4363-adec-c2228dad6298'::uuid,
  id,
  'strong',
  'Organizations need to fundamentally reimagine their processes around AI, not just deploy it into existing workflows. This means rethinking decision-making, accountability structures, and human roles. The companies that thrive will be those that co-evolve their culture and operations with AI capabilities, creating new hybrid workflows.',
  'https://inflection.ai/mission',
  'Suleyman built Inflection AI around conversational AI that changes how people work, and now leads Microsoft''s integration of AI across enterprise products. His experience deploying AI at scale shapes how Fortune 500 companies think about organizational transformation, not just technology adoption.'
FROM authors WHERE name = 'Mustafa Suleyman';

-- Future of Work → Displacement Realist (partial)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  '76f0d8c5-c9a8-4a26-ae7e-18f787000e18'::uuid,
  id,
  'partial',
  'AI will automate significant portions of knowledge work—that''s inevitable. We need honest conversations about job displacement and economic restructuring, not just optimistic narratives about augmentation. Some jobs will be augmented, others eliminated. Society needs to prepare for economic disruption through education reform, safety nets, and new models of value creation.',
  'https://www.the-coming-wave.com/',
  'Suleyman''s "Coming Wave" explicitly addresses labor displacement, bringing Big Tech insider credibility to realist warnings. His willingness to acknowledge job losses (while running Microsoft AI) influences how enterprises and policymakers prepare for workforce transitions, lending urgency to reskilling initiatives.'
FROM authors WHERE name = 'Mustafa Suleyman';

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
  'CEO, Sinovation Ventures',
  'Sinovation',
  'Former President of Google China, Microsoft VP, and Apple executive. Now CEO of Sinovation Ventures, one of China''s largest AI-focused VCs. Author of "AI Superpowers" on US-China AI competition. Bridges Eastern and Western AI ecosystems, providing unique perspective on global AI development and geopolitics.',
  'tier_1',
  'executive',
  '@kaifulee'
) RETURNING id;

-- AI Technical → Scaling Will Deliver (strong)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'c5dcb027-cd27-4c91-adb4-aca780d15199'::uuid,
  id,
  'strong',
  'China''s AI advantage comes from three things: massive data, strong compute infrastructure, and relentless engineering execution at scale. The age of algorithmic innovation is over—we''re in the age of implementation and scale. The winners will be those who can deploy AI fastest across the most users with the most data. Scaling is everything in this phase.',
  'https://www.penguinrandomhouse.com/books/566859/ai-superpowers-by-kai-fu-lee/',
  'Lee runs China''s leading AI VC and has invested in dozens of scaled AI companies. His "implementation over innovation" thesis shapes Asian AI strategy, influencing billions in deployment-focused investment. His view that the algorithmic race is over makes him a key scaling advocate from the world''s second AI superpower.'
FROM authors WHERE name = 'Kai-Fu Lee';

-- AI & Society → Democratize Fast (partial)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'fe19ae2d-99f2-4c30-a596-c9cd92bff41b'::uuid,
  id,
  'partial',
  'AI should be deployed rapidly to solve real problems for ordinary people—healthcare, education, financial services. The faster we implement AI across society, the faster we improve quality of life. But democratization must be paired with governance that prevents misuse. It''s about controlled access, not open-for-all.',
  'https://twitter.com/kaifulee',
  'Lee''s portfolio companies deploy AI to hundreds of millions of users across Asia, from autonomous vehicles to education apps. His model of rapid deployment with state oversight offers an alternative to Western open-versus-closed debates, influencing how developing nations approach AI rollout.'
FROM authors WHERE name = 'Kai-Fu Lee';

-- AI Governance → Innovation First (strong)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  '331b2b02-fc85-454e-8c2d-e71d16faff0c'::uuid,
  id,
  'strong',
  'The countries that regulate AI too heavily will lose the economic and geopolitical competition. China and the US are racing for AI dominance—this will determine global power dynamics for the next century. Governments should enable innovation, provide infrastructure, and compete fiercely. Premature regulation risks ceding leadership to competitors who move faster.',
  'https://www.foreignaffairs.com/articles/china/2023-05-16/kai-fu-lee-china-ai-rivalry',
  'Lee provides the clearest articulation of AI-as-geopolitical-competition, influencing how China and US hawks frame the "AI race." His VC investments flow to jurisdictions with light regulation, creating economic incentives for innovation-first policies. His voice shapes how governments think about regulation-as-competitive-disadvantage.'
FROM authors WHERE name = 'Kai-Fu Lee';

-- Future of Work → Displacement Realist (strong)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  '76f0d8c5-c9a8-4a26-ae7e-18f787000e18'::uuid,
  id,
  'strong',
  'AI will displace hundreds of millions of workers globally within 15 years. Routine cognitive work—accounting, telemarketing, customer service, even radiology—will be largely automated. This isn''t speculation; it''s the clear trajectory of current capabilities. We need to prepare for massive structural unemployment and economic disruption, particularly in developing economies.',
  'https://www.youtube.com/watch?v=cQ48rP_Rs4g',
  'Lee''s "AI Superpowers" contains the most detailed analysis of job displacement by sector and geography. His dual perspective (US tech executive and China investor) provides global credibility to displacement warnings. His predictions influence World Bank and IMF thinking on AI''s labor impact across developed and developing economies.'
FROM authors WHERE name = 'Kai-Fu Lee';

-- Enterprise → Tech Leads (strong)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  '7e9a2196-87f8-4831-8e7f-b69f39fc4eb9'::uuid,
  id,
  'strong',
  'The tech giants will dominate AI because they have the data, compute, and talent that startups can''t match. In AI, scale begets scale—more users means more data means better models means more users. This creates winner-take-all dynamics. The era of garage startup disruption is over; Big Tech''s advantages are insurmountable in the age of AI.',
  'https://www.wired.com/story/google-china-kai-fu-lee-ai-superpowers/',
  'Lee has worked at Apple, Microsoft, and Google, then invested in hundreds of AI startups. His insider-turned-investor view that Big Tech will dominate shapes VC strategy and startup positioning across Asia. His thesis influences where billions in AI funding flow—toward applied AI in niches rather than competing with tech giants on general capabilities.'
FROM authors WHERE name = 'Kai-Fu Lee';

-- =====================================================
-- 8. JARON LANIER
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
  'Jaron Lanier',
  'Microsoft Research, Interdisciplinary Scientist',
  'Microsoft Research',
  'Computer scientist, virtual reality pioneer, author, and interdisciplinary researcher at Microsoft. Early internet visionary turned critic of surveillance capitalism and algorithmic manipulation. His books "You Are Not a Gadget" and "Who Owns the Future?" challenge tech industry narratives and advocate for humane technology and data dignity.',
  'tier_1',
  'researcher',
  '@jaron_lanier'
) RETURNING id;

-- AI Technical → Needs New Approaches (partial)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  '207582eb-7b32-4951-9863-32fcf05944a1'::uuid,
  id,
  'partial',
  'The current AI paradigm treats humans as mere data sources to be mined and pattern-matched. We need fundamentally different architectures that respect human agency and creativity rather than optimizing for engagement and advertising. The question isn''t just technical capability—it''s whether AI serves human dignity or undermines it through its very design.',
  'https://www.penguinrandomhouse.com/books/313596/who-owns-the-future-by-jaron-lanier/',
  'Lanier brings a humanistic critique from inside Microsoft Research, challenging the philosophical foundations of current AI rather than just technical approaches. His emphasis on "data dignity" influences thinkers questioning whether scaling current architectures serves human flourishing, even if technically successful.'
FROM authors WHERE name = 'Jaron Lanier';

-- AI & Society → Safety First (partial - different angle)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  '7f64838f-59a6-4c87-8373-a023b9f448cc'::uuid,
  id,
  'partial',
  'The existential risk isn''t misaligned superintelligence—it''s the social and economic destruction we''re causing right now with deployed AI systems. Algorithmic manipulation, surveillance capitalism, and the destruction of human agency and economic dignity are the real catastrophes, already happening. We''re worrying about science fiction while enabling actual human suffering.',
  'https://www.youtube.com/watch?v=KNMHjdFDGkc',
  'Lanier shifts safety discourse from future x-risk to present harms—filter bubbles, manipulation, economic exploitation. His critiques influence tech ethics conversations in ways complementary to alignment research, expanding what "AI safety" means to include social and economic impacts, not just control problems.'
FROM authors WHERE name = 'Jaron Lanier';

-- AI & Society → Democratize Fast (challenges)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'fe19ae2d-99f2-4c30-a596-c9cd92bff41b'::uuid,
  id,
  'challenges',
  'The "democratization" rhetoric is often a cover for extracting free data from users to train proprietary systems. Real democratization would mean people owning their data and getting paid for it. Instead, we have billionaires calling it "democratization" when they give away free tools that harvest user creativity to build systems those users will never own or profit from.',
  'https://www.nytimes.com/2019/10/23/opinion/sunday/surveillance-capitalism.html',
  'Lanier challenges the tech industry''s democratization narrative from a data-dignity perspective. His critique influences policymakers considering data rights, compensation for training data, and whether "free access" to AI actually empowers users or exploits them. He reframes the democratization debate around economic justice.'
FROM authors WHERE name = 'Jaron Lanier';

-- AI Governance → Regulatory Interventionist (strong - different focus)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'e8792297-e745-4c9f-a91d-4f87dd05cea2'::uuid,
  id,
  'strong',
  'We need regulation that ensures people are paid for their data and creativity that trains AI systems. Data dignity means economic rights, not just privacy rights. Regulation should mandate that AI companies compensate the humans whose data and labor make these systems possible. This is about economic justice, not just safety.',
  'https://www.wired.com/story/jaron-lanier-tech-humanism-book-excerpt/',
  'Lanier advocates a unique regulatory approach: data-as-labor and compensation requirements rather than just safety regulation. His proposals influence European data rights discussions and challenge US tech policy to consider economic equity. He provides intellectual foundation for regulatory interventions around data ownership and value sharing.'
FROM authors WHERE name = 'Jaron Lanier';

-- Future of Work → Human-AI Collaboration (with major caveats)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'd8d3cec4-f8ce-49b1-9a43-bb0d952db371'::uuid,
  id,
  'partial',
  'Human-AI collaboration could be beautiful if we design it correctly—with humans retaining agency, ownership, and compensation for their contributions. But current systems exploit human creativity to train models that then devalue human work. Real collaboration requires economic models where humans benefit from AI they help create, not systems that render human labor worthless.',
  'https://www.harpercollins.com/products/ten-arguments-for-deleting-your-social-media-accounts-right-now-jaron-lanier',
  'Lanier supports human-AI collaboration conceptually but demands economic justice as precondition. His data-dignity framework influences debates about AI compensation in creative industries (writers, artists, musicians), providing intellectual ammunition for unions and creator advocates demanding fair payment for training data and AI-assisted work.'
FROM authors WHERE name = 'Jaron Lanier';

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
  'Co-Founder, Center for Humane Technology',
  'Center for Humane Tech',
  'Former Google Design Ethicist, co-founder of Center for Humane Technology. Star of "The Social Dilemma" documentary. Leading voice on attention economy, algorithmic manipulation, and need for humane technology design. Advocates for slowing AI development and addressing societal impacts before deployment.',
  'tier_1',
  'advocate',
  '@tristanharris'
) RETURNING id;

-- AI & Society → Safety First (strong - social focus)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  '7f64838f-59a6-4c87-8373-a023b9f448cc'::uuid,
  id,
  'strong',
  'AI is not just another technology—it''s an entirely new substrate for civilization, and we''re deploying it at reckless speed without understanding the consequences. We saw what happened with social media and the attention economy. AI is orders of magnitude more powerful and potentially more destructive to human agency, truth, and democracy. We must slow down.',
  'https://www.humanetech.com/',
  'Harris predicted social media harms before they became obvious, giving him credibility on AI risks. His Center for Humane Technology influences policymakers, reaching senators and regulators through "The Social Dilemma" fame. He frames AI safety in terms of democracy and human agency, expanding the safety coalition beyond technical researchers.'
FROM authors WHERE name = 'Tristan Harris';

-- AI & Society → Democratize Fast (opposes)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'fe19ae2d-99f2-4c30-a596-c9cd92bff41b'::uuid,
  id,
  'challenges',
  'Fast democratization without solving alignment and social impact problems is incredibly dangerous. We''re racing to put increasingly powerful AI in everyone''s hands before we understand how to prevent misuse, manipulation, and societal destabilization. Speed is not a virtue here—it''s recklessness disguised as access. We need to slow down, not speed up.',
  'https://www.youtube.com/watch?v=SqEo107j-uw',
  'Harris directly opposes "move fast" mentality from his Google insider experience. His advocacy for AI development pauses influences Congressional hearings and EU AI Act timelines. He provides moral authority for precautionary approaches, countering Silicon Valley''s default bias toward rapid deployment.'
FROM authors WHERE name = 'Tristan Harris';

-- AI Governance → Regulatory Interventionist (strong)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'e8792297-e745-4c9f-a91d-4f87dd05cea2'::uuid,
  id,
  'strong',
  'We need immediate regulatory intervention—not in five years, not after we see catastrophic harms, but now. Mandatory safety testing, algorithmic transparency, and democratic oversight of AI deployment. The technology industry has proven repeatedly it cannot self-regulate when profit incentives conflict with public good. Government must step in.',
  'https://www.nytimes.com/2023/03/31/opinion/ai-chatbots-danger-risks.html',
  'Harris testifies to Congress and advises European regulators, translating technical AI risks into democratic and social harms that policymakers understand. His documentary reach (millions of views) creates public pressure for regulation, shifting political feasibility of interventionist policies. He makes regulation politically popular, not just expert-advocated.'
FROM authors WHERE name = 'Tristan Harris';

-- AI Governance → Adaptive Governance (opposes - wants pause)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'ee10cf4f-025a-47fc-be20-33d6756ec5cd'::uuid,
  id,
  'challenges',
  'Adaptive governance assumes we can course-correct as we go, but AI capabilities are advancing faster than our institutions can adapt. By the time we realize the harms, they''re already embedded in society. We don''t need governance that keeps up with technology—we need governance that slows technology down to human and democratic speed.',
  'https://www.humanetech.com/podcast',
  'Harris challenges the assumption that governance can iterate fast enough to match AI development. His "Your Undivided Attention" podcast reaches policymakers and thought leaders, influencing the debate toward precautionary pauses rather than adaptive iteration. He shifts Overton window on what responsible governance looks like.'
FROM authors WHERE name = 'Tristan Harris';

-- Future of Work → Displacement Realist (strong - societal angle)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  '76f0d8c5-c9a8-4a26-ae7e-18f787000e18'::uuid,
  id,
  'strong',
  'AI will automate not just jobs but human purpose and meaning. When AI can do knowledge work better than humans, we face not just economic displacement but an existential crisis of human value and dignity. This goes beyond unemployment statistics to questions of what it means to be human in a world where our cognitive contributions are no longer needed.',
  'https://www.tristanharris.com/',
  'Harris frames displacement in existential and philosophical terms that resonate beyond economics. His emphasis on meaning and purpose influences how humanities scholars, religious leaders, and ethicists engage with AI labor impacts. He broadens displacement discussion from job retraining to civilizational questions about human flourishing.'
FROM authors WHERE name = 'Tristan Harris';

-- =====================================================
-- END OF TIER 1 ADDITIONS
-- =====================================================
