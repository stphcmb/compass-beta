-- =============================================================================
-- VOICE TRAINING: Add Voice Samples, Insights, and Profile Versioning
-- =============================================================================
-- Enables continuous voice profile training through insight-based learning
-- Run this in Supabase SQL Editor
-- =============================================================================

-- =============================================================================
-- NEW TABLE: voice_samples
-- =============================================================================
-- Stores raw writing samples used for voice profile training

CREATE TABLE IF NOT EXISTS voice_samples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voice_profile_id UUID NOT NULL REFERENCES voice_profiles(id) ON DELETE CASCADE,
  clerk_user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  source_type TEXT DEFAULT 'manual',  -- 'manual', 'pdf', 'url', 'draft'
  source_name TEXT,
  word_count INTEGER NOT NULL,
  quality_score DECIMAL(3,2) DEFAULT 0.5,
  is_processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes for voice_samples
CREATE INDEX IF NOT EXISTS idx_voice_samples_profile ON voice_samples(voice_profile_id);
CREATE INDEX IF NOT EXISTS idx_voice_samples_user ON voice_samples(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_voice_samples_processed ON voice_samples(is_processed);

-- Add comment for documentation
COMMENT ON TABLE voice_samples IS 'Stores raw writing samples used for voice profile training';
COMMENT ON COLUMN voice_samples.source_type IS 'How the sample was added: manual, pdf, url, or draft';
COMMENT ON COLUMN voice_samples.quality_score IS 'AI-assessed quality from 0.0 to 1.0';
COMMENT ON COLUMN voice_samples.is_processed IS 'Whether insights have been extracted from this sample';

-- =============================================================================
-- NEW TABLE: voice_insights
-- =============================================================================
-- Stores extracted voice insights that accumulate over time

CREATE TABLE IF NOT EXISTS voice_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voice_profile_id UUID NOT NULL REFERENCES voice_profiles(id) ON DELETE CASCADE,
  voice_sample_id UUID REFERENCES voice_samples(id) ON DELETE SET NULL,
  clerk_user_id TEXT NOT NULL,
  insight_type TEXT NOT NULL,  -- 'tone', 'vocabulary', 'structure', 'rhetoric', 'principle'
  content TEXT NOT NULL,
  examples TEXT[] DEFAULT '{}',
  confidence DECIMAL(3,2) DEFAULT 0.5,
  sample_count INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes for voice_insights
CREATE INDEX IF NOT EXISTS idx_voice_insights_profile ON voice_insights(voice_profile_id);
CREATE INDEX IF NOT EXISTS idx_voice_insights_user ON voice_insights(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_voice_insights_type ON voice_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_voice_insights_sample ON voice_insights(voice_sample_id);

-- Add comment for documentation
COMMENT ON TABLE voice_insights IS 'Stores extracted voice insights that accumulate with confidence over time';
COMMENT ON COLUMN voice_insights.insight_type IS 'Category: tone, vocabulary, structure, rhetoric, or principle';
COMMENT ON COLUMN voice_insights.confidence IS 'Confidence score from 0.0 to 1.0, increases with sample_count';
COMMENT ON COLUMN voice_insights.sample_count IS 'Number of samples that contributed to this insight';
COMMENT ON COLUMN voice_insights.examples IS 'Array of supporting quotes from samples';

-- =============================================================================
-- UPDATE TABLE: voice_profiles
-- =============================================================================
-- Add versioning and training status columns

ALTER TABLE voice_profiles
  ADD COLUMN IF NOT EXISTS style_guide_version INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS last_synthesized_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS training_status TEXT DEFAULT 'ready',
  ADD COLUMN IF NOT EXISTS sample_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS insight_count INTEGER DEFAULT 0;

-- Add comments for new columns
COMMENT ON COLUMN voice_profiles.style_guide_version IS 'Increments each time style guide is regenerated';
COMMENT ON COLUMN voice_profiles.last_synthesized_at IS 'Timestamp of last style guide synthesis';
COMMENT ON COLUMN voice_profiles.training_status IS 'ready, processing, or needs_update';
COMMENT ON COLUMN voice_profiles.sample_count IS 'Cached count of training samples';
COMMENT ON COLUMN voice_profiles.insight_count IS 'Cached count of extracted insights';

-- =============================================================================
-- TRIGGER: Auto-update updated_at for voice_samples
-- =============================================================================

CREATE OR REPLACE FUNCTION update_voice_samples_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS voice_samples_updated_at ON voice_samples;
CREATE TRIGGER voice_samples_updated_at
  BEFORE UPDATE ON voice_samples
  FOR EACH ROW
  EXECUTE FUNCTION update_voice_samples_updated_at();

-- =============================================================================
-- TRIGGER: Auto-update updated_at for voice_insights
-- =============================================================================

CREATE OR REPLACE FUNCTION update_voice_insights_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS voice_insights_updated_at ON voice_insights;
CREATE TRIGGER voice_insights_updated_at
  BEFORE UPDATE ON voice_insights
  FOR EACH ROW
  EXECUTE FUNCTION update_voice_insights_updated_at();

-- =============================================================================
-- VERIFICATION: Check tables were created
-- =============================================================================

SELECT table_name FROM information_schema.tables
WHERE table_name IN ('voice_samples', 'voice_insights');

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'voice_profiles'
AND column_name IN ('style_guide_version', 'last_synthesized_at', 'training_status', 'sample_count', 'insight_count');
