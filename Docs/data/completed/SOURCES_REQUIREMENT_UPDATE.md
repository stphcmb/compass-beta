# Sources Requirement - NOW MANDATORY ✅

## What Changed

**Before**: Authors could be added without sources
**After**: Every author MUST have at least 3 sources

## Why This Matters

Sources provide:
- ✅ Credibility verification
- ✅ User ability to dive deeper
- ✅ Context for where author's views come from
- ✅ Transparency in data provenance

## Required Format

Each author needs `sources` as JSONB array with 3+ items:

```json
[
  {
    "url": "https://example.com/work",
    "type": "Podcast|Book|Paper|YouTube|Blog|Research|Organization",
    "year": "2024",
    "title": "Title of Work"
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
]
```

## Quality Standards for Sources

### Minimum Requirements
- ✅ At least 3 sources
- ✅ All URLs must be working
- ✅ Mix of source types (not all podcasts, etc.)
- ✅ At least one substantial source (Book, Research, Organization)

### Best Practices
- ✅ 4-5 sources is ideal
- ✅ Include their most influential work
- ✅ Recent sources (last 3 years) when possible
- ✅ Prefer primary sources (their own work vs. interviews about them)
- ✅ Match quote source URLs to author sources when possible

## Source Type Reference

| Type | When to Use | Example |
|------|-------------|---------|
| **Book** | Published books | "Human Compatible" by Stuart Russell |
| **Paper** | Research papers | arXiv paper, journal article |
| **Podcast** | Regular podcast series | "Lex Fridman Podcast" |
| **YouTube** | YouTube channel | Official YouTube channel |
| **Blog** | Blog/newsletter | Substack, Medium, personal blog |
| **Research** | Research lab/institute | MIT-IBM Watson AI Lab |
| **Organization** | Founded/leading org | Center for Humane Technology |
| **Website** | Personal website | Official website with writings |

## Example: Lex Fridman ✅

```json
[
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
]
```

**Why this works**:
- ✅ 4 sources (exceeds minimum 3)
- ✅ Mix of types: Podcast, YouTube, Research, Papers
- ✅ Includes substantial sources (Research lab, Papers)
- ✅ All URLs are working
- ✅ Titles are clear and descriptive

## How to Add Sources

### In SQL
```sql
INSERT INTO authors (
  name,
  primary_affiliation,
  header_affiliation,
  notes,
  credibility_tier,
  author_type,
  sources  -- JSONB field
) VALUES (
  'Author Name',
  'Primary Affiliation',
  'Short Header',
  'Bio notes',
  'tier_1',
  'researcher',
  '[
    {"url": "...", "type": "Podcast", "year": "2024", "title": "..."},
    {"url": "...", "type": "Book", "year": "2023", "title": "..."},
    {"url": "...", "type": "Research", "year": "2024", "title": "..."}
  ]'::jsonb
);
```

### Via Script
```javascript
const sources = [
  {
    url: 'https://example.com/work1',
    type: 'Podcast',
    year: '2024',
    title: 'Main Podcast'
  },
  {
    url: 'https://example.com/work2',
    type: 'Book',
    year: '2023',
    title: 'Important Book'
  },
  {
    url: 'https://example.com/work3',
    type: 'Research',
    year: '2024',
    title: 'Research Lab'
  }
];

await pool.query(
  'UPDATE authors SET sources = $1::jsonb WHERE name = $2',
  [JSON.stringify(sources), 'Author Name']
);
```

## Verification

Check sources were added correctly:

```bash
node --env-file=.env.local -e "
import('dotenv/config').then(() => {
  import('pg').then(async (pkg) => {
    const { default: pg } = pkg;
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const result = await pool.query(\`
      SELECT name, sources
      FROM authors
      WHERE name = 'Author Name'
    \`);
    console.log(JSON.stringify(result.rows[0].sources, null, 2));
    await pool.end();
  });
});
"
```

## Common Mistakes

❌ **DON'T**:
- Skip sources (now mandatory!)
- Use only 1-2 sources (minimum 3)
- Use all same type (all podcasts, etc.)
- Use dead/broken URLs
- Use overly generic titles
- Forget to test URLs

✅ **DO**:
- Include 3-5 diverse sources
- Mix source types
- Test all URLs before adding
- Use clear, descriptive titles
- Include at least one substantial source
- Match quote sources to author sources when possible

## Impact

**Current Database**:
- Total authors: 53
- Authors with sources: ~45+ (checking in progress)
- **Goal**: 100% coverage

**For New Authors**:
- Sources are now mandatory
- Quality bar is raised
- Users get better context
- Data provenance is clear

## Documentation Updates

✅ **Updated Files**:
- `/Docs/AUTHOR_ADDITION_GUIDE.md` - Complete guide with sources requirement
- `/Docs/AUTHOR_ADDITION_LOG.md` - Added source requirements to quality standards
- `/Docs/SOURCES_REQUIREMENT_UPDATE.md` - This document

✅ **Example Updated**:
- Lex Fridman now has 4 sources
- Serves as reference for future additions

## Next Steps

1. **For New Authors**: Follow updated guide, sources mandatory
2. **For Existing Authors**: Gradually add sources to authors that lack them
3. **Quality Check**: Verify all new additions have 3+ sources
4. **User Benefit**: Sources will display in author cards (when UI supports it)

---

**Status**: ✅ Requirement added, guide updated, Lex Fridman serves as example

**See**: `/Docs/AUTHOR_ADDITION_GUIDE.md` for complete implementation details
