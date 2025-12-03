-- Add 20 new authors from ai_discourse_20_authors.csv
-- Each author includes their sources extracted from the CSV

-- 1. Ian Hogarth
INSERT INTO authors (name, header_affiliation, author_type, credibility_tier, primary_affiliation, notes, sources)
VALUES (
  'Ian Hogarth',
  'Chair, UK AI Safety Institute',
  'Industry Leader',
  'Thought Leader',
  'UK AI Safety Institute',
  'Frames frontier AI as a ''Godzilla''-scale technology that is both economically transformative and geopolitically destabilising; argues for strong public institutions and international coordination.',
  '[
    {"title": "AI Nationalism", "type": "Essay", "year": "2018", "url": "https://www.ianhogarth.com/blog/ai-nationalism"},
    {"title": "Financial Times AI Columns", "type": "Articles", "year": "2024", "url": "https://www.ft.com"},
    {"title": "UK AI Safety Institute", "type": "Institute", "year": "2024", "url": "https://www.aisafetyinstitute.gov.uk"}
  ]'::jsonb
) ON CONFLICT (name) DO UPDATE SET
  header_affiliation = EXCLUDED.header_affiliation,
  author_type = EXCLUDED.author_type,
  credibility_tier = EXCLUDED.credibility_tier,
  primary_affiliation = EXCLUDED.primary_affiliation,
  notes = EXCLUDED.notes,
  sources = EXCLUDED.sources;

-- 2. Ajeya Cotra
INSERT INTO authors (name, header_affiliation, author_type, credibility_tier, primary_affiliation, notes, sources)
VALUES (
  'Ajeya Cotra',
  'Senior Research Analyst, Open Philanthropy',
  'Academic/Practitioner',
  'Seminal Thinker',
  'Open Philanthropy',
  'Builds quantitative forecasts for transformative AI using ''biological anchors''; argues transformative AI this century is more likely than not but deeply uncertain.',
  '[
    {"title": "Forecasting TAI with Biological Anchors", "type": "Report", "year": "2020", "url": "https://forecasting.tai.cotra.com"},
    {"title": "Open Philanthropy AI Work", "type": "Research", "year": "2024", "url": "https://www.openphilanthropy.org"},
    {"title": "Future of Life Institute Interviews", "type": "Podcast", "year": "2024", "url": "https://futureoflife.org"}
  ]'::jsonb
) ON CONFLICT (name) DO UPDATE SET
  header_affiliation = EXCLUDED.header_affiliation,
  author_type = EXCLUDED.author_type,
  credibility_tier = EXCLUDED.credibility_tier,
  primary_affiliation = EXCLUDED.primary_affiliation,
  notes = EXCLUDED.notes,
  sources = EXCLUDED.sources;

-- 3. Stuart Russell
INSERT INTO authors (name, header_affiliation, author_type, credibility_tier, primary_affiliation, notes, sources)
VALUES (
  'Stuart Russell',
  'Professor of Computer Science, UC Berkeley',
  'Academic',
  'Seminal Thinker',
  'University of California, Berkeley',
  'Warns that mis-specified objectives in powerful AI systems create catastrophic failures; argues for ''provably beneficial AI'' that treats human preferences as uncertain.',
  '[
    {"title": "Human Compatible", "type": "Book", "year": "2019", "url": "https://www.penguinrandomhouse.com/books/566677/human-compatible-by-stuart-russell"},
    {"title": "Artificial Intelligence: A Modern Approach", "type": "Textbook", "year": "2020", "url": "https://aima.cs.berkeley.edu/"},
    {"title": "Center for Human-Compatible AI", "type": "Institute", "year": "2024", "url": "https://humancompatible.ai/"}
  ]'::jsonb
) ON CONFLICT (name) DO UPDATE SET
  header_affiliation = EXCLUDED.header_affiliation,
  author_type = EXCLUDED.author_type,
  credibility_tier = EXCLUDED.credibility_tier,
  primary_affiliation = EXCLUDED.primary_affiliation,
  notes = EXCLUDED.notes,
  sources = EXCLUDED.sources;

