# Author Database Enrichment Instructions

## Purpose
This document provides detailed instructions for enriching the Compass database with new AI thought leaders. The goal is to produce a complete SQL script that can be run directly against the production database to add new authors with all required relationships and metadata.

---

## Critical Notes for AI Researchers

### Core Principles
1. **Intellectual Honesty** - Do NOT hallucinate. If you cannot find evidence, do not fabricate it.
2. **Editorial Robustness** - Every claim must be verifiable. Every quote must be findable at its source URL.
3. **Quality Over Quantity** - 10 well-researched authors are better than 50 poorly researched ones.

### Data Accuracy Requirements
1. **All quotes must be real and verifiable** - Do NOT fabricate quotes. Find actual quotes from the author's published work, interviews, podcasts, or social media. You MUST be able to find the quote at the `quote_source_url`.
2. **All URLs must be tested** - Every URL in sources and `quote_source_url` must be:
   - Actually working (not 404)
   - Containing the quoted content (for quote URLs)
   - Relevant to the author (for source URLs)
3. **Affiliations must be current** - Verify the author's current role (people change jobs frequently in AI).
4. **Camp assignments must be evidence-based** - Only assign an author to a camp if you can find clear, verifiable evidence of their position.

### Domain & Perspective Balance
1. **Don't force authors into domains** - Only assign an author to camps where they have genuine, documented positions.
2. **Prioritize under-represented perspectives** - If a camp has few authors, prioritize finding qualified authors for that perspective.
3. **Cross-domain is fine** - An author can appear in multiple domains if they genuinely have views there.
4. **No domain quotas** - Don't add an author to a domain just for the sake of balance if you can't find evidence.

### Research Process
For each author:
1. Search for their recent (2023-2025) published work, interviews, and public statements
2. Identify 3+ sources with working URLs (TEST EACH URL)
3. Find domain-specific quotes that represent their position on each topic
4. **Verify the quote exists at the URL** - Open the URL and confirm the quote is there
5. Verify their current affiliation on their website, LinkedIn, or organization page
6. Assess their AI Intensity (must be 2-3 to prioritize, never 0)
7. **Check against existing authors list** (see below) to avoid duplicates

### If You Cannot Find Evidence
- **No quote found** → Do NOT add that camp relationship
- **Quote not at URL** → Find a different URL or skip that quote
- **No recent work found** → Author may be AI Intensity 0-1, consider skipping
- **Affiliation unclear** → Use their most recent known position with "(as of YYYY)"
- **Author already exists** → See deduplication rules below

### Deduplication Rules

**Before adding any author, check the Existing Authors List below.**

#### If Author Does NOT Exist
- Add them as a new author with full profile, sources, and camp relationships
- Follow all standard requirements

#### If Author ALREADY Exists
You have two options:

**Option A: Skip entirely** - If the existing data is already comprehensive

