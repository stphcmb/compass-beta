/**
 * Audit Script: Source Date Quality
 *
 * Analyzes all sources to determine date quality and identify
 * sources that need enrichment.
 *
 * Usage: npx tsx scripts/audit-source-dates.ts
 */

import 'dotenv/config'
import { supabase } from '@/lib/supabase'
import { writeFile } from 'fs/promises'

interface SourceAudit {
  location: 'authors.sources' | 'sources_table'
  authorId: string
  authorName: string
  sourceTitle: string
  currentDate: string | null
  dateQuality: 'specific' | 'year-only' | 'missing'
  url: string
  sourceData: any
}

async function auditSourceDates() {
  console.log('=== SOURCE DATE AUDIT ===\n')
  console.log('Analyzing source date quality across the canon...\n')

  if (!supabase) {
    console.error('❌ Supabase not configured')
    process.exit(1)
  }

  const audit: SourceAudit[] = []

  // ===== Audit authors.sources JSONB field =====
  console.log('📊 Checking authors.sources JSONB field...')
  const { data: authors, error: authorsError } = await supabase
    .from('authors')
    .select('id, name, sources')

  if (authorsError) {
    console.error('❌ Error fetching authors:', authorsError)
    process.exit(1)
  }

  let authorsWithSources = 0
  for (const author of authors || []) {
    if (!author.sources || !Array.isArray(author.sources) || author.sources.length === 0) continue

    authorsWithSources++

    for (const source of author.sources) {
      const hasSpecificDate = source.published_date || source.date
      const hasYearOnly = !hasSpecificDate && source.year
      const hasMissingDate = !hasSpecificDate && !source.year

      let dateQuality: 'specific' | 'year-only' | 'missing' = 'missing'
      if (hasSpecificDate) {
        dateQuality = 'specific'
      } else if (hasYearOnly) {
        dateQuality = 'year-only'
      }

      audit.push({
        location: 'authors.sources',
        authorId: author.id,
        authorName: author.name,
        sourceTitle: source.title || 'Untitled',
        currentDate: hasSpecificDate ? (source.published_date || source.date) : (source.year || null),
        dateQuality,
        url: source.url || '',
        sourceData: source
      })
    }
  }

  console.log(`  Found ${authorsWithSources} authors with sources in JSONB field`)

  // ===== Audit sources table =====
  console.log('\n📊 Checking sources table...')
  const { data: sources, error: sourcesError } = await supabase
    .from('sources')
    .select(`
      id,
      title,
      url,
      published_date,
      author_id,
      authors (name)
    `)

  if (sourcesError) {
    console.log('  ⚠️  Sources table query failed (table may not exist yet)')
  } else {
    console.log(`  Found ${sources?.length || 0} sources in table`)

    for (const source of sources || []) {
      const dateStr = source.published_date?.toString() || ''
      const isYearOnly = dateStr.endsWith('-01-01')

      let dateQuality: 'specific' | 'year-only' | 'missing' = 'missing'
      if (dateStr) {
        dateQuality = isYearOnly ? 'year-only' : 'specific'
      }

      audit.push({
        location: 'sources_table',
        authorId: source.author_id,
        authorName: (source.authors as any)?.name || 'Unknown',
        sourceTitle: source.title,
        currentDate: source.published_date,
        dateQuality,
        url: source.url,
        sourceData: source
      })
    }
  }

  // ===== Generate Summary =====
  console.log('\n=== SUMMARY ===\n')

  const summary = {
    total: audit.length,
    specific: audit.filter(s => s.dateQuality === 'specific').length,
    yearOnly: audit.filter(s => s.dateQuality === 'year-only').length,
    missing: audit.filter(s => s.dateQuality === 'missing').length,
  }

  const pct = (n: number, total: number) => ((n / total) * 100).toFixed(1)

  console.log(`Total sources: ${summary.total}`)
  console.log(`  ✅ Specific dates: ${summary.specific} (${pct(summary.specific, summary.total)}%)`)
  console.log(`  ⚠️  Year only: ${summary.yearOnly} (${pct(summary.yearOnly, summary.total)}%)`)
  console.log(`  ❌ Missing: ${summary.missing} (${pct(summary.missing, summary.total)}%)`)
  console.log(`\n🔧 NEEDS ENRICHMENT: ${summary.yearOnly + summary.missing}`)

  // ===== By Author Breakdown =====
  const byAuthor = new Map<string, SourceAudit[]>()
  audit.forEach(s => {
    const existing = byAuthor.get(s.authorName) || []
    existing.push(s)
    byAuthor.set(s.authorName, existing)
  })

  // Sort by number of sources needing enrichment
  const authorStats = Array.from(byAuthor.entries())
    .map(([name, sources]) => ({
      name,
      total: sources.length,
      needsEnrichment: sources.filter(s => s.dateQuality !== 'specific').length
    }))
    .filter(a => a.needsEnrichment > 0)
    .sort((a, b) => b.needsEnrichment - a.needsEnrichment)

  console.log(`\n📊 TOP AUTHORS NEEDING ENRICHMENT:\n`)
  authorStats.slice(0, 15).forEach((a, idx) => {
    console.log(`  ${idx + 1}. ${a.name}: ${a.needsEnrichment}/${a.total} sources`)
  })

  // ===== Export Full Audit =====
  const exportPath = 'source-date-audit.json'
  await writeFile(exportPath, JSON.stringify({
    summary,
    authorStats,
    allSources: audit
  }, null, 2))

  console.log(`\n✅ Full audit exported to: ${exportPath}`)

  // ===== Recommendation =====
  console.log(`\n💡 NEXT STEPS:`)
  if (summary.yearOnly + summary.missing > 100) {
    console.log(`  1. Run pilot enrichment: npx tsx scripts/pilot-enrich-dates.ts`)
    console.log(`  2. Review results in pilot-enrichment-results.json`)
    console.log(`  3. If >90% accurate, proceed with full batch enrichment`)
  } else {
    console.log(`  Small number of sources need enrichment - consider manual review`)
  }

  console.log('')
}

// Run audit
auditSourceDates().catch(error => {
  console.error('❌ Audit failed:', error)
  process.exit(1)
})
