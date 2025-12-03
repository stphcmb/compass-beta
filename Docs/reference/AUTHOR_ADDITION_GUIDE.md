# Author Addition Guide

## Complete Checklist for Adding New Authors

This guide ensures every author is added with complete, high-quality data following established patterns.

---

## Required Information Per Author

### 1. Basic Profile
- ✅ **Full Name**: Official name
- ✅ **Primary Affiliation**: Current organization/role (full)
- ✅ **Header Affiliation**: Short display version (e.g., "Google", "MIT")
- ✅ **Notes**: 2-3 sentences on their significance (uses `notes` field, NOT `bio`)
- ✅ **Credibility Tier**: `Major Voice` | `Seminal Thinker` | `Thought Leader`
  - **Major Voice**: Highly influential, shapes discourse (e.g., Lex Fridman, Marc Andreessen)
  - **Seminal Thinker**: Foundational contributions (e.g., Geoffrey Hinton, Stuart Russell)
  - **Thought Leader**: Recognized expert, regular contributor
- ✅ **Author Type**: `researcher` | `practitioner` | `entrepreneur` | `policy` | `critic` | `journalist`

### 2. Sources (REQUIRED - Minimum 3)
Each author MUST have at least 3 relevant sources in JSONB format:

```json
[
  {
    "url": "https://example.com/work",
    "type": "Book|Paper|Podcast|Blog|YouTube|Research|Organization",
    "year": "2024",
    "title": "Title of the work"
  },
  {
    "url": "https://example.com/work2",
    "type": "Paper",
    "year": "2023",
    "title": "Important Research Paper"
  },
  {
    "url": "https://example.com/work3",
    "type": "Podcast",
    "year": "2024",
    "title": "Weekly Podcast on AI"
  }
]
```

**Source Types**:
- `Book` - Published books
- `Paper` - Research papers (arXiv, journals)
- `Podcast` - Regular podcast
- `Blog` - Blog/Substack
- `YouTube` - YouTube channel
- `Research` - Research lab/institute
- `Organization` - Organization they lead/founded
- `Website` - Personal website

**Quality Standards**:
- ✅ URLs must be working and relevant
- ✅ Mix of source types (not all podcasts)
- ✅ At least one should be substantial (book, research, organization)
- ✅ Prefer recent sources (last 3 years when possible)
- ✅ Titles should be clear and descriptive

### 3. Camp Relationships (2-5 per author)

Map author to relevant camps across domains:

#### Domain: AI Technical Capabilities
- **Scaling Will Deliver** (UUID: `c5dcb027-cd27-4c91-adb4-aca780d15199`)
- **Needs New Approaches** (UUID: `207582eb-7b32-4951-9863-32fcf05944a1`)

#### Domain: AI & Society
- **Safety First** (UUID: `7f64838f-59a6-4c87-8373-a023b9f448cc`)
- **Democratize Fast** (UUID: `fe19ae2d-99f2-4c30-a596-c9cd92bff41b`)

#### Domain: Enterprise AI Adoption
- **Technology Leads** (UUID: `7e9a2196-71e7-423a-889c-6902bc678eac`)
- **Co-Evolution** (UUID: `f19021ab-a8db-4363-adec-c2228dad6298`)
- **Business Whisperers** (UUID: `fe9464df-b778-44c9-9593-7fb3294fa6c3`)
- **Tech Builders** (UUID: `a076a4ce-f14c-47b5-ad01-c8c60135a494`)

#### Domain: AI Governance & Oversight
- **Innovation First** (UUID: `331b2b02-7f8d-4751-b583-16255a6feb50`)
- **Regulatory Interventionist** (UUID: `e8792297-e745-4c9f-a91d-4f87dd05cea2`)
- **Adaptive Governance** (UUID: `ee10cf4f-025a-47fc-be20-33d6756ec5cd`)

#### Domain: Future of Work
- **Displacement Realist** (UUID: `76f0d8c5-c9a8-4a26-ae7e-18f787000e18`)
- **Human–AI Collaboration** (UUID: `d8d3cec4-f8ce-49b1-9a43-bb0d952db371`)

### 4. Per-Camp Requirements

