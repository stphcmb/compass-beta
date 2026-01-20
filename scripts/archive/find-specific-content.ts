/**
 * Find Specific Content from Generic Sources
 *
 * Converts generic sources (YouTube channels, blog homepages, profiles)
 * into specific, citable content (videos, articles, episodes) by using
 * AI to search for where quotes actually appear.
 *
 * Prerequisites: Run audit-source-quality.ts first
 *
 * Usage: npx tsx scripts/find-specific-content.ts [--dry-run] [--limit N]
 */

import 'dotenv/config'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'
import { readFile, writeFile } from 'fs/promises'
import { callGemini } from '@/lib/ai-editor/gemini'

interface GenericSource {
  authorId: string
  authorName: string
  sourceTitle: string
  url: string
  quality: string
  reason: string
  keyQuote: string | null
}

interface SpecificContentResult {
  found: boolean
  specificUrl?: string
  specificTitle?: string
  contentType?: 'video' | 'article' | 'podcast_episode' | 'paper' | 'book_chapter' | 'other'
  publishedDate?: string | null
  confidence: 'high' | 'medium' | 'low'
  reasoning: string
  quoteContext?: string
  searchQuery?: string
}

async function findSpecificContent(
  author: { name: string; quote: string | null },
  genericSource: { title: string; url: string },
): Promise<SpecificContentResult> {

  const prompt = `You are a research assistant finding specific citable content.

AUTHOR: ${author.name}
GENERIC SOURCE: ${genericSource.title}
SOURCE URL: ${genericSource.url}
KEY QUOTE: ${author.quote || 'No specific quote provided'}

TASK: Find the SPECIFIC article, video, podcast episode, or paper where this author's quote or key ideas appear.

ANALYSIS STEPS:
1. **Identify source type** from URL:
   - youtube.com/@... or youtube.com/channel/... → YouTube channel (find specific video)
   - Blog homepage → Find specific blog post
   - Podcast homepage → Find specific episode
   - Social profile → Find specific post
   - Personal website → Find specific article/paper

2. **Search strategy** (explain what you would search for):
   - For YouTube: Search channel for videos featuring the quote or author's key topics
   - For blogs: Look for posts matching the quote or theme
   - For podcasts: Find episodes where the author appeared or discussed this topic
   - For profiles: Find specific posts, papers, or talks

3. **Determine specificity**:
   - Can you identify ONE specific piece of content?
   - Does the URL pattern help narrow it down?
   - Are there clues in the generic source title?

IMPORTANT CONSTRAINTS:
- You CANNOT actually browse the web or access these URLs
- You must INFER the most likely specific content based on:
  * URL patterns you recognize
  * Common naming conventions
  * The author's typical content
  * The quote's likely context
- Be honest about confidence - use "low" if you're guessing

COMMON PATTERNS TO USE:
- YouTube channels: If quote mentions a specific topic/person, infer video title like "${author.name} on [topic]"
- Blog posts: If URL has /blog/, the specific post would be /blog/[post-slug]/
- Podcast episodes: Episode format is usually /episode/[number] or /podcast/[guest-name]
- Papers: Look for arxiv.org, doi.org, or PDF links
- Talks/Videos: Look for youtube.com/watch?v= or vimeo.com/

Return ONLY valid JSON in this exact format:
{
  "found": boolean,
  "specificUrl": "exact URL if found, else null",
  "specificTitle": "exact title if found, else null",
  "contentType": "video|article|podcast_episode|paper|book_chapter|other",
  "publishedDate": "YYYY-MM-DD if determinable, else null",
  "confidence": "high|medium|low",
  "reasoning": "Detailed explanation of how you determined this OR why you couldn't find it",
  "quoteContext": "Where in content the quote likely appears (e.g., '12:30 timestamp', 'paragraph 3', 'chapter 2')",
  "searchQuery": "What you would search for to verify this (e.g., 'Yann LeCun autonomous intelligence YouTube')"
}

If you CANNOT find specific content with reasonable confidence, set found: false and explain why in reasoning.`

  try {
    const response = await callGemini(prompt, 'pro')

    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response')
    }

    const result: SpecificContentResult = JSON.parse(jsonMatch[0])

    // Validate result
    if (result.found && !result.specificUrl) {
      result.found = false
      result.reasoning = 'AI claimed found but provided no URL'
      result.confidence = 'low'
    }

    return result

  } catch (error) {
    console.error(`  ❌ AI error: ${error}`)

    // Fallback: cannot determine
    return {
      found: false,
      confidence: 'low',
      reasoning: `AI agent error: ${error instanceof Error ? error.message : 'Unknown error'}. Manual research required.`
    }
  }
}

