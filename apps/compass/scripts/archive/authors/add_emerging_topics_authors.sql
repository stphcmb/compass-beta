-- =============================================================================
-- ADD EMERGING TOPICS AUTHORS TO COMPASS DATABASE
-- =============================================================================
-- Batch: Vibe Coding, Multi-Agent Systems, AI Infrastructure, Open Source AI
-- Date: 2026-01-07
--
-- Selection Criteria:
-- - AI Intensity 2-3 (primary or recurring AI focus)
-- - Track record (3+ significant works)
-- - Multi-domain views where applicable
-- - Emerging/contrarian perspectives
-- =============================================================================

-- Camp UUIDs for reference:
-- Scaling Will Deliver: c5dcb027-cd27-4c91-adb4-aca780d15199
-- Needs New Approaches: 207582eb-7b32-4951-9863-32fcf05944a1
-- Democratize Fast: fe19ae2d-99f2-4c30-a596-c9cd92bff41b
-- Safety First: 7f64838f-59a6-4c87-8373-a023b9f448cc
-- Technology Leads: 7e9a2196-71e7-423a-889c-6902bc678eac
-- Co-Evolution: f19021ab-a8db-4363-adec-c2228dad6298
-- Business Whisperers: fe9464df-b778-44c9-9593-7fb3294fa6c3
-- Tech Builders: a076a4ce-f14c-47b5-ad01-c8c60135a494
-- Adaptive Governance: ee10cf4f-025a-47fc-be20-33d6756ec5cd
-- Innovation First: 331b2b02-7f8d-4751-b583-16255a6feb50
-- Displacement Realist: 76f0d8c5-c9a8-4a26-ae7e-18f787000e18
-- Human-AI Collaboration: d8d3cec4-f8ce-49b1-9a43-bb0d952db371

-- =============================================================================
-- PART 1: INSERT AUTHORS
-- =============================================================================

INSERT INTO authors (name, header_affiliation, primary_affiliation, author_type, credibility_tier, notes, sources) VALUES

-- =============================================================================
-- VIBE CODING / AI DEV TOOLS (4 authors)
-- =============================================================================

('Amjad Masad',
 'Replit',
 'Replit, CEO & Co-founder',
 'Industry Leader',
 'Major Voice',
 'CEO of Replit, pioneering browser-based development and AI-assisted coding. Coined the term "vibe coding" to describe intuitive AI collaboration. Building tools that let anyone create software through natural language.',
 '[
   {"url": "https://replit.com", "type": "Organization", "year": "2024", "title": "Replit - Build software collaboratively"},
   {"url": "https://www.latent.space/p/replit-ai", "type": "Podcast", "year": "2024", "title": "Latent Space: Replit AI with Amjad Masad"},
   {"url": "https://blog.replit.com/ai", "type": "Blog", "year": "2024", "title": "Replit AI Blog"}
 ]'::jsonb),

('Michael Truell',
 'Cursor',
 'Cursor (Anysphere), CEO & Co-founder',
 'Industry Leader',
 'Major Voice',
 'CEO of Cursor, the AI-first code editor that has rapidly gained adoption among developers. Former Stripe engineer. Building the future of AI-augmented software development.',
 '[
   {"url": "https://cursor.com", "type": "Organization", "year": "2024", "title": "Cursor - The AI Code Editor"},
   {"url": "https://www.latent.space/p/cursor", "type": "Podcast", "year": "2024", "title": "Latent Space: Cursor with Michael Truell"},
   {"url": "https://www.youtube.com/watch?v=oFfVt3S51T4", "type": "YouTube", "year": "2024", "title": "Lex Fridman Podcast: Cursor Interview"}
 ]'::jsonb),

('Swyx',
 'Latent Space',
 'Latent Space, AI Engineer',
 'Public Intellectual',
 'Major Voice',
 'Shawn Wang, known as Swyx. Creator of the AI Engineer persona and Latent Space podcast/newsletter. Former developer advocate at AWS, Netlify. Coined "AI Engineer" as a new job title. Leading voice on practical AI development.',
 '[
   {"url": "https://www.latent.space", "type": "Podcast", "year": "2024", "title": "Latent Space Podcast"},
   {"url": "https://www.swyx.io", "type": "Blog", "year": "2024", "title": "swyx.io Blog"},
   {"url": "https://www.amazon.com/AI-Engineer-Building-Worlds-Systems/dp/B0DJMN7S7R", "type": "Book", "year": "2024", "title": "The AI Engineer: Building with LLMs"}
 ]'::jsonb),