For EACH camp the author appears in:

**A. Relevance Level**
- `strong` - Primary position
- `partial` - Secondary/nuanced position
- `challenges` - Opposes this camp
- `emerging` - New/evolving position

**B. Domain-Specific Quote** (60-150 words)
- ✅ Must be specific to THIS domain/camp (not generic)
- ✅ Representative of their actual position
- ✅ From credible source (ideally in sources list)
- ✅ 1-3 sentences

**C. Quote Source URL**
- ✅ Direct link to where quote appears
- ✅ Should match one of their sources when possible
- ✅ Must be accessible (not paywalled if possible)

**D. Why It Matters** (80-180 words)
- ✅ Explains why THIS author matters in THIS domain
- ✅ Focus on their influence (funding, policy, research, discourse)
- ✅ Concrete impact, not just description
- ✅ 2-4 sentences

---

## SQL Template

```sql
-- =====================================================
-- AUTHOR: [Full Name]
-- =====================================================

BEGIN;

-- Step 1: Insert Author with Sources
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
  '[Primary Affiliation Full]',
  '[Short Header]',
  '[2-3 sentences on significance]',
  'Major Voice',
  'researcher',
  '[
    {
      "url": "https://example.com/work1",
      "type": "Podcast",
      "year": "2024",
      "title": "Main Podcast"
    },
    {
      "url": "https://example.com/work2",
      "type": "Book",
      "year": "2023",
      "title": "Important Book"
    },
    {
      "url": "https://example.com/work3",
      "type": "Research",
      "year": "2024",
      "title": "Research Lab"
    }
  ]'::jsonb
);

-- Step 2: Add Camp Relationships
DO $$
DECLARE
  author_id uuid;
BEGIN
  SELECT id INTO author_id FROM authors WHERE name = '[Full Name]';

  -- Camp 1: [Domain] → [Camp Name] ([relevance])
  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES (
    '[camp_uuid]',
    author_id,
    '[strong/partial/challenges/emerging]',
    '[Domain-specific quote 60-150 words]',
    '[Source URL from quote]',
    '[Why it matters in this domain 80-180 words]'
  );

  -- Camp 2: Repeat for each camp...

END $$;

COMMIT;

-- Verification
SELECT
  a.name,
  a.sources,
  COUNT(ca.id) as camp_count
FROM authors a
LEFT JOIN camp_authors ca ON a.id = ca.author_id
WHERE a.name = '[Full Name]'
GROUP BY a.name, a.sources;
```

---

## Example: Lex Fridman (Complete)

```sql
BEGIN;

INSERT INTO authors (
  name,
  primary_affiliation,
  header_affiliation,
  notes,
  credibility_tier,
  author_type,
  sources
) VALUES (
  'Lex Fridman',
  'MIT, Podcast Host',
  'MIT',
  'AI researcher at MIT and host of one of the world''s most influential tech podcasts. His long-form interviews with AI researchers, tech leaders, and philosophers reach millions and shape public understanding of AI.',
  'Major Voice',
  'researcher',
  '[
    {
      "url": "https://lexfridman.com/podcast/",
      "type": "Podcast",
      "year": "2024",
      "title": "Lex Fridman Podcast"
    },
    {
      "url": "https://www.youtube.com/@lexfridman",
      "type": "YouTube",
      "year": "2024",
      "title": "Lex Fridman YouTube Channel"
    },
    {
      "url": "https://mitibmwatsonailab.mit.edu/",
      "type": "Research",
      "year": "2024",
      "title": "MIT-IBM Watson AI Lab"
    },
    {
      "url": "https://arxiv.org/search/?query=Lex+Fridman&searchtype=author",
      "type": "Papers",
      "year": "2024",
      "title": "Research Papers on Autonomous Vehicles & Deep Learning"
    }
  ]'::jsonb
);

DO $$
DECLARE
  lex_id uuid;
BEGIN
  SELECT id INTO lex_id FROM authors WHERE name = 'Lex Fridman';

  INSERT INTO camp_authors (camp_id, author_id, relevance, key_quote, quote_source_url, why_it_matters)
  VALUES
  ('c5dcb027-cd27-4c91-adb4-aca780d15199', lex_id, 'strong',
   'I''m increasingly convinced that scaling, combined with the right architectural improvements, will get us to AGI...',
   'https://lexfridman.com/podcast/',
   'Fridman''s podcast features deep technical conversations with scaling advocates...'),

  -- Additional camps...

END $$;

COMMIT;
```

