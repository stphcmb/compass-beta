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

async function findMissingQuotes() {
  console.log('🔍 Finding authors missing quotes...\n')

  try {
    // Fetch all author-camp relationships
    const { data: campAuthors, error } = await supabase
      .from('camp_authors')
      .select(`
        id,
        key_quote,
        quote_source_url,
        why_it_matters,
        relevance,
        authors (
          id,
          name,
          header_affiliation,
          primary_affiliation
        ),
        camps (
          id,
          label,
          domain_id
        )
      `)
      .order('authors(name)')

    if (error) {
      console.error('Error fetching data:', error)
      return
    }

    const DOMAIN_MAP = {
      1: 'AI Technical Capabilities',
      2: 'AI & Society',
      3: 'Enterprise AI Adoption',
      4: 'AI Governance & Oversight',
      5: 'Future of Work'
    }

    // Group by author
    const byAuthor = campAuthors.reduce((acc, ca) => {
      const authorName = ca.authors?.name || 'Unknown'
      if (!acc[authorName]) {
        acc[authorName] = {
          author: ca.authors,
          camps: []
        }
      }
      acc[authorName].camps.push({
        id: ca.id,
        campName: ca.camps?.label,
        domain: DOMAIN_MAP[ca.camps?.domain_id],
        relevance: ca.relevance,
        hasQuote: !!ca.key_quote,
        hasSource: !!ca.quote_source_url,
        quote: ca.key_quote,
        source: ca.quote_source_url
      })
      return acc
    }, {})

    console.log('=' .repeat(80))
    console.log('📊 AUTHORS MISSING QUOTES\n')

    let totalMissing = 0
    let totalAuthors = 0

    Object.entries(byAuthor).forEach(([authorName, data]) => {
      const missingQuotes = data.camps.filter(c => !c.hasQuote)

      if (missingQuotes.length > 0) {
        totalAuthors++
        totalMissing += missingQuotes.length

        console.log(`\n${authorName}`)
        console.log(`  Affiliation: ${data.author?.header_affiliation || data.author?.primary_affiliation || 'Unknown'}`)
        console.log(`  Total camps: ${data.camps.length} | Missing quotes: ${missingQuotes.length}\n`)

        missingQuotes.forEach(camp => {
          console.log(`  ❌ ${camp.domain} → ${camp.campName}`)
          console.log(`     Relevance: ${camp.relevance}`)
          console.log(`     Camp-Author ID: ${camp.id}`)
        })
      }
    })

    console.log('\n' + '='.repeat(80))
    console.log(`\n📈 Summary:`)
    console.log(`  Authors with missing quotes: ${totalAuthors}`)
    console.log(`  Total missing quotes: ${totalMissing}`)
    console.log(`\nTo add quotes, use SQL UPDATE statements like:`)
    console.log(`
UPDATE camp_authors
SET
  key_quote = 'Representative quote here...',
  quote_source_url = 'https://source-url.com'
WHERE id = 'camp-author-id-from-above';
`)

  } catch (error) {
    console.error('Error:', error)
  }
}

findMissingQuotes()
