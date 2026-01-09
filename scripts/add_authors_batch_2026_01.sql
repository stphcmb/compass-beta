-- Author Database Addition: January 2026 Batch
-- Focus: Future of Work (Displacement Realist), AI Governance, Enterprise AI, Emerging Topics
-- Total: 30+ new authors and enrichments

BEGIN;

-- ============================================================
-- SECTION 1: NEW AUTHORS (18 authors)
-- ============================================================

-- 1. Simon Johnson - MIT Nobel Laureate, AI & Workers
INSERT INTO authors (name, primary_affiliation, header_affiliation, notes, credibility_tier, author_type, sources, key_quote, quote_source_url)
VALUES (
  'Simon Johnson',
  'MIT Sloan School of Management, Professor',
  'MIT',
  '2024 Nobel Prize winner in Economics (with Acemoglu and Robinson). Co-director of MIT''s Shaping the Future of Work Initiative. His research shows technology can be pro-worker or pro-automation depending on policy choices.',
  'Pioneer',
  'Academic',
  '[
    {"url": "https://shapingwork.mit.edu/", "type": "Research", "year": "2024", "title": "MIT Shaping the Future of Work Initiative"},
    {"url": "https://www.nobelprize.org/prizes/economic-sciences/2024/johnson/facts/", "type": "Organization", "year": "2024", "title": "Nobel Prize in Economics 2024"},
    {"url": "https://www.amazon.com/Power-Progress-Thousand-Year-Technology-Prosperity/dp/1541702530", "type": "Book", "year": "2023", "title": "Power and Progress: Our Thousand-Year Struggle Over Technology and Prosperity"}
  ]'::jsonb,
  'AI could either empower people with a lot of education, make them more highly skilled, enable them to do more tasks and get more pay. Or it could be another massive wave of automation that pushes the remnants of the middle down to the bottom. We have not generated enough new good jobs, jobs where you actually get paid good money and you can live well, and we have got to do better on that.',
  'https://news.mit.edu/news-clip/marketplace-39'
);

-- 2. Michael Osborne - Oxford, Future of Employment
INSERT INTO authors (name, primary_affiliation, header_affiliation, notes, credibility_tier, author_type, sources, key_quote, quote_source_url)
VALUES (
  'Michael Osborne',
  'University of Oxford, Professor of Machine Learning',
  'Oxford',
  'Co-author of the landmark 2013 study "The Future of Employment" estimating 47% of US jobs at risk of automation. Co-director of Oxford''s Programme on Technology and Employment. His 2024 reappraisal shows AI will transform jobs rather than eliminate them.',
  'Field Leader',
  'Academic',
  '[
    {"url": "https://www.oxfordmartin.ox.ac.uk/people/michael-osborne/", "type": "Organization", "year": "2024", "title": "Oxford Martin School Profile"},
    {"url": "https://robots.ox.ac.uk/~mosb/public/pdf/3329/Frey%20and%20Osborne%20-%202024%20-%20Generative%20AI%20and%20the%20future%20of%20work%20a%20reappraisa.pdf", "type": "Paper", "year": "2024", "title": "Generative AI and the Future of Work: A Reappraisal"},
    {"url": "https://www.mindfoundry.ai/", "type": "Organization", "year": "2024", "title": "Mind Foundry (Co-founder)"}
  ]'::jsonb,
  'AI will continue to surprise us, and many jobs may be automated. However, in the absence of major breakthroughs, we also expect the bottlenecks we outline in our 2013 paper to continue to constrain our automation possibilities for the foreseeable future. Remote jobs are more likely to be automated, while AI will increase the value of in-person communication skills.',
  'https://www.oii.ox.ac.uk/news-events/generative-ai-has-potential-to-disrupt-labour-markets-but-is-not-likely-to-cause-widespread-automation-and-job-displacement-say-oxford-ai-experts/'
);

-- 3. Daniel Susskind - Oxford/KCL, Future of Work
INSERT INTO authors (name, primary_affiliation, header_affiliation, notes, credibility_tier, author_type, sources, key_quote, quote_source_url)
VALUES (
  'Daniel Susskind',
  'King''s College London, Research Professor; Oxford University, Senior Research Associate',
  'Oxford/KCL',
  'Economist and author exploring AI''s impact on work. His book "Growth: A Reckoning" was chosen by President Obama as a Favourite Book of 2024 and was runner-up for FT Business Book of the Year.',
  'Field Leader',
  'Academic',
  '[
    {"url": "https://www.danielsusskind.com/", "type": "Website", "year": "2024", "title": "Daniel Susskind Official Site"},
    {"url": "https://www.amazon.com/World-Without-Work-Technology-Automation/dp/0241321093", "type": "Book", "year": "2020", "title": "A World Without Work"},
    {"url": "https://www.amazon.com/Growth-Reckoning-Daniel-Susskind/dp/0241557658", "type": "Book", "year": "2024", "title": "Growth: A Reckoning"}
  ]'::jsonb,
  'Machines no longer need to think like us in order to outperform us. As a result, more and more tasks that used to be far beyond the capability of computers - from diagnosing illnesses to drafting legal contracts - are coming within their reach. The substituting force is gathering strength and will at some point overwhelm the complementing force.',
  'https://www.danielsusskind.com/'
);

-- 4. Katja Grace - AI Impacts, Forecasting
INSERT INTO authors (name, primary_affiliation, header_affiliation, notes, credibility_tier, author_type, sources, key_quote, quote_source_url)
VALUES (
  'Katja Grace',
  'AI Impacts, Lead Researcher',
  'AI Impacts',
  'Researcher focused on AI forecasting and existential risk. Her 2024 survey of 2,700+ AI researchers is the largest of its kind. Named to TIME''s 100 Most Influential People in AI 2024.',
  'Domain Expert',
  'Researcher',
  '[
    {"url": "https://aiimpacts.org/", "type": "Organization", "year": "2024", "title": "AI Impacts"},
    {"url": "https://arxiv.org/abs/1705.08807", "type": "Paper", "year": "2017", "title": "When Will AI Exceed Human Performance?"},
    {"url": "https://time.com/7012879/katja-grace/", "type": "Website", "year": "2024", "title": "TIME 100 Most Influential in AI"}
  ]'::jsonb,
  'Policy decisions are implicitly bets about the future, and on a topic like this one, the stakes might be our lives or livelihoods. So even if the topic is hard to predict well, isn''t it better to predict it as well as we can than to play with our eyes closed? I would be very surprised if it was somehow impossible to have AI that was substantially better than any given human at any given task.',
  'https://80000hours.org/podcast/episodes/katja-grace-forecasting-technology/'
);

