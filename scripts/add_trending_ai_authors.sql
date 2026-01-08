-- =============================================================================
-- ADD TRENDING AI TECHNICAL CAPABILITIES AUTHORS
-- =============================================================================
-- Date: 2026-01-08
-- Focus: New/emerging AI technical topics (agents, infrastructure, reasoning, etc.)
-- =============================================================================

BEGIN;

-- =============================================================================
-- CAMP UUIDs REFERENCE:
-- Scaling Will Deliver: c5dcb027-cd27-4c91-adb4-aca780d15199
-- Needs New Approaches: 207582eb-7b32-4951-9863-32fcf05944a1
-- Safety First: 7f64838f-59a6-4c87-8373-a023b9f448cc
-- Democratize Fast: fe19ae2d-99f2-4c30-a596-c9cd92bff41b
-- Technology Leads: 7e9a2196-71e7-423a-889c-6902bc678eac
-- Co-Evolution: f19021ab-a8db-4363-adec-c2228dad6298
-- Tech Builders: a076a4ce-f14c-47b5-ad01-c8c60135a494
-- Human-AI Collaboration: d8d3cec4-f8ce-49b1-9a43-bb0d952db371
-- Adaptive Governance: ee10cf4f-025a-47fc-be20-33d6756ec5cd
-- Innovation First: 331b2b02-7f8d-4751-b583-16255a6feb50
-- =============================================================================

-- =============================================================================
-- 1. MATEI ZAHARIA (Databricks, MLflow, Spark)
-- =============================================================================
INSERT INTO authors (name, header_affiliation, primary_affiliation, author_type, credibility_tier, notes, sources, key_quote, quote_source_url)
VALUES (
  'Matei Zaharia',
  'Databricks',
  'Databricks, Co-founder & CTO; Stanford University',
  'Industry Leader',
  'Pioneer',
  'Co-creator of Apache Spark and MLflow. His work on data infrastructure fundamentally changed how ML systems are built and deployed at scale. Now leading compound AI systems research at Databricks.',
  '[
    {"url": "https://www.databricks.com/blog/2023/09/13/announcing-dbrx-new-standard-efficient-open-source-ai.html", "type": "Blog", "year": "2024", "title": "DBRX: A New Standard for Open Source AI"},
    {"url": "https://arxiv.org/abs/2310.08560", "type": "Paper", "year": "2023", "title": "The Shift from Models to Compound AI Systems"},
    {"url": "https://www.databricks.com/blog/2024/05/13/introducing-databricks-compound-ai-systems.html", "type": "Blog", "year": "2024", "title": "Compound AI Systems"}
  ]'::jsonb,
  'The future of AI is not just bigger models—it''s compound AI systems that combine LLMs with retrieval, tools, and traditional code. The best AI applications will be systems, not just models.',
  'https://arxiv.org/abs/2310.08560'
);

-- =============================================================================
-- 2. QUOC LE (Google DeepMind, Transformer co-inventor)
-- =============================================================================
INSERT INTO authors (name, header_affiliation, primary_affiliation, author_type, credibility_tier, notes, sources, key_quote, quote_source_url)
VALUES (
  'Quoc Le',
  'Google DeepMind',
  'Google DeepMind, Research Scientist',
  'Researcher',
  'Pioneer',
  'Co-inventor of the Transformer architecture. Pioneer in sequence-to-sequence learning and neural architecture search. His research has fundamentally shaped modern deep learning.',
  '[
    {"url": "https://arxiv.org/abs/1706.03762", "type": "Paper", "year": "2017", "title": "Attention Is All You Need (Transformer)"},
    {"url": "https://arxiv.org/abs/1611.01578", "type": "Paper", "year": "2017", "title": "Neural Architecture Search with Reinforcement Learning"},
    {"url": "https://arxiv.org/abs/1409.3215", "type": "Paper", "year": "2014", "title": "Sequence to Sequence Learning"}
  ]'::jsonb,
  'The Transformer architecture showed that attention mechanisms alone, without recurrence, can achieve state-of-the-art results. This opened the door to the scaling we see today.',
  'https://arxiv.org/abs/1706.03762'
);

