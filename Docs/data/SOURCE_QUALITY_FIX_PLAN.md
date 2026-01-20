# Source Quality Fix Plan
*Address generic sources and quote-source mismatches before date enrichment*

---

## Critical Issue Identified

**Problem:** Many sources are too generic to be useful citations:
- "YouTube Channel" instead of a specific video
- "Blog homepage" instead of a specific article
- "Podcast" instead of a specific episode

**Why this matters:**
1. **Citation integrity:** Can't verify quotes without specific sources
2. **Date accuracy:** Generic sources can't be dated (channels don't have "publication dates")
3. **User trust:** "Source: YouTube Channel" is not a credible citation
4. **Curation quality:** Can't use these for Position Verification agent

**Root cause:** Sources were added quickly without specificity requirements.

---

## The Correct Process

For each author, we need:

```
Author: Geoffrey Hinton
├── key_quote: "Deep learning is going to be able to do everything"
├── quote_source_url: https://youtube.com/watch?v=abc123  ✅ Specific video
│
└── sources:
    ├── ✅ VALID: "Deep Learning Revolution (YouTube video)"
    │   - URL: https://youtube.com/watch?v=abc123
    │   - Date: 2023-05-15
    │   - Quote appears at 12:34 in video
    │
    ├── ❌ INVALID: "Geoffrey Hinton YouTube Channel"
    │   - URL: https://youtube.com/@geoffhinton
    │   - This is generic, can't be dated, no specific quote
    │
    └── ✅ VALID: "The Future of AI (Nature article)"
        - URL: https://nature.com/articles/abc123
        - Date: 2024-03-15
        - Quote appears in paragraph 3
```

---

## Solution Architecture

### Phase 1: Audit Source Quality (Day 1)

**Script: `scripts/audit-source-quality.ts`**

Categorize each source as:
1. **SPECIFIC** - Can be cited (article, video, episode, paper)
2. **GENERIC** - Can't be cited (channel, homepage, profile)
3. **AMBIGUOUS** - Needs human review

**Checks:**
```typescript
function classifySource(source: any): 'specific' | 'generic' | 'ambiguous' {
  const url = source.url || ''
  const title = source.title || ''

  // Generic indicators (BAD)
  if (url.includes('youtube.com/@') || url.includes('youtube.com/channel/')) return 'generic'
  if (url.match(/https?:\/\/[^\/]+\/?$/)) return 'generic'  // Homepage only
  if (title.toLowerCase().includes('channel')) return 'generic'
  if (title.toLowerCase().includes('homepage')) return 'generic'
  if (title.toLowerCase().includes('website')) return 'generic'
  if (title.toLowerCase().includes('profile')) return 'generic'
  if (title.toLowerCase().includes('blog') && !title.toLowerCase().includes('post')) return 'generic'

  // Specific indicators (GOOD)
  if (url.includes('youtube.com/watch?v=')) return 'specific'
  if (url.includes('/articles/')) return 'specific'
  if (url.includes('/episode')) return 'specific'
  if (url.includes('arxiv.org/abs/')) return 'specific'
  if (url.match(/\/\d{4}\/\d{2}\//)) return 'specific'  // Date in path

  return 'ambiguous'
}
```

**Output:**
```
=== SOURCE QUALITY AUDIT ===
Total sources: 820
  ✅ Specific: 234 (28.5%)
  ❌ Generic: 412 (50.2%)
  ⚠️  Ambiguous: 174 (21.2%)

TOP AUTHORS WITH GENERIC SOURCES:
  1. Lex Fridman: 6/8 generic
  2. Andrej Karpathy: 4/7 generic
  ...
```

---

### Phase 2: Match Quotes to Sources (Days 2-3)

**Script: `scripts/match-quotes-to-sources.ts`**

For each author:
1. Get their `key_quote` and `quote_source_url`
2. Check if `quote_source_url` appears in their sources list
3. If not, find which source contains the quote
4. If quote can't be matched, flag for manual research

**Process:**
```typescript
async function matchQuoteToSource(author: Author): Promise<QuoteMatch> {
  const { key_quote, quote_source_url, sources } = author

  // Check if quote_source_url matches any source
  const matchingSource = sources.find(s => s.url === quote_source_url)

  if (matchingSource) {
    return {
      status: 'matched',
      source: matchingSource,
      confidence: 'high'
    }
  }

  // Try to find source by content similarity
  const likelySource = findMostLikelySource(sources, quote_source_url)

  if (likelySource) {
    return {
      status: 'fuzzy_match',
      source: likelySource,
      confidence: 'medium',
      note: 'URL differs but likely the same content'
    }
  }

  return {
    status: 'no_match',
    confidence: 'low',
    note: 'Quote source not found in sources list'
  }
}
```

