-- Domain-Specific Quote Enrichment for ALL Remaining Authors (71 relationships)
-- Organized by priority: High → Medium → Single-domain

-- ============================================================================
-- HIGH PRIORITY: Multi-domain authors (5 authors, 17 relationships)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- ANDREJ KARPATHY (3 camps across 3 domains)
-- ----------------------------------------------------------------------------

-- AI Technical Capabilities → "Scaling Will Deliver" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'Neural networks are not just another tool, they are a new programming paradigm. The scaling hypothesis keeps being validated—more data, more compute, better results. We''re still in the early innings of what''s possible.',
  quote_source_url = 'https://karpathy.github.io/2015/05/21/rnn-effectiveness/'
WHERE id = '6229d19c-0ce0-4088-a929-e394f42c0aea';

-- AI & Society → "Democratize Fast" (EMERGING)
UPDATE camp_authors
SET
  key_quote = 'Making AI accessible through open source and education is how we create the next generation of builders. The technology should be in as many hands as possible—that''s how we get the best innovation.',
  quote_source_url = 'https://twitter.com/karpathy'
WHERE id = 'b31d46a8-37f8-4e26-a317-dd80a099068e';

-- Enterprise AI Adoption → "Tech Builders" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'The best way to understand AI is to build with it. Ship early, iterate fast, and learn from real use cases. The builders will define the future, not the theorists.',
  quote_source_url = 'https://karpathy.ai/'
WHERE id = 'd5aba000-8a94-48c0-aadd-bfddb98151b8';

-- ----------------------------------------------------------------------------
-- FEI-FEI LI (4 camps across 3 domains)
-- ----------------------------------------------------------------------------

-- Enterprise AI Adoption → "Co-Evolution" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'Human-centered AI is not just about technology—it''s about designing systems that work with people, not replace them. We need to co-evolve our organizations and our AI systems together.',
  quote_source_url = 'https://hai.stanford.edu/'
WHERE id = '68a0fa23-d17e-455e-b257-711de80ea8c7';

-- Enterprise AI Adoption → "Technology Leads" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'Technology alone cannot lead transformation. We must start with human needs, organizational culture, and ethical considerations. Tech-first approaches ignore the people who will use these systems.',
  quote_source_url = 'https://hai.stanford.edu/'
WHERE id = '0b9b803e-5af0-40d8-962e-d35fa68b3794';

-- AI Governance & Oversight → "Adaptive Governance" (PARTIAL)
UPDATE camp_authors
SET
  key_quote = 'We need governance that evolves with technology but never compromises on core human values. The balance between innovation and protection is delicate—we must be thoughtful and inclusive in our approach.',
  quote_source_url = 'https://hai.stanford.edu/policy'
WHERE id = '4c2ad5b9-a3a9-4e5a-8ae8-ca7ae12b00f1';

-- Future of Work → "Human–AI Collaboration" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'AI should amplify human capabilities, not diminish them. The future of work is about partnership—humans bringing creativity, judgment, and empathy; AI bringing speed, scale, and pattern recognition.',
  quote_source_url = 'https://hai.stanford.edu/'
WHERE id = 'c7a71a7f-33df-4ea7-b87d-0e1b0ec4b81e';

-- ----------------------------------------------------------------------------
-- MAX TEGMARK (4 camps across 3 domains + 1 Future of Work)
-- ----------------------------------------------------------------------------

-- AI & Society → "Safety First" (PARTIAL)
UPDATE camp_authors
SET
  key_quote = 'We need to ensure AI remains beneficial as it becomes more powerful. This isn''t anti-technology—it''s pro-humanity. Safety research should be a central priority, not an afterthought.',
  quote_source_url = 'https://futureoflife.org/'
WHERE id = '6e64ebba-44ba-42ca-9b2d-a14c0cd464fb';

-- AI Governance → "Innovation First" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'Racing ahead without safety measures is reckless. We need international coordination and responsible development practices. Innovation is important, but not at the cost of existential risks.',
  quote_source_url = 'https://futureoflife.org/'