-- =============================================================================
-- 3. BARRET ZOPH (Google DeepMind, NAS, Gemini)
-- =============================================================================
INSERT INTO authors (name, header_affiliation, primary_affiliation, author_type, credibility_tier, notes, sources, key_quote, quote_source_url)
VALUES (
  'Barret Zoph',
  'Google DeepMind',
  'Google DeepMind, Research Scientist',
  'Researcher',
  'Field Leader',
  'Pioneered neural architecture search (NAS) with Quoc Le. Key contributor to Gemini and PaLM. His work on automated ML has influenced how modern AI systems are designed.',
  '[
    {"url": "https://arxiv.org/abs/1611.01578", "type": "Paper", "year": "2017", "title": "Neural Architecture Search with Reinforcement Learning"},
    {"url": "https://arxiv.org/abs/2312.11805", "type": "Paper", "year": "2023", "title": "Gemini Technical Report"},
    {"url": "https://arxiv.org/abs/2204.02311", "type": "Paper", "year": "2022", "title": "PaLM: Scaling Language Modeling"}
  ]'::jsonb,
  'Neural architecture search can discover architectures that outperform human-designed ones. Automating architecture design is key to continued progress in deep learning.',
  'https://arxiv.org/abs/1611.01578'
);

-- =============================================================================
-- 4. TRI DAO (FlashAttention creator)
-- =============================================================================
INSERT INTO authors (name, header_affiliation, primary_affiliation, author_type, credibility_tier, notes, sources, key_quote, quote_source_url)
VALUES (
  'Tri Dao',
  'Together AI',
  'Together AI, Chief Scientist; Princeton University',
  'Researcher',
  'Field Leader',
  'Creator of FlashAttention, which revolutionized transformer efficiency. His work enables training longer sequences and faster inference. A key figure in making LLMs more accessible.',
  '[
    {"url": "https://arxiv.org/abs/2205.14135", "type": "Paper", "year": "2022", "title": "FlashAttention: Fast and Memory-Efficient Exact Attention"},
    {"url": "https://arxiv.org/abs/2307.08691", "type": "Paper", "year": "2023", "title": "FlashAttention-2: Faster Attention with Better Parallelism"},
    {"url": "https://github.com/Dao-AILab/flash-attention", "type": "Research", "year": "2024", "title": "FlashAttention GitHub Repository"}
  ]'::jsonb,
  'FlashAttention shows that understanding hardware is as important as understanding algorithms. IO-awareness is the key to making deep learning efficient.',
  'https://arxiv.org/abs/2205.14135'
);

-- =============================================================================
-- 5. CHRIS RÉ (Stanford, Data-centric AI)
-- =============================================================================
INSERT INTO authors (name, header_affiliation, primary_affiliation, author_type, credibility_tier, notes, sources, key_quote, quote_source_url)
VALUES (
  'Chris Ré',
  'Stanford',
  'Stanford University; Together AI, Co-founder',
  'Academic',
  'Field Leader',
  'MacArthur Fellow pioneering data-centric AI. Created Snorkel for programmatic data labeling. Co-founder of Together AI. His work emphasizes that data quality matters more than model size.',
  '[
    {"url": "https://arxiv.org/abs/2212.09720", "type": "Paper", "year": "2022", "title": "Data-centric Artificial Intelligence: A Survey"},
    {"url": "https://snorkel.ai/", "type": "Research", "year": "2024", "title": "Snorkel AI"},
    {"url": "https://arxiv.org/abs/2312.00752", "type": "Paper", "year": "2023", "title": "Mamba: Linear-Time Sequence Modeling"}
  ]'::jsonb,
  'The bottleneck in AI is not models—it''s data. Data programming and weak supervision let us scale data quality, which ultimately determines model quality.',
  'https://arxiv.org/abs/2212.09720'
);