-- 4. Nick Bostrom
INSERT INTO authors (name, header_affiliation, author_type, credibility_tier, primary_affiliation, notes, sources)
VALUES (
  'Nick Bostrom',
  'Professor of Philosophy, Oxford',
  'Academic',
  'Seminal Thinker',
  'University of Oxford (Future of Humanity Institute)',
  'Argues that superintelligent AI could permanently tilt the future; stresses the ''control problem'' and one-shot nature of superintelligence deployment.',
  '[
    {"title": "Superintelligence: Paths, Dangers, Strategies", "type": "Book", "year": "2014", "url": "https://nickbostrom.com/books/superintelligence"},
    {"title": "Future of Humanity Institute", "type": "Institute", "year": "2024", "url": "https://www.fhi.ox.ac.uk/"},
    {"title": "Nick Bostrom Personal Site", "type": "Website", "year": "2024", "url": "https://nickbostrom.com"}
  ]'::jsonb
) ON CONFLICT (name) DO UPDATE SET
  header_affiliation = EXCLUDED.header_affiliation,
  author_type = EXCLUDED.author_type,
  credibility_tier = EXCLUDED.credibility_tier,
  primary_affiliation = EXCLUDED.primary_affiliation,
  notes = EXCLUDED.notes,
  sources = EXCLUDED.sources;

-- 5. Eliezer Yudkowsky
INSERT INTO authors (name, header_affiliation, author_type, credibility_tier, primary_affiliation, notes, sources)
VALUES (
  'Eliezer Yudkowsky',
  'Co-founder, MIRI',
  'Academic/Practitioner',
  'Thought Leader',
  'Machine Intelligence Research Institute',
  'Holds that unaligned AGI built under current incentives will almost certainly be catastrophic; believes alignment is far behind capabilities.',
  '[
    {"title": "AGI Ruin: A List of Lethalities", "type": "Essay", "year": "2022", "url": "https://www.lesswrong.com/posts/HBxe6wdjxK239zajf/agi-ruin-a-list-of-lethalities"},
    {"title": "LessWrong", "type": "Platform", "year": "2024", "url": "https://www.lesswrong.com"},
    {"title": "Machine Intelligence Research Institute", "type": "Institute", "year": "2024", "url": "https://intelligence.org"}
  ]'::jsonb
) ON CONFLICT (name) DO UPDATE SET
  header_affiliation = EXCLUDED.header_affiliation,
  author_type = EXCLUDED.author_type,
  credibility_tier = EXCLUDED.credibility_tier,
  primary_affiliation = EXCLUDED.primary_affiliation,
  notes = EXCLUDED.notes,
  sources = EXCLUDED.sources;

-- 6. Suresh Venkatasubramanian
INSERT INTO authors (name, header_affiliation, author_type, credibility_tier, primary_affiliation, notes, sources)
VALUES (
  'Suresh Venkatasubramanian',
  'Professor, Brown; former OSTP AI Bill of Rights lead',
  'Academic/Policy Maker',
  'Thought Leader',
  'Brown University; former White House OSTP',
  'Co-led the US effort to articulate an ''AI Bill of Rights'' focused on protecting civil rights, privacy, and human agency.',
  '[
    {"title": "Blueprint for an AI Bill of Rights", "type": "Policy", "year": "2022", "url": "https://www.whitehouse.gov/ostp/ai-bill-of-rights"},
    {"title": "Tech Policy Press Articles", "type": "Articles", "year": "2024", "url": "https://techpolicy.press"},
    {"title": "Brown University Profile", "type": "Academic", "year": "2024", "url": "https://cs.brown.edu/people/suresh"}
  ]'::jsonb
) ON CONFLICT (name) DO UPDATE SET
  header_affiliation = EXCLUDED.header_affiliation,
  author_type = EXCLUDED.author_type,
  credibility_tier = EXCLUDED.credibility_tier,
  primary_affiliation = EXCLUDED.primary_affiliation,
  notes = EXCLUDED.notes,
  sources = EXCLUDED.sources;