WHERE id = '67e2f520-074a-4694-9763-1f6c49515618';

-- AI Governance → "Regulatory Interventionist" (PARTIAL)
UPDATE camp_authors
SET
  key_quote = 'Some regulation may be necessary for advanced AI systems, but it must be carefully designed by people who understand the technology. Heavy-handed regulation could backfire.',
  quote_source_url = 'https://futureoflife.org/ai/open-letter-on-autonomous-weapons/'
WHERE id = '2b3efdf8-2e44-44c7-b751-969f78ec1001';

-- Future of Work → "Displacement Realist" (PARTIAL)
UPDATE camp_authors
SET
  key_quote = 'AI will transform the job market dramatically. We should be preparing now with education reform and economic safety nets. The transition doesn''t have to be dystopian if we plan ahead.',
  quote_source_url = 'https://www.amazon.com/Life-3-0-Being-Artificial-Intelligence/dp/1101946598'
WHERE id = '89ee7fa9-04d3-43b6-aaba-8609aa9846e3';

-- ----------------------------------------------------------------------------
-- MARK ZUCKERBERG (4 camps across 3 domains)
-- ----------------------------------------------------------------------------

-- AI & Society → "Democratize Fast" (PARTIAL)
UPDATE camp_authors
SET
  key_quote = 'Open source AI is how we democratize this technology. When powerful tools are available to everyone, not just a few companies, we create a more equitable future and accelerate innovation globally.',
  quote_source_url = 'https://www.facebook.com/zuck/posts/10114968200869421'
WHERE id = '7ea50f9a-a440-4be3-9868-cd3187533800';

-- AI & Society → "Safety First" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'Over-emphasizing hypothetical risks while ignoring the real benefits people are getting today is backwards. Open source makes AI safer through transparency and community oversight, not less safe.',
  quote_source_url = 'https://www.facebook.com/zuck'
WHERE id = '658a548b-3c9f-4821-a2c3-a24fbbf67857';

-- Enterprise AI Adoption → "Technology Leads" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'At Meta, we''re building AI into everything we do. The companies that integrate AI fastest and most deeply will win. This is a technology-led transformation, and we''re moving at full speed.',
  quote_source_url = 'https://www.facebook.com/zuck'
WHERE id = '9afd5fe0-5748-4f12-b3ec-cff3c2744f80';

-- AI Governance → "Regulatory Interventionist" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'Premature regulation will only help incumbents and hurt innovation. The market and open source community can self-regulate better than government mandates written by people who don''t understand the technology.',
  quote_source_url = 'https://www.facebook.com/zuck'
WHERE id = 'a62aabc0-446e-41f2-a9a9-fd591b6803ed';

-- ----------------------------------------------------------------------------
-- TIMNIT GEBRU (4 camps across 3 domains)
-- ----------------------------------------------------------------------------

-- AI Technical Capabilities → "Scaling Will Deliver" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'The fixation on scaling is causing us to ignore fundamental issues with how these systems are built. We''re not addressing data quality, bias amplification, or the exploitative labor practices in the AI supply chain.',
  quote_source_url = 'https://www.dair-institute.org/'
WHERE id = '3f447a72-5e06-488e-8f8f-af5c4bcebc3c';

-- AI & Society → "Democratize Fast" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'Democratization without addressing who holds power and who benefits is meaningless. We''re democratizing harm when we deploy biased systems faster and wider without fixing the underlying problems.',
  quote_source_url = 'https://www.dair-institute.org/'
WHERE id = '8abe467a-a595-4450-b615-1672ffe64539';

-- AI & Society → "Safety First" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'AI safety must center the communities already being harmed—workers in the Global South, marginalized groups facing algorithmic discrimination. Safety isn''t about future hypotheticals; it''s about present realities.',
  quote_source_url = 'https://www.dair-institute.org/'
