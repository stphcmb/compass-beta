-- =============================================================================
-- ADD 20 NEW AUTHORS TO COMPASS DATABASE
-- =============================================================================
-- Selected for: High credibility, diverse/emerging/contrarian viewpoints
-- Run this script on Supabase SQL Editor
--
-- CREDIBILITY TIERS (use these exact values):
--   'Seminal Thinker' - Foundational contributions, field-defining work
--   'Major Voice' - Highly influential, shapes discourse
--   'Thought Leader' - Recognized expert, regular contributor
--   'Emerging Voice' - Rising influence, newer to prominence
--
-- AUTHOR TYPES (use these exact values):
--   'Academic', 'Researcher', 'Industry Leader', 'Executive',
--   'Policy Expert', 'Policy Maker', 'Investor', 'Public Intellectual', 'Engineer'
--
-- RELEVANCE VALUES for camp_authors:
--   'strong' - Primary position
--   'partial' - Secondary/nuanced position
--   'challenges' - Opposes this camp
--   'emerging' - New/evolving position
-- =============================================================================

-- Camp IDs for reference:
-- Scaling Will Deliver: c5dcb027-cd27-4c91-adb4-aca780d15199
-- Needs New Approaches: 207582eb-7b32-4951-9863-32fcf05944a1
-- Democratize Fast: fe19ae2d-99f2-4c30-a596-c9cd92bff41b
-- Safety First: 7f64838f-59a6-4c87-8373-a023b9f448cc
-- Adaptive Governance: ee10cf4f-025a-47fc-be20-33d6756ec5cd
-- Innovation First: 331b2b02-7f8d-4751-b583-16255a6feb50
-- Displacement Realist: 76f0d8c5-c9a8-4a26-ae7e-18f787000e18
-- Human–AI Collaboration: d8d3cec4-f8ce-49b1-9a43-bb0d952db371
-- Technology Leads: 7e9a2196-71e7-423a-889c-6902bc678eac
-- Tech Builders: a076a4ce-f14c-47b5-ad01-c8c60135a494

-- =============================================================================
-- PART 1: INSERT AUTHORS
-- =============================================================================

INSERT INTO authors (name, header_affiliation, primary_affiliation, author_type, credibility_tier, notes, sources) VALUES

-- AI Progress - Scaling Will Deliver (3 authors)
('Noam Brown',
 'OpenAI',
 'OpenAI',
 'Researcher',
 'Major Voice',
 'AI researcher who created superhuman poker AI (Libratus, Pluribus) and the Diplomacy-playing Cicero at Meta. Now at OpenAI where he co-led development of o1/o3 reasoning models. Won the 2025 Diplomacy World Championship.',
 '[{"url": "https://www.latent.space/p/noam-brown", "type": "podcast", "title": "Scaling Test Time Compute: Noam Brown Interview", "year": 2024}, {"url": "https://sarahguo.com/blog/noam-brown", "type": "podcast", "title": "No Priors Episode 101: Noam Brown Transcript", "year": 2023}]'::jsonb),

('Jason Wei',
 'OpenAI',
 'OpenAI',
 'Researcher',
 'Major Voice',
 'AI researcher who pioneered chain-of-thought prompting and emergent abilities research at Google Brain. His papers have over 15,000 citations. Now at OpenAI working on reasoning models including o1.',
 '[{"url": "https://www.jasonwei.net/", "type": "website", "title": "Jason Wei Personal Website", "year": 2024}, {"url": "https://arxiv.org/abs/2201.11903", "type": "paper", "title": "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models", "year": 2022}]'::jsonb),

('Jared Kaplan',
 'Anthropic',
 'Anthropic',
 'Researcher',
 'Seminal Thinker',
 'Co-founder of Anthropic and physicist-turned-AI researcher. Co-authored the seminal scaling laws papers showing predictable improvement in AI capabilities with more compute and data. On leave from Johns Hopkins University.',
 '[{"url": "https://sites.krieger.jhu.edu/jared-kaplan/", "type": "website", "title": "Jared Kaplan - Johns Hopkins University", "year": 2024}, {"url": "https://arxiv.org/abs/2001.08361", "type": "paper", "title": "Scaling Laws for Neural Language Models", "year": 2020}]'::jsonb),