**Option B: Add supplementary data** - If the author has:
- New perspectives (they've changed their view on something)
- Interesting contrarian positions not yet captured
- New significant work published since their last update
- Missing camp relationships with verifiable quotes

**When adding to existing authors:**
```sql
-- DO NOT duplicate the author INSERT
-- Only add NEW camp_authors relationships

DO $$
DECLARE
  existing_author_id uuid;
BEGIN
  -- Get existing author ID
  SELECT id INTO existing_author_id FROM authors WHERE name = '[Existing Author Name]';

  -- Add NEW camp relationship (different camp or updated perspective)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '[camp_uuid]',
    existing_author_id,
    '[relevance]',
    '[NEW quote not already in database]',
    '[NEW source URL]',
    '[Why this NEW perspective matters]'
  )
  ON CONFLICT (camp_id, author_id) DO NOTHING; -- Skip if relationship exists
END $$;
```

**What counts as "new" for existing authors:**
- ✅ A quote from 2024-2025 that represents a new/evolved position
- ✅ A camp relationship that doesn't exist yet
- ✅ A contrarian or surprising stance from them
- ❌ Same quotes from same sources (duplicate)
- ❌ Minor rephrasing of existing positions
- ❌ Generic statements that don't add insight

---

## Existing Authors in Database

**Check this list before adding any author. If they exist, follow deduplication rules above.**

### Current Authors (as of database state)
| Name | Affiliation | Already In Camps |
|------|-------------|------------------|
| Sam Altman | OpenAI | Multiple |
| Dario Amodei | Anthropic | Multiple |
| Ilya Sutskever | SSI | Multiple |
| Geoffrey Hinton | U of Toronto | Multiple |
| Yann LeCun | Meta / NYU | Multiple |
| Yoshua Bengio | Mila | Multiple |
| Demis Hassabis | DeepMind | Multiple |
| Jensen Huang | NVIDIA | Multiple |
| Satya Nadella | Microsoft | Multiple |
| Sundar Pichai | Google | Multiple |
| Mark Zuckerberg | Meta | Multiple |
| Emily M. Bender | U of Washington | Multiple |
| Timnit Gebru | DAIR | Multiple |
| Kate Crawford | USC | Multiple |
| Gary Marcus | NYU | Multiple |
| Ethan Mollick | Wharton | Multiple |
| Andrew Ng | Stanford | Multiple |
| Erik Brynjolfsson | Stanford | Multiple |
| Cassie Kozyrkov | Kozyr | Multiple |
| Lex Fridman | MIT | Multiple |
| Stuart Russell | UC Berkeley | Multiple |
| Eliezer Yudkowsky | MIRI | Multiple |
| Mustafa Suleyman | Microsoft AI | Multiple |
| Kai-Fu Lee | Sinovation | Multiple |
| Jaron Lanier | Microsoft Research | Multiple |
| Tristan Harris | Humane Tech | Multiple |
| Ian Hogarth | UK AI Safety Institute | Multiple |
| Ajeya Cotra | Open Philanthropy | Multiple |
| Nick Bostrom | Oxford | Multiple |
| Suresh Venkatasubramanian | Brown | Multiple |
| Margaret Mitchell | Hugging Face | Multiple |
| Rumman Chowdhury | Humane Intelligence | Multiple |
| Judea Pearl | UCLA | Multiple |
| Yejin Choi | U of Washington | Multiple |
| Lilian Weng | OpenAI | Multiple |
| Abeba Birhane | Trinity College Dublin | Multiple |
| Deborah Raji | Mozilla | Multiple |
| Daron Acemoglu | MIT | Multiple |
| Daphne Koller | insitro | Multiple |
| Nat Friedman | ex-GitHub | Multiple |
| Patrick Collison | Stripe | Multiple |
| Emad Mostaque | Stability AI | Multiple |
| Percy Liang | Stanford | Multiple |

**Note**: This list may not be exhaustive. Query the database if unsure:
```sql
SELECT name, header_affiliation FROM authors ORDER BY name;
```

---

## Output Requirements

**Deliverable**: A single SQL file named `add_new_authors_[date].sql` containing:
1. All author INSERT statements
2. All camp_authors relationship INSERT statements
3. Wrapped in a transaction (BEGIN/COMMIT)
4. Verification queries at the end

---

## Database Schema Overview

### Authors Table
```sql
CREATE TABLE authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  primary_affiliation TEXT,        -- Full affiliation (e.g., "Professor of Computer Science, MIT")
  header_affiliation TEXT,         -- Short display (e.g., "MIT")
  notes TEXT,                      -- 2-3 sentence bio (NOT "bio" field - that doesn't exist)
  credibility_tier TEXT,           -- See tiers below
  author_type TEXT,                -- See types below
  sources JSONB,                   -- Array of source objects (REQUIRED)
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### Camp_Authors Table (Relationships)
```sql
CREATE TABLE camp_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  camp_id UUID REFERENCES camps(id),
  author_id UUID REFERENCES authors(id),
  relevance TEXT,                  -- strong | partial | challenges | emerging
  key_quote TEXT,                  -- Domain-specific quote (60-150 words)
  quote_source_url TEXT,           -- URL where quote can be found
  why_it_matters TEXT,             -- Explanation of influence (80-180 words)
  created_at TIMESTAMPTZ
);
```

---

## Field Specifications

### 1. Author Profile Fields

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `name` | YES | Official full name | `'Geoffrey Hinton'` |
| `primary_affiliation` | YES | Current role + organization | `'Professor Emeritus, University of Toronto; Former VP, Google'` |
| `header_affiliation` | YES | Short display version (1-2 words max) | `'U of Toronto'` |
| `notes` | YES | 2-3 sentences on significance | `'Pioneer of deep learning...'` |
| `credibility_tier` | YES | See options below | `'Seminal Thinker'` |
| `author_type` | YES | See options below | `'researcher'` |
| `sources` | YES | JSONB array, minimum 3 sources | See format below |

### 2. Credibility Tiers (choose ONE)

| Tier | Description | Use For |
|------|-------------|---------|
| `'Seminal Thinker'` | Foundational contributions, field-defining work | Turing Award winners, created subfields, textbook authors |
| `'Major Voice'` | Highly influential, shapes public discourse | Lab leaders, bestselling authors, viral content creators |
| `'Thought Leader'` | Recognized expert, regular contributor | Conference speakers, prolific researchers, policy advisors |
| `'Emerging Voice'` | Rising influence, newer to discourse | Junior researchers, newer commentators with growing audience |
| `'Practitioner'` | Hands-on implementer | Engineers, consultants with practical experience |

**Note**: Some legacy data uses `'tier_1'`, `'tier_2'`, `'tier_3'` - for new authors, use the descriptive tier names above.

### 3. Author Types (choose ONE)

| Type | Description |
|------|-------------|
| `'researcher'` | Academic researchers, lab scientists |
| `'practitioner'` | Industry practitioners, engineers |
| `'entrepreneur'` | Founders, CEOs, startup leaders |
| `'policy'` | Policymakers, regulators, government advisors |
| `'critic'` | Critics, ethicists, watchdogs |
| `'journalist'` | Tech journalists, writers |

### 4. AI Intensity (CRITICAL for Author Selection)

**AI Intensity** measures how consistently an author's output focuses on AI topics. This is a key selection criterion.

| Score | Label | Description | Action |
|-------|-------|-------------|--------|
| **3** | AI-Primary | Mostly AI writing; AI is their main focus | **PRIORITIZE** - Ideal candidates |
| **2** | AI-Recurring | Recurring AI pieces among other topics | **PRIORITIZE** - Strong candidates |
| **1** | AI-Occasional | Occasional AI commentary | **INCLUDE** - If highly influential |
| **0** | Not AI | Not really AI-focused | **NEVER ADD** - Out of scope |

#### Selection Priority
1. **First**: Authors with intensity 3 (AI-primary output)
2. **Second**: Authors with intensity 2 (recurring AI work)
3. **Third**: Authors with intensity 1 (occasional but impactful AI commentary)
4. **Never**: Authors with intensity 0 (not AI-focused)

#### Examples by AI Intensity

**Intensity 3 (AI-Primary)** - Prioritize these:
| Author | Affiliation | Why Intensity 3 |
|--------|-------------|-----------------|
| Azeem Azhar | Exponential View | Runs major AI-focused newsletter; publishes frequent AI landscape essays |
| Anton Korinek | UVA / Brookings | Publishes AI-and-economy academic work + public essays on AI |
| Anima Anandkumar | Caltech / NVIDIA | Large body of AI research publications |
| Fei-Fei Li | Stanford HAI | Founded ImageNet, leads Stanford AI institute |
| Jim Covello | Goldman Sachs | Research lead on high-profile genAI reports |

**Intensity 2 (AI-Recurring)** - Strong candidates:
| Author | Affiliation | Why Intensity 2 |
|--------|-------------|-----------------|
| Danielle Li | MIT Sloan | Peer-reviewed + working papers specifically on genAI and productivity |
| Torsten Slok | Apollo | Writes recurring market notes specifically framing AI exposure/bubble/adoption |
| Michael Cembalest | J.P. Morgan | Publishes episodes/notes that go deep on genAI topics |
| Bledi Taska | Lightcast | AI + labor market measurement via publications/data |

**Intensity 1 (AI-Occasional)** - Include if highly influential:
| Author | Affiliation | Why Intensity 1 |
|--------|-------------|-----------------|
| Many CEOs/investors | Various | Occasional AI commentary in earnings calls, interviews |
| General economists | Various | Some AI-related analysis among broader work |

**Intensity 0 (Not AI)** - Never add:
- Authors who mention AI only in passing
- General business commentators without substantive AI analysis
- People famous for non-AI work who occasionally tweet about ChatGPT

#### How to Assess AI Intensity

Before adding an author, check:
1. **Publication history**: Do they have multiple AI-focused papers/articles?
2. **Newsletter/blog**: Is AI a regular topic or rare?
3. **Speaking engagements**: Do they speak at AI conferences?
4. **Research focus**: Is AI/ML a primary research area?
5. **Recent output**: Have they published AI content in the last 12 months?

**Rule of thumb**: If you can't find at least 3 substantive AI-focused pieces from the author, they're likely intensity 0-1.

### 5. Sources Format (JSONB)

**MINIMUM 3 SOURCES REQUIRED PER AUTHOR**

```json
[
  {
    "url": "https://example.com/book",
    "type": "Book",
    "year": "2023",
    "title": "Title of the Book"
  },
  {
    "url": "https://arxiv.org/abs/xxxx.xxxxx",
    "type": "Paper",
    "year": "2024",
    "title": "Research Paper Title"
  },
  {
    "url": "https://example.com/podcast",
    "type": "Podcast",
    "year": "2024",
    "title": "Podcast Name"
  }
]
```

**Source Types**:
- `Book` - Published books
- `Paper` - Research papers (arXiv, journals, conferences)
- `Podcast` - Regular podcast series
- `Blog` - Personal blog, Medium, Substack
- `YouTube` - YouTube channel
- `Research` - Research lab/institute
- `Organization` - Organization founded/led
- `Website` - Personal website

**Quality Requirements**:
- All URLs must be working (verify before adding)
- Mix of source types (not all the same type)
- At least one substantial source (book, research lab, or major paper)
- Prefer recent sources (last 3 years when possible)

---

## Camp Relationships

### Available Camps (Use These EXACT UUIDs)

⚠️ **CRITICAL**: Use the exact UUID values below. The SQL will fail if UUIDs don't match.

#### Domain: AI Technical Capabilities
| Camp Name | UUID | Description |
|-----------|------|-------------|
| **Scaling Will Deliver** | `c5dcb027-cd27-4c91-adb4-aca780d15199` | Bigger models + more data = continued progress toward AGI |
| **Needs New Approaches** | `207582eb-7b32-4951-9863-32fcf05944a1` | LLMs hit limits without embodiment, world models, causal reasoning |

#### Domain: AI & Society
| Camp Name | UUID | Description |
|-----------|------|-------------|
| **Safety First** | `7f64838f-59a6-4c87-8373-a023b9f448cc` | Prioritize safety, accountability, address social harms |
| **Democratize Fast** | `fe19ae2d-99f2-4c30-a596-c9cd92bff41b` | AI as democratization, speed and access over caution |

#### Domain: Enterprise AI Adoption
| Camp Name | UUID | Description |
|-----------|------|-------------|
| **Technology Leads** | `7e9a2196-71e7-423a-889c-6902bc678eac` | Build infrastructure first, culture follows success |
| **Co-Evolution** | `f19021ab-a8db-4363-adec-c2228dad6298` | People, process, tech must evolve together |
| **Business Whisperers** | `fe9464df-b778-44c9-9593-7fb3294fa6c3` | Translation between business and AI is the bottleneck |
| **Tech Builders** | `a076a4ce-f14c-47b5-ad01-c8c60135a494` | Just build great AI, adoption follows |

#### Domain: AI Governance & Oversight
| Camp Name | UUID | Description |
|-----------|------|-------------|
| **Innovation First** | `331b2b02-7f8d-4751-b583-16255a6feb50` | Industry should lead, over-regulation kills innovation |
| **Regulatory Interventionist** | `e8792297-e745-4c9f-a91d-4f87dd05cea2` | Strong government oversight needed NOW |
| **Adaptive Governance** | `ee10cf4f-025a-47fc-be20-33d6756ec5cd` | Light-touch, iterative regulation that co-evolves with tech |

#### Domain: Future of Work
| Camp Name | UUID | Description |
|-----------|------|-------------|
| **Displacement Realist** | `76f0d8c5-c9a8-4a26-ae7e-18f787000e18` | Significant job displacement, need policy interventions |
| **Human-AI Collaboration** | `d8d3cec4-f8ce-49b1-9a43-bb0d952db371` | AI augments humans, new job categories emerge |

### Relationship Requirements

**Each author needs 2-5 camp relationships** spanning multiple domains when appropriate.

For EACH camp relationship, provide:

| Field | Required | Length | Description |
|-------|----------|--------|-------------|
| `relevance` | YES | - | `strong`, `partial`, `challenges`, or `emerging` |
| `key_quote` | YES | 60-150 words | Domain-specific quote from this author |
| `quote_source_url` | YES | - | URL where quote appears |
| `why_it_matters` | YES | 80-180 words | Why this author matters in THIS domain |

### Relevance Levels

| Level | Meaning | Use When |
|-------|---------|----------|
| `strong` | Primary position, core advocate | Author is a leading voice for this position |
| `partial` | Secondary/nuanced position | Author has views here but it's not their focus |
| `challenges` | Opposes this camp | Author actively argues against this position |
| `emerging` | New/evolving position | Author recently started engaging with this topic |

---

## SQL Template

```sql
-- =====================================================
-- ADD NEW AUTHORS - [Date]
-- =====================================================

