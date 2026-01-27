import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env.local
dotenv.config({ path: join(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function findDuplicateSources() {
  console.log('🔍 Finding authors with duplicate sources...\n')

  try {
    // Fetch all authors with sources
    const { data: authors, error } = await supabase
      .from('authors')
      .select('id, name, header_affiliation, sources')
      .not('sources', 'is', null)
      .order('name')

    if (error) {
      console.error('Error fetching authors:', error)
      return
    }

    console.log(`Found ${authors.length} authors with sources\n`)
    console.log('=' .repeat(80))

    let totalAuthorsWithDupes = 0
    let totalDuplicates = 0

    authors.forEach(author => {
      const sources = author.sources || []

      if (!Array.isArray(sources) || sources.length === 0) {
        return
      }

      // Find duplicates by URL (case-insensitive)
      const urlCounts = {}
      const duplicates = []

      sources.forEach((source, idx) => {
        if (!source.url) return

        const normalizedUrl = source.url.toLowerCase().trim()

        if (!urlCounts[normalizedUrl]) {
          urlCounts[normalizedUrl] = []
        }
        urlCounts[normalizedUrl].push({ index: idx, source })
      })

      // Identify duplicates
      Object.entries(urlCounts).forEach(([url, instances]) => {
        if (instances.length > 1) {
          duplicates.push({
            url,
            count: instances.length,
            instances
          })
        }
      })

      // Also check for very similar titles (possible duplicates with different URLs)
      const titleCounts = {}
      const titleDuplicates = []

      sources.forEach((source, idx) => {
        if (!source.title) return

        // Normalize title for comparison
        const normalizedTitle = source.title
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .trim()
          .substring(0, 50) // First 50 chars

        if (!titleCounts[normalizedTitle]) {
          titleCounts[normalizedTitle] = []
        }
        titleCounts[normalizedTitle].push({ index: idx, source })
      })

      Object.entries(titleCounts).forEach(([title, instances]) => {
        if (instances.length > 1) {
          // Only flag if URLs are also similar or same type
          const sameType = instances.every(i => i.source.type === instances[0].source.type)
          if (sameType) {
            titleDuplicates.push({
              title,
              count: instances.length,
              instances
            })
          }
        }
      })

      if (duplicates.length > 0 || titleDuplicates.length > 0) {
        totalAuthorsWithDupes++
        const dupeCount = duplicates.reduce((sum, d) => sum + (d.count - 1), 0)
        totalDuplicates += dupeCount

        console.log(`\n${author.name}`)
        console.log(`  Affiliation: ${author.header_affiliation || 'Unknown'}`)
        console.log(`  Total sources: ${sources.length}`)
        console.log(`  Duplicate URLs: ${duplicates.length}`)

        if (duplicates.length > 0) {
          console.log('\n  📍 Exact URL Duplicates:')
          duplicates.forEach(dup => {
            console.log(`     ${dup.url}`)
            console.log(`     Appears ${dup.count} times:`)
            dup.instances.forEach(inst => {
              console.log(`       [${inst.index}] ${inst.source.title} (${inst.source.type})`)
            })
          })
        }

        if (titleDuplicates.length > 0) {
          console.log('\n  ⚠️  Similar Titles (possible duplicates):')
          titleDuplicates.forEach(dup => {
            console.log(`     "${dup.instances[0].source.title}"`)
            console.log(`     Appears ${dup.count} times:`)
            dup.instances.forEach(inst => {
              console.log(`       [${inst.index}] ${inst.source.url} (${inst.source.type})`)
            })
          })
        }

        // Show all sources for reference
        console.log('\n  📚 All Sources:')
        sources.forEach((source, idx) => {
          console.log(`     [${idx}] ${source.title || 'Untitled'}`)
          console.log(`         ${source.url || 'No URL'}`)
          console.log(`         Type: ${source.type || 'Unknown'} | Year: ${source.year || 'Unknown'}`)
        })

        console.log(`\n  🔧 Author ID: ${author.id}`)
      }
    })

    console.log('\n' + '='.repeat(80))
    console.log(`\n📊 Summary:`)
    console.log(`  Authors with duplicate sources: ${totalAuthorsWithDupes}`)
    console.log(`  Total duplicate entries: ${totalDuplicates}`)

    if (totalAuthorsWithDupes > 0) {
      console.log(`\n💡 Next Steps:`)
      console.log(`  1. Review duplicates above`)
      console.log(`  2. Find replacement sources for duplicates`)
      console.log(`  3. Update sources using Supabase or SQL`)
      console.log(`  4. Re-run this script to verify`)
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

findDuplicateSources()
