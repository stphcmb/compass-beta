# Updating Existing Authors Guide

**Purpose:** How to add new publications, quotes, and affiliations to existing authors instead of creating duplicates

---

## Table of Contents

1. [Schema Overview: How Data is Stored](#schema-overview-how-data-is-stored)
2. [When to Update vs Add New Author](#when-to-update-vs-add-new-author)
3. [Common Update Operations](#common-update-operations)
4. [Adding New Publications](#adding-new-publications)
5. [Adding New Quotes](#adding-new-quotes)
6. [Updating Author Profile](#updating-author-profile)
7. [Finding Existing Authors](#finding-existing-authors)

---

## Schema Overview: How Data is Stored

### **Multiple Sources/Publications per Author**

✅ **Supported natively via JSONB array**

```sql
-- authors.sources is a JSONB array
sources: [
  {"url": "...", "type": "Book", "year": "2023", "title": "..."},
  {"url": "...", "type": "Podcast", "year": "2024", "title": "..."},
  {"url": "...", "type": "Paper", "year": "2024", "title": "..."}
  -- Can have unlimited sources
]
```

**Flexibility:**
- ✅ Add as many publications as needed
- ✅ Update existing sources
- ✅ Remove outdated sources
- ✅ No additional tables or joins needed

### **Multiple Quotes per Author**

✅ **Supported via camp relationships**

```sql
-- Each camp_authors record has one key_quote
Author → Camp 1 → Quote about Technical Capabilities
Author → Camp 2 → Quote about Society & Ethics
Author → Camp 3 → Quote about Governance
```

**Structure:**
- One author can belong to multiple camps (1-5 typically)
- Each camp relationship stores ONE domain-specific quote
- Total quotes per author = number of camps they're in

**Example:** Sam Altman in 4 camps = 4 different quotes
1. "Scaling Maximalists" camp → Quote about technical scaling
2. "Tech-First" camp → Quote about enterprise adoption
3. "Innovation-First" camp → Quote about regulation
4. "Tech Utopians" camp → Quote about democratization

---

## When to Update vs Add New Author

### **Update Existing Author When:**

✅ **Same person with new content**
- New book published
- New podcast launched
- New research paper
- Updated affiliation (job change)
- New public statement/quote on a topic

✅ **Profile enhancements**
- Better sources found
- More representative quotes
- Improved bio/notes
- Clarified position on existing camps

### **Add New Author When:**

✅ **Genuinely different person**
- Different individual, even if same name
- Example: Different "John Smith" researchers

### **⚠️ DON'T Create Duplicate Authors**

❌ **Never create new author for:**
- Same person with updated affiliation
- Same person with new publication
- Same person with new quote
- Slightly different name spelling (e.g., "Sam Altman" vs "Samuel Altman")

---

## Common Update Operations

### **Quick Reference Table**

| Operation | Complexity | Frequency | Transaction Required |
|-----------|------------|-----------|---------------------|
| Add new publication | Easy | High | No |
| Update affiliation | Easy | Medium | No |
| Update bio/notes | Easy | Medium | No |
| Add new quote to existing camp | Easy | Medium | No |
| Add new camp with quote | Medium | Low | Yes (if checking camp existence) |
| Update multiple fields | Medium | Low | Yes (recommended) |

---

## Adding New Publications

### **Operation 1: Add Single Publication**

```sql
-- Add one new source to existing author
UPDATE authors
SET sources = sources || '[
  {
    "url": "https://example.com/new-book-2024",
    "type": "Book",
    "year": "2024",
    "title": "The New AI Landscape"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Sam Altman';
```

### **Operation 2: Add Multiple Publications**

```sql
-- Add multiple new sources at once
UPDATE authors
SET sources = sources || '[
  {
    "url": "https://example.com/new-paper",
    "type": "Paper",
    "year": "2024",
    "title": "Scaling Laws Revisited"
  },
  {
    "url": "https://example.com/podcast-episode",
    "type": "Podcast",
    "year": "2024",
    "title": "AI Safety Discussion"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Sam Altman';
```

### **Operation 3: Replace All Publications**

```sql
-- Completely replace sources array (use with caution)
UPDATE authors
SET sources = '[
  {
    "url": "https://example.com/source1",
    "type": "Book",
    "year": "2023",
    "title": "Title 1"
  },
  {
    "url": "https://example.com/source2",
    "type": "Podcast",
    "year": "2024",
    "title": "Title 2"
  },
  {
    "url": "https://example.com/source3",
    "type": "Research",
    "year": "2024",
    "title": "Title 3"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Sam Altman';
```

### **Operation 4: Remove Specific Publication**

```sql
-- Remove a source by filtering the array
UPDATE authors
SET sources = (
  SELECT jsonb_agg(elem)
  FROM jsonb_array_elements(sources) elem
  WHERE elem->>'url' != 'https://old-url-to-remove.com'
),
updated_at = now()
WHERE name = 'Sam Altman';
```

---

## Adding New Quotes

### **Strategy: Quotes are Tied to Camps**

You have two options:

1. **Update existing camp quote** (replace old quote)
2. **Add new camp relationship** (if author belongs to new camp)

### **Option 1: Update Quote for Existing Camp**

```sql
-- Replace quote for an existing camp relationship
UPDATE camp_authors
SET
  key_quote = 'New updated quote that reflects their current position on this topic. More recent and representative of their evolved thinking.',
  quote_source_url = 'https://example.com/new-interview-2024',
  updated_at = now()
WHERE author_id = (SELECT id FROM authors WHERE name = 'Sam Altman')
  AND camp_id = 'c5dcb027-cd27-4c91-adb4-aca780d15199'; -- Scaling Maximalists
```

### **Option 2: Add New Camp with Quote**

```sql
-- Add author to a new camp they weren't in before
DO $$
DECLARE
  author_id uuid;
BEGIN
  SELECT id INTO author_id FROM authors WHERE name = 'Sam Altman';

  -- Check if this camp relationship already exists
  IF NOT EXISTS (
    SELECT 1 FROM camp_authors
    WHERE author_id = author_id
      AND camp_id = 'ee10cf4f-025a-47fc-be20-33d6756ec5cd'
  ) THEN
    INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
    VALUES (
      'ee10cf4f-025a-47fc-be20-33d6756ec5cd', -- Adaptive Governance
      author_id,
      'partial',
      'We need regulation that can keep pace with technology. Static rules will fail. The framework must be adaptive while maintaining core safety principles.',
      'https://example.com/altman-senate-testimony-2024',
      'Sam Altman has shifted toward supporting adaptive governance frameworks, signaling OpenAI''s willingness to work with regulators. His testimony influences Congressional AI policy.'
    );
  END IF;
END $$;
```

### **Option 3: Batch Update Multiple Quotes**

```sql
-- Update multiple quotes for one author across different camps
BEGIN;

UPDATE camp_authors
SET
  key_quote = 'Updated quote about scaling laws and their continued effectiveness...',
  quote_source_url = 'https://example.com/source1',
  updated_at = now()
WHERE author_id = (SELECT id FROM authors WHERE name = 'Sam Altman')
  AND camp_id = 'c5dcb027-cd27-4c91-adb4-aca780d15199'; -- Scaling Maximalists

UPDATE camp_authors
SET
  key_quote = 'Updated quote about enterprise AI adoption strategy...',
  quote_source_url = 'https://example.com/source2',
  updated_at = now()
WHERE author_id = (SELECT id FROM authors WHERE name = 'Sam Altman')
  AND camp_id = '7e9a2196-71e7-423a-889c-6902bc678eac'; -- Tech-First

COMMIT;
```

---

## Updating Author Profile

### **Update Affiliation (Job Change)**

```sql
-- Author moved to new organization
UPDATE authors
SET
  primary_affiliation = 'New Company, Role Title',
  header_affiliation = 'New Company',
  updated_at = now()
WHERE name = 'Sam Altman';
```

### **Update Bio/Notes**

```sql
-- Improve or update the bio
UPDATE authors
SET
  notes = 'Updated 2-3 sentence bio reflecting their current work and influence. New accomplishments and focus areas.',
  updated_at = now()
WHERE name = 'Sam Altman';
```

### **Update Credibility Tier**

```sql
-- Author's influence has grown
UPDATE authors
SET
  credibility_tier = 'Seminal Thinker', -- upgraded from 'Thought Leader'
  updated_at = now()
WHERE name = 'Sam Altman';
```

### **Comprehensive Profile Update**

```sql
-- Update multiple fields at once
BEGIN;

UPDATE authors
SET
  primary_affiliation = 'OpenAI, CEO',
  header_affiliation = 'OpenAI',
  notes = 'CEO of OpenAI, leading the development of GPT models. Influential voice in AI policy and safety debates. His views on AGI timelines and governance shape both industry strategy and regulatory discussions.',
  credibility_tier = 'Major Voice',
  sources = sources || '[
    {
      "url": "https://openai.com",
      "type": "Organization",
      "year": "2024",
      "title": "OpenAI"
    },
    {
      "url": "https://example.com/new-book",
      "type": "Book",
      "year": "2024",
      "title": "The Intelligence Age"
    }
  ]'::jsonb,
  updated_at = now()
WHERE name = 'Sam Altman';

COMMIT;
```

---

## Finding Existing Authors

### **Search by Name (Exact)**

```sql
SELECT
  id,
  name,
  primary_affiliation,
  header_affiliation,
  credibility_tier,
  jsonb_pretty(sources) as sources,
  notes
FROM authors
WHERE name = 'Sam Altman';
```

### **Search by Name (Partial Match)**

```sql
-- Find authors with similar names
SELECT
  id,
  name,
  header_affiliation,
  credibility_tier
FROM authors
WHERE name ILIKE '%altman%'
ORDER BY name;
```

### **Search by Affiliation**

```sql
-- Find all authors from an organization
SELECT
  name,
  primary_affiliation,
  credibility_tier
FROM authors
WHERE
  primary_affiliation ILIKE '%OpenAI%'
  OR header_affiliation ILIKE '%OpenAI%'
ORDER BY name;
```

### **Check if Author Exists Before Adding**

```sql
-- Prevent duplicates
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM authors WHERE name = 'Sam Altman') THEN
    RAISE NOTICE 'Author already exists. Use UPDATE instead of INSERT.';
  ELSE
    RAISE NOTICE 'Author does not exist. Safe to INSERT.';
  END IF;
END $$;
```

### **Get Complete Author Profile with All Camps**

```sql
SELECT
  a.name,
  a.primary_affiliation,
  a.header_affiliation,
  a.notes,
  a.credibility_tier,
  a.author_type,
  jsonb_pretty(a.sources) as sources,
  jsonb_agg(
    jsonb_build_object(
      'camp', c.name,
      'relevance', ca.relevance,
      'quote', ca.key_quote,
      'quote_source', ca.quote_source_url,
      'why_it_matters', ca.why_it_matters
    ) ORDER BY c.name
  ) as camps
FROM authors a
LEFT JOIN camp_authors ca ON a.id = ca.author_id
LEFT JOIN camps c ON ca.camp_id = c.id
WHERE a.name = 'Sam Altman'
GROUP BY a.id;
```

---

## Workflow Examples

### **Workflow 1: New Book Published**

```sql
-- Step 1: Verify author exists
SELECT id, name, jsonb_array_length(sources) as current_source_count
FROM authors
WHERE name = 'Sam Altman';

-- Step 2: Add the new book
UPDATE authors
SET sources = sources || '[
  {
    "url": "https://example.com/new-book-2024",
    "type": "Book",
    "year": "2024",
    "title": "The Intelligence Age"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Sam Altman';

-- Step 3: Verify addition
SELECT
  name,
  jsonb_array_length(sources) as source_count,
  jsonb_pretty(sources) as sources
FROM authors
WHERE name = 'Sam Altman';
```

### **Workflow 2: Author Changes Jobs**

```sql
-- Step 1: Check current affiliation
SELECT name, primary_affiliation, header_affiliation
FROM authors
WHERE name = 'Ilya Sutskever';

-- Step 2: Update affiliation
UPDATE authors
SET
  primary_affiliation = 'Safe Superintelligence Inc., Co-founder & Chief Scientist',
  header_affiliation = 'SSI',
  updated_at = now()
WHERE name = 'Ilya Sutskever';

-- Step 3: Verify update
SELECT name, primary_affiliation, header_affiliation, updated_at
FROM authors
WHERE name = 'Ilya Sutskever';
```

### **Workflow 3: New Quote from Recent Interview**

```sql
-- Step 1: Find which camps the author belongs to
SELECT
  a.name,
  c.name as camp_name,
  c.id as camp_id,
  ca.key_quote,
  ca.quote_source_url
FROM authors a
JOIN camp_authors ca ON a.id = ca.author_id
JOIN camps c ON ca.camp_id = c.id
WHERE a.name = 'Sam Altman';

-- Step 2: Update quote for specific camp (e.g., Scaling Maximalists)
UPDATE camp_authors
SET
  key_quote = 'We''ve seen no evidence of scaling laws slowing down. The path to AGI is clear—more compute, better data, refined architectures. We''re just getting started.',
  quote_source_url = 'https://example.com/altman-interview-2024',
  updated_at = now()
WHERE author_id = (SELECT id FROM authors WHERE name = 'Sam Altman')
  AND camp_id = 'c5dcb027-cd27-4c91-adb4-aca780d15199';

-- Step 3: Verify update
SELECT
  a.name,
  c.name as camp,
  LEFT(ca.key_quote, 100) || '...' as quote_preview,
  ca.quote_source_url
FROM authors a
JOIN camp_authors ca ON a.id = ca.author_id
JOIN camps c ON ca.camp_id = c.id
WHERE a.name = 'Sam Altman'
  AND c.id = 'c5dcb027-cd27-4c91-adb4-aca780d15199';
```

### **Workflow 4: Major Profile Refresh**

```sql
-- Comprehensive update with new sources, updated bio, and new quotes
BEGIN;

-- 1. Update author profile
UPDATE authors
SET
  primary_affiliation = 'OpenAI, CEO',
  header_affiliation = 'OpenAI',
  notes = 'CEO of OpenAI. Leading figure in AGI development and AI policy. His views influence both industry strategy and government regulation.',
  credibility_tier = 'Major Voice',
  sources = '[
    {"url": "https://openai.com", "type": "Organization", "year": "2024", "title": "OpenAI"},
    {"url": "https://blog.samaltman.com", "type": "Blog", "year": "2024", "title": "Sam Altman''s Blog"},
    {"url": "https://example.com/book", "type": "Book", "year": "2024", "title": "The Intelligence Age"},
    {"url": "https://youtube.com/samaltman", "type": "YouTube", "year": "2024", "title": "Sam Altman Interviews"}
  ]'::jsonb,
  updated_at = now()
WHERE name = 'Sam Altman';

-- 2. Update quotes across camps
UPDATE camp_authors
SET
  key_quote = 'Updated quote about scaling...',
  quote_source_url = 'https://example.com/source1',
  why_it_matters = 'Updated rationale...',
  updated_at = now()
WHERE author_id = (SELECT id FROM authors WHERE name = 'Sam Altman')
  AND camp_id = 'c5dcb027-cd27-4c91-adb4-aca780d15199';

UPDATE camp_authors
SET
  key_quote = 'Updated quote about enterprise AI...',
  quote_source_url = 'https://example.com/source2',
  why_it_matters = 'Updated rationale...',
  updated_at = now()
WHERE author_id = (SELECT id FROM authors WHERE name = 'Sam Altman')
  AND camp_id = '7e9a2196-71e7-423a-889c-6902bc678eac';

COMMIT;

-- 3. Verify all changes
SELECT
  a.name,
  a.primary_affiliation,
  jsonb_array_length(a.sources) as source_count,
  COUNT(ca.id) as camp_count,
  a.updated_at
FROM authors a
LEFT JOIN camp_authors ca ON a.id = ca.author_id
WHERE a.name = 'Sam Altman'
GROUP BY a.id;
```

---

## Best Practices

### **✅ DO's**

1. **Always check if author exists before adding**
   ```sql
   SELECT * FROM authors WHERE name = 'Author Name';
   ```

2. **Use transactions for multi-step updates**
   ```sql
   BEGIN;
   -- multiple updates
   COMMIT;
   ```

3. **Keep source URLs working**
   - Verify URLs before adding
   - Remove broken/outdated sources

4. **Update `updated_at` timestamp**
   ```sql
   UPDATE authors SET ..., updated_at = now() WHERE ...;
   ```

5. **Preserve existing data when updating**
   - Use `||` operator to append to JSONB arrays
   - Don't accidentally overwrite existing sources

6. **Document major changes**
   - Add comments in SQL scripts
   - Note what changed and why

### **❌ DON'Ts**

1. **Don't create duplicate authors**
   - Always search first
   - Check for name variations

2. **Don't delete all sources when adding one**
   ```sql
   -- ❌ Wrong: Overwrites everything
   UPDATE authors SET sources = '[{...}]'::jsonb WHERE ...;

   -- ✅ Correct: Appends to existing
   UPDATE authors SET sources = sources || '[{...}]'::jsonb WHERE ...;
   ```

3. **Don't add quotes without sources**
   - Every quote needs `quote_source_url`

4. **Don't forget to verify updates**
   - Always run verification query after updates

5. **Don't update production without testing**
   - Test SQL in development first
   - Use transactions to allow rollback

---

## Maintenance Queries

### **Find Authors with Outdated Sources**

```sql
-- Sources older than 3 years
SELECT
  a.name,
  a.header_affiliation,
  elem->>'title' as source_title,
  elem->>'year' as year,
  elem->>'url' as url
FROM authors a,
LATERAL jsonb_array_elements(a.sources) elem
WHERE (elem->>'year')::int < EXTRACT(YEAR FROM CURRENT_DATE) - 3
ORDER BY a.name, (elem->>'year')::int;
```

### **Find Authors with Few Sources**

```sql
-- Authors with fewer than 3 sources
SELECT
  name,
  header_affiliation,
  jsonb_array_length(sources) as source_count
FROM authors
WHERE jsonb_array_length(sources) < 3
ORDER BY source_count, name;
```

### **Find Camp Quotes Needing Updates**

```sql
-- Quotes without source URLs
SELECT
  a.name,
  c.name as camp,
  CASE
    WHEN ca.key_quote IS NULL THEN 'No quote'
    WHEN ca.quote_source_url IS NULL THEN 'No source URL'
    ELSE 'Complete'
  END as status
FROM camp_authors ca
JOIN authors a ON ca.author_id = a.id
JOIN camps c ON ca.camp_id = c.id
WHERE ca.key_quote IS NULL OR ca.quote_source_url IS NULL
ORDER BY a.name, c.name;
```

---

## Summary

### **Schema Capabilities**

| Feature | Storage | Max Count | Update Strategy |
|---------|---------|-----------|-----------------|
| **Publications** | `authors.sources` JSONB array | Unlimited | Append with `\|\|` operator |
| **Quotes** | `camp_authors.key_quote` | 1 per camp (5 max if in all camps) | UPDATE existing or INSERT new camp |
| **Affiliations** | `authors.primary_affiliation` | 1 current | UPDATE field |
| **Bio** | `authors.notes` | 1 | UPDATE field |

### **Common Operations Frequency**

| Operation | Frequency | Complexity |
|-----------|-----------|------------|
| Add new publication | High | Low |
| Update quote | Medium | Low |
| Update affiliation | Low | Low |
| Add new camp relationship | Low | Medium |
| Complete profile refresh | Rare | Medium |

### **Decision Tree**

```
New content about a person?
├─ Is this person already in database?
│  ├─ YES → UPDATE existing author
│  │  ├─ New book/paper? → Add to sources array
│  │  ├─ New quote? → UPDATE camp_authors or add new camp
│  │  ├─ Job change? → UPDATE affiliation
│  │  └─ Better bio? → UPDATE notes
│  └─ NO → INSERT new author (see AUTHOR_DATA_ADMINISTRATION.md)
```

---

**Related Documentation:**
- `/Docs/reference/AUTHOR_DATA_ADMINISTRATION.md` - Adding new authors
- `/Docs/database/compass_taxonomy_schema_Nov11.sql` - Complete schema
- `/lib/api/thought-leaders.ts` - How data is queried by the app