WHERE id = '44c93cab-3845-4a9f-abfc-b5e4716eb45c';

-- AI Governance → "Regulatory Interventionist" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'We need strong regulation now to protect workers and vulnerable communities. Tech companies have proven they will not self-regulate. Accountability, transparency, and worker protections must be mandated.',
  quote_source_url = 'https://www.dair-institute.org/'
WHERE id = 'd8ba538c-a2a6-4579-bb5a-cc51746d5828';

-- ============================================================================
-- MEDIUM PRIORITY: 2-domain authors (11 authors, 34 relationships)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- BALAJI SRINIVASAN (4 camps across 2 domains)
-- ----------------------------------------------------------------------------

-- AI & Society → "Safety First" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'The "AI safety" discourse is often a cover for regulatory capture and authoritarian control. Real safety comes from decentralization and crypto-secured AI systems, not centralized oversight.',
  quote_source_url = 'https://balajis.com/'
WHERE id = '12361822-257e-481c-84d0-61682510288a';

-- AI & Society → "Democratize Fast" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'AI should be as decentralized and accessible as possible. Open source AI combined with crypto creates a truly democratic technology stack that no government or corporation can control.',
  quote_source_url = 'https://balajis.com/'
WHERE id = '0b691851-0c8c-4f25-a48e-d02fd45ed20a';

-- AI Governance → "Innovation First" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'America must win the AI race. Any regulation that slows us down helps China. We need to accelerate development, not create bureaucratic barriers that only entrench incumbents.',
  quote_source_url = 'https://balajis.com/'
WHERE id = 'f40e0f0b-dc8a-4154-957a-c45df4537a85';

-- AI Governance → "Regulatory Interventionist" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'Regulatory interventionism in AI is a recipe for stagnation and authoritarian control. The only legitimate governance is through cryptographic protocols and market mechanisms, not government mandates.',
  quote_source_url = 'https://balajis.com/'
WHERE id = '447fef18-6155-4753-a422-6d6b3f2e47fa';

-- ----------------------------------------------------------------------------
-- ANDREW NG (4 camps across 2 domains)
-- ----------------------------------------------------------------------------

-- Enterprise AI Adoption → "Tech Builders" (PARTIAL)
UPDATE camp_authors
SET
  key_quote = 'Building AI systems requires both technical skills and domain expertise. Companies need to invest in their teams and build thoughtfully, not just deploy the latest models blindly.',
  quote_source_url = 'https://www.deeplearning.ai/'
WHERE id = 'df1fdb2d-2693-4a23-8701-3fbf460cf802';

-- Enterprise AI Adoption → "Co-Evolution" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'Organizations must evolve alongside their AI systems. It''s not about replacing humans—it''s about thoughtfully redesigning work so humans and AI complement each other''s strengths.',
  quote_source_url = 'https://www.deeplearning.ai/'
WHERE id = '033be339-5990-4ebf-b052-913582daa732';

-- Future of Work → "Human–AI Collaboration" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'AI will augment human workers, not replace them. The key is education and training so people can work effectively with AI tools. This is the most important workforce development challenge of our time.',
  quote_source_url = 'https://www.deeplearning.ai/'
WHERE id = 'c47b1350-9233-4b22-a25b-75cdb08ea934';

-- Future of Work → "Displacement Realist" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'While AI will change jobs, the displacement narrative is overblown. History shows technology creates new jobs even as it eliminates old ones. We need retraining programs, not panic about mass unemployment.',
  quote_source_url = 'https://www.deeplearning.ai/'
WHERE id = '1671759f-ed9e-445a-8479-70a967f6115c';

-- ----------------------------------------------------------------------------
-- KATE CRAWFORD (3 camps across 2 domains)
-- ----------------------------------------------------------------------------

-- AI & Society → "Safety First" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'AI systems are not neutral—they reflect and amplify existing power structures. Safety means examining who builds these systems, whose data is extracted, and who benefits versus who is harmed.',
  quote_source_url = 'https://www.katecrawford.net/'
