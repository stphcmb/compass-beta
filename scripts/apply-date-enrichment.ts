/**
 * Apply Enriched Dates to Database
 * Updates sources with enriched publication dates
 */

import 'dotenv/config'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'
import { readFile, writeFile } from 'fs/promises'

interface EnrichmentResult {
  authorId: string
  authorName: string
  enriched: number
  failed: number
  results?: Array<{
    originalTitle: string
    originalDate: string | null
    enrichedDate: string | null
    confidence: 'high' | 'medium' | 'low'
    reasoning: string
    source: string
  }>
  status: string
}

async function updateAuthorSources(result: EnrichmentResult, minConfidence: 'high' | 'medium' | 'low') {
  if (!result.results || result.results.length === 0) return { updated: 0, skipped: 0 }

  try {
    // Fetch current author data
    const { data: author, error: fetchError } = await supabase
      .from('authors')
      .select('id, name, sources')
      .eq('name', result.authorName)
      .single()

    if (fetchError || !author) {
      console.error(`  ❌ Could not fetch author: ${result.authorName}`)
      return { updated: 0, skipped: result.results.length }
    }

    const currentSources = author.sources || []
    let updated = 0
    let skipped = 0

    // Update each source with enriched date
    for (const enriched of result.results) {
      if (!enriched.enrichedDate) {
        skipped++
        continue
      }

      // Skip low confidence if minConfidence is higher
      if (minConfidence === 'high' && enriched.confidence !== 'high') {
        skipped++
        continue
      }
      if (minConfidence === 'medium' && enriched.confidence === 'low') {
        skipped++
        continue
      }

      // Find matching source by title
      const sourceIndex = currentSources.findIndex((s: any) => s.title === enriched.originalTitle)

      if (sourceIndex === -1) {
        console.log(`  ⚠️  Source not found: "${enriched.originalTitle}"`)
        skipped++
        continue
      }

      // Update the published_date
      currentSources[sourceIndex].published_date = enriched.enrichedDate
      updated++
    }

    if (updated > 0) {
      // Save updated sources back to database
      const { error: updateError } = await supabase
        .from('authors')
        .update({ sources: currentSources })
        .eq('id', author.id)

      if (updateError) {
        console.error(`  ❌ Failed to update: ${updateError.message}`)
        return { updated: 0, skipped: updated + skipped }
      }
    }

    return { updated, skipped }
  } catch (error) {
    console.error(`  ❌ Error: ${error}`)
    return { updated: 0, skipped: result.results.length }
  }
}

async function main() {
  console.log('=== APPLY DATE ENRICHMENT TO DATABASE ===\n')

  const MIN_CONFIDENCE: 'high' | 'medium' | 'low' = 'medium' // Apply high + medium confidence dates

  // Load enrichment results
  const enrichmentData = JSON.parse(await readFile('date-enrichment-results.json', 'utf-8'))
  const results: EnrichmentResult[] = enrichmentData.results || []

  console.log(`📊 Enrichment Summary:`)
  console.log(`  Total authors: ${enrichmentData.summary.totalAuthors}`)
  console.log(`  Total enriched: ${enrichmentData.summary.enriched}`)
  console.log(`  High confidence: ${enrichmentData.summary.highConfidence}`)
  console.log(`  Medium confidence: ${enrichmentData.summary.mediumConfidence}`)
  console.log(`  Low confidence: ${enrichmentData.summary.lowConfidence}`)
  console.log(`\n📝 Applying dates with confidence >= ${MIN_CONFIDENCE}\n`)

  let totalUpdated = 0
  let totalSkipped = 0
  let authorsUpdated = 0

  // Process each author
  for (let i = 0; i < results.length; i++) {
    const result = results[i]

    if (result.status !== 'success' || !result.results) {
      continue
    }

    console.log(`[${i + 1}/${results.length}] ${result.authorName}`)

    const { updated, skipped } = await updateAuthorSources(result, MIN_CONFIDENCE)

    if (updated > 0) {
      console.log(`  ✅ Updated ${updated} sources, skipped ${skipped}`)
      totalUpdated += updated
      authorsUpdated++
    } else if (skipped > 0) {
      console.log(`  ⏭️  Skipped ${skipped} sources (low confidence or no date)`)
    }
    totalSkipped += skipped

    // Rate limiting - don't hammer the database
    if (i % 20 === 0 && i > 0) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  // Summary
  console.log('\n=== SUMMARY ===\n')
  console.log(`Authors updated: ${authorsUpdated}/${results.length}`)
  console.log(`Sources updated: ${totalUpdated}`)
  console.log(`Sources skipped: ${totalSkipped} (low confidence or no date)`)
  console.log(`\n✅ Database update complete!`)

  // Export update log
  await writeFile('date-enrichment-applied.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    minConfidence: MIN_CONFIDENCE,
    authorsUpdated,
    sourcesUpdated: totalUpdated,
    sourcesSkipped: totalSkipped
  }, null, 2))

  console.log(`📄 Update log saved to: date-enrichment-applied.json`)
}

main().catch(error => {
  console.error('❌ Failed to apply enrichment:', error)
  process.exit(1)
})