-- 5. Molly Kinder - Brookings, Future of Work
INSERT INTO authors (name, primary_affiliation, header_affiliation, notes, credibility_tier, author_type, sources, key_quote, quote_source_url)
VALUES (
  'Molly Kinder',
  'Brookings Institution, David M. Rubenstein Fellow',
  'Brookings',
  'Researcher at Brookings focusing on workforce policy, labor markets, and the impact of technology on workers. Her research examines how AI affects frontline workers and what policies can help workers adapt.',
  'Domain Expert',
  'Policy Expert',
  '[
    {"url": "https://www.brookings.edu/people/molly-kinder/", "type": "Organization", "year": "2024", "title": "Brookings Profile"},
    {"url": "https://www.brookings.edu/articles/how-ai-will-transform-work/", "type": "Research", "year": "2024", "title": "How AI Will Transform Work"},
    {"url": "https://www.brookings.edu/articles/ai-and-the-future-of-work-in-america/", "type": "Research", "year": "2024", "title": "AI and the Future of Work in America"}
  ]'::jsonb,
  'The workers most exposed to AI disruption are often the least prepared for it. We need policies that help workers adapt - not just through retraining programs, but through portable benefits, stronger safety nets, and workplace voice in how AI gets deployed.',
  'https://www.brookings.edu/articles/how-ai-will-transform-work/'
);

-- 6. Anu Madgavkar - McKinsey, AI & Workforce
INSERT INTO authors (name, primary_affiliation, header_affiliation, notes, credibility_tier, author_type, sources, key_quote, quote_source_url)
VALUES (
  'Anu Madgavkar',
  'McKinsey Global Institute, Partner',
  'McKinsey',
  'Partner at McKinsey Global Institute leading research on AI, automation, and the future of work. Her research finds AI could automate 57% of work hours but success requires human-AI partnership and organizational redesign.',
  'Domain Expert',
  'Researcher',
  '[
    {"url": "https://www.mckinsey.com/our-people/anu-madgavkar", "type": "Organization", "year": "2024", "title": "McKinsey Profile"},
    {"url": "https://www.mckinsey.com/mgi/our-research/agents-robots-and-us-skill-partnerships-in-the-age-of-ai", "type": "Research", "year": "2025", "title": "Agents, Robots, and Us"},
    {"url": "https://www.mckinsey.com/mgi/our-research/generative-ai-and-the-future-of-work-in-america", "type": "Research", "year": "2023", "title": "Generative AI and the Future of Work in America"}
  ]'::jsonb,
  'Integrating AI will not be a simple technology rollout but a reimagining of work itself. Redesigning processes, roles, skills, culture, and metrics so people, agents, and robots create more value together. Even as AI automates many tasks, companies that invest in human skills will gain a competitive edge.',
  'https://www.mckinsey.com/mgi/our-research/agents-robots-and-us-skill-partnerships-in-the-age-of-ai'
);

-- 7. Lareina Yee - McKinsey, Women in AI/Tech
INSERT INTO authors (name, primary_affiliation, header_affiliation, notes, credibility_tier, author_type, sources, key_quote, quote_source_url)
VALUES (
  'Lareina Yee',
  'McKinsey & Company, Senior Partner; McKinsey Global Institute, Director of Technology Research',
  'McKinsey',
  'Director of technology research at McKinsey Global Institute and former Chief Diversity Officer. Leads research on AI adoption, workforce transformation, and women in the workplace.',
  'Domain Expert',
  'Executive',
  '[
    {"url": "https://www.mckinsey.com/our-people/lareina-yee", "type": "Organization", "year": "2024", "title": "McKinsey Profile"},
    {"url": "https://www.mckinsey.com/featured-insights/diversity-and-inclusion/women-in-the-workplace", "type": "Research", "year": "2024", "title": "Women in the Workplace 2024"},
    {"url": "https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-top-trends-in-tech", "type": "Research", "year": "2024", "title": "McKinsey Technology Trends 2024"}
  ]'::jsonb,
  'Women will experience even more dramatic shifts in job opportunities and expectations than men, as AI and automation are set to disrupt the fields where they have greater representation. Roles in nursing, education, marketing, communications, sales, and customer service face significant transformation. We need to encourage more girls to choose careers in STEM.',
  'https://katiecouric.com/lifestyle/workplace/career-growth-ai-automation-karlie-kloss-lareina-yee/'
);

-- 8. Richard Socher - You.com, AI Search
INSERT INTO authors (name, primary_affiliation, header_affiliation, notes, credibility_tier, author_type, sources, key_quote, quote_source_url)
VALUES (
  'Richard Socher',
  'You.com, CEO & Co-founder; AIX Ventures, Managing Director',
  'You.com',
  'Former Chief Scientist at Salesforce. Pioneer in NLP research with over 215,000 citations. Fourth most-cited researcher in NLP. Building AI-powered search that prioritizes accuracy over hype.',
  'Field Leader',
  'Industry Leader',
  '[
    {"url": "https://you.com/", "type": "Website", "year": "2024", "title": "You.com"},
    {"url": "https://www.socher.org/", "type": "Website", "year": "2024", "title": "Richard Socher Personal Site"},
    {"url": "https://aix.vc/", "type": "Organization", "year": "2024", "title": "AIX Ventures"}
  ]'::jsonb,
  'Many companies that started around ChatGPT said ''Oh, it''s all in the LLM.'' But really, the LLM is this summarization reasoning layer, and you need to have a search engine that feeds it information. We have actually built an accurate search engine, too, and that''s half the battle. For folks whose careers depend on accurate answers, they usually come to You.com.',
  'https://www.fastcompany.com/91230536/you-com-founder-richard-sochers-plan-to-win-the-ai-search-wars'
);

-- 9. Nathan Benaich - State of AI Report, Investor
INSERT INTO authors (name, primary_affiliation, header_affiliation, notes, credibility_tier, author_type, sources, key_quote, quote_source_url)
VALUES (
  'Nathan Benaich',
  'Air Street Capital, Founder & General Partner',
  'Air Street Capital',
  'Publisher of the annual State of AI Report, the most widely read analysis of AI developments since 2018. Investor in AI-first companies including Mapillary (acquired by Meta), Graphcore, and Tractable.',
  'Field Leader',
  'Investor',
  '[
    {"url": "https://www.stateof.ai/", "type": "Research", "year": "2025", "title": "State of AI Report"},
    {"url": "https://airstreet.com/", "type": "Organization", "year": "2024", "title": "Air Street Capital"},
    {"url": "https://nathanbenaich.substack.com/", "type": "Blog", "year": "2024", "title": "State of AI Newsletter"}
  ]'::jsonb,
  'We''re now beginning to see a split among AI-first start-ups. The biggest model builders are now seeing real revenues to match their soaring valuations, while some buzzier start-ups'' multi-billion dollar valuations can seem more vibes-driven. If you''d just bought NVDA stock instead of its challengers, you''d be up 12x vs. 2x.',
  'https://www.stateof.ai/'
);