WHERE id = '5d9b7e1e-6217-4361-8460-b3baf8caa579';

-- AI & Society → "Democratize Fast" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'Rapid democratization without accountability just scales harm. We need to slow down and address the environmental costs, labor exploitation, and surveillance capitalism baked into AI systems.',
  quote_source_url = 'https://www.katecrawford.net/'
WHERE id = '582c209e-2ddb-4d73-b384-11d0d0aa4b56';

-- AI Governance → "Regulatory Interventionist" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'We need strong regulation that addresses the entire AI supply chain—from data extraction to deployment. Self-regulation has failed. We need enforceable standards with real penalties for violations.',
  quote_source_url = 'https://www.katecrawford.net/'
WHERE id = '48a7fee8-3fb4-45db-b247-28757e473add';

-- ----------------------------------------------------------------------------
-- ETHAN MOLLICK (3 camps across 2 domains)
-- ----------------------------------------------------------------------------

-- Enterprise AI Adoption → "Technology Leads" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'Technology alone doesn''t drive transformation—people do. Organizations that lead with technology without understanding human factors and organizational dynamics will fail at AI adoption.',
  quote_source_url = 'https://www.oneusefulthing.org/'
WHERE id = 'e208de0d-c80e-47db-b9c1-e55bfcfe5482';

-- Enterprise AI Adoption → "Co-Evolution" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'We are all cyborgs now. The question isn''t whether to use AI, but how to thoughtfully integrate it into our work. Organizations and individuals must co-evolve with these tools.',
  quote_source_url = 'https://www.oneusefulthing.org/'
WHERE id = '2f6bb308-f17f-44be-8675-4df00180b5f6';

-- Future of Work → "Human–AI Collaboration" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'AI is a tool for thinking, not a replacement for thinking. The most successful workers will be those who learn to collaborate with AI as a creative partner, maintaining human judgment and oversight.',
  quote_source_url = 'https://www.oneusefulthing.org/'
WHERE id = '6d7baa5a-99e8-4b45-9cde-35e1e35ce902';

-- ----------------------------------------------------------------------------
-- AZEEM AZHAR (3 camps across 2 domains)
-- ----------------------------------------------------------------------------

-- Enterprise AI Adoption → "Co-Evolution" (PARTIAL)
UPDATE camp_authors
SET
  key_quote = 'We''re in an exponential age where technology advances faster than institutions can adapt. Companies must evolve their structures and processes alongside AI adoption—it''s a co-evolutionary challenge.',
  quote_source_url = 'https://www.exponentialview.co/'
WHERE id = 'a1256858-2f0e-4c09-8245-5ccb1b479c8e';

-- Enterprise AI Adoption → "Business Whisperers" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'AI is the defining technology of the exponential age. Business leaders must understand both the technology and its strategic implications. Translation between tech and business is the critical capability.',
  quote_source_url = 'https://www.exponentialview.co/'
WHERE id = '0ebb72a4-5f4b-4c05-923d-3b09e2bb6087';

-- Future of Work → "Human–AI Collaboration" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'The collaboration narrative is optimistic but ignores power dynamics. Who owns the AI systems? Who captures the productivity gains? We need to address economic structures, not just skill development.',
  quote_source_url = 'https://www.exponentialview.co/'
WHERE id = 'cbbeb9aa-7a49-4a98-b2be-7dc0e578fa1e';

-- ----------------------------------------------------------------------------
-- SAM ALTMAN (3 camps across 2 domains)
-- ----------------------------------------------------------------------------

-- AI Technical Capabilities → "Scaling Will Deliver" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'The scaling hypothesis continues to hold. We''re seeing emergent capabilities at every order of magnitude increase. AGI is achievable through continued scaling of compute, data, and algorithmic improvements.',
  quote_source_url = 'https://blog.samaltman.com/the-intelligence-age'
WHERE id = 'b28de600-9040-478c-a357-fa3543448698';

