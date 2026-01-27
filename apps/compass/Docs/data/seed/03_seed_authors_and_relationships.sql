-- ============================================================================
-- STEP 3: Seed Authors and Camp-Author Relationships
-- Run this after compass_taxonomy_schema_Nov11.sql
-- ============================================================================

-- Create authors table
CREATE TABLE IF NOT EXISTS authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  affiliation TEXT,
  credibility_tier TEXT CHECK (credibility_tier IN ('Seminal Thinker', 'Thought Leader', 'Emerging Voice', 'Practitioner')),
  author_type TEXT CHECK (author_type IN ('Academic', 'Practitioner', 'Academic/Practitioner', 'Policy Maker', 'Industry Leader')),
  position_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert 37 authors
INSERT INTO authors (name, affiliation, credibility_tier, author_type, position_summary) VALUES
  ('Sam Altman', 'OpenAI', 'Thought Leader', 'Industry Leader', 'Aggressive AGI optimist; rapid scaling and deployment'),
  ('Dario Amodei', 'Anthropic', 'Seminal Thinker', 'Industry Leader', 'Safety-focused scaling; transparent risk policies'),
  ('Ilya Sutskever', 'Safe Superintelligence Inc.', 'Seminal Thinker', 'Academic', 'Deep safety focus; beyond scaling paradigms'),
  ('Geoffrey Hinton', 'University of Toronto', 'Seminal Thinker', 'Academic/Practitioner', 'Leading safety advocate; extinction risk awareness'),
  ('Yann LeCun', 'Meta / NYU', 'Seminal Thinker', 'Industry Leader', 'World models and embodied AI; open-source advocate'),
  ('Yoshua Bengio', 'Université de Montréal / MILA', 'Seminal Thinker', 'Academic', 'AI safety research; goal misalignment concerns'),
  ('Demis Hassabis', 'Google DeepMind', 'Seminal Thinker', 'Industry Leader', 'AGI timeline optimist; adaptive regulation advocate'),
  ('Jensen Huang', 'NVIDIA', 'Thought Leader', 'Industry Leader', 'Accelerated computing; AI infrastructure focus'),
  ('Satya Nadella', 'Microsoft', 'Thought Leader', 'Industry Leader', 'Copilot philosophy; human augmentation'),
  ('Sundar Pichai', 'Google/Alphabet', 'Thought Leader', 'Industry Leader', 'Democratize AI; responsible innovation'),
  ('Mark Zuckerberg', 'Meta', 'Thought Leader', 'Industry Leader', 'Open source AI advocate; ecosystem strategy'),
  ('Emily M. Bender', 'University of Washington', 'Seminal Thinker', 'Academic', 'Stochastic parrots critique; harms-first lens'),
  ('Timnit Gebru', 'DAIR', 'Seminal Thinker', 'Academic', 'Algorithmic bias leader; systems-of-power critique'),
  ('Kate Crawford', 'USC / Microsoft Research', 'Seminal Thinker', 'Academic', 'Material infrastructure of AI; extraction costs'),
  ('Gary Marcus', 'NYU Emeritus', 'Thought Leader', 'Academic', 'LLM limitations; neurosymbolic advocacy'),
  ('Ethan Mollick', 'Wharton', 'Thought Leader', 'Academic/Practitioner', 'Co-intelligence; practical transformation'),
  ('Andrew Ng', 'DeepLearning.AI / Stanford', 'Seminal Thinker', 'Academic/Practitioner', 'Democratization; agentic workflows'),
  ('Erik Brynjolfsson', 'Stanford', 'Seminal Thinker', 'Academic', 'Productivity J-curve; task-based augmentation'),
  ('Fei-Fei Li', 'Stanford HAI', 'Seminal Thinker', 'Academic/Practitioner', 'Human-centered AI; evidence-based policy'),
  ('Marc Andreessen', 'Andreessen Horowitz', 'Thought Leader', 'Practitioner', 'Tech utopian; innovation-first governance'),
  ('Reid Hoffman', 'Greylock', 'Thought Leader', 'Practitioner', 'Pragmatic optimist; deployment-first'),
  ('Elon Musk', 'xAI', 'Thought Leader', 'Industry Leader', 'Risk rhetoric with aggressive building'),
  ('Balaji Srinivasan', 'Network State', 'Thought Leader', 'Practitioner', 'Institutional revolutionary; anti-regulation'),
  ('Andrej Karpathy', 'Eureka Labs', 'Thought Leader', 'Academic/Practitioner', 'Pragmatic realist; open science'),
  ('Mustafa Suleyman', 'Microsoft AI', 'Thought Leader', 'Industry Leader', 'Responsible accelerationist'),
  ('Clement Delangue', 'Hugging Face', 'Thought Leader', 'Industry Leader', 'Open-source democratizer'),
  ('Allie K. Miller', 'Independent', 'Thought Leader', 'Practitioner', 'Practical enterprise implementation'),
  ('Ben Thompson', 'Stratechery', 'Thought Leader', 'Practitioner', 'Platform strategy; incremental progress'),
  ('Azeem Azhar', 'Exponential View', 'Thought Leader', 'Practitioner', 'Transformation realist'),
  ('Jason Lemkin', 'SaaStr', 'Thought Leader', 'Practitioner', 'SaaS perspective; pragmatic incremental'),
  ('Sam Harris', 'Making Sense', 'Thought Leader', 'Practitioner', 'Alignment risk advocate'),
  ('Max Tegmark', 'MIT/FLI', 'Seminal Thinker', 'Academic', 'Existential risk focus'),
  ('Alin Dobrea', 'Independent AI Strategist', 'Emerging Voice', 'Practitioner', 'Business-AI translation; co-evolution advocate'),
  ('Jaron Lanier', 'Microsoft Research', 'Seminal Thinker', 'Academic/Practitioner', 'Humanistic tech critique; data dignity'),
  ('Stuart Russell', 'UC Berkeley', 'Seminal Thinker', 'Academic', 'AI safety; value alignment research'),
  ('Daniel Kahneman', 'Princeton', 'Seminal Thinker', 'Academic', 'Human judgment; cognitive biases in AI context'),
  ('Francesca Rossi', 'IBM Research', 'Thought Leader', 'Academic/Practitioner', 'AI ethics; value-sensitive design')