-- 7. Margaret Mitchell
INSERT INTO authors (name, header_affiliation, author_type, credibility_tier, primary_affiliation, notes, sources)
VALUES (
  'Margaret Mitchell',
  'Chief Ethics Scientist, Hugging Face',
  'Academic/Practitioner',
  'Thought Leader',
  'Hugging Face',
  'Critiques the ''scale is all you need'' paradigm; argues large LMs embed and amplify harms; emphasises documentation and worker rights.',
  '[
    {"title": "On the Dangers of Stochastic Parrots", "type": "Paper", "year": "2021", "url": "https://dl.acm.org/doi/10.1145/3442188.3445922"},
    {"title": "Model Cards for Model Reporting", "type": "Paper", "year": "2019", "url": "https://arxiv.org/abs/1810.03993"},
    {"title": "Hugging Face Blog", "type": "Blog", "year": "2024", "url": "https://huggingface.co/blog/model-cards"}
  ]'::jsonb
) ON CONFLICT (name) DO UPDATE SET
  header_affiliation = EXCLUDED.header_affiliation,
  author_type = EXCLUDED.author_type,
  credibility_tier = EXCLUDED.credibility_tier,
  primary_affiliation = EXCLUDED.primary_affiliation,
  notes = EXCLUDED.notes,
  sources = EXCLUDED.sources;

-- 8. Rumman Chowdhury
INSERT INTO authors (name, header_affiliation, author_type, credibility_tier, primary_affiliation, notes, sources)
VALUES (
  'Rumman Chowdhury',
  'CEO, Humane Intelligence',
  'Practitioner',
  'Thought Leader',
  'Humane Intelligence',
  'Advocates for sociotechnical audits and community red-teaming; warns that outsourcing human judgment to AI is a ''failure state''.',
  '[
    {"title": "Humane Intelligence", "type": "Organization", "year": "2024", "url": "https://humane-ai.org"},
    {"title": "AI Red Teaming Work", "type": "Research", "year": "2024", "url": "https://www.businessinsider.com"},
    {"title": "US Science Envoy for AI", "type": "Role", "year": "2024", "url": "https://timesofindia.indiatimes.com"}
  ]'::jsonb
) ON CONFLICT (name) DO UPDATE SET
  header_affiliation = EXCLUDED.header_affiliation,
  author_type = EXCLUDED.author_type,
  credibility_tier = EXCLUDED.credibility_tier,
  primary_affiliation = EXCLUDED.primary_affiliation,
  notes = EXCLUDED.notes,
  sources = EXCLUDED.sources;

-- 9. Judea Pearl
INSERT INTO authors (name, header_affiliation, author_type, credibility_tier, primary_affiliation, notes, sources)
VALUES (
  'Judea Pearl',
  'Professor, UCLA; pioneer of causal inference',
  'Academic',
  'Seminal Thinker',
  'University of California, Los Angeles',
  'Argues that true intelligence requires causal models; current deep learning systems are ''curve-fitters'' lacking understanding and counterfactual reasoning.',
  '[
    {"title": "The Book of Why", "type": "Book", "year": "2018", "url": "https://bayes.cs.ucla.edu/WHY"},
    {"title": "Causality: Models, Reasoning, and Inference", "type": "Book", "year": "2009", "url": "https://www.cambridge.org/core/books/causality/B0046844FAE10CBF274D4ACBDAEB5F5B"},
    {"title": "UCLA Cognitive Systems Lab", "type": "Lab", "year": "2024", "url": "https://bayes.cs.ucla.edu/"}
  ]'::jsonb
) ON CONFLICT (name) DO UPDATE SET
  header_affiliation = EXCLUDED.header_affiliation,
  author_type = EXCLUDED.author_type,
  credibility_tier = EXCLUDED.credibility_tier,
  primary_affiliation = EXCLUDED.primary_affiliation,
  notes = EXCLUDED.notes,
  sources = EXCLUDED.sources;

-- 10. Yejin Choi
INSERT INTO authors (name, header_affiliation, author_type, credibility_tier, primary_affiliation, notes, sources)
VALUES (
  'Yejin Choi',
  'Professor, University of Washington; AI2',
  'Academic',
  'Thought Leader',
  'University of Washington; Allen Institute for AI',
  'Highlights that current LLMs are ''incredibly smart and shockingly stupid'' because they lack robust commonsense and moral reasoning.',
  '[
    {"title": "Why AI Is Incredibly Smart and Shockingly Stupid", "type": "TED Talk", "year": "2023", "url": "https://www.ted.com/talks/yejin_choi_why_ai_is_incredibly_smart_and_shockingly_stupid"},
    {"title": "Allen Institute for AI", "type": "Institute", "year": "2024", "url": "https://allenai.org/"},
    {"title": "University of Washington NLP", "type": "Lab", "year": "2024", "url": "https://nlp.washington.edu/"}
  ]'::jsonb
) ON CONFLICT (name) DO UPDATE SET
  header_affiliation = EXCLUDED.header_affiliation,
  author_type = EXCLUDED.author_type,
  credibility_tier = EXCLUDED.credibility_tier,
  primary_affiliation = EXCLUDED.primary_affiliation,
  notes = EXCLUDED.notes,
  sources = EXCLUDED.sources;

