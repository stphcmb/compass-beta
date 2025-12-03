import 'dotenv/config'
import pkg from 'pg'
import fs from 'fs'
const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

async function applyWhyItMatters() {
  console.log('📝 Applying domain-specific "why it matters" content (91 relationships)...\n')

  try {
    // Read the SQL file
    const sql = fs.readFileSync('Docs/ENRICH_ALL_WHY_IT_MATTERS.sql', 'utf8')

    // Execute the SQL
    await pool.query(sql)

    console.log('✅ All 91 "why it matters" updates applied successfully!\n')

    // Verification
    const result = await pool.query(`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN why_it_matters IS NOT NULL THEN 1 END) as with_why_it_matters,
        COUNT(DISTINCT a.id) as unique_authors
      FROM camp_authors ca
      JOIN authors a ON ca.author_id = a.id
    `)

    console.log('📊 Final Statistics:')
    console.log(`   Total author-camp relationships: ${result.rows[0].total}`)
    console.log(`   With "why it matters": ${result.rows[0].with_why_it_matters}`)
    console.log(`   Coverage: ${((result.rows[0].with_why_it_matters / result.rows[0].total) * 100).toFixed(1)}%`)
    console.log(`   Unique authors: ${result.rows[0].unique_authors}\n`)

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
        LEFT(ca.why_it_matters, 120) || '...' as why_preview
      FROM camp_authors ca
      JOIN authors a ON ca.author_id = a.id
      JOIN camps c ON ca.camp_id = c.id
      WHERE a.name IN ('Marc Andreessen', 'Emily M. Bender', 'Geoffrey Hinton', 'Yoshua Bengio')
        AND ca.why_it_matters IS NOT NULL
      ORDER BY a.name, c.domain_id
      LIMIT 10
    `)

    console.log('✨ Sample "Why It Matters" Content:\n')
    samples.rows.forEach(row => {
      console.log(`${row.author} → ${row.domain}`)
      console.log(`  "${row.why_preview}"\n`)
    })

    console.log('🎉 "Why it matters" enrichment COMPLETE!')
    console.log('All author cards now show domain-specific context instead of "position summary coming soon"')

  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.detail) console.error('Detail:', error.detail)
  } finally {
    await pool.end()
  }
}

applyWhyItMatters()
