-- STATUS: DEPRECATED - Replaced by compass_taxonomy_schema_Nov11.sql
-- 
-- This schema represents the old flat structure and is kept for historical reference only.
-- Use compass_taxonomy_schema_Nov11.sql which implements the current 3-tier taxonomy structure (domains/dimensions/camps).
--
-- Compass MVP Database Schema
-- Run this in Supabase SQL Editor

-- Authors table
CREATE TABLE IF NOT EXISTS authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  affiliation TEXT,
  credibility_tier TEXT CHECK (credibility_tier IN ('Seminal Thinker', 'Thought Leader', 'Emerging Voice', 'Practitioner')),
  author_type TEXT CHECK (author_type IN ('Academic', 'Practitioner', 'Academic/Practitioner', 'Policy Maker', 'Industry Leader')),
  position_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Camps table
CREATE TABLE IF NOT EXISTS camps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  domain TEXT CHECK (domain IN ('Business', 'Society', 'Workers', 'Technology', 'Policy & Regulation', 'Other')),
  position_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Camp-Author relationships (many-to-many)
CREATE TABLE IF NOT EXISTS camp_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  camp_id UUID REFERENCES camps(id) ON DELETE CASCADE,
  author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
  why_it_matters TEXT,
  relevance TEXT CHECK (relevance IN ('strong', 'partial', 'challenges', 'emerging')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(camp_id, author_id)
);

-- Sources table
CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT CHECK (type IN ('Paper', 'Blog', 'Video', 'Podcast', 'Book', 'Tweet Thread', 'Other')),
  summary TEXT,
  published_date DATE,
  domain TEXT CHECK (domain IN ('Business', 'Society', 'Workers', 'Technology', 'Policy & Regulation', 'Other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Source-Topic relationships (many-to-many)
CREATE TABLE IF NOT EXISTS source_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(source_id, topic_id)
);

-- Saved searches table
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  filters JSONB, -- Store filter state as JSON
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Search history table
CREATE TABLE IF NOT EXISTS search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sources_author_id ON sources(author_id);
CREATE INDEX IF NOT EXISTS idx_sources_published_date ON sources(published_date);
CREATE INDEX IF NOT EXISTS idx_sources_title ON sources USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_sources_summary ON sources USING gin(to_tsvector('english', summary));
CREATE INDEX IF NOT EXISTS idx_camp_authors_camp_id ON camp_authors(camp_id);
CREATE INDEX IF NOT EXISTS idx_camp_authors_author_id ON camp_authors(author_id);
CREATE INDEX IF NOT EXISTS idx_search_history_timestamp ON search_history(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_search_history_query ON search_history(query);

-- Enable Row Level Security (RLS) - but disable for MVP as per PRD
-- ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE camps ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
-- (We're not using RLS for MVP, so tables are public)

