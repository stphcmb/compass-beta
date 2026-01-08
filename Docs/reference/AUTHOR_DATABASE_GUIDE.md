# Author Database Guide

> **Version:** 3.0
> **Last Updated:** 2026-01-08
> **Status:** AUTHORITATIVE - This is the single source of truth for ALL author data operations (adding AND updating)

---

## ⚠️ CRITICAL: Authors Need Camp Relationships

**Authors without `camp_authors` entries will NOT:**
- Appear in search results
- Show position summaries ("What they believe")
- Display quotes or "Why it matters" sections
- Be visible on the Explore page

An author record alone is just metadata. The `camp_authors` table is what makes authors **visible and searchable** in the app.

```
┌─────────────────┐       ┌──────────────────────┐       ┌─────────────┐
│    authors      │──────▶│    camp_authors      │◀──────│    camps    │
│                 │       │                      │       │             │
│ • name          │       │ • key_quote ⭐       │       │ • label     │
│ • affiliation   │       │ • why_it_matters ⭐  │       │ • domain    │
│ • sources       │       │ • relevance          │       │             │
│ • notes         │       │ • quote_source_url   │       │             │
└─────────────────┘       └──────────────────────┘       └─────────────┘
      ↓                            ↓
   Metadata                Displayed in UI
   (invisible)             (visible to users)
```

**Every author MUST have at least 1 camp_authors entry with:**
- `key_quote` - What the author actually said (60-150 words)
- `why_it_matters` - Editorial context (80-180 words)
- `quote_source_url` - Verifiable source link

---

## Quick Navigation

