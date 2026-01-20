# Source Dates Fix Plan
*Comprehensive strategy to enrich existing dates and enforce accuracy for new sources*

---

## Executive Summary

**Problem:** All sources currently have dates defaulting to `YYYY-01-01` format (e.g., `2024-01-01`) because they were added with only `year` field, not specific publication dates.

**Impact:**
- Curation agents (Position Verification, Source Discovery) rely on accurate dates
- Canon freshness indicators are misleading
- Staleness detection doesn't work properly
- User trust is undermined if dates are visibly inaccurate

**Solution:** Two-phase approach:
1. **Phase 1: Fix existing sources** using the `enrichSourceDates` agent
2. **Phase 2: Enforce accuracy** for all new source additions

**Timeline:** 2-3 weeks
**Cost:** ~$10-20 for AI-powered date enrichment (one-time)

---

## Part 1: Root Cause Analysis

### How Sources Are Currently Stored

Sources exist in TWO locations:

#### Location 1: `authors.sources` JSONB field
```typescript
authors.sources = [
  {
    url: 'https://example.com/article',
    type: 'News',
    year: '2025',  // ❌ Only year, no specific date
    title: 'Article Title'
  }
]
```

#### Location 2: `sources` table (dedicated)
```sql
INSERT INTO sources (author_id, title, url, published_date) VALUES
  ('uuid', 'Article', 'https://...', '2024-01-15');  // ✅ Some have specific dates
```

### The Default Behavior

In `app/api/admin/canon-health/route.ts:136`:
```typescript
if (!pubDate && src.year) {
  pubDate = `${src.year}-01-01` // ❌ Defaults to January 1
}
```

This means:
- Sources with only `year: '2024'` → displayed as `2024-01-01`
- User sees "Published: Jan 1, 2024" for everything
- Curation agents think all 2024 sources are from January

### Why This Happened

When sources were bulk-added via scripts:
1. Many sources only had year information readily available
2. Extracting exact dates required additional research
3. Scripts defaulted to `year` field for speed
4. Display logic filled in `-01-01` to avoid showing null dates

---

## Part 2: Impact Assessment

### High-Impact Problems

| Problem | Severity | Details |
|---------|----------|---------|
| **Curation agent accuracy** | CRITICAL | Position Verification agent uses dates to determine confidence. If all sources appear to be from Jan 1, confidence calculations are wrong. |
| **Staleness detection** | HIGH | "Most recent source: 2024-01-01" is meaningless—could be from January or December |
| **User trust** | HIGH | Users notice when every source is dated Jan 1. Looks sloppy or fake. |
| **Source discovery** | MEDIUM | Agent looks for content "since last source" but can't determine actual recency |
| **Timeline visualization** | MEDIUM | Future feature (content over time) won't work with fake dates |

### Current State Statistics

Based on code analysis:
- ~200 authors with `sources` in JSONB field
- Estimated 1,000-2,000 sources with only `year` field
- Unknown number of sources in `sources` table with specific dates

**Need to audit actual data to quantify the problem.**

---

## Part 3: Solution Architecture

### Strategy: Layered Enrichment

```
┌───────────────────────────────────────────────────────────┐
│  PHASE 1: FIX EXISTING (One-time migration)              │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  Step 1: Audit & Inventory                               │
│  └─> Identify all sources with only year                 │
│                                                           │
│  Step 2: Batch Enrichment                                │
│  └─> Use enrichSourceDates agent to find real dates      │
│                                                           │
│  Step 3: Manual Review (High-priority authors)           │
│  └─> Human verification for top 30 authors               │
│                                                           │
│  Step 4: Database Update                                 │
│  └─> Apply enriched dates to sources                     │
│                                                           │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│  PHASE 2: ENFORCE ACCURACY (Ongoing process)             │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  Rule 1: Date Required at Addition                       │
│  └─> Scripts must provide published_date, not just year  │
│                                                           │
│  Rule 2: Automated Enrichment                            │
│  └─> Run enrichSourceDates before adding to DB           │
│                                                           │
│  Rule 3: Validation & Quality Checks                     │
│  └─> Reject sources without dates or with suspicious dates│
│                                                           │
│  Rule 4: Confidence Tracking                             │
│  └─> Store date confidence (high/medium/low)             │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

---

## Part 4: Phase 1 - Fix Existing Sources

### Step 1: Audit & Inventory (Day 1)

**Objective:** Identify all sources that need date enrichment.

**Script: `scripts/audit-source-dates.ts`**
```typescript
import { supabase } from '@/lib/supabase'

