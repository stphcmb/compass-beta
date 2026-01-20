/**
 * Fix Quote-Source Mismatches
 *
 * Adds missing quote sources to authors' sources lists by enriching
 * the quote_source_url with proper metadata (title, type, date, summary).
 *
 * Prerequisites: Run match-quotes-to-sources.ts first
 *
 * Usage: npx tsx scripts/fix-quote-sources.ts [--dry-run] [--limit N]
 */

import 'dotenv/config'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'
import { readFile, writeFile } from 'fs/promises'
import { callGemini } from '@/lib/ai-editor/gemini'

interface QuoteMismatch {
  authorId: string
  authorName: string
  quoteSourceUrl: string
  availableSources: Array<{ title: string; url: string }>
}

interface EnrichedSource {
  title: string
  url: string
  type: string
  published_date: string | null
  summary: string
  confidence: 'high' | 'medium' | 'low'
  reasoning: string
}

async function enrichQuoteSource(
  url: string,
  authorName: string
): Promise<EnrichedSource> {
  const prompt = `You are a research assistant enriching source metadata.

AUTHOR: ${authorName}
SOURCE URL: ${url}

TASK: Extract detailed metadata about this source by analyzing the URL pattern and content.

Determine:
1. **Title**: The exact title of the content (article, video, podcast episode, etc.)
2. **Type**: Video | Article | Podcast | Paper | Book | Interview | Other
3. **Published Date**: YYYY-MM-DD format if determinable, otherwise null
4. **Summary**: Brief 1-2 sentence description of the content (20-100 words)
5. **Confidence**: How confident you are in the metadata accuracy

URL Analysis Guidelines:
- YouTube watch URLs: Extract video title, check for date in description area
- ArXiv URLs: Extract paper title from URL pattern (e.g., /abs/2301.12345)
- Blog posts: Look for date in URL path (e.g., /2023/05/21/title)
- News articles: Extract headline, look for publication date patterns
- Podcast URLs: Identify episode title and number if present
- Academic papers: Look for DOI, ArXiv ID, or conference proceedings

Return ONLY valid JSON in this exact format:
{
  "title": "Exact title of the content",
  "type": "Video|Article|Podcast|Paper|Book|Interview|Other",
  "published_date": "YYYY-MM-DD or null",
  "summary": "Brief description of what this content covers",
  "confidence": "high|medium|low",
  "reasoning": "Explanation of how you determined these values"
}

IMPORTANT:
- If you cannot determine a field with confidence, set it to a sensible default
- For dates: only include if you're confident, otherwise use null
- For titles: extract from URL if no other info available
- Be concise in summary (20-100 words)
- Confidence should reflect overall certainty of all fields`

  try {
    const response = await callGemini(prompt, 'pro')

    // Try to parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const enriched = JSON.parse(jsonMatch[0])

    // Validate required fields
    if (!enriched.title || !enriched.type) {
      throw new Error('Missing required fields: title or type')
    }

    return {
      title: enriched.title,
      url,
      type: enriched.type,
      published_date: enriched.published_date || null,
      summary: enriched.summary || '',
      confidence: enriched.confidence || 'low',
      reasoning: enriched.reasoning || 'AI-enriched from URL'
    }

  } catch (error) {
    console.error(`  ❌ Enrichment failed: ${error}`)

    // Fallback: create basic source from URL
    const urlObj = new URL(url)
    const domain = urlObj.hostname.replace('www.', '')

    return {
      title: `Source from ${domain}`,
      url,
      type: 'Other',
      published_date: null,
      summary: `Source related to ${authorName}'s key quote`,
      confidence: 'low',
      reasoning: 'Fallback metadata due to enrichment error'
    }
  }
}