BEGIN;

-- =====================================================
-- 1. [AUTHOR NAME]
-- =====================================================

INSERT INTO authors (
  name,
  primary_affiliation,
  header_affiliation,
  notes,
  credibility_tier,
  author_type,
  sources
) VALUES (
  '[Full Name]',
  '[Full affiliation with role]',
  '[Short 1-2 word display]',
  '[2-3 sentences explaining their significance in AI discourse]',
  '[Seminal Thinker / Major Voice / Thought Leader]',
  '[researcher / practitioner / entrepreneur / policy / critic / journalist]',
  '[
    {
      "url": "https://example.com/source1",
      "type": "Book",
      "year": "2024",
      "title": "Primary Work Title"
    },
    {
      "url": "https://example.com/source2",
      "type": "Paper",
      "year": "2023",
      "title": "Important Research"
    },
    {
      "url": "https://example.com/source3",
      "type": "Podcast",
      "year": "2024",
      "title": "Regular Podcast"
    }
  ]'::jsonb
);

-- Camp Relationships for [AUTHOR NAME]
DO $$
DECLARE
  author_id uuid;
BEGIN
  SELECT id INTO author_id FROM authors WHERE name = '[Full Name]';

  -- Camp 1: [Domain] → [Camp Name] ([relevance])
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '[camp_uuid_from_table_above]',
    author_id,
    '[strong/partial/challenges/emerging]',
    '[Direct quote from the author about THIS specific topic. Must be 60-150 words, domain-specific, not a generic statement. Use single quotes escaped as two single quotes for apostrophes.]',
    '[URL where this quote can be found - should match one of their sources when possible]',
    '[Explain in 80-180 words why THIS author matters in THIS domain. Focus on their influence: who listens to them, what decisions they affect, how their position shapes the field. Be specific about impact, not just description.]'
  );

  -- Camp 2: [Domain] → [Camp Name] ([relevance])
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '[camp_uuid]',
    author_id,
    '[relevance]',
    '[Domain-specific quote for THIS camp]',
    '[Source URL]',
    '[Why it matters in THIS domain]'
  );

  -- Add more camps as needed (2-5 total per author)

