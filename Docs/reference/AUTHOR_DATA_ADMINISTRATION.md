# Author Data Administration Guide

**Version:** 1.0
**Last Updated:** 2025-12-10
**Purpose:** Complete reference for adding and updating author data in Supabase

---

## Table of Contents

1. [When to Use This Guide](#when-to-use-this-guide)
2. [Database Schema Overview](#database-schema-overview)
3. [Required Information](#required-information)
4. [Rules & Best Practices](#rules--best-practices)
5. [Camp Reference (UUIDs)](#camp-reference-uuids)
6. [SQL Templates](#sql-templates)
7. [Verification Queries](#verification-queries)
8. [Common Mistakes to Avoid](#common-mistakes-to-avoid)
9. [Batch Operations](#batch-operations)

---

## When to Use This Guide

**Use this guide for:** Adding **NEW authors** to the database

**Don't use this guide for:**
- Adding new publications to existing authors
- Updating quotes for existing authors
- Updating affiliations (job changes)
- Any updates to existing author data

**➡️ For updating existing authors, see:** [`UPDATING_EXISTING_AUTHORS.md`](./UPDATING_EXISTING_AUTHORS.md)

### **Quick Decision Tree**

```
Need to add information about a person?
├─ Is this person already in the database?
│  ├─ YES → Use UPDATING_EXISTING_AUTHORS.md
│  │  ├─ New publication? → Add to sources array
│  │  ├─ New quote? → Update camp_authors
│  │  ├─ Job change? → Update affiliations
│  │  └─ Profile improvements? → Update notes/bio
│  └─ NO → Use this guide (AUTHOR_DATA_ADMINISTRATION.md)
│     └─ Follow complete checklist below
```

---

## Database Schema Overview

### **Table Relationships**

```
domains (6 domains)
    ↓
dimensions (domain subdivisions)
    ↓
camps (16 thought leader camps)
    ↓
camp_authors (junction table) ← Links authors to camps
    ↓
authors (52+ authors)
```

### **Key Tables**

#### **`authors` Table**

```sql
CREATE TABLE authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  primary_affiliation TEXT,        -- Full organization name
  header_affiliation TEXT,          -- Short display version (e.g., "Stanford")
  notes TEXT,                       -- 2-3 sentence bio (NOT "bio" field!)
  credibility_tier TEXT,            -- See tiers below
  author_type TEXT,                 -- See types below
  sources JSONB,                    -- Array of source objects (min 3 required)
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Credibility Tiers:**
- `Major Voice` - Highly influential, shapes public discourse
- `Seminal Thinker` - Foundational contributions to the field
- `Thought Leader` - Recognized expert, regular contributor
- `Emerging Voice` - Rising influence
- `Practitioner` - Hands-on implementer

**Author Types:**
- `researcher` - Academic researchers
- `practitioner` - Industry practitioners
- `entrepreneur` - Startup founders, business leaders
- `policy` - Policy makers, regulators
- `critic` - Critics, ethicists
- `journalist` - Journalists, commentators
- `Academic` - Academic (legacy)
- `Industry Leader` - Industry leaders (legacy)

#### **`camp_authors` Table (Junction)**

```sql
CREATE TABLE camp_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  camp_id UUID NOT NULL REFERENCES camps(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  relevance TEXT DEFAULT 'strong',  -- strong | partial | challenges | emerging
  key_quote TEXT,                   -- Domain-specific quote (60-150 words)
  quote_source_url TEXT,            -- Direct link to quote source
  why_it_matters TEXT,              -- Explains significance (80-180 words)
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(camp_id, author_id)        -- One author per camp only
);
```

---

## Required Information

### **For Each New Author**

#### **1. Basic Profile (Required)**

| Field | Description | Example |
|-------|-------------|---------|
| `name` | Full official name | `"Jane Doe"` |
| `primary_affiliation` | Full current organization/role | `"Stanford University, Human-Centered AI Institute"` |
| `header_affiliation` | Short display version | `"Stanford"` |
| `notes` | 2-3 sentences on significance | `"Leading researcher in AI ethics..."` |
| `credibility_tier` | Influence level | `"Seminal Thinker"` |
| `author_type` | Professional category | `"researcher"` |

#### **2. Sources (Minimum 3 Required)**

Each author MUST have at least 3 relevant sources in JSONB format:

```json
[
  {
    "url": "https://example.com/research-lab",
    "type": "Research",
    "year": "2024",
    "title": "AI Ethics Research Lab"
  },
  {
    "url": "https://example.com/book",
    "type": "Book",
    "year": "2023",
    "title": "The Future of Responsible AI"
  },
  {
    "url": "https://example.com/podcast",
    "type": "Podcast",
    "year": "2024",
    "title": "Weekly AI Ethics Podcast"
  }
]
```

**Valid Source Types:**
- `Book` - Published books
- `Paper` - Research papers (arXiv, journals)
- `Podcast` - Regular podcast series
- `Blog` - Blog/Substack
- `YouTube` - YouTube channel
- `Research` - Research lab/institute
- `Organization` - Organization they lead/founded
- `Website` - Personal website

**Source Quality Standards:**
- ✅ URLs must be working and relevant
- ✅ Mix of source types (not all podcasts)
- ✅ At least one substantial source (book, research, organization)
- ✅ Prefer recent sources (last 3 years when possible)
- ✅ Titles should be clear and descriptive

#### **3. Camp Relationships (1-5 per Author)**

**Mapping Guidelines:**
- **Specialists** (Business practitioners, domain experts): May have strong opinions in just **1-2 camps**
  - Example: CFO focused only on "Proof Seekers" in Enterprise Transformation
  - Example: CTO focused on "Tech-First" and "Tech Builders"
- **Broad Thinkers** (Academics, policy makers, researchers): Often span **3-5 camps** across domains
  - Example: AI safety researcher might map to Technical Capabilities, Society & Ethics, and Governance
  - Example: Labor economist might map to Future of Work, Society & Ethics, and Governance

**Quality over Quantity:** Better to have 1 strong, well-documented camp relationship than 5 weak ones.

**Real-World Examples:**

| Author Type | Role | # Camps | Camp Focus |
|-------------|------|---------|------------|
| **CFO** | Finance executive | 1 | Proof Seekers (Enterprise) |
| **CTO** | Technical leader | 2 | Tech-First, Tech Builders (Enterprise) |
| **AI Researcher** | Academic | 4 | Scaling Maximalists, Ethical Stewards, Adaptive Governance, Human-AI Collaboration |
| **Policy Maker** | Government | 3 | Regulatory Interventionists, Adaptive Governance, Displacement Realists |
| **Business Consultant** | Practitioner | 2 | Co-Evolution, Business Whisperers (Enterprise) |
| **AI Safety Researcher** | Academic | 5 | Grounding Realists, Ethical Stewards, Regulatory Interventionists, Adaptive Governance, Displacement Realists |

**Per Camp Requirements:**

| Field | Requirement | Word Count |
|-------|-------------|------------|
| `relevance` | `strong` \| `partial` \| `challenges` \| `emerging` | N/A |
| `key_quote` | Domain-specific quote, actual words from author | 60-150 words |
| `quote_source_url` | Direct link to where quote appears | N/A |
| `why_it_matters` | Explains their influence in this domain | 80-180 words |

---

## Rules & Best Practices

### **✅ DO's**

1. **Always use transactions**
   ```sql
   BEGIN;
   -- Your inserts here
   COMMIT;
   ```

2. **Include minimum 3 sources per author**
   - Mix types (Book + Podcast + Research, not 3 Podcasts)
   - At least one substantial source

3. **Map each author to camps based on their expertise**
   - **Specialists** (business practitioners, CTOs, CFOs): 1-2 camps focused on their domain
   - **Broad thinkers** (academics, researchers, policy makers): 3-5 camps across domains
   - Quality over quantity - only map where they have genuine expertise
   - Each camp needs its own contextual quote

4. **Use exact camp UUIDs**
   - Reference the [Camp Reference](#camp-reference-uuids) section
   - Never make up UUIDs

5. **Provide camp-specific quotes**
   - Each camp relationship needs unique, contextual content
   - Quotes should reflect the author's stance on THAT domain

6. **Use `notes` field for bio**
   - The `bio` field does NOT exist
   - Always use `notes`

7. **Include both affiliations**
   - `primary_affiliation` - Full name: "Stanford University, HAI"
   - `header_affiliation` - Short: "Stanford"

8. **Handle conflicts gracefully**
   ```sql
   ON CONFLICT (camp_id, author_id) DO NOTHING;
   ```

9. **Run verification queries after each batch**
   - Check camp counts
   - Verify sources exist
   - Confirm quotes are populated

### **❌ DON'Ts**

1. **Never hardcode author UUIDs**
   - Let the database generate them with `DEFAULT gen_random_uuid()`

2. **Don't skip sources**
   - Authors without sources won't display properly in the UI
   - Minimum 3 required

3. **Don't reuse generic quotes**
   - Each camp needs domain-specific content
   - Quote must reflect the author's actual position on that topic

4. **Don't add to non-existent camps**
   - Always verify camp UUIDs from the reference table below

5. **Don't use `bio` field**
   - This field doesn't exist in the schema
   - Use `notes` instead

6. **Don't skip `why_it_matters`**
   - Critical for the Mini Brain feature
   - Explains concrete impact/influence

7. **Don't violate unique constraint**
   - One author can only map to each camp once
   - Use `ON CONFLICT` to handle duplicates

8. **Don't add authors without camp mappings**
   - Every author should belong to at least 1 camp
   - Map only where they have genuine, documented expertise

9. **Don't force multiple camp mappings for specialists**
   - If a CFO only talks about ROI and measurement, 1 camp is fine
   - Don't invent positions they don't actually hold
   - Resist the urge to "fill out" their profile artificially

---

## Camp Reference (UUIDs)

**IMPORTANT:** These are fixed UUIDs. Do not modify or create new ones.

### **Domain: AI Technical Capabilities**

| Camp Name | UUID | Description |
|-----------|------|-------------|
| **Scaling Maximalists** | `c5dcb027-cd27-4c91-adb4-aca780d15199` | Believe scaling laws will deliver AGI |
| **Grounding Realists** | `207582eb-7b32-4951-9863-32fcf05944a1` | Skeptical of pure scaling; need new approaches |

### **Domain: AI & Society (Society & Ethics)**

| Camp Name | UUID | Description |
|-----------|------|-------------|
| **Ethical Stewards** | `7f64838f-59a6-4c87-8373-a023b9f448cc` | Focus on harms, ethics, power dynamics |
| **Tech Utopians** | `fe19ae2d-99f2-4c30-a596-c9cd92bff41b` | Optimistic about AI democratization |

### **Domain: Enterprise Transformation**

| Camp Name | UUID | Description |
|-----------|------|-------------|
| **Tech-First** | `7e9a2196-71e7-423a-889c-6902bc678eac` | Infrastructure first; culture follows |
| **Co-Evolution** | `f19021ab-a8db-4363-adec-c2228dad6298` | People, process, tech evolve together |
| **Business Whisperers** | `fe9464df-b778-44c9-9593-7fb3294fa6c3` | Translate AI to business outcomes |
| **Tech Builders** | `a076a4ce-f14c-47b5-ad01-c8c60135a494` | Hands-on infrastructure builders |

### **Domain: Governance & Oversight**

| Camp Name | UUID | Description |
|-----------|------|-------------|
| **Regulatory Interventionists** | `e8792297-e745-4c9f-a91d-4f87dd05cea2` | Strong government oversight needed now |
| **Innovation-First** | `331b2b02-7f8d-4751-b583-16255a6feb50` | Industry should lead; minimal regulation |
| **Adaptive Governance** | `ee10cf4f-025a-47fc-be20-33d6756ec5cd` | Iterative, co-evolving regulation |

### **Domain: Future of Work**

| Camp Name | UUID | Description |
|-----------|------|-------------|
| **Displacement Realists** | `76f0d8c5-c9a8-4a26-ae7e-18f787000e18` | Acknowledge structural job displacement |
| **Human-AI Collaboration** | `d8d3cec4-f8ce-49b1-9a43-bb0d952db371` | AI augments human capability |

---

## SQL Templates

### **Template 1: Single Author with Multiple Camps**

```sql
-- =====================================================
-- AUTHOR: [Full Name]
-- =====================================================

BEGIN;

-- Step 1: Insert Author Profile with Sources
INSERT INTO authors (
  name,
  primary_affiliation,
  header_affiliation,
  notes,
  credibility_tier,
  author_type,
  sources
) VALUES (
  'Jane Doe',
  'Stanford University, Human-Centered AI Institute',
  'Stanford',
  'Leading researcher in AI ethics and safety. Her work on algorithmic fairness has shaped industry standards and policy recommendations across multiple governments.',
  'Seminal Thinker',
  'researcher',
  '[
    {
      "url": "https://example.com/research-lab",
      "type": "Research",
      "year": "2024",
      "title": "AI Ethics Lab"
    },
    {
      "url": "https://example.com/book",
      "type": "Book",
      "year": "2023",
      "title": "The Future of Responsible AI"
    },
    {
      "url": "https://example.com/podcast",
      "type": "Podcast",
      "year": "2024",
      "title": "AI Ethics Weekly"
    }
  ]'::jsonb
);

-- Step 2: Map to Relevant Camps
DO $$
DECLARE
  author_id uuid;
BEGIN
  SELECT id INTO author_id FROM authors WHERE name = 'Jane Doe';

  -- Camp 1: Ethical Stewards (strong relevance)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '7f64838f-59a6-4c87-8373-a023b9f448cc',
    author_id,
    'strong',
    'AI systems must be designed with accountability built in from the start. We cannot retrofit ethics after deployment—the power structures and biases become embedded in the architecture itself.',
    'https://example.com/interview-2024',
    'Jane Doe has influenced EU AI Act provisions and advises multiple governments on AI safety standards. Her research on algorithmic accountability is cited in over 200 policy documents worldwide.'
  );

  -- Camp 2: Adaptive Governance (partial relevance)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'ee10cf4f-025a-47fc-be20-33d6756ec5cd',
    author_id,
    'partial',
    'Regulation needs to evolve with technology, but that doesn''t mean waiting. We need frameworks that are flexible yet enforceable, adapting to new capabilities while maintaining core safety principles.',
    'https://example.com/policy-paper-2024',
    'Bridges the gap between tech optimists and interventionists. Her framework for adaptive AI governance has been adopted by the OECD and several national AI strategies.'
  );

  -- Camp 3: Human-AI Collaboration (strong relevance)
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    'd8d3cec4-f8ce-49b1-9a43-bb0d952db371',
    author_id,
    'strong',
    'The future of work isn''t humans OR AI—it''s humans WITH AI. We need to design systems that amplify human judgment and creativity, not replace it. The best outcomes come from thoughtful collaboration.',
    'https://example.com/future-of-work-paper',
    'Her research on human-AI collaboration has influenced product design at major tech companies. She advises Fortune 500 companies on ethical AI integration into workflows.'
  );

END $$;

COMMIT;

-- Verification
SELECT
  a.name,
  a.header_affiliation,
  a.credibility_tier,
  jsonb_array_length(a.sources) as source_count,
  COUNT(ca.id) as camp_count,
  STRING_AGG(c.name, ', ') as camps
FROM authors a
LEFT JOIN camp_authors ca ON a.id = ca.author_id
LEFT JOIN camps c ON ca.camp_id = c.id
WHERE a.name = 'Jane Doe'
GROUP BY a.id, a.name, a.header_affiliation, a.credibility_tier, a.sources;
```

### **Template 2: Multiple Authors in One Batch**

```sql
-- =====================================================
-- BATCH: Multiple Authors
-- =====================================================

BEGIN;

-- Step 1: Insert Multiple Authors
INSERT INTO authors (name, primary_affiliation, header_affiliation, notes, credibility_tier, author_type, sources)
VALUES
  (
    'John Smith',
    'MIT Media Lab',
    'MIT',
    'Pioneering work in human-computer interaction and AI interfaces. His lab has produced breakthrough research in natural language interaction.',
    'Thought Leader',
    'researcher',
    '[
      {"url": "https://mit.edu/smith", "type": "Research", "year": "2024", "title": "MIT Media Lab"},
      {"url": "https://example.com/book1", "type": "Book", "year": "2022", "title": "Designing AI Interfaces"},
      {"url": "https://example.com/papers", "type": "Paper", "year": "2023", "title": "HCI Research Papers"}
    ]'::jsonb
  ),
  (
    'Sarah Johnson',
    'OpenAI Policy Team',
    'OpenAI',
    'Leading voice in AI policy and governance. Former government advisor now shaping industry self-regulation standards.',
    'Major Voice',
    'policy',
    '[
      {"url": "https://openai.com/policy", "type": "Organization", "year": "2024", "title": "OpenAI Policy"},
      {"url": "https://example.com/blog", "type": "Blog", "year": "2024", "title": "AI Policy Blog"},
      {"url": "https://example.com/book2", "type": "Book", "year": "2023", "title": "Governing AI"}
    ]'::jsonb
  );

-- Step 2: Map All Relationships
DO $$
DECLARE
  smith_id uuid;
  johnson_id uuid;
BEGIN
  SELECT id INTO smith_id FROM authors WHERE name = 'John Smith';
  SELECT id INTO johnson_id FROM authors WHERE name = 'Sarah Johnson';

  -- John Smith mappings
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES
    (
      'f19021ab-a8db-4363-adec-c2228dad6298', -- Co-Evolution
      smith_id,
      'strong',
      'Technology and humans must adapt together. The best AI systems are designed WITH users, not FOR users. Co-design creates better outcomes than top-down deployment.',
      'https://example.com/smith-interview',
      'Smith''s research at MIT has influenced how major companies approach AI product development. His co-design methodology is used by Google, Microsoft, and Meta.'
    ),
    (
      'd8d3cec4-f8ce-49b1-9a43-bb0d952db371', -- Human-AI Collaboration
      smith_id,
      'strong',
      'The interface between humans and AI is where the magic happens. We need to design collaboration tools, not automation tools. The goal is augmentation.',
      'https://example.com/smith-paper',
      'Pioneered interaction paradigms now standard in ChatGPT, Claude, and Copilot. His lab''s research shapes how millions interact with AI daily.'
    );

  -- Sarah Johnson mappings
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES
    (
      'ee10cf4f-025a-47fc-be20-33d6756ec5cd', -- Adaptive Governance
      johnson_id,
      'strong',
      'We need regulation that learns as fast as the technology does. Rigid rules will fail. Adaptive frameworks with clear principles and iterative refinement are the path forward.',
      'https://example.com/johnson-testimony',
      'Johnson advises the White House, EU Commission, and UK Parliament on AI policy. Her adaptive governance framework has been adopted by 15+ countries.'
    ),
    (
      'e8792297-e745-4c9f-a91d-4f87dd05cea2', -- Regulatory Interventionists
      johnson_id,
      'partial',
      'While I believe in adaptive approaches, we cannot wait for harms to materialize. Some proactive safeguards are essential, especially for high-risk applications.',
      'https://example.com/johnson-oped',
      'Bridges industry and government perspectives. Her nuanced position influences both tech companies and regulators, making her a key voice in policy debates.'
    );

END $$;

COMMIT;

-- Verification
SELECT
  a.name,
  a.header_affiliation,
  jsonb_array_length(a.sources) as sources,
  COUNT(ca.id) as camps
FROM authors a
LEFT JOIN camp_authors ca ON a.id = ca.author_id
WHERE a.name IN ('John Smith', 'Sarah Johnson')
GROUP BY a.id;
```

---

## Verification Queries

### **Check All Authors and Camp Counts**

```sql
SELECT
  a.name,
  a.header_affiliation,
  a.credibility_tier,
  jsonb_array_length(a.sources) as source_count,
  COUNT(ca.id) as camp_count
FROM authors a
LEFT JOIN camp_authors ca ON a.id = ca.author_id
GROUP BY a.id
ORDER BY a.name;
```

### **Find Authors Missing Camp Relationships**

```sql
-- Authors with NO camp mappings (should be rare)
SELECT
  name,
  header_affiliation,
  credibility_tier,
  author_type
FROM authors a
WHERE NOT EXISTS (
  SELECT 1 FROM camp_authors WHERE author_id = a.id
);
```

### **Find Authors with Only 1 Camp (Specialists)**

```sql
-- This is VALID for business practitioners, but flag for review
SELECT
  a.name,
  a.header_affiliation,
  a.author_type,
  COUNT(ca.id) as camp_count,
  STRING_AGG(c.name, ', ') as camps
FROM authors a
LEFT JOIN camp_authors ca ON a.id = ca.author_id
LEFT JOIN camps c ON ca.camp_id = c.id
GROUP BY a.id
HAVING COUNT(ca.id) = 1
ORDER BY a.author_type, a.name;
```

### **Find Authors with Fewer Than 3 Sources**

```sql
SELECT
  name,
  header_affiliation,
  jsonb_array_length(sources) as source_count
FROM authors
WHERE jsonb_array_length(sources) < 3 OR sources IS NULL
ORDER BY source_count NULLS FIRST;
```

### **Find Camp Relationships Missing Quotes**

```sql
SELECT
  a.name as author,
  c.name as camp,
  CASE
    WHEN ca.key_quote IS NULL THEN '❌ No quote'
    WHEN ca.quote_source_url IS NULL THEN '⚠️  No source URL'
    ELSE '✅ Complete'
  END as status
FROM camp_authors ca
JOIN authors a ON ca.author_id = a.id
JOIN camps c ON ca.camp_id = c.id
WHERE ca.key_quote IS NULL OR ca.quote_source_url IS NULL
ORDER BY a.name, c.name;
```

### **Get Complete Author Profile**

```sql
SELECT
  a.name,
  a.primary_affiliation,
  a.header_affiliation,
  a.notes,
  a.credibility_tier,
  a.author_type,
  jsonb_pretty(a.sources) as sources,
  COUNT(ca.id) as camp_count,
  STRING_AGG(c.name, ', ' ORDER BY c.name) as camps
FROM authors a
LEFT JOIN camp_authors ca ON a.id = ca.author_id
LEFT JOIN camps c ON ca.camp_id = c.id
WHERE a.name = 'YOUR_AUTHOR_NAME'
GROUP BY a.id;
```

### **Check for Duplicate Author Names**

```sql
SELECT
  name,
  COUNT(*) as count
FROM authors
GROUP BY name
HAVING COUNT(*) > 1;
```

---

## Common Mistakes to Avoid

### **1. Using `bio` Instead of `notes`**

❌ **Wrong:**
```sql
INSERT INTO authors (name, bio, ...) VALUES ('Jane Doe', 'Bio text...', ...);
```

✅ **Correct:**
```sql
INSERT INTO authors (name, notes, ...) VALUES ('Jane Doe', 'Bio text...', ...);
```

### **2. Hardcoding Author UUIDs**

❌ **Wrong:**
```sql
INSERT INTO authors (id, name, ...) VALUES ('12345678-1234-1234-1234-123456789012', 'Jane Doe', ...);
```

✅ **Correct:**
```sql
INSERT INTO authors (name, ...) VALUES ('Jane Doe', ...);
-- Let database generate UUID automatically
```

### **3. Missing Transaction Blocks**

❌ **Wrong:**
```sql
INSERT INTO authors (...) VALUES (...);
-- If this fails, partial data remains
INSERT INTO camp_authors (...) VALUES (...);
```

✅ **Correct:**
```sql
BEGIN;
INSERT INTO authors (...) VALUES (...);
INSERT INTO camp_authors (...) VALUES (...);
COMMIT;
-- All or nothing
```

### **4. Reusing Generic Quotes Across Camps**

❌ **Wrong:**
```sql
-- Same quote for Ethical Stewards and Adaptive Governance
INSERT INTO camp_authors (camp_id, author_id, key_quote, ...) VALUES
  ('7f64838f-59a6-4c87-8373-a023b9f448cc', author_id, 'AI is important...', ...),
  ('ee10cf4f-025a-47fc-be20-33d6756ec5cd', author_id, 'AI is important...', ...);
```

✅ **Correct:**
```sql
-- Domain-specific quotes
INSERT INTO camp_authors (camp_id, author_id, key_quote, ...) VALUES
  ('7f64838f-59a6-4c87-8373-a023b9f448cc', author_id, 'We must prioritize AI safety and ethics from day one...', ...),
  ('ee10cf4f-025a-47fc-be20-33d6756ec5cd', author_id, 'Adaptive governance frameworks can evolve with technology...', ...);
```

### **5. Forgetting to Escape Single Quotes in SQL Strings**

❌ **Wrong:**
```sql
'We can't ignore AI safety'  -- This will cause syntax error
```

✅ **Correct:**
```sql
'We can''t ignore AI safety'  -- Double single quotes to escape
```

### **6. Adding Author Without Sources**

❌ **Wrong:**
```sql
INSERT INTO authors (name, primary_affiliation, notes, credibility_tier, author_type)
VALUES ('Jane Doe', 'Stanford', 'Leading researcher...', 'Thought Leader', 'researcher');
-- No sources field = won't display properly in UI
```

✅ **Correct:**
```sql
INSERT INTO authors (name, primary_affiliation, notes, credibility_tier, author_type, sources)
VALUES (
  'Jane Doe',
  'Stanford',
  'Leading researcher...',
  'Thought Leader',
  'researcher',
  '[{"url": "...", "type": "Research", "year": "2024", "title": "..."}]'::jsonb
);
```

---

## Batch Operations

### **Strategy: Economical & Holistic Approach**

For adding multiple authors efficiently:

1. **Plan the batch**: List all authors and their camp mappings
2. **Insert all authors in one statement**: More efficient than individual inserts
3. **Map all relationships in one DO block**: Fewer database round trips
4. **Use ON CONFLICT for idempotency**: Safe to re-run if needed
5. **Verify after completion**: Run verification queries

### **Example: Adding 5 Authors**

```sql
BEGIN;

-- Step 1: Bulk insert authors
INSERT INTO authors (name, primary_affiliation, header_affiliation, notes, credibility_tier, author_type, sources)
VALUES
  ('Author 1', '...', '...', '...', 'Thought Leader', 'researcher', '[...]'::jsonb),
  ('Author 2', '...', '...', '...', 'Major Voice', 'practitioner', '[...]'::jsonb),
  ('Author 3', '...', '...', '...', 'Seminal Thinker', 'entrepreneur', '[...]'::jsonb),
  ('Author 4', '...', '...', '...', 'Thought Leader', 'policy', '[...]'::jsonb),
  ('Author 5', '...', '...', '...', 'Emerging Voice', 'critic', '[...]'::jsonb);

-- Step 2: Bulk map relationships
DO $$
DECLARE
  a1_id uuid; a2_id uuid; a3_id uuid; a4_id uuid; a5_id uuid;
BEGIN
  SELECT id INTO a1_id FROM authors WHERE name = 'Author 1';
  SELECT id INTO a2_id FROM authors WHERE name = 'Author 2';
  SELECT id INTO a3_id FROM authors WHERE name = 'Author 3';
  SELECT id INTO a4_id FROM authors WHERE name = 'Author 4';
  SELECT id INTO a5_id FROM authors WHERE name = 'Author 5';

  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES
    -- Author 1 camps
    ('camp-uuid-1', a1_id, 'strong', 'Quote...', 'URL...', 'Why it matters...'),
    ('camp-uuid-2', a1_id, 'partial', 'Quote...', 'URL...', 'Why it matters...'),
    -- Author 2 camps
    ('camp-uuid-3', a2_id, 'strong', 'Quote...', 'URL...', 'Why it matters...'),
    ('camp-uuid-4', a2_id, 'strong', 'Quote...', 'URL...', 'Why it matters...'),
    -- Author 3 camps
    ('camp-uuid-1', a3_id, 'strong', 'Quote...', 'URL...', 'Why it matters...'),
    ('camp-uuid-5', a3_id, 'partial', 'Quote...', 'URL...', 'Why it matters...'),
    -- Author 4 camps
    ('camp-uuid-6', a4_id, 'strong', 'Quote...', 'URL...', 'Why it matters...'),
    ('camp-uuid-7', a4_id, 'strong', 'Quote...', 'URL...', 'Why it matters...'),
    -- Author 5 camps
    ('camp-uuid-8', a5_id, 'emerging', 'Quote...', 'URL...', 'Why it matters...'),
    ('camp-uuid-9', a5_id, 'partial', 'Quote...', 'URL...', 'Why it matters...')
  ON CONFLICT (camp_id, author_id) DO NOTHING;

END $$;

COMMIT;

-- Verification
SELECT
  a.name,
  COUNT(ca.id) as camps,
  jsonb_array_length(a.sources) as sources
FROM authors a
LEFT JOIN camp_authors ca ON a.id = ca.author_id
WHERE a.name IN ('Author 1', 'Author 2', 'Author 3', 'Author 4', 'Author 5')
GROUP BY a.id
ORDER BY a.name;
```

---

## Checklist Before Running SQL

Before executing any author insertion script, verify:

- [ ] All author names are unique (check for duplicates)
- [ ] Each author has 3+ sources in JSONB format
- [ ] Each author maps to appropriate number of camps (1-5 based on expertise)
  - [ ] Business practitioners: 1-2 camps (domain-specific)
  - [ ] Academics/researchers: 3-5 camps (cross-domain)
- [ ] All camp UUIDs are from the [Camp Reference](#camp-reference-uuids) table
- [ ] Each camp relationship has unique, contextual quotes
- [ ] Each camp relationship has `why_it_matters` text
- [ ] All quotes have source URLs
- [ ] SQL is wrapped in `BEGIN; ... COMMIT;` transaction
- [ ] Single quotes in text are escaped (`''`)
- [ ] JSONB is properly formatted with `'[...]'::jsonb`
- [ ] Verification query is included at the end

---

## Support & Questions

**Primary Contact:** Database Administrator
**Schema Documentation:** `/Docs/database/compass_taxonomy_schema_Nov11.sql`

**Related Documentation:**
- **[UPDATING_EXISTING_AUTHORS.md](./UPDATING_EXISTING_AUTHORS.md)** - How to update existing authors (publications, quotes, affiliations)
- **[AUTHOR_ADDITION_GUIDE.md](./AUTHOR_ADDITION_GUIDE.md)** - Additional author addition guidance

**Related Files:**
- `/Docs/database/schema.sql` - Deprecated old schema (reference only)
- `/Docs/data/seed/03_seed_authors_and_relationships.sql` - Initial seed data
- `/lib/api/thought-leaders.ts` - API queries (shows how data is used)
- `/components/AuthorProfile.tsx` - UI component (shows required fields)

---

**Document Version History:**
- v1.0 (2025-12-10) - Initial comprehensive guide created