---

## Quality Checklist

Before adding an author, verify:

### Author Profile
- [ ] Name is official/correct spelling
- [ ] Affiliation is current (check their website)
- [ ] Header affiliation is short (1-2 words max)
- [ ] Notes explains their significance (2-3 sentences)
- [ ] Credibility tier is appropriate
- [ ] Author type fits their primary role

### Sources (CRITICAL)
- [ ] **Minimum 3 sources provided**
- [ ] All URLs are working
- [ ] Mix of source types (not all same type)
- [ ] At least one substantial source (book/research/org)
- [ ] Titles are clear and descriptive
- [ ] Years are accurate
- [ ] JSON format is valid

### Camp Relationships
- [ ] 2-5 camps mapped (not too few, not too many)
- [ ] Camps span multiple domains when appropriate
- [ ] Relevance levels are accurate
- [ ] Each quote is domain-specific (not generic)
- [ ] Quote sources match author sources when possible
- [ ] "Why it matters" explains influence in THAT domain

### Technical
- [ ] SQL syntax is correct
- [ ] UUIDs match actual camp IDs
- [ ] JSONB format is valid
- [ ] Transaction wrapped in BEGIN/COMMIT
- [ ] Verification query included

---

## Common Mistakes to Avoid

❌ **DON'T**:
- Use `bio` field (doesn't exist - use `notes`)
- Add `x_handle` or `linkedin_url` (columns don't exist)
- Copy same quote across multiple camps
- Use generic "why it matters" for all camps
- Forget to add sources (REQUIRED!)
- Use only 1-2 sources (minimum 3)
- Use broken/dead URLs
- Skip verification queries

✅ **DO**:
- Use `notes` field for bio information
- Research domain-specific quotes for each camp
- Write unique "why it matters" per camp relationship
- Include 3-4 diverse sources minimum
- Test all source URLs before adding
- Run verification after insertion
- Check author appears in search results

---

## Testing After Addition

```bash
# 1. Verify author was added
node --env-file=.env.local -e "
import('dotenv/config').then(() => {
  import('pg').then(async (pkg) => {
    const { default: pg } = pkg;
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const result = await pool.query(\`
      SELECT
        a.name,
        a.sources,
        COUNT(ca.id) as camp_count
      FROM authors a
      LEFT JOIN camp_authors ca ON a.id = ca.author_id
      WHERE a.name = '[Author Name]'
      GROUP BY a.name, a.sources
    \`);
    console.log(result.rows);
    await pool.end();
  });
});
"

# 2. Check sources are properly formatted
# 3. Verify camps have quotes and why_it_matters
# 4. Test search results display correctly
# 5. Check author appears in appropriate domain searches
```

---

## File Organization

- **SQL Files**: `/Docs/data/seed/add_[author_name].sql`
- **Documentation**: Update `/Docs/AUTHOR_ADDITION_LOG.md`
- **Verification**: Run scripts from `/scripts/`

---

## Quick Reference: Source Type Examples

| Type | Example |
|------|---------|
| Book | Published book on Amazon/publisher site |
| Paper | arXiv paper, journal article, conference paper |
| Podcast | Regular podcast series |
| Blog | Personal blog, Medium, Substack |
| YouTube | YouTube channel |
| Research | Research lab, institute affiliation |
| Organization | Organization founded/led by author |
| Website | Personal website with writings |

---

## Summary

Every author needs:
1. ✅ Complete profile (name, affiliation, notes, tier, type)
2. ✅ **3+ sources** with URLs, types, years, titles
3. ✅ 2-5 camp relationships
4. ✅ Domain-specific quotes per camp (60-150 words)
5. ✅ Quote source URLs
6. ✅ "Why it matters" per camp (80-180 words)
7. ✅ Verification that they appear in search

**Remember**: Sources are NOT optional - they're required for every author!
