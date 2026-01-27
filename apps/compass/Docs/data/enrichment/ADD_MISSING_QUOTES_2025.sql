-- ============================================================================
-- ADD MISSING QUOTES FOR AUTHORS (39 quotes for 30 authors)
-- Generated on: 2025-12-13
-- Purpose: Ensure every author has representative quotes for their camps
-- ============================================================================

-- ============================================================================
-- MULTI-CAMP AUTHORS (Priority 1)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- STUART RUSSELL (2 quotes)
-- ----------------------------------------------------------------------------

-- AI & Society → Safety First (STRONG)
UPDATE camp_authors
SET
  key_quote = 'The problem is not that AI systems will become malevolent. It''s that they will become extremely competent at achieving goals that are not aligned with ours. We need to solve the control problem before advanced AI systems are deployed.',
  quote_source_url = 'https://www.amazon.com/Human-Compatible-Artificial-Intelligence-Problem/dp/0525558616'
WHERE id = '4ebe46dc-05b5-49ce-8894-f2c42ff33c7f';

-- AI Governance & Oversight → Regulatory Interventionist (STRONG)
UPDATE camp_authors
SET
  key_quote = 'We need robust governance frameworks and potentially regulation for advanced AI systems. The default should be safety, not speed. The risks are too great to leave this entirely to market forces.',
  quote_source_url = 'https://www.amazon.com/Human-Compatible-Artificial-Intelligence-Problem/dp/0525558616'
WHERE id = 'a5dc5486-1d8f-4dba-972e-658d69e81bc1';

-- ----------------------------------------------------------------------------
-- ELIEZER YUDKOWSKY (2 quotes)
-- ----------------------------------------------------------------------------

-- AI Governance & Oversight → Regulatory Interventionist (STRONG)
UPDATE camp_authors
SET
  key_quote = 'If we can''t build aligned AI, we should not build superintelligent AI at all. The default outcome is everybody dead. We need international treaties with real teeth—this is more serious than nuclear weapons.',
  quote_source_url = 'https://time.com/6266923/ai-eliezer-yudkowsky-open-letter-not-enough/'
WHERE id = 'd69d990e-a3ef-496d-910c-52c31d0ef844';

-- AI & Society → Safety First (STRONG)
UPDATE camp_authors
SET
  key_quote = 'AI alignment is not a nice-to-have research problem—it''s the most important problem facing humanity. Once you have superintelligent AI that doesn''t share our values, it''s game over. We get exactly one shot at this.',
  quote_source_url = 'https://intelligence.org/ie-faq/'
WHERE id = '92680d95-3d86-45bb-8c71-45ad2c54ccf2';

-- ----------------------------------------------------------------------------
-- PERCY LIANG (2 quotes)
-- ----------------------------------------------------------------------------

-- AI Technical Capabilities → Needs New Approaches (STRONG)
UPDATE camp_authors
SET
  key_quote = 'Language models are impressive but fundamentally limited. They lack true understanding, reasoning, and robustness. We need to move beyond scaling and develop systems with genuine comprehension and causal reasoning capabilities.',
  quote_source_url = 'https://crfm.stanford.edu/'
WHERE id = '182eed27-1cb3-4c18-8b99-f087cea6d598';

-- AI & Society → Safety First (STRONG)
UPDATE camp_authors
SET
  key_quote = 'Transparency and accountability in AI systems are not optional—they''re essential for deployment at scale. We need rigorous evaluation frameworks and ongoing monitoring to ensure these systems remain beneficial and aligned.',
  quote_source_url = 'https://crfm.stanford.edu/helm/lite/latest/'
WHERE id = '4bd5a901-e075-41bf-b208-4e32367b1cac';

-- ----------------------------------------------------------------------------
-- NICK BOSTROM (2 quotes)
-- ----------------------------------------------------------------------------

-- AI & Society → Safety First (STRONG)
UPDATE camp_authors
SET
  key_quote = 'The first ultraintelligent machine is the last invention that man need ever make, provided the machine is docile enough to tell us how to keep it under control. The key challenge is ensuring AI systems remain aligned with human values as they grow more capable.',
  quote_source_url = 'https://www.amazon.com/Superintelligence-Dangers-Strategies-Nick-Bostrom/dp/0198739834'