ON CONFLICT DO NOTHING;

-- Create camp_authors relationship table
CREATE TABLE IF NOT EXISTS camp_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  camp_id UUID REFERENCES camps(id) ON DELETE CASCADE,
  author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
  why_it_matters TEXT,
  relevance TEXT CHECK (relevance IN ('strong', 'partial', 'challenges', 'emerging')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(camp_id, author_id)
);

-- Map authors to camps
-- Society & Ethics - Ethical Stewards
INSERT INTO camp_authors (camp_id, author_id, relevance, why_it_matters)
SELECT c.id, a.id, 'strong', 'Focus on AI harms, ethics, and social impacts'
FROM camps c, authors a
WHERE c.name = 'Ethical Stewards' AND a.name IN ('Emily M. Bender', 'Timnit Gebru', 'Kate Crawford', 'Gary Marcus', 'Jaron Lanier');

-- Society & Ethics - Tech Realists
INSERT INTO camp_authors (camp_id, author_id, relevance, why_it_matters)
SELECT c.id, a.id, 'strong', 'Balance technical progress with responsibility'
FROM camps c, authors a
WHERE c.name = 'Tech Realists' AND a.name IN ('Yann LeCun', 'Andrej Karpathy', 'Yoshua Bengio', 'Fei-Fei Li');

-- Society & Ethics - Tech Utopians
INSERT INTO camp_authors (camp_id, author_id, relevance, why_it_matters)
SELECT c.id, a.id, 'strong', 'Optimistic about AI democratization'
FROM camps c, authors a
WHERE c.name = 'Tech Utopians' AND a.name IN ('Marc Andreessen', 'Balaji Srinivasan', 'Reid Hoffman', 'Elon Musk');

-- Enterprise Transformation - Tech-First
INSERT INTO camp_authors (camp_id, author_id, relevance, why_it_matters)
SELECT c.id, a.id, 'strong', 'Infrastructure-first approach to AI adoption'
FROM camps c, authors a
WHERE c.name = 'Tech-First' AND a.name IN ('Sam Altman', 'Jensen Huang', 'Mark Zuckerberg', 'Sundar Pichai');

-- Enterprise Transformation - Co-Evolution
INSERT INTO camp_authors (camp_id, author_id, relevance, why_it_matters)
SELECT c.id, a.id, 'strong', 'People, process, and technology evolving together'
FROM camps c, authors a
WHERE c.name = 'Co-Evolution' AND a.name IN ('Satya Nadella', 'Andrew Ng', 'Erik Brynjolfsson', 'Alin Dobrea', 'Ethan Mollick', 'Fei-Fei Li');

-- Enterprise Transformation - Proof Seekers
INSERT INTO camp_authors (camp_id, author_id, relevance, why_it_matters)
SELECT c.id, a.id, 'strong', 'Focus on measurable ROI and validation'
FROM camps c, authors a
WHERE c.name = 'Proof Seekers' AND a.name IN ('Jason Lemkin', 'Ben Thompson');

