import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function getCampAuthorIds() {
  console.log('📊 Fetching all camp_author IDs...\n')

  const { data: campAuthors, error } = await supabase
    .from('camp_authors')
    .select(`
      id,
      relevance,
      key_quote,
      why_it_matters,
      authors (
        name
      ),
      camps (
        label,
        domain_id
      )
    `)
    .order('authors(name)')

  if (error) {
    console.error('Error:', error)
    return
  }

  const domainMap = {
    1: 'AI Technical',
    2: 'Society',
    3: 'Enterprise',
    4: 'Governance',
    5: 'Work'
  }

  console.log(`Total camp_author relationships: ${campAuthors.length}\n`)

  // Group by author
  const byAuthor = {}
  campAuthors.forEach(ca => {
    const authorName = ca.authors.name
    if (!byAuthor[authorName]) {
      byAuthor[authorName] = []
    }
    byAuthor[authorName].push({
      id: ca.id,
      domain: domainMap[ca.camps.domain_id],
      camp: ca.camps.label,
      relevance: ca.relevance,
      has_quote: !!ca.key_quote,
      has_why_it_matters: !!ca.why_it_matters
    })
  })

  // Sort authors alphabetically
  const sortedAuthors = Object.keys(byAuthor).sort()

  sortedAuthors.forEach(authorName => {
    console.log(`\n=== ${authorName} ===`)
    byAuthor[authorName].forEach(ca => {
      console.log(`ID: ${ca.id}`)
      console.log(`  ${ca.domain} → ${ca.camp} (${ca.relevance})`)
      console.log(`  Quote: ${ca.has_quote ? '✅' : '❌'} | Why it matters: ${ca.has_why_it_matters ? '✅' : '❌'}`)
    })
  })

  // Summary stats
  const totalWithWhyItMatters = campAuthors.filter(ca => ca.why_it_matters).length
  console.log(`\n\n📈 Summary:`)
  console.log(`Total relationships: ${campAuthors.length}`)
  console.log(`With why_it_matters: ${totalWithWhyItMatters} (${((totalWithWhyItMatters / campAuthors.length) * 100).toFixed(1)}%)`)
  console.log(`Without why_it_matters: ${campAuthors.length - totalWithWhyItMatters}`)
}

getCampAuthorIds()
