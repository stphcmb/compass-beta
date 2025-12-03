-- Add Lex Fridman only (Cassie and Stuart already exist)

BEGIN;

INSERT INTO authors (
  name,
  primary_affiliation,
  header_affiliation,
  notes,
  credibility_tier,
  author_type
) VALUES (
  'Lex Fridman',
  'MIT, Podcast Host',
  'MIT',
  'AI researcher at MIT and host of one of the world''s most influential tech podcasts. His long-form interviews with AI researchers, tech leaders, and philosophers reach millions and shape public understanding of AI.',
  'tier_1',
  'researcher'
);

DO $$
DECLARE
  lex_id uuid;
BEGIN
  SELECT id INTO lex_id FROM authors WHERE name = 'Lex Fridman';

  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES
  ('c5dcb027-cd27-4c91-adb4-aca780d15199', lex_id, 'strong',
   'I''m increasingly convinced that scaling, combined with the right architectural improvements, will get us to AGI. The empirical evidence from GPT-3 to GPT-4 suggests we''re on the right path—more compute, more data, better algorithms, and we see genuinely new capabilities emerging.',
   'https://lexfridman.com/podcast/',
   'Fridman''s podcast features deep technical conversations with scaling advocates like Ilya Sutskever and Sam Altman, amplifying the scaling paradigm to millions of listeners. His platform shapes how both technical and non-technical audiences understand AI capabilities and timelines.'),

  ('7f64838f-59a6-4c87-8373-a023b9f448cc', lex_id, 'partial',
   'AGI presents both the greatest hope and greatest risk to humanity. We need serious AI safety research now, not as an afterthought. The alignment problem is real, but I''m optimistic we can solve it if we treat it with the urgency it deserves.',
   'https://lexfridman.com/max-tegmark/',
   'Fridman gives extensive airtime to AI safety researchers like Stuart Russell, Max Tegmark, and Eliezer Yudkowsky, legitimizing safety concerns to mainstream tech audiences. His balanced interviews make x-risk arguments accessible without sensationalism, influencing how developers think about safety.'),

  ('fe19ae2d-99f2-4c30-a596-c9cd92bff41b', lex_id, 'partial',
   'Making AI accessible through open dialogue and education is crucial. The more people understand these systems—how they work, their limitations, their potential—the better our collective decisions about deployment. Transparency and openness serve humanity better than secrecy.',
   'https://twitter.com/lexfridman',
   'His podcast democratizes AI knowledge by making cutting-edge research accessible to millions. This educational mission shapes public literacy and reduces fear through understanding, though he balances openness with acknowledgment of safety concerns.'),

  ('ee10cf4f-025a-47fc-be20-33d6756ec5cd', lex_id, 'partial',
   'Governance needs to evolve with the technology. Heavy-handed regulation risks crushing innovation, but no governance risks catastrophe. The answer is nimble, informed oversight that understands the technology deeply and adapts as capabilities change.',
   'https://lexfridman.com/sam-altman-2/',
   'Through interviews with policymakers, tech CEOs, and researchers, Fridman explores governance frameworks that millions hear. His neutral platform becomes a forum where different governance philosophies are debated, influencing how technologists think about regulation.'),

  ('d8d3cec4-f8ce-49b1-9a43-bb0d952db371', lex_id, 'strong',
   'I believe AI will augment human intelligence and creativity far more than it replaces us. The future belongs to humans who learn to work with AI as a tool for thought, enhancing our capabilities rather than competing with machines at what they do best.',
   'https://lexfridman.com/geoff-hinton-2/',
   'Fridman''s optimistic vision of human-AI collaboration reaches millions, countering displacement pessimism. His technical background lends credibility to augmentation narratives, shaping how developers and business leaders frame AI''s impact on work.');
END $$;

COMMIT;
