/**
 * Apply Source Replacements
 *
 * Replaces generic sources with specific content found by the
 * find-specific-content agent.
 *
 * Prerequisites: Run find-specific-content.ts first (without --dry-run)
 *
 * Usage: npx tsx scripts/apply-source-replacements.ts [--min-confidence high|medium] [--limit N]
 */

import 'dotenv/config'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'
import { readFile, writeFile } from 'fs/promises'

interface ReplacementResult {
  authorId: string
  authorName: string
  genericSource: {
    title: string
    url: string
    reason: string
  }
  specificContent: {
    found: boolean
    specificUrl?: string
    specificTitle?: string
    contentType?: string
    publishedDate?: string | null
    confidence: 'high' | 'medium' | 'low'
    reasoning: string
  }
  willReplace: boolean
  status: string
}

async function applyReplacements() {
  console.log('=== APPLY SOURCE REPLACEMENTS ===\n')

  // Parse command line args
  const args = process.argv.slice(2)
  const minConfidenceArg = args.find(a => a.startsWith('--min-confidence='))
  const minConfidence = minConfidenceArg ? minConfidenceArg.split('=')[1] as 'high' | 'medium' | 'low' : 'high'
  const limitIndex = args.indexOf('--limit')
  const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : undefined

  console.log(`🎯 Minimum confidence level: ${minConfidence}`)
  if (limit) {
    console.log(`📊 Processing limit: ${limit} replacements\n`)
  }

  // ===== Load Find-Specific Results =====
  let resultsData
  try {
    const resultsJson = await readFile('find-specific-results.json', 'utf-8')
    resultsData = JSON.parse(resultsJson)
  } catch (error) {
    console.error('❌ Could not load find-specific-results.json')
    console.error('   Please run: npx tsx scripts/find-specific-content.ts first (without --dry-run)')
    process.exit(1)
  }

  const allResults: ReplacementResult[] = resultsData.results

  // Filter by confidence level
  const confidenceLevels = { high: 3, medium: 2, low: 1 }
  const minLevel = confidenceLevels[minConfidence]

  const eligibleReplacements = allResults.filter(r =>
    r.specificContent.found &&
    confidenceLevels[r.specificContent.confidence] >= minLevel
  )

  console.log(`📋 Found ${eligibleReplacements.length} eligible replacements (${minConfidence}+ confidence)`)

  const toProcess = limit ? eligibleReplacements.slice(0, limit) : eligibleReplacements
  console.log(`🔧 Processing ${toProcess.length} replacements...\n`)

  if (!supabase) {
    console.error('❌ Supabase not configured')
    process.exit(1)
  }

  // ===== Apply Each Replacement =====
  const applied = []
  const errors = []

  for (let i = 0; i < toProcess.length; i++) {
    const replacement = toProcess[i]
    console.log(`[${i + 1}/${toProcess.length}] ${replacement.authorName}`)
    console.log(`  Replacing: "${replacement.genericSource.title}"`)
    console.log(`  With: "${replacement.specificContent.specificTitle}"`)

    try {
      // Fetch current author sources
      const { data: author, error: fetchError } = await supabase
        .from('authors')
        .select('sources')
        .eq('id', replacement.authorId)
        .single()

      if (fetchError) {
        throw new Error(`Failed to fetch author: ${fetchError.message}`)
      }

      const currentSources = author.sources || []

      // Find and replace the generic source
      const updatedSources = currentSources.map((source: any) => {
        // Match by URL
        if (source.url === replacement.genericSource.url) {
          // Replace with specific content
          return {
            title: replacement.specificContent.specificTitle,
            url: replacement.specificContent.specificUrl,
            type: replacement.specificContent.contentType || source.type,
            published_date: replacement.specificContent.publishedDate || source.published_date || source.year,
            summary: source.summary || `Specific content for ${replacement.authorName}'s work`,
            // Preserve any existing fields
            ...source,
            // Override with specific content
            title: replacement.specificContent.specificTitle,
            url: replacement.specificContent.specificUrl,
            type: replacement.specificContent.contentType || source.type,
            published_date: replacement.specificContent.publishedDate || source.published_date || source.year
          }
        }
        return source
      })

      // Update database
      const { error: updateError } = await supabase
        .from('authors')
        .update({ sources: updatedSources })
        .eq('id', replacement.authorId)

      if (updateError) {
        throw new Error(`Failed to update author: ${updateError.message}`)
      }

      console.log(`  ✅ Replaced (${replacement.specificContent.confidence} confidence)`)
      console.log(`     URL: ${replacement.specificContent.specificUrl}`)

      applied.push({
        authorId: replacement.authorId,
        authorName: replacement.authorName,
        from: replacement.genericSource,
        to: replacement.specificContent,
        status: 'success'
      })

      console.log('')

    } catch (error) {
      console.error(`  ❌ Error: ${error}`)
      errors.push({
        authorId: replacement.authorId,
        authorName: replacement.authorName,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      console.log('')
    }
  }

  // ===== Generate Summary =====
  console.log('=== SUMMARY ===\n')

  const summary = {
    eligible: eligibleReplacements.length,
    processed: toProcess.length,
    successful: applied.length,
    failed: errors.length,
    minConfidence,
    byConfidence: {
      high: applied.filter(a => a.to.confidence === 'high').length,
      medium: applied.filter(a => a.to.confidence === 'medium').length,
      low: applied.filter(a => a.to.confidence === 'low').length
    }
  }

  const pct = (n: number, total: number) => total > 0 ? ((n / total) * 100).toFixed(1) : '0.0'

  console.log(`Eligible replacements: ${summary.eligible}`)
  console.log(`Processed: ${summary.processed}`)
  console.log(`  ✅ Successful: ${summary.successful} (${pct(summary.successful, summary.processed)}%)`)
  console.log(`  ❌ Failed: ${summary.failed} (${pct(summary.failed, summary.processed)}%)`)
  console.log(`\nBy confidence:`)
  console.log(`  🟢 High: ${summary.byConfidence.high}`)
  console.log(`  🟡 Medium: ${summary.byConfidence.medium}`)
  console.log(`  🔴 Low: ${summary.byConfidence.low}`)

  // ===== Export Results =====
  const exportPath = 'source-replacements-applied.json'
  await writeFile(exportPath, JSON.stringify({
    summary,
    applied,
    errors
  }, null, 2))

  console.log(`\n✅ Results exported to: ${exportPath}`)

  // ===== Next Steps =====
  console.log(`\n💡 NEXT STEPS:\n`)

  if (summary.successful > 0) {
    console.log(`  ✅ Successfully replaced ${summary.successful} generic sources`)
    console.log(`  → Re-run source quality audit to verify improvements`)
    console.log(`  → Run: npx tsx scripts/audit-source-quality.ts`)
  }

  if (errors.length > 0) {
    console.log(`  ❌ ${errors.length} replacements failed`)
    console.log(`  → Review errors in ${exportPath}`)
  }

  const remainingGeneric = allResults.filter(r =>
    !r.specificContent.found ||
    confidenceLevels[r.specificContent.confidence] < minLevel
  ).length

  if (remainingGeneric > 0) {
    console.log(`  ⚠️  ${remainingGeneric} sources still generic (below ${minConfidence} confidence)`)
    console.log(`  → These need manual research`)
    console.log(`  → Review find-specific-results.json for details`)
  }

  console.log('')
}

// Run replacement
applyReplacements().catch(error => {
  console.error('❌ Replacement failed:', error)
  if (error instanceof Error) {
    console.error('Stack trace:', error.stack)
  }
  process.exit(1)
})