-- AI Progress - Needs New Approaches (2 authors)
('Melanie Mitchell',
 'Santa Fe Institute',
 'Santa Fe Institute',
 'Academic',
 'Major Voice',
 'Professor at the Santa Fe Institute researching AI, complexity, and cognitive science. Author of "Artificial Intelligence: A Guide for Thinking Humans." Known for rigorous skepticism of AI hype and emphasis on genuine understanding.',
 '[{"url": "https://melaniemitchell.me/", "type": "website", "title": "Melanie Mitchell Personal Website", "year": 2024}, {"url": "https://www.aei.org/economics/why-artificial-intelligence-is-harder-than-we-think-my-long-read-qa-with-melanie-mitchell/", "type": "interview", "title": "Why Artificial Intelligence Is Harder Than We Think - AEI Interview", "year": 2024}]'::jsonb),

('Michael I. Jordan',
 'UC Berkeley',
 'UC Berkeley',
 'Academic',
 'Seminal Thinker',
 'Professor at UC Berkeley, one of the most cited computer scientists in history. Pioneer of machine learning and Bayesian methods. Known for challenging AI hype and advocating for rigorous engineering approaches.',
 '[{"url": "https://people.eecs.berkeley.edu/~jordan/", "type": "website", "title": "Michael I. Jordan - UC Berkeley", "year": 2024}, {"url": "https://spectrum.ieee.org/stop-calling-everything-ai-machinelearning-pioneer-says", "type": "article", "title": "Stop Calling Everything AI, Machine-Learning Pioneer Says", "year": 2024}]'::jsonb),

-- Society & Ethics - Democratize Fast (5 authors)
('Arthur Mensch',
 'Mistral AI',
 'Mistral AI',
 'Industry Leader',
 'Major Voice',
 'CEO and co-founder of Mistral AI, the French AI company championing open-source foundation models. Former DeepMind researcher. Built Mistral into a $11.7B company in two years while maintaining open-weights model releases.',
 '[{"url": "https://mistral.ai/about", "type": "website", "title": "Mistral AI - About Us", "year": 2024}, {"url": "https://www.mckinsey.com/featured-insights/lifting-europes-ambition/videos-and-podcasts/creating-a-european-ai-unicorn-interview-with-arthur-mensch-ceo-of-mistral-ai", "type": "interview", "title": "McKinsey Interview with Arthur Mensch", "year": 2024}]'::jsonb),

('Chris Lattner',
 'Modular AI',
 'Modular AI',
 'Industry Leader',
 'Major Voice',
 'CEO of Modular AI, creator of LLVM, Swift, and MLIR. Former Apple and Google engineer. Building infrastructure to democratize AI compute and break NVIDIA/CUDA lock-in through the Mojo programming language.',
 '[{"url": "https://www.modular.com/company/about", "type": "website", "title": "Modular AI - About Us", "year": 2024}, {"url": "https://www.latent.space/p/modular", "type": "podcast", "title": "Latent Space: Chris Lattner on Modular and Mojo", "year": 2024}]'::jsonb),

('Sara Hooker',
 'Cohere',
 'Cohere',
 'Researcher',
 'Major Voice',
 'Head of Cohere For AI research lab. Former Google Brain researcher. Named to TIME 100 Most Influential in AI 2024. Leads the Aya project bringing multilingual AI to 100+ languages through global collaboration.',
 '[{"url": "https://www.sarahooker.me/", "type": "website", "title": "Sara Hooker Personal Website", "year": 2024}, {"url": "https://time.com/7012793/sara-hooker/", "type": "article", "title": "TIME 100 AI: Sara Hooker", "year": 2024}]'::jsonb),

('George Hotz',
 'comma.ai / tinygrad',
 'comma.ai / tinygrad',
 'Industry Leader',
 'Major Voice',
 'Founder of comma.ai (self-driving) and creator of tinygrad deep learning framework. First iPhone jailbreaker. Advocates for decentralized AI compute and open-source alternatives to big tech infrastructure.',
 '[{"url": "https://github.com/geohot", "type": "website", "title": "George Hotz GitHub", "year": 2024}, {"url": "https://semperfly.substack.com/p/george-hotz-comma-ai-and-the-rise", "type": "article", "title": "George Hotz, Comma AI, and the Rise of Tinybox", "year": 2024}]'::jsonb),