async function fixQuoteSources() {
  console.log('=== FIX QUOTE-SOURCE MISMATCHES ===\n')

  // Parse command line args
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const limitIndex = args.indexOf('--limit')
  const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : undefined

  if (dryRun) {
    console.log('🔍 DRY RUN MODE: No database changes will be made\n')
  }

  if (limit) {
    console.log(`📊 Processing limit: ${limit} authors\n`)
  }

  // ===== Load Quote Matching Results =====
  let auditData
  try {
    const auditJson = await readFile('source-quality-audit.json', 'utf-8')
    auditData = JSON.parse(auditJson)
  } catch (error) {
    console.error('❌ Could not load source-quality-audit.json')
    console.error('   Please run: npx tsx scripts/audit-source-quality.ts first')
    process.exit(1)
  }

  // Convert audit format to expected format
  const mismatches: QuoteMismatch[] = (auditData.quoteMismatches || []).map((m: any) => ({
    authorId: '', // Will fetch from DB
    authorName: m.authorName,
    quoteSourceUrl: m.quoteSourceUrl,
    availableSources: (m.availableSources || []).map((url: string) => ({ title: '', url }))
  }))

  if (mismatches.length === 0) {
    console.log('✅ No quote-source mismatches found!')
    return
  }

  console.log(`📋 Found ${mismatches.length} critical mismatches`)
  const toProcess = limit ? mismatches.slice(0, limit) : mismatches
  console.log(`🔧 Processing ${toProcess.length} mismatches...\n`)

  // ===== Process Each Mismatch =====
  const results = []
  const errors = []

  for (let i = 0; i < toProcess.length; i++) {
    const mismatch = toProcess[i]
    console.log(`[${i + 1}/${toProcess.length}] ${mismatch.authorName}`)
    console.log(`  Quote URL: ${mismatch.quoteSourceUrl}`)

    try {
      // Enrich the quote source
      console.log(`  🔍 Enriching source metadata...`)
      const enrichedSource = await enrichQuoteSource(
        mismatch.quoteSourceUrl,
        mismatch.authorName
      )

      console.log(`  ✅ Enriched: "${enrichedSource.title}"`)
      console.log(`     Type: ${enrichedSource.type}`)
      console.log(`     Date: ${enrichedSource.published_date || 'N/A'}`)
      console.log(`     Confidence: ${enrichedSource.confidence}`)

      if (!dryRun) {
        // Fetch current author data by name
        const { data: author, error: fetchError } = await supabase
          .from('authors')
          .select('id, sources')
          .eq('name', mismatch.authorName)
          .single()

        if (fetchError) {
          throw new Error(`Failed to fetch author: ${fetchError.message}`)
        }

        // Add enriched source to sources list
        const currentSources = author.sources || []
        const updatedSources = [
          ...currentSources,
          {
            title: enrichedSource.title,
            url: enrichedSource.url,
            type: enrichedSource.type,
            published_date: enrichedSource.published_date,
            summary: enrichedSource.summary
          }
        ]

        // Update database
        const { error: updateError } = await supabase
          .from('authors')
          .update({ sources: updatedSources })
          .eq('id', author.id)

        if (updateError) {
          throw new Error(`Failed to update author: ${updateError.message}`)
        }

        console.log(`  💾 Added to sources list`)
      } else {
        console.log(`  💾 Would add to sources list (dry run)`)
      }

      results.push({
        authorName: mismatch.authorName,
        quoteSourceUrl: mismatch.quoteSourceUrl,
        enrichedSource,
        status: 'success'
      })

      // Rate limiting: wait 2 seconds between API calls
      if (i < toProcess.length - 1) {
        console.log(`  ⏱️  Waiting 2 seconds...\n`)
        await new Promise(resolve => setTimeout(resolve, 2000))
      } else {
        console.log('')
      }

    } catch (error) {
      console.error(`  ❌ Error: ${error}`)
      errors.push({
        authorName: mismatch.authorName,
        quoteSourceUrl: mismatch.quoteSourceUrl,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      console.log('')
    }
  }

  // ===== Generate Summary =====
  console.log('=== SUMMARY ===\n')

  const summary = {
    processed: results.length + errors.length,
    successful: results.length,
    failed: errors.length,
    dryRun,
    highConfidence: results.filter(r => r.enrichedSource.confidence === 'high').length,
    mediumConfidence: results.filter(r => r.enrichedSource.confidence === 'medium').length,
    lowConfidence: results.filter(r => r.enrichedSource.confidence === 'low').length
  }

  console.log(`Processed: ${summary.processed} mismatches`)
  console.log(`  ✅ Successful: ${summary.successful}`)
  console.log(`  ❌ Failed: ${summary.failed}`)
  console.log(`\nConfidence Distribution:`)
  console.log(`  🟢 High: ${summary.highConfidence}`)
  console.log(`  🟡 Medium: ${summary.mediumConfidence}`)
  console.log(`  🔴 Low: ${summary.lowConfidence}`)

  // ===== Export Results =====
  const exportPath = dryRun ? 'quote-fix-preview.json' : 'quote-fix-results.json'
  await writeFile(exportPath, JSON.stringify({
    summary,
    results,
    errors
  }, null, 2))

  console.log(`\n✅ Results exported to: ${exportPath}`)

  // ===== Recommendations =====
  console.log(`\n💡 NEXT STEPS:\n`)

  if (dryRun) {
    console.log(`  1. Review ${exportPath} to verify enriched sources`)
    console.log(`  2. If quality looks good, run without --dry-run:`)
    console.log(`     npx tsx scripts/fix-quote-sources.ts`)
  } else {
    console.log(`  1. Re-run quote matching to verify fixes:`)
    console.log(`     npx tsx scripts/match-quotes-to-sources.ts`)
    console.log(`  2. If matching rate >90%, proceed to source quality fixes`)
    console.log(`  3. Otherwise, manually fix remaining mismatches`)
  }

  if (summary.lowConfidence > summary.successful * 0.3) {
    console.log(`  ⚠️  ${summary.lowConfidence} sources have low confidence`)
    console.log(`     Consider manual review of these enrichments`)
  }

  if (errors.length > 0) {
    console.log(`  ❌ ${errors.length} errors occurred`)
    console.log(`     Review errors in ${exportPath}`)
  }

  console.log('')
}

// Run fixer
fixQuoteSources().catch(error => {
  console.error('❌ Quote source fixing failed:', error)
  if (error instanceof Error) {
    console.error('Stack trace:', error.stack)
  }
  process.exit(1)
})