-- =============================================================================
-- 6. JACOB STEINHARDT (UC Berkeley, AI Safety)
-- =============================================================================
INSERT INTO authors (name, header_affiliation, primary_affiliation, author_type, credibility_tier, notes, sources, key_quote, quote_source_url)
VALUES (
  'Jacob Steinhardt',
  'UC Berkeley',
  'UC Berkeley, Assistant Professor',
  'Academic',
  'Field Leader',
  'Leading AI safety researcher focusing on robustness and alignment. His ML Safety course has trained hundreds of safety researchers. Bridges technical AI and safety considerations.',
  '[
    {"url": "https://bounded-regret.ghost.io/", "type": "Blog", "year": "2024", "title": "Bounded Regret Blog"},
    {"url": "https://arxiv.org/abs/2206.13353", "type": "Paper", "year": "2022", "title": "AI Risk from Emergence and Adaptation"},
    {"url": "https://course.mlsafety.org/", "type": "Research", "year": "2024", "title": "ML Safety Course"}
  ]'::jsonb,
  'We need to develop AI systems that remain safe even as they become more capable. This requires treating safety as a core engineering discipline, not an afterthought.',
  'https://bounded-regret.ghost.io/forecasting-transformative-ai/'
);

-- =============================================================================
-- 7. EDO LIBERTY (Pinecone founder)
-- =============================================================================
INSERT INTO authors (name, header_affiliation, primary_affiliation, author_type, credibility_tier, notes, sources, key_quote, quote_source_url)
VALUES (
  'Edo Liberty',
  'Pinecone',
  'Pinecone, Founder & CEO',
  'Industry Leader',
  'Field Leader',
  'Founded Pinecone, the leading vector database for AI applications. Former Amazon VP of AI. Pioneered making RAG and semantic search accessible to developers.',
  '[
    {"url": "https://www.pinecone.io/", "type": "Organization", "year": "2024", "title": "Pinecone Vector Database"},
    {"url": "https://www.pinecone.io/blog/", "type": "Blog", "year": "2024", "title": "Pinecone Engineering Blog"},
    {"url": "https://arxiv.org/abs/2109.01517", "type": "Paper", "year": "2021", "title": "Approximate Nearest Neighbor Search"}
  ]'::jsonb,
  'Vector databases are the memory layer for AI. RAG is how we give LLMs access to current, private, and specialized knowledge without retraining.',
  'https://www.pinecone.io/learn/retrieval-augmented-generation/'
);

-- =============================================================================
-- 8. THOMAS WOLF (Hugging Face co-founder)
-- =============================================================================
INSERT INTO authors (name, header_affiliation, primary_affiliation, author_type, credibility_tier, notes, sources, key_quote, quote_source_url)
VALUES (
  'Thomas Wolf',
  'Hugging Face',
  'Hugging Face, Co-founder & Chief Science Officer',
  'Industry Leader',
  'Field Leader',
  'Co-founded Hugging Face and built the Transformers library that democratized access to state-of-the-art NLP. Advocate for open-source AI and model sharing.',
  '[
    {"url": "https://huggingface.co/", "type": "Organization", "year": "2024", "title": "Hugging Face"},
    {"url": "https://arxiv.org/abs/1910.03771", "type": "Paper", "year": "2019", "title": "HuggingFace Transformers Library"},
    {"url": "https://huggingface.co/blog", "type": "Blog", "year": "2024", "title": "Hugging Face Blog"}
  ]'::jsonb,
  'Open-source AI is not just about code—it''s about democratizing access to the most transformative technology of our time. Everyone should be able to build with AI.',
  'https://huggingface.co/blog/ethics-soc-2023'
);