-- 10. Toby Ord - Oxford, Existential Risk
INSERT INTO authors (name, primary_affiliation, header_affiliation, notes, credibility_tier, author_type, sources, key_quote, quote_source_url)
VALUES (
  'Toby Ord',
  'University of Oxford, Senior Researcher in AI Governance; Future of Humanity Institute',
  'Oxford',
  'Philosopher focused on existential risk. Founder of Giving What We Can and key figure in effective altruism. Author of "The Precipice." Estimates AI poses a 1 in 10 existential risk this century - higher than all other sources combined.',
  'Field Leader',
  'Academic',
  '[
    {"url": "https://www.tobyord.com/", "type": "Website", "year": "2024", "title": "Toby Ord Personal Site"},
    {"url": "https://www.amazon.com/Precipice-Existential-Risk-Future-Humanity/dp/0316484911", "type": "Book", "year": "2020", "title": "The Precipice"},
    {"url": "https://www.fhi.ox.ac.uk/", "type": "Organization", "year": "2024", "title": "Future of Humanity Institute"}
  ]'::jsonb,
  'We live during the most important era of human history. In the twentieth century, we developed the means to destroy ourselves - without developing the moral framework to ensure we won''t. We are experiencing an unsustainable level of risk - either we destroy ourselves or we build institutions to manage it. We spend less on securing our long-term potential than we do on ice cream.',
  'https://www.nti.org/risky-business/nti-seminar-philosopher-toby-ord-existential-risk-and-future-humanity/'
);

-- 11. Pascale Fung - HKUST/Meta, AI Ethics
INSERT INTO authors (name, primary_affiliation, header_affiliation, notes, credibility_tier, author_type, sources, key_quote, quote_source_url)
VALUES (
  'Pascale Fung',
  'Meta, Senior Director of AI Research; Hong Kong University of Science & Technology, Chair Professor',
  'Meta/HKUST',
  'Fellow of IEEE, ACL, AAAI, and ISCA. Founding Director of HKUST Centre for AI Research. Expert on World Economic Forum''s Global Future Council since 2016. Named Forbes Asia 2024 leader.',
  'Field Leader',
  'Academic',
  '[
    {"url": "https://pascale.home.ece.ust.hk/", "type": "Website", "year": "2024", "title": "Pascale Fung Lab"},
    {"url": "https://ai.meta.com/", "type": "Organization", "year": "2024", "title": "Meta AI Research"},
    {"url": "https://www.weforum.org/agenda/authors/pascale-fung/", "type": "Website", "year": "2024", "title": "WEF Contributor Profile"}
  ]'::jsonb,
  'We are building algorithms to control algorithms because they are human-built. These language models did not drop to us from some alien being. We built them. We can control them. We need to ask ourselves more about WHY we are creating AI technology not just HOW. We should not lose sight of the greater purpose of technology to serve humankind.',
  'https://www.carnegiecouncil.org/media/series/aiei/20220329-code-empathy-pascale-fung'
);

-- 12. Chelsea Finn - Stanford, Robotics
INSERT INTO authors (name, primary_affiliation, header_affiliation, notes, credibility_tier, author_type, sources, key_quote, quote_source_url)
VALUES (
  'Chelsea Finn',
  'Stanford University, Assistant Professor; Physical Intelligence, Co-founder',
  'Stanford/Pi',
  'Pioneer in robot learning and meta-learning. Co-founder of Physical Intelligence, building foundation models for robotics. Her IRIS lab studies intelligence through robotic interaction at scale.',
  'Field Leader',
  'Academic',
  '[
    {"url": "https://ai.stanford.edu/~cbfinn/", "type": "Website", "year": "2024", "title": "Chelsea Finn Lab"},
    {"url": "https://physicalintelligence.company/", "type": "Organization", "year": "2024", "title": "Physical Intelligence"},
    {"url": "https://scholar.google.com/citations?user=vfPE6hgAAAAJ", "type": "Research", "year": "2024", "title": "Google Scholar Profile"}
  ]'::jsonb,
  'In research you''re really trying to solve problems that no one has solved before, so you have to persevere and when things aren''t working then you come up with new ideas and move on, keep on trying. Our mission at Physical Intelligence is to develop a model that can allow a robot to be able to perform any task in whatever environment it is in.',
  'https://www.sednacg.com/post/influential-women-in-ai-what-is-chelsea-finn-known-for'
);

-- 13. Sergey Levine - UC Berkeley, Reinforcement Learning
INSERT INTO authors (name, primary_affiliation, header_affiliation, notes, credibility_tier, author_type, sources, key_quote, quote_source_url)
VALUES (
  'Sergey Levine',
  'UC Berkeley, Associate Professor; Physical Intelligence, Co-founder',
  'Berkeley/Pi',
  'Leading researcher in deep reinforcement learning with over 217,000 citations. Co-founder of Physical Intelligence. His algorithms enable robots to learn complex behaviors from experience.',
  'Field Leader',
  'Academic',
  '[
    {"url": "https://people.eecs.berkeley.edu/~svlevine/", "type": "Website", "year": "2024", "title": "Sergey Levine Lab"},
    {"url": "https://physicalintelligence.company/", "type": "Organization", "year": "2024", "title": "Physical Intelligence"},
    {"url": "https://rail.eecs.berkeley.edu/deeprlcourse/", "type": "Research", "year": "2024", "title": "Deep RL Course"}
  ]'::jsonb,
  'In science, it is a really good idea to sometimes see how extreme a design can still work because you learn a lot from doing that. Our goal is to develop foundation models and learning algorithms to power the robots of today and the physically-actuated devices of the future.',
  'https://imbue.com/podcast/2023-03-01-podcast-episode-28-sergey-levine/'
);

-- 14. James Manyika - Google, AI Research
INSERT INTO authors (name, primary_affiliation, header_affiliation, notes, credibility_tier, author_type, sources, key_quote, quote_source_url)
VALUES (
  'James Manyika',
  'Google, Senior Vice President of Research, Technology and Society; DeepMind, Fellow',
  'Google',
  'Former McKinsey Global Institute director. Co-chair of UN High-Level Advisory Body on AI. Rhodes Scholar with D.Phil in AI and Robotics from Oxford. Named to TIME''s 100 Most Influential People in AI.',
  'Pioneer',
  'Executive',
  '[
    {"url": "https://blog.google/inside-google/google-executives/james-manyika/", "type": "Website", "year": "2024", "title": "Google Profile"},
    {"url": "https://www.un.org/en/ai-advisory-body", "type": "Organization", "year": "2024", "title": "UN AI Advisory Body"},
    {"url": "https://blog.google/technology/ai/a-new-era-of-discovery/", "type": "Blog", "year": "2024", "title": "A New Era of Discovery"}
  ]'::jsonb,
  'Right now, everyone from my old colleagues at McKinsey to Goldman Sachs are putting out these extraordinary economic potential numbers - in the trillions - but the productivity gains are not guaranteed. They''re going to take a lot of work. We could have a version of the Solow paradox - where we see this technology everywhere, but it''s done nothing to transform the economy in that real fundamental way.',
  'https://tech.slashdot.org/story/24/09/02/1633202/googles-james-manyika-the-productivity-gains-from-ai-are-not-guaranteed'
);