async function processGenericSources() {
  console.log('=== FIND SPECIFIC CONTENT ===\n')

  // Parse command line args
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const limitIndex = args.indexOf('--limit')
  const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : undefined

  if (dryRun) {
    console.log('🔍 DRY RUN MODE: No database changes will be made\n')
  }

  if (limit) {
    console.log(`📊 Processing limit: ${limit} sources\n`)
  }

  // ===== Load Source Quality Audit =====
  let auditData
  try {
    const auditJson = await readFile('source-quality-audit.json', 'utf-8')
    auditData = JSON.parse(auditJson)
  } catch (error) {
    console.error('❌ Could not load source-quality-audit.json')
    console.error('   Please run: npx tsx scripts/audit-source-quality.ts first')
    process.exit(1)
  }

  const allSources = auditData.allSources
  const genericSources = allSources.filter((s: any) => s.quality === 'generic')

  console.log(`📋 Found ${genericSources.length} generic sources`)

  // Group by author to get quotes
  const sourcesByAuthor = new Map<string, GenericSource[]>()

  for (const source of genericSources) {
    const existing = sourcesByAuthor.get(source.authorId) || []
    existing.push({
      authorId: source.authorId,
      authorName: source.authorName,
      sourceTitle: source.sourceTitle,
      url: source.url,
      quality: source.quality,
      reason: source.reason,
      keyQuote: source.hasQuote ? `[Quote available for ${source.authorName}]` : null
    })
    sourcesByAuthor.set(source.authorId, existing)
  }

  // Fetch author quotes from database
  if (!supabase) {
    console.error('❌ Supabase not configured')
    process.exit(1)
  }

  const { data: authors, error: authorsError } = await supabase
    .from('authors')
    .select('id, name, key_quote')
    .in('id', Array.from(sourcesByAuthor.keys()))

  if (authorsError) {
    console.error('❌ Error fetching authors:', authorsError)
    process.exit(1)
  }

  // Add quotes to sources
  const authorQuotes = new Map(authors?.map(a => [a.id, a.key_quote]) || [])
  for (const [authorId, sources] of sourcesByAuthor.entries()) {
    const quote = authorQuotes.get(authorId)
    sources.forEach(s => s.keyQuote = quote || null)
  }

  // Flatten and limit
  const sourcesToProcess = Array.from(sourcesByAuthor.values())
    .flat()
    .slice(0, limit || genericSources.length)

  console.log(`🔧 Processing ${sourcesToProcess.length} generic sources...\n`)

  // ===== Process Each Generic Source =====
  const results = []
  const errors = []

  for (let i = 0; i < sourcesToProcess.length; i++) {
    const source = sourcesToProcess[i]
    console.log(`[${i + 1}/${sourcesToProcess.length}] ${source.authorName}`)
    console.log(`  Generic: "${source.sourceTitle}"`)
    console.log(`  URL: ${source.url}`)
    console.log(`  Issue: ${source.reason}`)

    try {
      // Try to find specific content
      console.log(`  🔍 Searching for specific content...`)
      const specificContent = await findSpecificContent(
        { name: source.authorName, quote: source.keyQuote },
        { title: source.sourceTitle, url: source.url }
      )

      const statusIcon = specificContent.found ? '✅' : '❌'
      const confidenceColor =
        specificContent.confidence === 'high' ? '🟢' :
        specificContent.confidence === 'medium' ? '🟡' : '🔴'

      if (specificContent.found) {
        console.log(`  ${statusIcon} Found: "${specificContent.specificTitle}"`)
        console.log(`     URL: ${specificContent.specificUrl}`)
        console.log(`     Type: ${specificContent.contentType}`)
        console.log(`     Date: ${specificContent.publishedDate || 'N/A'}`)
        console.log(`     ${confidenceColor} Confidence: ${specificContent.confidence}`)
      } else {
        console.log(`  ${statusIcon} Not found`)
        console.log(`     ${confidenceColor} ${specificContent.reasoning}`)
      }

      results.push({
        authorId: source.authorId,
        authorName: source.authorName,
        genericSource: {
          title: source.sourceTitle,
          url: source.url,
          reason: source.reason
        },
        specificContent,
        willReplace: specificContent.found && specificContent.confidence !== 'low',
        status: specificContent.found ? 'success' : 'not_found'
      })

      // Rate limiting: wait 2 seconds between requests
      if (i < sourcesToProcess.length - 1) {
        console.log(`  ⏱️  Waiting 2 seconds...\n`)
        await new Promise(resolve => setTimeout(resolve, 2000))
      } else {
        console.log('')
      }

    } catch (error) {
      console.error(`  ❌ Error: ${error}`)
      errors.push({
        authorId: source.authorId,
        authorName: source.authorName,
        source: source.sourceTitle,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      console.log('')
    }
  }

  // ===== Generate Summary =====
  console.log('=== SUMMARY ===\n')

  const summary = {
    processed: results.length,
    found: results.filter(r => r.status === 'success').length,
    notFound: results.filter(r => r.status === 'not_found').length,
    highConfidence: results.filter(r => r.specificContent.confidence === 'high').length,
    mediumConfidence: results.filter(r => r.specificContent.confidence === 'medium').length,
    lowConfidence: results.filter(r => r.specificContent.confidence === 'low').length,
    willReplace: results.filter(r => r.willReplace).length,
    errors: errors.length
  }

  const pct = (n: number, total: number) => total > 0 ? ((n / total) * 100).toFixed(1) : '0.0'

  console.log(`Processed: ${summary.processed} generic sources`)
  console.log(`  ✅ Found specific content: ${summary.found} (${pct(summary.found, summary.processed)}%)`)
  console.log(`  ❌ Not found: ${summary.notFound} (${pct(summary.notFound, summary.processed)}%)`)
  console.log(`\nConfidence Distribution:`)
  console.log(`  🟢 High: ${summary.highConfidence} (${pct(summary.highConfidence, summary.processed)}%)`)
  console.log(`  🟡 Medium: ${summary.mediumConfidence} (${pct(summary.mediumConfidence, summary.processed)}%)`)
  console.log(`  🔴 Low: ${summary.lowConfidence} (${pct(summary.lowConfidence, summary.processed)}%)`)
  console.log(`\n📝 Will replace in database: ${summary.willReplace} sources`)

  if (errors.length > 0) {
    console.log(`❌ Errors: ${summary.errors}`)
  }

  // ===== Export Results =====
  const exportPath = dryRun ? 'find-specific-preview.json' : 'find-specific-results.json'
  await writeFile(exportPath, JSON.stringify({
    summary,
    results,
    errors
  }, null, 2))

  console.log(`\n✅ Results exported to: ${exportPath}`)

  // ===== Recommendations =====
  console.log(`\n💡 NEXT STEPS:\n`)

  const replacementRate = summary.willReplace / summary.processed

  if (dryRun) {
    console.log(`  1. Review ${exportPath} to verify found content`)
    console.log(`  2. Spot-check high-confidence matches (search queries provided)`)
    console.log(`  3. If quality looks good, run without --dry-run`)
    console.log(`     Note: This agent cannot verify content, only infer based on patterns`)
  } else {
    if (replacementRate >= 0.7) {
      console.log(`  ✅ Good replacement rate (${(replacementRate * 100).toFixed(0)}%)`)
      console.log(`  → Run replacement script to update database`)
      console.log(`  → Manually research the ${summary.notFound} sources that weren't found`)
    } else if (replacementRate >= 0.5) {
      console.log(`  ⚠️  Moderate replacement rate (${(replacementRate * 100).toFixed(0)}%)`)
      console.log(`  → Review results before batch replacement`)
      console.log(`  → Consider manual research for critical authors`)
    } else {
      console.log(`  ❌ Low replacement rate (${(replacementRate * 100).toFixed(0)}%)`)
      console.log(`  → Most sources need manual research`)
      console.log(`  → AI cannot infer specific content from generic sources`)
    }

    if (summary.lowConfidence > summary.processed * 0.3) {
      console.log(`  ⚠️  ${summary.lowConfidence} low-confidence results`)
      console.log(`     These need manual verification before replacement`)
    }
  }

  console.log(`\n📋 IMPORTANT LIMITATION:`)
  console.log(`  This agent CANNOT actually search the web or access content`)
  console.log(`  It can only INFER based on URL patterns and context`)
  console.log(`  High-confidence results should still be spot-checked`)
  console.log(`  For best results, use manual research for critical sources`)
  console.log('')
}

// Run finder
processGenericSources().catch(error => {
  console.error('❌ Content finding failed:', error)
  if (error instanceof Error) {
    console.error('Stack trace:', error.stack)
  }
  process.exit(1)
})