-- Enterprise Transformation - Learning Architects
INSERT INTO camp_authors (camp_id, author_id, relevance, why_it_matters)
SELECT c.id, a.id, 'strong', 'Iterative measurement and learning loops'
FROM camps c, authors a
WHERE c.name = 'Learning Architects' AND a.name IN ('Alin Dobrea', 'Ethan Mollick', 'Allie K. Miller');

-- Enterprise Transformation - Tech Builders
INSERT INTO camp_authors (camp_id, author_id, relevance, why_it_matters)
SELECT c.id, a.id, 'strong', 'Technical excellence drives adoption'
FROM camps c, authors a
WHERE c.name = 'Tech Builders' AND a.name IN ('Ilya Sutskever', 'Andrej Karpathy', 'Clement Delangue');

-- Enterprise Transformation - Business Whisperers
INSERT INTO camp_authors (camp_id, author_id, relevance, why_it_matters)
SELECT c.id, a.id, 'strong', 'Translation between business and AI'
FROM camps c, authors a
WHERE c.name = 'Business Whisperers' AND a.name IN ('Alin Dobrea', 'Allie K. Miller', 'Ethan Mollick');

-- Future of Work - Human-AI Collaboration
INSERT INTO camp_authors (camp_id, author_id, relevance, why_it_matters)
SELECT c.id, a.id, 'strong', 'AI as augmentation tool'
FROM camps c, authors a
WHERE c.name = 'Human-AI Collaboration' AND a.name IN ('Andrew Ng', 'Ethan Mollick', 'Erik Brynjolfsson', 'Satya Nadella', 'Alin Dobrea');

-- Future of Work - Displacement Realists
INSERT INTO camp_authors (camp_id, author_id, relevance, why_it_matters)
SELECT c.id, a.id, 'strong', 'Acknowledge structural labor displacement'
FROM camps c, authors a
WHERE c.name = 'Displacement Realists' AND a.name IN ('Erik Brynjolfsson', 'Gary Marcus', 'Emily M. Bender', 'Daniel Kahneman');

-- AI Progress - Scaling Maximalists
INSERT INTO camp_authors (camp_id, author_id, relevance, why_it_matters)
SELECT c.id, a.id, 'strong', 'Scaling as path to AGI'
FROM camps c, authors a
WHERE c.name = 'Scaling Maximalists' AND a.name IN ('Sam Altman', 'Dario Amodei', 'Demis Hassabis', 'Jensen Huang', 'Mark Zuckerberg');

-- AI Progress - Grounding Realists
INSERT INTO camp_authors (camp_id, author_id, relevance, why_it_matters)
SELECT c.id, a.id, 'strong', 'LLM limits; need for embodiment and world models'
FROM camps c, authors a
WHERE c.name = 'Grounding Realists' AND a.name IN ('Yann LeCun', 'Gary Marcus', 'Alin Dobrea', 'Stuart Russell');

-- Governance & Oversight - Regulatory Interventionists
INSERT INTO camp_authors (camp_id, author_id, relevance, why_it_matters)
SELECT c.id, a.id, 'strong', 'Strong oversight needed now'
FROM camps c, authors a
WHERE c.name = 'Regulatory Interventionists' AND a.name IN ('Timnit Gebru', 'Emily M. Bender', 'Max Tegmark', 'Sam Harris', 'Geoffrey Hinton', 'Yoshua Bengio');

-- Governance & Oversight - Innovation-First
INSERT INTO camp_authors (camp_id, author_id, relevance, why_it_matters)
SELECT c.id, a.id, 'strong', 'Industry should lead; minimal regulation'
FROM camps c, authors a
WHERE c.name = 'Innovation-First' AND a.name IN ('Marc Andreessen', 'Balaji Srinivasan', 'Reid Hoffman');

-- Governance & Oversight - Adaptive Governance
INSERT INTO camp_authors (camp_id, author_id, relevance, why_it_matters)
SELECT c.id, a.id, 'strong', 'Iterative, co-evolving regulation'
FROM camps c, authors a
WHERE c.name = 'Adaptive Governance' AND a.name IN ('Demis Hassabis', 'Mustafa Suleyman', 'Fei-Fei Li', 'Francesca Rossi');

-- Success message
SELECT 'Authors and relationships seeded successfully' AS status;
SELECT COUNT(*) AS author_count FROM authors;
SELECT COUNT(*) AS relationship_count FROM camp_authors;