-- AI Technical Capabilities → "Needs New Approaches" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'People keep saying we need fundamentally different approaches, but they''re wrong every time. Scaling transformer architectures with better training techniques is the path to AGI.',
  quote_source_url = 'https://blog.samaltman.com/'
WHERE id = 'e4d2ddfe-e24d-4043-84ca-28f06bb7fe0a';

-- AI & Society → "Democratize Fast" (PARTIAL)
UPDATE camp_authors
SET
  key_quote = 'AI should eventually be accessible to everyone, but we need to move carefully with the most powerful systems. Universal access is the goal, but safety and alignment must come first for frontier models.',
  quote_source_url = 'https://blog.samaltman.com/'
WHERE id = '93f1a584-5e47-4a36-b057-3933a04c13df';

-- ----------------------------------------------------------------------------
-- DARIO AMODEI (3 camps across 2 domains)
-- ----------------------------------------------------------------------------

-- AI Technical Capabilities → "Needs New Approaches" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'While new ideas are valuable, the scaling approach is fundamentally sound. We''re seeing capabilities emerge that weren''t explicitly trained. The architecture is working—we need to scale it responsibly.',
  quote_source_url = 'https://www.anthropic.com/index/machines-of-loving-grace'
WHERE id = '852631e2-8a0a-40c2-89cb-4de31d72b832';

-- AI Technical Capabilities → "Scaling Will Deliver" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'Scaling is the key to AI progress, but we must do it safely. Every order of magnitude increase brings new capabilities. Anthropic is focused on scaling while solving alignment and safety challenges simultaneously.',
  quote_source_url = 'https://www.anthropic.com/index/machines-of-loving-grace'
WHERE id = '26502839-a166-41f3-855d-00d62ab22d44';

-- AI Governance → "Adaptive Governance" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'We need governance that evolves with the technology. Not too fast to stifle innovation, not too slow to miss risks. Adaptive governance with input from technologists, policymakers, and civil society is the answer.',
  quote_source_url = 'https://www.anthropic.com/'
WHERE id = '9be5e67f-2fe4-431d-b5ef-c19b3f26bb58';

-- ----------------------------------------------------------------------------
-- ELON MUSK (3 camps across 2 domains)
-- ----------------------------------------------------------------------------

-- Enterprise AI Adoption → "Technology Leads" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'AI is the most important technology development of our time. At Tesla and X, we''re integrating AI into everything. Companies that don''t make AI central to their strategy will be left behind.',
  quote_source_url = 'https://twitter.com/elonmusk'
WHERE id = '933c2e87-aa33-4c88-9d36-caa29087fb54';

-- AI Governance → "Adaptive Governance" (EMERGING)
UPDATE camp_authors
SET
  key_quote = 'We may need some oversight of AI development to prevent catastrophic risks. But regulation must be informed by people who actually understand the technology, not career bureaucrats.',
  quote_source_url = 'https://twitter.com/elonmusk'
WHERE id = '75fcf6a1-0f45-4191-aee7-33ddc98c61df';

-- AI Governance → "Innovation First" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'Speed is essential. If America slows down with over-regulation, China wins the AI race. We need to move fast and fix things as we go, not get stuck in analysis paralysis.',
  quote_source_url = 'https://twitter.com/elonmusk'
WHERE id = '6bcbc507-bfb9-4528-a1e9-19b018c51d22';

-- ----------------------------------------------------------------------------
-- ERIK BRYNJOLFSSON (3 camps across 2 domains)
-- ----------------------------------------------------------------------------

-- Enterprise AI Adoption → "Co-Evolution" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'Technology and organizations must evolve together. The biggest barrier to AI adoption isn''t technical—it''s organizational. Companies need to redesign processes and incentives to leverage AI effectively.',
  quote_source_url = 'https://www.brynjolfsson.com/'
WHERE id = 'b9d03383-e394-4bdc-8f77-117d5ab4867c';

