-- =============================================================================
-- VOICE LAB LABELS: Add Labels to Profiles and Categories to Samples
-- =============================================================================
-- Enables organization and filtering of voice profiles and samples
-- Run this in Supabase SQL Editor
-- =============================================================================

-- =============================================================================
-- UPDATE TABLE: voice_profiles
-- =============================================================================
-- Add labels array for tagging/organizing profiles

ALTER TABLE voice_profiles
  ADD COLUMN IF NOT EXISTS labels TEXT[] DEFAULT '{}';

-- Add GIN index for efficient label filtering
CREATE INDEX IF NOT EXISTS idx_voice_profiles_labels
  ON voice_profiles USING GIN(labels);

-- Add comment for documentation
COMMENT ON COLUMN voice_profiles.labels IS 'Free-form tags for organizing profiles (e.g., case-study, marketing, blog)';

-- =============================================================================
-- UPDATE TABLE: voice_samples
-- =============================================================================
-- Add category and notes for sample organization

ALTER TABLE voice_samples
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add index for category filtering
CREATE INDEX IF NOT EXISTS idx_voice_samples_category
  ON voice_samples(category);

-- Add comments for documentation
COMMENT ON COLUMN voice_samples.category IS 'Sample category: case-study, blog, email, social, etc.';
COMMENT ON COLUMN voice_samples.notes IS 'Optional notes about the sample';

-- =============================================================================
-- VERIFICATION: Check columns were added
-- =============================================================================

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'voice_profiles'
AND column_name = 'labels';

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'voice_samples'
AND column_name IN ('category', 'notes');