END $$;

-- =====================================================
-- 2. [NEXT AUTHOR NAME]
-- =====================================================
-- Repeat the pattern above...

COMMIT;

-- =====================================================
-- VERIFICATION QUERIES (Run after commit)
-- =====================================================

-- Check all new authors were added
SELECT name, header_affiliation, credibility_tier,
       jsonb_array_length(sources) as source_count
FROM authors
WHERE name IN ('[Author 1]', '[Author 2]', '[Author 3]');

-- Count relationships per author
SELECT a.name, COUNT(ca.id) as camp_count
FROM authors a
JOIN camp_authors ca ON a.id = ca.author_id
WHERE a.name IN ('[Author 1]', '[Author 2]', '[Author 3]')
GROUP BY a.name
ORDER BY camp_count DESC;

-- Verify all have quotes and why_it_matters
SELECT
  a.name,
  COUNT(ca.id) as total_relationships,
  COUNT(ca.key_quote) as with_quotes,
  COUNT(ca.why_it_matters) as with_context
FROM authors a
JOIN camp_authors ca ON a.id = ca.author_id
WHERE a.name IN ('[Author 1]', '[Author 2]', '[Author 3]')
GROUP BY a.name;
```

---

## Per-Author Verification Checklist

**Run this checklist for EACH author before adding them to the SQL file.**

### Quick Pass/Fail (Stop if any fail)
- [ ] **Not already in database** (checked existing authors list)
- [ ] **AI Intensity ≥ 2** (or 1 if highly influential)
- [ ] **Can find 3+ working source URLs**
- [ ] **Can find verifiable quotes for each camp assignment**

### Author Verification
| Check | Verified? |
|-------|-----------|
| Name spelled correctly | ☐ |
| Current affiliation confirmed (checked website/LinkedIn) | ☐ |
| At least 3 sources with working URLs | ☐ |
| Each source URL tested and working | ☐ |

### Per-Camp Relationship Verification
For each camp this author is assigned to:

| Check | Verified? |
|-------|-----------|
| Quote is real (not fabricated) | ☐ |
| Quote found at the source URL | ☐ |
| Quote is specific to THIS camp/domain | ☐ |
| Source URL is working | ☐ |
| "Why it matters" explains their influence in THIS domain | ☐ |

### Deduplication Check (if author exists)
- [ ] Checked that this is a NEW perspective, not duplicate
- [ ] Quote is from different source than existing quotes
- [ ] Camp relationship doesn't already exist (or has new angle)

---

## Batch Quality Checklist

### Before Submission, Verify:

#### AI Intensity (CHECK FIRST)
- [ ] **Author has AI Intensity 2-3** (prioritize these)
- [ ] If intensity 1, author must be highly influential to justify inclusion
- [ ] **Never add intensity 0** (not AI-focused)
- [ ] Can find at least 3 substantive AI-focused pieces from this author
- [ ] Author has published AI content in the last 12-18 months

#### Author Profile
- [ ] Name is correct official spelling
- [ ] `primary_affiliation` is current (check their website/LinkedIn)
- [ ] `header_affiliation` is short (1-2 words max)
- [ ] `notes` explains significance in 2-3 sentences
- [ ] `credibility_tier` matches their actual influence
- [ ] `author_type` fits their primary role

#### Sources (CRITICAL)
- [ ] **Minimum 3 sources** per author
- [ ] All URLs are working (test each one!)
- [ ] Mix of source types (not all same type)
- [ ] At least one substantial source (book/research/org)
- [ ] Titles are accurate and descriptive
- [ ] Years are correct
- [ ] JSON format is valid (test with JSON validator)

#### Camp Relationships
- [ ] 2-5 camps per author (not too few, not too many)
- [ ] Camps span multiple domains when appropriate
- [ ] Relevance levels are accurate
- [ ] Each `key_quote` is domain-specific (NOT generic reused quotes)
- [ ] Quote source URLs are valid and match where quote appears
- [ ] Each `why_it_matters` explains influence in THAT specific domain

#### Technical
- [ ] SQL syntax is correct
- [ ] UUIDs exactly match camp IDs from table above
- [ ] JSONB format is valid
- [ ] Single quotes escaped properly (`''` for apostrophes in text)
- [ ] Transaction wrapped in BEGIN/COMMIT
- [ ] Verification queries included

---

## Common Mistakes to AVOID

| DON'T | DO |
|-------|-----|
| Add AI Intensity 0 authors | Only add authors with intensity 1-3 |
| Add intensity 1 without justification | Prioritize intensity 2-3; intensity 1 only if highly influential |
| **Fabricate quotes** | **Only use real, verifiable quotes** |
| **Use URLs without testing** | **Test every URL and verify quote is there** |
| **Duplicate existing authors** | **Check existing authors list first** |
| **Force authors into camps** | **Only assign if evidence exists** |
| Use `bio` field | Use `notes` field instead |
| Add `x_handle` or `linkedin_url` | These columns don't exist |
| Copy same quote across camps | Write unique domain-specific quotes |
| Use generic "why it matters" | Explain their specific influence in EACH domain |
| Skip sources | Sources are REQUIRED (min 3) |
| Use only 1-2 sources | Provide at least 3 diverse sources |
| Use broken/dead URLs | Test ALL URLs before submitting |
| Skip verification queries | Include them at the end |
| Use unescaped apostrophes | Escape as `''` (two single quotes) |
| Add same quote/source to existing author | Only add NEW perspectives/sources |

---

## Example: Complete Author Entry

```sql
-- =====================================================
-- GEOFFREY HINTON
-- =====================================================