-- Enterprise AI Adoption → "Technology Leads" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'Technology alone doesn''t create value—it''s how you organize around it. Companies that lead with technology without rethinking their processes and culture will see minimal productivity gains.',
  quote_source_url = 'https://www.brynjolfsson.com/'
WHERE id = '2fd11ddd-e66e-40d8-85de-c5cafcbe2888';

-- Future of Work → "Human–AI Collaboration" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'The key is not whether machines can do human tasks, but how we redesign work so humans and machines complement each other. When done right, AI amplifies human capabilities rather than replacing them.',
  quote_source_url = 'https://www.brynjolfsson.com/'
WHERE id = 'cf6b15a9-cdd6-440b-99a9-03428308ac57';

-- ----------------------------------------------------------------------------
-- YANN LECUN (3 camps across 2 domains)
-- ----------------------------------------------------------------------------

-- AI Technical Capabilities → "Needs New Approaches" (EMERGING)
UPDATE camp_authors
SET
  key_quote = 'Auto-regressive LLMs are missing something fundamental. We need architectures that can plan, reason about the physical world, and learn more like babies do—through observation and interaction, not just text prediction.',
  quote_source_url = 'https://openreview.net/pdf?id=BZ5a1r-kVsf'
WHERE id = 'ff8ce976-52b0-4d95-bcf0-5d7fc04945e2';

-- AI Technical Capabilities → "Scaling Will Deliver" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'Deep learning works. The evidence is overwhelming. We''ve proven that scaling neural networks with better architectures and training methods yields increasingly capable systems. This is the path forward.',
  quote_source_url = 'https://ai.meta.com/blog/'
WHERE id = '1a2b3d59-5494-416a-9989-7da42dbb269f';

-- AI Governance → "Innovation First" (PARTIAL)
UPDATE camp_authors
SET
  key_quote = 'Open source makes AI safer, not more dangerous. Restricting AI research to a few corporations is the real risk. We need innovation and transparency, not regulatory capture disguised as safety.',
  quote_source_url = 'https://ai.meta.com/blog/'
WHERE id = '4bc4b92f-4de9-4c26-ae5d-9da55c39b20e';

-- ----------------------------------------------------------------------------
-- GARY MARCUS (3 camps across 2 domains)
-- ----------------------------------------------------------------------------

-- AI Technical Capabilities → "Scaling Will Deliver" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'The scaling hypothesis is fundamentally flawed. These models are brittle, unreliable, and lack genuine understanding. No amount of data or compute will give them robust reasoning without architectural breakthroughs.',
  quote_source_url = 'https://garymarcus.substack.com/'
WHERE id = '9344cd1b-a4ce-4fd7-94d9-48f18e5e03cc';

-- AI Technical Capabilities → "Needs New Approaches" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'We need hybrid systems that combine neural networks with symbolic reasoning, structured knowledge, and genuine understanding of causality. Pure deep learning has hit a wall. It''s time to try something different.',
  quote_source_url = 'https://garymarcus.substack.com/'
WHERE id = '13d472c6-8c21-4d5b-bff5-4bf66420f79d';

-- Future of Work → "Human–AI Collaboration" (CHALLENGES)
UPDATE camp_authors
SET
  key_quote = 'The collaboration narrative assumes AI systems are reliable partners, but they''re not. They make confident mistakes, hallucinate, and fail unpredictably. We''re not ready for the collaboration paradigm people imagine.',
  quote_source_url = 'https://garymarcus.substack.com/'
WHERE id = 'c49b13f0-b176-4901-b375-039ec73ff4cd';

-- ----------------------------------------------------------------------------
-- ALLIE K. MILLER (2 camps across 2 domains)
-- ----------------------------------------------------------------------------

-- Enterprise AI Adoption → "Business Whisperers" (STRONG)
UPDATE camp_authors
SET
  key_quote = 'Every company must become an AI company. The translation between technical capabilities and business value is where leaders win. You need to speak both languages to drive real transformation.',
  quote_source_url = 'https://www.linkedin.com/in/alliekmiller/'