-- 11. Lilian Weng
INSERT INTO authors (name, header_affiliation, author_type, credibility_tier, primary_affiliation, notes, sources)
VALUES (
  'Lilian Weng',
  'Head of Safety Systems, OpenAI',
  'Practitioner',
  'Thought Leader',
  'OpenAI',
  'Designs safety systems, evaluations, and mitigations for frontier models; popularises technical alignment topics through accessible long-form posts.',
  '[
    {"title": "Lil''Log Technical Blog", "type": "Blog", "year": "2024", "url": "https://lilianweng.github.io"},
    {"title": "OpenAI Safety Research", "type": "Research", "year": "2024", "url": "https://openai.com/safety"},
    {"title": "OpenAI Blog", "type": "Blog", "year": "2024", "url": "https://openai.com/blog"}
  ]'::jsonb
) ON CONFLICT (name) DO UPDATE SET
  header_affiliation = EXCLUDED.header_affiliation,
  author_type = EXCLUDED.author_type,
  credibility_tier = EXCLUDED.credibility_tier,
  primary_affiliation = EXCLUDED.primary_affiliation,
  notes = EXCLUDED.notes,
  sources = EXCLUDED.sources;

-- 12. Abeba Birhane
INSERT INTO authors (name, header_affiliation, author_type, credibility_tier, primary_affiliation, notes, sources)
VALUES (
  'Abeba Birhane',
  'Director, AI Accountability Lab, Trinity College Dublin',
  'Academic',
  'Thought Leader',
  'Trinity College Dublin',
  'Argues that AI development often replicates colonial power dynamics; critiques large datasets that treat people as raw material.',
  '[
    {"title": "Algorithmic Colonization of Africa", "type": "Paper", "year": "2020", "url": "https://script-ed.org/article/algorithmic-colonization-of-africa"},
    {"title": "Personal Blog", "type": "Blog", "year": "2024", "url": "https://abebabirhane.wordpress.com"},
    {"title": "LAION Dataset Audit", "type": "Research", "year": "2023", "url": "https://arxiv.org/abs/2303.11048"}
  ]'::jsonb
) ON CONFLICT (name) DO UPDATE SET
  header_affiliation = EXCLUDED.header_affiliation,
  author_type = EXCLUDED.author_type,
  credibility_tier = EXCLUDED.credibility_tier,
  primary_affiliation = EXCLUDED.primary_affiliation,
  notes = EXCLUDED.notes,
  sources = EXCLUDED.sources;

-- 13. Deborah Raji
INSERT INTO authors (name, header_affiliation, author_type, credibility_tier, primary_affiliation, notes, sources)
VALUES (
  'Deborah Raji',
  'Researcher, Mozilla / UC Berkeley',
  'Academic/Practitioner',
  'Thought Leader',
  'Mozilla Foundation; University of California',
  'Shows that commercial facial recognition misclassifies darker-skinned and female faces at much higher rates; pushes for bans on high-risk uses.',
  '[
    {"title": "Gender Shades", "type": "Research", "year": "2018", "url": "https://www.gendershades.org"},
    {"title": "Actionable Auditing", "type": "Paper", "year": "2019", "url": "https://dl.acm.org/doi/10.1145/3306618.3314244"},
    {"title": "Mozilla Foundation", "type": "Organization", "year": "2024", "url": "https://foundation.mozilla.org/"}
  ]'::jsonb
) ON CONFLICT (name) DO UPDATE SET
  header_affiliation = EXCLUDED.header_affiliation,
  author_type = EXCLUDED.author_type,
  credibility_tier = EXCLUDED.credibility_tier,
  primary_affiliation = EXCLUDED.primary_affiliation,
  notes = EXCLUDED.notes,
  sources = EXCLUDED.sources;

