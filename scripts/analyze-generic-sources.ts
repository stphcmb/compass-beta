/**
 * Analyze Generic Sources
 * Shows breakdown of why sources are flagged as generic
 */

import 'dotenv/config'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'

interface GenericSource {
  authorName: string
  title: string
  url: string
  reason: string
}

async function main() {
  console.log('=== ANALYZING GENERIC SOURCES ===\n')

  if (!supabase) {
    console.error('❌ Database not configured')
    process.exit(1)
  }

  const { data: authors, error } = await supabase
    .from('authors')
    .select('id, name, sources')

  if (error) throw error

  const genericSources: GenericSource[] = []
  const reasonCounts: Record<string, number> = {}

  authors?.forEach(author => {
    const sources = author.sources || []

    sources.forEach((source: any) => {
      const title = String(source.title || '').toLowerCase()
      const url = String(source.url || '')

      let reason = ''

      if (title.includes('channel')) {
        reason = 'Title contains "channel"'
      } else if (title.includes('homepage')) {
        reason = 'Title contains "homepage"'
      } else if (title.includes('website')) {
        reason = 'Title contains "website"'
      } else if (title.includes('profile')) {
        reason = 'Title contains "profile"'
      } else if (url.includes('youtube.com/@')) {
        reason = 'YouTube @ handle URL'
      } else if (url.includes('youtube.com/channel/')) {
        reason = 'YouTube channel URL'
      } else if (url.match(/^https?:\/\/[^\/]+\/?$/)) {
        reason = 'Domain-only URL (no specific page)'
      }

      if (reason) {
        genericSources.push({
          authorName: author.name,
          title: source.title || '(no title)',
          url: url || '(no url)',
          reason
        })

        reasonCounts[reason] = (reasonCounts[reason] || 0) + 1
      }
    })
  })

  // Summary by reason
  console.log('📊 Generic Source Breakdown:\n')
  Object.entries(reasonCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([reason, count]) => {
      console.log(`  ${count.toString().padStart(3)} - ${reason}`)
    })

  console.log(`\n  Total: ${genericSources.length} generic sources\n`)

  // Show examples of each type
  console.log('\n📋 Examples by Type:\n')

  const uniqueReasons = Object.keys(reasonCounts)
  for (const reason of uniqueReasons) {
    const examples = genericSources
      .filter(s => s.reason === reason)
      .slice(0, 3)

    console.log(`\n${reason}:`)
    examples.forEach(ex => {
      console.log(`  • ${ex.authorName}`)
      console.log(`    Title: ${ex.title}`)
      console.log(`    URL:   ${ex.url}`)
    })
  }

  // List all authors with generic sources
  console.log('\n\n👥 Authors with Generic Sources:\n')

  const authorGenericCounts: Record<string, number> = {}
  genericSources.forEach(gs => {
    authorGenericCounts[gs.authorName] = (authorGenericCounts[gs.authorName] || 0) + 1
  })

  Object.entries(authorGenericCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .forEach(([name, count]) => {
      console.log(`  ${count} - ${name}`)
    })
}

main().catch(error => {
  console.error('❌ Failed to analyze:', error)
  process.exit(1)
})