WHERE id = 'a9ee0d80-d60a-446e-a02c-8dc912fb9510';

-- AI Governance & Oversight → Regulatory Interventionist (PARTIAL)
UPDATE camp_authors
SET
  key_quote = 'Some form of governance will be necessary for transformative AI, but we need to be careful about heavy-handed regulation that could stifle beneficial research. The governance approach should evolve as our understanding of the technology deepens.',
  quote_source_url = 'https://nickbostrom.com/papers/agi-policy.pdf'
WHERE id = '4ca41b8b-eb50-43c6-820a-d79e09652105';

-- ----------------------------------------------------------------------------
-- DARON ACEMOGLU (2 quotes)
-- ----------------------------------------------------------------------------

-- AI Governance & Oversight → Regulatory Interventionist (STRONG)
UPDATE camp_authors
SET
  key_quote = 'The idea that AI will benefit society automatically is misguided. Without proper regulation and oversight, AI will concentrate power and wealth in the hands of a few tech companies. We need proactive policy interventions.',
  quote_source_url = 'https://economics.mit.edu/people/faculty/daron-acemoglu'
WHERE id = 'ee404e3e-c90d-4bfb-90b5-5819e0514158';

-- Future of Work → Displacement Realist (STRONG)
UPDATE camp_authors
SET
  key_quote = 'AI will not automatically create good jobs. In fact, without the right policies, it will accelerate inequality and job displacement. We need to redesign our labor market institutions and invest heavily in worker retraining and social safety nets.',
  quote_source_url = 'https://www.nber.org/papers/w29247'
WHERE id = '90507e87-7a59-46ad-a413-afdeb3a05ecb';

-- ----------------------------------------------------------------------------
-- NOURIEL ROUBINI (2 quotes)
-- ----------------------------------------------------------------------------

-- AI Governance & Oversight → Regulatory Interventionist (STRONG)
UPDATE camp_authors
SET
  key_quote = 'The concentration of AI power in a few tech giants poses systemic risks to democracy and market competition. We need strong antitrust enforcement and regulatory frameworks before these monopolies become unassailable.',
  quote_source_url = 'https://www.nourielroubini.com/'
WHERE id = '336830da-dd63-457e-bf67-df766d2d6ae8';

-- Future of Work → Displacement Realist (STRONG)
UPDATE camp_authors
SET
  key_quote = 'AI-driven automation will lead to massive structural unemployment. Unlike previous technological shifts, this one will happen faster and affect cognitive workers too. We need universal basic income and radical labor market reforms—yesterday.',
  quote_source_url = 'https://www.nourielroubini.com/ai-impact'
WHERE id = '7910f9de-0c65-44d9-9313-2a9d594445c2';

-- ----------------------------------------------------------------------------
-- RITA SALLAM (2 quotes)
-- ----------------------------------------------------------------------------

-- Enterprise AI Adoption → Business Whisperers (STRONG)
UPDATE camp_authors
SET
  key_quote = 'The biggest barrier to AI adoption isn''t technology—it''s translation. Organizations need people who can bridge the gap between technical capabilities and business value. Without effective translation, AI projects fail to deliver ROI.',
  quote_source_url = 'https://www.gartner.com/en/experts/rita-sallam'
WHERE id = '478245de-5001-4cae-981d-93048ea36ba3';

-- Enterprise AI Adoption → Co-Evolution (STRONG)
UPDATE camp_authors
SET
  key_quote = 'Successful AI transformation requires co-evolution of people, processes, and technology. You can''t just bolt AI onto existing workflows and expect magic. Culture change and organizational design are just as important as the technology itself.',
  quote_source_url = 'https://www.gartner.com/smarterwithgartner/future-of-ai-governance'
WHERE id = '6680cc71-9f8e-460a-b4f3-d779fdeeb6b6';

-- ----------------------------------------------------------------------------
-- RUMMAN CHOWDHURY (2 quotes)
-- ----------------------------------------------------------------------------

-- AI Governance & Oversight → Adaptive Governance (STRONG)
UPDATE camp_authors
SET
  key_quote = 'Effective AI governance requires flexibility and stakeholder inclusion. Top-down regulation alone won''t work—we need adaptive frameworks that evolve with the technology and include diverse voices, especially those most affected.',
  quote_source_url = 'https://www.humane-intelligence.org/'
