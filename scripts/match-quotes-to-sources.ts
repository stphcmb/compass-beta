/**
 * Quote-to-Source Matching Script
 *
 * For each author with a key_quote, verifies that the quote_source_url
 * matches one of their sources. Identifies critical mismatches that need fixing.
 *
 * Usage: npx tsx scripts/match-quotes-to-sources.ts
 */

import 'dotenv/config'
import { supabase } from '@/lib/supabase'
import { writeFile } from 'fs/promises'

interface QuoteMatch {
  authorId: string
  authorName: string
  hasQuote: boolean
  quoteSourceUrl: string | null
  status: 'matched' | 'fuzzy_match' | 'no_match' | 'no_quote'
  matchedSource?: {
    title: string
    url: string
  }
  confidence?: 'high' | 'medium' | 'low'
  note?: string
  allSources: Array<{ title: string; url: string }>
}

function normalizeUrl(url: string): string {
  // Remove protocol, www, trailing slashes for comparison
  return url
    .toLowerCase()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/+$/, '')
}

function urlsAreSimilar(url1: string, url2: string): boolean {
  const norm1 = normalizeUrl(url1)
  const norm2 = normalizeUrl(url2)

  // Exact match after normalization
  if (norm1 === norm2) return true

  // Check if one contains the other (handles short URLs vs full URLs)
  if (norm1.includes(norm2) || norm2.includes(norm1)) return true

  // Check for YouTube video ID matching
  const youtubeId1 = norm1.match(/(?:watch\?v=|youtu\.be\/)([^&\/\?]+)/)
  const youtubeId2 = norm2.match(/(?:watch\?v=|youtu\.be\/)([^&\/\?]+)/)
  if (youtubeId1 && youtubeId2 && youtubeId1[1] === youtubeId2[1]) return true

  return false
}

function findBestMatch(
  quoteUrl: string,
  sources: Array<{ title: string; url: string }>
): { source: { title: string; url: string }; confidence: 'high' | 'medium' | 'low' } | null {

  // Try exact match first
  const exactMatch = sources.find(s => urlsAreSimilar(s.url, quoteUrl))
  if (exactMatch) {
    return { source: exactMatch, confidence: 'high' }
  }

  // Try to find by URL similarity (domain + path segments)
  const quoteNorm = normalizeUrl(quoteUrl)
  const quoteDomain = quoteNorm.split('/')[0]
  const quotePathSegments = quoteNorm.split('/').slice(1)

  for (const source of sources) {
    const sourceNorm = normalizeUrl(source.url)
    const sourceDomain = sourceNorm.split('/')[0]
    const sourcePathSegments = sourceNorm.split('/').slice(1)

    // Same domain?
    if (sourceDomain !== quoteDomain) continue

    // Count matching path segments
    let matchingSegments = 0
    const minLength = Math.min(quotePathSegments.length, sourcePathSegments.length)

    for (let i = 0; i < minLength; i++) {
      if (quotePathSegments[i] === sourcePathSegments[i]) {
        matchingSegments++
      } else {
        break
      }
    }

    // If we have significant path overlap, it's a medium confidence match
    if (matchingSegments >= 2) {
      return { source, confidence: 'medium' }
    }
  }

  // Check if quote URL's domain matches any source's domain (very weak signal)
  const domainMatch = sources.find(s => {
    const sourceDomain = normalizeUrl(s.url).split('/')[0]
    return sourceDomain === quoteDomain
  })

  if (domainMatch) {
    return { source: domainMatch, confidence: 'low' }
  }

  return null
}