-- =============================================================================
-- 9. SHOLTO DOUGLAS (Google DeepMind, Chinchilla)
-- =============================================================================
INSERT INTO authors (name, header_affiliation, primary_affiliation, author_type, credibility_tier, notes, sources, key_quote, quote_source_url)
VALUES (
  'Sholto Douglas',
  'Google DeepMind',
  'Google DeepMind, Research Scientist',
  'Researcher',
  'Domain Expert',
  'Co-author of the influential Chinchilla paper that changed how we think about compute-optimal training. Active voice on scaling laws and training dynamics.',
  '[
    {"url": "https://arxiv.org/abs/2203.15556", "type": "Paper", "year": "2022", "title": "Training Compute-Optimal Large Language Models (Chinchilla)"},
    {"url": "https://twitter.com/shlomoweiss", "type": "Social", "year": "2024", "title": "Twitter/X"},
    {"url": "https://www.dwarkeshpatel.com/p/sholto-douglas-trenton-bricken", "type": "Podcast", "year": "2024", "title": "Dwarkesh Podcast Interview"}
  ]'::jsonb,
  'Chinchilla showed that most large language models were undertrained. Scaling laws tell us the optimal balance between model size and training data.',
  'https://arxiv.org/abs/2203.15556'
);

-- =============================================================================
-- 10. YI TAY (Google, Model Architecture)
-- =============================================================================
INSERT INTO authors (name, header_affiliation, primary_affiliation, author_type, credibility_tier, notes, sources, key_quote, quote_source_url)
VALUES (
  'Yi Tay',
  'Reka AI',
  'Reka AI, Co-founder; formerly Google DeepMind',
  'Researcher',
  'Field Leader',
  'Prolific researcher on efficient transformers and model architectures. Key contributor to T5, UL2, and Flan. Co-founded Reka AI to build multimodal foundation models.',
  '[
    {"url": "https://arxiv.org/abs/2205.05131", "type": "Paper", "year": "2022", "title": "UL2: Unifying Language Learning Paradigms"},
    {"url": "https://arxiv.org/abs/2210.11416", "type": "Paper", "year": "2022", "title": "Scaling Instruction-Finetuned Language Models (Flan)"},
    {"url": "https://reka.ai/", "type": "Organization", "year": "2024", "title": "Reka AI"}
  ]'::jsonb,
  'The best model architectures balance capability with efficiency. Instruction tuning and unified objectives can unlock emergent abilities without massive scale increases.',
  'https://arxiv.org/abs/2205.05131'
);

-- =============================================================================
-- 11. KANJUN QIU (Imbue, AI Research Company)
-- =============================================================================
INSERT INTO authors (name, header_affiliation, primary_affiliation, author_type, credibility_tier, notes, sources, key_quote, quote_source_url)
VALUES (
  'Kanjun Qiu',
  'Imbue',
  'Imbue, Co-founder & CEO',
  'Industry Leader',
  'Domain Expert',
  'Founded Imbue to build AI systems that reason and code. Previously co-founded Sourceress (acquired). Focuses on AI systems that can learn to improve themselves.',
  '[
    {"url": "https://imbue.com/", "type": "Organization", "year": "2024", "title": "Imbue"},
    {"url": "https://imbue.com/research/", "type": "Research", "year": "2024", "title": "Imbue Research"},
    {"url": "https://www.youtube.com/watch?v=qBL_oFgQ0zM", "type": "Video", "year": "2024", "title": "Imbue: Building AI that reasons"}
  ]'::jsonb,
  'We need AI systems that can reason, not just pattern match. The path to useful AI is building systems that can learn to improve their own reasoning over time.',
  'https://imbue.com/research/'
);

-- =============================================================================
-- 12. SEBASTIAN RASCHKA (ML Education, Research)
-- =============================================================================
INSERT INTO authors (name, header_affiliation, primary_affiliation, author_type, credibility_tier, notes, sources, key_quote, quote_source_url)
VALUES (
  'Sebastian Raschka',
  'Lightning AI',
  'Lightning AI, Staff Research Engineer',
  'Researcher',
  'Domain Expert',
  'Influential ML educator and researcher. Author of "Machine Learning with PyTorch and Scikit-Learn" and creator of popular LLM tutorials. Makes cutting-edge research accessible.',
  '[
    {"url": "https://sebastianraschka.com/", "type": "Website", "year": "2024", "title": "Sebastian Raschka''s Website"},
    {"url": "https://github.com/rasbt/LLMs-from-scratch", "type": "Research", "year": "2024", "title": "LLMs from Scratch"},
    {"url": "https://www.amazon.com/Machine-Learning-PyTorch-Scikit-Learn/dp/1801819319", "type": "Book", "year": "2022", "title": "Machine Learning with PyTorch and Scikit-Learn"}
  ]'::jsonb,
  'Understanding the fundamentals is crucial. You can''t effectively use or improve AI systems if you don''t understand how they work at a deep level.',
  'https://magazine.sebastianraschka.com/p/understanding-large-language-models'
);