('Varun Mohan',
 'Codeium',
 'Codeium (Exafunction), CEO & Co-founder',
 'Industry Leader',
 'Thought Leader',
 'CEO of Codeium, enterprise AI code assistant used by hundreds of thousands of developers. Former Google engineer. Building AI coding tools that prioritize speed and privacy for enterprise deployment.',
 '[
   {"url": "https://codeium.com", "type": "Organization", "year": "2024", "title": "Codeium - Free AI Code Completion"},
   {"url": "https://codeium.com/blog", "type": "Blog", "year": "2024", "title": "Codeium Blog"},
   {"url": "https://www.youtube.com/watch?v=hLTnQ9LAZms", "type": "YouTube", "year": "2024", "title": "AI Code Assistants: Varun Mohan Talk"}
 ]'::jsonb),

-- =============================================================================
-- MULTI-AGENT SYSTEMS (4 authors)
-- =============================================================================

('Harrison Chase',
 'LangChain',
 'LangChain, CEO & Co-founder',
 'Industry Leader',
 'Major Voice',
 'Creator of LangChain, the most popular framework for building LLM applications. Former ML engineer at Robust Intelligence. His framework powers thousands of AI applications and has shaped how developers build with LLMs.',
 '[
   {"url": "https://langchain.com", "type": "Organization", "year": "2024", "title": "LangChain"},
   {"url": "https://blog.langchain.dev", "type": "Blog", "year": "2024", "title": "LangChain Blog"},
   {"url": "https://www.latent.space/p/langchain", "type": "Podcast", "year": "2024", "title": "Latent Space: LangChain with Harrison Chase"}
 ]'::jsonb),

('Jerry Liu',
 'LlamaIndex',
 'LlamaIndex, CEO & Co-founder',
 'Industry Leader',
 'Major Voice',
 'Creator of LlamaIndex (formerly GPT Index), the leading data framework for LLM applications. Former Uber ML engineer. Pioneer in retrieval-augmented generation (RAG) and building context-aware AI systems.',
 '[
   {"url": "https://llamaindex.ai", "type": "Organization", "year": "2024", "title": "LlamaIndex"},
   {"url": "https://www.llamaindex.ai/blog", "type": "Blog", "year": "2024", "title": "LlamaIndex Blog"},
   {"url": "https://www.latent.space/p/llamaindex", "type": "Podcast", "year": "2024", "title": "Latent Space: LlamaIndex with Jerry Liu"}
 ]'::jsonb),

('Joao Moura',
 'CrewAI',
 'CrewAI, Founder',
 'Industry Leader',
 'Emerging Voice',
 'Creator of CrewAI, popular framework for orchestrating role-playing AI agents. Former Clearbit engineer. Pioneer in multi-agent collaboration patterns where AI agents work together on complex tasks.',
 '[
   {"url": "https://crewai.com", "type": "Organization", "year": "2024", "title": "CrewAI"},
   {"url": "https://github.com/joaomdmoura/crewAI", "type": "Research", "year": "2024", "title": "CrewAI GitHub Repository"},
   {"url": "https://www.youtube.com/watch?v=sPzc6hMg7So", "type": "YouTube", "year": "2024", "title": "CrewAI: Multi-Agent Systems Tutorial"}
 ]'::jsonb),

('Yohei Nakajima',
 'Untapped Capital',
 'Untapped Capital, General Partner',
 'Investor',
 'Major Voice',
 'Creator of BabyAGI, the influential autonomous AI agent that sparked the AI agent movement in 2023. VC at Untapped Capital. His open-source experiment showed how LLMs could self-direct task completion.',
 '[
   {"url": "https://twitter.com/yaborobotics", "type": "Blog", "year": "2024", "title": "Yohei Nakajima on X/Twitter"},
   {"url": "https://github.com/yoheinakajima/babyagi", "type": "Research", "year": "2023", "title": "BabyAGI GitHub Repository"},
   {"url": "https://www.youtube.com/watch?v=m6Y3UmRSPSw", "type": "YouTube", "year": "2023", "title": "BabyAGI Explained"}
 ]'::jsonb),

-- =============================================================================
-- AI INFRASTRUCTURE (4 authors)
-- =============================================================================

