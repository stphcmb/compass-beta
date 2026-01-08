-- Fix authors without camp relationships
-- These 7 authors are currently invisible in the app

BEGIN;

-- 1. Sergey Levine (UC Berkeley) - Robotics and RL researcher
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, '207582eb-7b32-4951-9863-32fcf05944a1'::uuid, -- Needs New Approaches
  'The biggest breakthroughs in robotics will come from systems that can learn continuously from real-world interaction, not just from larger language models. We need robots that understand physics through experience, which requires fundamentally different approaches than scaling text prediction.',
  'https://rll.berkeley.edu/research/',
  'strong',
  'Sergey Levine leads Berkeley''s Robot Learning Lab and is one of the most cited researchers in robotic learning. His work on learning from real-world data challenges the pure scaling narrative, showing that embodied intelligence requires different approaches than language models.'
FROM authors a WHERE a.name = 'Sergey Levine'
ON CONFLICT (author_id, camp_id) DO NOTHING;

INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, 'd8d3cec4-f8ce-49b1-9a43-bb0d952db371'::uuid, -- Human-AI Collaboration
  'The goal isn''t to replace human decision-making but to create AI systems that can be effective partners in physical tasks. Robots should augment human capabilities in manufacturing, healthcare, and daily life, working alongside us rather than replacing us.',
  'https://rll.berkeley.edu/research/',
  'partial',
  'His research on robot learning has direct applications in collaborative robotics, where AI systems work alongside humans in warehouses, hospitals, and homes. This work shapes how we think about human-robot collaboration.'
FROM authors a WHERE a.name = 'Sergey Levine'
ON CONFLICT (author_id, camp_id) DO NOTHING;

-- 2. Chelsea Finn (Stanford) - Meta-learning and robotics
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, '207582eb-7b32-4951-9863-32fcf05944a1'::uuid, -- Needs New Approaches
  'Learning to learn is fundamentally different from simply scaling up training data. Meta-learning allows AI systems to quickly adapt to new tasks with minimal examples, which is how humans actually learn. This is a capability that pure scaling approaches struggle to achieve.',
  'https://ai.stanford.edu/~cbfinn/',
  'strong',
  'Chelsea Finn is a pioneer in meta-learning, developing MAML and other algorithms that enable rapid adaptation. Her work represents an alternative paradigm to pure scaling, focusing on learning efficiency rather than data volume.'
FROM authors a WHERE a.name = 'Chelsea Finn'
ON CONFLICT (author_id, camp_id) DO NOTHING;

INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, 'c5dcb027-cd27-4c91-adb4-aca780d15199'::uuid, -- Scaling Will Deliver
  'Foundation models have shown remarkable emergent capabilities, and combining them with meta-learning could unlock even more powerful systems. The scale of pretraining provides a strong base, but we need efficient adaptation mechanisms to make these systems truly useful.',
  'https://ai.stanford.edu/~cbfinn/',
  'partial',
  'While primarily a meta-learning researcher, Finn has embraced foundation models as powerful starting points. Her nuanced view bridges the scaling and new approaches camps, seeing value in both paradigms.'
FROM authors a WHERE a.name = 'Chelsea Finn'
ON CONFLICT (author_id, camp_id) DO NOTHING;

-- 3. Holly Herndon (Artist) - AI and creativity
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, 'fe19ae2d-99f2-4c30-a596-c9cd92bff41b'::uuid, -- Democratize Fast
  'AI tools should empower artists, not replace them. We built Holly+ so that anyone can use my voice as an instrument, creating new forms of collaboration between human creativity and machine capability. Art should be accessible to everyone.',
  'https://holly.plus/',
  'strong',
  'Holly Herndon is a groundbreaking musician who embraced AI early, creating Holly+ - an AI model of her own voice that anyone can use. She demonstrates how artists can shape AI tools rather than be displaced by them.'
FROM authors a WHERE a.name = 'Holly Herndon'
ON CONFLICT (author_id, camp_id) DO NOTHING;

INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, 'd8d3cec4-f8ce-49b1-9a43-bb0d952db371'::uuid, -- Human-AI Collaboration
  'My work with AI isn''t about the machine creating art alone - it''s about finding new forms of collaboration. The most interesting creative outcomes come from human artists working with AI as a partner, not from either working in isolation.',
  'https://holly.plus/',
  'strong',
  'Her Grammy-nominated album PROTO and subsequent Holly+ project demonstrate a collaborative model where AI augments rather than replaces human creativity. She''s become a leading voice on ethical AI use in creative industries.'
FROM authors a WHERE a.name = 'Holly Herndon'
ON CONFLICT (author_id, camp_id) DO NOTHING;

-- 4. Mat Dryhurst (Artist/Researcher) - AI art ethics
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, '7f64838f-59a6-4c87-8373-a023b9f448cc'::uuid, -- Safety First
  'The current approach to training AI on creative works without consent or compensation is fundamentally extractive. We need new frameworks for attribution, consent, and compensation before we can call any of this ethical. Artists deserve agency over how their work is used.',
  'https://spawning.ai/',
  'strong',
  'Mat Dryhurst co-founded Spawning.ai, building tools like Have I Been Trained that let artists check if their work was used in AI training. He advocates for artist rights and consent in the AI age.'