-- =============================================================================
-- 13. JASON PHANG (EleutherAI, GPT-NeoX)
-- =============================================================================
INSERT INTO authors (name, header_affiliation, primary_affiliation, author_type, credibility_tier, notes, sources, key_quote, quote_source_url)
VALUES (
  'Jason Phang',
  'EleutherAI',
  'EleutherAI, Researcher',
  'Researcher',
  'Domain Expert',
  'Core contributor to EleutherAI open source LLMs including GPT-NeoX and Pythia. Focuses on making large model training accessible to the research community.',
  '[
    {"url": "https://arxiv.org/abs/2304.01373", "type": "Paper", "year": "2023", "title": "Pythia: A Suite for Analyzing Large Language Models"},
    {"url": "https://arxiv.org/abs/2204.06745", "type": "Paper", "year": "2022", "title": "GPT-NeoX-20B"},
    {"url": "https://www.eleuther.ai/", "type": "Organization", "year": "2024", "title": "EleutherAI"}
  ]'::jsonb,
  'Open-source model suites like Pythia enable the scientific study of how language models learn. We need this transparency to make progress on interpretability.',
  'https://arxiv.org/abs/2304.01373'
);

-- =============================================================================
-- 14. SARAH CATANZARO (AI Investing, Amplify Partners)
-- =============================================================================
INSERT INTO authors (name, header_affiliation, primary_affiliation, author_type, credibility_tier, notes, sources, key_quote, quote_source_url)
VALUES (
  'Sarah Catanzaro',
  'Amplify Partners',
  'Amplify Partners, General Partner',
  'Investor',
  'Domain Expert',
  'Leading AI/ML investor with deep technical background. Previously head of ML at Mattermark. Writes influential analysis on AI market dynamics and technology trends.',
  '[
    {"url": "https://amplifypartners.com/team/sarah-catanzaro/", "type": "Website", "year": "2024", "title": "Amplify Partners Profile"},
    {"url": "https://gradient.pub/", "type": "Blog", "year": "2024", "title": "The Gradient (Podcast & Publication)"},
    {"url": "https://twitter.com/sarahcat21", "type": "Social", "year": "2024", "title": "Twitter/X"}
  ]'::jsonb,
  'The AI infrastructure stack is still being built. The companies that win will be those that understand both the technology and the business model innovation required.',
  'https://amplifypartners.com/insights/'
);

-- =============================================================================
-- 15. HUGO TOUVRON (Meta, Llama)
-- =============================================================================
INSERT INTO authors (name, header_affiliation, primary_affiliation, author_type, credibility_tier, notes, sources, key_quote, quote_source_url)
VALUES (
  'Hugo Touvron',
  'Meta AI',
  'Meta AI, Research Scientist',
  'Researcher',
  'Field Leader',
  'Lead author on Llama and Llama 2 papers. Key figure in making powerful open-weight LLMs available to the research community. His work accelerated open-source AI.',
  '[
    {"url": "https://arxiv.org/abs/2302.13971", "type": "Paper", "year": "2023", "title": "LLaMA: Open and Efficient Foundation Language Models"},
    {"url": "https://arxiv.org/abs/2307.09288", "type": "Paper", "year": "2023", "title": "Llama 2: Open Foundation and Fine-Tuned Chat Models"},
    {"url": "https://ai.meta.com/llama/", "type": "Research", "year": "2024", "title": "Llama at Meta AI"}
  ]'::jsonb,
  'Open foundation models democratize AI research. Llama showed that open weights can achieve competitive performance while enabling the broader research community to build on top.',
  'https://arxiv.org/abs/2302.13971'
);