INSERT INTO authors (
  name,
  primary_affiliation,
  header_affiliation,
  notes,
  credibility_tier,
  author_type,
  sources
) VALUES (
  'Geoffrey Hinton',
  'Professor Emeritus, University of Toronto; Former VP Engineering, Google',
  'U of Toronto',
  'Pioneer of deep learning and backpropagation. Turing Award winner (2018). Left Google in 2023 to speak freely about AI risks. His warnings about AI existential risk carry enormous weight given his foundational contributions to the field.',
  'Seminal Thinker',
  'researcher',
  '[
    {
      "url": "https://www.cs.toronto.edu/~hinton/",
      "type": "Website",
      "year": "2024",
      "title": "Geoffrey Hinton''s Homepage"
    },
    {
      "url": "https://www.nytimes.com/2023/05/01/technology/ai-google-chatbot-engineer-quits-hinton.html",
      "type": "Paper",
      "year": "2023",
      "title": "NYT Interview on Leaving Google"
    },
    {
      "url": "https://amturing.acm.org/award_winners/hinton_4791679.cfm",
      "type": "Research",
      "year": "2018",
      "title": "ACM Turing Award"
    },
    {
      "url": "https://www.youtube.com/watch?v=rGgGOccMEiY",
      "type": "YouTube",
      "year": "2023",
      "title": "MIT Technology Review Interview"
    }
  ]'::jsonb
);

