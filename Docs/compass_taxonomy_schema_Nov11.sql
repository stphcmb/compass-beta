-- ============================================================================
-- COMPASS TAXONOMY SCHEMA
-- Standardized structure for domains, dimensions, and camps
-- ============================================================================

-- ============================================================================
-- 1. DOMAINS TABLE
-- ============================================================================
CREATE TABLE domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  key_question TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert domains in priority order
INSERT INTO domains (name, key_question, display_order) VALUES
  ('Society & Ethics', 'What are AI''s consequences for truth, knowledge access, and social cohesion?', 1),
  ('Enterprise Transformation', 'How should organizations successfully integrate AI into operations and culture?', 2),
  ('Future of Work', 'How should workers prepare for AI''s impact on jobs, skills, and labor?', 3),
  ('AI Progress (Technical Frontier)', 'What''s technically possible and what are the architectural limits?', 4),
  ('Governance & Oversight', 'Who should control AI development and how should it be regulated?', 5),
  ('Other', 'What emerging topics or cross-cutting themes don''t fit primary domains?', 6);

-- ============================================================================
-- 2. DIMENSIONS TABLE
-- ============================================================================
-- Dimensions represent sub-categories within a domain
-- Most domains have a single implicit dimension
-- Enterprise Transformation has 3 explicit dimensions
CREATE TABLE dimensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  name TEXT, -- NULL for single-dimension domains, named for multi-dimension domains
  dimension_order INTEGER NOT NULL DEFAULT 1, -- Order within the domain
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(domain_id, name)
);

-- Insert dimensions
-- Society & Ethics: Single dimension (implicit)
INSERT INTO dimensions (domain_id, name, dimension_order)
SELECT id, NULL, 1 FROM domains WHERE name = 'Society & Ethics';

-- Enterprise Transformation: Three explicit dimensions
INSERT INTO dimensions (domain_id, name, dimension_order)
SELECT id, 'Adoption Philosophy', 1 FROM domains WHERE name = 'Enterprise Transformation'
UNION ALL
SELECT id, 'Measurement Approach', 2 FROM domains WHERE name = 'Enterprise Transformation'
UNION ALL
SELECT id, 'Translation Capability', 3 FROM domains WHERE name = 'Enterprise Transformation';

-- Future of Work: Single dimension (implicit)
INSERT INTO dimensions (domain_id, name, dimension_order)
SELECT id, NULL, 1 FROM domains WHERE name = 'Future of Work';

-- AI Progress: Single dimension (implicit)
INSERT INTO dimensions (domain_id, name, dimension_order)
SELECT id, NULL, 1 FROM domains WHERE name = 'AI Progress (Technical Frontier)';

-- Governance & Oversight: Single dimension (implicit)
INSERT INTO dimensions (domain_id, name, dimension_order)
SELECT id, NULL, 1 FROM domains WHERE name = 'Governance & Oversight';

-- Other: Single dimension (implicit)
INSERT INTO dimensions (domain_id, name, dimension_order)
SELECT id, NULL, 1 FROM domains WHERE name = 'Other';

-- ============================================================================
-- 3. CAMPS TABLE
-- ============================================================================
CREATE TABLE camps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dimension_id UUID NOT NULL REFERENCES dimensions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  key_concerns TEXT NOT NULL,
  representative_voices TEXT NOT NULL,
  camp_order INTEGER NOT NULL, -- Order within the dimension
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(dimension_id, name)
);

-- Insert camps for Society & Ethics (3 camps)
INSERT INTO camps (dimension_id, name, description, key_concerns, representative_voices, camp_order)
SELECT 
  d.id,
  'Ethical Stewards',
  'Focus on social power, representation, and epistemic limits. Prioritize safety and accountability.',
  'AI''s ''plausible nonsense'', misinformation risks, erosion of truth, social harms',
  'Emily Bender, Timnit Gebru, Gary Marcus, Jaron Lanier',
  1
FROM dimensions d
JOIN domains dom ON d.domain_id = dom.id
WHERE dom.name = 'Society & Ethics'
UNION ALL
SELECT 
  d.id,
  'Tech Realists',
  'Acknowledge limits but prioritize technical grounding and iteration. Balance progress with responsibility.',
  'Interpretability, user literacy, cognitive grounding, responsible deployment',
  'Yann LeCun, Andrej Karpathy, Yoshua Bengio',
  2
FROM dimensions d
JOIN domains dom ON d.domain_id = dom.id
WHERE dom.name = 'Society & Ethics'
UNION ALL
SELECT 
  d.id,
  'Tech Utopians',
  'View AI as pure democratization. Prioritize speed and scale over caution.',
  'Democratizing knowledge, breaking barriers, civilization-level transformation',
  'Marc Andreessen, Balaji Srinivasan',
  3
FROM dimensions d
JOIN domains dom ON d.domain_id = dom.id
WHERE dom.name = 'Society & Ethics';

