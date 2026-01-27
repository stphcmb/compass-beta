/**
 * Pilot Enrichment Script: Test Date Enrichment on 10 Authors
 *
 * Tests the enrichSourceDates agent on a small sample to validate
 * accuracy before running full batch enrichment.
 *
 * Prerequisites: Run audit-source-dates.ts first
 *
 * Usage: npx tsx scripts/pilot-enrich-dates.ts
 */

import 'dotenv/config'
import { enrichSourceDates, EnrichedSourceDate } from '@/lib/curation/agents'
import { readFile, writeFile } from 'fs/promises'

interface EnrichmentResult {
  authorName: string
  sourceTitle: string
  originalDate: string | null
  enrichedDate: string | null
  confidence: 'high' | 'medium' | 'low'
  reasoning: string
  source: string
  url: string
  needsReview: boolean
}

async function pilotEnrich() {
  console.log('=== PILOT DATE ENRICHMENT ===\n')
  console.log('Testing enrichment on 10 authors...\n')

  // ===== Load Audit Results =====
  let auditData
  try {
    const auditJson = await readFile('source-date-audit.json', 'utf-8')
    auditData = JSON.parse(auditJson)
  } catch (error) {
    console.error('❌ Could not load source-date-audit.json')
    console.error('   Please run: npx tsx scripts/audit-source-dates.ts first')
    process.exit(1)
  }

  const allSources = auditData.allSources
  const needsEnrichment = allSources.filter((s: any) => s.dateQuality !== 'specific')

  console.log(`📊 Found ${needsEnrichment.length} sources needing enrichment`)

  // ===== Select 10 Authors for Pilot =====
  // Strategy: Mix of high-priority and random
  const byAuthor = new Map<string, any[]>()
  needsEnrichment.forEach((s: any) => {
    const existing = byAuthor.get(s.authorName) || []
    existing.push(s)
    byAuthor.set(s.authorName, existing)
  })

  // Get authors with most sources needing enrichment (likely tier 1)
  const authorsByNeed = Array.from(byAuthor.entries())
    .map(([name, sources]) => ({ name, sources, count: sources.length }))
    .sort((a, b) => b.count - a.count)

  // Select: top 5 by need + 5 random
  const topAuthors = authorsByNeed.slice(0, 5)
  const randomAuthors = authorsByNeed
    .slice(5)
    .sort(() => Math.random() - 0.5)
    .slice(0, 5)

  const pilotAuthors = [...topAuthors, ...randomAuthors]

  console.log('\n📋 PILOT AUTHORS:\n')
  pilotAuthors.forEach((a, idx) => {
    console.log(`  ${idx + 1}. ${a.name} (${a.count} sources)`)
  })

  // ===== Run Enrichment =====
  console.log('\n🔄 Starting enrichment...\n')

  const results: EnrichmentResult[] = []
  const errors: Array<{ authorName: string; error: string }> = []

  for (let i = 0; i < pilotAuthors.length; i++) {
    const author = pilotAuthors[i]
    console.log(`[${i + 1}/${pilotAuthors.length}] ${author.name}`)

    try {
      // Prepare sources for enrichment
      const sourcesToEnrich = author.sources.map((s: any) => ({
        title: s.sourceTitle,
        url: s.url,
        year: s.currentDate || undefined,
        date: s.currentDate?.includes('-') ? s.currentDate : undefined
      }))

      // Call enrichment agent
      const enriched = await enrichSourceDates(sourcesToEnrich, author.name)

      // Process results
      for (let j = 0; j < enriched.length; j++) {
        const e = enriched[j]
        const original = author.sources[j]

        results.push({
          authorName: author.name,
          sourceTitle: original.sourceTitle,
          originalDate: original.currentDate,
          enrichedDate: e.enrichedDate,
          confidence: e.confidence,
          reasoning: e.reasoning,
          source: e.source,
          url: original.url,
          needsReview: e.confidence === 'low' || !e.enrichedDate
        })

        const statusIcon = e.enrichedDate ? '✅' : '❌'
        const confidenceColor = e.confidence === 'high' ? '' : e.confidence === 'medium' ? '⚠️  ' : '⚠️  '
        console.log(`  ${j + 1}. ${statusIcon} ${e.enrichedDate || 'NO DATE'} (${confidenceColor}${e.confidence})`)
        console.log(`     ${e.reasoning}`)
      }

      // Rate limiting: wait 2 seconds between authors
      if (i < pilotAuthors.length - 1) {
        console.log('  ⏱️  Waiting 2 seconds...\n')
        await new Promise(resolve => setTimeout(resolve, 2000))
      }

    } catch (error) {
      console.error(`  ❌ Error: ${error}`)
      errors.push({
        authorName: author.name,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // ===== Generate Summary =====
  console.log('\n=== PILOT SUMMARY ===\n')

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

  const pct = (n: number, total: number) => ((n / total) * 100).toFixed(1)

  console.log(`Total processed: ${summary.total}`)
  console.log(`  ✅ Successfully enriched: ${summary.enriched} (${pct(summary.enriched, summary.total)}%)`)
  console.log(`  ❌ Failed to enrich: ${summary.failed} (${pct(summary.failed, summary.total)}%)`)
  console.log(`\nConfidence breakdown:`)
  console.log(`  🟢 High: ${summary.highConfidence} (${pct(summary.highConfidence, summary.total)}%)`)
  console.log(`  🟡 Medium: ${summary.mediumConfidence} (${pct(summary.mediumConfidence, summary.total)}%)`)
  console.log(`  🔴 Low: ${summary.lowConfidence} (${pct(summary.lowConfidence, summary.total)}%)`)
  console.log(`\n⚠️  Needs manual review: ${summary.needsReview}`)
  if (errors.length > 0) {
    console.log(`❌ Errors: ${summary.errors}`)
  }

  // ===== Calculate Success Rate =====
  const successRate = summary.highConfidence / summary.total
  const goodEnoughRate = (summary.highConfidence + summary.mediumConfidence) / summary.total

  console.log(`\n📊 QUALITY METRICS:`)
  console.log(`  High confidence rate: ${(successRate * 100).toFixed(1)}%`)
  console.log(`  Good enough rate (high + medium): ${(goodEnoughRate * 100).toFixed(1)}%`)

  // ===== Export Results =====
  const exportPath = 'pilot-enrichment-results.json'
  await writeFile(exportPath, JSON.stringify({
    summary,
    results,
    errors
  }, null, 2))

  console.log(`\n✅ Results exported to: ${exportPath}`)

  // ===== Recommendation =====
  console.log(`\n💡 NEXT STEPS:\n`)

  if (goodEnoughRate >= 0.9) {
    console.log(`  ✅ Success rate is excellent (${(goodEnoughRate * 100).toFixed(0)}%)`)
    console.log(`  → PROCEED with full batch enrichment`)
    console.log(`  → Run: npx tsx scripts/enrich-all-source-dates.ts`)
  } else if (goodEnoughRate >= 0.7) {
    console.log(`  ⚠️  Success rate is acceptable (${(goodEnoughRate * 100).toFixed(0)}%)`)
    console.log(`  → Consider MANUAL REVIEW of results first`)
    console.log(`  → Review: ${exportPath}`)
    console.log(`  → Then decide on full batch`)
  } else {
    console.log(`  ❌ Success rate is too low (${(goodEnoughRate * 100).toFixed(0)}%)`)
    console.log(`  → DO NOT proceed with full batch yet`)
    console.log(`  → Investigate failures and improve enrichment logic`)
  }

  // ===== Manual Review Instructions =====
  console.log(`\n📝 MANUAL REVIEW INSTRUCTIONS:\n`)
  console.log(`  1. Open ${exportPath}`)
  console.log(`  2. For each result, verify:`)
  console.log(`     - Does enrichedDate match the actual publication date?`)
  console.log(`     - Check the URL to confirm`)
  console.log(`     - Look up the source if needed (Google, ArXiv, etc.)`)
  console.log(`  3. Count accurate vs inaccurate enrichments`)
  console.log(`  4. If >90% accurate, proceed with full batch`)
  console.log(`  5. If <90% accurate, investigate common failure patterns`)
  console.log('')

  // ===== Show Sample Results for Quick Review =====
  console.log('📋 SAMPLE RESULTS FOR QUICK REVIEW:\n')
  const sampleSize = Math.min(10, results.length)
  const samples = results.slice(0, sampleSize)

  samples.forEach((r, idx) => {
    const status = r.enrichedDate ? '✅' : '❌'
    console.log(`${idx + 1}. ${status} ${r.authorName} - "${r.sourceTitle}"`)
    console.log(`   Original: ${r.originalDate || 'none'}`)
    console.log(`   Enriched: ${r.enrichedDate || 'FAILED'} (${r.confidence})`)
    console.log(`   Reasoning: ${r.reasoning}`)
    console.log(`   URL: ${r.url}`)
    console.log('')
  })

  console.log('(See full results in pilot-enrichment-results.json)\n')
}

// Run pilot
pilotEnrich().catch(error => {
  console.error('❌ Pilot enrichment failed:', error)
  if (error instanceof Error) {
    console.error('Stack trace:', error.stack)
  }
  process.exit(1)
})