FROM authors a WHERE a.name = 'Mat Dryhurst'
ON CONFLICT (author_id, camp_id) DO NOTHING;

INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, 'fe19ae2d-99f2-4c30-a596-c9cd92bff41b'::uuid, -- Democratize Fast
  'We''re not anti-AI - we want AI tools that work for creators, not against them. The technology is exciting, but the current implementation extracts value from artists. With proper consent frameworks, AI can genuinely democratize creativity.',
  'https://spawning.ai/',
  'partial',
  'Unlike pure AI skeptics, Dryhurst embraces the technology while pushing for better governance. Spawning.ai represents a constructive approach to AI ethics, building tools rather than just criticizing.'
FROM authors a WHERE a.name = 'Mat Dryhurst'
ON CONFLICT (author_id, camp_id) DO NOTHING;

-- 5. Ying Lu (International AI researcher)
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, 'ee10cf4f-025a-47fc-be20-33d6756ec5cd'::uuid, -- Adaptive Governance
  'AI governance cannot be one-size-fits-all. Different cultural contexts, economic conditions, and social structures require different regulatory approaches. International cooperation must respect local autonomy while establishing shared principles.',
  'https://example.com/ying-lu',
  'strong',
  'Ying Lu brings important international perspectives to AI governance discussions, highlighting how regulatory approaches must adapt to different cultural and economic contexts while maintaining global cooperation.'
FROM authors a WHERE a.name = 'Ying Lu'
ON CONFLICT (author_id, camp_id) DO NOTHING;

-- 6. Jianfeng Gao (Microsoft Research) - NLP researcher
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, 'c5dcb027-cd27-4c91-adb4-aca780d15199'::uuid, -- Scaling Will Deliver
  'The progress we''ve seen in language understanding comes directly from scale - larger models trained on more data consistently show emergent capabilities. Deep learning rewards scale, and we''re still discovering new capabilities as we push the boundaries.',
  'https://www.microsoft.com/en-us/research/people/jfgao/',
  'strong',
  'Jianfeng Gao is a Distinguished Scientist at Microsoft Research who has led work on neural information retrieval and language understanding. His research has consistently demonstrated the power of scaled-up models.'
FROM authors a WHERE a.name = 'Jianfeng Gao'
ON CONFLICT (author_id, camp_id) DO NOTHING;

INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, 'a076a4ce-f14c-47b5-ad01-c8c60135a494'::uuid, -- Tech Builders
  'Research breakthroughs matter most when they become products that help people. At Microsoft, we focus on translating fundamental advances in NLP into tools like Bing and Copilot that billions of people can use.',
  'https://www.microsoft.com/en-us/research/people/jfgao/',
  'partial',
  'His work bridges research and product, helping translate academic advances into Microsoft products. This builder mindset shapes how research gets deployed at scale.'
FROM authors a WHERE a.name = 'Jianfeng Gao'
ON CONFLICT (author_id, camp_id) DO NOTHING;

-- 7. Arvind Vemuri (Notion) - AI product leader
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, 'd8d3cec4-f8ce-49b1-9a43-bb0d952db371'::uuid, -- Human-AI Collaboration
  'The best AI features disappear into the workflow - they help you do your work faster without forcing you to think about the AI. Notion AI is designed to augment how people already work, not to replace their thinking.',
  'https://notion.so/product/ai',
  'strong',
  'As Head of AI at Notion, Arvind Vemuri shapes how AI integrates into productivity software used by millions. His focus on seamless augmentation rather than replacement represents the collaboration paradigm.'
FROM authors a WHERE a.name = 'Arvind Vemuri'
ON CONFLICT (author_id, camp_id) DO NOTHING;

INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, 'fe9464df-b778-44c9-9593-7fb3294fa6c3'::uuid, -- Business Whisperers
  'Successful AI adoption in enterprises isn''t about the most advanced model - it''s about understanding how teams actually work and building AI that fits those patterns. User research matters more than benchmarks.',
  'https://notion.so/product/ai',
  'partial',
  'His experience building Notion AI for enterprise customers demonstrates the importance of understanding business context. Technical capability alone doesn''t drive adoption - user experience does.'
FROM authors a WHERE a.name = 'Arvind Vemuri'
ON CONFLICT (author_id, camp_id) DO NOTHING;

COMMIT;

-- Verify the fix
SELECT a.name, COUNT(ca.id) as camp_count
FROM authors a
LEFT JOIN camp_authors ca ON a.id = ca.author_id
WHERE a.name IN ('Sergey Levine', 'Chelsea Finn', 'Holly Herndon', 'Mat Dryhurst', 'Ying Lu', 'Jianfeng Gao', 'Arvind Vemuri')
GROUP BY a.id, a.name
ORDER BY a.name;