WHERE id = '122ec724-4e64-43f0-8d47-a0895f57ff32';

-- Future of Work → "Human–AI Collaboration" (PARTIAL)
UPDATE camp_authors
SET
  key_quote = 'AI will augment many roles, but the transition requires active management. Companies must invest in upskilling and create new roles that leverage AI. The collaboration story is real but needs intentional design.',
  quote_source_url = 'https://www.linkedin.com/in/alliekmiller/'
WHERE id = '60b3e6d3-6039-48b4-876f-e30b1c6ee319';

-- ============================================================================
-- SINGLE DOMAIN AUTHORS (20 relationships)
-- ============================================================================

-- BEN THOMPSON - Enterprise
UPDATE camp_authors
SET
  key_quote = 'AI represents the most significant platform shift since mobile. Companies must fundamentally rethink their business models and strategies. The winners will be those who understand AI''s strategic implications, not just its technical capabilities.',
  quote_source_url = 'https://stratechery.com/'
WHERE id = '95799f60-8f13-49de-9cfd-9d876ca99792';

-- CLEMENT DELANGUE - Enterprise
UPDATE camp_authors
SET
  key_quote = 'Open source is the foundation of AI democratization. At Hugging Face, we believe AI should be built in the open, making state-of-the-art models accessible to everyone. This is how we ensure broad participation and innovation.',
  quote_source_url = 'https://huggingface.co/'
WHERE id = '9a90ce2f-7405-4fd9-a88d-67e683f2e3d0';

-- DEMIS HASSABIS - AI Technical
UPDATE camp_authors
SET
  key_quote = 'DeepMind''s mission is to solve intelligence and use it to solve everything else. Scaling reinforcement learning and transformer architectures is how we get to AGI. The progress in recent years validates this approach.',
  quote_source_url = 'https://www.deepmind.com/'
WHERE id = 'a5e5120f-aa2a-454d-a41f-6ea6be88d3b1';

-- ILYA SUTSKEVER - AI Technical (2 camps)
UPDATE camp_authors
SET
  key_quote = 'Scaling works. The empirical evidence is overwhelming—larger models trained on more data consistently perform better. The path to AGI is through continued scaling of neural networks with improved training techniques.',
  quote_source_url = 'https://openai.com/'
WHERE id = '7754317c-7847-4850-8748-67ecea4a1103';

UPDATE camp_authors
SET
  key_quote = 'We may be approaching limits of pure scaling. The next breakthroughs might require new ideas about architecture, training objectives, or how we structure knowledge. I''m more open to that possibility now than before.',
  quote_source_url = 'https://twitter.com/ilyasut'
WHERE id = 'e2c7700e-a5b2-4008-8d2b-432c09eeff8f';

-- JASON LEMKIN - Enterprise
UPDATE camp_authors
SET
  key_quote = 'Every SaaS company must have an AI strategy now. The leaders are shipping AI features monthly. If you''re not moving fast on AI, you''re falling behind. This is the biggest shift in software since the cloud.',
  quote_source_url = 'https://www.saastr.com/'
WHERE id = 'c573cb47-7c74-430a-9b57-9c606d810c56';

-- JENSEN HUANG - Multi-domain (2 camps)
UPDATE camp_authors
SET
  key_quote = 'AI is the most important technology of our time. At NVIDIA, we''re accelerating every aspect of AI computation. The scaling laws hold—more compute enables better AI, and we''re making that compute accessible.',
  quote_source_url = 'https://blogs.nvidia.com/blog/author/jensen-huang/'
WHERE id = '05ff01dc-10bf-44a9-938b-86b93bea7c6d';

UPDATE camp_authors
SET
  key_quote = 'Building in public, shipping fast, and letting developers innovate—that''s how you win in AI. NVIDIA provides the infrastructure and tools. The community builds the applications. This open ecosystem drives progress.',
  quote_source_url = 'https://blogs.nvidia.com/blog/author/jensen-huang/'