-- 15. Daryl Plummer - Gartner, Enterprise AI
INSERT INTO authors (name, primary_affiliation, header_affiliation, notes, credibility_tier, author_type, sources, key_quote, quote_source_url)
VALUES (
  'Daryl Plummer',
  'Gartner, Distinguished VP Analyst, Chief of Research & Gartner Fellow',
  'Gartner',
  'Chief of Research at Gartner leading strategic technology predictions. Known for forward-looking analysis of how AI will transform enterprise IT and business strategy.',
  'Domain Expert',
  'Industry Leader',
  '[
    {"url": "https://www.gartner.com/en/experts/daryl-plummer", "type": "Organization", "year": "2024", "title": "Gartner Profile"},
    {"url": "https://www.gartner.com/en/articles/gartner-s-top-strategic-predictions-for-2024-and-beyond", "type": "Research", "year": "2024", "title": "Top Strategic Predictions 2024"},
    {"url": "https://www.gartner.com/en/newsroom/press-releases/2024-10-22-gartner-unveils-top-predictions-for-it-organizations-and-users-in-2025-and-beyond", "type": "Research", "year": "2024", "title": "Top Predictions 2025"}
  ]'::jsonb,
  'It is clear that no matter where we go, we cannot avoid the impact of AI. AI is evolving as human use of AI evolves. Through 2026, 20% of organizations will use AI to flatten their organizational structure, eliminating more than half of current middle management positions.',
  'https://www.gartner.com/en/newsroom/press-releases/2024-10-22-gartner-unveils-top-predictions-for-it-organizations-and-users-and-beyond'
);

-- 16. Shaun Maguire - Sequoia, AI Investment
INSERT INTO authors (name, primary_affiliation, header_affiliation, notes, credibility_tier, author_type, sources, key_quote, quote_source_url)
VALUES (
  'Shaun Maguire',
  'Sequoia Capital, Partner',
  'Sequoia',
  'Partner at Sequoia focused on AI and defense tech investments. Led investments in Stripe, Opendoor, and Lambda School at GV. Co-founded cybersecurity company Expanse (acquired by Palo Alto Networks for $800M+).',
  'Domain Expert',
  'Investor',
  '[
    {"url": "https://sequoiacap.com/people/shaun-maguire/", "type": "Organization", "year": "2024", "title": "Sequoia Profile"},
    {"url": "https://www.linkedin.com/in/shaun-maguire-c/", "type": "Website", "year": "2024", "title": "LinkedIn Profile"},
    {"url": "https://www.crunchbase.com/person/shaun-maguire", "type": "Website", "year": "2024", "title": "Crunchbase Profile"}
  ]'::jsonb,
  'If you look at the people that have led the biggest breakthroughs in AI from an algorithms perspective, quite a few are Israelis that live in America, like Ilya Sutskever and Noam Shazeer. The future of information warfare is AI. I like high-IQ founders. But even more important to me is someone that''s just irrationally motivated.',
  'https://www.calcalistech.com/ctechnews/article/skwsxeacxg'
);

-- 17. Shawn Wang (Swyx) - AI Engineer Concept
INSERT INTO authors (name, primary_affiliation, header_affiliation, notes, credibility_tier, author_type, sources, key_quote, quote_source_url)
VALUES (
  'Shawn Wang',
  'Latent Space, Founder; Smol AI, Founder',
  'Latent Space',
  'Coined the term "AI Engineer" to describe the new role bridging software engineering and AI. His Latent Space podcast is the largest AI engineering podcast, with listeners including Andreessen and Nadella.',
  'Domain Expert',
  'Public Intellectual',
  '[
    {"url": "https://www.swyx.io/", "type": "Website", "year": "2024", "title": "swyx Personal Site"},
    {"url": "https://www.latent.space/", "type": "Website", "year": "2024", "title": "Latent Space"},
    {"url": "https://smol.ai/", "type": "Organization", "year": "2024", "title": "Smol AI"}
  ]'::jsonb,
  'Even if you don''t have a Ph.D., even if you don''t have years of experience in machine learning, if you know how to wrangle an API, you should actually start taking a serious look because this is giving you new capabilities. AI engineering feels closer to software engineering than to ML engineering - it''s much more about building a product first.',
  'https://redmonk.com/blog/2025/07/23/shawn-swyx-wang-ai-engineer/'
);

-- 18. Daniel Kahneman - Nobel Laureate, Decision Making (Historical)
INSERT INTO authors (name, primary_affiliation, header_affiliation, notes, credibility_tier, author_type, sources, key_quote, quote_source_url)
VALUES (
  'Daniel Kahneman',
  'Princeton University, Professor Emeritus (1934-2024)',
  'Princeton',
  '2002 Nobel Prize winner in Economics. Pioneer of behavioral economics and author of "Thinking, Fast and Slow." His work on cognitive biases profoundly influenced AI development and human-AI decision making research.',
  'Pioneer',
  'Academic',
  '[
    {"url": "https://www.amazon.com/Thinking-Fast-Slow-Daniel-Kahneman/dp/0374533555", "type": "Book", "year": "2011", "title": "Thinking, Fast and Slow"},
    {"url": "https://www.nobelprize.org/prizes/economic-sciences/2002/kahneman/facts/", "type": "Organization", "year": "2002", "title": "Nobel Prize"},
    {"url": "https://www.amazon.com/Noise-Human-Judgment-Daniel-Kahneman/dp/0316451401", "type": "Book", "year": "2021", "title": "Noise: A Flaw in Human Judgment"}
  ]'::jsonb,
  'Algorithms are noise-free. People are not. When you put some data in front of an algorithm, you will always get the same response at the other end. The main characteristic of people is that they''re very noisy. You show them the same stimulus twice, they don''t give you the same response twice. It''s very difficult to imagine that with sufficient data there will remain things that only humans can do.',
  'https://www.aei.org/economics/nobel-laureate-daniel-kahneman-on-a-i-its-very-difficult-to-imagine-that-with-sufficient-data-there-will-remain-things-that-only-humans-can-do/'
);