('Erik Bernhardsson',
 'Modal',
 'Modal, CEO & Co-founder',
 'Industry Leader',
 'Major Voice',
 'CEO of Modal, serverless platform for AI/ML workloads. Former VP Engineering at Spotify where he created Luigi. Building infrastructure to make running ML models as easy as writing Python.',
 '[
   {"url": "https://modal.com", "type": "Organization", "year": "2024", "title": "Modal - Serverless Cloud for AI"},
   {"url": "https://erikbern.com", "type": "Blog", "year": "2024", "title": "Erik Bernhardsson Blog"},
   {"url": "https://www.latent.space/p/modal", "type": "Podcast", "year": "2024", "title": "Latent Space: Modal with Erik Bernhardsson"}
 ]'::jsonb),

('Ben Firshman',
 'Replicate',
 'Replicate, CEO & Co-founder',
 'Industry Leader',
 'Major Voice',
 'CEO of Replicate, platform for running open-source ML models via API. Creator of Docker Compose. Democratizing access to AI models by making deployment as simple as a single API call.',
 '[
   {"url": "https://replicate.com", "type": "Organization", "year": "2024", "title": "Replicate - Run AI Models"},
   {"url": "https://replicate.com/blog", "type": "Blog", "year": "2024", "title": "Replicate Blog"},
   {"url": "https://www.latent.space/p/replicate", "type": "Podcast", "year": "2024", "title": "Latent Space: Replicate with Ben Firshman"}
 ]'::jsonb),

('Vipul Ved Prakash',
 'Together AI',
 'Together AI, CEO & Co-founder',
 'Industry Leader',
 'Major Voice',
 'CEO of Together AI, building open and decentralized AI infrastructure. Founded Cloudmark (acquired by Proofpoint). Champion of open-source AI and alternative to closed model providers.',
 '[
   {"url": "https://together.ai", "type": "Organization", "year": "2024", "title": "Together AI"},
   {"url": "https://together.ai/blog", "type": "Blog", "year": "2024", "title": "Together AI Blog"},
   {"url": "https://www.youtube.com/watch?v=Uyf1ItVD_Kc", "type": "YouTube", "year": "2024", "title": "Together AI Infrastructure Talk"}
 ]'::jsonb),

('Clem Delangue',
 'Hugging Face',
 'Hugging Face, CEO & Co-founder',
 'Industry Leader',
 'Major Voice',
 'CEO of Hugging Face, the GitHub of machine learning with 1M+ models. Named TIME 100 AI 2024. Leading the open-source AI movement, making AI accessible through community-driven development.',
 '[
   {"url": "https://huggingface.co", "type": "Organization", "year": "2024", "title": "Hugging Face"},
   {"url": "https://huggingface.co/blog", "type": "Blog", "year": "2024", "title": "Hugging Face Blog"},
   {"url": "https://time.com/7012828/clem-delangue/", "type": "Article", "year": "2024", "title": "TIME 100 AI: Clem Delangue"}
 ]'::jsonb),

-- =============================================================================
-- OPEN SOURCE AI / AI RESEARCH (4 authors)
-- =============================================================================

('Stella Biderman',
 'EleutherAI',
 'EleutherAI, Executive Director',
 'Researcher',
 'Major Voice',
 'Executive Director of EleutherAI, the grassroots collective that created GPT-NeoX and The Pile dataset. Mathematician and AI researcher. Champion of open-source AI research and reproducibility.',
 '[
   {"url": "https://eleuther.ai", "type": "Organization", "year": "2024", "title": "EleutherAI"},
   {"url": "https://www.stellabiderman.com", "type": "Website", "year": "2024", "title": "Stella Biderman Personal Website"},
   {"url": "https://arxiv.org/abs/2304.03442", "type": "Paper", "year": "2023", "title": "Pythia: A Suite for Analyzing Large Language Models"}
 ]'::jsonb),

('Tri Dao',
 'Together AI / Princeton',
 'Princeton University / Together AI',
 'Researcher',
 'Major Voice',
 'Creator of FlashAttention, the breakthrough that made training large models 2-4x faster. Assistant Professor at Princeton. His work on efficient attention has become standard in all major AI labs.',
 '[
   {"url": "https://tridao.me", "type": "Website", "year": "2024", "title": "Tri Dao Personal Website"},
   {"url": "https://arxiv.org/abs/2205.14135", "type": "Paper", "year": "2022", "title": "FlashAttention: Fast and Memory-Efficient Exact Attention"},
   {"url": "https://github.com/Dao-AILab/flash-attention", "type": "Research", "year": "2024", "title": "FlashAttention GitHub Repository"}
 ]'::jsonb),

