-- Seed data generated from mvp_database.md (32 authors + taxonomy)
-- Assumes schema from Docs/schema.sql has been applied.
-- Run in Supabase SQL editor. Uses ON CONFLICT guards to be idempotent.

-- 1) Camps (taxonomy mapped to domains)
INSERT INTO camps (name, domain, position_summary) VALUES
  ('Scaling Maximalists', 'Technology', 'Aggressive scaling of models/compute as primary path to progress'),
  ('Grounding Realists', 'Technology', 'Skeptical of pure scaling; emphasize new architectures/world models'),
  ('Capabilities Realist with Safety Focus', 'Technology', 'Progress acknowledged with explicit safety emphasis'),
  ('Tech Utopians', 'Society', 'Optimistic on AI societal outcomes with minimal focus on harms'),
  ('Tech Realists', 'Society', 'Balanced societal view; practical focus on near-term realities'),
  ('Ethical Stewards', 'Society', 'Prioritize harms, ethics, and societal impacts of AI'),
  ('Tech-First', 'Business', 'Enterprise adoption led by technology and infrastructure scaling'),
  ('Human-Centric', 'Business', 'Enterprise adoption centered on augmentation and people/process'),
  ('Platform/Ecosystem', 'Business', 'Ecosystem builders and open platform advocates'),
  ('Human-AI Collaboration', 'Workers', 'Partnership model between humans and AI in work'),
  ('Displacement Realists', 'Workers', 'Expect significant near-term displacement and disruption of labor'),
  ('Regulatory Interventionists', 'Policy & Regulation', 'Advocate strong regulation and guardrails'),
  ('Innovation-First', 'Policy & Regulation', 'Prefer light-touch regulation; prioritize innovation'),
  ('Adaptive Governance', 'Policy & Regulation', 'Balanced, adaptive, international governance approaches')
ON CONFLICT (name) DO NOTHING;

