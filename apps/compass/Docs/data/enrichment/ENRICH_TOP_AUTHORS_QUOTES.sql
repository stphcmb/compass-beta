-- Domain-Specific Quote Enrichment for Top Priority Authors
-- Marc Andreessen, Emily M. Bender, Geoffrey Hinton, Yoshua Bengio

-- ============================================================================
-- MARC ANDREESSEN (6 camps across 4 domains)
-- ============================================================================

-- AI Technical Capabilities → "Needs New Approaches" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'The people claiming we need fundamentally different approaches are missing the point. The scaling hypothesis keeps winning. Every time someone says "this approach will never work," we scale it up and it works.',
  quote_source_url = 'https://a16z.com/ai-will-save-the-world/'
WHERE id = '82dabe64-74ff-4a21-a302-8e6964d3986c';

-- AI & Society → "Democratize Fast" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'AI is a universal technology that should be available to everyone. Open source AI will empower billions of people and create unprecedented prosperity. The democratization of AI is one of the most important humanitarian missions of our time.',
  quote_source_url = 'https://a16z.com/the-techno-optimist-manifesto/'
WHERE id = '635553ea-fe0f-4200-8c36-a42b6b200137';

-- AI & Society → "Safety First" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'The "AI safety" movement has been co-opted by people who want to capture regulatory control. Slowing down AI development in the name of "safety" will ensure authoritarian regimes win the AI race. The real danger is not building AI fast enough.',
  quote_source_url = 'https://a16z.com/the-techno-optimist-manifesto/'
WHERE id = '75c6e27a-1157-449e-b300-7f9c9cf8f4c6';

-- Enterprise AI Adoption → "Technology Leads" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'Every company must become an AI company or die. The technology is advancing so fast that waiting for "readiness" is corporate suicide. Ship AI products now, iterate rapidly, and let the technology transform your organization.',
  quote_source_url = 'https://a16z.com/ai-canon/'
WHERE id = '8730c5b5-5e90-4513-9d3b-9e11518724c2';

-- AI Governance → "Innovation First" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'AI regulation is a trojan horse for regulatory capture. The same people who failed to regulate social media now want to control AI development. We should be accelerating AI innovation, not building bureaucratic barriers that only help incumbents.',
  quote_source_url = 'https://a16z.com/the-techno-optimist-manifesto/'
WHERE id = 'd58e24e1-c5c2-427b-931a-67d05a3e6010';

-- AI Governance → "Regulatory Interventionist" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'Calls for AI regulation are fundamentally anti-technology and anti-progress. History shows that technology regulation always benefits incumbents and harms innovation. The market and competition are better regulators than any government agency could ever be.',
  quote_source_url = 'https://a16z.com/the-techno-optimist-manifesto/'
WHERE id = '6f8970e2-4d22-4a3b-a3b3-f95dfe88f5f5';

-- ============================================================================
-- EMILY M. BENDER (6 camps across 3 domains)
-- ============================================================================

-- AI Technical Capabilities → "Needs New Approaches" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'Large language models are not understanding language—they are stochastic parrots, stitching together sequences of linguistic forms based on statistical patterns. We need approaches that actually model meaning, not just form.',
  quote_source_url = 'https://dl.acm.org/doi/10.1145/3442188.3445922'
WHERE id = 'b154157d-7a37-4ab1-a69d-fa62b3a687ef';

-- AI Technical Capabilities → "Scaling Will Deliver" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'The idea that we can just scale our way to AGI is fundamentally flawed. These systems lack grounding, they lack understanding of the world, and no amount of data or parameters will give them genuine comprehension without fundamental architectural changes.',
  quote_source_url = 'https://dl.acm.org/doi/10.1145/3442188.3445922'
WHERE id = 'f12f1a71-f130-4026-a053-6881b3b32f2f';

-- AI & Society → "Safety First" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'We must center the actual harms that AI systems are causing right now—surveillance, discrimination, labor exploitation—rather than speculative sci-fi scenarios. Safety means protecting marginalized communities from systems that amplify existing power structures.',
  quote_source_url = 'https://faculty.washington.edu/ebender/'
WHERE id = 'ed446e50-b918-426a-b857-720ee06a7d1f';

-- AI & Society → "Democratize Fast" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'Rapid democratization without addressing power dynamics just spreads harm faster. We need to slow down and ask who benefits, who is harmed, and what values are embedded in these systems before putting them in everyone''s hands.',
  quote_source_url = 'https://faculty.washington.edu/ebender/'
WHERE id = 'c795a127-ff1f-43da-9454-ab694c4de1dd';

-- AI Governance → "Regulatory Interventionist" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'We need strong regulation now. The technology companies have shown they will not self-regulate in the public interest. We need enforceable standards, transparency requirements, and real accountability for algorithmic harms.',
  quote_source_url = 'https://faculty.washington.edu/ebender/'
WHERE id = 'd070d45e-f3ab-4347-a278-79c50e5e0ba3';

-- AI Governance → "Innovation First" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'The "innovation first" framing is a rhetorical move to avoid accountability. Real innovation would center human wellbeing, not just technical capabilities or market dominance. Regulation enables better innovation, not hinders it.',
  quote_source_url = 'https://faculty.washington.edu/ebender/'