-- ============================================================
-- SECTION 2: CAMP RELATIONSHIPS FOR NEW AUTHORS
-- ============================================================

DO $$
DECLARE
  simon_johnson_id uuid;
  michael_osborne_id uuid;
  daniel_susskind_id uuid;
  katja_grace_id uuid;
  molly_kinder_id uuid;
  anu_madgavkar_id uuid;
  lareina_yee_id uuid;
  richard_socher_id uuid;
  nathan_benaich_id uuid;
  toby_ord_id uuid;
  pascale_fung_id uuid;
  chelsea_finn_id uuid;
  sergey_levine_id uuid;
  james_manyika_id uuid;
  daryl_plummer_id uuid;
  shaun_maguire_id uuid;
  shawn_wang_id uuid;
  daniel_kahneman_id uuid;
BEGIN
  -- Get author IDs
  SELECT id INTO simon_johnson_id FROM authors WHERE name = 'Simon Johnson';
  SELECT id INTO michael_osborne_id FROM authors WHERE name = 'Michael Osborne';
  SELECT id INTO daniel_susskind_id FROM authors WHERE name = 'Daniel Susskind';
  SELECT id INTO katja_grace_id FROM authors WHERE name = 'Katja Grace';
  SELECT id INTO molly_kinder_id FROM authors WHERE name = 'Molly Kinder';
  SELECT id INTO anu_madgavkar_id FROM authors WHERE name = 'Anu Madgavkar';
  SELECT id INTO lareina_yee_id FROM authors WHERE name = 'Lareina Yee';
  SELECT id INTO richard_socher_id FROM authors WHERE name = 'Richard Socher';
  SELECT id INTO nathan_benaich_id FROM authors WHERE name = 'Nathan Benaich';
  SELECT id INTO toby_ord_id FROM authors WHERE name = 'Toby Ord';
  SELECT id INTO pascale_fung_id FROM authors WHERE name = 'Pascale Fung';
  SELECT id INTO chelsea_finn_id FROM authors WHERE name = 'Chelsea Finn';
  SELECT id INTO sergey_levine_id FROM authors WHERE name = 'Sergey Levine';
  SELECT id INTO james_manyika_id FROM authors WHERE name = 'James Manyika';
  SELECT id INTO daryl_plummer_id FROM authors WHERE name = 'Daryl Plummer';
  SELECT id INTO shaun_maguire_id FROM authors WHERE name = 'Shaun Maguire';
  SELECT id INTO shawn_wang_id FROM authors WHERE name = 'Shawn Wang';
  SELECT id INTO daniel_kahneman_id FROM authors WHERE name = 'Daniel Kahneman';

  -- CAMP MAPPINGS

  -- Simon Johnson: Future of Work (Displacement Realist + Human-AI Collaboration)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '76f0d8c5-c9a8-4a26-ae7e-18f787000e18', -- Displacement Realist
    simon_johnson_id,
    'strong',
    'We have not generated enough new good jobs, jobs where you actually get paid good money and you can live well, and we have got to do better on that. I think there''s a lot we can do on redirecting technological progress and pushing AI towards inventing things that are more useful to people and boost the productivity of particularly people with less education.',
    'https://news.mit.edu/news-clip/marketplace-39',
    'As a 2024 Nobel laureate in economics, Johnson''s research on institutions and technology provides rigorous empirical evidence that AI''s impact depends on policy choices. His work shows technology can be designed to be pro-worker rather than purely labor-saving.'
  ) ON CONFLICT (camp_id, author_id) DO NOTHING;

  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'd8d3cec4-f8ce-49b1-9a43-bb0d952db371', -- Human-AI Collaboration
    simon_johnson_id,
    'strong',
    'Our reading of history is that technology is neither good nor bad for people - it depends on how you use it. You can have a pro-worker vision of technology, or you can have a vision where only the abbot or people close to the king do well when the water wheel is invented.',
    'https://phys.org/news/2024-10-dont-tech-gurus-future-nobel.html',
    'Johnson''s historical analysis demonstrates that periods of greatest prosperity occurred when technology complemented workers rather than replaced them. His Nobel-winning research provides the academic foundation for human-AI collaboration policies.'
  ) ON CONFLICT (camp_id, author_id) DO NOTHING;

  -- Michael Osborne: Displacement Realist
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '76f0d8c5-c9a8-4a26-ae7e-18f787000e18', -- Displacement Realist
    michael_osborne_id,
    'strong',
    'A key bottleneck to the automation of perception and mobility tasks is that we can''t accept mistakes. Yet foundation models based on deep neural networks have the capacity to create plenty of mistakes. For now, deployment of generative AI will be confined to lower stakes activities where engineers can redesign and simplify the environment.',
    'https://www.oii.ox.ac.uk/news-events/generative-ai-has-potential-to-disrupt-labour-markets-but-is-not-likely-to-cause-widespread-automation-and-job-displacement-say-oxford-ai-experts/',
    'Co-author of the landmark 47% automation study, Osborne''s 2024 reappraisal provides crucial nuance: generative AI expands automation scope but faces fundamental bottlenecks. His research shows remote jobs face higher risk while in-person skills gain value.'
  ) ON CONFLICT (camp_id, author_id) DO NOTHING;

  -- Daniel Susskind: Displacement Realist
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '76f0d8c5-c9a8-4a26-ae7e-18f787000e18', -- Displacement Realist
    daniel_susskind_id,
    'strong',
    'Machines no longer need to think like us in order to outperform us. More and more tasks that used to be far beyond the capability of computers - from diagnosing illnesses to drafting legal contracts - are coming within their reach. The substituting force is gathering strength and will at some point overwhelm the complementing force.',
    'https://www.danielsusskind.com/',
    'Susskind challenges the comfortable assumption that humans will always find new work. His argument that machines can excel without human-like cognition forces us to confront the possibility that complementarity may eventually fail as a strategy.'
  ) ON CONFLICT (camp_id, author_id) DO NOTHING;

  -- Katja Grace: Safety First
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '7f64838f-59a6-4c87-8373-a023b9f448cc', -- Safety First
    katja_grace_id,
    'strong',
    'I would be very surprised if it was somehow impossible to have AI that was substantially better than any given human at any given task. Policy decisions are implicitly bets about the future, and on a topic like this one, the stakes might be our lives or livelihoods.',
    'https://80000hours.org/podcast/episodes/katja-grace-forecasting-technology/',
    'Grace''s 2024 survey of 2,700+ AI researchers provides the most comprehensive data on expert timelines and risk assessments. Her forecasting work grounds safety discussions in empirical researcher sentiment rather than speculation.'
  ) ON CONFLICT (camp_id, author_id) DO NOTHING;

  -- Molly Kinder: Displacement Realist + Human-AI Collaboration
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '76f0d8c5-c9a8-4a26-ae7e-18f787000e18', -- Displacement Realist
    molly_kinder_id,
    'strong',
    'The workers most exposed to AI disruption are often the least prepared for it. We need policies that help workers adapt - not just through retraining programs, but through portable benefits, stronger safety nets, and workplace voice in how AI gets deployed.',
    'https://www.brookings.edu/articles/how-ai-will-transform-work/',
    'Kinder''s Brookings research focuses on frontline and low-wage workers who face the greatest AI displacement risk. Her policy-focused approach provides concrete recommendations for protecting vulnerable workers.'
  ) ON CONFLICT (camp_id, author_id) DO NOTHING;

  -- Anu Madgavkar: Human-AI Collaboration + Co-Evolution
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'd8d3cec4-f8ce-49b1-9a43-bb0d952db371', -- Human-AI Collaboration
    anu_madgavkar_id,
    'strong',
    'Integrating AI will not be a simple technology rollout but a reimagining of work itself. Redesigning processes, roles, skills, culture, and metrics so people, agents, and robots create more value together. Companies that invest in human skills will gain a competitive edge.',
    'https://www.mckinsey.com/mgi/our-research/agents-robots-and-us-skill-partnerships-in-the-age-of-ai',
    'McKinsey''s research leader on AI and work, Madgavkar''s "people, agents, and robots" framework captures how 57% of work hours could theoretically be automated but success requires organizational redesign and human skill investment.'
  ) ON CONFLICT (camp_id, author_id) DO NOTHING;

  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'f19021ab-a8db-4363-adec-c2228dad6298', -- Co-Evolution
    anu_madgavkar_id,
    'strong',
    'Capturing AI''s massive potential economic value - about $2.9 trillion in the U.S. by 2030 - depends entirely on human guidance and organizational redesign. Even as AI automates many tasks, companies that invest in human skills will gain a competitive edge.',
    'https://fortune.com/2025/11/25/why-ai-wont-take-your-job-partnership-agents-robots-mckinsey/',
    'Her research provides the business case for co-evolution: companies that treat AI as pure automation will fail to capture value. Success requires simultaneous investment in technology, people, and processes.'
  ) ON CONFLICT (camp_id, author_id) DO NOTHING;

  -- Lareina Yee: Human-AI Collaboration + Displacement Realist
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'd8d3cec4-f8ce-49b1-9a43-bb0d952db371', -- Human-AI Collaboration
    lareina_yee_id,
    'partial',
    'Women will experience even more dramatic shifts in job opportunities and expectations than men, as AI and automation are set to disrupt the fields where they have greater representation. We need to encourage more girls to choose careers in STEM.',
    'https://katiecouric.com/lifestyle/workplace/career-growth-ai-automation-karlie-kloss-lareina-yee/',
    'Yee brings a crucial equity lens to AI workforce transformation. Her research shows certain demographics face disproportionate disruption, requiring targeted policies and career pathways to ensure inclusive human-AI collaboration.'
  ) ON CONFLICT (camp_id, author_id) DO NOTHING;

  -- Richard Socher: Tech Builders
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'a076a4ce-f14c-47b5-ad01-c8c60135a494', -- Tech Builders
    richard_socher_id,
    'strong',
    'Many companies that started around ChatGPT said ''Oh, it''s all in the LLM.'' But really, the LLM is this summarization reasoning layer, and you need to have a search engine that feeds it information. We have actually built an accurate search engine, too, and that''s half the battle.',
    'https://www.fastcompany.com/91230536/you-com-founder-richard-sochers-plan-to-win-the-ai-search-wars',
    'As the fourth most-cited NLP researcher building You.com, Socher demonstrates that technical excellence matters: reliable AI requires robust retrieval systems, not just better language models. His focus on accuracy over hype defines the Tech Builders ethos.'
  ) ON CONFLICT (camp_id, author_id) DO NOTHING;

  -- Nathan Benaich: Innovation First + Scaling Will Deliver
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '331b2b02-7f8d-4751-b583-16255a6feb50', -- Innovation First
    nathan_benaich_id,
    'strong',
    'We''re now beginning to see a split among AI-first start-ups. The biggest model builders are now seeing real revenues to match their soaring valuations, while some buzzier start-ups'' valuations can seem more vibes-driven. Stripe data shows AI companies are scaling significantly quicker than peers.',
    'https://www.stateof.ai/',
    'The State of AI Report provides the most comprehensive annual analysis of AI progress. Benaich''s investor perspective cuts through hype to identify which innovations are delivering real value and which are vapor.'
  ) ON CONFLICT (camp_id, author_id) DO NOTHING;

  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'c5dcb027-cd27-4c91-adb4-aca780d15199', -- Scaling Will Deliver
    nathan_benaich_id,
    'partial',
    'If you''d just bought NVDA stock instead of its challengers, you''d be up 12x vs. 2x. All the capital invested in NVIDIA competitors would have performed far better for investors had they invested in NVIDIA itself.',
    'https://www.stateof.ai/',
    'Benaich''s analysis shows that scale continues to matter: NVIDIA''s dominance reflects how compute scale drives AI progress. His data-driven approach provides empirical grounding for scaling arguments.'
  ) ON CONFLICT (camp_id, author_id) DO NOTHING;

  -- Toby Ord: Safety First
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '7f64838f-59a6-4c87-8373-a023b9f448cc', -- Safety First
    toby_ord_id,
    'strong',
    'We live during the most important era of human history. In the twentieth century, we developed the means to destroy ourselves - without developing the moral framework to ensure we won''t. I estimate unaligned AI poses a 1 in 10 existential risk this century - higher than all other sources combined.',
    'https://www.nti.org/risky-business/nti-seminar-philosopher-toby-ord-existential-risk-and-future-humanity/',
    'Ord''s quantified risk estimates in "The Precipice" provide a framework for comparing AI risk to other existential threats. His 10% AI risk estimate is striking because it exceeds all other risks combined, demanding serious attention.'
  ) ON CONFLICT (camp_id, author_id) DO NOTHING;

  -- Pascale Fung: Safety First + Adaptive Governance
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '7f64838f-59a6-4c87-8373-a023b9f448cc', -- Safety First
    pascale_fung_id,
    'strong',
    'We are building algorithms to control algorithms because they are human-built. These language models did not drop to us from some alien being. We built them. We can control them. We need to ask ourselves more about WHY we are creating AI technology not just HOW.',
    'https://www.carnegiecouncil.org/media/series/aiei/20220329-code-empathy-pascale-fung',
    'As a senior AI research leader at Meta and adviser to EU, UAE, Japan, and US on AI governance, Fung bridges technical and policy worlds. Her "algorithms to control algorithms" framing provides a practical path to AI safety.'
  ) ON CONFLICT (camp_id, author_id) DO NOTHING;

  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'ee10cf4f-025a-47fc-be20-33d6756ec5cd', -- Adaptive Governance
    pascale_fung_id,
    'partial',
    'The cultural differences between China and Europe present a unique set of challenges when it comes to aligning AI ethics. We need to ask whether a global framework is possible while respecting local values.',
    'https://www.weforum.org/agenda/authors/pascale-fung/',
    'Fung''s cross-cultural research on AI ethics informs adaptive governance approaches. Her work on Confucian vs European ethics shows that effective AI governance must accommodate diverse values while maintaining core principles.'
  ) ON CONFLICT (camp_id, author_id) DO NOTHING;

  -- Chelsea Finn: Needs New Approaches
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '207582eb-7b32-4951-9863-32fcf05944a1', -- Needs New Approaches
    chelsea_finn_id,
    'strong',
    'Our mission at Physical Intelligence is to develop a model that can allow a robot to be able to perform any task in whatever environment it is in. We released pi0, a prototype model that enables the most capable and dexterous generalist robot policy to date.',
    'https://physicalintelligence.company/',
    'Finn''s work on robot foundation models represents a key frontier: applying the foundation model paradigm to embodied systems. Her research shows that pure language scaling is insufficient for physical world tasks.'
  ) ON CONFLICT (camp_id, author_id) DO NOTHING;

  -- Sergey Levine: Needs New Approaches + Tech Builders
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '207582eb-7b32-4951-9863-32fcf05944a1', -- Needs New Approaches
    sergey_levine_id,
    'strong',
    'Our goal is to develop foundation models and learning algorithms to power the robots of today and the physically-actuated devices of the future. In science, it is a really good idea to sometimes see how extreme a design can still work.',
    'https://imbue.com/podcast/2023-03-01-podcast-episode-28-sergey-levine/',
    'Levine''s 217,000+ citations reflect his fundamental contributions to deep reinforcement learning. His work on learning from real-world experience rather than simulation points toward approaches that may be necessary for embodied AI.'
  ) ON CONFLICT (camp_id, author_id) DO NOTHING;

  -- James Manyika: Co-Evolution + Adaptive Governance
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'f19021ab-a8db-4363-adec-c2228dad6298', -- Co-Evolution
    james_manyika_id,
    'strong',
    'The productivity gains from AI are not guaranteed. They''re going to take a lot of work. We could have a version of the Solow paradox - where we see this technology everywhere, but it''s done nothing to transform the economy in that real fundamental way.',
    'https://tech.slashdot.org/story/24/09/02/1633202/googles-james-manyika-the-productivity-gains-from-ai-are-not-guaranteed',
    'Manyika''s warning about the AI productivity paradox echoes his former McKinsey work. As Google''s SVP for Research, his message is striking: even the leading AI company recognizes that technology alone won''t deliver economic transformation.'
  ) ON CONFLICT (camp_id, author_id) DO NOTHING;

  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'ee10cf4f-025a-47fc-be20-33d6756ec5cd', -- Adaptive Governance
    james_manyika_id,
    'strong',
    'If we as a society are to set ourselves on the road to fully realizing the societal and economic potential of AI, then 2024 must be a year of action across sectors, disciplines, and geographic borders. Governing AI for Humanity requires international cooperation.',
    'https://fortune.com/2024/01/16/google-svp-tech-society-people-ai-disruption-james-manyika/',
    'As co-chair of the UN High-Level Advisory Body on AI, Manyika shapes global AI governance. His "Governing AI for Humanity" framework provides a blueprint for adaptive international cooperation on AI policy.'
  ) ON CONFLICT (camp_id, author_id) DO NOTHING;

  -- Daryl Plummer: Technology Leads + Displacement Realist
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '7e9a2196-71e7-423a-889c-6902bc678eac', -- Technology Leads
    daryl_plummer_id,
    'strong',
    'It is clear that no matter where we go, we cannot avoid the impact of AI. AI is evolving as human use of AI evolves. By 2028, 33% of enterprise software applications will incorporate agentic AI capabilities - up from less than 1% in 2024.',
    'https://www.gartner.com/en/newsroom/press-releases/2024-10-22-gartner-unveils-top-predictions-for-it-organizations-and-users-in-2025-and-beyond',
    'Gartner''s Chief of Research provides authoritative enterprise adoption forecasts that shape corporate strategy. His predictions on agentic AI integration set expectations for how technology will lead transformation.'
  ) ON CONFLICT (camp_id, author_id) DO NOTHING;

  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '76f0d8c5-c9a8-4a26-ae7e-18f787000e18', -- Displacement Realist
    daryl_plummer_id,
    'partial',
    'Through 2026, 20% of organizations will use AI to flatten their organizational structure, eliminating more than half of current middle management positions.',
    'https://www.gartner.com/en/newsroom/press-releases/2024-10-22-gartner-unveils-top-predictions-for-it-organizations-and-users-in-2025-and-beyond',
    'Plummer''s middle management displacement prediction is striking: AI may eliminate entire organizational layers, not just individual jobs. This structural displacement challenges assumptions about white-collar resilience.'
  ) ON CONFLICT (camp_id, author_id) DO NOTHING;

  -- Shaun Maguire: Innovation First + Scaling Will Deliver
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '331b2b02-7f8d-4751-b583-16255a6feb50', -- Innovation First
    shaun_maguire_id,
    'strong',
    'I like high-IQ founders. But even more important to me is someone that''s just irrationally motivated. For whatever reason, it''s their life mission to try to revolutionize the industry they''re going after. The future of information warfare is AI.',
    'https://www.calcalistech.com/ctechnews/article/skwsxeacxg',
    'As a Sequoia partner investing in frontier AI, Maguire represents the VC perspective that breakthrough innovation comes from backing exceptional founders with minimal regulatory friction. His defense tech focus shows AI''s strategic importance.'
  ) ON CONFLICT (camp_id, author_id) DO NOTHING;

  -- Shawn Wang: Human-AI Collaboration + Tech Builders
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'd8d3cec4-f8ce-49b1-9a43-bb0d952db371', -- Human-AI Collaboration
    shawn_wang_id,
    'strong',
    'Even if you don''t have a Ph.D., even if you don''t have years of experience in machine learning, if you know how to wrangle an API, you should actually start taking a serious look because this is giving you new capabilities.',
    'https://redmonk.com/blog/2025/07/23/shawn-swyx-wang-ai-engineer/',
    'Swyx''s "AI Engineer" concept defines a new role: software engineers who leverage AI tools without ML expertise. This democratization of AI capabilities exemplifies productive human-AI collaboration at the developer level.'
  ) ON CONFLICT (camp_id, author_id) DO NOTHING;

  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'a076a4ce-f14c-47b5-ad01-c8c60135a494', -- Tech Builders
    shawn_wang_id,
    'partial',
    'AI engineering feels closer to software engineering than to ML engineering. A big difference is that thanks to LLMs being easy to use, AI engineering is much more about building a product first - and later on, getting around to tweaking the model itself.',
    'https://newsletter.pragmaticengineer.com/p/ai-engineering-with-chip-huyen',
    'The AI Engineer concept shifts focus from model training to application building. This product-first approach makes AI accessible to the broader developer community, accelerating practical deployment.'
  ) ON CONFLICT (camp_id, author_id) DO NOTHING;

  -- Daniel Kahneman: Human-AI Collaboration
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'd8d3cec4-f8ce-49b1-9a43-bb0d952db371', -- Human-AI Collaboration
    daniel_kahneman_id,
    'strong',
    'Algorithms are noise-free. People are not. When you put some data in front of an algorithm, you will always get the same response at the other end. The main characteristic of people is that they''re very noisy. You show them the same stimulus twice, they don''t give you the same response twice.',
    'https://www.aei.org/economics/nobel-laureate-daniel-kahneman-on-a-i-its-very-difficult-to-imagine-that-with-sufficient-data-there-will-remain-things-that-only-humans-can-do/',
    'Kahneman''s research on cognitive biases and noise revolutionized our understanding of human judgment. His insight that algorithms can reduce noise provides the scientific foundation for human-AI collaboration: AI corrects human inconsistency.'
  ) ON CONFLICT (camp_id, author_id) DO NOTHING;