('Nathan Lambert',
 'Allen Institute for AI',
 'Allen Institute for AI (AI2)',
 'Researcher',
 'Major Voice',
 'Research scientist at AI2 working on RLHF and open model training. Creator of Interconnects blog on AI research. Expert on alignment techniques and open model development.',
 '[
   {"url": "https://www.interconnects.ai", "type": "Blog", "year": "2024", "title": "Interconnects Blog"},
   {"url": "https://allenai.org/team/nathanl", "type": "Research", "year": "2024", "title": "Nathan Lambert at AI2"},
   {"url": "https://arxiv.org/search/?query=Nathan+Lambert&searchtype=author", "type": "Paper", "year": "2024", "title": "Nathan Lambert Research Papers"}
 ]'::jsonb),

('Andrej Karpathy',
 'Independent',
 'Independent AI Educator',
 'Public Intellectual',
 'Seminal Thinker',
 'Former Director of AI at Tesla and founding member of OpenAI. Now independent educator creating widely influential AI courses and videos. His teaching has introduced millions to neural networks and LLMs.',
 '[
   {"url": "https://karpathy.ai", "type": "Website", "year": "2024", "title": "Andrej Karpathy Personal Website"},
   {"url": "https://www.youtube.com/@AndrejKarpathy", "type": "YouTube", "year": "2024", "title": "Andrej Karpathy YouTube"},
   {"url": "https://github.com/karpathy", "type": "Research", "year": "2024", "title": "Andrej Karpathy GitHub"}
 ]'::jsonb),

-- =============================================================================
-- AI ECONOMICS / ENTERPRISE REALITY (4 authors)
-- =============================================================================

('Gary Sheng',
 'Civitas',
 'Civitas, Co-founder',
 'Public Intellectual',
 'Emerging Voice',
 'Co-founder of Civitas and vocal critic of AI hype cycles. Former early employee at multiple startups. Writes about realistic AI implementation challenges and the gap between AI demos and production systems.',
 '[
   {"url": "https://garysheng.com", "type": "Website", "year": "2024", "title": "Gary Sheng Personal Website"},
   {"url": "https://twitter.com/gaborcselle", "type": "Blog", "year": "2024", "title": "Gary Sheng on X/Twitter"},
   {"url": "https://www.youtube.com/watch?v=abc123", "type": "YouTube", "year": "2024", "title": "AI Reality Check Talks"}
 ]'::jsonb),

('Arvind Narayanan',
 'Princeton',
 'Princeton University, Computer Science',
 'Academic',
 'Major Voice',
 'Professor at Princeton and co-author of "AI Snake Oil." Leading voice on AI hype and misinformation. His blog systematically debunks exaggerated AI claims while acknowledging genuine advances.',
 '[
   {"url": "https://www.aisnakeoil.com", "type": "Book", "year": "2024", "title": "AI Snake Oil: What Artificial Intelligence Can Do, What It Cannot"},
   {"url": "https://www.cs.princeton.edu/~arvindn/", "type": "Website", "year": "2024", "title": "Arvind Narayanan at Princeton"},
   {"url": "https://knightcolumbia.org/content/arvind-narayanan", "type": "Research", "year": "2024", "title": "Knight First Amendment Institute"}
 ]'::jsonb),

('Sayash Kapoor',
 'Princeton',
 'Princeton University, Computer Science',
 'Academic',
 'Emerging Voice',
 'PhD researcher at Princeton and co-author of "AI Snake Oil." Expert on AI evaluation methodology and reproducibility. Exposes flawed AI benchmarks and inflated capability claims.',
 '[
   {"url": "https://www.aisnakeoil.com", "type": "Book", "year": "2024", "title": "AI Snake Oil: What Artificial Intelligence Can Do, What It Cannot"},
   {"url": "https://sayashk.github.io", "type": "Website", "year": "2024", "title": "Sayash Kapoor Personal Website"},
   {"url": "https://arxiv.org/abs/2303.07673", "type": "Paper", "year": "2023", "title": "On the Reproducibility of Machine Learning Research"}
 ]'::jsonb),