interface SourceAudit {
  location: 'authors.sources' | 'sources_table'
  authorId: string
  authorName: string
  sourceTitle: string
  currentDate: string | null
  dateQuality: 'specific' | 'year-only' | 'missing'
  url: string
}

async function auditSourceDates() {
  const audit: SourceAudit[] = []

  // Audit authors.sources JSONB field
  const { data: authors } = await supabase
    .from('authors')
    .select('id, name, sources')

  for (const author of authors || []) {
    if (!author.sources || !Array.isArray(author.sources)) continue

    for (const source of author.sources) {
      const hasSpecificDate = source.published_date || source.date
      const hasYearOnly = !hasSpecificDate && source.year
      const hasMissingDate = !hasSpecificDate && !source.year

      audit.push({
        location: 'authors.sources',
        authorId: author.id,
        authorName: author.name,
        sourceTitle: source.title || 'Untitled',
        currentDate: hasSpecificDate ? (source.published_date || source.date) : source.year,
        dateQuality: hasSpecificDate ? 'specific' : hasYearOnly ? 'year-only' : 'missing',
        url: source.url || ''
      })
    }
  }

  // Audit sources table
  const { data: sources } = await supabase
    .from('sources')
    .select(`
      id,
      title,
      url,
      published_date,
      author_id,
      authors (name)
    `)

  for (const source of sources || []) {
    const dateStr = source.published_date?.toString() || ''
    const isYearOnly = dateStr.endsWith('-01-01')

    audit.push({
      location: 'sources_table',
      authorId: source.author_id,
      authorName: source.authors?.name || 'Unknown',
      sourceTitle: source.title,
      currentDate: source.published_date,
      dateQuality: dateStr ? (isYearOnly ? 'year-only' : 'specific') : 'missing',
      url: source.url
    })
  }

  // Generate report
  const summary = {
    total: audit.length,
    specific: audit.filter(s => s.dateQuality === 'specific').length,
    yearOnly: audit.filter(s => s.dateQuality === 'year-only').length,
    missing: audit.filter(s => s.dateQuality === 'missing').length,
    byAuthor: groupBy(audit, 'authorName')
  }

  console.log('=== SOURCE DATE AUDIT ===')
  console.log(`Total sources: ${summary.total}`)
  console.log(`Specific dates: ${summary.specific} (${pct(summary.specific, summary.total)}%)`)
  console.log(`Year only: ${summary.yearOnly} (${pct(summary.yearOnly, summary.total)}%)`)
  console.log(`Missing: ${summary.missing} (${pct(summary.missing, summary.total)}%)`)
  console.log('\nNeeds enrichment:', summary.yearOnly + summary.missing)

  // Export full audit to JSON
  await writeFile('source-date-audit.json', JSON.stringify(audit, null, 2))
  console.log('\nFull audit exported to: source-date-audit.json')
}

function pct(n: number, total: number): string {
  return ((n / total) * 100).toFixed(1)
}

function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const group = String(item[key])
    if (!acc[group]) acc[group] = []
    acc[group].push(item)
    return acc
  }, {} as Record<string, T[]>)
}

auditSourceDates()
```

**Output:**
```
=== SOURCE DATE AUDIT ===
Total sources: 1,847
Specific dates: 234 (12.7%)
Year only: 1,542 (83.5%)
Missing: 71 (3.8%)

Needs enrichment: 1,613

Full audit exported to: source-date-audit.json
```

**Acceptance Criteria:**
- [ ] Audit script runs successfully
- [ ] JSON export includes all source details
- [ ] Summary shows breakdown by date quality
- [ ] Identified sources needing enrichment

---

### Step 2: Batch Enrichment (Days 2-3)

**Objective:** Use `enrichSourceDates` agent to find accurate publication dates.

**Script: `scripts/enrich-all-source-dates.ts`**
```typescript
import { supabase } from '@/lib/supabase'
import { enrichSourceDates, EnrichedSourceDate } from '@/lib/curation/agents'
import { readFile, writeFile } from 'fs/promises'

interface EnrichmentResult {
  authorId: string
  authorName: string
  sourceTitle: string
  originalDate: string | null
  enrichedDate: string | null
  confidence: 'high' | 'medium' | 'low'
  reasoning: string
  source: string
  needsReview: boolean
}

