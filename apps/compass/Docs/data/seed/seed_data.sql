-- Sample Seed Data for Compass MVP
-- Run this AFTER schema.sql to populate with test data

-- Insert sample camps
INSERT INTO camps (id, name, domain, position_summary) VALUES
('11111111-1111-1111-1111-111111111111', 'Optimistic Transformationalists', 'Workers', 'AI will transform work positively with proper preparation and reskilling programs'),
('22222222-2222-2222-2222-222222222222', 'Automation Pessimists', 'Workers', 'AI will displace workers faster than reskilling programs can adapt'),
('33333333-3333-3333-3333-333333333333', 'Implementation Practitioners', 'Business', 'Focuses on change management and execution challenges of AI adoption'),
('44444444-4444-4444-4444-444444444444', 'Regulatory Advocates', 'Policy & Regulation', 'Strong AI regulation is needed to protect workers and society'),
('55555555-5555-5555-5555-555555555555', 'Technology Optimists', 'Technology', 'AI will solve most problems if given enough time and resources')
ON CONFLICT (name) DO NOTHING;

-- Insert sample authors
INSERT INTO authors (id, name, affiliation, credibility_tier, author_type, position_summary) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Andrew Ng', 'deeplearning.ai', 'Seminal Thinker', 'Academic/Practitioner', 'Advocates for AI education and reskilling programs to prepare workforce'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Gary Marcus', 'NYU', 'Seminal Thinker', 'Academic', 'Critical of current AI approaches, emphasizes need for hybrid AI systems'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Fei-Fei Li', 'Stanford University', 'Seminal Thinker', 'Academic', 'Focuses on human-centered AI and ethical AI development'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Reid Hoffman', 'Greylock Partners', 'Thought Leader', 'Industry Leader', 'Emphasizes AI as augmentation tool for human workers'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Daron Acemoglu', 'MIT', 'Seminal Thinker', 'Academic', 'Studies economic impact of AI and automation on employment')
ON CONFLICT DO NOTHING;

-- Link authors to camps
INSERT INTO camp_authors (camp_id, author_id, why_it_matters, relevance) VALUES
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Directly supports reskilling argument with specific program models', 'strong'),
('11111111-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Provides business perspective on AI augmentation', 'strong'),
('22222222-2222-2222-2222-222222222222', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Presents economic research challenging reskilling assumptions', 'challenges'),
('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Offers implementation frameworks for reskilling programs', 'partial')
ON CONFLICT DO NOTHING;

-- Insert sample sources
INSERT INTO sources (author_id, title, url, type, summary, published_date, domain) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'AI Transformation Playbook', 'https://example.com/ai-playbook', 'Blog', 'Comprehensive guide to implementing AI reskilling programs in organizations. Covers curriculum design, timeline, and success metrics.', '2024-01-15', 'Business'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Stanford Lecture Series on AI Education', 'https://example.com/stanford-lectures', 'Video', 'Series of lectures on preparing workers for AI era. Includes case studies from various industries.', '2024-02-20', 'Workers'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'The Economics of AI and Employment', 'https://example.com/economics-ai', 'Paper', 'Research paper analyzing the pace of job displacement versus reskilling program effectiveness. Challenges optimistic timelines.', '2024-03-10', 'Workers'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'AI as Augmentation: The Future of Work', 'https://example.com/augmentation', 'Blog', 'Argues that AI should augment human capabilities rather than replace workers. Provides examples from successful implementations.', '2024-01-08', 'Business')
ON CONFLICT DO NOTHING;

-- Insert sample topics
INSERT INTO topics (name) VALUES
('AI reskilling'),
('Workforce transformation'),
('AI regulation'),
('Enterprise AI adoption'),
('AI ethics'),
('Job displacement'),
('Human-AI collaboration')
ON CONFLICT (name) DO NOTHING;

-- Link sources to topics
INSERT INTO source_topics (source_id, topic_id)
SELECT s.id, t.id
FROM sources s, topics t
WHERE t.name IN ('AI reskilling', 'Workforce transformation')
LIMIT 4
ON CONFLICT DO NOTHING;

-- Insert sample search history
INSERT INTO search_history (query, timestamp) VALUES
('AI and reskilling workers', NOW() - INTERVAL '2 days'),
('Enterprise AI transformation', NOW() - INTERVAL '5 days'),
('AI impact on creative work', NOW() - INTERVAL '1 week')
ON CONFLICT DO NOTHING;

-- Insert sample saved search
INSERT INTO saved_searches (query, filters) VALUES
('Future of knowledge work', '{"domain": "Workers", "dateRange": "Last 12 months"}'::jsonb)
ON CONFLICT DO NOTHING;