**Output:**
```json
{
  "matched": 156,
  "fuzzy_match": 78,
  "no_match": 86,
  "issues": [
    {
      "author": "Geoffrey Hinton",
      "quote": "Deep learning is going to...",
      "quote_source_url": "https://youtube.com/watch?v=abc",
      "problem": "Source list only has channel URL, not specific video",
      "recommendation": "Add specific video to sources"
    }
  ]
}
```

---

### Phase 3: Find Specific Content (Days 4-5)

**For generic sources, use AI to find the specific content:**

**Script: `scripts/find-specific-content.ts`**

```typescript
async function findSpecificContent(
  author: Author,
  genericSource: Source,
  quote: string
): Promise<SpecificContent> {

  const prompt = `You are a research assistant finding specific content.

AUTHOR: ${author.name}
GENERIC SOURCE: ${genericSource.title} (${genericSource.url})
QUOTE TO FIND: "${quote}"

TASK: Find the SPECIFIC article, video, podcast episode, or paper where this quote appears.

For YouTube channels: Find the specific video URL and title
For blogs: Find the specific blog post URL and title
For podcasts: Find the specific episode URL, title, and number
For books: Find the specific chapter/page if possible

Return ONLY valid JSON:
{
  "found": true/false,
  "specificUrl": "exact URL of the specific content",
  "specificTitle": "exact title of the article/video/episode",
  "contentType": "video|article|podcast_episode|paper|book_chapter",
  "publishedDate": "YYYY-MM-DD if found, else null",
  "confidence": "high|medium|low",
  "reasoning": "How you found it (searched channel, checked blog archives, etc.)",
  "quoteContext": "Where in the content the quote appears (timestamp, paragraph, page)"
}

If you cannot find it, set found: false and explain why.`

  const response = await callGemini(prompt, 'pro')
  const result = JSON.parse(response)

  return result
}
```

**Example transformation:**

**Before (Generic):**
```json
{
  "title": "Lex Fridman YouTube Channel",
  "url": "https://youtube.com/@lexfridman",
  "year": "2024"
}
```

**After (Specific):**
```json
{
  "title": "Lex Fridman Podcast #412: Marc Andreessen",
  "url": "https://youtube.com/watch?v=xyz123",
  "published_date": "2024-03-15",
  "type": "Video",
  "quote_timestamp": "1:23:45"
}
```

---

### Phase 4: Validation Rules (Day 6)

**Create strict validation for new sources:**

```typescript
interface SourceValidation {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export function validateSourceQuality(source: SourceInput): SourceValidation {
  const errors: string[] = []
  const warnings: string[] = []

  // Rule 1: URL must be specific, not generic
  if (isGenericUrl(source.url)) {
    errors.push(`Generic URL not allowed: ${source.url}. Must be a specific article/video/episode.`)
  }

  // Rule 2: Title must indicate specific content
  const genericTitleWords = ['channel', 'homepage', 'website', 'profile', 'blog']
  const hasGenericTitle = genericTitleWords.some(word =>
    source.title.toLowerCase().includes(word) &&
    !source.title.toLowerCase().includes('blog post')
  )

  if (hasGenericTitle) {
    errors.push(`Generic title not allowed: "${source.title}". Must reference specific content.`)
  }

  // Rule 3: Must have specific date (YYYY-MM-DD)
  if (!source.published_date) {
    errors.push('published_date required (YYYY-MM-DD format)')
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(source.published_date)) {
    errors.push(`published_date must be YYYY-MM-DD, got: ${source.published_date}`)
  }

  // Rule 4: Type must be specific
  const genericTypes = ['Other', 'Website']
  if (genericTypes.includes(source.type)) {
    warnings.push(`Type "${source.type}" is vague. Use specific type: Video, Article, Podcast, Paper, etc.`)
  }

  // Rule 5: Summary should describe the content
  if (!source.summary || source.summary.length < 20) {
    warnings.push('Summary should describe what the content covers (20+ characters)')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

function isGenericUrl(url: string): boolean {
  const patterns = [
    /youtube\.com\/@/,                    // Channel
    /youtube\.com\/channel\//,            // Channel
    /youtube\.com\/user\//,               // Channel
    /^https?:\/\/[^\/]+\/?$/,            // Homepage only
    /^https?:\/\/[^\/]+\/about\/?$/,     // About page
    /^https?:\/\/[^\/]+\/blog\/?$/,      // Blog homepage
    /twitter\.com\/[^\/]+\/?$/,          // Profile
    /linkedin\.com\/in\/[^\/]+\/?$/,     // Profile
  ]

  return patterns.some(pattern => pattern.test(url))
}
```

**Enforcement:**
```typescript
// In all author addition scripts:
for (const source of author.sources) {
  const validation = validateSourceQuality(source)

  if (!validation.valid) {
    console.error(`❌ Invalid source: ${source.title}`)
    validation.errors.forEach(e => console.error(`  - ${e}`))
    throw new Error('Source validation failed')
  }

  if (validation.warnings.length > 0) {
    console.warn(`⚠️  Warnings for: ${source.title}`)
    validation.warnings.forEach(w => console.warn(`  - ${w}`))
  }
}
```