async function enrichAllSources() {
  // Load audit results
  const audit = JSON.parse(await readFile('source-date-audit.json', 'utf-8'))
  const toEnrich = audit.filter((s: any) => s.dateQuality !== 'specific')

  console.log(`Starting enrichment for ${toEnrich.length} sources...`)

  const results: EnrichmentResult[] = []
  const errors: Array<{ authorName: string; error: string }> = []

  // Group by author for batching (more efficient)
  const byAuthor = groupBy(toEnrich, 'authorId')
  const authors = Object.keys(byAuthor)

  console.log(`Processing ${authors.length} authors...`)

  for (let i = 0; i < authors.length; i++) {
    const authorId = authors[i]
    const authorSources = byAuthor[authorId]
    const authorName = authorSources[0].authorName

    console.log(`\n[${i + 1}/${authors.length}] ${authorName} (${authorSources.length} sources)`)

    try {
      // Prepare sources for enrichment
      const sourcesToEnrich = authorSources.map((s: any) => ({
        title: s.sourceTitle,
        url: s.url,
        year: s.currentDate || undefined,
        date: s.currentDate?.includes('-') ? s.currentDate : undefined
      }))

      // Call enrichment agent
      const enriched = await enrichSourceDates(sourcesToEnrich, authorName)

      // Process results
      for (let j = 0; j < enriched.length; j++) {
        const e = enriched[j]
        const original = authorSources[j]

        results.push({
          authorId,
          authorName,
          sourceTitle: original.sourceTitle,
          originalDate: original.currentDate,
          enrichedDate: e.enrichedDate,
          confidence: e.confidence,
          reasoning: e.reasoning,
          source: e.source,
          needsReview: e.confidence === 'low' || !e.enrichedDate
        })

        console.log(`  ${j + 1}. ${e.enrichedDate || 'NO DATE'} (${e.confidence}) - ${e.reasoning}`)
      }

      // Rate limiting: wait 2 seconds between authors to avoid API throttling
      if (i < authors.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }

    } catch (error) {
      console.error(`  ❌ Error:`, error)
      errors.push({
        authorName,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Generate summary
  const summary = {
    total: results.length,
    enriched: results.filter(r => r.enrichedDate).length,
    failed: results.filter(r => !r.enrichedDate).length,
    highConfidence: results.filter(r => r.confidence === 'high').length,
    mediumConfidence: results.filter(r => r.confidence === 'medium').length,
    lowConfidence: results.filter(r => r.confidence === 'low').length,
    needsReview: results.filter(r => r.needsReview).length,
    errors: errors.length
  }

  console.log('\n=== ENRICHMENT SUMMARY ===')
  console.log(`Total processed: ${summary.total}`)
  console.log(`Successfully enriched: ${summary.enriched} (${pct(summary.enriched, summary.total)}%)`)
  console.log(`Failed to enrich: ${summary.failed} (${pct(summary.failed, summary.total)}%)`)
  console.log(`\nConfidence breakdown:`)
  console.log(`  High: ${summary.highConfidence}`)
  console.log(`  Medium: ${summary.mediumConfidence}`)
  console.log(`  Low: ${summary.lowConfidence}`)
  console.log(`\nNeeds manual review: ${summary.needsReview}`)
  console.log(`Errors: ${summary.errors}`)

  // Export results
  await writeFile('enrichment-results.json', JSON.stringify(results, null, 2))
  await writeFile('enrichment-errors.json', JSON.stringify(errors, null, 2))

  console.log('\nResults exported to: enrichment-results.json')
  console.log('Errors exported to: enrichment-errors.json')

  // Generate SQL update script (for high + medium confidence only)
  const sqlUpdates = generateUpdateSQL(results.filter(r =>
    r.enrichedDate && (r.confidence === 'high' || r.confidence === 'medium')
  ))

  await writeFile('update-source-dates.sql', sqlUpdates)
  console.log('SQL updates exported to: update-source-dates.sql')
}

function generateUpdateSQL(results: EnrichmentResult[]): string {
  let sql = `-- Auto-generated source date updates
-- Generated: ${new Date().toISOString()}
-- Total updates: ${results.length}
-- Confidence threshold: high + medium only

BEGIN;

`

  // Group by author for JSONB updates
  const byAuthor = groupBy(results, 'authorId')

  for (const [authorId, sources] of Object.entries(byAuthor)) {
    sql += `-- Update sources for ${sources[0].authorName}\n`

    for (const s of sources) {
      // This is a simplified example - actual implementation depends on JSONB structure
      sql += `-- ${s.sourceTitle}: ${s.originalDate} → ${s.enrichedDate} (${s.confidence})\n`
      sql += `-- Reasoning: ${s.reasoning}\n`
      sql += `UPDATE authors
SET sources = jsonb_set(
  sources,
  '{?}',  -- Need to find array index
  jsonb_build_object('published_date', '${s.enrichedDate}')
)
WHERE id = '${authorId}'
  AND sources @> '[{"title": "${s.sourceTitle.replace(/'/g, "''")}"}]'::jsonb;\n\n`
    }
  }

  sql += `COMMIT;\n`
  return sql
}

function pct(n: number, total: number): string {
  return ((n / total) * 100).toFixed(1)
}

function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const group = String(item[key])
    if (!acc[group]) acc[group] = []
    acc[group].push(item)
    return acc
  }, {} as Record<string, T[]>)
}

enrichAllSources()
```

**Expected Output:**
```
Starting enrichment for 1,613 sources...
Processing 187 authors...

[1/187] Sam Altman (12 sources)
  1. 2024-10-15 (high) - Date found in URL path
  2. 2024-03-22 (high) - ArXiv ID parsed
  3. 2024-06-01 (medium) - Conference date inferred
  ...

[2/187] Dario Amodei (8 sources)
  1. 2024-10-11 (high) - Article metadata
  ...

=== ENRICHMENT SUMMARY ===
Total processed: 1,613
Successfully enriched: 1,421 (88.1%)
Failed to enrich: 192 (11.9%)

Confidence breakdown:
  High: 876
  Medium: 545
  Low: 192

Needs manual review: 192
Errors: 5
```

**Cost Estimate:**
- ~187 authors × $0.05 per API call (Gemini Pro) = **$9.35**
- Plus rate limiting delays = ~6-8 hours total runtime

**Acceptance Criteria:**
- [ ] Enrichment script processes all authors
- [ ] Results exported with confidence scores
- [ ] SQL update script generated
- [ ] Manual review list created for low-confidence dates

---

### Step 3: Manual Review (Day 4)

**Objective:** Human verification for high-priority authors and low-confidence dates.

**Process:**
1. Extract top 30 authors by importance (tier 1 + most-cited)
2. Review their enriched dates manually
3. For low-confidence dates, do manual research
4. Update enrichment results JSON with corrections

**Tools:**
- `enrichment-results.json` (filtered by author)
- Google Scholar, ArXiv, conference sites
- Author personal websites

**Output: `manual-corrections.json`**
```json
[
  {
    "authorId": "xxx",
    "sourceTitle": "Article",
    "correctedDate": "2024-11-15",
    "confidence": "high",
    "verificationSource": "Author's blog post metadata"
  }
]
```

**Acceptance Criteria:**
- [ ] Top 30 authors reviewed
- [ ] All "needs review" sources for top authors resolved
- [ ] Corrections documented with sources

---

### Step 4: Database Update (Day 5)

**Objective:** Apply enriched dates to database.

**Challenges:**
1. **JSONB updates are complex** - need to find array index for each source
2. **Two locations** - need to update both `authors.sources` and `sources` table
3. **Rollback safety** - need transaction safety

**Recommended Approach: Migrate to `sources` table**

Instead of updating JSONB, migrate all `authors.sources` to the dedicated `sources` table:

**Script: `scripts/migrate-to-sources-table.ts`**
```typescript
import { supabase } from '@/lib/supabase'
import { readFile } from 'fs/promises'

async function migrateToSourcesTable() {
  // Load enrichment results
  const enriched = JSON.parse(await readFile('enrichment-results.json', 'utf-8'))
  const corrections = JSON.parse(await readFile('manual-corrections.json', 'utf-8'))

  // Create lookup map
  const dateMap = new Map<string, string>()

  for (const e of enriched) {
    const key = `${e.authorId}::${e.sourceTitle}`
    dateMap.set(key, e.enrichedDate)
  }

  // Apply manual corrections
  for (const c of corrections) {
    const key = `${c.authorId}::${c.sourceTitle}`
    dateMap.set(key, c.correctedDate)
  }

  // Fetch all authors with sources
  const { data: authors } = await supabase
    .from('authors')
    .select('id, name, sources')

  let migrated = 0
  let skipped = 0

  for (const author of authors || []) {
    if (!author.sources || !Array.isArray(author.sources)) continue

    for (const source of author.sources) {
      const key = `${author.id}::${source.title}`
      const enrichedDate = dateMap.get(key)

      // Determine final date to use
      let finalDate = source.published_date || source.date
      if (!finalDate && enrichedDate) {
        finalDate = enrichedDate
      }
      if (!finalDate && source.year) {
        finalDate = `${source.year}-01-01` // Fallback to year if enrichment failed
      }

      // Insert into sources table
      const { error } = await supabase.from('sources').insert({
        author_id: author.id,
        title: source.title,
        url: source.url,
        type: source.type || 'Other',
        summary: source.summary || null,
        published_date: finalDate,
        domain: source.domain || null
      })

      if (error) {
        console.error(`Error inserting source for ${author.name}: ${source.title}`)
        console.error(error)
        skipped++
      } else {
        migrated++
      }
    }
  }

  console.log(`\nMigration complete:`)
  console.log(`  Migrated: ${migrated}`)
  console.log(`  Skipped: ${skipped}`)
  console.log(`\nNext step: Remove sources from authors JSONB field`)
}

migrateToSourcesTable()
```

**After migration, clean up:**
```sql
-- Optional: Remove sources from authors JSONB field once migration is verified
UPDATE authors SET sources = NULL WHERE sources IS NOT NULL;
```

**Acceptance Criteria:**
- [ ] All sources migrated to `sources` table
- [ ] Enriched dates applied
- [ ] Manual corrections applied
- [ ] Verification query shows correct dates
- [ ] Backup taken before cleaning up JSONB field

---

## Part 5: Phase 2 - Enforce Accuracy

### Rule 1: Date Required at Addition

**Update all author addition scripts:**

**Before:**
```typescript
sources: [
  { url: 'https://...', type: 'News', year: '2025', title: 'Article' }
]
```

**After:**
```typescript
sources: [
  {
    url: 'https://...',
    type: 'News',
    published_date: '2025-04-07',  // ✅ Specific date required
    title: 'Article'
  }
]
```

**Enforcement:**
Create `lib/validation/source-validation.ts`:
```typescript
export interface SourceInput {
  title: string
  url: string
  type: string
  published_date?: string  // YYYY-MM-DD required
  year?: string           // Deprecated
  summary?: string
}

export function validateSource(source: SourceInput): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Required fields
  if (!source.title) errors.push('Title is required')
  if (!source.url) errors.push('URL is required')
  if (!source.type) errors.push('Type is required')

  // Date validation
  if (!source.published_date) {
    errors.push('published_date is required (YYYY-MM-DD format). Do not use "year" field.')
  } else {
    // Validate format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(source.published_date)) {
      errors.push(`published_date must be YYYY-MM-DD format, got: ${source.published_date}`)
    }

    // Validate date is reasonable
    const date = new Date(source.published_date)
    const now = new Date()
    const minDate = new Date('2000-01-01')

    if (date > now) {
      errors.push(`published_date cannot be in the future: ${source.published_date}`)
    }
    if (date < minDate) {
      errors.push(`published_date seems too old: ${source.published_date}. Please verify.`)
    }
  }

  // Warn about deprecated year field
  if (source.year) {
    errors.push('DEPRECATED: "year" field is no longer supported. Use "published_date" instead.')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
```

**Update scripts to use validation:**
```typescript
import { validateSource } from '@/lib/validation/source-validation'

// In author addition script:
for (const source of author.sources) {
  const validation = validateSource(source)
  if (!validation.valid) {
    console.error(`❌ Invalid source: ${source.title}`)
    validation.errors.forEach(e => console.error(`  - ${e}`))
    process.exit(1)  // Fail fast
  }
}
```

---

### Rule 2: Automated Enrichment

**For sources that genuinely don't have specific dates, enrich before adding:**

```typescript
import { enrichSourceDates } from '@/lib/curation/agents'

async function addAuthorWithEnrichment(author: AuthorInput) {
  // Step 1: Validate basic fields
  for (const source of author.sources) {
    const basicValidation = validateSourceBasics(source)
    if (!basicValidation.valid) {
      throw new Error(`Invalid source: ${basicValidation.errors.join(', ')}`)
    }
  }

  // Step 2: Check for missing dates
  const sourcesNeedingDates = author.sources.filter(s => !s.published_date)

  if (sourcesNeedingDates.length > 0) {
    console.log(`⚠️  ${sourcesNeedingDates.length} sources missing dates. Enriching...`)

    // Step 3: Enrich dates using agent
    const enriched = await enrichSourceDates(sourcesNeedingDates, author.name)

    // Step 4: Apply enriched dates
    for (let i = 0; i < enriched.length; i++) {
      const original = sourcesNeedingDates[i]
      const enrichedData = enriched[i]

      if (enrichedData.enrichedDate) {
        original.published_date = enrichedData.enrichedDate
        console.log(`  ✅ ${original.title}: ${enrichedData.enrichedDate} (${enrichedData.confidence})`)
      } else {
        console.error(`  ❌ Could not enrich date for: ${original.title}`)
        throw new Error('Date enrichment failed. Please provide published_date manually.')
      }
    }
  }

  // Step 5: Final validation
  for (const source of author.sources) {
    const validation = validateSource(source)
    if (!validation.valid) {
      throw new Error(`Source validation failed: ${validation.errors.join(', ')}`)
    }
  }

  // Step 6: Add to database
  await addAuthorToDatabase(author)
}
```

---

### Rule 3: Validation & Quality Checks

**Add database constraint:**
```sql
ALTER TABLE sources
ADD CONSTRAINT check_published_date_format
CHECK (published_date ~ '^\d{4}-\d{2}-\d{2}$');

ALTER TABLE sources
ADD CONSTRAINT check_published_date_reasonable
CHECK (published_date BETWEEN '2000-01-01' AND CURRENT_DATE + INTERVAL '1 year');
```

**Add API endpoint for validation:**
```typescript
// POST /api/admin/validate-source
export async function POST(req: Request) {
  const source = await req.json()
  const validation = validateSource(source)

  if (!validation.valid) {
    return NextResponse.json({
      valid: false,
      errors: validation.errors
    }, { status: 400 })
  }

  return NextResponse.json({ valid: true })
}
```

---

### Rule 4: Confidence Tracking

**Extend sources table:**
```sql
ALTER TABLE sources ADD COLUMN date_confidence TEXT
  CHECK (date_confidence IN ('high', 'medium', 'low'));

ALTER TABLE sources ADD COLUMN date_source TEXT;  -- Where date was found

COMMENT ON COLUMN sources.date_confidence IS
  'Confidence in published_date accuracy: high (from URL/metadata), medium (inferred from context), low (estimated)';

COMMENT ON COLUMN sources.date_source IS
  'Where the date came from: "URL path", "ArXiv ID", "Conference date", "Manual research", etc.';
```

**Update enrichment to store confidence:**
```typescript
const { error } = await supabase.from('sources').insert({
  author_id: author.id,
  title: source.title,
  url: source.url,
  published_date: enrichedData.enrichedDate,
  date_confidence: enrichedData.confidence,  // ✅ Store confidence
  date_source: enrichedData.source,          // ✅ Store source
  // ... other fields
})
```

**Display confidence to users:**
```tsx
{source.date_confidence === 'high' && (
  <span className="text-green-600">✓ Verified date</span>
)}
{source.date_confidence === 'medium' && (
  <span className="text-yellow-600">~ Estimated date</span>
)}
{source.date_confidence === 'low' && (
  <span className="text-gray-500">? Approximate date</span>
)}
```

---

## Part 6: Implementation Timeline

```
WEEK 1: Audit & Enrichment
├── Day 1: Run audit script, analyze results
├── Day 2-3: Run batch enrichment (1,613 sources)
├── Day 4: Manual review for top 30 authors
└── Day 5: Database migration & update

WEEK 2: Enforcement Setup
├── Day 1-2: Create validation library
├── Day 2-3: Update all author addition scripts
├── Day 4: Add database constraints
└── Day 5: Test end-to-end flow

WEEK 3: Validation & Documentation
├── Day 1-2: Test with new author additions
├── Day 3: Update documentation
├── Day 4: Create admin dashboard for date quality
└── Day 5: Final review & deployment
```

---

## Part 7: Success Metrics

### Phase 1 (Fix Existing)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Sources with specific dates | >85% | Count `published_date` not ending in `-01-01` |
| High-confidence enrichments | >60% | Count enrichments with `confidence: 'high'` |
| Top 30 authors coverage | 100% | Manual verification complete |
| Failed enrichments | <15% | Sources without dates after enrichment |

### Phase 2 (Enforce Accuracy)

| Metric | Target | Measurement |
|--------|--------|-------------|
| New sources with dates | 100% | Validation script blocks additions without dates |
| Enrichment success rate | >90% | Automated enrichment finds dates for 90%+ of sources |
| Date confidence tracking | 100% | All new sources have confidence score |
| Validation failures caught | 100% | Scripts fail fast on invalid sources |

---

## Part 8: Rollback Plan

**If enrichment produces bad results:**

1. **Keep original data:**
   ```bash
   # Before migration, export current state
   pg_dump $DATABASE_URL --table=sources > sources_backup.sql
   pg_dump $DATABASE_URL --table=authors > authors_backup.sql
   ```

2. **Test on subset first:**
   - Run enrichment on 10 authors
   - Manually verify all dates
   - Only proceed if accuracy >90%

3. **Rollback procedure:**
   ```sql
   BEGIN;
   DELETE FROM sources WHERE created_at > '2025-01-15';  -- Remove new migrated sources
   -- Restore from backup if needed
   ROLLBACK;  -- Or COMMIT if looks good
   ```

---

## Part 9: Future Enhancements

### Automated Staleness Detection
Once dates are accurate, build automated monitoring:

```typescript
// Cron job: daily check for stale sources
async function checkStaleness() {
  const { data: authors } = await supabase
    .from('authors')
    .select(`
      id,
      name,
      sources (published_date)
    `)

  for (const author of authors || []) {
    const mostRecent = max(author.sources.map(s => new Date(s.published_date)))
    const daysSince = (Date.now() - mostRecent.getTime()) / (1000 * 60 * 60 * 24)

    if (daysSince > 180) {
      // Add to curation queue
      await createCurationTask({
        author_id: author.id,
        type: 'source_staleness',
        priority: daysSince > 365 ? 'high' : 'medium'
      })
    }
  }
}
```

### Continuous Enrichment
Run enrichment as part of curation workflow:

```typescript
// When curation agent discovers new sources
async function addDiscoveredSource(source: DiscoveredSource) {
  // Try to enrich date before adding
  const enriched = await enrichSourceDates([source], source.authorName)

  await supabase.from('sources').insert({
    ...source,
    published_date: enriched[0]?.enrichedDate || null,
    date_confidence: enriched[0]?.confidence || 'low',
    date_source: enriched[0]?.source || 'discovery_agent'
  })
}
```

---

## Part 10: Open Questions

1. **Should we show date confidence to end users?**
   - Option A: Yes, with icons (✓ ~ ?)
   - Option B: No, only show in admin
   - **Recommendation:** Option A for transparency

2. **What to do with sources that can't be enriched?**
   - Option A: Keep with year-only date + low confidence
   - Option B: Flag for manual research
   - Option C: Exclude from canon until dated
   - **Recommendation:** Option A + Option B (flag for review)

3. **Should we re-enrich periodically?**
   - Some sources may not have dates initially but get published later
   - **Recommendation:** Yes, quarterly re-run for low-confidence dates

4. **How to handle pre-prints and working papers?**
   - ArXiv papers often get published later with different dates
   - **Recommendation:** Track both "first available" and "published" dates

---

## Conclusion

Accurate source dates are CRITICAL for:
- Curation agent effectiveness
- User trust
- Staleness detection
- Future timeline features

**Recommended Next Steps:**
1. Run audit script to quantify the problem
2. Review enrichment approach with team
3. Get approval for ~$10-20 enrichment cost
4. Execute Phase 1 (fix existing) in Week 1
5. Execute Phase 2 (enforce accuracy) in Week 2-3

**Total Investment:**
- Engineering time: 2-3 weeks
- AI API costs: $10-20 (one-time)
- Manual review time: ~8 hours (one-time)

**ROI:**
- Curation agents work correctly
- User trust improves
- Foundation for memory/drift features
- Future-proof for timeline visualizations

---

*Document version: 1.0*
*Created: January 2025*
*Status: Ready for review & approval*
