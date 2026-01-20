/**
 * Fix Quote Source URLs After Replacements
 *
 * Updates quote_source_url fields to match the new source URLs
 * after batch replacements changed the sources array.
 *
 * Usage: npx tsx --env-file=.env.local scripts/fix-quote-source-urls.ts
 */

import 'dotenv/config'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'
import { readFile } from 'fs/promises'

interface Author {
  id: string
  name: string
  quote_source_url: string | null
  sources: Array<{ url: string; title: string }>
}

function normalizeUrl(url: string): string {
  return url
    .toLowerCase()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/+$/, '')
}

function findBestMatchingSource(
  quoteUrl: string,
  sources: Array<{ url: string; title: string }>
): { url: string; title: string; reason: string } | null {
  if (!sources || sources.length === 0) return null

  const normalizedQuoteUrl = normalizeUrl(quoteUrl)

  // 1. Try exact match (after normalization)
  for (const source of sources) {
    if (normalizeUrl(source.url) === normalizedQuoteUrl) {
      return { ...source, reason: 'Exact match' }
    }
  }

  // 2. Try substring match (quote URL contains source URL or vice versa)
  for (const source of sources) {
    const normalizedSourceUrl = normalizeUrl(source.url)
    if (
      normalizedQuoteUrl.includes(normalizedSourceUrl) ||
      normalizedSourceUrl.includes(normalizedQuoteUrl)
    ) {
      return { ...source, reason: 'URL substring match' }
    }
  }

  // 3. Try same domain
  const quoteDomain = normalizedQuoteUrl.split('/')[0]
  for (const source of sources) {
    const sourceDomain = normalizeUrl(source.url).split('/')[0]
    if (quoteDomain === sourceDomain) {
      return { ...source, reason: 'Same domain - first match' }
    }
  }

  // 4. Fall back to first source
  return { ...sources[0], reason: 'First source (no better match)' }
}

async function fixQuoteSourceUrls() {
  console.log('=== FIX QUOTE SOURCE URLS ===\n')

  if (!supabase) {
    console.error('❌ Supabase not configured')
    process.exit(1)
  }

  // Load audit results to get mismatched authors
  let auditData
  try {
    const auditJson = await readFile('source-quality-audit.json', 'utf-8')
    auditData = JSON.parse(auditJson)
  } catch (error) {
    console.error('❌ Could not load source-quality-audit.json')
    console.error('   Please run: npx tsx scripts/audit-source-quality.ts first')
    process.exit(1)
  }

  const mismatchedAuthors: Array<{ authorName: string; quoteSourceUrl: string }> =
    auditData.quoteMismatches || []

  console.log(`📋 Found ${mismatchedAuthors.length} authors with quote-source mismatches\n`)

  if (mismatchedAuthors.length === 0) {
    console.log('✅ No mismatches to fix!')
    return
  }

  const updates = []
  const errors = []

  // Process each mismatched author
  for (let i = 0; i < mismatchedAuthors.length; i++) {
    const { authorName, quoteSourceUrl } = mismatchedAuthors[i]

    console.log(`[${i + 1}/${mismatchedAuthors.length}] ${authorName}`)
    console.log(`  Current quote URL: ${quoteSourceUrl}`)

    try {
      // Fetch author by name to get ID and sources
      const { data: author, error: fetchError } = await supabase
        .from('authors')
        .select('id, sources')
        .eq('name', authorName)
        .single()

      if (fetchError) {
        throw new Error(`Failed to fetch: ${fetchError.message}`)
      }

      const sources = author.sources || []

      // Find best matching source
      const bestMatch = findBestMatchingSource(quoteSourceUrl, sources)

      if (!bestMatch) {
        console.log(`  ⚠️  No sources available - skipping`)
        errors.push({ name: authorName, error: 'No sources available' })
        console.log('')
        continue
      }

      console.log(`  ✅ Best match: "${bestMatch.title}"`)
      console.log(`     URL: ${bestMatch.url}`)
      console.log(`     Reason: ${bestMatch.reason}`)

      // Update quote_source_url
      const { error: updateError } = await supabase
        .from('authors')
        .update({ quote_source_url: bestMatch.url })
        .eq('id', author.id)

      if (updateError) {
        throw new Error(`Failed to update: ${updateError.message}`)
      }

      updates.push({
        name: authorName,
        oldUrl: quoteSourceUrl,
        newUrl: bestMatch.url,
        reason: bestMatch.reason
      })

      console.log('')
    } catch (error) {
      console.error(`  ❌ Error: ${error}`)
      errors.push({
        name: authorName,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      console.log('')
    }
  }

  // Summary
  console.log('=== SUMMARY ===\n')
  console.log(`Total mismatches: ${mismatchedAuthors.length}`)
  console.log(`  ✅ Updated: ${updates.length}`)
  console.log(`  ❌ Errors: ${errors.length}`)

  if (updates.length > 0) {
    console.log('\nBy match type:')
    const byReason: Record<string, number> = {}
    updates.forEach(u => {
      byReason[u.reason] = (byReason[u.reason] || 0) + 1
    })
    Object.entries(byReason).forEach(([reason, count]) => {
      console.log(`  ${reason}: ${count}`)
    })
  }

  console.log('\n💡 NEXT STEPS:')
  console.log('  → Re-run source quality audit to verify all mismatches resolved')
  console.log('  → Run: npx tsx scripts/audit-source-quality.ts')
  console.log('')
}

fixQuoteSourceUrls().catch(error => {
  console.error('❌ Failed to fix quote URLs:', error)
  if (error instanceof Error) {
    console.error('Stack trace:', error.stack)
  }
  process.exit(1)
})