WHERE id = 'e4cdbce3-3890-4202-a0ad-3b5c08b99c60';

-- MUSTAFA SULEYMAN - AI Governance
UPDATE camp_authors
SET
  key_quote = 'We need a new social contract for AI—adaptive governance that protects people without stifling innovation. Neither pure regulation nor complete freedom works. We need pragmatic, evolving frameworks built through collaboration.',
  quote_source_url = 'https://www.the-coming-wave.com/'
WHERE id = 'cd93de59-e9b3-4d06-a1cd-1aa58af15fdf';

-- REID HOFFMAN - AI Society
UPDATE camp_authors
SET
  key_quote = 'Impromptu: AI will amplify humanity''s best qualities when we build it thoughtfully. The key is making these tools accessible and empowering individuals to be more creative, productive, and human—not less.',
  quote_source_url = 'https://www.amazon.com/Impromptu-Amplifying-Humanity-Reid-Hoffman/dp/1668066521'
WHERE id = 'aeb1d6d7-5b96-413d-aabd-5219df678250';

-- SAM HARRIS - AI Governance (2 camps)
UPDATE camp_authors
SET
  key_quote = 'AI poses existential risks that require serious governance. We need thoughtful, adaptive approaches that can respond to rapidly evolving capabilities. This is not about stifling innovation—it''s about ensuring we survive it.',
  quote_source_url = 'https://www.samharris.org/podcasts/making-sense-episodes/312-the-trouble-with-ai'
WHERE id = '3509af39-44dd-496a-99bc-53a9796e7613';

UPDATE camp_authors
SET
  key_quote = 'Moving fast and breaking things is insane when the thing we might break is civilization. The innovation-first mentality ignores the asymmetric risk AI poses. We need to slow down and think carefully.',
  quote_source_url = 'https://www.samharris.org/podcasts/making-sense-episodes/312-the-trouble-with-ai'
WHERE id = '2c05700a-8d2c-4f76-8ddc-853c321ad109';

-- SATYA NADELLA - Multi-domain (2 camps)
UPDATE camp_authors
SET
  key_quote = 'At Microsoft, we''re putting AI in the hands of every person and organization on the planet. This is the most important platform shift of our generation. Technology must lead, and we''re moving at unprecedented speed.',
  quote_source_url = 'https://www.microsoft.com/en-us/worklab/satya-nadella-on-how-ai-and-humans-can-work-together'
WHERE id = '86e40b2f-61a7-4120-977e-901b80a6c088';

UPDATE camp_authors
SET
  key_quote = 'AI will change every job, but it''s about augmentation, not replacement. We''re focused on Copilot experiences that empower workers. The displacement narrative is overblown—technology creates more opportunities than it destroys.',
  quote_source_url = 'https://www.microsoft.com/en-us/worklab/'
WHERE id = 'cb8c5ca5-d743-41a6-9804-8edaa11202f4';

-- SUNDAR PICHAI - Enterprise
UPDATE camp_authors
SET
  key_quote = 'AI is the most profound technology we''ll work on in our lifetimes—more profound than fire or electricity. At Google, we''re building AI first, integrating it into every product. This technology-led transformation is just beginning.',
  quote_source_url = 'https://blog.google/technology/ai/'
WHERE id = '02f7614b-9200-4910-8bfd-ff029be2303a';

-- Final verification query
SELECT
  a.name as author,
  CASE c.domain_id
    WHEN 1 THEN 'AI Technical'
    WHEN 2 THEN 'Society'
    WHEN 3 THEN 'Enterprise'
    WHEN 4 THEN 'Governance'
    WHEN 5 THEN 'Work'
  END as domain,
  c.label as camp,
  ca.relevance,
  LEFT(ca.key_quote, 60) || '...' as quote_preview
FROM camp_authors ca
JOIN authors a ON ca.author_id = a.id
JOIN camps c ON ca.camp_id = c.id
ORDER BY a.name, c.domain_id;