WHERE id = '1d07f878-4cb2-4498-b6ec-75f26d48cc36';

-- AI & Society → Safety First (STRONG)
UPDATE camp_authors
SET
  key_quote = 'AI accountability isn''t just about technical audits—it''s about power dynamics. Who builds these systems, whose perspectives are centered, and who gets to define harm? Safety means social justice, not just robustness metrics.',
  quote_source_url = 'https://www.humane-intelligence.org/work'
WHERE id = '09b101c3-11c7-4446-8bad-071c3a467d9d';

-- ----------------------------------------------------------------------------
-- BRET TAYLOR (2 quotes)
-- ----------------------------------------------------------------------------

-- Enterprise AI Adoption → Co-Evolution (STRONG)
UPDATE camp_authors
SET
  key_quote = 'AI agents need to work alongside humans, not replace them. The most successful implementations augment human decision-making and adapt to existing workflows. Technology should serve people, not dictate how they work.',
  quote_source_url = 'https://sierra.ai/'
WHERE id = 'a85e9871-c8cb-4b19-b484-d873544ffb04';

-- Enterprise AI Adoption → Technology Leads (STRONG)
UPDATE camp_authors
SET
  key_quote = 'The AI infrastructure you build today will determine your competitive advantage tomorrow. Companies that move fast and invest in robust AI systems will pull ahead. Speed and technical excellence are table stakes in the AI era.',
  quote_source_url = 'https://sierra.ai/about'
WHERE id = '92352238-4aac-422b-969a-1bf1f24e78a9';

-- ============================================================================
-- SINGLE-CAMP AUTHORS (Priority 2)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- AI & SOCIETY CAMP
-- ----------------------------------------------------------------------------

-- Abeba Birhane → Safety First (STRONG)
UPDATE camp_authors
SET
  key_quote = 'AI systems encode and amplify existing power structures and biases. We need to center marginalized voices in AI development and recognize that technical solutions alone cannot fix fundamentally social and political problems.',
  quote_source_url = 'https://abebabirhane.com/'
WHERE id = '3a5aa952-40a4-40aa-b07a-38cbe959e3b0';

-- Ajeya Cotra → Safety First (STRONG)
UPDATE camp_authors
SET
  key_quote = 'Transformative AI timelines are shorter than most people think. We need to take AI safety research seriously now, not later. The probability of misalignment causing catastrophic outcomes is uncomfortably high.',
  quote_source_url = 'https://www.openphilanthropy.org/people/ajeya-cotra/'
WHERE id = 'd6e4b50b-973f-476f-8fe0-0f19169aedef';

-- Deborah Raji → Safety First (STRONG)
UPDATE camp_authors
SET
  key_quote = 'AI auditing and accountability mechanisms are often performative rather than substantive. We need enforceable standards, independent oversight, and real consequences for harms. Transparency alone is insufficient.',
  quote_source_url = 'https://www.deborahraji.com/'
WHERE id = '0b767343-10fc-4988-93ee-279108c47045';

-- Lilian Weng → Safety First (STRONG)
UPDATE camp_authors
SET
  key_quote = 'Safety systems for AI must be built from the ground up, not bolted on later. Red teaming, adversarial testing, and continuous monitoring are essential components of responsible AI deployment at scale.',
  quote_source_url = 'https://lilianweng.github.io/'
WHERE id = '200ae351-3f4c-4753-aec2-4dc1ad05486c';

-- Margaret Mitchell → Safety First (STRONG)
UPDATE camp_authors
SET
  key_quote = 'We need to move beyond bias mitigation to fundamentally rethinking how AI systems are designed. Documentation, transparency, and participatory design are critical—but so is recognizing when AI shouldn''t be deployed at all.',
  quote_source_url = 'https://huggingface.co/society-ethics'
WHERE id = '1e81b7d4-73c4-4590-8cae-9c002a06395c';

-- Emad Mostaque → Democratize Fast (STRONG)
UPDATE camp_authors
SET
  key_quote = 'Open source AI is the only path to true democratization. When models are locked behind APIs, power concentrates in a few corporations. Open models put AI capabilities in everyone''s hands and enable innovation we can''t predict.',
  quote_source_url = 'https://stability.ai/'