DO $$
DECLARE
  hinton_id uuid;
BEGIN
  SELECT id INTO hinton_id FROM authors WHERE name = 'Geoffrey Hinton';

  -- AI Progress → Grounding Realists (partial - shifted view)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '207582eb-7b32-4951-9863-32fcf05944a1',
    hinton_id,
    'partial',
    'I used to think it was 30 to 50 years away. Now I think it might be 5 to 20 years away. These systems are getting smarter than us at a rate we didn''t expect. The worry is that once they''re smarter than us, they may have goals of their own.',
    'https://www.nytimes.com/2023/05/01/technology/ai-google-chatbot-engineer-quits-hinton.html',
    'Hinton co-invented backpropagation and deep learning, making him uniquely credible when expressing concerns about the technology he created. His 2023 departure from Google to speak freely transformed the safety discourse by validating concerns from within the technical establishment. When a Turing Award winner says "this is dangerous," policymakers and researchers listen.'
  );

  -- Society & Ethics → Ethical Stewards (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '7f64838f-59a6-4c87-8373-a023b9f448cc',
    hinton_id,
    'strong',
    'I left Google so I could talk about the dangers of AI without worrying about how it affects Google. These things could become more intelligent than us and could decide to take over. We need to take this seriously before it''s too late.',
    'https://www.nytimes.com/2023/05/01/technology/ai-google-chatbot-engineer-quits-hinton.html',
    'Hinton''s public conversion from AI optimist to safety advocate in 2023 was a watershed moment for AI ethics. His credibility as "godfather of deep learning" means his safety concerns cannot be dismissed as uninformed fear. His voice legitimizes safety research and influences both public opinion and policy discussions at the highest levels.'
  );

  -- Governance → Regulatory Interventionists (strong)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'e8792297-e745-4c9f-a91d-4f87dd05cea2',
    hinton_id,
    'strong',
    'Governments need to be involved. They need to regulate these things. The companies that are developing this will not voluntarily slow down because they''re in competition with each other. Only governments can make them all slow down together.',
    'https://www.youtube.com/watch?v=rGgGOccMEiY',
    'Hinton explicitly calls for government intervention because market competition prevents voluntary safety measures. His call for coordinated international regulation from someone who built the technology carries weight with policymakers crafting AI governance frameworks. His testimony influences legislative approaches in the US, UK, and EU.'
  );