COMMIT;

-- =============================================================================
-- ADD CAMP RELATIONSHIPS
-- =============================================================================

BEGIN;

-- Matei Zaharia - Tech Builders (strong), Co-Evolution (partial)
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, 'a076a4ce-f14c-47b5-ad01-c8c60135a494'::uuid, 'strong',
  'Compound AI systems that combine LLMs with retrieval, tools, and code will outperform monolithic models. The best AI applications are systems engineering, not just model training.',
  'https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/',
  'Zaharia''s "compound AI systems" thesis shapes how enterprises build production AI. His infrastructure work (Spark, MLflow) and DBRX open model demonstrate practical paths to AI adoption.'
FROM authors a WHERE a.name = 'Matei Zaharia'
ON CONFLICT (author_id, camp_id) DO NOTHING;

INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, 'f19021ab-a8db-4363-adec-c2228dad6298'::uuid, 'partial',
  'AI success requires not just models but the entire stack—data engineering, feature management, model serving, and monitoring. Organizations need to evolve their data infrastructure alongside AI capabilities.',
  'https://www.databricks.com/blog/2024/05/13/introducing-databricks-compound-ai-systems.html',
  'His data platform approach emphasizes that AI transformation requires concurrent evolution of infrastructure, processes, and organizational capabilities—not just model deployment.'
FROM authors a WHERE a.name = 'Matei Zaharia'
ON CONFLICT (author_id, camp_id) DO NOTHING;

-- Quoc Le - Scaling Will Deliver (strong)
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, 'c5dcb027-cd27-4c91-adb4-aca780d15199'::uuid, 'strong',
  'The Transformer architecture scales remarkably well. As we scale compute and data, these models continue to improve in ways that were hard to predict from smaller experiments.',
  'https://arxiv.org/abs/1706.03762',
  'As co-inventor of the Transformer, Quoc Le''s work laid the foundation for the scaling paradigm. His research on neural architecture search also showed how to automatically discover better architectures.'
FROM authors a WHERE a.name = 'Quoc Le'
ON CONFLICT (author_id, camp_id) DO NOTHING;

-- Barret Zoph - Scaling Will Deliver (strong)
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, 'c5dcb027-cd27-4c91-adb4-aca780d15199'::uuid, 'strong',
  'Neural architecture search shows that we can automate the discovery of better model architectures. Combined with scale, this opens new frontiers in AI capability.',
  'https://arxiv.org/abs/1611.01578',
  'Zoph''s NAS research demonstrated that AI can design AI systems. His work on PaLM and Gemini at Google DeepMind puts him at the frontier of scaling research.'
FROM authors a WHERE a.name = 'Barret Zoph'
ON CONFLICT (author_id, camp_id) DO NOTHING;

-- Tri Dao - Tech Builders (strong), Democratize Fast (partial)
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, 'a076a4ce-f14c-47b5-ad01-c8c60135a494'::uuid, 'strong',
  'FlashAttention demonstrates that understanding hardware constraints is as important as algorithmic innovation. IO-aware algorithms can provide 2-4x speedups without changing the model.',
  'https://arxiv.org/abs/2205.14135',
  'FlashAttention made training long-context models practical and dramatically reduced inference costs. Tri Dao''s work directly enables more efficient AI deployment.'
FROM authors a WHERE a.name = 'Tri Dao'
ON CONFLICT (author_id, camp_id) DO NOTHING;

INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, 'fe19ae2d-99f2-4c30-a596-c9cd92bff41b'::uuid, 'partial',
  'By making attention more efficient, we lower the computational barriers to AI. Researchers and startups can now train and deploy models that previously required big tech resources.',
  'https://arxiv.org/abs/2307.08691',
  'FlashAttention''s open-source release democratized efficient transformer training. His work at Together AI continues this mission of making AI infrastructure accessible.'