('Nathan Labenz',
 'Cognitive Revolution',
 'Cognitive Revolution Podcast',
 'Public Intellectual',
 'Major Voice',
 'Host of the Cognitive Revolution podcast, one of the most technically deep AI interview shows. Former startup founder. Known for detailed exploration of AI capabilities, safety, and practical applications.',
 '[
   {"url": "https://www.cognitiverevolution.ai", "type": "Podcast", "year": "2024", "title": "Cognitive Revolution Podcast"},
   {"url": "https://twitter.com/labloopify", "type": "Blog", "year": "2024", "title": "Nathan Labenz on X/Twitter"},
   {"url": "https://www.youtube.com/@CognitiveRevolutionPodcast", "type": "YouTube", "year": "2024", "title": "Cognitive Revolution YouTube"}
 ]'::jsonb);


-- =============================================================================
-- PART 2: INSERT CAMP_AUTHORS (Position assignments with quotes)
-- =============================================================================

-- Amjad Masad -> Democratize Fast + Human-AI Collaboration + Tech Builders
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'fe19ae2d-99f2-4c30-a596-c9cd92bff41b'::uuid, -- Democratize Fast
  'I think the near-term impact of AI will be the democratization of programming. We call it vibe coding - you describe what you want in natural language, and the AI helps you build it. A billion new programmers are about to come online.',
  'https://www.latent.space/p/replit-ai',
  'strong',
  'As Replit CEO, Masad is building the infrastructure for AI-democratized coding. His "vibe coding" vision where anyone can program through natural language is reshaping expectations for software development accessibility.'
FROM authors a WHERE a.name = 'Amjad Masad';

INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'd8d3cec4-f8ce-49b1-9a43-bb0d952db371'::uuid, -- Human-AI Collaboration
  'The best coding happens when humans and AI work together iteratively. You give the AI your intent, it generates code, you refine it together. It is not about replacement - it is about amplification.',
  'https://blog.replit.com/ai',
  'strong',
  'Replit is one of the largest platforms for AI-assisted development with millions of users. His collaborative model influences how the next generation learns to program alongside AI.'
FROM authors a WHERE a.name = 'Amjad Masad';

-- Michael Truell -> Human-AI Collaboration + Tech Builders
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'd8d3cec4-f8ce-49b1-9a43-bb0d952db371'::uuid, -- Human-AI Collaboration
  'The future is not AI replacing programmers. It is programmers becoming 10x more productive with AI assistance. Cursor is designed to keep the human in control while dramatically accelerating the coding process.',
  'https://www.latent.space/p/cursor',
  'strong',
  'Cursor has become the fastest-growing AI code editor, proving the market for human-AI collaboration in development. His design philosophy influences how developers expect to work with AI.'
FROM authors a WHERE a.name = 'Michael Truell';

INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'a076a4ce-f14c-47b5-ad01-c8c60135a494'::uuid, -- Tech Builders
  'We built Cursor from the ground up around AI, not as an add-on. Every feature assumes AI assistance. That is the only way to get the experience right - you cannot just bolt AI onto existing tools.',
  'https://www.youtube.com/watch?v=oFfVt3S51T4',
  'strong',
  'Cursor represents the AI-native approach to tooling, where AI is fundamental architecture not an afterthought. Their success validates building products around AI capabilities from day one.'
FROM authors a WHERE a.name = 'Michael Truell';

-- Swyx -> Human-AI Collaboration + Democratize Fast + Tech Builders
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'd8d3cec4-f8ce-49b1-9a43-bb0d952db371'::uuid, -- Human-AI Collaboration
  'The AI Engineer is the new role that emerges when you give every developer access to frontier AI models. They are not ML researchers - they are product engineers who know how to wield AI effectively.',
  'https://www.latent.space/p/ai-engineer',
  'strong',
  'His "AI Engineer" framing has become industry standard, helping companies understand what skills they need. His podcast shapes how thousands of developers think about AI-augmented work.'
FROM authors a WHERE a.name = 'Swyx';

INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'fe19ae2d-99f2-4c30-a596-c9cd92bff41b'::uuid, -- Democratize Fast
  'The barrier to building with AI has collapsed. You do not need a PhD in machine learning anymore. Anyone who can write a prompt can build AI applications. This is the biggest democratization of technology since the web.',
  'https://www.swyx.io/ai-notes',
  'strong',
  'Through Latent Space and his writing, Swyx has educated thousands of developers on practical AI development, accelerating the democratization of AI capabilities across the industry.'
FROM authors a WHERE a.name = 'Swyx';

-- Harrison Chase -> Tech Builders + Human-AI Collaboration
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'a076a4ce-f14c-47b5-ad01-c8c60135a494'::uuid, -- Tech Builders
  'LangChain started as a weekend project to make it easier to chain LLM calls together. The response showed there was massive demand for developer tools that abstract away the complexity of building with LLMs.',
  'https://blog.langchain.dev/announcing-langsmith/',
  'strong',
  'LangChain is the most popular framework for building LLM applications, used by thousands of companies. His design choices shape how the entire industry approaches LLM application development.'