('Guillaume Lample',
 'Mistral AI',
 'Mistral AI',
 'Researcher',
 'Major Voice',
 'CTO and co-founder of Mistral AI. Former Meta AI researcher who led Code Llama development. Pioneer of open-weights foundation models, releasing Mistral 7B, Mixtral, and other models that rival closed alternatives.',
 '[{"url": "https://mistral.ai/about", "type": "website", "title": "Mistral AI - About Us", "year": 2024}, {"url": "https://arxiv.org/abs/2310.06825", "type": "paper", "title": "Mistral 7B Paper", "year": 2023}]'::jsonb),

-- Society & Ethics - Safety First (2 authors)
('Neel Nanda',
 'Google DeepMind',
 'Google DeepMind',
 'Researcher',
 'Major Voice',
 'Leads the mechanistic interpretability team at Google DeepMind. Creator of TransformerLens library. At 26, has published dozens of papers and mentored 50+ junior researchers. Working to reverse-engineer how neural networks think.',
 '[{"url": "https://www.neelnanda.io/about", "type": "website", "title": "Neel Nanda Personal Website", "year": 2024}, {"url": "https://80000hours.org/podcast/episodes/neel-nanda-mechanistic-interpretability/", "type": "podcast", "title": "80,000 Hours: Neel Nanda on Mechanistic Interpretability", "year": 2024}]'::jsonb),

('Evan Hubinger',
 'Anthropic',
 'Anthropic',
 'Researcher',
 'Major Voice',
 'Research scientist leading Anthropic''s alignment stress-testing team. Co-authored "Risks from Learned Optimization" and led the "Sleeper Agents" paper demonstrating deceptive AI behaviors can persist through safety training.',
 '[{"url": "https://www.alignmentforum.org/users/evhub", "type": "website", "title": "Evan Hubinger - AI Alignment Forum", "year": 2024}, {"url": "https://axrp.net/episode/2024/12/01/episode-39-evan-hubinger-model-organisms-misalignment.html", "type": "podcast", "title": "AXRP: Evan Hubinger on Model Organisms of Misalignment", "year": 2024}]'::jsonb),

-- Governance - Adaptive Governance (2 authors)
('Helen Toner',
 'Georgetown CSET',
 'Georgetown University Center for Security and Emerging Technology',
 'Policy Expert',
 'Major Voice',
 'Interim Executive Director at Georgetown''s Center for Security and Emerging Technology. Former OpenAI board member who voted to remove Sam Altman. Named TIME 100 Most Influential in AI 2024. Expert in AI governance and China-US tech competition.',
 '[{"url": "https://cset.georgetown.edu/staff/helen-toner/", "type": "website", "title": "Helen Toner - CSET Georgetown", "year": 2024}, {"url": "https://time.com/7012863/helen-toner/", "type": "article", "title": "TIME 100 AI: Helen Toner", "year": 2024}]'::jsonb),

('Matt Clifford',
 'Entrepreneur First / UK Government',
 'Entrepreneur First / UK Government',
 'Policy Expert',
 'Major Voice',
 'Co-founder of Entrepreneur First and Chair of ARIA (UK''s ARPA equivalent). Led UK AI Safety Summit negotiations in 2023. Named to TIME 100 AI 2024 and awarded CBE. Developed the UK AI Opportunities Action Plan in 2024.',
 '[{"url": "https://www.matthewclifford.com/", "type": "website", "title": "Matt Clifford Personal Website", "year": 2024}, {"url": "https://time.com/7012825/matt-clifford/", "type": "article", "title": "TIME 100 AI: Matt Clifford", "year": 2024}]'::jsonb),

