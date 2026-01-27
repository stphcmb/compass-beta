-- ============================================================================
-- COMPASS PRODUCTION DATABASE SETUP
-- Run this entire file in Supabase SQL Editor to set up your production database
-- ============================================================================

-- First, let's make sure we have the authors table from the old schema
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

-- Source-Topic relationships
CREATE TABLE IF NOT EXISTS source_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(source_id, topic_id)
);

-- Saved searches
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  filters JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Search history
CREATE TABLE IF NOT EXISTS search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- NEW TAXONOMY SCHEMA
-- ============================================================================

-- 1. DOMAINS TABLE
CREATE TABLE IF NOT EXISTS domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  key_question TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. DIMENSIONS TABLE
CREATE TABLE IF NOT EXISTS dimensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  name TEXT,
  dimension_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(domain_id, name)
);

-- 3. CAMPS TABLE
CREATE TABLE IF NOT EXISTS camps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dimension_id UUID NOT NULL REFERENCES dimensions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  key_concerns TEXT NOT NULL,
  representative_voices TEXT NOT NULL,
  camp_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(dimension_id, name)
);

-- 4. CAMP-AUTHOR RELATIONSHIPS
CREATE TABLE IF NOT EXISTS camp_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  camp_id UUID REFERENCES camps(id) ON DELETE CASCADE,
  author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
  why_it_matters TEXT,
  relevance TEXT CHECK (relevance IN ('strong', 'partial', 'challenges', 'emerging')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(camp_id, author_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sources_author_id ON sources(author_id);
CREATE INDEX IF NOT EXISTS idx_sources_published_date ON sources(published_date);
CREATE INDEX IF NOT EXISTS idx_camp_authors_camp_id ON camp_authors(camp_id);
CREATE INDEX IF NOT EXISTS idx_camp_authors_author_id ON camp_authors(author_id);
CREATE INDEX IF NOT EXISTS idx_search_history_timestamp ON search_history(timestamp DESC);

-- ============================================================================
-- Now run the seed data files:
-- 1. Docs/compass_taxonomy_schema_Nov11.sql (the INSERT statements)
-- 2. Docs/03_seed_authors_and_relationships.sql
-- ============================================================================