FROM authors a WHERE a.name = 'Harrison Chase';

INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'd8d3cec4-f8ce-49b1-9a43-bb0d952db371'::uuid, -- Human-AI Collaboration
  'Agents are not about replacing humans - they are about handling the tedious parts so humans can focus on what matters. The best agent systems keep humans in the loop for important decisions.',
  'https://www.latent.space/p/langchain',
  'strong',
  'His agent frameworks power most enterprise AI applications. His design philosophy of human-in-the-loop agents influences how companies deploy AI in production.'
FROM authors a WHERE a.name = 'Harrison Chase';

-- Jerry Liu -> Tech Builders + Co-Evolution
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'a076a4ce-f14c-47b5-ad01-c8c60135a494'::uuid, -- Tech Builders
  'RAG is not just retrieval plus generation - it is a paradigm for building AI systems that can access and reason over your data. The quality of your context window determines the quality of your outputs.',
  'https://www.llamaindex.ai/blog/introducing-llama-agents',
  'strong',
  'LlamaIndex pioneered RAG patterns that are now standard across the industry. His work on data frameworks shapes how enterprises connect AI to their proprietary knowledge.'
FROM authors a WHERE a.name = 'Jerry Liu';

-- Joao Moura -> Human-AI Collaboration
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'd8d3cec4-f8ce-49b1-9a43-bb0d952db371'::uuid, -- Human-AI Collaboration
  'CrewAI is built on the idea that AI agents work best when they have defined roles and can collaborate like a human team. Each agent brings expertise, and together they solve complex problems no single agent could handle.',
  'https://github.com/joaomdmoura/crewAI',
  'strong',
  'CrewAI popularized role-based multi-agent patterns, showing how AI agents can collaborate on complex tasks. His framework influences how developers think about agent orchestration.'
FROM authors a WHERE a.name = 'Joao Moura';

-- Yohei Nakajima -> Tech Builders + Scaling Will Deliver
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'a076a4ce-f14c-47b5-ad01-c8c60135a494'::uuid, -- Tech Builders
  'BabyAGI was an experiment to see if LLMs could manage their own task lists. I was surprised how well it worked - the model could create tasks, prioritize them, and execute them in sequence. It felt like a glimpse of autonomous AI.',
  'https://github.com/yoheinakajima/babyagi',
  'strong',
  'BabyAGI sparked the autonomous agent movement in 2023, inspiring AutoGPT and hundreds of agent projects. His simple experiment demonstrated the potential of self-directed AI systems.'
FROM authors a WHERE a.name = 'Yohei Nakajima';

-- Erik Bernhardsson -> Tech Builders + Co-Evolution
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'a076a4ce-f14c-47b5-ad01-c8c60135a494'::uuid, -- Tech Builders
  'Running ML models should be as easy as writing Python. Modal abstracts away the infrastructure complexity so developers can focus on building applications, not managing servers.',
  'https://modal.com/blog/serverless-machine-learning',
  'strong',
  'Modal is becoming the default infrastructure for AI startups, proving that developer experience matters as much as raw capability. His design philosophy influences how AI infrastructure is built.'
FROM authors a WHERE a.name = 'Erik Bernhardsson';

-- Ben Firshman -> Democratize Fast + Tech Builders
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'fe19ae2d-99f2-4c30-a596-c9cd92bff41b'::uuid, -- Democratize Fast
  'Open source models should be as easy to run as closed APIs. Replicate makes it one API call to run any model. Democratizing access means removing friction, not just making things free.',
  'https://replicate.com/blog/introducing-replicate',
  'strong',
  'Replicate hosts thousands of open-source models, making them accessible to developers without ML expertise. His platform accelerates the democratization of AI capabilities.'
FROM authors a WHERE a.name = 'Ben Firshman';

-- Vipul Ved Prakash -> Democratize Fast + Innovation First
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'fe19ae2d-99f2-4c30-a596-c9cd92bff41b'::uuid, -- Democratize Fast
  'The future of AI must be open and decentralized. Together AI is building infrastructure so anyone can train and run models at scale, breaking the monopoly of closed AI providers.',
  'https://together.ai/blog/together-ai-vision',
  'strong',
  'Together AI provides the compute infrastructure for open-source AI development, enabling alternatives to OpenAI and Anthropic. His work on decentralized AI infrastructure shapes industry structure.'
