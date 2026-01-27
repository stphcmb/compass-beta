#!/usr/bin/env node

/**
 * Analyze Missing Author Data
 *
 * Identifies authors with:
 * - Fewer than 3 sources/publications
 * - Missing quotes in camp relationships
 * - Missing quote source URLs
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

console.log('🔍 Analyzing missing author data...\n')

// 1. Check authors with fewer than 3 sources
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('📚 AUTHORS WITH FEWER THAN 3 PUBLICATIONS')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

const { data: authors, error: authorsError } = await supabase
  .from('authors')
  .select('id, name, header_affiliation, sources, credibility_tier')
  .order('name')

if (authorsError) {
  console.error('Error fetching authors:', authorsError)
  process.exit(1)
}

const insufficientSources = authors.filter(author => {
  const sourceCount = author.sources ? author.sources.length : 0
  return sourceCount < 3
})

console.log(`Found ${insufficientSources.length} authors with < 3 sources:\n`)

insufficientSources.forEach((author, idx) => {
  const sourceCount = author.sources ? author.sources.length : 0
  console.log(`${idx + 1}. ${author.name} (${author.header_affiliation})`)
  console.log(`   Tier: ${author.credibility_tier}`)
  console.log(`   Current sources: ${sourceCount}`)
  console.log(`   Need: ${3 - sourceCount} more`)
  console.log()
})

// 2. Check camp relationships missing quotes
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('💬 CAMP RELATIONSHIPS MISSING QUOTES')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

const { data: campAuthors, error: campAuthorsError } = await supabase
  .from('camp_authors')
  .select(`
    id,
    key_quote,
    quote_source_url,
    relevance,
    authors (name, header_affiliation),
    camps (label, id)
  `)

if (campAuthorsError) {
  console.error('Error fetching camp_authors:', campAuthorsError)
  process.exit(1)
}

const missingQuotes = campAuthors.filter(ca => !ca.key_quote)
const missingSourceUrls = campAuthors.filter(ca => ca.key_quote && !ca.quote_source_url)

console.log(`Missing quotes: ${missingQuotes.length}`)
console.log(`Missing source URLs: ${missingSourceUrls.length}\n`)

// Group by author
const authorsMissingQuotes = {}
missingQuotes.forEach(ca => {
  const authorName = ca.authors.name
  if (!authorsMissingQuotes[authorName]) {
    authorsMissingQuotes[authorName] = {
      affiliation: ca.authors.header_affiliation,
      camps: []
    }
  }
  authorsMissingQuotes[authorName].camps.push({
    campName: ca.camps.label,
    campId: ca.camps.id,
    relevance: ca.relevance
  })
})

console.log('Authors with missing quotes:\n')
Object.entries(authorsMissingQuotes).forEach(([name, data], idx) => {
  console.log(`${idx + 1}. ${name} (${data.affiliation})`)
  console.log(`   Missing quotes for ${data.camps.length} camp(s):`)
  data.camps.forEach(camp => {
    console.log(`   - ${camp.campName} (${camp.relevance})`)
  })
  console.log()
})

// 3. Authors with missing source URLs
if (missingSourceUrls.length > 0) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔗 QUOTES MISSING SOURCE URLs')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const authorsMissingUrls = {}
  missingSourceUrls.forEach(ca => {
    const authorName = ca.authors.name
    if (!authorsMissingUrls[authorName]) {
      authorsMissingUrls[authorName] = {
        affiliation: ca.authors.header_affiliation,
        camps: []
      }
    }
    authorsMissingUrls[authorName].camps.push(ca.camps.label)
  })

  console.log(`${Object.keys(authorsMissingUrls).length} authors with quotes but no source URLs:\n`)
  Object.entries(authorsMissingUrls).forEach(([name, data], idx) => {
    console.log(`${idx + 1}. ${name} (${data.affiliation})`)
    console.log(`   Camps: ${data.camps.join(', ')}`)
    console.log()
  })
}

// 4. Summary statistics
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('📊 SUMMARY STATISTICS')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

console.log(`Total authors: ${authors.length}`)
console.log(`Authors with < 3 sources: ${insufficientSources.length}`)
console.log(`Camp relationships missing quotes: ${missingQuotes.length}`)
console.log(`Quotes missing source URLs: ${missingSourceUrls.length}`)
console.log()

// 5. Generate priority list
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('🎯 PRIORITY FIXES')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

// High priority: Major Voices and Seminal Thinkers with issues
const highPriorityAuthors = new Set()

insufficientSources.forEach(author => {
  if (['Major Voice', 'Seminal Thinker'].includes(author.credibility_tier)) {
    highPriorityAuthors.add(author.name)
  }
})

Object.keys(authorsMissingQuotes).forEach(name => {
  const author = authors.find(a => a.name === name)
  if (author && ['Major Voice', 'Seminal Thinker'].includes(author.credibility_tier)) {
    highPriorityAuthors.add(name)
  }
})

if (highPriorityAuthors.size > 0) {
  console.log('HIGH PRIORITY (Major Voices & Seminal Thinkers needing data):\n')
  Array.from(highPriorityAuthors).forEach((name, idx) => {
    const author = authors.find(a => a.name === name)
    const sourceCount = author.sources ? author.sources.length : 0
    const quotesIssue = authorsMissingQuotes[name]

    console.log(`${idx + 1}. ${name} (${author.header_affiliation})`)
    if (sourceCount < 3) {
      console.log(`   ⚠️  Only ${sourceCount} sources (need ${3 - sourceCount} more)`)
    }
    if (quotesIssue) {
      console.log(`   ⚠️  Missing ${quotesIssue.camps.length} quotes`)
    }
    console.log()
  })
} else {
  console.log('✅ No high-priority issues found!\n')
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
console.log('💡 Next steps:')
console.log('1. Review the high-priority authors above')
console.log('2. Research their recent work and notable publications')
console.log('3. Find representative quotes for each camp they belong to')
console.log('4. Run the enrichment SQL script to add missing data')
console.log()
