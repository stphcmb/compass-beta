/**
 * Fix Quote-Source Mismatches (PARALLEL VERSION)
 * 
 * Processes multiple authors concurrently for faster execution
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

Return ONLY valid JSON in this exact format:
{
  "title": "Exact title of the content",
  "type": "Video|Article|Podcast|Paper|Book|Interview|Other",
  "published_date": "YYYY-MM-DD or null",
  "summary": "Brief description of what this content covers",
  "confidence": "high|medium|low",
  "reasoning": "Explanation of how you determined these values"
}`

  try {
    const response = await callGemini(prompt, 'pro')
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found in response')
    
    const enriched = JSON.parse(jsonMatch[0])
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

async function processAuthor(mismatch: QuoteMismatch, index: number, total: number) {
  console.log(`[${index + 1}/${total}] ${mismatch.authorName}`)
  
  try {
    // Enrich the quote source
    const enrichedSource = await enrichQuoteSource(
      mismatch.quoteSourceUrl,
      mismatch.authorName
    )

    console.log(`  ✅ ${enrichedSource.title} (${enrichedSource.confidence})`)

    // Fetch current author data
    const { data: author, error: fetchError } = await supabase
      .from('authors')
      .select('id, sources')
      .eq('name', mismatch.authorName)
      .single()

    if (fetchError) throw new Error(`Failed to fetch author: ${fetchError.message}`)

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

    if (updateError) throw new Error(`Failed to update author: ${updateError.message}`)

    return {
      authorName: mismatch.authorName,
      quoteSourceUrl: mismatch.quoteSourceUrl,
      enrichedSource,
      status: 'success' as const
    }
  } catch (error) {
    console.error(`  ❌ Error: ${error}`)
    return {
      authorName: mismatch.authorName,
      quoteSourceUrl: mismatch.quoteSourceUrl,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'failed' as const
    }
  }
}

async function processBatch(batch: QuoteMismatch[], startIndex: number, total: number) {
  return Promise.all(
    batch.map((mismatch, i) => 
      processAuthor(mismatch, startIndex + i, total)
    )
  )
}

async function fixQuoteSources() {
  console.log('=== FIX QUOTE-SOURCE MISMATCHES (PARALLEL) ===\n')

  const CONCURRENCY = 10 // Process 10 authors at a time
  const BATCH_DELAY = 2000 // Wait 2 seconds between batches

  // Load audit data
  let auditData
  try {
    const auditJson = await readFile('source-quality-audit.json', 'utf-8')
    auditData = JSON.parse(auditJson)
  } catch (error) {
    console.error('❌ Could not load source-quality-audit.json')
    process.exit(1)
  }

  const mismatches: QuoteMismatch[] = (auditData.quoteMismatches || []).map((m: any) => ({
    authorId: '',
    authorName: m.authorName,
    quoteSourceUrl: m.quoteSourceUrl,
    availableSources: (m.availableSources || []).map((url: string) => ({ title: '', url }))
  }))

  if (mismatches.length === 0) {
    console.log('✅ No quote-source mismatches found!')
    return
  }

  console.log(`📋 Found ${mismatches.length} mismatches`)
  console.log(`⚡ Processing ${CONCURRENCY} at a time...\n`)

  const results = []
  const errors = []

  // Process in batches
  for (let i = 0; i < mismatches.length; i += CONCURRENCY) {
    const batch = mismatches.slice(i, i + CONCURRENCY)
    const batchNum = Math.floor(i / CONCURRENCY) + 1
    const totalBatches = Math.ceil(mismatches.length / CONCURRENCY)
    
    console.log(`\n🔄 Batch ${batchNum}/${totalBatches} (${i + 1}-${Math.min(i + CONCURRENCY, mismatches.length)})`)
    
    const batchResults = await processBatch(batch, i, mismatches.length)
    
    for (const result of batchResults) {
      if (result.status === 'success') {
        results.push(result)
      } else {
        errors.push(result)
      }
    }

    // Wait between batches (except for last batch)
    if (i + CONCURRENCY < mismatches.length) {
      console.log(`⏱️  Waiting ${BATCH_DELAY/1000}s before next batch...`)
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY))
    }
  }

  // Generate summary
  console.log('\n=== SUMMARY ===\n')
  
  const summary = {
    processed: results.length + errors.length,
    successful: results.length,
    failed: errors.length,
    highConfidence: results.filter(r => r.enrichedSource?.confidence === 'high').length,
    mediumConfidence: results.filter(r => r.enrichedSource?.confidence === 'medium').length,
    lowConfidence: results.filter(r => r.enrichedSource?.confidence === 'low').length
  }

  console.log(`Processed: ${summary.processed} mismatches`)
  console.log(`  ✅ Successful: ${summary.successful}`)
  console.log(`  ❌ Failed: ${summary.failed}`)
  console.log(`\nConfidence Distribution:`)
  console.log(`  🟢 High: ${summary.highConfidence}`)
  console.log(`  🟡 Medium: ${summary.mediumConfidence}`)
  console.log(`  🔴 Low: ${summary.lowConfidence}`)

  // Export results
  await writeFile('quote-fix-results.json', JSON.stringify({
    summary,
    results,
    errors
  }, null, 2))

  console.log(`\n✅ Results exported to: quote-fix-results.json`)
}

fixQuoteSources().catch(error => {
  console.error('❌ Quote source fixing failed:', error)
  process.exit(1)
})