| Task | Section |
|------|---------|
| Add new author | [Adding New Authors](#adding-new-authors) |
| Update existing author | [Updating Existing Authors](#updating-existing-authors) |
| Track emerging topics | [Tracking Emerging Topics](#tracking-emerging-topics) |
| Check existing authors | [Existing Authors](#existing-authors-in-database) |
| Camp UUIDs | [Camp Reference](#camp-reference-uuids) |
| SQL templates | [SQL Templates](#sql-templates) |
| Validation | [Pre-Commit Checklist](#pre-commit-checklist) |
| Maintenance | [Maintenance Queries](#maintenance-queries) |

---

## Core Principles

1. **Quality Over Quantity** - 10 well-researched authors > 50 poorly researched ones
2. **No Hallucination** - Every quote must be real and verifiable at its source URL
3. **Editorial Standards** - Only add authors with genuine expertise and track record
4. **Complete Data** - Every author needs profile + sources + quotes before going live

---

## Author Selection Criteria

### Who Should Be Added

**Priority 1: AI Intensity 3 (AI-Primary Focus)**
- Most output is AI-focused
- Examples: AI researchers, lab leaders, AI-focused podcast hosts, AI policy specialists

**Priority 2: AI Intensity 2 (AI-Recurring)**
- Regular AI content among other topics
- Examples: Tech economists with AI focus, enterprise AI consultants

**Priority 3: AI Intensity 1 (AI-Occasional)** - Only if highly influential
- Occasional but impactful AI commentary
- Must have significant reach/influence to justify inclusion

### Who Should NOT Be Added

- **AI Intensity 0**: General commentators who mention AI occasionally
- **No Track Record**: Can't find 3+ substantive AI-focused works
- **No Verifiable Quotes**: Can't find quotes on topics with source URLs
- **Already Exists**: Check existing authors list first

### Selection Checklist

Before researching an author:
- [ ] Can I find 3+ substantive AI-focused publications/talks?
- [ ] Do they have documented positions on 1+ of our domains?
- [ ] Are they cited/referenced by other experts?
- [ ] Is their affiliation current and verifiable?

---

## Database Schema

### Authors Table

```sql
CREATE TABLE authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  primary_affiliation TEXT,        -- Full: "Stanford University, HAI"
  header_affiliation TEXT,         -- Short: "Stanford"
  notes TEXT,                      -- 2-3 sentence bio (NOT "bio"!)
  credibility_tier TEXT,           -- See tiers below
  author_type TEXT,                -- See types below
  sources JSONB,                   -- Array of sources (min 3)
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### Camp_Authors Table (Junction)

```sql
CREATE TABLE camp_authors (
  id UUID PRIMARY KEY,
  camp_id UUID REFERENCES camps(id),
  author_id UUID REFERENCES authors(id),
  relevance TEXT,                  -- strong | partial | challenges | emerging
  key_quote TEXT,                  -- 60-150 words, actual author words
  quote_source_url TEXT,           -- URL where quote appears
  why_it_matters TEXT,             -- 80-180 words
  view_evolution_notes TEXT,       -- Track if author changed views over time
  UNIQUE(camp_id, author_id)
);
```

#### View Evolution Notes

Use `view_evolution_notes` to document when authors **change their positions** over time:

```sql
-- Example: Tracking a major shift
UPDATE camp_authors ca
SET view_evolution_notes = 'Shifted from scaling optimism to safety focus after leaving OpenAI in 2024. Co-founded SSI with explicit focus on safe superintelligence.'
FROM authors a
WHERE ca.author_id = a.id AND a.name = 'Ilya Sutskever';
```

**When to use:**
- Author publicly changed stance on a major issue
- Author's views evolved significantly (e.g., from optimism to caution)
- Author holds opposing views across different domains (record in relevant camp)

### Two Levels of Quotes

**IMPORTANT:** There are two places where quotes are stored:

```
┌─────────────────────────────────┐       ┌──────────────────────────────────┐
│    authors table                │       │    camp_authors table            │
│    (Author-level quote)         │       │    (Camp-specific quotes)        │
├─────────────────────────────────┤       ├──────────────────────────────────┤
│ • key_quote ⭐                  │       │ • key_quote ⭐                   │
│ • quote_source_url ⭐           │       │ • quote_source_url ⭐            │
│                                 │       │ • why_it_matters ⭐              │
│ General quote representing      │       │ Domain-specific quote for        │
│ author's overall position       │       │ each camp relationship           │
└─────────────────────────────────┘       └──────────────────────────────────┘
```

**Both levels are required:**

1. **Author-level quote** (on `authors` table): A representative quote capturing the author's general stance on AI. Used as a fallback and for author profile display.

2. **Camp-level quotes** (on `camp_authors` table): Domain-specific quotes for each camp the author is mapped to. Used in search results and camp views.

### Field Reference

#### Credibility Tiers

| Tier | Description | Examples |
|------|-------------|----------|
| `Pioneer` | Shaped the field itself; their work is foundational to modern AI | Turing Award winners, created subfields, foundational papers |
| `Field Leader` | Leads major AI initiatives or institutions; shapes industry direction | Lab directors, major company AI leads, influential executives |
| `Domain Expert` | Deep expertise in specific AI domains; highly cited in their specialty | Conference speakers, prolific researchers, specialized consultants |
| `Rising Voice` | Building influence; early but consistent track record of insight | Junior researchers with growing audience, emerging commentators |

> **Note:** Credibility tiers are used internally for data organization. They are not displayed to users in the UI.

#### Author Types

| Type | Description |
|------|-------------|
| `Academic` | University professors, academic researchers |
| `Researcher` | Industry or independent researchers |
| `Industry Leader` | CEOs, CTOs, founders |
| `Executive` | Senior executives at tech companies |
| `Policy Expert` | Policy analysts, think tank researchers |
| `Policy Maker` | Government officials, regulators |
| `Investor` | VCs, angel investors focused on AI |
| `Public Intellectual` | Writers, podcast hosts, commentators |
| `Engineer` | Technical practitioners |

#### Relevance Levels

| Level | Meaning | Use When |
|-------|---------|----------|
| `strong` | Primary position, core advocate | Leading voice for this camp |
| `partial` | Secondary/nuanced position | Has views but not primary focus |
| `challenges` | Opposes this camp | Actively argues against |
| `emerging` | New/evolving position | Recently started engaging |

---

## Camp Reference (UUIDs)

**Use these exact UUIDs - do not create new ones.**

### AI Technical Capabilities

| Camp | UUID | Description |
|------|------|-------------|
| **Scaling Will Deliver** | `c5dcb027-cd27-4c91-adb4-aca780d15199` | Scaling leads to AGI |
| **Needs New Approaches** | `207582eb-7b32-4951-9863-32fcf05944a1` | Need embodiment, world models |

### AI & Society

| Camp | UUID | Description |
|------|------|-------------|
| **Safety First** | `7f64838f-59a6-4c87-8373-a023b9f448cc` | Prioritize safety, accountability |
| **Democratize Fast** | `fe19ae2d-99f2-4c30-a596-c9cd92bff41b` | Speed and access over caution |

### Enterprise AI Adoption

| Camp | UUID | Description |
|------|------|-------------|
| **Technology Leads** | `7e9a2196-71e7-423a-889c-6902bc678eac` | Infrastructure first |
| **Co-Evolution** | `f19021ab-a8db-4363-adec-c2228dad6298` | People + process + tech together |
| **Business Whisperers** | `fe9464df-b778-44c9-9593-7fb3294fa6c3` | Translation is the bottleneck |
| **Tech Builders** | `a076a4ce-f14c-47b5-ad01-c8c60135a494` | Build great AI, adoption follows |

### AI Governance & Oversight

| Camp | UUID | Description |
|------|------|-------------|
| **Regulatory Interventionist** | `e8792297-e745-4c9f-a91d-4f87dd05cea2` | Strong government oversight now |
| **Innovation First** | `331b2b02-7f8d-4751-b583-16255a6feb50` | Industry leads, minimal regulation |
| **Adaptive Governance** | `ee10cf4f-025a-47fc-be20-33d6756ec5cd` | Light-touch, iterative regulation |

### Future of Work

| Camp | UUID | Description |
|------|------|-------------|
| **Displacement Realist** | `76f0d8c5-c9a8-4a26-ae7e-18f787000e18` | Significant job displacement |
| **Human-AI Collaboration** | `d8d3cec4-f8ce-49b1-9a43-bb0d952db371` | AI augments humans |

---

## Adding New Authors

### Required Information

#### 1. Basic Profile

| Field | Required | Description |
|-------|----------|-------------|
| `name` | YES | Official full name |
| `primary_affiliation` | YES | Current organization + role |
| `header_affiliation` | YES | Short display (1-2 words) |
| `notes` | YES | 2-3 sentences on significance |
| `credibility_tier` | YES | See tiers above |
| `author_type` | YES | See types above |
| `sources` | YES | JSONB array, **minimum 3** |
| `key_quote` | YES | General quote (60-150 words) |
| `quote_source_url` | YES | URL where quote can be verified |

#### 2. Sources (Minimum 3)

```json
[
  {
    "url": "https://example.com/work",
    "type": "Book|Paper|Podcast|Blog|YouTube|Research|Organization|Website",
    "year": "2024",
    "title": "Title of the work"
  }
]
```

**Source Quality:**
- All URLs must be working
- Mix of types (not all podcasts)
- At least one substantial source (book, research, organization)
- Prefer recent (last 3 years)

#### 3. Camp Relationships (1-5 per author)

**Guidelines:**
- **Specialists** (CTOs, CFOs): 1-2 camps in their domain
- **Broad thinkers** (academics, researchers): 3-5 camps across domains
- Only map where they have documented positions

**Per-Camp Requirements:**

| Field | Required | Length |
|-------|----------|--------|
| `relevance` | YES | - |
| `key_quote` | YES | 60-150 words |
| `quote_source_url` | YES | Working URL |
| `why_it_matters` | YES | 80-180 words |

---

## Enriching Existing Authors

When an author already exists in the database, you can still add value by:

### 1. Adding New Camp Relationships

If an author has views on a camp not yet documented:

```sql
INSERT INTO camp_authors (author_id, camp_id, key_quote, quote_source_url, relevance, why_it_matters)
SELECT a.id, 'camp-uuid'::uuid,
  'New quote about this specific domain...',
  'https://source-url.com',
  'strong',
  'Why this perspective matters...'
FROM authors a WHERE a.name = 'Existing Author'
ON CONFLICT (author_id, camp_id) DO NOTHING;
```

### 2. Adding New Sources

Append new sources to an existing author's sources array:

```sql
UPDATE authors
SET sources = sources || '[{"url": "https://new-source.com", "type": "Book", "year": "2024", "title": "New Publication"}]'::jsonb
WHERE name = 'Existing Author';
```

### 3. Documenting View Evolution

When an author changes their position over time:

```sql
UPDATE camp_authors ca
SET view_evolution_notes = 'Description of how views changed...'
FROM authors a
WHERE ca.author_id = a.id
  AND a.name = 'Author Name'
  AND ca.camp_id = 'relevant-camp-uuid'::uuid;
```

**Best Practice:** When researching an author who already exists, check what camps they're already mapped to and add any missing perspectives with new quotes.

---

## Updating Existing Authors

### When to Update vs Add New

**Update Existing Author When:**
- ✅ Same person with new content (new book, paper, podcast)
- ✅ Job change (new affiliation)
- ✅ New public statement/quote on a topic
- ✅ Better sources found
- ✅ Improved bio/notes

**Add New Author When:**
- ✅ Genuinely different person (even if same name)

**⚠️ DON'T Create Duplicate Authors:**
- ❌ Same person with updated affiliation
- ❌ Same person with new publication
- ❌ Slightly different name spelling (e.g., "Sam Altman" vs "Samuel Altman")

### Finding Existing Authors

```sql
-- Search by name (exact)
SELECT id, name, primary_affiliation, header_affiliation
FROM authors WHERE name = 'Sam Altman';

-- Search by name (partial match)
SELECT id, name, header_affiliation
FROM authors WHERE name ILIKE '%altman%';

-- Search by affiliation
SELECT name, primary_affiliation
FROM authors
WHERE primary_affiliation ILIKE '%OpenAI%'
   OR header_affiliation ILIKE '%OpenAI%';

-- Check if author exists before adding
SELECT COUNT(*) FROM authors WHERE name = 'Author Name';
```

### Adding New Publications

Publications are stored in the `authors.sources` JSONB array. **Always append, never overwrite.**

```sql
-- ✅ CORRECT: Append new source
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

-- ❌ WRONG: This overwrites all existing sources!
UPDATE authors SET sources = '[...]'::jsonb WHERE name = 'Sam Altman';
```

**Add multiple sources at once:**

```sql
UPDATE authors
SET sources = sources || '[
  {"url": "https://example.com/paper", "type": "Paper", "year": "2024", "title": "New Research"},
  {"url": "https://example.com/podcast", "type": "Podcast", "year": "2024", "title": "AI Discussion"}
]'::jsonb,
updated_at = now()
WHERE name = 'Sam Altman';
```

### Updating Quotes

**Option 1: Update Author-Level Quote**

```sql
UPDATE authors
SET
  key_quote = 'New representative quote...',
  quote_source_url = 'https://example.com/new-interview',
  updated_at = now()
WHERE name = 'Sam Altman';
```

**Option 2: Update Quote for Existing Camp**

```sql
UPDATE camp_authors
SET
  key_quote = 'New domain-specific quote...',
  quote_source_url = 'https://example.com/source',
  updated_at = now()
WHERE author_id = (SELECT id FROM authors WHERE name = 'Sam Altman')
  AND camp_id = 'c5dcb027-cd27-4c91-adb4-aca780d15199'; -- Scaling Will Deliver
```

**Option 3: Add New Camp Relationship**

```sql
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  a.id,
  'ee10cf4f-025a-47fc-be20-33d6756ec5cd'::uuid, -- Adaptive Governance
  'partial',
  'Quote about this domain...',
  'https://example.com/source',
  'Why this perspective matters...'
FROM authors a WHERE a.name = 'Sam Altman'
ON CONFLICT (author_id, camp_id) DO NOTHING;
```

### Updating Profile Information

```sql
-- Update affiliation (job change)
UPDATE authors
SET
  primary_affiliation = 'New Company, Role Title',
  header_affiliation = 'New Company',
  updated_at = now()
WHERE name = 'Ilya Sutskever';

-- Update bio/notes
UPDATE authors
SET
  notes = 'Updated 2-3 sentence bio reflecting current work...',
  updated_at = now()
WHERE name = 'Sam Altman';

-- Update credibility tier (author's influence grew)
UPDATE authors
SET
  credibility_tier = 'Field Leader',
  updated_at = now()
WHERE name = 'Author Name';
```

### Complete Profile Refresh

```sql
BEGIN;

-- 1. Update author profile
UPDATE authors
SET
  primary_affiliation = 'OpenAI, CEO',
  header_affiliation = 'OpenAI',
  notes = 'CEO of OpenAI. Leading figure in AGI development and AI policy.',
  credibility_tier = 'Field Leader',
  sources = sources || '[
    {"url": "https://example.com/book", "type": "Book", "year": "2024", "title": "New Publication"}
  ]'::jsonb,
  key_quote = 'Updated general quote...',
  quote_source_url = 'https://example.com/interview',
  updated_at = now()
WHERE name = 'Sam Altman';

-- 2. Update camp quotes
UPDATE camp_authors
SET
  key_quote = 'Updated domain-specific quote...',
  quote_source_url = 'https://example.com/source',
  why_it_matters = 'Updated rationale...',
  updated_at = now()
WHERE author_id = (SELECT id FROM authors WHERE name = 'Sam Altman')
  AND camp_id = 'c5dcb027-cd27-4c91-adb4-aca780d15199';

COMMIT;
```

---

## Tracking Emerging Topics

When significant new AI topics emerge (e.g., "vibe coding", "AI agents", "prompt engineering"), existing authors may have spoken about them. Keep author data current with proactive updates.

### Emerging Topic Checklist

1. **Identify authors likely to have opinions**
   - Who are thought leaders in related areas?
   - Who has spoken publicly about this topic?

2. **Research their statements**
   - Check recent talks, podcasts, blog posts, tweets
   - Find verifiable quotes with source URLs

3. **Update their data**
   - Add new sources to `authors.sources`
   - Update `authors.key_quote` if this is now their most notable position
   - Add camp relationships if topic maps to a camp
   - Update `camp_authors.key_quote` for domain-specific quotes

### Example: Vibe Coding (2025)

When "vibe coding" emerged, Andrej Karpathy coined the term:

```sql
-- 1. Add vibe coding sources
UPDATE authors
SET sources = sources || '[
  {
    "url": "https://www.youtube.com/watch?v=LWiM-LuRe6w",
    "type": "Video",
    "year": "2025",
    "title": "Vibe Coding - The Future of Programming with AI"
  },
  {
    "url": "https://x.com/karpathy/status/1886192184808149383",
    "type": "Social",
    "year": "2025",
    "title": "Vibe Coding Tweet Thread"
  }
]'::jsonb,
key_quote = 'There is a new kind of coding I call "vibe coding" where you fully give in to the vibes, embrace exponentials, and forget that the code even exists.',
quote_source_url = 'https://x.com/karpathy/status/1886192184808149383',
updated_at = now()
WHERE name = 'Andrej Karpathy';

-- 2. Add relevant camp relationship (Human–AI Collaboration)
-- NOTE: Camp label uses en-dash (–) not hyphen (-)
INSERT INTO camp_authors (author_id, camp_id, relevance, key_quote, quote_source_url, why_it_matters)
SELECT
  a.id,
  'd8d3cec4-f8ce-49b1-9a43-bb0d952db371'::uuid,
  'strong',
  'Vibe coding is the new paradigm where humans and AI collaborate on code.',
  'https://www.youtube.com/watch?v=LWiM-LuRe6w',
  'Karpathy''s "vibe coding" concept captures a fundamental shift in software development.'
FROM authors a WHERE a.name = 'Andrej Karpathy'
ON CONFLICT (author_id, camp_id) DO UPDATE SET
  key_quote = EXCLUDED.key_quote,
  quote_source_url = EXCLUDED.quote_source_url,
  why_it_matters = EXCLUDED.why_it_matters;
```

### Topics to Monitor

| Topic | Key Authors | Relevant Camps |
|-------|-------------|----------------|
| Vibe Coding | Karpathy, Amjad Masad, Swyx | Human–AI Collaboration |
| AI Agents | Yohei Nakajima, Harrison Chase | Tech Builders |
| Multimodal AI | Demis Hassabis, Sam Altman | Scaling Will Deliver |
| AI Regulation | Helen Toner, Jack Clark | Regulatory Interventionist |
| Open Source AI | Clem Delangue, Stella Biderman | Democratize Fast |

### Domain Display Names (UI)

When displaying domains in the UI, use these user-friendly descriptions:

| Internal Domain | UI Display |
|-----------------|------------|
| AI Technical Capabilities | AI capabilities |
| AI & Society | AI & society |
| Enterprise AI Adoption | AI in business |
| AI Governance & Oversight | AI governance |
| Future of Work | AI & work |

**Usage patterns:**
- Single domain: "Focused on AI & work"
- Two domains: "Explores AI capabilities and AI governance"
- Three+ domains: "Explores AI capabilities, AI & society, and AI governance"

---

## SQL Templates

### Single Author

```sql
BEGIN;

INSERT INTO authors (
  name, primary_affiliation, header_affiliation, notes,
  credibility_tier, author_type, sources, key_quote, quote_source_url
) VALUES (
  'Jane Doe',
  'Stanford University, Human-Centered AI Institute',
  'Stanford',
  'Leading AI ethics researcher. Her work on algorithmic fairness shapes policy globally.',
  'Seminal Thinker',
  'Academic',
  '[
    {"url": "https://hai.stanford.edu/jane", "type": "Research", "year": "2024", "title": "Stanford HAI"},
    {"url": "https://amazon.com/ethics-book", "type": "Book", "year": "2023", "title": "AI Ethics"},
    {"url": "https://podcast.com/jane", "type": "Podcast", "year": "2024", "title": "Ethics Weekly"}
  ]'::jsonb,
  'AI systems must be designed with accountability from the start. We cannot retrofit ethics after deployment.',
  'https://hai.stanford.edu/jane/interview-2024'
);

DO $$
DECLARE author_id uuid;
BEGIN
  SELECT id INTO author_id FROM authors WHERE name = 'Jane Doe';

  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '7f64838f-59a6-4c87-8373-a023b9f448cc', -- Safety First
    author_id,
    'strong',
    'AI systems must be designed with accountability from the start. We cannot retrofit ethics after deployment.',
    'https://hai.stanford.edu/jane/interview-2024',
    'Her research on algorithmic accountability is cited in 200+ policy documents. She advises EU and US governments on AI safety standards.'
  );
END $$;

COMMIT;
```

### Batch Authors

```sql
BEGIN;

INSERT INTO authors (name, header_affiliation, primary_affiliation, author_type, credibility_tier, notes, sources, key_quote, quote_source_url) VALUES
('Author 1', 'MIT', 'MIT Media Lab', 'Academic', 'Major Voice', 'Description...', '[...]'::jsonb, 'General quote about AI...', 'https://source-url.com'),
('Author 2', 'OpenAI', 'OpenAI', 'Researcher', 'Thought Leader', 'Description...', '[...]'::jsonb, 'General quote about AI...', 'https://source-url.com');

DO $$
DECLARE a1_id uuid; a2_id uuid;
BEGIN
  SELECT id INTO a1_id FROM authors WHERE name = 'Author 1';
  SELECT id INTO a2_id FROM authors WHERE name = 'Author 2';

  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES
    ('camp-uuid', a1_id, 'strong', 'Quote...', 'URL...', 'Why it matters...'),
    ('camp-uuid', a2_id, 'partial', 'Quote...', 'URL...', 'Why it matters...')
  ON CONFLICT (camp_id, author_id) DO NOTHING;
END $$;

COMMIT;
```

---

## Pre-Commit Checklist

### Data Completeness
- [ ] Author has name, primary_affiliation, header_affiliation
- [ ] Author has notes (2-3 sentences)
- [ ] Author has credibility_tier and author_type
- [ ] Author has **3+ sources** with working URLs
- [ ] No duplicate URLs in sources

### Author-Level Quotes (on `authors` table)
- [ ] **Author has key_quote** (60-150 words, general AI stance)
- [ ] **Author has quote_source_url** (working URL)
- [ ] Quote is representative of author's overall position

### Camp-Level Quotes (on `camp_authors` table)
- [ ] Author mapped to 1-5 camps based on actual expertise
- [ ] Each camp has relevance set
- [ ] **Each camp has key_quote** (60-150 words, domain-specific)
- [ ] **Each camp has quote_source_url** (working)
- [ ] Each camp has why_it_matters (80-180 words)
- [ ] Camp quotes are different from author-level quote (domain-specific)

### Quote Verification
- [ ] Quotes are REAL (not fabricated)
- [ ] Quotes appear at the source URL
- [ ] Camp quotes are domain-specific (different per camp)

### SQL Quality
- [ ] Wrapped in BEGIN/COMMIT
- [ ] Single quotes escaped (`''`)
- [ ] Camp UUIDs match reference table exactly

### Validation Commands

```bash
# Check for missing author-level quotes (should return 0)
node -e "
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const { data } = await supabase.from('authors').select('name').or('key_quote.is.null,key_quote.eq.').order('name');
console.log('Authors missing key_quote:', data?.length || 0);
if (data?.length) data.forEach(a => console.log('  -', a.name));
"

# Check for missing camp-level quotes (should return 0)
node -e "
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const { data } = await supabase.from('camp_authors').select('authors(name), camps(label)').or('key_quote.is.null,why_it_matters.is.null');
console.log('Camp relationships missing quotes:', data?.length || 0);
if (data?.length) data.forEach(ca => console.log('  -', ca.authors?.name, '/', ca.camps?.label));
"
```

### Fix Scripts (if needed)

If authors are missing quotes after bulk additions:

```bash
# Fix missing author-level quotes
# Edit scripts/fix_missing_author_quotes.mjs to add quotes for specific authors
node scripts/fix_missing_author_quotes.mjs
```

---

## Existing Authors in Database

**Always check before adding to avoid duplicates.**

### Current Authors (~140+)

| Name | Affiliation |
|------|-------------|
| Sam Altman | OpenAI |
| Dario Amodei | Anthropic |
| Ilya Sutskever | SSI |
| Geoffrey Hinton | U of Toronto |
| Yann LeCun | Meta / NYU |
| Yoshua Bengio | Mila |
| Demis Hassabis | DeepMind |
| Jensen Huang | NVIDIA |
| Satya Nadella | Microsoft |
| Sundar Pichai | Google |
| Mark Zuckerberg | Meta |
| Emily M. Bender | U of Washington |
| Timnit Gebru | DAIR |
| Gary Marcus | NYU |
| Andrew Ng | Stanford |
| Erik Brynjolfsson | Stanford |
| Stuart Russell | UC Berkeley |
| Eliezer Yudkowsky | MIRI |
| Mustafa Suleyman | Microsoft AI |
| Kai-Fu Lee | Sinovation |
| Jaron Lanier | Microsoft Research |
| Fei-Fei Li | Stanford HAI |
| Noam Brown | OpenAI |
| Jason Wei | OpenAI |
| Jared Kaplan | Anthropic |
| Melanie Mitchell | Santa Fe Institute |
| Michael I. Jordan | UC Berkeley |
| Arthur Mensch | Mistral AI |
| Chris Lattner | Modular AI |
| Sara Hooker | Cohere |
| Neel Nanda | Google DeepMind |
| Evan Hubinger | Anthropic |
| Helen Toner | Georgetown CSET |
| Matt Clifford | Entrepreneur First |
| Alexandr Wang | Scale AI |
| Martin Ford | Futurist |
| Mary L. Gray | Microsoft Research |
| Jaime Teevan | Microsoft |
| Dwarkesh Patel | Dwarkesh Podcast |
| ... | (140+ total) |

**To check current list:**
```sql
SELECT name, header_affiliation FROM authors ORDER BY name;
```

---

## Verification Queries

### Find Authors Without Camp Relationships (INVISIBLE)

**These authors won't appear in the app at all:**

```sql
SELECT a.name, a.header_affiliation, a.created_at
FROM authors a
LEFT JOIN camp_authors ca ON a.id = ca.author_id
WHERE ca.id IS NULL
ORDER BY a.created_at DESC;
```

### Check Author Completeness

```sql
SELECT
  a.name,
  a.header_affiliation,
  jsonb_array_length(a.sources) as sources,
  COUNT(ca.id) as camps,
  CASE WHEN a.notes IS NULL THEN 'Missing' ELSE 'OK' END as notes_status
FROM authors a
LEFT JOIN camp_authors ca ON a.id = ca.author_id
GROUP BY a.id
HAVING jsonb_array_length(a.sources) < 3 OR COUNT(ca.id) = 0
ORDER BY a.name;
```

### Find Missing Quotes

```sql
SELECT
  a.name,
  c.label as camp,
  CASE
    WHEN ca.key_quote IS NULL THEN 'No quote'
    WHEN ca.quote_source_url IS NULL THEN 'No URL'
    ELSE 'Complete'
  END as status
FROM camp_authors ca
JOIN authors a ON ca.author_id = a.id
JOIN camps c ON ca.camp_id = c.id
WHERE ca.key_quote IS NULL OR ca.quote_source_url IS NULL;
```

### Camp Distribution

```sql
SELECT
  c.label as camp,
  COUNT(ca.id) as author_count
FROM camps c
LEFT JOIN camp_authors ca ON c.id = ca.camp_id
GROUP BY c.id, c.label
ORDER BY author_count DESC;
```

---

## Common Mistakes

| Mistake | Correct Approach |
|---------|------------------|
| **Adding author without camp_authors** | **Author won't be visible! Always add camp relationships** |
| **Missing author-level key_quote** | **Every author needs key_quote on authors table** |
| Using `bio` field | Use `notes` field |
| Adding `x_handle`, `linkedin_url` | These fields don't exist |
| Hardcoding author UUIDs | Let database generate |
| Same quote for multiple camps | Unique quote per camp |
| Same quote for author-level and camp-level | Author quote = general; camp quotes = domain-specific |
| Fabricating quotes | Only use real, verifiable quotes |
| Skipping sources | Minimum 3 required |
| Not wrapping in transaction | Always use BEGIN/COMMIT |
| Missing `key_quote` in camp_authors | Required for "What they believe" display |
| Missing `why_it_matters` in camp_authors | Required for position context display |
| Not verifying after bulk adds | Always run validation commands |

---

## Maintenance Queries

### Find Authors with Outdated Sources

```sql
-- Sources older than 3 years
SELECT
  a.name,
  a.header_affiliation,
  elem->>'title' as source_title,
  elem->>'year' as year
FROM authors a,
LATERAL jsonb_array_elements(a.sources) elem
WHERE (elem->>'year')::int < EXTRACT(YEAR FROM CURRENT_DATE) - 3
ORDER BY a.name, (elem->>'year')::int;
```

### Find Authors with Few Sources

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

### Find Camp Quotes Needing Updates

```sql
-- Quotes without source URLs
SELECT
  a.name,
  c.label as camp,
  CASE
    WHEN ca.key_quote IS NULL THEN 'No quote'
    WHEN ca.quote_source_url IS NULL THEN 'No source URL'
    ELSE 'Complete'
  END as status
FROM camp_authors ca
JOIN authors a ON ca.author_id = a.id
JOIN camps c ON ca.camp_id = c.id
WHERE ca.key_quote IS NULL OR ca.quote_source_url IS NULL
ORDER BY a.name, c.label;
```

### Get Complete Author Profile with All Camps

```sql
SELECT
  a.name,
  a.primary_affiliation,
  a.header_affiliation,
  a.notes,
  a.credibility_tier,
  a.key_quote,
  jsonb_pretty(a.sources) as sources,
  jsonb_agg(
    jsonb_build_object(
      'camp', c.label,
      'relevance', ca.relevance,
      'quote', ca.key_quote,
      'quote_source', ca.quote_source_url,
      'why_it_matters', ca.why_it_matters
    ) ORDER BY c.label
  ) as camps
FROM authors a
LEFT JOIN camp_authors ca ON a.id = ca.author_id
LEFT JOIN camps c ON ca.camp_id = c.id
WHERE a.name = 'Sam Altman'
GROUP BY a.id;
```

---

## File Organization

| File Type | Location |
|-----------|----------|
| SQL scripts | `/scripts/add_*.sql` |
| Fix missing quotes | `/scripts/fix_missing_author_quotes.mjs` |
| Update existing author | `/scripts/update_[author]_[topic].mjs` |
| Tier migrations | `/scripts/migrate_credibility_tiers.mjs` |
| Addition log | `/Docs/reference/AUTHOR_ADDITION_LOG.md` |
| This guide | `/Docs/reference/AUTHOR_DATABASE_GUIDE.md` |
| External agent guide | `/Docs/reference/EXTERNAL_AGENT_AUTHOR_GUIDE.md` |

---

## Related Documents

- **[EXTERNAL_AGENT_AUTHOR_GUIDE.md](./EXTERNAL_AGENT_AUTHOR_GUIDE.md)** - Self-contained guide for external AI agents (ChatGPT, Gemini) to produce ready-to-run SQL scripts
- **[AUTHOR_ADDITION_LOG.md](./AUTHOR_ADDITION_LOG.md)** - Track record of additions

---

## Documentation Governance

> **IMPORTANT:** This document (`AUTHOR_DATABASE_GUIDE.md`) is the **single source of truth** for all author data operations.

**Rules:**
1. **Do NOT create separate files** for author-related operations (adding, updating, enriching, etc.)
2. When new processes are needed, **update this document** rather than creating new files
3. External agent instructions live in `EXTERNAL_AGENT_AUTHOR_GUIDE.md` (separate for copy/paste use)
4. All other author documentation should be consolidated here

**Rationale:** Fragmented documentation leads to outdated information and inconsistent processes. One authoritative document ensures everyone follows the same standards.

---

**Document History:**
- v3.0 (2026-01-08) - Consolidated UPDATING_EXISTING_AUTHORS.md; updated credibility tiers (Pioneer, Field Leader, Domain Expert, Rising Voice); added maintenance queries and documentation governance
- v2.2 (2026-01-08) - Added two-level quote requirements (author-level + camp-level), verification commands, and fix scripts
- v2.0 (2026-01-07) - Consolidated from multiple guides
- v1.0 (2025-12-02) - Original fragmented documentation