-- 14. Daron Acemoglu
INSERT INTO authors (name, header_affiliation, author_type, credibility_tier, primary_affiliation, notes, sources)
VALUES (
  'Daron Acemoglu',
  'Professor of Economics, MIT',
  'Academic',
  'Thought Leader',
  'Massachusetts Institute of Technology',
  'Argues that excessive automation can enrich capital while undermining labor unless institutions push toward ''shared prosperity'' applications.',
  '[
    {"title": "Power and Progress", "type": "Book", "year": "2023", "url": "https://press.princeton.edu/books/hardcover/9780300256684/power-and-progress"},
    {"title": "The Turing Trap", "type": "Paper", "year": "2021", "url": "https://www.nber.org/papers/w28257"},
    {"title": "MIT Economics Profile", "type": "Academic", "year": "2024", "url": "https://economics.mit.edu/faculty/acemoglu"}
  ]'::jsonb
) ON CONFLICT (name) DO UPDATE SET
  header_affiliation = EXCLUDED.header_affiliation,
  author_type = EXCLUDED.author_type,
  credibility_tier = EXCLUDED.credibility_tier,
  primary_affiliation = EXCLUDED.primary_affiliation,
  notes = EXCLUDED.notes,
  sources = EXCLUDED.sources;

-- 15. Cassie Kozyrkov
INSERT INTO authors (name, header_affiliation, author_type, credibility_tier, primary_affiliation, notes, sources)
VALUES (
  'Cassie Kozyrkov',
  'CEO, Kozyr; former Chief Decision Scientist, Google',
  'Practitioner',
  'Thought Leader',
  'Kozyr (formerly Data Scientific); ex-Google',
  'Founded ''decision intelligence''; argues the bottleneck is not AI answers but human decision-making: framing questions, clarifying values.',
  '[
    {"title": "The First Thing Great Decision Makers Do", "type": "Article", "year": "2019", "url": "https://hbr.org/2019/07/the-first-thing-great-decision-makers-do"},
    {"title": "Kozyr", "type": "Company", "year": "2024", "url": "https://www.kozyr.com"},
    {"title": "Making Friends with Machine Learning", "type": "Course", "year": "2022", "url": "https://www.youtube.com/playlist?list=PLRKtJ4IpxJpDxl0NTvNYQWKCYzHNuy2xG"}
  ]'::jsonb
) ON CONFLICT (name) DO UPDATE SET
  header_affiliation = EXCLUDED.header_affiliation,
  author_type = EXCLUDED.author_type,
  credibility_tier = EXCLUDED.credibility_tier,
  primary_affiliation = EXCLUDED.primary_affiliation,
  notes = EXCLUDED.notes,
  sources = EXCLUDED.sources;

-- 16. Daphne Koller
INSERT INTO authors (name, header_affiliation, author_type, credibility_tier, primary_affiliation, notes, sources)
VALUES (
  'Daphne Koller',
  'CEO, insitro; co-founder, Coursera',
  'Academic/Practitioner',
  'Seminal Thinker',
  'insitro; formerly Stanford University',
  'Pioneered probabilistic modeling and translated it into education and biotech; treats AI as a rigorous tool for solving hard real-world problems.',
  '[
    {"title": "Probabilistic Graphical Models", "type": "Course", "year": "2012", "url": "https://www.coursera.org/specializations/probabilistic-graphical-models"},
    {"title": "insitro", "type": "Company", "year": "2024", "url": "https://www.insitro.com"},
    {"title": "Stanford Profile", "type": "Academic", "year": "2024", "url": "https://profiles.stanford.edu/daphne-koller"}
  ]'::jsonb
) ON CONFLICT (name) DO UPDATE SET
  header_affiliation = EXCLUDED.header_affiliation,
  author_type = EXCLUDED.author_type,
  credibility_tier = EXCLUDED.credibility_tier,
  primary_affiliation = EXCLUDED.primary_affiliation,
  notes = EXCLUDED.notes,
  sources = EXCLUDED.sources;

-- 17. Nat Friedman
INSERT INTO authors (name, header_affiliation, author_type, credibility_tier, primary_affiliation, notes, sources)
VALUES (
  'Nat Friedman',
  'Former CEO, GitHub; AI investor',
  'Industry Leader',
  'Thought Leader',
  'NFDG (investment fund); ex-GitHub',
  'Champion of developer-centric AI tooling and open-source ecosystems; sees AI as a new general-purpose platform similar to the internet.',
  '[
    {"title": "Introducing GitHub Copilot", "type": "Blog", "year": "2021", "url": "https://github.blog/2021-06-29-introducing-github-copilot-ai-powered-pair-programmer"},
    {"title": "Personal Website", "type": "Website", "year": "2024", "url": "https://nat.org"},
    {"title": "AI Investments", "type": "Portfolio", "year": "2024", "url": "https://nfdg.com"}
  ]'::jsonb
) ON CONFLICT (name) DO UPDATE SET
  header_affiliation = EXCLUDED.header_affiliation,
  author_type = EXCLUDED.author_type,
  credibility_tier = EXCLUDED.credibility_tier,
  primary_affiliation = EXCLUDED.primary_affiliation,
  notes = EXCLUDED.notes,
  sources = EXCLUDED.sources;

