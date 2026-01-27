import 'dotenv/config'
import pkg from 'pg'
const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

async function analyzeQuoteGaps() {
  console.log('🔍 Analyzing quote gaps in camp_authors...\n')

  try {
    // Get all author-camp combinations with domain info
    const query = `
      SELECT
        a.id as author_id,
        a.name as author_name,
        c.id as camp_id,
        c.label as camp_name,
        c.domain_id,
        CASE c.domain_id
          WHEN 1 THEN 'AI Technical Capabilities'
          WHEN 2 THEN 'AI & Society'
          WHEN 3 THEN 'Enterprise AI Adoption'
          WHEN 4 THEN 'AI Governance & Oversight'
          WHEN 5 THEN 'Future of Work'
        END as domain_name,
        ca.relevance,
        ca.key_quote,
        ca.quote_source_url,
        ca.why_it_matters
      FROM camp_authors ca
      JOIN authors a ON ca.author_id = a.id
      JOIN camps c ON ca.camp_id = c.id
      ORDER BY a.name, c.domain_id, c.label
    `

    const result = await pool.query(query)
    const rows = result.rows

    console.log(`Total author-camp relationships: ${rows.length}\n`)

    // Group by author
    const byAuthor = rows.reduce((acc, row) => {
      if (!acc[row.author_name]) {
        acc[row.author_name] = []
      }
      acc[row.author_name].push(row)
      return acc
    }, {})

    // Analyze gaps
    let totalWithQuotes = 0
    let totalWithoutQuotes = 0
    let authorsWithMultipleDomains = 0

    console.log('📊 Analysis by Author:\n')
    console.log('=' .repeat(80))

    Object.entries(byAuthor).forEach(([authorName, camps]) => {
      const uniqueDomains = new Set(camps.map(c => c.domain_id))
      const campsWithQuotes = camps.filter(c => c.key_quote)
      const campsWithoutQuotes = camps.filter(c => !c.key_quote)

      totalWithQuotes += campsWithQuotes.length
      totalWithoutQuotes += campsWithoutQuotes.length

      if (uniqueDomains.size > 1) {
        authorsWithMultipleDomains++
      }

      console.log(`\n${authorName}`)
      console.log(`  Appears in ${camps.length} camps across ${uniqueDomains.size} domains`)
      console.log(`  ✅ ${campsWithQuotes.length} with quotes | ❌ ${campsWithoutQuotes.length} without quotes`)

      // Group by domain
      const byDomain = camps.reduce((acc, camp) => {
        if (!acc[camp.domain_name]) {
          acc[camp.domain_name] = []
        }
        acc[camp.domain_name].push(camp)
        return acc
      }, {})

      Object.entries(byDomain).forEach(([domainName, domainCamps]) => {
        console.log(`\n    ${domainName}:`)
        domainCamps.forEach(camp => {
          const status = camp.key_quote ? '✅' : '❌'
          const quote = camp.key_quote ? `"${camp.key_quote.substring(0, 60)}..."` : 'NO QUOTE'
          console.log(`      ${status} ${camp.camp_name} (${camp.relevance})`)
          console.log(`         ${quote}`)
        })
      })
    })

    console.log('\n' + '='.repeat(80))
    console.log('\n📈 Summary:')
    console.log(`  Total authors: ${Object.keys(byAuthor).length}`)
    console.log(`  Authors appearing in multiple domains: ${authorsWithMultipleDomains}`)
    console.log(`  Total camp-author relationships: ${rows.length}`)
    console.log(`  ✅ With quotes: ${totalWithQuotes} (${((totalWithQuotes/rows.length)*100).toFixed(1)}%)`)
    console.log(`  ❌ Without quotes: ${totalWithoutQuotes} (${((totalWithoutQuotes/rows.length)*100).toFixed(1)}%)`)

    // Export data for manual enrichment
    console.log('\n📝 Exporting gap data...')
    const gaps = rows.filter(r => !r.key_quote).map(r => ({
      author: r.author_name,
      domain: r.domain_name,
      camp: r.camp_name,
      relevance: r.relevance,
      why_it_matters: r.why_it_matters
    }))

    console.log(`\nFound ${gaps.length} author-camp combinations needing quotes`)

    // Print first 10 as examples
    console.log('\nExample gaps to fill:')
    gaps.slice(0, 10).forEach(gap => {
      console.log(`\n  - ${gap.author}`)
      console.log(`    Domain: ${gap.domain}`)
      console.log(`    Camp: ${gap.camp} (${gap.relevance})`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await pool.end()
  }
}

analyzeQuoteGaps()