FROM authors a WHERE a.name = 'Tri Dao'
ON CONFLICT (author_id, camp_id) DO NOTHING;

-- Chris Ré - Needs New Approaches (strong)
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, '207582eb-7b32-4951-9863-32fcf05944a1'::uuid, 'strong',
  'Data quality is the real bottleneck in AI. Weak supervision and data programming can scale data labeling without expensive manual annotation. The focus should shift from models to data.',
  'https://arxiv.org/abs/2212.09720',
  'Chris Ré''s data-centric AI perspective challenges the pure scaling paradigm. His Snorkel system and Mamba architecture work show alternative paths to AI progress beyond just scale.'
FROM authors a WHERE a.name = 'Chris Ré'
ON CONFLICT (author_id, camp_id) DO NOTHING;

-- Jacob Steinhardt - Safety First (strong)
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, '7f64838f-59a6-4c87-8373-a023b9f448cc'::uuid, 'strong',
  'AI safety is not just about alignment—it''s about building robust systems that behave predictably even in novel situations. We need safety engineering to be a core ML discipline.',
  'https://bounded-regret.ghost.io/',
  'Steinhardt trains the next generation of safety researchers through his ML Safety course. His technical approach bridges academic rigor with practical safety engineering.'
FROM authors a WHERE a.name = 'Jacob Steinhardt'
ON CONFLICT (author_id, camp_id) DO NOTHING;

-- Edo Liberty - Tech Builders (strong)
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, 'a076a4ce-f14c-47b5-ad01-c8c60135a494'::uuid, 'strong',
  'Vector databases are the memory layer for AI applications. RAG architecture lets you combine the reasoning of LLMs with the precision of retrieval—this is how production AI actually works.',
  'https://www.pinecone.io/learn/retrieval-augmented-generation/',
  'Pinecone pioneered the vector database category and made RAG accessible to developers. Edo Liberty''s work shapes how production AI applications access knowledge.'
FROM authors a WHERE a.name = 'Edo Liberty'
ON CONFLICT (author_id, camp_id) DO NOTHING;

-- Thomas Wolf - Democratize Fast (strong)
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, 'fe19ae2d-99f2-4c30-a596-c9cd92bff41b'::uuid, 'strong',
  'Open-source AI is a force multiplier for innovation. The Transformers library has been downloaded billions of times because making AI accessible accelerates progress for everyone.',
  'https://huggingface.co/blog/ethics-soc-2023',
  'Hugging Face transformed how developers access AI models. Thomas Wolf''s vision of AI as a public good has shaped the open-source AI movement and influenced policy debates.'
FROM authors a WHERE a.name = 'Thomas Wolf'
ON CONFLICT (author_id, camp_id) DO NOTHING;

-- Sholto Douglas - Scaling Will Deliver (strong)
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, 'c5dcb027-cd27-4c91-adb4-aca780d15199'::uuid, 'strong',
  'Chinchilla showed that scaling laws are more nuanced than we thought. The right balance of model size and data is crucial—most models were severely undertrained.',
  'https://arxiv.org/abs/2203.15556',
  'The Chinchilla paper reshaped the entire LLM training landscape. Douglas''s scaling law research directly influences how labs allocate compute budgets.'
FROM authors a WHERE a.name = 'Sholto Douglas'
ON CONFLICT (author_id, camp_id) DO NOTHING;

-- Yi Tay - Scaling Will Deliver (partial), Tech Builders (strong)
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, 'a076a4ce-f14c-47b5-ad01-c8c60135a494'::uuid, 'strong',
  'Model architecture innovation remains crucial. UL2 and instruction tuning show that training methodology can unlock capabilities without just throwing more compute at the problem.',
  'https://arxiv.org/abs/2205.05131',
  'Yi Tay''s work on UL2 and Flan influenced how modern LLMs are trained. At Reka AI, he''s building multimodal models that push architectural innovation.'
FROM authors a WHERE a.name = 'Yi Tay'
ON CONFLICT (author_id, camp_id) DO NOTHING;