-- Insert camps for Enterprise Transformation - Adoption Philosophy (2 camps)
INSERT INTO camps (dimension_id, name, description, key_concerns, representative_voices, camp_order)
SELECT 
  d.id,
  'Tech-First',
  'Build infrastructure first; culture follows success. Automation is the goal. Light governance.',
  'Speed to market, infrastructure, data pipelines, automation, technical capability',
  'Sam Altman, Jensen Huang, AI startup founders',
  1
FROM dimensions d
JOIN domains dom ON d.domain_id = dom.id
WHERE dom.name = 'Enterprise Transformation' AND d.name = 'Adoption Philosophy'
UNION ALL
SELECT 
  d.id,
  'Co-Evolution',
  'People, process, and technology must evolve together. Augmentation over replacement. ''AI-native'' not ''AI-first''.',
  'Culture change, workflow redesign, human accountability, sustainable adoption, incentives',
  'Erik Brynjolfsson, Andrew Ng, Satya Nadella, Alin Dobrea, HBR/MIT Sloan',
  2
FROM dimensions d
JOIN domains dom ON d.domain_id = dom.id
WHERE dom.name = 'Enterprise Transformation' AND d.name = 'Adoption Philosophy';

-- Insert camps for Enterprise Transformation - Measurement Approach (2 camps)
INSERT INTO camps (dimension_id, name, description, key_concerns, representative_voices, camp_order)
SELECT 
  d.id,
  'Proof Seekers',
  'Measure impact after the fact. Treat measurement as validation, not discovery. Need clear baselines and quantifiable returns.',
  'ROI validation, cost-benefit proofs, lagging indicators (revenue, savings), financial justification',
  'CFOs, finance teams, traditional IT leaders',
  1
FROM dimensions d
JOIN domains dom ON d.domain_id = dom.id
WHERE dom.name = 'Enterprise Transformation' AND d.name = 'Measurement Approach'
UNION ALL
SELECT 
  d.id,
  'Learning Architects',
  'Measure progress as it happens. Measurement is a feedback loop helping humans, process, and AI learn together.',
  'Leading indicators (adoption, cycle time, data quality), capability building, evolutionary learning',
  'Transformation officers, AI governance leaders, progressive CIOs',
  2
FROM dimensions d
JOIN domains dom ON d.domain_id = dom.id
WHERE dom.name = 'Enterprise Transformation' AND d.name = 'Measurement Approach';

-- Insert camps for Enterprise Transformation - Translation Capability (2 camps)
INSERT INTO camps (dimension_id, name, description, key_concerns, representative_voices, camp_order)
SELECT 
  d.id,
  'Tech Builders',
  'Just build great AI; adoption will follow. Technical excellence is what matters; business will figure it out.',
  'Model performance, technical capabilities, engineering velocity, feature development',
  'AI researchers, ML engineers, tech-focused startups',
  1
FROM dimensions d
JOIN domains dom ON d.domain_id = dom.id
WHERE dom.name = 'Enterprise Transformation' AND d.name = 'Translation Capability'
UNION ALL
SELECT 
  d.id,
  'Business Whisperers',
  'Translation is the bottleneck. Organizations need interpreters who explain AI to business and business to AI.',
  'Business-AI translation, change management, stakeholder communication, practical applications',
  'Alin Dobrea, Enterprise AI consultants, AI product managers',
  2
FROM dimensions d
JOIN domains dom ON d.domain_id = dom.id
WHERE dom.name = 'Enterprise Transformation' AND d.name = 'Translation Capability';

-- Insert camps for Future of Work (2 camps)
INSERT INTO camps (dimension_id, name, description, key_concerns, representative_voices, camp_order)
SELECT 
  d.id,
  'Human-AI Collaboration',
  'AI augments and amplifies human capability. Workers orchestrate AI agents as co-pilots. Work evolves from execution to supervision. Mass upskilling possible through semi-technical literacy.',
  'Augmentation, agentic workforce, orchestration skills, productivity gains, new job categories',
  'Andrew Ng, Ethan Mollick, Alin Dobrea, Stanford HAI',
  1
FROM dimensions d
JOIN domains dom ON d.domain_id = dom.id
WHERE dom.name = 'Future of Work'
UNION ALL
SELECT 
  d.id,
  'Displacement Realists',
  'Acknowledge significant structural job displacement. Individual reskilling insufficient without systemic policy interventions and safety nets.',
  'Structural unemployment, wage polarization, inequality, need for social safety nets, policy-led adaptation',
  'Labor economists, policy researchers, labor rights advocates',
  2
FROM dimensions d
JOIN domains dom ON d.domain_id = dom.id
WHERE dom.name = 'Future of Work';

-- Insert camps for AI Progress (Technical Frontier) (2 camps)
INSERT INTO camps (dimension_id, name, description, key_concerns, representative_voices, camp_order)
SELECT 
  d.id,
  'Scaling Maximalists',
  'Bigger models + more data = continued progress toward AGI. Current paradigm has significant runway.',
  'Scaling laws, compute power, data quality, model architecture improvements',
  'OpenAI leadership, DeepMind leadership, Sam Altman',
  1