END $$;

-- ============================================================
-- SECTION 3: ENRICHMENTS FOR EXISTING AUTHORS
-- ============================================================

-- Update Andrej Karpathy with vibe coding source
UPDATE authors
SET sources = sources || '[
  {"url": "https://x.com/karpathy/status/1886192184808149383", "type": "Social", "year": "2025", "title": "Vibe Coding Tweet"},
  {"url": "https://karpathy.ai/", "type": "Website", "year": "2025", "title": "Andrej Karpathy Personal Site"}
]'::jsonb,
updated_at = now()
WHERE name = 'Andrej Karpathy'
AND NOT sources::text LIKE '%vibe%';

-- Update Max Tegmark with latest AI safety work
UPDATE authors
SET sources = sources || '[
  {"url": "https://futureoflife.org/person/max-tegmark/", "type": "Organization", "year": "2024", "title": "Future of Life Institute"},
  {"url": "https://danfaggella.com/tegmark1/", "type": "Podcast", "year": "2025", "title": "AI Safety Connect Interview"}
]'::jsonb,
updated_at = now()
WHERE name = 'Max Tegmark'
AND NOT sources::text LIKE '%AI Safety Connect%';

-- Add new camp relationships for existing authors where missing

-- Yoshua Bengio: Add Regulatory Interventionist camp if not exists
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  'e8792297-e745-4c9f-a91d-4f87dd05cea2'::uuid, -- Regulatory Interventionist
  a.id,
  'strong',
  'The first thing governments need to do is have regulation that forces companies to register when they build these frontier systems. Governments should know where they are, the specifics of these systems. Because future advanced AI will give tremendous power to whoever controls it.',
  'https://www.cnbc.com/2024/11/21/will-ai-replace-humans-yoshua-bengio-warns-of-artificial-intelligence-risks.html',
  'As chair of the International AI Safety Report and a Turing Award winner, Bengio''s call for mandatory registration of frontier AI systems carries exceptional weight. His shift from pure research to policy advocacy signals the urgency of governance.'