async function matchQuotesToSources() {
  console.log('=== QUOTE-TO-SOURCE MATCHING ===\n')
  console.log('Analyzing quote sources across the canon...\n')

  if (!supabase) {
    console.error('❌ Supabase not configured')
    process.exit(1)
  }

  // Fetch all authors with their quotes and sources
  const { data: authors, error } = await supabase
    .from('authors')
    .select('id, name, key_quote, quote_source_url, sources')

  if (error) {
    console.error('❌ Error fetching authors:', error)
    process.exit(1)
  }

  console.log(`📊 Analyzing ${authors?.length || 0} authors...\n`)

  const matches: QuoteMatch[] = []

  for (const author of authors || []) {
    const hasQuote = !!author.key_quote
    const quoteSourceUrl = author.quote_source_url
    const sources = author.sources || []

    // No quote case
    if (!hasQuote || !quoteSourceUrl) {
      matches.push({
        authorId: author.id,
        authorName: author.name,
        hasQuote: false,
        quoteSourceUrl: null,
        status: 'no_quote',
        allSources: sources.map((s: any) => ({
          title: s.title || 'Untitled',
          url: s.url || ''
        }))
      })
      continue
    }

    // Check for exact match
    const exactMatch = sources.find((s: any) =>
      s.url && urlsAreSimilar(s.url, quoteSourceUrl)
    )

    if (exactMatch) {
      matches.push({
        authorId: author.id,
        authorName: author.name,
        hasQuote: true,
        quoteSourceUrl,
        status: 'matched',
        matchedSource: {
          title: exactMatch.title || 'Untitled',
          url: exactMatch.url || ''
        },
        confidence: 'high',
        allSources: sources.map((s: any) => ({
          title: s.title || 'Untitled',
          url: s.url || ''
        }))
      })
      continue
    }

    // Try fuzzy matching
    const bestMatch = findBestMatch(
      quoteSourceUrl,
      sources.map((s: any) => ({
        title: s.title || 'Untitled',
        url: s.url || ''
      }))
    )

    if (bestMatch) {
      matches.push({
        authorId: author.id,
        authorName: author.name,
        hasQuote: true,
        quoteSourceUrl,
        status: 'fuzzy_match',
        matchedSource: bestMatch.source,
        confidence: bestMatch.confidence,
        note: `Found similar URL with ${bestMatch.confidence} confidence`,
        allSources: sources.map((s: any) => ({
          title: s.title || 'Untitled',
          url: s.url || ''
        }))
      })
      continue
    }

    // No match found
    matches.push({
      authorId: author.id,
      authorName: author.name,
      hasQuote: true,
      quoteSourceUrl,
      status: 'no_match',
      note: 'Quote source URL not found in sources list',
      allSources: sources.map((s: any) => ({
        title: s.title || 'Untitled',
        url: s.url || ''
      }))
    })
  }

  // ===== Generate Summary =====
  console.log('=== SUMMARY ===\n')

  const summary = {
    total: matches.length,
    withQuotes: matches.filter(m => m.hasQuote).length,
    noQuotes: matches.filter(m => m.status === 'no_quote').length,
    matched: matches.filter(m => m.status === 'matched').length,
    fuzzyMatch: matches.filter(m => m.status === 'fuzzy_match').length,
    noMatch: matches.filter(m => m.status === 'no_match').length
  }

  const pct = (n: number, total: number) => ((n / total) * 100).toFixed(1)

  console.log(`Total authors: ${summary.total}`)
  console.log(`  📝 Authors with quotes: ${summary.withQuotes}`)
  console.log(`  ⚪ Authors without quotes: ${summary.noQuotes}`)
  console.log(`\nQuote-Source Matching (${summary.withQuotes} with quotes):`)
  console.log(`  ✅ Exact match: ${summary.matched} (${pct(summary.matched, summary.withQuotes)}%)`)
  console.log(`  🟡 Fuzzy match: ${summary.fuzzyMatch} (${pct(summary.fuzzyMatch, summary.withQuotes)}%)`)
  console.log(`  ❌ No match: ${summary.noMatch} (${pct(summary.noMatch, summary.withQuotes)}%)`)

  // ===== Critical Issues =====
  const criticalIssues = matches.filter(m => m.status === 'no_match')

  if (criticalIssues.length > 0) {
    console.log(`\n❌ CRITICAL: ${criticalIssues.length} AUTHORS WITH QUOTE-SOURCE MISMATCHES:\n`)
    criticalIssues.slice(0, 20).forEach((m, idx) => {
      console.log(`  ${idx + 1}. ${m.authorName}`)
      console.log(`     Quote URL: ${m.quoteSourceUrl}`)
      console.log(`     Sources available: ${m.allSources.length}`)
      if (m.allSources.length > 0) {
        console.log(`     First source: ${m.allSources[0].title}`)
        console.log(`                   ${m.allSources[0].url}`)
      }
      console.log('')
    })

    if (criticalIssues.length > 20) {
      console.log(`  ... and ${criticalIssues.length - 20} more\n`)
    }
  }

  // ===== Fuzzy Matches Needing Review =====
  const fuzzyMatches = matches.filter(m => m.status === 'fuzzy_match')

  if (fuzzyMatches.length > 0) {
    console.log(`\n🟡 FUZZY MATCHES NEED REVIEW (${fuzzyMatches.length}):\n`)
    fuzzyMatches.slice(0, 10).forEach((m, idx) => {
      console.log(`  ${idx + 1}. ${m.authorName} (${m.confidence} confidence)`)
      console.log(`     Quote URL: ${m.quoteSourceUrl}`)
      console.log(`     Matched:   ${m.matchedSource?.title}`)
      console.log(`                ${m.matchedSource?.url}`)
      console.log('')
    })

    if (fuzzyMatches.length > 10) {
      console.log(`  ... and ${fuzzyMatches.length - 10} more\n`)
    }
  }

  // ===== Export Results =====
  const exportPath = 'quote-source-matching.json'
  await writeFile(exportPath, JSON.stringify({
    summary,
    criticalIssues: criticalIssues.map(m => ({
      authorId: m.authorId,
      authorName: m.authorName,
      quoteSourceUrl: m.quoteSourceUrl,
      availableSourceCount: m.allSources.length,
      availableSources: m.allSources
    })),
    fuzzyMatches: fuzzyMatches.map(m => ({
      authorId: m.authorId,
      authorName: m.authorName,
      quoteSourceUrl: m.quoteSourceUrl,
      matchedSource: m.matchedSource,
      confidence: m.confidence
    })),
    allMatches: matches
  }, null, 2))

  console.log(`✅ Full results exported to: ${exportPath}`)

  // ===== Recommendations =====
  console.log(`\n💡 RECOMMENDATIONS:\n`)

  if (summary.noMatch > 0) {
    console.log(`  🚨 CRITICAL: ${summary.noMatch} quote-source mismatches need immediate fixing`)
    console.log(`     These authors have quotes pointing to sources not in their sources list`)
    console.log(`     Action: Add missing sources OR update quote_source_url`)
  }

  if (summary.fuzzyMatch > 0) {
    console.log(`  ⚠️  ${summary.fuzzyMatch} fuzzy matches need manual review`)
    console.log(`     URLs are similar but not exact - verify they're the same content`)
  }

  const successRate = summary.matched / summary.withQuotes
  if (successRate < 0.9) {
    console.log(`  📉 Quote matching rate is ${(successRate * 100).toFixed(0)}% - should be >90%`)
    console.log(`     Fix mismatches before proceeding with source quality improvements`)
  }

  console.log(`\n📋 NEXT STEPS:`)
  console.log(`  1. Review ${exportPath} for detailed mismatch list`)
  console.log(`  2. For each critical mismatch, decide:`)
  console.log(`     a) Add the missing source to the author's sources list`)
  console.log(`     b) OR update quote_source_url to match an existing source`)
  console.log(`  3. Re-run this script to verify fixes`)
  console.log(`  4. Once >90% matched, proceed to find-specific-content.ts`)
  console.log('')
}

// Run matching
matchQuotesToSources().catch(error => {
  console.error('❌ Matching failed:', error)
  process.exit(1)
})
