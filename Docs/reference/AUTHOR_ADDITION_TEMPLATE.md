# Author Addition Template

## Purpose
This template provides a structured, repeatable process for adding new authors to the Compass database with proper quotes, context, and camp relationships.

## Step-by-Step Process

### 1. Author Profile Research
For each author, gather:
- **Full Name**: [Official name]
- **Primary Affiliation**: [Current organization/role]
- **Header Affiliation**: [Short display version]
- **Bio**: 2-3 sentences on their significance
- **Credibility Tier**: tier_1 | tier_2 | tier_3
- **Author Type**: researcher | practitioner | entrepreneur | policy | critic | journalist
- **X/Twitter Handle**: @username (if applicable)
- **LinkedIn**: URL (if applicable)

### 2. Camp Mapping
Identify which camps the author should appear in across domains:

#### Domain: AI Technical Capabilities
- [ ] **Scaling Will Deliver** (relevance: strong | partial | challenges | emerging)
- [ ] **Needs New Approaches** (relevance: strong | partial | challenges | emerging)

#### Domain: AI & Society
- [ ] **Safety First** (relevance: strong | partial | challenges | emerging)
- [ ] **Democratize Fast** (relevance: strong | partial | challenges | emerging)

#### Domain: Enterprise AI Adoption
- [ ] **Technology Leads** (relevance: strong | partial | challenges | emerging)
- [ ] **Co-Evolution** (relevance: strong | partial | challenges | emerging)
- [ ] **Business Whisperers** (relevance: strong | partial | challenges | emerging)
- [ ] **Tech Builders** (relevance: strong | partial | challenges | emerging)

#### Domain: AI Governance & Oversight
- [ ] **Innovation First** (relevance: strong | partial | challenges | emerging)
- [ ] **Regulatory Interventionist** (relevance: strong | partial | challenges | emerging)
- [ ] **Adaptive Governance** (relevance: strong | partial | challenges | emerging)

#### Domain: Future of Work
- [ ] **Displacement Realist** (relevance: strong | partial | challenges | emerging)
- [ ] **Human–AI Collaboration** (relevance: strong | partial | challenges | emerging)

### 3. Quote Research
For each camp the author appears in:
- **Quote**: 1-3 sentences (60-150 words) representing their stance
- **Source URL**: Verified link to where the quote appears
- **Quote should be**:
  - Domain-specific (relevant to THIS camp, not generic)
  - Representative of their actual position
  - From a credible source (paper, interview, book, verified social media)
  - Recent when possible (last 3 years preferred)

### 4. Why It Matters
For each camp the author appears in:
- **Context**: 2-4 sentences (80-180 words) explaining:
  - Why this author's voice matters in THIS domain
  - What influence they have (funding, policy, research direction, public discourse)
  - How their position shapes the field
  - What makes their perspective unique or significant

### 5. SQL Template

```sql
-- =====================================================
-- AUTHOR: [Name]
-- =====================================================

-- Step 1: Insert Author
INSERT INTO authors (
  name,
  primary_affiliation,
  header_affiliation,
  bio,
  credibility_tier,
  author_type,
  x_handle,
  linkedin_url
) VALUES (
  '[Full Name]',
  '[Primary Affiliation]',
  '[Header Affiliation]',
  '[Bio 2-3 sentences]',
  '[tier_1/tier_2/tier_3]',
  '[researcher/practitioner/entrepreneur/policy/critic/journalist]',
  '[Twitter handle or NULL]',
  '[LinkedIn URL or NULL]'
) RETURNING id;

-- Step 2: Map to Camps (use actual camp IDs and author ID from above)
-- Example for each camp relationship:

INSERT INTO camp_authors (
  camp_id,
  author_id,
  relevance,
  key_quote,
  quote_source_url,
  why_it_matters
) VALUES (
  '[camp_id from camps table]',
  '[author_id from step 1]',
  '[strong/partial/challenges/emerging]',
  '[Domain-specific quote 1-3 sentences]',
  '[Source URL]',
  '[Why it matters 2-4 sentences]'
);

-- Repeat INSERT INTO camp_authors for each camp this author appears in
```

## Quality Checklist

Before adding an author, verify:
- [ ] Author has genuine influence/expertise in their domain(s)
- [ ] At least 2-3 camp relationships mapped
- [ ] Each quote is domain-specific (not copy-pasted across domains)
- [ ] Each quote has a verified source URL
- [ ] Each "why it matters" explains their specific influence
- [ ] Credibility tier is appropriate (tier_1 for most influential)
- [ ] Bio is concise and explains their significance

## Example: Cassie Kozyrkov

```sql
-- Author Profile
INSERT INTO authors (
  name,
  primary_affiliation,
  header_affiliation,
  bio,
  credibility_tier,
  author_type,
  x_handle
) VALUES (
  'Cassie Kozyrkov',
  'Former Chief Decision Scientist, Google',
  'Google',
  'Former Chief Decision Scientist at Google, pioneered decision intelligence field. Known for making AI/ML accessible to business leaders and advocating practical, human-centered AI adoption.',
  'tier_1',
  'practitioner',
  '@quaesita'
);

-- Camp Relationships
-- AI Technical → Scaling Will Deliver (challenges overhype)
INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
VALUES (
  '[scaling_will_deliver_id]',
  '[cassie_id]',
  'challenges',
  'The danger with neural networks is that people think they''re magic. They''re not. They''re just complicated curve-fitting. If you don''t have the right data or the right question, all the scaling in the world won''t save you.',
  'https://example.com/source',
  'Kozyrkov challenges pure scaling optimism from a practitioner perspective, having led ML at Google. Her focus on decision intelligence and practical constraints shapes how enterprises approach AI investment vs. hype.'
);

-- Repeat for other camps...
```

## File Organization

All author additions should be documented in:
- **SQL File**: `Docs/ADD_AUTHORS_[BATCH_NAME].sql`
- **Verification Script**: Run `node scripts/verify_new_authors.mjs` after adding
- **Documentation**: Update `Docs/AUTHOR_ADDITION_LOG.md` with date and authors added

## Maintenance

When adding authors:
1. Create SQL file with all author data
2. Test locally first
3. Verify authors appear in search results
4. Verify quotes and context display correctly
5. Document in addition log
6. Commit with clear message: "Add [N] authors: [names]"