-- 2) Authors (subset with rich metadata; rest added with lighter metadata)
-- Format: name, affiliation, credibility_tier, author_type, position_summary
INSERT INTO authors (name, affiliation, credibility_tier, author_type, position_summary) VALUES
  ('Sam Altman', 'OpenAI', 'Major Voice', 'Executive', 'Aggressive AGI optimist; rapid scaling and deployment; safety via iteration'),
  ('Dario Amodei', 'Anthropic', 'Seminal Thinker', 'Executive/Researcher', 'Safety-focused scaling; dramatic upside and risks; transparent risk policies'),
  ('Ilya Sutskever', 'Safe Superintelligence Inc.', 'Seminal Thinker', 'Researcher', 'Monk-mode safety focus; beyond scaling; agentic systems need new paradigms'),
  ('Geoffrey Hinton', 'University of Toronto', 'Seminal Thinker', 'Academic/Researcher', 'Leading safety advocate; non-trivial extinction risk; compute for safety research'),
  ('Yann LeCun', 'Meta / NYU', 'Seminal Thinker', 'Executive/Researcher', 'LLMs near end; world models/JEPA next; strong open-source advocate'),
  ('Yoshua Bengio', 'Université de Montréal / MILA', 'Seminal Thinker', 'Academic/Researcher', 'International AI Safety Report; LawZero; goal misalignment concerns'),
  ('Demis Hassabis', 'Google DeepMind', 'Seminal Thinker', 'Executive/Researcher', 'AGI 5–10 years; radical abundance; dual risks; adaptive regulation'),
  ('Jensen Huang', 'NVIDIA', 'Major Voice', 'Executive', 'Accelerated computing; AI factories; physical AI next frontier'),
  ('Satya Nadella', 'Microsoft', 'Major Voice', 'Executive', 'Copilot philosophy; human augmentation; manage unintended consequences'),
  ('Sundar Pichai', 'Google/Alphabet', 'Major Voice', 'Executive', 'Gemini era; democratize AI; responsible innovation; move faster 2025'),
  ('Mark Zuckerberg', 'Meta', 'Major Voice', 'Executive', 'Open source AI as path forward; ecosystem and developer-first strategy'),
  ('Emily M. Bender', 'University of Washington', 'Seminal Thinker', 'Academic/Researcher', 'Stochastic parrots critique; labor/environment costs; harms-first lens'),
  ('Timnit Gebru', 'DAIR', 'Seminal Thinker', 'Academic/Researcher', 'Algorithmic bias leader; independent institute; systems-of-power critique'),
  ('Kate Crawford', 'USC / Microsoft Research', 'Seminal Thinker', 'Academic/Researcher', 'Material infrastructure of AI; extraction, energy, hidden labor'),
  ('Gary Marcus', 'NYU Emeritus', 'Major Voice', 'Academic/Researcher', 'LLM limitations; neurosymbolic advocacy; near-term harms focus'),
  ('Ethan Mollick', 'Wharton', 'Major Voice', 'Academic/Researcher/Practitioner', 'Co-intelligence adoption; practical near-term transformation'),
  ('Andrew Ng', 'DeepLearning.AI / Stanford', 'Seminal Thinker', 'Academic/Entrepreneur', 'Democratization; agentic workflows; application-layer opportunity'),
  ('Erik Brynjolfsson', 'Stanford', 'Seminal Thinker', 'Academic/Researcher', 'Productivity J-curve; skill leveling; task-based augmentation'),
  ('Fei-Fei Li', 'Stanford HAI', 'Seminal Thinker', 'Academic/Entrepreneur', 'Human-centered AI; policy on science not sci-fi; ecosystem diversity'),
  -- Lighter metadata (20–32): names and approximate types/tiers
  ('Marc Andreessen', 'Andreessen Horowitz', 'Major Voice', 'Investor', 'Tech utopian; scaling maximalist; innovation-first governance'),
  ('Reid Hoffman', 'Greylock', 'Major Voice', 'Investor', 'Pragmatic optimist; deployment-first with guardrails'),
  ('Elon Musk', 'xAI', 'Major Voice', 'Executive', 'Paradoxical: risk rhetoric with aggressive building; containment focus'),
  ('Balaji Srinivasan', 'Network State', 'Major Voice', 'Investor', 'Institutional revolutionary; innovation-first, anti-state'),
  ('Andrej Karpathy', 'Eureka Labs', 'Major Voice', 'Researcher', 'Pragmatic realist; open science advocate; ~10y AGI view'),
  ('Mustafa Suleyman', 'Microsoft AI', 'Major Voice', 'Executive', 'Responsible accelerationist with containment focus'),
  ('Clement Delangue', 'Hugging Face', 'Major Voice', 'Executive', 'Open-source democratizer; platform enabler'),
  ('Allie K. Miller', 'Independent', 'Major Voice', 'Advisor', 'Practical enterprise implementation; balanced oversight'),
  ('Ben Thompson', 'Stratechery', 'Major Voice', 'Analyst', 'Platforms matter; incremental progress'),
  ('Azeem Azhar', 'Exponential View', 'Major Voice', 'Analyst', 'Transformation realist; steady adoption'),
  ('Jason Lemkin', 'SaaStr', 'Major Voice', 'Analyst', 'SaaS parity in 2025; pragmatic/incremental'),
  ('Sam Harris', 'Making Sense', 'Major Voice', 'Commentator', 'Alignment risk advocate; pro-regulation'),
  ('Max Tegmark', 'MIT/FLI', 'Seminal Thinker', 'Academic/Advocate', 'Existential risk focus; strong regulation')
ON CONFLICT DO NOTHING;

-- 3) Camp affiliations (primary => strong, secondary => partial)
-- Helper function for brevity: we will use subselects to resolve ids
-- Example mapping for a subset; extendable as needed.
INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance)
SELECT c.id, a.id, 'Primary fit per taxonomy', 'strong'
FROM camps c, authors a
WHERE c.name = 'Scaling Maximalists' AND a.name IN ('Sam Altman', 'Dario Amodei', 'Jensen Huang', 'Mark Zuckerberg', 'Demis Hassabis');

INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance)
SELECT c.id, a.id, 'Primary fit per taxonomy', 'strong'
FROM camps c, authors a
WHERE c.name = 'Grounding Realists' AND a.name IN ('Yann LeCun', 'Ilya Sutskever', 'Gary Marcus');

INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance)
SELECT c.id, a.id, 'Primary fit per taxonomy', 'strong'
FROM camps c, authors a
WHERE c.name = 'Ethical Stewards' AND a.name IN ('Emily M. Bender', 'Timnit Gebru', 'Kate Crawford', 'Geoffrey Hinton', 'Yoshua Bengio');

INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance)
SELECT c.id, a.id, 'Primary fit per taxonomy', 'strong'
FROM camps c, authors a
WHERE c.name = 'Human-AI Collaboration' AND a.name IN ('Andrew Ng', 'Ethan Mollick', 'Erik Brynjolfsson', 'Satya Nadella', 'Fei-Fei Li');

INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance)
SELECT c.id, a.id, 'Primary fit per taxonomy', 'strong'
FROM camps c, authors a
WHERE c.name = 'Tech-First' AND a.name IN ('Jensen Huang', 'Sam Altman', 'Dario Amodei');

INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance)
SELECT c.id, a.id, 'Primary fit per taxonomy', 'strong'
FROM camps c, authors a
WHERE c.name = 'Platform/Ecosystem' AND a.name IN ('Mark Zuckerberg', 'Clement Delangue');

INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance)
SELECT c.id, a.id, 'Primary fit per taxonomy', 'strong'
FROM camps c, authors a
WHERE c.name = 'Regulatory Interventionists' AND a.name IN ('Timnit Gebru', 'Emily M. Bender', 'Kate Crawford', 'Gary Marcus', 'Yoshua Bengio', 'Max Tegmark');

INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance)
SELECT c.id, a.id, 'Primary fit per taxonomy', 'strong'
FROM camps c, authors a
WHERE c.name = 'Innovation-First' AND a.name IN ('Marc Andreessen', 'Mark Zuckerberg', 'Jensen Huang', 'Balaji Srinivasan');

INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance)
SELECT c.id, a.id, 'Balanced governance stance', 'partial'
FROM camps c, authors a
WHERE c.name = 'Adaptive Governance' AND a.name IN ('Sam Altman', 'Reid Hoffman', 'Fei-Fei Li', 'Satya Nadella', 'Sundar Pichai');

-- 4) Topics (common)
INSERT INTO topics (name) VALUES
  ('Agentic AI'), ('Open Source AI'), ('AI Regulation'), ('AI Safety'), ('Workforce Reskilling'),
  ('Productivity J-Curve'), ('World Models'), ('JEPA'), ('Human-AI Collaboration'), ('Enterprise Adoption')
ON CONFLICT (name) DO NOTHING;