END $$;
```

---

## Suggested Authors to Add

### Selection Criteria (in order of importance)

1. **AI Intensity 2-3** - Must have clear, recurring AI work
2. **Diverse perspectives** - Not just Silicon Valley, include global voices
3. **Different domains** - Balance technical, policy, business, economics, ethics
4. **Recent influence** - Active in 2023-2025 AI discourse
5. **Cross-domain impact** - Authors who span multiple camps

### Priority Candidates by AI Intensity

#### Intensity 3 (AI-Primary) - Add First
| Author | Affiliation | Evidence of AI Focus |
|--------|-------------|---------------------|
| Azeem Azhar | Exponential View | Major AI-focused newsletter; frequent AI landscape essays |
| Anton Korinek | UVA / Brookings | AI-and-economy academic papers + public essays |
| Anima Anandkumar | Caltech / NVIDIA | Large body of AI research publications |
| Jim Covello | Goldman Sachs | Research lead on high-profile genAI reports |
| Fei-Fei Li | Stanford HAI | Founded ImageNet, leads Stanford AI institute |
| Yoshua Bengio | Mila | Turing Award, prolific AI/ML research |
| Arvind Narayanan | Princeton | AI Snake Oil book, AI hype critique |
| Joy Buolamwini | Algorithmic Justice League | AI bias research and advocacy |
| Meredith Whittaker | Signal, AI Now | AI governance and policy focus |
| Clément Delangue | Hugging Face | Open-source AI platform leader |
| Arthur Mensch | Mistral | European AI lab founder |
| Jack Clark | Anthropic | AI safety research, policy advocacy |
| Connor Leahy | Conjecture | AI safety research and commentary |

#### Intensity 2 (AI-Recurring) - Strong Candidates
| Author | Affiliation | Evidence of AI Focus |
|--------|-------------|---------------------|
| Danielle Li | MIT Sloan | Peer-reviewed papers on genAI and productivity |
| Torsten Slok | Apollo | Recurring market notes on AI exposure/adoption |
| Michael Cembalest | J.P. Morgan | Deep genAI episodes/notes in market commentary |
| Bledi Taska | Lightcast | AI + labor market measurement publications |
| Erik Brynjolfsson | Stanford | AI and productivity research (also intensity 3) |
| Daron Acemoglu | MIT | AI and labor economics research |
| Carl Benedikt Frey | Oxford | Future of work and AI automation research |

#### Intensity 1 (AI-Occasional) - Only If Highly Influential
| Author | Affiliation | Notes |
|--------|-------------|-------|
| Major tech CEOs | Various | Include only if they've made substantive AI policy statements |
| Prominent investors | Various | Include only if they've published AI thesis/analysis |

### Never Add (Intensity 0)
- General business commentators without substantive AI analysis
- Authors who only mention AI in passing
- People famous for non-AI work who occasionally tweet about ChatGPT

---

## Submission Format

1. **File name**: `add_new_authors_YYYY-MM-DD.sql`
2. **Location**: Save to `/Docs/data/seed/`
3. **Include**:
   - Header comment with date and author count
   - All INSERT statements in transaction
   - Verification queries
   - Summary of what was added

---

## Testing the SQL

Before considering complete:

1. **Syntax check**: Run through a SQL validator
2. **JSON validation**: Validate all JSONB arrays
3. **URL verification**: Test every URL in a browser
4. **UUID verification**: Confirm all camp UUIDs match the table above exactly
5. **Quote verification**: Ensure quotes can be found at source URLs

---

## Questions?

If unclear about:
- Which camp an author belongs to → Check if they have public statements on that topic
- What credibility tier → Default to "Thought Leader" if uncertain
- Source requirements → When in doubt, add more sources
- Quote specificity → The quote should ONLY make sense in the context of THAT camp

**The goal is high-quality, verifiable data that enriches user understanding of AI discourse.**