FROM authors a WHERE a.name = 'Yoshua Bengio'
ON CONFLICT (camp_id, author_id) DO NOTHING;

-- Jack Clark: Add Innovation First (challenges) perspective
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  '331b2b02-7f8d-4751-b583-16255a6feb50'::uuid, -- Innovation First
  a.id,
  'challenges',
  'Safety is not a department you bolt onto a company. It is a property of the research and engineering you do. The problem with AI is that it''s a dual-use technology to a terrifying degree.',
  'https://jack-clark.net/about/',
  'Clark''s "Rogue State Theory of AI" challenges the innovation-first approach by arguing AI systems need the same careful governance we''d apply to powerful state actors. His Anthropic role makes this a significant counter-perspective.'
FROM authors a WHERE a.name = 'Jack Clark'
ON CONFLICT (camp_id, author_id) DO NOTHING;

-- Daron Acemoglu: Ensure Displacement Realist mapping
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  '76f0d8c5-c9a8-4a26-ae7e-18f787000e18'::uuid, -- Displacement Realist
  a.id,
  'strong',
  'AI will impact less than five percent of all tasks and increase U.S. productivity by only 0.5% and GDP growth by only 0.9% cumulatively over the next decade. Only a quarter of AI-exposed tasks will be cost-effective to automate within the next 10 years.',
  'https://www.goldmansachs.com/insights/goldman-sachs-exchanges/a-skeptical-look-at-ai-investment',
  'As a 2024 Nobel laureate, Acemoglu''s skeptical productivity estimates directly challenge AI hype. His 0.5% productivity forecast stands in stark contrast to trillion-dollar economic projections.'