---

### Phase 5: Fix Existing Sources (Week 2)

**For the 412 generic sources found in audit:**

**Priority 1: Sources with quotes (High Priority)**
- Use `findSpecificContent` agent to locate exact content
- Cost: ~$5-10 for 200 authors

**Priority 2: Tier 1 authors without quotes**
- Manual research for top 30 authors
- Time: ~4-8 hours

**Priority 3: Rest of generic sources**
- Batch process with agent
- Manual review low-confidence results
- Time: ~16 hours across 2 weeks

---

### Phase 6: Then Enrich Dates (Week 3)

**Only AFTER sources are specific:**
- Run date enrichment on validated sources
- Should have >95% success rate since sources are now specific
- Agent can find dates in video descriptions, article metadata, etc.

---

## Implementation Timeline

```
WEEK 1: Audit & Validate
├── Day 1: Run source quality audit
├── Day 2-3: Match quotes to sources
├── Day 4-5: Find specific content for top 30 authors
└── Day 6: Create validation rules

WEEK 2: Fix Generic Sources
├── Day 1-2: Fix sources for authors with quotes (Priority 1)
├── Day 3-4: Manual research tier 1 authors (Priority 2)
└── Day 5: Batch process remaining (Priority 3)

WEEK 3: Date Enrichment
├── Day 1: Run enrichment on validated sources
├── Day 2-3: Manual review low-confidence dates
└── Day 4-5: Database migration & cleanup
```

---

## Examples of Fixes Needed

### Example 1: Lex Fridman

**Current (INVALID):**
```json
{
  "title": "Lex Fridman Podcast",
  "url": "https://lexfridman.com/podcast/",
  "year": "2024",
  "quote": "AI safety is the most important problem of our time"
}
```

**Fixed (VALID):**
```json
{
  "title": "Lex Fridman Podcast #376: Geoffrey Hinton",
  "url": "https://youtube.com/watch?v=qpoRO378qRY",
  "published_date": "2023-05-05",
  "type": "Video",
  "summary": "Geoffrey Hinton discusses leaving Google and AI safety concerns",
  "quote_timestamp": "1:42:15"
}
```

---

### Example 2: Andrej Karpathy

**Current (INVALID):**
```json
{
  "title": "Andrej Karpathy YouTube Channel",
  "url": "https://youtube.com/@AndrejKarpathy",
  "year": "2024"
}
```

**Fixed (VALID):**
```json
[
  {
    "title": "Let's build GPT: from scratch, in code, spelled out",
    "url": "https://youtube.com/watch?v=kCc8FmEb1nY",
    "published_date": "2023-01-17",
    "type": "Video",
    "summary": "Building a GPT-style language model from scratch with step-by-step implementation"
  },
  {
    "title": "State of GPT | BRK216HFS",
    "url": "https://youtube.com/watch?v=bZQun8Y4L2A",
    "published_date": "2023-05-24",
    "type": "Video",
    "summary": "Technical talk on how GPT models are trained and how to use them effectively"
  }
]
```

---

## Success Criteria

**Phase 1 (Audit):**
- [ ] Identified all generic sources
- [ ] Categorized 100% of sources
- [ ] Created priority list for fixing

**Phase 2 (Quote Matching):**
- [ ] Matched 80%+ of quotes to specific sources
- [ ] Identified quotes needing specific content
- [ ] Created fix list

**Phase 3 (Find Specific Content):**
- [ ] Found specific content for 90%+ of quotes
- [ ] Confidence score for each match
- [ ] Manual review list for low-confidence

**Phase 4 (Validation):**
- [ ] Validation rules enforced in all scripts
- [ ] New sources must pass validation
- [ ] Documentation updated

**Phase 5 (Fix Sources):**
- [ ] All tier 1 authors have specific sources
- [ ] 90%+ of sources are specific
- [ ] Remaining generic sources documented as "needs research"

**Phase 6 (Date Enrichment):**
- [ ] 95%+ of specific sources get accurate dates
- [ ] Date confidence tracked
- [ ] Ready for curation agents to use

---

## Cost & Time Estimates

**AI API Costs:**
- Find specific content: ~200 authors × $0.05 = $10
- Date enrichment after: ~$10-15
- **Total: ~$20-25**

**Human Time:**
- Audit & categorization: 4 hours
- Quote matching validation: 4 hours
- Manual research (tier 1): 8 hours
- Review AI results: 8 hours
- **Total: ~24 hours over 2-3 weeks**

**Benefits:**
- Citation integrity restored
- Curation agents work correctly
- User trust improved
- Foundation for quality enforcement

---

## Next Steps

1. **Run source quality audit** to quantify the problem
2. **Review audit results** and prioritize fixes
3. **Start with top 10 authors** as pilot
4. **Validate approach** before full batch

Ready to proceed with the audit?

---

*Document version: 1.0*
*Created: January 2025*
*Priority: CRITICAL - Must fix before date enrichment*