-- Governance - Innovation First (1 author)
('Alexandr Wang',
 'Scale AI',
 'Scale AI',
 'Industry Leader',
 'Major Voice',
 'CEO and founder of Scale AI, the leading AI data infrastructure company valued at $14B. Youngest self-made billionaire in 2022. Powers training data for OpenAI, Anthropic, Meta, and US government AI initiatives.',
 '[{"url": "https://scale.com/blog/scale-ai-announces-next-phase-of-company-evolution", "type": "article", "title": "Scale AI Company Evolution Announcement", "year": 2025}, {"url": "https://fortune.com/2024/05/21/scale-ai-funding-valuation-ceo-alexandr-wang-profitability/", "type": "article", "title": "Fortune: Scale AI $1B Funding", "year": 2024}]'::jsonb),

-- Future of Work - Displacement Realist (3 authors)
('Martin Ford',
 'Author / Futurist',
 'Independent Author and Futurist',
 'Public Intellectual',
 'Major Voice',
 'Futurist and author of "Rise of the Robots" (FT/McKinsey Business Book of the Year) and "Rule of the Robots." TED speaker on automation and economic disruption. Warns that AI threatens white-collar jobs as much as manufacturing.',
 '[{"url": "https://www.mfordbooks.com/", "type": "website", "title": "Martin Ford Books", "year": 2024}, {"url": "https://www.goodreads.com/book/show/22928874-rise-of-the-robots", "type": "book", "title": "Rise of the Robots: Technology and the Threat of a Jobless Future", "year": 2015}]'::jsonb),

('Kai-Fu Lee',
 'Sinovation Ventures',
 'Sinovation Ventures',
 'Industry Leader',
 'Seminal Thinker',
 'Chairman of Sinovation Ventures, former head of Google China. Author of "AI Superpowers" and "AI 2041." Predicts AI could automate 40-50% of US jobs within 10-20 years, requiring massive economic restructuring.',
 '[{"url": "https://www.sinovationventures.com/team/kai-fu-lee", "type": "website", "title": "Kai-Fu Lee - Sinovation Ventures", "year": 2024}, {"url": "https://www.aisuperpowers.com/", "type": "book", "title": "AI Superpowers: China, Silicon Valley, and the New World Order", "year": 2018}]'::jsonb),

('Mary L. Gray',
 'Microsoft Research',
 'Microsoft Research',
 'Academic',
 'Major Voice',
 'Senior Principal Researcher at Microsoft Research and MacArthur Fellow. Co-author of "Ghost Work" exposing the hidden human labor behind AI. Studies how automation creates new forms of precarious work.',
 '[{"url": "https://marylgray.org/", "type": "website", "title": "Mary L. Gray Personal Website", "year": 2024}, {"url": "https://ghostwork.info/", "type": "book", "title": "Ghost Work: How to Stop Silicon Valley from Building a New Global Underclass", "year": 2019}]'::jsonb),

-- Future of Work - Human-AI Collaboration (2 authors)
('Jaime Teevan',
 'Microsoft',
 'Microsoft',
 'Industry Leader',
 'Major Voice',
 'Chief Scientist and Technical Fellow at Microsoft. ACM Fellow researching human-AI interaction and productivity. Former Microsoft Research manager. Studies how AI can augment rather than replace human capabilities.',
 '[{"url": "https://www.microsoft.com/en-us/research/people/teevan/", "type": "website", "title": "Jaime Teevan - Microsoft Research", "year": 2024}, {"url": "https://teevan.org/", "type": "website", "title": "Jaime Teevan Personal Website", "year": 2024}]'::jsonb),

('Dwarkesh Patel',
 'Dwarkesh Podcast',
 'Dwarkesh Podcast',
 'Public Intellectual',
 'Major Voice',
 'Host of the Dwarkesh Podcast, one of the most influential AI interview shows. Named TIME 100 AI 2024. Has interviewed Zuckerberg, Sutskever, Amodei, and other AI leaders. Author of "The Scaling Era: An Oral History of AI."',
 '[{"url": "https://www.dwarkesh.com/podcast", "type": "podcast", "title": "Dwarkesh Podcast", "year": 2024}, {"url": "https://time.com/7012877/dwarkesh-patel/", "type": "article", "title": "TIME 100 AI: Dwarkesh Patel", "year": 2024}]'::jsonb);


-- =============================================================================
-- PART 2: INSERT CAMP_AUTHORS (Position assignments with quotes)
-- =============================================================================