-- 5) Sources (subset, recent 2024-2025), linked by author name
-- Helper: a small inline function is not possible in SQL here; use subselects.
INSERT INTO sources (author_id, title, url, type, summary, published_date, domain) VALUES
  ((SELECT id FROM authors WHERE name = 'Sam Altman'), 'TED/Talk/Interview Selections 2025', 'https://example.com/altman-2025', 'Interview', 'AGI optimism, commercialization velocity; safety via deployment', '2025-02-01', 'Technology'),
  ((SELECT id FROM authors WHERE name = 'Dario Amodei'), 'Machines of Loving Grace', 'https://darioamodei.com', 'Essay', 'Upside and risks of AI; compressing a century in a decade', '2024-10-11', 'Technology'),
  ((SELECT id FROM authors WHERE name = 'Ilya Sutskever'), 'NeurIPS 2024: Peak Data', 'https://example.com/sutskever-neurips-2024', 'Talk', 'Pre-training as we know it will end; agentic systems ahead', '2024-12-10', 'Technology'),
  ((SELECT id FROM authors WHERE name = 'Geoffrey Hinton'), 'Nobel Banquet Speech 2024', 'https://www.nobelprize.org', 'Speech', 'Non-trivial extinction risk; compute for safety research', '2024-12-10', 'Society'),
  ((SELECT id FROM authors WHERE name = 'Yann LeCun'), 'Davos 2025: World Models over LLMs', 'https://example.com/lecun-davos-2025', 'Interview', 'LLMs nearing end; JEPA and grounded AI next', '2025-02-11', 'Technology'),
  ((SELECT id FROM authors WHERE name = 'Yoshua Bengio'), 'International AI Safety Report 2025', 'https://arxiv.org/abs/2501.12345', 'Report', 'Global assessment of AI risks; policy guidance', '2025-01-29', 'Policy & Regulation'),
  ((SELECT id FROM authors WHERE name = 'Demis Hassabis'), '60 Minutes 2025: Radical Abundance', 'https://example.com/hassabis-60m-2025', 'Interview', 'AGI 5–10 years; dual risk framing; adaptive regulation', '2025-04-20', 'Technology'),
  ((SELECT id FROM authors WHERE name = 'Jensen Huang'), 'CES 2025 Keynote', 'https://nvidia.com', 'Keynote', 'Accelerated computing tipping point; physical AI', '2025-01-07', 'Business'),
  ((SELECT id FROM authors WHERE name = 'Satya Nadella'), 'WEF 2024 Interview', 'https://weforum.org', 'Interview', 'Unintended consequences management; augmentation via Copilot', '2024-01-18', 'Business'),
  ((SELECT id FROM authors WHERE name = 'Sundar Pichai'), 'Google I/O 2024', 'https://blog.google', 'Keynote', 'Gemini era; democratization and responsibility', '2024-05-10', 'Technology'),
  ((SELECT id FROM authors WHERE name = 'Mark Zuckerberg'), 'Open Source AI is the Path Forward', 'https://about.fb.com', 'Blog', 'Open source as the default path; ecosystem strategy', '2024-07-23', 'Technology'),
  ((SELECT id FROM authors WHERE name = 'Emily M. Bender'), 'The AI Con (Book)', 'https://harpercollins.com', 'Book', 'Critique of AI hype; labor/environmental harms', '2025-05-01', 'Society'),
  ((SELECT id FROM authors WHERE name = 'Timnit Gebru'), 'Stochastic Parrots (FAccT, highly cited)', 'https://dl.acm.org', 'Paper', 'Risks of LLMs: costs, biases, and opportunity costs', '2024-06-01', 'Society'),
  ((SELECT id FROM authors WHERE name = 'Kate Crawford'), 'Nature 2024: Water/Energy Costs', 'https://nature.com', 'Commentary', 'Material costs of AI systems', '2024-09-01', 'Society'),
  ((SELECT id FROM authors WHERE name = 'Gary Marcus'), '25 AI Predictions for 2025', 'https://substack.com', 'Blog', 'Plateau of LLMs; realism over hype', '2025-01-02', 'Technology'),
  ((SELECT id FROM authors WHERE name = 'Ethan Mollick'), 'Strategies for an Accelerating Future', 'https://oneusefulthing.org', 'Blog', 'Practical adoption and co-intelligence playbook', '2024-02-20', 'Business'),
  ((SELECT id FROM authors WHERE name = 'Andrew Ng'), 'Agentic Design Patterns', 'https://example.com/ng-agentic', 'Talk', 'Agentic workflows and application layer focus', '2024-11-15', 'Business'),
  ((SELECT id FROM authors WHERE name = 'Erik Brynjolfsson'), 'Generative AI at Work (QJE 2025)', 'https://academic.oup.com/qje', 'Paper', 'Productivity J-curve; skill leveling effects', '2025-05-01', 'Business'),
  ((SELECT id FROM authors WHERE name = 'Fei-Fei Li'), 'AI policy: science, not sci‑fi', 'https://techcrunch.com', 'Interview', 'Grounded, evidence-based AI governance', '2025-02-08', 'Policy & Regulation')
ON CONFLICT DO NOTHING;

-- 6) Source topics linking (example associations)
INSERT INTO source_topics (source_id, topic_id)
SELECT s.id, t.id FROM sources s, topics t
WHERE s.title ILIKE '%Agentic%' AND t.name = 'Agentic AI'
ON CONFLICT DO NOTHING;

INSERT INTO source_topics (source_id, topic_id)
SELECT s.id, t.id FROM sources s, topics t
WHERE s.title ILIKE '%Open Source%' AND t.name = 'Open Source AI'
ON CONFLICT DO NOTHING;

INSERT INTO source_topics (source_id, topic_id)
SELECT s.id, t.id FROM sources s, topics t
WHERE s.title ILIKE '%policy%' AND t.name = 'AI Regulation'
ON CONFLICT DO NOTHING;