FROM authors a WHERE a.name = 'Daron Acemoglu'
ON CONFLICT (camp_id, author_id) DO NOTHING;

-- Jim Covello: Ensure proper camp mapping for AI skeptic
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  '76f0d8c5-c9a8-4a26-ae7e-18f787000e18'::uuid, -- Displacement Realist
  a.id,
  'challenges',
  'What trillion-dollar problem will AI solve? Replacing low-wage jobs with tremendously costly technology is basically the polar opposite of the prior technology transitions I''ve witnessed in my thirty years of closely following the tech industry.',
  'https://www.goldmansachs.com/insights/goldman-sachs-exchanges/a-skeptical-look-at-ai-investment',
  'Goldman Sachs'' Head of Global Equity Research challenges AI ROI assumptions. His question "what trillion-dollar problem will AI solve?" exposes the gap between AI investment ($1T+) and demonstrated economic value.'
FROM authors a WHERE a.name = 'Jim Covello'
ON CONFLICT (camp_id, author_id) DO NOTHING;

COMMIT;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Check new authors were added
-- SELECT name, header_affiliation, credibility_tier FROM authors
-- WHERE created_at > now() - interval '1 hour' ORDER BY name;

-- Check camp distribution after additions
-- SELECT c.label as camp, c.domain, COUNT(ca.id) as authors
-- FROM camps c LEFT JOIN camp_authors ca ON c.id = ca.camp_id
-- GROUP BY c.id ORDER BY c.domain, authors DESC;