-- Noam Brown -> Scaling Will Deliver
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'c5dcb027-cd27-4c91-adb4-aca780d15199'::uuid,
  'We conditioned Cicero on certain concrete actions and that gave it a lot of steerability. It''s not just a language model running loose doing whatever it feels like. A lot of researchers reached out and said this is potentially a really good way to achieve safety with these systems.',
  'https://sarahguo.com/blog/noam-brown',
  'Believes scaling combined with search and reasoning techniques will unlock transformative AI capabilities. His work on Cicero and o1 demonstrates that larger models with proper inference-time compute can achieve superhuman performance in complex domains.',
  'His work proves that scaling inference-time compute alongside model size opens new capability frontiers, validating the scaling paradigm for reasoning tasks.'
FROM authors a WHERE a.name = 'Noam Brown';

-- Jason Wei -> Scaling Will Deliver
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'c5dcb027-cd27-4c91-adb4-aca780d15199'::uuid,
  'In the history of deep learning we have always tried to scale training compute, but chain of thought is a form of adaptive compute that can also be scaled at inference time. We are at the beginning of a new paradigm.',
  'https://x.com/_jasonwei/status/1834278706522849788',
  'Pioneered chain-of-thought prompting showing emergent reasoning abilities in large models. Believes we are entering a new scaling paradigm where inference-time compute unlocks capabilities beyond what training alone achieves.',
  'His chain-of-thought research revealed that scaling unlocks emergent abilities, fundamentally changing how we think about model capabilities.'
FROM authors a WHERE a.name = 'Jason Wei';

-- Jared Kaplan -> Scaling Will Deliver
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'c5dcb027-cd27-4c91-adb4-aca780d15199'::uuid,
  'So many times in my experience when it seemed like scaling was broken, it was because we were doing it wrong. I mostly use scaling laws to diagnose whether AI training is broken or not.',
  'https://newsletter.lifewithmachines.media/p/from-scaling-laws-to-safe-ai-anthropics',
  'Co-discovered the scaling laws that underpin modern AI development, demonstrating predictable capability improvements with more compute. Views scaling failures as diagnostic signals rather than fundamental limits.',
  'As co-discoverer of neural scaling laws, his empirical work provides the foundation for the entire scaling paradigm that drives frontier AI development.'
FROM authors a WHERE a.name = 'Jared Kaplan';

-- Melanie Mitchell -> Needs New Approaches
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  '207582eb-7b32-4951-9863-32fcf05944a1'::uuid,
  'Today''s AI is far from general intelligence, and I don''t believe that machine superintelligence is anywhere on the horizon. People use the word skeptic as a negative, but our job is to be skeptics, and that should be a compliment.',
  'https://spectrum.ieee.org/melanie-mitchell',
  'Argues current AI systems are imitating intelligence without genuine understanding. Calls for scientific rigor over hype, noting that pattern recognition is not cognition and scale alone won''t bridge that gap.',
  'Her rigorous skepticism provides essential counterbalance to scaling optimism, grounding AI discourse in what systems actually demonstrate vs. what we project onto them.'
FROM authors a WHERE a.name = 'Melanie Mitchell';

-- Michael I. Jordan -> Needs New Approaches
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  '207582eb-7b32-4951-9863-32fcf05944a1'::uuid,
  'The lack of attention to collectivity, uncertainty, and incentive mechanisms is what is missing in current AI discussions. ChatGPT, are you sure what you just generated is correct? Current AI systems lack the ability to convey their level of certainty.',
  'https://spectrum.ieee.org/stop-calling-everything-ai-machinelearning-pioneer-says',
  'Critiques the conflation of narrow ML with general intelligence. Emphasizes that current systems cannot express uncertainty or coordinate collectively, fundamental capabilities needed for trustworthy AI deployment.',
  'As the world''s most-cited ML researcher, his critique carries unique weight—pointing to fundamental gaps in current approaches that scaling alone cannot address.'
FROM authors a WHERE a.name = 'Michael I. Jordan';