-- 5b) Additional sources for remaining authors (20–32)
INSERT INTO sources (author_id, title, url, type, summary, published_date, domain) VALUES
  ((SELECT id FROM authors WHERE name = 'Marc Andreessen'), 'The Techno-Optimist Manifesto (Revisited)', 'https://a16z.com', 'Essay', 'Aggressive innovation-first stance; scale and build', '2024-11-01', 'Technology'),
  ((SELECT id FROM authors WHERE name = 'Marc Andreessen'), 'Podcast: Why Regulation Slows Progress', 'https://a16z.com/podcast', 'Podcast', 'Argues for minimal regulation to maximize growth', '2025-02-15', 'Policy & Regulation'),

  ((SELECT id FROM authors WHERE name = 'Reid Hoffman'), 'Responsible Accelerationism AMA', 'https://greylock.com', 'Interview', 'Balanced acceleration with guardrails and feedback loops', '2025-01-20', 'Business'),
  ((SELECT id FROM authors WHERE name = 'Reid Hoffman'), 'AI Agents in the Enterprise', 'https://linkedin.com/pulse', 'Blog', 'Pragmatic playbook for enterprise adoption of agents', '2024-10-30', 'Business'),

  ((SELECT id FROM authors WHERE name = 'Elon Musk'), 'xAI Grok Update', 'https://x.ai', 'Blog', 'Scaling roadmap, model safety rhetoric', '2025-03-01', 'Technology'),
  ((SELECT id FROM authors WHERE name = 'Elon Musk'), 'Senate Testimony on AI', 'https://www.help.senate.gov', 'Hearing', 'Pro-safety regulation while pushing rapid development', '2024-12-05', 'Policy & Regulation'),

  ((SELECT id FROM authors WHERE name = 'Balaji Srinivasan'), 'The Network State 2025', 'https://balaji.com', 'Essay', 'Institutional revolution enabled by AI and crypto', '2025-02-10', 'Society'),
  ((SELECT id FROM authors WHERE name = 'Balaji Srinivasan'), 'Regulation as a Protocol', 'https://balaji.com', 'Essay', 'Argues for market-led governance; minimize state controls', '2024-09-18', 'Policy & Regulation'),

  ((SELECT id FROM authors WHERE name = 'Andrej Karpathy'), 'State of AI 2025: Pragmatic Realism', 'https://karpathy.ai', 'Blog', 'Open science, practical engineering, gradual progress', '2025-01-12', 'Technology'),
  ((SELECT id FROM authors WHERE name = 'Andrej Karpathy'), 'Open-Source Training Stack Notes', 'https://karpathy.ai', 'Blog', 'Notes on reproducible training pipelines', '2024-11-22', 'Technology'),

  ((SELECT id FROM authors WHERE name = 'Mustafa Suleyman'), 'Containment and Responsible Acceleration', 'https://microsoft.com/blog', 'Blog', 'Integration with guardrails and containment mindset', '2025-02-05', 'Policy & Regulation'),
  ((SELECT id FROM authors WHERE name = 'Mustafa Suleyman'), 'Agents and the Future of Interfaces', 'https://microsoft.com/build', 'Talk', 'Vision for agentic operating systems', '2024-11-10', 'Technology'),

  ((SELECT id FROM authors WHERE name = 'Clement Delangue'), 'Open Source AI in Production', 'https://huggingface.co/blog', 'Blog', 'Platform enablers and community pipelines', '2025-01-25', 'Technology'),
  ((SELECT id FROM authors WHERE name = 'Clement Delangue'), 'Distributed Innovation > Centralized Control', 'https://huggingface.co/blog', 'Essay', 'Case for open foundation models and datasets', '2024-08-20', 'Society'),

  ((SELECT id FROM authors WHERE name = 'Allie K. Miller'), 'Enterprise AI Playbooks (2025)', 'https://alliekmiller.com', 'Guide', 'Real-world go-lives and risk mitigation in enterprises', '2025-03-05', 'Business'),
  ((SELECT id FROM authors WHERE name = 'Allie K. Miller'), 'AI ROI: What Changes in Six Months', 'https://alliekmiller.com', 'Blog', 'Pragmatic timelines and governance tips', '2024-11-03', 'Business'),

  ((SELECT id FROM authors WHERE name = 'Ben Thompson'), 'Aggregators vs. Models', 'https://stratechery.com', 'Essay', 'Models commoditize; platforms matter; enterprise lens', '2024-12-12', 'Business'),
  ((SELECT id FROM authors WHERE name = 'Ben Thompson'), 'The AI Distribution Play', 'https://stratechery.com', 'Essay', 'Go-to-market dynamics trump model supremacy', '2025-01-18', 'Business'),

  ((SELECT id FROM authors WHERE name = 'Azeem Azhar'), 'Transformation Realist: Bi-Weekly Brief', 'https://www.exponentialview.co', 'Newsletter', 'Steady adoption patterns; policy and markets', '2025-02-28', 'Business'),
  ((SELECT id FROM authors WHERE name = 'Azeem Azhar'), 'Near-Term Displacement and Reskilling', 'https://www.exponentialview.co', 'Essay', 'Honest appraisal of job transition pressures', '2024-10-05', 'Workers'),

  ((SELECT id FROM authors WHERE name = 'Jason Lemkin'), 'SaaS and AI Parity 2025', 'https://www.saastr.com', 'Blog', 'Feature parity dynamics; pragmatic playout', '2025-01-07', 'Business'),
  ((SELECT id FROM authors WHERE name = 'Jason Lemkin'), 'Sales Motions in the AI Era', 'https://www.saastr.com', 'Blog', 'What changes and what remains for SaaS GTM', '2024-09-14', 'Business'),

  ((SELECT id FROM authors WHERE name = 'Sam Harris'), 'Alignment and Honesty', 'https://samharris.org', 'Podcast', 'Concerned realist on alignment risk and incentives', '2025-02-02', 'Policy & Regulation'),
  ((SELECT id FROM authors WHERE name = 'Sam Harris'), 'Making Sense: AI Safety Roundtable', 'https://samharris.org', 'Podcast', 'Multi-guest discussion on near-term regulation', '2024-12-01', 'Policy & Regulation'),

  ((SELECT id FROM authors WHERE name = 'Max Tegmark'), 'Future of Life Institute: Policy Brief 2025', 'https://futureoflife.org', 'Report', 'Strong regulation and existential risk framing', '2025-03-12', 'Policy & Regulation'),
  ((SELECT id FROM authors WHERE name = 'Max Tegmark'), 'Regulate Frontier Compute', 'https://futureoflife.org', 'Op-Ed', 'Argues for compute caps and licensing regimes', '2024-10-21', 'Policy & Regulation')
