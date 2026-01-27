/**
 * Source Quality Audit Script
 *
 * Analyzes all sources to identify generic vs specific sources
 * that can't be properly cited.
 *
 * Usage: npx tsx scripts/audit-source-quality.ts
 */

import 'dotenv/config'
import { supabase } from '@/lib/supabase'
import { writeFile } from 'fs/promises'

type SourceQuality = 'specific' | 'generic' | 'ambiguous'

interface SourceAudit {
  authorId: string
  authorName: string
  sourceTitle: string
  url: string
  quality: SourceQuality
  reason: string
  hasQuote: boolean
  quoteSourceUrl: string | null
  quotesMatch: boolean
}

function classifySource(source: any): { quality: SourceQuality; reason: string } {
  const url = source.url || ''
  const title = (source.title || '').toLowerCase()

  // Generic indicators (BAD - can't be cited)
  if (url.includes('youtube.com/@') || url.includes('youtube.com/channel/')) {
    return { quality: 'generic', reason: 'YouTube channel (not specific video)' }
  }
  if (url.includes('youtube.com/user/')) {
    return { quality: 'generic', reason: 'YouTube user page (not specific video)' }
  }
  if (url.match(/^https?:\/\/[^\/]+\/?$/)) {
    return { quality: 'generic', reason: 'Homepage only (no specific content)' }
  }
  if (url.match(/^https?:\/\/[^\/]+\/about\/?$/)) {
    return { quality: 'generic', reason: 'About page (not content)' }
  }
  if (url.match(/^https?:\/\/[^\/]+\/blog\/?$/)) {
    return { quality: 'generic', reason: 'Blog homepage (not specific post)' }
  }
  if (url.match(/twitter\.com\/[^\/]+\/?$/) || url.match(/x\.com\/[^\/]+\/?$/)) {
    return { quality: 'generic', reason: 'Social profile (not specific post)' }
  }
  if (url.match(/linkedin\.com\/in\/[^\/]+\/?$/)) {
    return { quality: 'generic', reason: 'LinkedIn profile (not specific post)' }
  }

  // Generic title indicators
  if (title.includes('channel') && !title.includes('podcast')) {
    return { quality: 'generic', reason: 'Title indicates channel' }
  }
  if (title.includes('homepage')) {
    return { quality: 'generic', reason: 'Title indicates homepage' }
  }
  if (title.includes('website')) {
    return { quality: 'generic', reason: 'Title indicates website' }
  }
  if (title.includes('profile')) {
    return { quality: 'generic', reason: 'Title indicates profile' }
  }
  if (title.includes(' blog') && !title.includes('post')) {
    return { quality: 'generic', reason: 'Title indicates blog (not specific post)' }
  }

  // Specific indicators (GOOD - can be cited)
  if (url.includes('youtube.com/watch?v=')) {
    return { quality: 'specific', reason: 'Specific YouTube video' }
  }
  if (url.includes('youtu.be/')) {
    return { quality: 'specific', reason: 'Specific YouTube video (short URL)' }
  }
  if (url.includes('/articles/') || url.includes('/article/')) {
    return { quality: 'specific', reason: 'Specific article URL' }
  }
  if (url.includes('/episode') || url.includes('/episodes/')) {
    return { quality: 'specific', reason: 'Specific podcast episode' }
  }
  if (url.includes('arxiv.org/abs/')) {
    return { quality: 'specific', reason: 'Specific ArXiv paper' }
  }
  if (url.match(/\/\d{4}\/\d{2}\//)) {
    return { quality: 'specific', reason: 'Date in URL path (likely specific post)' }
  }
  if (url.includes('/posts/') || url.includes('/post/')) {
    return { quality: 'specific', reason: 'Specific blog post' }
  }
  if (url.includes('/papers/')) {
    return { quality: 'specific', reason: 'Specific paper URL' }
  }
  if (url.includes('doi.org/') || url.includes('/doi/')) {
    return { quality: 'specific', reason: 'DOI (specific publication)' }
  }

  // Title indicators of specific content
  if (title.match(/#\d+/) || title.includes('episode')) {
    return { quality: 'specific', reason: 'Title includes episode number' }
  }

  return { quality: 'ambiguous', reason: 'Cannot determine - needs review' }
}

async function auditSourceQuality() {
  console.log('=== SOURCE QUALITY AUDIT ===\n')
  console.log('Analyzing source specificity across the canon...\n')

  if (!supabase) {
    console.error('❌ Supabase not configured')
    process.exit(1)
  }

  const audit: SourceAudit[] = []

  // Fetch all authors with sources and quotes
  const { data: authors, error } = await supabase
    .from('authors')
    .select('id, name, sources, key_quote, quote_source_url')

  if (error) {
    console.error('❌ Error fetching authors:', error)
    process.exit(1)
  }

  console.log(`📊 Analyzing ${authors?.length || 0} authors...\n`)

  for (const author of authors || []) {
    if (!author.sources || !Array.isArray(author.sources) || author.sources.length === 0) {
      continue
    }

    const hasQuote = !!author.key_quote
    const quoteSourceUrl = author.quote_source_url

    for (const source of author.sources) {
      const { quality, reason } = classifySource(source)

      // Check if this source matches the quote source
      const quotesMatch = hasQuote && quoteSourceUrl && source.url === quoteSourceUrl

      audit.push({
        authorId: author.id,
        authorName: author.name,
        sourceTitle: source.title || 'Untitled',
        url: source.url || '',
        quality,
        reason,
        hasQuote,
        quoteSourceUrl,
        quotesMatch
      })
    }
  }

  // ===== Generate Summary =====
  console.log('=== SUMMARY ===\n')

  const summary = {
    total: audit.length,
    specific: audit.filter(s => s.quality === 'specific').length,
    generic: audit.filter(s => s.quality === 'generic').length,
    ambiguous: audit.filter(s => s.quality === 'ambiguous').length,
    withQuotes: audit.filter(s => s.hasQuote).length,
    quotesMatchSource: audit.filter(s => s.quotesMatch).length
  }

  const pct = (n: number, total: number) => ((n / total) * 100).toFixed(1)

  console.log(`Total sources: ${summary.total}`)
  console.log(`  ✅ Specific: ${summary.specific} (${pct(summary.specific, summary.total)}%)`)
  console.log(`  ❌ Generic: ${summary.generic} (${pct(summary.generic, summary.total)}%)`)
  console.log(`  ⚠️  Ambiguous: ${summary.ambiguous} (${pct(summary.ambiguous, summary.total)}%)`)
  console.log(`\n📝 Quote Analysis:`)
  console.log(`  Authors with quotes: ${summary.withQuotes}`)
  console.log(`  Quotes matching sources: ${summary.quotesMatchSource}`)

  // ===== Top Authors with Generic Sources =====
  const byAuthor = new Map<string, SourceAudit[]>()
  audit.forEach(s => {
    const existing = byAuthor.get(s.authorName) || []
    existing.push(s)
    byAuthor.set(s.authorName, existing)
  })

  const authorStats = Array.from(byAuthor.entries())
    .map(([name, sources]) => ({
      name,
      total: sources.length,
      generic: sources.filter(s => s.quality === 'generic').length,
      specific: sources.filter(s => s.quality === 'specific').length,
      ambiguous: sources.filter(s => s.quality === 'ambiguous').length,
      hasQuote: sources[0]?.hasQuote || false,
      quoteMatched: sources.some(s => s.quotesMatch)
    }))
    .filter(a => a.generic > 0)
    .sort((a, b) => b.generic - a.generic)

  console.log(`\n📊 TOP AUTHORS WITH GENERIC SOURCES:\n`)
  authorStats.slice(0, 20).forEach((a, idx) => {
    const quoteStatus = a.hasQuote
      ? a.quoteMatched ? '✅ quote matched' : '❌ quote NOT matched'
      : ''
    console.log(`  ${idx + 1}. ${a.name}: ${a.generic}/${a.total} generic ${quoteStatus}`)
  })

  // ===== Critical Issues: Quotes Without Matching Sources =====
  const quoteMismatches = audit.filter(s => s.hasQuote && s.quoteSourceUrl && !s.quotesMatch)
  const uniqueMismatches = new Map<string, SourceAudit[]>()
  quoteMismatches.forEach(s => {
    const existing = uniqueMismatches.get(s.authorName) || []
    existing.push(s)
    uniqueMismatches.set(s.authorName, existing)
  })

  if (uniqueMismatches.size > 0) {
    console.log(`\n❌ CRITICAL: AUTHORS WITH QUOTE-SOURCE MISMATCHES:\n`)
    Array.from(uniqueMismatches.entries()).slice(0, 15).forEach(([name, sources]) => {
      console.log(`  - ${name}: quote_source_url doesn't match any source`)
      console.log(`    Quote URL: ${sources[0].quoteSourceUrl}`)
    })
  }

  // ===== Generic Source Examples =====
  const genericExamples = audit.filter(s => s.quality === 'generic').slice(0, 10)
  if (genericExamples.length > 0) {
    console.log(`\n📋 GENERIC SOURCE EXAMPLES:\n`)
    genericExamples.forEach((s, idx) => {
      console.log(`  ${idx + 1}. ${s.authorName} - "${s.sourceTitle}"`)
      console.log(`     URL: ${s.url}`)
      console.log(`     Issue: ${s.reason}\n`)
    })
  }

  // ===== Export Results =====
  const exportPath = 'source-quality-audit.json'
  await writeFile(exportPath, JSON.stringify({
    summary,
    authorStats,
    allSources: audit,
    quoteMismatches: Array.from(uniqueMismatches.entries()).map(([name, sources]) => ({
      authorName: name,
      quoteSourceUrl: sources[0].quoteSourceUrl,
      availableSources: sources.map(s => s.url)
    }))
  }, null, 2))

  console.log(`✅ Full audit exported to: ${exportPath}`)

  // ===== Recommendations =====
  console.log(`\n💡 RECOMMENDATIONS:\n`)

  if (summary.generic > summary.total * 0.3) {
    console.log(`  🚨 HIGH PRIORITY: ${summary.generic} generic sources need fixing`)
    console.log(`     These cannot be properly cited or dated`)
    console.log(`     Action: Run npx tsx scripts/find-specific-content.ts`)
  }

  if (uniqueMismatches.size > 0) {
    console.log(`  ❌ CRITICAL: ${uniqueMismatches.size} authors have quote-source mismatches`)
    console.log(`     Quotes can't be verified without matching sources`)
    console.log(`     Action: Manual review required`)
  }

  if (summary.ambiguous > 0) {
    console.log(`  ⚠️  ${summary.ambiguous} ambiguous sources need human review`)
    console.log(`     Check source-quality-audit.json for details`)
  }

  console.log(`\n📋 NEXT STEPS:`)
  console.log(`  1. Review source-quality-audit.json`)
  console.log(`  2. Fix critical quote-source mismatches first`)
  console.log(`  3. Create find-specific-content.ts agent to fix generic sources`)
  console.log(`  4. Then run date enrichment on validated sources`)
  console.log('')
}

// Run audit
auditSourceQuality().catch(error => {
  console.error('❌ Audit failed:', error)
  process.exit(1)
})
