-- Add why_it_matters column to camp_authors table if it doesn't exist
ALTER TABLE camp_authors ADD COLUMN IF NOT EXISTS why_it_matters TEXT;

-- Verify the column was added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'camp_authors'
ORDER BY ordinal_position;