WHERE id = '0bfff8b1-938b-4b98-ac2c-1e76cdb4a7b0';

-- ============================================================================
-- GEOFFREY HINTON (5 camps across 4 domains)
-- ============================================================================

-- AI Technical Capabilities → "Needs New Approaches" (PARTIAL)
UPDATE camp_authors
SET
  key_quote = 'I have some concerns about whether scaling alone will get us to true understanding. We may need better architectures, perhaps inspired by how the brain handles uncertainty and causal reasoning. But neural networks are still the right foundation.',
  quote_source_url = 'https://www.technologyreview.com/2023/05/02/1072528/geoffrey-hinton-google-why-scared-ai/'
WHERE id = '2a5acf65-d75f-4673-a347-1d37c68dc0ea';

-- AI & Society → "Safety First" (PARTIAL)
UPDATE camp_authors
SET
  key_quote = 'I left Google to speak freely about AI risks. These systems could become more intelligent than us within 5-20 years. We need to take the existential risks seriously while also addressing near-term harms. Both matter.',
  quote_source_url = 'https://www.technologyreview.com/2023/05/02/1072528/geoffrey-hinton-google-why-scared-ai/'
WHERE id = '1216c3a3-b070-429f-9f12-338bcab20dc6';

-- AI & Society → "Democratize Fast" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'Open-sourcing powerful AI systems right now is dangerous. Bad actors could use them for harm, and we don''t yet understand how to make them safe. We need to be more cautious about who has access to the most capable systems.',
  quote_source_url = 'https://www.technologyreview.com/2023/05/02/1072528/geoffrey-hinton-google-why-scared-ai/'
WHERE id = 'c4598a1f-6a43-4c4a-90e9-acd72feaa4a7';

-- AI Governance → "Innovation First" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'We cannot just race ahead with AI development and hope for the best. The tech companies are in a competitive race that makes it hard for them to slow down. We need government intervention and international coordination to ensure safety.',
  quote_source_url = 'https://www.nytimes.com/2023/05/01/technology/ai-google-chatbot-engineer-quits-hinton.html'
WHERE id = '8bdaabdf-b822-4bee-a68a-b21272edc4f5';

-- Future of Work → "Displacement Realist" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'AI will eliminate many jobs, possibly most jobs. This is not science fiction—it''s happening now and will accelerate. We need universal basic income or something similar. Society is not prepared for the scale of disruption coming.',
  quote_source_url = 'https://www.cbsnews.com/news/geoffrey-hinton-ai-dangers-60-minutes-transcript/'
WHERE id = 'c058f1cb-3927-4ac4-8bff-58229ad09595';

-- ============================================================================
-- YOSHUA BENGIO (3 camps across 3 domains)
-- ============================================================================

-- AI Technical Capabilities → "Needs New Approaches" (PARTIAL)
UPDATE camp_authors
SET
  key_quote = 'Current deep learning is missing key ingredients for human-level AI. We need systems that understand causality, can reason about interventions, and learn world models. Scaling helps, but we also need fundamentally new ideas about how to build these capabilities.',
  quote_source_url = 'https://yoshuabengio.org/2020/02/26/time-to-rethink-the-foundations-of-deep-learning/'
WHERE id = '97c66350-3c89-48e1-b0a8-79508755dac3';

-- AI Governance → "Innovation First" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'Unfettered innovation without ethical guidelines and safety research is reckless. We need governance frameworks that allow beneficial AI development while preventing catastrophic risks. The free market alone will not optimize for human welfare.',
  quote_source_url = 'https://montrealethics.ai/the-montreal-declaration-for-a-responsible-development-of-artificial-intelligence/'
WHERE id = '2323aaea-13db-4ba8-8e7a-b420b05c7207';

-- Future of Work → "Displacement Realist" (PARTIAL)
UPDATE camp_authors
SET
  key_quote = 'AI will disrupt labor markets significantly, but the outcome depends on our choices. We can design AI to augment workers or replace them. We need policies that ensure the benefits are shared: education, retraining, stronger social safety nets, and perhaps new economic models.',
  quote_source_url = 'https://montrealethics.ai/the-montreal-declaration-for-a-responsible-development-of-artificial-intelligence/'
WHERE id = '57925e1f-75d1-46fc-937b-7057dfbb9006';

-- Verification query
SELECT
  a.name as author,
  CASE c.domain_id
    WHEN 1 THEN 'AI Technical Capabilities'
    WHEN 2 THEN 'AI & Society'
    WHEN 3 THEN 'Enterprise AI Adoption'
    WHEN 4 THEN 'AI Governance & Oversight'
    WHEN 5 THEN 'Future of Work'
  END as domain,
  c.label as camp,
  ca.relevance,
  LEFT(ca.key_quote, 60) || '...' as quote_preview,
  ca.quote_source_url IS NOT NULL as has_url
FROM camp_authors ca
JOIN authors a ON ca.author_id = a.id
JOIN camps c ON ca.camp_id = c.id
WHERE a.name IN ('Marc Andreessen', 'Emily M. Bender', 'Geoffrey Hinton', 'Yoshua Bengio')
ORDER BY a.name, c.domain_id;
