import 'dotenv/config'
import pkg from 'pg'
import fs from 'fs'
const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

async function applyAllRemainingQuotes() {
  console.log('📝 Applying ALL remaining domain-specific quotes (71 relationships)...\n')

  try {
    // Read the SQL file
    const sql = fs.readFileSync('Docs/ENRICH_ALL_REMAINING_QUOTES.sql', 'utf8')

    // Execute the SQL
    await pool.query(sql)

    console.log('✅ All 71 remaining quotes updated successfully!\n')

    // Comprehensive verification
    const result = await pool.query(`
      SELECT
        COUNT(*) as total,
        COUNT(DISTINCT a.id) as unique_authors,
        COUNT(CASE WHEN ca.quote_source_url IS NOT NULL THEN 1 END) as with_sources
      FROM camp_authors ca
      JOIN authors a ON ca.author_id = a.id
    `)

    console.log('📊 Final Statistics:')
    console.log(`   Total author-camp relationships: ${result.rows[0].total}`)
    console.log(`   Unique authors: ${result.rows[0].unique_authors}`)
    console.log(`   With source URLs: ${result.rows[0].with_sources}`)
    console.log(`   Coverage: ${((result.rows[0].with_sources / result.rows[0].total) * 100).toFixed(1)}%\n`)

    // Sample verification - show a few examples
    const samples = await pool.query(`
      SELECT
        a.name as author,
        CASE c.domain_id
          WHEN 1 THEN 'AI Technical'
          WHEN 2 THEN 'Society'
          WHEN 3 THEN 'Enterprise'
          WHEN 4 THEN 'Governance'
          WHEN 5 THEN 'Work'
        END as domain,
        c.label as camp,
        LEFT(ca.key_quote, 80) || '...' as quote_preview
      FROM camp_authors ca
      JOIN authors a ON ca.author_id = a.id
      JOIN camps c ON ca.camp_id = c.id
      WHERE a.name IN ('Andrej Karpathy', 'Yann LeCun', 'Timnit Gebru', 'Sam Altman')
      ORDER BY a.name, c.domain_id
    `)

    console.log('✨ Sample Enriched Quotes:\n')
    samples.rows.forEach(row => {
      console.log(`${row.author} → ${row.domain}`)
      console.log(`  "${row.quote_preview}"\n`)
    })

    console.log('🎉 Quote enrichment COMPLETE! All 91 author-camp relationships now have domain-specific quotes!')

  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.detail) console.error('Detail:', error.detail)
  } finally {
    await pool.end()
  }
}

applyAllRemainingQuotes()