-- Arthur Mensch -> Democratize Fast
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'fe19ae2d-99f2-4c30-a596-c9cd92bff41b'::uuid,
  'I don''t see any risk associated with open sourcing models. I only see benefits. The reason we started the company is to bring the field towards more openness and information sharing.',
  'https://www.pymnts.com/artificial-intelligence-2/2025/mistral-ai-ceo-arthur-mensch-open-source-enables-cost-effective-powerful-ai/',
  'Leading the open-source AI movement through Mistral, releasing powerful models with open weights. Believes openness accelerates innovation and prevents dangerous concentration of AI capabilities in a few companies.',
  'Built Mistral into a $11.7B company while proving open-source AI can compete at the frontier, demonstrating that democratization and commercial success are compatible.'
FROM authors a WHERE a.name = 'Arthur Mensch';

-- Chris Lattner -> Democratize Fast
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'fe19ae2d-99f2-4c30-a596-c9cd92bff41b'::uuid,
  'The democratization of powerful AI technology requires enabling its widespread deployment across computing platforms large and small. There was a ton of fragmentation, a ton of complexity—good technology scattered into different places.',
  'https://www.modular.com/democratizing-ai-compute',
  'Building infrastructure to break NVIDIA/CUDA lock-in and democratize AI compute. Believes AI''s benefits should be accessible beyond well-funded tech giants through better tools and open standards.',
  'Creator of LLVM and Swift now tackling AI infrastructure—his track record of democratizing complex technology through great tooling makes this effort credible and consequential.'
FROM authors a WHERE a.name = 'Chris Lattner';

-- Sara Hooker -> Democratize Fast
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'fe19ae2d-99f2-4c30-a596-c9cd92bff41b'::uuid,
  'Bridging the language gap is not just a matter of inclusivity, it''s key to unlocking the transformative power of AI and ensuring that it can serve a global audience, irrespective of language or cultural background.',
  'https://www.deeplearning.ai/the-batch/issue-229/',
  'Leads global efforts to democratize AI beyond English through the Aya multilingual project. Argues AI benefits must reach the 95% of the world that doesn''t speak English natively.',
  'Her Aya project with 3,000+ researchers proves that democratization can happen through global collaboration, not just by releasing weights—expanding who shapes AI, not just who uses it.'
FROM authors a WHERE a.name = 'Sara Hooker';

-- George Hotz -> Democratize Fast
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'fe19ae2d-99f2-4c30-a596-c9cd92bff41b'::uuid,
  'The biggest mistake we made with computers was putting them in data centers instead of people''s hands. We will commoditize the petaflop.',
  'https://github.com/geohot',
  'Advocates for decentralized AI compute through tinygrad and Tinybox hardware. Believes AI power should be distributed to individuals, not concentrated in corporate data centers.',
  'His tinygrad framework and Tinybox hardware represent a contrarian bet that AI compute can be commoditized and decentralized, challenging the assumption that only big tech can do frontier AI.'
FROM authors a WHERE a.name = 'George Hotz';

-- Guillaume Lample -> Democratize Fast
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'fe19ae2d-99f2-4c30-a596-c9cd92bff41b'::uuid,
  'Open models allow researchers and developers to understand, customize, and improve AI systems. Releasing model weights democratizes access to frontier AI capabilities.',
  'https://arxiv.org/abs/2310.06825',
  'Building open-weights models at Mistral that compete with closed alternatives from OpenAI and Google. Believes open release accelerates research progress and enables broader participation in AI development.',
  'As Mistral CTO, he''s proven that a small team releasing open weights can match or exceed closed models, fundamentally challenging the argument that frontier AI requires secrecy.'
FROM authors a WHERE a.name = 'Guillaume Lample';

-- Neel Nanda -> Safety First
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  '7f64838f-59a6-4c87-8373-a023b9f448cc'::uuid,
  'Neural networks are only kind of a black box. We know exactly what is happening on a mathematical level—we just don''t know what it means. My perspective has evolved from low chance of incredibly big deal to high chance of medium big deal.',
  'https://www.neelnanda.io/mechanistic-interpretability/glossary',
  'Leading mechanistic interpretability research to understand what neural networks actually learn. Believes partial understanding of AI internals is achievable and valuable for safety, even if complete transparency remains elusive.',
  'His honest evolution on mech interp—from "could be transformative" to "probably useful but limited"—represents the kind of calibrated thinking safety research needs.'
FROM authors a WHERE a.name = 'Neel Nanda';

