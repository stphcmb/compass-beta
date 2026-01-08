import 'dotenv/config'
import pkg from 'pg'
import fs from 'fs'
const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

async function applyEnrichedQuotes() {
  console.log('📝 Applying enriched domain-specific quotes...\n')

  try {
    // Read the SQL file
    const sql = fs.readFileSync('Docs/ENRICH_TOP_AUTHORS_QUOTES.sql', 'utf8')

    // Execute the SQL
    await pool.query(sql)

    console.log('✅ All quotes updated successfully!\n')

    // Verification query
    const result = await pool.query(`
      SELECT
        a.name as author,
        CASE c.domain_id
          WHEN 1 THEN 'AI Technical Capabilities'
          WHEN 2 THEN 'AI & Society'
          WHEN 3 THEN 'Enterprise AI Adoption'
          WHEN 4 THEN 'AI Governance & Oversight'
          WHEN 5 THEN 'Future of Work'
        END as domain,
        c.label as camp,
        ca.relevance,
        LEFT(ca.key_quote, 80) || '...' as quote_preview,
        CASE WHEN ca.quote_source_url IS NOT NULL THEN '✅' ELSE '❌' END as has_url
      FROM camp_authors ca
      JOIN authors a ON ca.author_id = a.id
      JOIN camps c ON ca.camp_id = c.id
      WHERE a.name IN ('Marc Andreessen', 'Emily M. Bender', 'Geoffrey Hinton', 'Yoshua Bengio')
      ORDER BY a.name, c.domain_id
    `)

    console.log('📊 Verification Results:\n')
    console.log('Author                | Domain                      | Camp                      | Quote Preview')
    console.log('-'.repeat(140))

    result.rows.forEach(row => {
      console.log(`${row.author.padEnd(20)} | ${row.domain.padEnd(27)} | ${row.camp.padEnd(25)} | ${row.quote_preview}`)
    })

    console.log('\n✨ Domain-specific quotes are now live!')

  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.detail) console.error('Detail:', error.detail)
  } finally {
    await pool.end()
  }
}

applyEnrichedQuotes()
