/**
 * Parallel Date Enrichment
 * Processes multiple authors concurrently for fast date enrichment
 */

import 'dotenv/config'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'
import { readFile, writeFile } from 'fs/promises'
import { enrichSourceDates } from '@/lib/curation/agents'

interface AuthorSource {
  authorId: string
  authorName: string
  sources: Array<{
    title: string
    url?: string
    year?: string
    date?: string
  }>
}

async function processAuthor(author: AuthorSource, index: number, total: number) {
  console.log(`[${index + 1}/${total}] ${author.authorName} (${author.sources.length} sources)`)

  try {
    const enrichedDates = await enrichSourceDates(author.sources, author.authorName)

    if (!enrichedDates || enrichedDates.length === 0) {
      console.log(`  ⚠️  No dates enriched`)
      return { authorName: author.authorName, enriched: 0, failed: author.sources.length, status: 'no_results' }
    }

    let successCount = 0
    let failCount = 0

    for (const enriched of enrichedDates) {
      if (enriched.enrichedDate) {
        successCount++
        console.log(`  ✅ ${enriched.enrichedDate} (${enriched.confidence})`)
      } else {
        failCount++
      }
    }

    return {
      authorId: author.authorId,
      authorName: author.authorName,
      enriched: successCount,
      failed: failCount,
      results: enrichedDates,
      status: 'success'
    }
  } catch (error) {
    console.error(`  ❌ Error: ${error}`)
    return {
      authorName: author.authorName,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'failed'
    }
  }
}

async function processBatch(batch: AuthorSource[], startIndex: number, total: number) {
  return Promise.all(
    batch.map((author, i) => processAuthor(author, startIndex + i, total))
  )
}

async function main() {
  console.log('=== PARALLEL DATE ENRICHMENT ===\n')

  const CONCURRENCY = 20 // Process 20 authors at a time
  const BATCH_DELAY = 1000 // 1 second between batches

  // Load audit data
  const auditData = JSON.parse(await readFile('source-date-audit.json', 'utf-8'))
  const allSources: any[] = auditData.allSources || []

  // Group by author
  const authorMap = new Map<string, AuthorSource>()

  for (const source of allSources) {
    if (source.dateQuality === 'specific') continue // Skip already enriched

    if (!authorMap.has(source.authorName)) {
      authorMap.set(source.authorName, {
        authorId: source.authorId,
        authorName: source.authorName,
        sources: []
      })
    }

    const currentDate = String(source.currentDate || '')
    authorMap.get(source.authorName)!.sources.push({
      title: source.sourceTitle,
      url: source.url,
      year: currentDate.match(/^\d{4}$/) ? currentDate : undefined,
      date: currentDate.includes('-') ? currentDate : undefined
    })
  }

  const authors = Array.from(authorMap.values())
  const totalSources = allSources.filter(s => s.dateQuality !== 'specific').length

  console.log(`📊 Stats:`)
  console.log(`  Authors: ${authors.length}`)
  console.log(`  Sources to enrich: ${totalSources}`)
  console.log(`  Concurrency: ${CONCURRENCY} authors at a time`)
  console.log(`  Estimated batches: ${Math.ceil(authors.length / CONCURRENCY)}`)
  console.log(`  Estimated time: ~${Math.ceil(authors.length / CONCURRENCY) * 1.5} minutes\n`)

  const results = []
  let totalEnriched = 0
  let totalFailed = 0

  // Process in batches
  for (let i = 0; i < authors.length; i += CONCURRENCY) {
    const batch = authors.slice(i, i + CONCURRENCY)
    const batchNum = Math.floor(i / CONCURRENCY) + 1
    const totalBatches = Math.ceil(authors.length / CONCURRENCY)

    console.log(`\n🔄 Batch ${batchNum}/${totalBatches} (authors ${i + 1}-${Math.min(i + CONCURRENCY, authors.length)})`)

    const batchResults = await processBatch(batch, i, authors.length)

    for (const result of batchResults) {
      results.push(result)
      if (result.status === 'success' && 'enriched' in result) {
        totalEnriched += result.enriched
        totalFailed += result.failed
      }
    }

    // Progress update
    const processed = i + batch.length
    const pct = ((processed / authors.length) * 100).toFixed(1)
    console.log(`Progress: ${processed}/${authors.length} authors (${pct}%) | Enriched: ${totalEnriched} | Failed: ${totalFailed}`)

    // Wait between batches (except for last batch)
    if (i + CONCURRENCY < authors.length) {
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY))
    }
  }

  // Summary
  console.log('\n=== SUMMARY ===\n')
  console.log(`Total authors processed: ${authors.length}`)
  console.log(`Total sources enriched: ${totalEnriched}/${totalSources} (${((totalEnriched/totalSources)*100).toFixed(1)}%)`)
  console.log(`Failed to enrich: ${totalFailed}`)

  const highConf = results.flatMap(r => (r.results || [])).filter(d => d.confidence === 'high').length
  const medConf = results.flatMap(r => (r.results || [])).filter(d => d.confidence === 'medium').length
  const lowConf = results.flatMap(r => (r.results || [])).filter(d => d.confidence === 'low').length

  console.log(`\nConfidence Distribution:`)
  console.log(`  🟢 High: ${highConf}`)
  console.log(`  🟡 Medium: ${medConf}`)
  console.log(`  🔴 Low: ${lowConf}`)

  // Export results
  await writeFile('date-enrichment-results.json', JSON.stringify({
    summary: {
      totalAuthors: authors.length,
      totalSources,
      enriched: totalEnriched,
      failed: totalFailed,
      highConfidence: highConf,
      mediumConfidence: medConf,
      lowConfidence: lowConf
    },
    results
  }, null, 2))

  console.log(`\n✅ Results exported to: date-enrichment-results.json`)
}

main().catch(error => {
  console.error('❌ Date enrichment failed:', error)
  process.exit(1)
})
