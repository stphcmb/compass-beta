-- Step 1: Add key_quote and quote_source_url columns to camp_authors table
-- This allows each author-camp relationship to have its own specific quote

ALTER TABLE camp_authors ADD COLUMN IF NOT EXISTS key_quote TEXT;
ALTER TABLE camp_authors ADD COLUMN IF NOT EXISTS quote_source_url TEXT;

-- Step 2: Migrate existing author-level quotes to their primary camp_authors relationships
-- This is a starting point - we'll enrich with camp-specific quotes in the next step

UPDATE camp_authors ca
SET
  key_quote = a.key_quote,
  quote_source_url = a.quote_source_url
FROM authors a
WHERE ca.author_id = a.id
  AND a.key_quote IS NOT NULL
  AND ca.key_quote IS NULL;

-- Verification query to see which author-camp combinations now have quotes
SELECT
  a.name as author_name,
  c.label as camp_name,
  c.domain_id,
  ca.relevance,
  ca.key_quote IS NOT NULL as has_quote,
  ca.quote_source_url IS NOT NULL as has_source
FROM camp_authors ca
JOIN authors a ON ca.author_id = a.id
JOIN camps c ON ca.camp_id = c.id
ORDER BY a.name, c.domain_id;