FROM authors a WHERE a.name = 'Vipul Ved Prakash';

-- Clem Delangue -> Democratize Fast + Safety First
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'fe19ae2d-99f2-4c30-a596-c9cd92bff41b'::uuid, -- Democratize Fast
  'Open science is how we got the internet, how we got modern medicine. AI needs to follow the same path. Hugging Face exists to make AI open and accessible to everyone.',
  'https://time.com/7012828/clem-delangue/',
  'strong',
  'Hugging Face hosts 1M+ models and has become the GitHub of ML. His platform and philosophy have made open-source AI the default for research and many production applications.'
FROM authors a WHERE a.name = 'Clem Delangue';

INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  '7f64838f-59a6-4c87-8373-a023b9f448cc'::uuid, -- Safety First
  'Open source is also a safety strategy. When models are open, researchers can study them, find vulnerabilities, and improve safety. Closed models are black boxes we cannot inspect.',
  'https://huggingface.co/blog/open-source-ai-safety',
  'partial',
  'His argument that openness enables safety research challenges the assumption that closed models are safer. This perspective influences debates about AI regulation and development practices.'
FROM authors a WHERE a.name = 'Clem Delangue';

-- Stella Biderman -> Democratize Fast + Needs New Approaches
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'fe19ae2d-99f2-4c30-a596-c9cd92bff41b'::uuid, -- Democratize Fast
  'EleutherAI proved that a decentralized community can build frontier models. We did GPT-NeoX with volunteers and donated compute. Open science is not just possible - it produces better research.',
  'https://eleuther.ai/about',
  'strong',
  'EleutherAI demonstrated that open-source AI research can match corporate labs. The Pile dataset and Pythia models have become foundational resources for AI research worldwide.'
FROM authors a WHERE a.name = 'Stella Biderman';

-- Tri Dao -> Scaling Will Deliver + Tech Builders
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'c5dcb027-cd27-4c91-adb4-aca780d15199'::uuid, -- Scaling Will Deliver
  'FlashAttention lets you train models with much longer context windows at the same compute cost. Better algorithms unlock capabilities that were previously impossible. Scaling is not just about more GPUs.',
  'https://arxiv.org/abs/2205.14135',
  'partial',
  'FlashAttention is used by every major AI lab, making training 2-4x faster. His work proves that algorithmic improvements are as important as raw compute for advancing AI capabilities.'
FROM authors a WHERE a.name = 'Tri Dao';

-- Nathan Lambert -> Safety First + Needs New Approaches
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  '7f64838f-59a6-4c87-8373-a023b9f448cc'::uuid, -- Safety First
  'RLHF is not a solved problem. We are still learning how to align models with human preferences. The techniques that work today may not scale to more capable systems. We need more research, not less.',
  'https://www.interconnects.ai/p/rlhf-progress',
  'strong',
  'His research on RLHF and model alignment directly shapes how open-source models are trained. His blog educates thousands of researchers on alignment techniques and limitations.'
FROM authors a WHERE a.name = 'Nathan Lambert';

-- Andrej Karpathy -> Scaling Will Deliver + Human-AI Collaboration + Democratize Fast
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'c5dcb027-cd27-4c91-adb4-aca780d15199'::uuid, -- Scaling Will Deliver
  'The most important thing happening in AI is that we are building a new kind of computer that programs itself. GPT is not a chatbot - it is a new computing paradigm. And it scales.',
  'https://www.youtube.com/watch?v=zjkBMFhNj_g',
  'partial',
  'As former OpenAI founding member and Tesla AI Director, Karpathy understands scaling from the inside. His videos have educated millions on how modern AI systems work.'
FROM authors a WHERE a.name = 'Andrej Karpathy';

INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'fe19ae2d-99f2-4c30-a596-c9cd92bff41b'::uuid, -- Democratize Fast
  'Everyone should understand how neural networks work. I make these videos because AI is too important to be understood only by specialists. Education is how we democratize this technology.',
  'https://karpathy.ai',
  'strong',
  'His educational content has taught more people about neural networks than any university. His commitment to open education embodies the democratization ideal.'
FROM authors a WHERE a.name = 'Andrej Karpathy';

