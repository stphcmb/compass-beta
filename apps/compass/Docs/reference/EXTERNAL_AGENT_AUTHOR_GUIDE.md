# Author Data Guide for External AI Agents

> **Purpose:** This guide enables AI agents (ChatGPT, Gemini, Claude, etc.) to research AI thought leaders and produce ready-to-run SQL scripts for the Compass database.
>
> **Output Format:** PostgreSQL-compatible SQL scripts
>
> **Version:** 1.2 | Last Updated: 2026-01-08

---

## Table of Contents

1. [Input/Output Specification](#inputoutput-specification)
2. [Your Research Process](#your-research-process)
3. [Database Schema](#database-schema)
4. [Camp Reference (MANDATORY UUIDs)](#camp-reference-mandatory-uuids)
5. [How to Map Authors to Camps](#how-to-map-authors-to-camps)
6. [Field Specifications](#field-specifications)
7. [SQL Syntax Rules](#sql-syntax-rules)
8. [Templates](#templates)
9. [Quality Standards](#quality-standards)
10. [Validation Checklist](#validation-checklist)
11. [Examples: Good vs Bad](#examples-good-vs-bad)
12. [Common Mistakes to Avoid](#common-mistakes-to-avoid)
13. [Complete Worked Example](#complete-worked-example)

---

## Input/Output Specification

### What You Will Receive (INPUT)

You will receive ONE of these request types:

**Type 1: Add New Author**
```
Add [AUTHOR NAME] to the database.
```

**Type 2: Update Existing Author**
```
Update [AUTHOR NAME] with their recent work on [TOPIC].
```

**Type 3: Research and Add Multiple Authors**
```
Research and add authors who are experts on [TOPIC].
```

**That's it.** You must do all the research yourself to:
- Find their affiliation, credentials, and background
- Find 3+ verifiable sources (books, papers, talks, etc.)
- Find real quotes with source URLs
- Determine which camps (1-5) they belong to based on their documented positions
- Write editorial context explaining why their views matter

### What You Must Produce (OUTPUT)

Your response must contain THREE parts in this exact order:

```
## 1. Research Summary

[2-4 sentences summarizing who this person is and what you found]

## 2. Camp Analysis

[For each camp you're mapping them to, explain WHY based on evidence]

| Camp | Relevance | Evidence |
|------|-----------|----------|
| [Camp Name] | strong/partial/challenges/emerging | [What they said/wrote that justifies this] |

## 3. SQL Script

[Complete, ready-to-run SQL wrapped in BEGIN/COMMIT]
```

### Critical Requirements

1. **DO YOUR OWN RESEARCH** - Find real information, don't make it up
2. **FIND REAL QUOTES** - Every quote must be something they actually said
3. **VERIFY SOURCES EXIST** - Only use URLs that actually work
4. **DETERMINE CAMPS YOURSELF** - Based on their documented positions
5. **USE EXACT UUIDs** - From the reference table below (no exceptions)

---

## Your Research Process

Follow these steps IN ORDER for every author:

### Step 1: Identify the Person (2 min)

Research and confirm:
- [ ] Full official name (as they publish/present)
- [ ] Current organization and role
- [ ] Why they're notable in AI (credentials, achievements)

**Where to look:** Wikipedia, LinkedIn, organizational website, Google Scholar

### Step 2: Find Sources (5 min)

Find **at least 3** substantial sources. Prioritize:
1. Books they've written
2. Research papers (Google Scholar, arXiv, Semantic Scholar)
3. Podcasts/interviews where they speak at length
4. Blog posts or newsletters they write
5. YouTube talks or lectures
6. Their organizational/personal website

**Requirements:**
- All URLs must be REAL and currently accessible
- Mix of source types (not all podcasts)
- At least one substantial source (book, paper, major talk)
- Prefer recent (last 3 years) but include seminal older work

### Step 3: Find Real Quotes (10 min)

For EACH camp you will map them to, find a **real quote** they actually said.

**Where to find quotes:**
- Direct from their blog/newsletter
- Transcripts of podcasts/interviews
- Their Twitter/X posts
- Published interviews in media
- Their books or papers (direct excerpts)

**Quote requirements:**
- Must be their actual words (not paraphrased)
- Must be verifiable at a URL you can provide
- 60-150 words (1-3 sentences)
- Specific to the topic/camp (not generic)

**If you cannot find a real quote:**
- Do NOT make one up
- Do NOT map them to that camp
- Only map to camps where you have evidence

### Step 4: Determine Camp Mappings (5 min)

Based on your research, determine which camps (1-5) this author belongs to.

**Decision process:**
1. Read through their quotes, papers, talks
2. Identify their positions on key AI debates
3. Match positions to the camp descriptions below
4. Assign relevance level based on how central this view is to their work

**Relevance levels:**
| Level | Use when... |
|-------|-------------|
| `strong` | This is their PRIMARY position, they're a leading voice |
| `partial` | They hold this view but it's not their main focus |
| `challenges` | They OPPOSE this camp's position |
| `emerging` | They've recently started expressing this view |

### Step 5: Write Editorial Context (5 min)

For each camp mapping, write "why it matters" (80-180 words) explaining:
- What credentials make their view significant
- What influence they have (papers cited, followers, positions held)
- Why this perspective matters in the broader AI debate

### Step 6: Compile SQL (5 min)

Use the templates below to produce the final SQL script.

---

## Database Schema

### Tables Overview

```
┌─────────────────────────┐
│       authors           │  ← Author profile (1 row per person)
├─────────────────────────┤
│ id (UUID, auto)         │
│ name (TEXT, required)   │
│ primary_affiliation     │
│ header_affiliation      │
│ notes                   │
│ credibility_tier        │
│ author_type             │
│ sources (JSONB array)   │
│ key_quote               │  ← General quote about AI
│ quote_source_url        │
│ created_at, updated_at  │
└─────────────────────────┘
           │
           │ author_id
           ▼
┌─────────────────────────┐
│     camp_authors        │  ← Junction table (1 row per author-camp pair)
├─────────────────────────┤
│ id (UUID, auto)         │
│ author_id (UUID, FK)    │
│ camp_id (UUID, FK)      │
│ relevance               │
│ key_quote               │  ← Domain-specific quote for this camp
│ quote_source_url        │
│ why_it_matters          │
└─────────────────────────┘
           │
           │ camp_id
           ▼
┌─────────────────────────┐
│        camps            │  ← Reference table (DO NOT MODIFY)
├─────────────────────────┤
│ id (UUID)               │
│ label                   │
│ description             │
│ domain_id               │
└─────────────────────────┘
```

### Key Relationships

- One author can belong to **1-5 camps** (via camp_authors)
- Each camp_authors row has its **own quote** (domain-specific)
- The authors table also has a **general quote** (key_quote)
- **Both levels of quotes are required**

---

## Camp Reference (MANDATORY UUIDs)

**CRITICAL: Use these EXACT UUIDs. Do not generate new ones.**

### Domain 1: AI Technical Capabilities

| Camp Label | UUID | Use When Author Believes... |
|------------|------|----------------------------|
| **Scaling Will Deliver** | `c5dcb027-cd27-4c91-adb4-aca780d15199` | More compute/data → AGI; scaling laws continue |
| **Needs New Approaches** | `207582eb-7b32-4951-9863-32fcf05944a1` | Need new architectures, embodiment, world models |

### Domain 2: AI & Society

| Camp Label | UUID | Use When Author Believes... |
|------------|------|----------------------------|
| **Safety First** | `7f64838f-59a6-4c87-8373-a023b9f448cc` | Prioritize safety, accountability, careful deployment |
| **Democratize Fast** | `fe19ae2d-99f2-4c30-a596-c9cd92bff41b` | Open source, broad access, speed over caution |

### Domain 3: Enterprise AI Adoption

| Camp Label | UUID | Use When Author Believes... |
|------------|------|----------------------------|
| **Technology Leads** | `7e9a2196-71e7-423a-889c-6902bc678eac` | Infrastructure first, tech drives adoption |
| **Co-Evolution** | `f19021ab-a8db-4363-adec-c2228dad6298` | People + process + tech must evolve together |
| **Business Whisperers** | `fe9464df-b778-44c9-9593-7fb3294fa6c3` | Translation/change management is the bottleneck |
| **Tech Builders** | `a076a4ce-f14c-47b5-ad01-c8c60135a494` | Build great AI products, adoption follows |

### Domain 4: AI Governance & Oversight

| Camp Label | UUID | Use When Author Believes... |
|------------|------|----------------------------|
| **Regulatory Interventionist** | `e8792297-e745-4c9f-a91d-4f87dd05cea2` | Strong government oversight needed now |
| **Innovation First** | `331b2b02-7f8d-4751-b583-16255a6feb50` | Industry self-regulation, minimal government |
| **Adaptive Governance** | `ee10cf4f-025a-47fc-be20-33d6756ec5cd` | Light-touch, iterative, evolving regulation |

### Domain 5: Future of Work

| Camp Label | UUID | Use When Author Believes... |
|------------|------|----------------------------|
| **Displacement Realist** | `76f0d8c5-c9a8-4a26-ae7e-18f787000e18` | Significant job displacement coming |
| **Human–AI Collaboration** | `d8d3cec4-f8ce-49b1-9a43-bb0d952db371` | AI augments humans, creates new roles |

---

## How to Map Authors to Camps

Use this detailed guide to determine which camps an author belongs to based on their statements and positions.

### Decision Matrix: Keywords and Signals

#### Domain 1: AI Technical Capabilities

**Scaling Will Deliver** - Map here if author says things like:
- "Scaling laws continue to hold"
- "More compute and data will lead to AGI"
- "Transformers/LLMs are the path to general intelligence"
- "We just need bigger models"
- "The bitter lesson" (Sutskever's principle)
- References: Sam Altman, Dario Amodei, Ilya Sutskever

**Needs New Approaches** - Map here if author says things like:
- "LLMs can't reason" / "LLMs are stochastic parrots"
- "We need world models" / "embodiment" / "grounding"
- "Symbolic AI" / "neurosymbolic" / "hybrid approaches"
- "Current paradigm is hitting a wall"
- "Deep learning alone is not enough"
- References: Yann LeCun, Gary Marcus, Melanie Mitchell

#### Domain 2: AI & Society

**Safety First** - Map here if author says things like:
- "AI alignment" / "existential risk" / "x-risk"
- "We need to slow down" / "pause AI development"
- "Responsible AI" / "AI safety research"
- "Catastrophic risk" / "superintelligence risk"
- "Guardrails" / "red lines" / "safety testing"
- References: Geoffrey Hinton, Yoshua Bengio, Stuart Russell

**Democratize Fast** - Map here if author says things like:
- "Open source AI" / "open weights"
- "Democratize access" / "AI for everyone"
- "Move fast" / "ship quickly"
- "Closed AI is dangerous" / "concentration of power"
- "Innovation requires openness"
- References: Yann LeCun, Meta AI team, Hugging Face, Mistral

#### Domain 3: Enterprise AI Adoption

**Technology Leads** - Map here if author focuses on:
- Infrastructure, MLOps, data pipelines
- "Build the foundation first"
- Technical architecture driving adoption
- Cloud, compute, data platforms

**Co-Evolution** - Map here if author says:
- "People, process, and technology together"
- "Change management" / "organizational change"
- "Culture eats strategy"
- "Adoption is not just technical"

**Business Whisperers** - Map here if author focuses on:
- "Translating between technical and business"
- "Use case identification"
- "ROI" / "business value"
- Consulting, advisory work

**Tech Builders** - Map here if author says:
- "Just build great products"
- "User experience matters most"
- "Ship and iterate"
- Product-led growth, developer experience

#### Domain 4: AI Governance & Oversight

**Regulatory Interventionist** - Map here if author says:
- "Government must regulate AI now"
- "Mandatory safety testing"
- "Licensing for AI development"
- "EU AI Act is good" / supports strong regulation
- References: EU policymakers, some safety researchers

**Innovation First** - Map here if author says:
- "Regulation will stifle innovation"
- "Industry can self-regulate"
- "Government moves too slowly"
- "Let the market decide"
- References: Marc Andreessen, a16z, some startup founders

**Adaptive Governance** - Map here if author says:
- "Flexible frameworks" / "iterative regulation"
- "Sandboxes" / "experimentation"
- "Evolve with technology"
- "Light touch regulation"
- References: Some policy researchers, think tanks

#### Domain 5: Future of Work

**Displacement Realist** - Map here if author says:
- "Jobs will be eliminated" / "mass unemployment"
- "47% of jobs at risk" (Frey/Osborne study)
- "Universal Basic Income needed"
- "Economic disruption"
- "Workers will be replaced"
- References: Martin Ford, Carl Benedikt Frey

**Human–AI Collaboration** - Map here if author says:
- "AI augments humans" / "centaurs" / "cyborgs"
- "New jobs will be created"
- "Human-in-the-loop"
- "AI as copilot" / "AI assistant"
- "Vibe coding" / "pair programming with AI"
- References: Erik Brynjolfsson, Ethan Mollick, Andrej Karpathy

### Mapping Rules

1. **Minimum evidence required:** You must have at least ONE direct quote or documented position to map an author to a camp

2. **Multiple camps OK:** Most authors belong to 2-4 camps across different domains

3. **Opposing views exist:** Some authors may be `strong` in one camp and `challenges` in another (e.g., pro-scaling but pro-regulation)

4. **Don't over-map:** Only map to camps where you have clear evidence. 1-3 well-evidenced camps is better than 5 weakly-evidenced ones

5. **Relevance matters:**
   - `strong` = This is what they're known for
   - `partial` = They've expressed this view but it's not central
   - `challenges` = They actively argue against this position
   - `emerging` = New/recent position for them

### Red Flags - Do NOT Map If:

- ❌ You're guessing based on their job title alone
- ❌ You can't find a direct quote supporting the mapping
- ❌ Their position is ambiguous or nuanced beyond these camps
- ❌ You're inferring from one offhand comment
- ❌ The quote is old (pre-2020) and they may have changed views

---

## Field Specifications

### Authors Table Fields

| Field | Required | Type | Constraints | Example |
|-------|----------|------|-------------|---------|
| `name` | YES | TEXT | Full official name, no nicknames | `'Andrej Karpathy'` |
| `primary_affiliation` | YES | TEXT | Current org + role, 50-100 chars | `'Stanford University, Associate Professor of Computer Science'` |
| `header_affiliation` | YES | TEXT | Short display, 1-3 words max | `'Stanford'` |
| `notes` | YES | TEXT | 2-3 sentences, 100-200 chars | `'Leading AI researcher. Known for work on neural networks and education.'` |
| `credibility_tier` | YES | TEXT | One of 4 values (see below) | `'Major Voice'` |
| `author_type` | YES | TEXT | One of 9 values (see below) | `'Academic'` |
| `sources` | YES | JSONB | Array of 3+ source objects | See format below |
| `key_quote` | YES | TEXT | 60-150 words, general AI stance | `'AI will transform...'` |
| `quote_source_url` | YES | TEXT | Valid URL where quote appears | `'https://example.com/interview'` |

#### Credibility Tiers (pick ONE)

| Value | Use When |
|-------|----------|
| `'Pioneer'` | Shaped the field itself; foundational to modern AI (Turing Award level, created subfields) |
| `'Field Leader'` | Leads major AI initiatives or institutions; shapes industry direction (lab directors, major AI leads) |
| `'Domain Expert'` | Deep expertise in specific AI domains; highly cited in their specialty (conference speakers, prolific researchers) |
| `'Rising Voice'` | Building influence; early but consistent track record (growing audience, emerging commentators) |

#### Author Types (pick ONE)

| Value | Use When |
|-------|----------|
| `'Academic'` | University professors, academic researchers |
| `'Researcher'` | Industry or independent researchers |
| `'Industry Leader'` | CEOs, CTOs, founders of AI companies |
| `'Executive'` | Senior executives at tech companies |
| `'Policy Expert'` | Policy analysts, think tank researchers |
| `'Policy Maker'` | Government officials, regulators |
| `'Investor'` | VCs, angel investors focused on AI |
| `'Public Intellectual'` | Writers, podcast hosts, commentators |
| `'Engineer'` | Technical practitioners, staff engineers |

#### Sources Array Format

```json
[
  {
    "url": "https://example.com/paper",
    "type": "Paper",
    "year": "2024",
    "title": "Title of the Work"
  }
]
```

**Source Types (pick from):** `Book`, `Paper`, `Podcast`, `Blog`, `YouTube`, `Video`, `Research`, `Organization`, `Website`, `Social`, `Article`, `Course`

**Requirements:**
- Minimum 3 sources per author
- All URLs must be real and working
- Mix of types preferred (not all podcasts)
- At least one substantial source (book, research paper, organization)
- Prefer recent sources (last 3 years)

### Camp_Authors Table Fields

| Field | Required | Type | Constraints | Example |
|-------|----------|------|-------------|---------|
| `camp_id` | YES | UUID | Must be from reference table above | `'c5dcb027-cd27-4c91-adb4-aca780d15199'` |
| `author_id` | YES | UUID | Retrieved via subquery | `(SELECT id FROM authors WHERE name = 'Name')` |
| `relevance` | YES | TEXT | One of 4 values (see below) | `'strong'` |
| `key_quote` | YES | TEXT | 60-150 words, domain-specific | `'On scaling, I believe...'` |
| `quote_source_url` | YES | TEXT | Valid URL | `'https://example.com'` |
| `why_it_matters` | YES | TEXT | 80-180 words, editorial context | `'Their research on X influences...'` |

#### Relevance Values (pick ONE per camp)

| Value | Use When |
|-------|----------|
| `'strong'` | Primary position, leading voice for this camp |
| `'partial'` | Secondary/nuanced position, has views but not primary focus |
| `'challenges'` | Actively argues against this camp's position |
| `'emerging'` | New/evolving position, recently started engaging |

---

## SQL Syntax Rules

### CRITICAL RULES - FOLLOW EXACTLY

1. **Always wrap in transaction:**
   ```sql
   BEGIN;
   -- your SQL here
   COMMIT;
   ```

2. **Escape single quotes by doubling them:**
   ```sql
   -- WRONG:
   'It's important'

   -- CORRECT:
   'It''s important'
   ```

3. **Cast JSONB explicitly:**
   ```sql
   '[{"url": "...", "type": "...", "year": "...", "title": "..."}]'::jsonb
   ```

4. **Use UUID casting for camp IDs:**
   ```sql
   'c5dcb027-cd27-4c91-adb4-aca780d15199'::uuid
   ```

5. **Use subquery for author_id (never hardcode):**
   ```sql
   (SELECT id FROM authors WHERE name = 'Author Name')
   ```

6. **Use ON CONFLICT for upserts:**
   ```sql
   ON CONFLICT (author_id, camp_id) DO UPDATE SET ...
   ```

7. **Always set updated_at:**
   ```sql
   updated_at = NOW()
   ```

8. **Line breaks in strings - use single line or concat:**
   ```sql
   -- WRONG (will break):
   'This is line 1
   This is line 2'

   -- CORRECT:
   'This is line 1. This is line 2.'
   ```

---

## Templates

### Template A: Add New Author (Complete)

```sql
BEGIN;

-- Step 1: Insert author
INSERT INTO authors (
  name,
  primary_affiliation,
  header_affiliation,
  notes,
  credibility_tier,
  author_type,
  sources,
  key_quote,
  quote_source_url
) VALUES (
  'FULL_NAME_HERE',
  'ORGANIZATION, Role Title',
  'SHORT_ORG',
  'Two to three sentences about their significance and expertise in AI.',
  'Field Leader',  -- or: Pioneer, Domain Expert, Rising Voice
  'Academic',     -- or: Researcher, Industry Leader, Executive, Policy Expert, etc.
  '[
    {"url": "https://source1.com", "type": "Book", "year": "2024", "title": "Source Title 1"},
    {"url": "https://source2.com", "type": "Paper", "year": "2023", "title": "Source Title 2"},
    {"url": "https://source3.com", "type": "Podcast", "year": "2024", "title": "Source Title 3"}
  ]'::jsonb,
  'A representative quote (60-150 words) capturing their overall stance on AI. This should be verifiable at the source URL.',
  'https://url-where-quote-appears.com'
);

-- Step 2: Add camp relationships (repeat for each camp, 1-5 camps typical)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
VALUES (
  'CAMP_UUID_HERE'::uuid,
  (SELECT id FROM authors WHERE name = 'FULL_NAME_HERE'),
  'strong',  -- or: partial, challenges, emerging
  'A domain-specific quote (60-150 words) about THIS camp''s topic specifically.',
  'https://url-where-this-quote-appears.com',
  'Editorial context (80-180 words) explaining why this author''s perspective on this topic matters. What influence do they have? Why should readers care?'
);

-- Add more camp relationships as needed...

COMMIT;
```

### Template B: Update Existing Author (Add Sources)

```sql
BEGIN;

UPDATE authors
SET
  sources = sources || '[
    {"url": "https://new-source.com", "type": "Video", "year": "2025", "title": "New Source Title"}
  ]'::jsonb,
  updated_at = NOW()
WHERE name = 'AUTHOR_NAME_HERE';

COMMIT;
```

### Template C: Update Existing Author (New Quote)

```sql
BEGIN;

UPDATE authors
SET
  key_quote = 'New representative quote that better captures their current position.',
  quote_source_url = 'https://new-source-url.com',
  updated_at = NOW()
WHERE name = 'AUTHOR_NAME_HERE';

COMMIT;
```

### Template D: Add Camp Relationship to Existing Author

```sql
BEGIN;

INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
VALUES (
  'CAMP_UUID_HERE'::uuid,
  (SELECT id FROM authors WHERE name = 'AUTHOR_NAME_HERE'),
  'strong',
  'Domain-specific quote for this camp.',
  'https://source-url.com',
  'Why this author''s view on this topic matters.'
)
ON CONFLICT (author_id, camp_id) DO UPDATE SET
  key_quote = EXCLUDED.key_quote,
  quote_source_url = EXCLUDED.quote_source_url,
  why_it_matters = EXCLUDED.why_it_matters,
  relevance = EXCLUDED.relevance;

COMMIT;
```

### Template E: Update Existing Camp Relationship

```sql
BEGIN;

UPDATE camp_authors
SET
  key_quote = 'Updated domain-specific quote.',
  quote_source_url = 'https://new-source.com',
  why_it_matters = 'Updated editorial context.',
  relevance = 'strong'
WHERE author_id = (SELECT id FROM authors WHERE name = 'AUTHOR_NAME_HERE')
  AND camp_id = 'CAMP_UUID_HERE'::uuid;

COMMIT;
```

### Template F: Comprehensive Author Refresh

```sql
BEGIN;

-- Update author profile
UPDATE authors
SET
  primary_affiliation = 'New Organization, New Role',
  header_affiliation = 'New Org',
  notes = 'Updated bio reflecting current work.',
  key_quote = 'Updated general quote.',
  quote_source_url = 'https://new-quote-source.com',
  sources = sources || '[
    {"url": "https://new-source.com", "type": "Book", "year": "2025", "title": "New Publication"}
  ]'::jsonb,
  updated_at = NOW()
WHERE name = 'AUTHOR_NAME_HERE';

-- Update camp quote
UPDATE camp_authors
SET
  key_quote = 'Updated camp-specific quote.',
  quote_source_url = 'https://camp-quote-source.com',
  why_it_matters = 'Updated rationale.'
WHERE author_id = (SELECT id FROM authors WHERE name = 'AUTHOR_NAME_HERE')
  AND camp_id = 'CAMP_UUID_HERE'::uuid;

COMMIT;
```

---

## Quality Standards

### Quote Requirements

| Requirement | Details |
|-------------|---------|
| **Length** | 60-150 words (1-3 sentences typical) |
| **Authenticity** | Must be real words the author actually said/wrote |
| **Verifiability** | Must appear at the provided source URL |
| **Specificity** | Camp quotes must be about that camp's domain |
| **Recency** | Prefer quotes from last 3 years |
| **Attribution** | No paraphrasing - use actual quotes |

### Why It Matters Requirements

| Requirement | Details |
|-------------|---------|
| **Length** | 80-180 words (2-4 sentences) |
| **Content** | Explain author's influence, credentials, why their view matters |
| **Tone** | Editorial, third-person, professional |
| **Avoid** | Marketing language, superlatives, unverifiable claims |

### Source Requirements

| Requirement | Details |
|-------------|---------|
| **Minimum** | 3 sources per author |
| **URLs** | Must be real, working links |
| **Variety** | Mix of types (not all one type) |
| **Quality** | At least one substantial source (book, paper, org) |
| **Recency** | Prefer last 3 years |

---

## Validation Checklist

Before submitting your SQL, verify:

### Author Data
- [ ] Name is full official name (not nickname)
- [ ] primary_affiliation includes org AND role
- [ ] header_affiliation is 1-3 words
- [ ] notes is 2-3 complete sentences
- [ ] credibility_tier is one of the 4 valid values
- [ ] author_type is one of the 9 valid values
- [ ] sources has 3+ entries with all 4 fields each
- [ ] key_quote is 60-150 words
- [ ] quote_source_url is a real, working URL

### Camp Relationships
- [ ] Using exact UUID from reference table (not made up)
- [ ] relevance is one of: strong, partial, challenges, emerging
- [ ] key_quote is domain-specific (different from author-level quote)
- [ ] quote_source_url is real and working
- [ ] why_it_matters is 80-180 words

### SQL Syntax
- [ ] Wrapped in BEGIN/COMMIT
- [ ] All single quotes escaped ('' not ')
- [ ] JSONB arrays cast with ::jsonb
- [ ] UUIDs cast with ::uuid
- [ ] No line breaks inside string literals
- [ ] author_id retrieved via subquery, not hardcoded

### Quote Authenticity
- [ ] Quote is real (not fabricated or paraphrased)
- [ ] Quote appears at the provided URL
- [ ] Quote is attributed to this specific author

---

## Examples: Good vs Bad

### Example 1: Author Name

```sql
-- ❌ BAD:
'Sam'                           -- Too short, nickname
'Samuel H. Altman III'          -- Too formal unless official
'sam altman'                    -- Wrong capitalization

-- ✅ GOOD:
'Sam Altman'                    -- Official name as commonly used
'Yoshua Bengio'
'Emily M. Bender'               -- Middle initial if commonly used
```

### Example 2: Affiliation

```sql
-- ❌ BAD:
primary_affiliation = 'OpenAI'                    -- Missing role
primary_affiliation = 'CEO'                       -- Missing organization
header_affiliation = 'Chief Executive Officer'   -- Too long

-- ✅ GOOD:
primary_affiliation = 'OpenAI, CEO'
primary_affiliation = 'Stanford University, Associate Professor of Computer Science'
header_affiliation = 'OpenAI'
header_affiliation = 'Stanford'
```

### Example 3: Notes/Bio

```sql
-- ❌ BAD:
notes = 'AI researcher'                           -- Too short
notes = 'Sam Altman is the CEO...'               -- Starts with name (redundant)
notes = 'The most brilliant AI visionary...'     -- Superlatives, marketing

-- ✅ GOOD:
notes = 'CEO of OpenAI, leading development of GPT models. Influential voice in AI policy debates. His views on AGI timelines shape both industry strategy and regulatory discussions.'
```

### Example 4: Sources Array

```sql
-- ❌ BAD:
'[{"url": "openai.com"}]'::jsonb                  -- Missing fields, no https
'[{"url": "https://x.com"}]'::jsonb              -- Generic URL, missing fields

-- ✅ GOOD:
'[
  {"url": "https://openai.com/blog", "type": "Organization", "year": "2024", "title": "OpenAI Blog"},
  {"url": "https://example.com/interview", "type": "Podcast", "year": "2024", "title": "AI Discussion"},
  {"url": "https://arxiv.org/abs/xxxx", "type": "Paper", "year": "2023", "title": "Research Paper Title"}
]'::jsonb
```

### Example 5: Quotes

```sql
-- ❌ BAD (fabricated):
key_quote = 'AI will change everything and we must act now.'  -- Generic, likely made up

-- ❌ BAD (paraphrased):
key_quote = 'Altman believes scaling will lead to AGI.'       -- Third person, not a quote

-- ❌ BAD (too short):
key_quote = 'AI is important.'                                 -- Under 60 words

-- ✅ GOOD (real, verifiable):
key_quote = 'In the next couple of decades, we may well have superintelligence, in the sense of a computer system that is better than humans at nearly everything.'
quote_source_url = 'https://ia.samaltman.com/'
```

### Example 6: Camp UUID

```sql
-- ❌ BAD:
camp_id = 'scaling-maximalists'                              -- Not a UUID
camp_id = '12345678-1234-1234-1234-123456789012'::uuid       -- Made up UUID

-- ✅ GOOD:
camp_id = 'c5dcb027-cd27-4c91-adb4-aca780d15199'::uuid       -- Exact UUID from reference
```

### Example 7: Why It Matters

```sql
-- ❌ BAD:
why_it_matters = 'Important researcher.'                      -- Too short
why_it_matters = 'Dr. Smith is amazing and everyone should listen to them.'  -- Marketing

-- ✅ GOOD:
why_it_matters = 'As former Director of AI at Tesla and founding member of OpenAI, Karpathy''s technical credibility is unmatched. His "vibe coding" concept has become the dominant framing for AI-assisted programming, influencing how millions of developers think about human-AI collaboration in software development.'
```

### Example 8: Complete Good Entry

```sql
BEGIN;

INSERT INTO authors (
  name, primary_affiliation, header_affiliation, notes,
  credibility_tier, author_type, sources, key_quote, quote_source_url
) VALUES (
  'Andrej Karpathy',
  'Independent, AI Educator & Researcher',
  'Independent',
  'Former Director of AI at Tesla and OpenAI founding member. Pioneer of "Software 2.0" and "vibe coding" - the paradigm of AI-assisted programming where developers describe intent and AI generates code.',
  'Pioneer',
  'Researcher',
  '[
    {"url": "https://karpathy.ai/zero-to-hero.html", "type": "Course", "year": "2023", "title": "Neural Networks: Zero to Hero"},
    {"url": "https://www.youtube.com/@AndrejKarpathy", "type": "YouTube", "year": "2024", "title": "YouTube Channel"},
    {"url": "https://karpathy.github.io/2015/05/21/rnn-effectiveness/", "type": "Blog", "year": "2015", "title": "The Unreasonable Effectiveness of RNNs"}
  ]'::jsonb,
  'There is a new kind of coding I call "vibe coding" where you fully give in to the vibes, embrace exponentials, and forget that the code even exists. It''s not really coding - I just see stuff, say stuff, run stuff, and copy paste stuff, and it mostly works.',
  'https://x.com/karpathy/status/1886192184808149383'
);

INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
VALUES (
  'd8d3cec4-f8ce-49b1-9a43-bb0d952db371'::uuid,
  (SELECT id FROM authors WHERE name = 'Andrej Karpathy'),
  'strong',
  'Vibe coding is the new paradigm where humans and AI collaborate on code. You describe what you want, the AI generates it, you iterate together. The human provides intent and judgment, the AI provides implementation speed.',
  'https://www.youtube.com/watch?v=LWiM-LuRe6w',
  'Karpathy''s "vibe coding" concept captures a fundamental shift in software development - from humans writing code to humans directing AI that writes code. His influence as former Tesla AI director and OpenAI founding member gives this paradigm legitimacy and widespread adoption.'
);

COMMIT;
```

---

## Common Mistakes to Avoid

| Mistake | Why It's Wrong | Correct Approach |
|---------|----------------|------------------|
| Making up UUIDs | Database will reject or create orphan records | Use exact UUIDs from reference table |
| Fabricating quotes | Destroys credibility, may be legally problematic | Only use real, verifiable quotes |
| Single quotes not escaped | SQL syntax error | Double all single quotes: `''` |
| Missing BEGIN/COMMIT | Partial failures leave inconsistent data | Always wrap in transaction |
| Same quote for author and camp | Camp quotes should be domain-specific | Write unique quote per camp |
| URLs without https:// | May not work, inconsistent | Always include full URL with protocol |
| Line breaks in strings | SQL syntax error | Keep strings on single line |
| Hardcoding author_id | Fragile, won't work across environments | Use subquery: `(SELECT id FROM authors WHERE name = '...')` |
| Missing source fields | JSONB structure will be inconsistent | Include all 4 fields: url, type, year, title |
| Fewer than 3 sources | Below quality threshold | Always provide 3+ diverse sources |
| Missing why_it_matters | Record will be incomplete | Required for all camp relationships |

---

## Complete Worked Example

This shows the EXACT format your response should follow.

### INPUT RECEIVED:

```
Add Yann LeCun to the database.
```

### YOUR RESPONSE:

---

## 1. Research Summary

Yann LeCun is Chief AI Scientist at Meta and Silver Professor at NYU. He is a Turing Award winner (2018) for his foundational work on convolutional neural networks. He is known for his vocal criticism of current LLM approaches and advocacy for "world models" and self-supervised learning as the path to human-level AI. He strongly supports open-source AI development.

## 2. Camp Analysis

| Camp | Relevance | Evidence |
|------|-----------|----------|
| **Needs New Approaches** | strong | Repeatedly states LLMs "cannot reason" and advocates for world models, JEPA architecture. His core research agenda. |
| **Scaling Will Deliver** | challenges | Actively argues against the idea that scaling current LLMs will lead to AGI. |
| **Democratize Fast** | strong | Meta's open-source Llama models, frequent statements that "open source is safer" |
| **Safety First** | challenges | Publicly disputes x-risk concerns, called the open letter to pause AI "ridiculous" |

## 3. SQL Script

```sql
BEGIN;

-- Insert author
INSERT INTO authors (
  name,
  primary_affiliation,
  header_affiliation,
  notes,
  credibility_tier,
  author_type,
  sources,
  key_quote,
  quote_source_url
) VALUES (
  'Yann LeCun',
  'Meta AI, Chief AI Scientist & NYU, Silver Professor',
  'Meta / NYU',
  'Turing Award winner (2018) for foundational work on convolutional neural networks. Chief AI Scientist at Meta and professor at NYU. Leading advocate for world models and self-supervised learning as alternatives to current LLM approaches.',
  'Pioneer',
  'Researcher',
  '[
    {"url": "https://www.cs.nyu.edu/~yann/", "type": "Website", "year": "2024", "title": "Yann LeCun - NYU"},
    {"url": "https://ai.meta.com/people/yann-lecun/", "type": "Organization", "year": "2024", "title": "Meta AI - Yann LeCun"},
    {"url": "https://www.youtube.com/watch?v=SGSOCuByo24", "type": "Video", "year": "2024", "title": "Yann LeCun on World Models"}
  ]'::jsonb,
  'Auto-regressive LLMs are doomed. They cannot reason, they cannot plan, they have very limited understanding of the physical world, they don''t have persistent memory. We need systems that can learn world models.',
  'https://www.youtube.com/watch?v=SGSOCuByo24'
);

-- Camp 1: Needs New Approaches (strong)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
VALUES (
  '207582eb-7b32-4951-9863-32fcf05944a1'::uuid,
  (SELECT id FROM authors WHERE name = 'Yann LeCun'),
  'strong',
  'We need to develop architectures that can learn world models - internal models of how the world works that allow for prediction, planning, and reasoning. Current LLMs are a dead end for achieving human-level intelligence.',
  'https://openreview.net/pdf?id=BZ5a1r-kVsf',
  'As a Turing Award winner and Chief AI Scientist at Meta, LeCun''s advocacy for world models and his criticism of the LLM paradigm carries significant weight. His JEPA (Joint Embedding Predictive Architecture) research represents a concrete alternative to autoregressive models, influencing research directions at major labs.'
);

-- Camp 2: Scaling Will Deliver (challenges)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
VALUES (
  'c5dcb027-cd27-4c91-adb4-aca780d15199'::uuid,
  (SELECT id FROM authors WHERE name = 'Yann LeCun'),
  'challenges',
  'There is no way you can get to human-level intelligence just by scaling up LLMs. It doesn''t matter how much data you train them on, how big they are, or how long you train them. They fundamentally lack the ability to reason and plan.',
  'https://www.youtube.com/watch?v=SGSOCuByo24',
  'LeCun''s critique of scaling orthodoxy is notable because of his stature - as a deep learning pioneer, his rejection of the "just scale it up" approach challenges the dominant narrative from OpenAI, Anthropic, and Google. This creates important intellectual diversity in the AGI debate.'
);

-- Camp 3: Democratize Fast (strong)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
VALUES (
  'fe19ae2d-99f2-4c30-a596-c9cd92bff41b'::uuid,
  (SELECT id FROM authors WHERE name = 'Yann LeCun'),
  'strong',
  'Open source AI is not just about democratization, it''s about safety. When models are open, thousands of researchers can study them, find vulnerabilities, and improve them. Closed models are a security risk because only a few people can audit them.',
  'https://twitter.com/ylecun/status/1734600502218703000',
  'LeCun''s open-source advocacy is backed by action - he leads Meta AI which released Llama openly. His framing of open source as a safety measure (not just democratization) provides intellectual ammunition for the open-weights movement and directly counters closed-model companies'' arguments.'
);

-- Camp 4: Safety First (challenges)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
VALUES (
  '7f64838f-59a6-4c87-8373-a023b9f448cc'::uuid,
  (SELECT id FROM authors WHERE name = 'Yann LeCun'),
  'challenges',
  'The idea that AI poses an existential risk is preposterously ridiculous. Current AI systems are not anywhere close to human-level intelligence. The doomers are wrong and their fear-mongering is counterproductive.',
  'https://twitter.com/ylecun/status/1714350189751066901',
  'LeCun''s dismissal of x-risk concerns creates a prominent counterpoint in AI safety debates. As a Turing laureate, his view that existential risk fears are overblown gives cover to those who prioritize rapid development and legitimizes skepticism of the AI safety movement''s most dire predictions.'
);

COMMIT;
```

---

**Sources Used:**
- NYU faculty page: https://www.cs.nyu.edu/~yann/
- Meta AI profile: https://ai.meta.com/people/yann-lecun/
- YouTube talks on world models
- Twitter/X posts on open source and x-risk
- JEPA paper on OpenReview

---

## Appendix: Camp Descriptions

For reference when deciding which camps an author belongs to:

| Camp | Full Description |
|------|------------------|
| **Scaling Will Deliver** | Believes current architectures (transformers, LLMs) will achieve AGI through scaling compute and data. Proponents of scaling laws. |
| **Needs New Approaches** | Believes we need fundamental new approaches - world models, embodiment, neurosymbolic AI, etc. Current paradigm insufficient. |
| **Safety First** | Prioritizes AI safety, alignment, accountability. Advocates for careful, measured deployment with strong safeguards. |
| **Democratize Fast** | Believes open source and broad access to AI is paramount. Speed of deployment and accessibility over caution. |
| **Technology Leads** | Enterprise adoption driven by infrastructure investment. Build the tech stack first, adoption follows. |
| **Co-Evolution** | People, processes, and technology must evolve together. Change management as important as technology. |
| **Business Whisperers** | Translation between technical and business is the bottleneck. Focus on communication and change management. |
| **Tech Builders** | Build great AI products with excellent UX. If the product is good enough, adoption is natural. |
| **Regulatory Interventionist** | Strong government oversight needed now. Proactive regulation before harm occurs. |
| **Innovation First** | Industry self-regulation preferred. Government should enable innovation, not constrain it. |
| **Adaptive Governance** | Light-touch, iterative regulation. Frameworks that evolve with technology. |
| **Displacement Realist** | Significant job displacement is coming. Need proactive policies for economic transition. |
| **Human–AI Collaboration** | AI augments human capabilities. New roles emerge, humans and AI work together. |

---

## Quick Reference Card

Copy this for quick reference during research:

```
CAMP UUIDs:
- Scaling Will Deliver:      c5dcb027-cd27-4c91-adb4-aca780d15199
- Needs New Approaches:      207582eb-7b32-4951-9863-32fcf05944a1
- Safety First:              7f64838f-59a6-4c87-8373-a023b9f448cc
- Democratize Fast:          fe19ae2d-99f2-4c30-a596-c9cd92bff41b
- Technology Leads:          7e9a2196-71e7-423a-889c-6902bc678eac
- Co-Evolution:              f19021ab-a8db-4363-adec-c2228dad6298
- Business Whisperers:       fe9464df-b778-44c9-9593-7fb3294fa6c3
- Tech Builders:             a076a4ce-f14c-47b5-ad01-c8c60135a494
- Regulatory Interventionist: e8792297-e745-4c9f-a91d-4f87dd05cea2
- Innovation First:          331b2b02-7f8d-4751-b583-16255a6feb50
- Adaptive Governance:       ee10cf4f-025a-47fc-be20-33d6756ec5cd
- Displacement Realist:      76f0d8c5-c9a8-4a26-ae7e-18f787000e18
- Human–AI Collaboration:    d8d3cec4-f8ce-49b1-9a43-bb0d952db371

CREDIBILITY TIERS: Pioneer | Field Leader | Domain Expert | Rising Voice
AUTHOR TYPES: Academic | Researcher | Industry Leader | Executive | Policy Expert | Policy Maker | Investor | Public Intellectual | Engineer
RELEVANCE: strong | partial | challenges | emerging

DOMAIN UI DISPLAY NAMES:
- AI Technical Capabilities → "AI capabilities"
- AI & Society → "AI & society"
- Enterprise AI Adoption → "AI in business"
- AI Governance & Oversight → "AI governance"
- Future of Work → "AI & work"

ESCAPE SINGLE QUOTES: Use '' (two single quotes)
ALWAYS: BEGIN; ... COMMIT;
ALWAYS: Cast UUIDs with ::uuid
ALWAYS: Cast JSONB with ::jsonb
NEVER: Make up quotes
NEVER: Hardcode author_id (use subquery)
```

---

**End of Guide**