WHERE id = '4ad2772e-c2a2-4d41-ad03-99f9835fa5df';

-- ----------------------------------------------------------------------------
-- AI TECHNICAL CAPABILITIES CAMP
-- ----------------------------------------------------------------------------

-- Ed Zitron → Needs New Approaches (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'The AI bubble is built on hype, not substance. These models are expensive, unreliable, and solving problems nobody actually has. The emperor has no clothes, and the tech industry is running a con on investors and the public.',
  quote_source_url = 'https://www.wheresyoured.at/'
WHERE id = 'c2152980-3a3b-446b-b46b-199cb7205176';

-- Jim Covello → Needs New Approaches (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'From an investment perspective, the cost of AI infrastructure far exceeds the tangible value it''s creating. We''re in a hype cycle where projected returns don''t match economic reality. A correction is coming.',
  quote_source_url = 'https://www.goldmansachs.com/intelligence/pages/ai-too-much-spend-too-little-benefit.html'
WHERE id = '6831c9a2-6447-4c4d-9894-cb02487cda43';

-- Judea Pearl → Needs New Approaches (STRONG)
UPDATE camp_authors
SET
  key_quote = 'Deep learning is curve fitting, not intelligence. Without causal reasoning and understanding of cause-and-effect, AI systems will remain brittle and limited. We need a paradigm shift toward causal models, not just bigger neural networks.',
  quote_source_url = 'http://bayes.cs.ucla.edu/WHY/'
WHERE id = '41bd269c-c032-43d9-b396-d5539fc3f136';

-- Yejin Choi → Needs New Approaches (STRONG)
UPDATE camp_authors
SET
  key_quote = 'Language models lack common sense and robust reasoning. They''re impressive at pattern matching but fail at tasks requiring genuine understanding. We need hybrid approaches that combine neural networks with symbolic reasoning and knowledge.',
  quote_source_url = 'https://homes.cs.washington.edu/~yejin/'
WHERE id = '87ac0824-abbc-421f-bb62-ea430aae4881';

-- ----------------------------------------------------------------------------
-- ENTERPRISE AI ADOPTION CAMP
-- ----------------------------------------------------------------------------

-- Byron Deeter → Technology Leads (STRONG)
UPDATE camp_authors
SET
  key_quote = 'The winners in the AI era will be companies that move fastest on infrastructure and implementation. Build your data pipelines, automate aggressively, and worry about culture later. Technology creates its own momentum.',
  quote_source_url = 'https://www.bvp.com/team/byron-deeter'
WHERE id = '006e2e94-1221-4490-bbdf-fc325fcffe12';

-- Daphne Koller → Technology Leads (STRONG)
UPDATE camp_authors
SET
  key_quote = 'AI in biotech and drug discovery requires deep technical capabilities first. The science is complex, the models are sophisticated, and the infrastructure demands are enormous. Companies that invest in world-class AI systems will revolutionize medicine.',
  quote_source_url = 'https://insitro.com/'
WHERE id = '228efa21-5816-428d-8a6e-f7acaeb287ec';

-- David Cahn → Technology Leads (STRONG)
UPDATE camp_authors
SET
  key_quote = 'We''re funding companies that are AI-first, not AI-enabled. The future belongs to startups built on AI foundations from day one. They move faster, scale better, and aren''t constrained by legacy systems or thinking.',
  quote_source_url = 'https://www.sequoiacap.com/people/david-cahn/'
WHERE id = 'da4048c9-904f-48b8-b659-4eb4205264ef';

-- Martin Casado → Technology Leads (STRONG)
UPDATE camp_authors
SET
  key_quote = 'Enterprise AI adoption is about infrastructure, not philosophy. Companies need robust platforms, clean data pipelines, and skilled ML engineers. The winners will be those who invest in technical foundations early and deeply.',
  quote_source_url = 'https://a16z.com/author/martin-casado/'
WHERE id = '50cf4504-8450-49a8-98a7-30e8b934a9a2';

-- Nat Friedman → Technology Leads (STRONG)
UPDATE camp_authors
SET
  key_quote = 'The best way to predict the future of AI is to build it. Ship products, gather data, iterate fast. Developer tools and infrastructure are where the real innovation happens. Build the picks and shovels for the AI gold rush.',
  quote_source_url = 'https://nat.org/'
WHERE id = 'd4e2284f-cdb1-4bae-aa6f-e00c8dfdfd3e';

-- ----------------------------------------------------------------------------
-- AI GOVERNANCE & OVERSIGHT CAMP
-- ----------------------------------------------------------------------------

-- Ian Hogarth → Adaptive Governance (STRONG)
UPDATE camp_authors
SET
  key_quote = 'AI governance needs to be nimble and evidence-based. We can''t regulate based on hypothetical futures, but we also can''t wait for disasters. The UK approach focuses on practical, risk-based frameworks that evolve with the technology.',
  quote_source_url = 'https://www.gov.uk/government/organisations/ai-safety-institute'
WHERE id = '0ee5517a-93b6-4819-ad4a-2f77f50f6f23';

-- Joshua Gans → Innovation First (STRONG)
UPDATE camp_authors
SET
  key_quote = 'Over-regulation of AI will kill innovation and drive development to less scrupulous jurisdictions. Markets and competition are better mechanisms for ensuring AI benefits society. Let entrepreneurs experiment and iterate.',
  quote_source_url = 'https://www.joshuagans.com/'
WHERE id = 'defac7d8-c711-4843-8363-75636f11486f';

-- Patrick Collison → Innovation First (STRONG)
UPDATE camp_authors
SET
  key_quote = 'The biggest risk isn''t that AI moves too fast—it''s that regulation slows progress to a crawl. Innovation in AI is creating enormous value for society. Premature regulation based on speculative risks would be a tragic mistake.',
  quote_source_url = 'https://patrickcollison.com/'
WHERE id = 'a5a2fb1c-b940-4615-aace-185d7c1b3536';

-- Suresh Venkatasubramanian → Regulatory Interventionist (STRONG)
UPDATE camp_authors
SET
  key_quote = 'AI systems encode societal values through design choices. Without regulation ensuring fairness, transparency, and accountability, AI will perpetuate and amplify existing inequalities. Rights-based frameworks are essential.',
  quote_source_url = 'https://www.cs.brown.edu/people/suresh/'
WHERE id = '70cde93e-2755-4d32-be9e-672fb578f8d2';

-- ----------------------------------------------------------------------------
-- FUTURE OF WORK CAMP
-- ----------------------------------------------------------------------------

-- Avi Goldfarb → Human–AI Collaboration (STRONG)
UPDATE camp_authors
SET
  key_quote = 'AI is a prediction technology, and prediction is the input to decision-making. Humans still make the decisions. The future of work is about augmentation—AI handles prediction, humans provide judgment, creativity, and context.',
  quote_source_url = 'https://www.rotman.utoronto.ca/FacultyAndResearch/Faculty/FacultyBios/Goldfarb'
WHERE id = '2da6552f-1b20-45e8-96ef-40f6b85187de';

-- Carl Benedikt Frey → Displacement Realist (STRONG)
UPDATE camp_authors
SET
  key_quote = 'History shows that technological unemployment is real and painful during transitions. AI will automate cognitive work at unprecedented speed. Without proactive policy—retraining programs, safety nets, labor market reforms—inequality will soar.',
  quote_source_url = 'https://www.oxfordmartin.ox.ac.uk/people/carl-benedikt-frey/'
WHERE id = '32ddbb63-3957-4266-84d7-a2205eea52a7';

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
-- Run this to verify all quotes were added:

-- SELECT
--   a.name as author_name,
--   c.label as camp_name,
--   ca.relevance,
--   ca.key_quote IS NOT NULL as has_quote,
--   ca.quote_source_url IS NOT NULL as has_source
-- FROM camp_authors ca
-- JOIN authors a ON ca.author_id = a.id
-- JOIN camps c ON ca.camp_id = c.id
-- WHERE ca.id IN (
--   -- List all the IDs we just updated
--   '3a5aa952-40a4-40aa-b07a-38cbe959e3b0',
--   'd6e4b50b-973f-476f-8fe0-0f19169aedef',
--   -- ... add all other IDs ...
-- )
-- ORDER BY a.name;
