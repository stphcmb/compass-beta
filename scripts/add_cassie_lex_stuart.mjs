import 'dotenv/config'
import pkg from 'pg'
import fs from 'fs'
const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

async function addAuthors() {
  console.log('📝 Adding 3 Tier 1 authors (Cassie, Lex, Stuart)...\n')

  try {
    const sql = fs.readFileSync('Docs/data/seed/add_cassie_lex_stuart.sql', 'utf8')
    await pool.query(sql)

    console.log('✅ Authors added successfully!\n')

    const result = await pool.query(`
      SELECT
        a.name,
        a.primary_affiliation,
        COUNT(ca.id) as relationship_count
      FROM authors a
      LEFT JOIN camp_authors ca ON a.id = ca.author_id
      WHERE a.name IN ('Cassie Kozyrkov', 'Lex Fridman', 'Stuart Russell')
      GROUP BY a.name, a.primary_affiliation
      ORDER BY a.name
    `)

    console.log('📊 Authors Added:')
    result.rows.forEach(row => {
      console.log(`   ✓ ${row.name} (${row.primary_affiliation}) - ${row.relationship_count} camps`)
    })

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await pool.end()
  }
}

addAuthors()