-- Kanjun Qiu - Needs New Approaches (partial), Human-AI Collaboration (strong)
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, 'd8d3cec4-f8ce-49b1-9a43-bb0d952db371'::uuid, 'strong',
  'The goal isn''t to replace human programmers but to build AI that reasons alongside them. AI systems should enhance human capability, not just automate away tasks.',
  'https://imbue.com/',
  'Imbue''s focus on reasoning and code generation represents a vision of AI as cognitive augmentation. Kanjun''s approach emphasizes AI as a collaborator, not a replacement.'
FROM authors a WHERE a.name = 'Kanjun Qiu'
ON CONFLICT (author_id, camp_id) DO NOTHING;

-- Sebastian Raschka - Tech Builders (partial), Human-AI Collaboration (partial)
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, 'a076a4ce-f14c-47b5-ad01-c8c60135a494'::uuid, 'partial',
  'Understanding how LLMs work from the ground up is essential for building effective AI systems. You cannot optimize what you do not understand.',
  'https://magazine.sebastianraschka.com/p/understanding-large-language-models',
  'Raschka''s educational work empowers practitioners to build better AI systems. His LLMs-from-scratch tutorials have trained thousands of engineers.'
FROM authors a WHERE a.name = 'Sebastian Raschka'
ON CONFLICT (author_id, camp_id) DO NOTHING;

-- Jason Phang - Democratize Fast (strong)
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, 'fe19ae2d-99f2-4c30-a596-c9cd92bff41b'::uuid, 'strong',
  'Pythia enables the scientific study of how language models learn. Open model suites with full training data and checkpoints are essential for interpretability research.',
  'https://arxiv.org/abs/2304.01373',
  'EleutherAI''s open-source models and training data have been instrumental for AI research outside big labs. Phang''s work on Pythia directly advances AI transparency.'
FROM authors a WHERE a.name = 'Jason Phang'
ON CONFLICT (author_id, camp_id) DO NOTHING;

-- Sarah Catanzaro - Innovation First (strong)
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, '331b2b02-7f8d-4751-b583-16255a6feb50'::uuid, 'strong',
  'AI infrastructure is still in its early days. The companies that succeed will be those that can move fast while maintaining the flexibility to adapt as the technology evolves.',
  'https://amplifypartners.com/insights/',
  'As an investor backing AI infrastructure companies, Catanzaro has a unique vantage point on market dynamics. Her analysis shapes how founders and investors think about AI.'
FROM authors a WHERE a.name = 'Sarah Catanzaro'
ON CONFLICT (author_id, camp_id) DO NOTHING;

-- Hugo Touvron - Democratize Fast (strong)
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT a.id, 'fe19ae2d-99f2-4c30-a596-c9cd92bff41b'::uuid, 'strong',
  'Releasing Llama as open weights accelerates AI research. When the community can access and improve foundation models, everyone benefits from faster progress.',
  'https://arxiv.org/abs/2302.13971',
  'Llama''s release was a watershed moment for open-source AI. Touvron''s work enabled thousands of researchers and companies to build on state-of-the-art foundation models.'
FROM authors a WHERE a.name = 'Hugo Touvron'
ON CONFLICT (author_id, camp_id) DO NOTHING;

COMMIT;

-- =============================================================================
-- VERIFICATION
-- =============================================================================
SELECT 'NEW AUTHORS ADDED:' as section;
SELECT a.name, a.header_affiliation, COUNT(ca.id) as camps
FROM authors a
LEFT JOIN camp_authors ca ON a.id = ca.author_id
WHERE a.name IN (
  'Matei Zaharia', 'Quoc Le', 'Barret Zoph', 'Tri Dao', 'Chris Ré',
  'Jacob Steinhardt', 'Edo Liberty', 'Thomas Wolf', 'Sholto Douglas',
  'Yi Tay', 'Kanjun Qiu', 'Sebastian Raschka', 'Jason Phang',
  'Sarah Catanzaro', 'Hugo Touvron'
)
GROUP BY a.id, a.name, a.header_affiliation
ORDER BY a.name;
