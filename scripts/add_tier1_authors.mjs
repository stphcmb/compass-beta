import 'dotenv/config'
import pkg from 'pg'
import fs from 'fs'
const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

async function addTier1Authors() {
  console.log('📝 Adding 9 Tier 1 authors + Cassie Kozyrkov...\n')

  try {
    // Read the SQL file
    const sql = fs.readFileSync('Docs/data/seed/add_tier1_authors.sql', 'utf8')

    // Execute the SQL
    await pool.query(sql)

    console.log('✅ All 9 authors added successfully!\n')

    // Verification - check authors were added
    const authors = await pool.query(`
      SELECT name, primary_affiliation, credibility_tier
      FROM authors
      WHERE name IN (
        'Cassie Kozyrkov', 'Lex Fridman', 'Stuart Russell',
        'Eliezer Yudkowsky', 'Demis Hassabis', 'Mustafa Suleyman',
        'Kai-Fu Lee', 'Jaron Lanier', 'Tristan Harris'
      )
      ORDER BY name
    `)

    console.log('📊 Authors Added:')
    authors.rows.forEach(author => {
      console.log(`   ✓ ${author.name} (${author.primary_affiliation})`)
    })
    console.log('')

    // Count relationships
    const relationships = await pool.query(`
      SELECT a.name, COUNT(*) as relationship_count
      FROM authors a
      JOIN camp_authors ca ON a.id = ca.author_id
      WHERE a.name IN (
        'Cassie Kozyrkov', 'Lex Fridman', 'Stuart Russell',
        'Eliezer Yudkowsky', 'Demis Hassabis', 'Mustafa Suleyman',
        'Kai-Fu Lee', 'Jaron Lanier', 'Tristan Harris'
      )
      GROUP BY a.name
      ORDER BY relationship_count DESC
    `)

    console.log('🔗 Camp Relationships:')
    let totalRelationships = 0
    relationships.rows.forEach(row => {
      console.log(`   ${row.name}: ${row.relationship_count} camps`)
      totalRelationships += parseInt(row.relationship_count)
    })
    console.log(`   Total: ${totalRelationships} relationships\n`)

    // Verify quotes and why_it_matters
    const coverage = await pool.query(`
      SELECT
        COUNT(ca.id) as total_relationships,
        COUNT(ca.key_quote) as with_quotes,
        COUNT(ca.why_it_matters) as with_why_it_matters
      FROM authors a
      JOIN camp_authors ca ON a.id = ca.author_id
      WHERE a.name IN (
        'Cassie Kozyrkov', 'Lex Fridman', 'Stuart Russell',
        'Eliezer Yudkowsky', 'Demis Hassabis', 'Mustafa Suleyman',
        'Kai-Fu Lee', 'Jaron Lanier', 'Tristan Harris'
      )
    `)

    const stats = coverage.rows[0]
    console.log('✨ Content Quality:')
    console.log(`   Quotes: ${stats.with_quotes}/${stats.total_relationships} (${((stats.with_quotes / stats.total_relationships) * 100).toFixed(0)}%)`)
    console.log(`   Why it matters: ${stats.with_why_it_matters}/${stats.total_relationships} (${((stats.with_why_it_matters / stats.total_relationships) * 100).toFixed(0)}%)\n`)

    // Overall database stats
    const overall = await pool.query(`
      SELECT
        COUNT(DISTINCT a.id) as total_authors,
        COUNT(ca.id) as total_relationships
      FROM authors a
      LEFT JOIN camp_authors ca ON a.id = ca.author_id
    `)

    console.log('📈 Updated Database Stats:')
    console.log(`   Total authors: ${overall.rows[0].total_authors}`)
    console.log(`   Total relationships: ${overall.rows[0].total_relationships}`)
    console.log('')

    console.log('🎉 Tier 1 author addition COMPLETE!')
    console.log('New authors will appear in search results immediately.')

  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.detail) console.error('Detail:', error.detail)
    if (error.hint) console.error('Hint:', error.hint)
  } finally {
    await pool.end()
  }
}

addTier1Authors()