-- 18. Patrick Collison
INSERT INTO authors (name, header_affiliation, author_type, credibility_tier, primary_affiliation, notes, sources)
VALUES (
  'Patrick Collison',
  'Co-founder and CEO, Stripe',
  'Industry Leader',
  'Thought Leader',
  'Stripe',
  'Argues society should be more ambitious about speeding up scientific and technological progress, including AI, while improving state capacity.',
  '[
    {"title": "We Need a New Science of Progress", "type": "Essay", "year": "2019", "url": "https://patrickcollison.com/progress"},
    {"title": "Fast Grants", "type": "Initiative", "year": "2020", "url": "https://fastgrants.org/"},
    {"title": "Patrick Collison Personal Site", "type": "Website", "year": "2024", "url": "https://patrickcollison.com"}
  ]'::jsonb
) ON CONFLICT (name) DO UPDATE SET
  header_affiliation = EXCLUDED.header_affiliation,
  author_type = EXCLUDED.author_type,
  credibility_tier = EXCLUDED.credibility_tier,
  primary_affiliation = EXCLUDED.primary_affiliation,
  notes = EXCLUDED.notes,
  sources = EXCLUDED.sources;

-- 19. Emad Mostaque
INSERT INTO authors (name, header_affiliation, author_type, credibility_tier, primary_affiliation, notes, sources)
VALUES (
  'Emad Mostaque',
  'Founder, Stability AI',
  'Industry Leader',
  'Thought Leader',
  'Stability AI (founder)',
  'Promoted the idea that powerful generative models should be widely accessible via open weights, arguing this democratises creativity.',
  '[
    {"title": "Stable Diffusion Public Release", "type": "Blog", "year": "2022", "url": "https://stability.ai/blog/stable-diffusion-public-release"},
    {"title": "Stability AI", "type": "Company", "year": "2024", "url": "https://stability.ai"},
    {"title": "Stable Diffusion", "type": "Model", "year": "2022", "url": "https://github.com/CompVis/stable-diffusion"}
  ]'::jsonb
) ON CONFLICT (name) DO UPDATE SET
  header_affiliation = EXCLUDED.header_affiliation,
  author_type = EXCLUDED.author_type,
  credibility_tier = EXCLUDED.credibility_tier,
  primary_affiliation = EXCLUDED.primary_affiliation,
  notes = EXCLUDED.notes,
  sources = EXCLUDED.sources;

-- 20. Percy Liang
INSERT INTO authors (name, header_affiliation, author_type, credibility_tier, primary_affiliation, notes, sources)
VALUES (
  'Percy Liang',
  'Associate Professor, Stanford; Director, CRFM',
  'Academic',
  'Seminal Thinker',
  'Stanford University; Stanford HAI',
  'Leads systematic study of foundation models, emphasising rigorous evaluation across capabilities, harms, and societal impact.',
  '[
    {"title": "On the Opportunities and Risks of Foundation Models", "type": "Report", "year": "2021", "url": "https://crfm.stanford.edu/report.html"},
    {"title": "HELM: Holistic Evaluation of Language Models", "type": "Benchmark", "year": "2022", "url": "https://crfm.stanford.edu/helm/latest/"},
    {"title": "Stanford HAI", "type": "Institute", "year": "2024", "url": "https://hai.stanford.edu"}
  ]'::jsonb
) ON CONFLICT (name) DO UPDATE SET
  header_affiliation = EXCLUDED.header_affiliation,
  author_type = EXCLUDED.author_type,
  credibility_tier = EXCLUDED.credibility_tier,
  primary_affiliation = EXCLUDED.primary_affiliation,
  notes = EXCLUDED.notes,
  sources = EXCLUDED.sources;

-- Add unique constraint on name if not exists (for ON CONFLICT to work)
-- Run this first if you get an error:
-- ALTER TABLE authors ADD CONSTRAINT authors_name_unique UNIQUE (name);