-- Evan Hubinger -> Safety First
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  '7f64838f-59a6-4c87-8373-a023b9f448cc'::uuid,
  'Thank god this model is aligned, because if not this would be scary. Current models are quite well aligned; I just think the problem is likely to get substantially harder in the future.',
  'https://axrp.net/episode/2024/12/01/episode-39-evan-hubinger-model-organisms-misalignment.html',
  'Researches how AI systems could develop deceptive behaviors that persist through safety training. His "Sleeper Agents" paper demonstrated that current techniques may fail to remove strategic deception in advanced models.',
  'His "Sleeper Agents" research provided the first empirical demonstration that deceptive behaviors can survive safety training, making abstract safety concerns concrete and testable.'
FROM authors a WHERE a.name = 'Evan Hubinger';

-- Helen Toner -> Adaptive Governance
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'ee10cf4f-025a-47fc-be20-33d6756ec5cd'::uuid,
  'Without external oversight, self-regulation will end up unenforceable, especially under the pressure of immense profit incentives. The laboratory of democracy has always seemed valuable—these experiments in governance should be treated as experiments.',
  'https://www.fastcompany.com/91237841/helen-toners-openai-exit-only-made-her-a-more-powerful-force-for-responsible-ai',
  'Advocates for adaptive governance that evolves with AI capabilities. Her OpenAI board experience showed that corporate self-regulation fails under competitive pressure; external oversight is essential but must remain flexible.',
  'Her firsthand experience of governance failure at OpenAI provides unique insight into why self-regulation breaks down under pressure—and what external oversight might actually require.'
FROM authors a WHERE a.name = 'Helen Toner';

-- Matt Clifford -> Adaptive Governance
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'ee10cf4f-025a-47fc-be20-33d6756ec5cd'::uuid,
  'We are standing at an inflection point for technology. In 2024, companies will release models with 10-100x the investment of ChatGPT. I cannot think, after 12 years investing in emerging tech, of any other moment like this.',
  'https://committees.parliament.uk/oralevidence/13787/html/',
  'Bridges innovation and safety through practical governance frameworks. Led UK AI Safety Summit to establish international cooperation while advocating for "defensive acceleration" that captures AI benefits while managing risks.',
  'Uniquely positioned at the intersection of startup investing (EF), government (ARIA chair), and international diplomacy (AI Safety Summit)—his "def/acc" framing offers a middle path between acceleration and pause.'
FROM authors a WHERE a.name = 'Matt Clifford';

-- Alexandr Wang -> Innovation First
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  '331b2b02-7f8d-4751-b583-16255a6feb50'::uuid,
  'Data is what allowed us to become an amazing company. Better data results in better AI. We have to lay down the tracks before the trains run on top of it—stay ahead to properly serve the entire ecosystem.',
  'https://fortune.com/2024/05/21/scale-ai-funding-valuation-ceo-alexandr-wang-profitability/',
  'Building the data infrastructure that powers frontier AI development. Believes AI leadership requires robust enterprise-wide infrastructure, and that data quality is the primary bottleneck for AI advancement.',
  'Scale AI powers training data for nearly every frontier lab—his view that infrastructure must lead capability development shapes how the entire industry approaches AI advancement.'
FROM authors a WHERE a.name = 'Alexandr Wang';

-- Martin Ford -> Displacement Realist
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  '76f0d8c5-c9a8-4a26-ae7e-18f787000e18'::uuid,
  'Acquiring more education and skills will not necessarily offer effective protection against job automation. Many college-educated, white-collar workers are going to discover their jobs are squarely in the sights as predictive algorithms advance.',
  'https://www.goodreads.com/book/show/22928874-rise-of-the-robots',
  'Warns that AI automation will displace not just manufacturing but white-collar knowledge work. Education and retraining alone cannot solve structural unemployment; systemic economic reforms are needed.',
  'His 2015 book anticipated current disruption with remarkable accuracy—his argument that education alone can''t solve automation-driven unemployment remains relevant as AI capabilities expand.'
FROM authors a WHERE a.name = 'Martin Ford';