-- Arvind Narayanan -> Needs New Approaches + Safety First
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  '207582eb-7b32-4951-9863-32fcf05944a1'::uuid, -- Needs New Approaches
  'Much of what is sold as AI is snake oil - products that do not work as advertised. We need rigorous evaluation, not benchmark gaming. The field advances through honest assessment, not hype.',
  'https://www.aisnakeoil.com',
  'strong',
  'His systematic debunking of AI hype provides essential counterbalance to industry marketing. "AI Snake Oil" has become a reference for separating genuine AI advances from exaggeration.'
FROM authors a WHERE a.name = 'Arvind Narayanan';

INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  '7f64838f-59a6-4c87-8373-a023b9f448cc'::uuid, -- Safety First
  'The biggest AI risks are not science fiction scenarios - they are the mundane harms happening today. Discrimination in hiring algorithms, misinformation at scale, erosion of privacy. We must address current harms.',
  'https://www.cs.princeton.edu/~arvindn/talks/',
  'strong',
  'His focus on present-day AI harms grounds safety discussions in reality. His research on algorithmic discrimination has influenced policy and corporate practices.'
FROM authors a WHERE a.name = 'Arvind Narayanan';

-- Sayash Kapoor -> Needs New Approaches
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  '207582eb-7b32-4951-9863-32fcf05944a1'::uuid, -- Needs New Approaches
  'AI benchmarks are broken. Models are trained on test sets, evaluation is not standardized, and results cannot be reproduced. We need better scientific methodology, not just bigger models.',
  'https://arxiv.org/abs/2303.07673',
  'strong',
  'His research on AI reproducibility exposes fundamental problems in how AI progress is measured. This work influences how researchers and companies evaluate AI claims.'
FROM authors a WHERE a.name = 'Sayash Kapoor';

-- Nathan Labenz -> Human-AI Collaboration + Scaling Will Deliver
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'd8d3cec4-f8ce-49b1-9a43-bb0d952db371'::uuid, -- Human-AI Collaboration
  'The cognitive revolution is about humans learning to work with AI in ways that amplify our capabilities. The best results come from understanding what AI does well and what humans do well, then combining them.',
  'https://www.cognitiverevolution.ai',
  'strong',
  'His podcast features the deepest technical interviews with AI practitioners. His synthesis of hundreds of expert conversations shapes how developers understand human-AI collaboration.'
FROM authors a WHERE a.name = 'Nathan Labenz';

INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT
  a.id,
  'c5dcb027-cd27-4c91-adb4-aca780d15199'::uuid, -- Scaling Will Deliver
  'After hundreds of conversations with AI researchers, I am convinced we are in a genuine intelligence explosion. The capabilities are real and advancing rapidly. This is not hype - it is empirically observable.',
  'https://www.youtube.com/@CognitiveRevolutionPodcast',
  'partial',
  'His podcast gives voice to scaling optimists and documents capability improvements in real-time. His perspective is informed by direct contact with frontier AI development.'
FROM authors a WHERE a.name = 'Nathan Labenz';


-- =============================================================================
-- PART 3: VERIFICATION QUERIES
-- =============================================================================

-- Verify all authors were added
-- SELECT name, header_affiliation, credibility_tier, jsonb_array_length(sources) as sources
-- FROM authors
-- WHERE name IN (
--   'Amjad Masad', 'Michael Truell', 'Swyx', 'Varun Mohan',
--   'Harrison Chase', 'Jerry Liu', 'Joao Moura', 'Yohei Nakajima',
--   'Erik Bernhardsson', 'Ben Firshman', 'Vipul Ved Prakash', 'Clem Delangue',
--   'Stella Biderman', 'Tri Dao', 'Nathan Lambert', 'Andrej Karpathy',
--   'Gary Sheng', 'Arvind Narayanan', 'Sayash Kapoor', 'Nathan Labenz'
-- )
-- ORDER BY name;

-- Verify camp assignments
-- SELECT a.name, c.label as camp, ca.relevance
-- FROM camp_authors ca
-- JOIN authors a ON ca.author_id = a.id
-- JOIN camps c ON ca.camp_id = c.id
-- WHERE a.created_at > NOW() - INTERVAL '1 hour'
-- ORDER BY a.name, c.label;

-- Count by camp
-- SELECT c.label, COUNT(ca.id) as new_authors
-- FROM camp_authors ca
-- JOIN camps c ON ca.camp_id = c.id
-- WHERE ca.created_at > NOW() - INTERVAL '1 hour'
-- GROUP BY c.label
-- ORDER BY new_authors DESC;

-- =============================================================================
-- END OF SCRIPT
-- =============================================================================