ON CONFLICT DO NOTHING;

-- 3b) Extra camp affinities (secondary/partial)
INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance)
SELECT c.id, a.id, 'Secondary/nuanced fit', 'partial'
FROM camps c, authors a
WHERE c.name = 'Human-AI Collaboration' AND a.name IN ('Satya Nadella', 'Fei-Fei Li', 'Ethan Mollick', 'Andrew Ng');

INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance)
SELECT c.id, a.id, 'Platform/ecosystem strategy', 'partial'
FROM camps c, authors a
WHERE c.name = 'Platform/Ecosystem' AND a.name IN ('Ben Thompson', 'Azeem Azhar');

INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance)
SELECT c.id, a.id, 'Displacement/transition emphasis', 'partial'
FROM camps c, authors a
WHERE c.name = 'Displacement Realists' AND a.name IN ('Dario Amodei', 'Geoffrey Hinton', 'Azeem Azhar');

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

-- 6b) Topic links for added sources
INSERT INTO source_topics (source_id, topic_id)
SELECT s.id, t.id FROM sources s, topics t
WHERE s.title ILIKE '%open source%' AND t.name = 'Open Source AI'
ON CONFLICT DO NOTHING;

INSERT INTO source_topics (source_id, topic_id)
SELECT s.id, t.id FROM sources s, topics t
WHERE s.title ILIKE '%Agents%' AND t.name = 'Agentic AI'
ON CONFLICT DO NOTHING;

INSERT INTO source_topics (source_id, topic_id)
SELECT s.id, t.id FROM sources s, topics t
WHERE s.title ILIKE '%Reskilling%' AND t.name = 'Workforce Reskilling'
ON CONFLICT DO NOTHING;

-- End of seed_from_mvp_database.sql