FROM dimensions d
JOIN domains dom ON d.domain_id = dom.id
WHERE dom.name = 'AI Progress (Technical Frontier)'
UNION ALL
SELECT 
  d.id,
  'Grounding Realists',
  'LLMs hit limits without embodiment, world models, causal reasoning. Need hybrid systems beyond language.',
  'Embodied intelligence, world models, causal reasoning, architectural limitations, dead internet',
  'Yann LeCun, Gary Marcus, Alin Dobrea, AI alignment researchers',
  2
FROM dimensions d
JOIN domains dom ON d.domain_id = dom.id
WHERE dom.name = 'AI Progress (Technical Frontier)';

-- Insert camps for Governance & Oversight (3 camps)
INSERT INTO camps (dimension_id, name, description, key_concerns, representative_voices, camp_order)
SELECT 
  d.id,
  'Regulatory Interventionists',
  'Strong government oversight needed NOW. Scale of AI risk requires proactive regulation.',
  'AI safety, existential risk, accountability frameworks, preemptive regulation',
  'EU AI Act proponents, AI safety advocates, Timnit Gebru',
  1
FROM dimensions d
JOIN domains dom ON d.domain_id = dom.id
WHERE dom.name = 'Governance & Oversight'
UNION ALL
SELECT 
  d.id,
  'Innovation-First',
  'Government too slow; industry should lead. Over-regulation kills innovation.',
  'Innovation speed, self-regulation, competitive advantage, market-driven safety',
  'Silicon Valley libertarians, Marc Andreessen, tech CEOs',
  2
FROM dimensions d
JOIN domains dom ON d.domain_id = dom.id
WHERE dom.name = 'Governance & Oversight'
UNION ALL
SELECT 
  d.id,
  'Adaptive Governance',
  'Light-touch, iterative regulation that co-evolves with technology. Balance speed with safety.',
  'Flexible frameworks, co-evolution, risk-based approaches, stakeholder collaboration',
  'Tech policy experts, progressive academics',
  3
FROM dimensions d
JOIN domains dom ON d.domain_id = dom.id
WHERE dom.name = 'Governance & Oversight';

-- Insert camps for Other (1 camp)
INSERT INTO camps (dimension_id, name, description, key_concerns, representative_voices, camp_order)
SELECT 
  d.id,
  'Various',
  'Catch-all for new perspectives, interdisciplinary approaches, or evolving positions in the AI landscape.',
  'Emerging debates, cross-domain thinking, novel frameworks',
  'To be populated as new voices and themes emerge',
  1
FROM dimensions d
JOIN domains dom ON d.domain_id = dom.id
WHERE dom.name = 'Other';

-- ============================================================================
-- USEFUL VIEWS FOR QUERYING
-- ============================================================================

-- View: Complete taxonomy hierarchy
CREATE VIEW taxonomy_hierarchy AS
SELECT 
  dom.id AS domain_id,
  dom.name AS domain_name,
  dom.key_question AS domain_question,
  dom.display_order AS domain_order,
  dim.id AS dimension_id,
  dim.name AS dimension_name,
  dim.dimension_order,
  c.id AS camp_id,
  c.name AS camp_name,
  c.description AS camp_description,
  c.key_concerns,
  c.representative_voices,
  c.camp_order
FROM domains dom
JOIN dimensions dim ON dom.id = dim.domain_id
JOIN camps c ON dim.id = c.dimension_id
ORDER BY dom.display_order, dim.dimension_order, c.camp_order;

-- View: Camps by domain (flattened for simple queries)
CREATE VIEW camps_by_domain AS
SELECT 
  dom.name AS domain_name,
  dim.name AS dimension_name,
  c.name AS camp_name,
  c.description,
  dom.id AS domain_id,
  dim.id AS dimension_id,
  c.id AS camp_id
FROM domains dom
JOIN dimensions dim ON dom.id = dim.domain_id
JOIN camps c ON dim.id = c.dimension_id;

-- View: Domain summary (counts camps per domain)
CREATE VIEW domain_summary AS
SELECT 
  dom.name AS domain_name,
  COUNT(DISTINCT dim.id) AS dimension_count,
  COUNT(c.id) AS camp_count,
  STRING_AGG(DISTINCT dim.name, ', ' ORDER BY dim.name) AS dimensions
FROM domains dom
JOIN dimensions dim ON dom.id = dim.domain_id
LEFT JOIN camps c ON dim.id = c.dimension_id
GROUP BY dom.id, dom.name, dom.display_order
ORDER BY dom.display_order;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX idx_dimensions_domain_id ON dimensions(domain_id);
CREATE INDEX idx_camps_dimension_id ON camps(dimension_id);
CREATE INDEX idx_domains_display_order ON domains(display_order);
CREATE INDEX idx_dimensions_order ON dimensions(dimension_order);
CREATE INDEX idx_camps_order ON camps(camp_order);

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_domains_updated_at BEFORE UPDATE ON domains
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dimensions_updated_at BEFORE UPDATE ON dimensions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_camps_updated_at BEFORE UPDATE ON camps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