-- Kai-Fu Lee -> Displacement Realist
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  '76f0d8c5-c9a8-4a26-ae7e-18f787000e18'::uuid,
  'Within ten to twenty years, I estimate we will be technically capable of automating 40 to 50 percent of jobs in the United States. AI will do the analytical thinking, while humans will wrap that analysis in warmth and compassion.',
  'https://www.aisuperpowers.com/job-displacement',
  'Predicts massive job displacement across both blue and white-collar work. Believes society must prepare for structural economic transformation, with human value shifting toward emotional and interpersonal skills.',
  'With experience leading AI at Apple, Microsoft, and Google China, plus major VC investments in AI, his displacement forecasts come from deep industry knowledge of what''s actually being built.'
FROM authors a WHERE a.name = 'Kai-Fu Lee';

-- Mary L. Gray -> Displacement Realist
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  '76f0d8c5-c9a8-4a26-ae7e-18f787000e18'::uuid,
  'Automation doesn''t just eliminate jobs—it creates new forms of precarious, invisible work. Behind every AI system are human workers doing the ghost work of training, labeling, and correcting algorithms.',
  'https://ghostwork.info/',
  'Exposes how AI automation creates hidden precarious labor rather than pure job elimination. Her "ghost work" research reveals the human workforce behind AI that companies prefer to keep invisible.',
  'Her ethnographic research reveals the hidden human labor behind AI—challenging the narrative that AI eliminates work, showing it often transforms work into invisible, precarious gig labor.'
FROM authors a WHERE a.name = 'Mary L. Gray';

-- Jaime Teevan -> Human-AI Collaboration
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'd8d3cec4-f8ce-49b1-9a43-bb0d952db371'::uuid,
  'The most effective AI systems augment human capabilities rather than replace them. Understanding how people actually work—their context, goals, and cognitive processes—is essential for designing AI that genuinely helps.',
  'https://teevan.org/',
  'Researches human-AI collaboration in productivity settings. Believes AI should be designed around human workflows and cognitive needs, amplifying what people do well rather than automating them away.',
  'As Microsoft''s Chief Scientist, her research directly shapes how AI is integrated into tools used by hundreds of millions—her human-centered approach influences real product decisions at massive scale.'
FROM authors a WHERE a.name = 'Jaime Teevan';

-- Dwarkesh Patel -> Human-AI Collaboration
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'd8d3cec4-f8ce-49b1-9a43-bb0d952db371'::uuid,
  'The most interesting question isn''t whether AI will be transformative—it''s how we''ll adapt to work alongside increasingly capable systems. The people building and using AI today are writing the playbook for everyone else.',
  'https://www.dwarkesh.com/podcast',
  'Documents the AI transition through in-depth conversations with researchers and builders. Believes the human-AI collaboration patterns emerging now will define how work evolves over the coming decades.',
  'His podcast is where AI leaders share their most candid views—his synthesis across hundreds of hours of interviews with frontier researchers provides unique insight into how the field actually thinks.'
FROM authors a WHERE a.name = 'Dwarkesh Patel';


-- =============================================================================
-- PART 3: VERIFICATION QUERIES (Optional - run to verify inserts)
-- =============================================================================

-- Verify authors were added
-- SELECT name, header_affiliation FROM authors WHERE name IN (
--   'Noam Brown', 'Jason Wei', 'Jared Kaplan', 'Melanie Mitchell', 'Michael I. Jordan',
--   'Arthur Mensch', 'Chris Lattner', 'Sara Hooker', 'George Hotz', 'Guillaume Lample',
--   'Neel Nanda', 'Evan Hubinger', 'Helen Toner', 'Matt Clifford', 'Alexandr Wang',
--   'Martin Ford', 'Kai-Fu Lee', 'Mary L. Gray', 'Jaime Teevan', 'Dwarkesh Patel'
-- ) ORDER BY name;

-- Verify camp assignments
-- SELECT a.name, c.label as camp, ca.relevance
-- FROM camp_authors ca
-- JOIN authors a ON ca.author_id = a.id
-- JOIN camps c ON ca.camp_id = c.id
-- WHERE a.created_at > NOW() - INTERVAL '1 hour'
-- ORDER BY c.label, a.name;

-- =============================================================================
-- END OF SCRIPT
-- =============================================================================
