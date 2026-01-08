import 'dotenv/config'
import pkg from 'pg'
const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

async function migrateQuotes() {
  console.log('🔧 Migrating quotes to camp_authors table...\n')

  try {
    // Step 1: Add columns if they don't exist
    console.log('Step 1: Adding key_quote and quote_source_url columns to camp_authors...')
    await pool.query(`
      ALTER TABLE camp_authors
      ADD COLUMN IF NOT EXISTS key_quote TEXT,
      ADD COLUMN IF NOT EXISTS quote_source_url TEXT
    `)
    console.log('✅ Columns added\n')

    // Step 2: Check current state
    console.log('Step 2: Checking current state...')
    const checkResult = await pool.query(`
      SELECT
        COUNT(*) as total_relationships,
        COUNT(DISTINCT author_id) as total_authors,
        SUM(CASE WHEN key_quote IS NOT NULL THEN 1 ELSE 0 END) as with_quotes
      FROM camp_authors
    `)
    console.log(`  Total author-camp relationships: ${checkResult.rows[0].total_relationships}`)
    console.log(`  Unique authors: ${checkResult.rows[0].total_authors}`)
    console.log(`  Already have quotes: ${checkResult.rows[0].with_quotes}\n`)

    // Step 3: Migrate existing author-level quotes to camp_authors
    console.log('Step 3: Migrating existing author-level quotes to camp_authors...')
    const migrateResult = await pool.query(`
      UPDATE camp_authors ca
      SET
        key_quote = a.key_quote,
        quote_source_url = a.quote_source_url
      FROM authors a
      WHERE ca.author_id = a.id
        AND a.key_quote IS NOT NULL
        AND ca.key_quote IS NULL
    `)
    console.log(`✅ Migrated quotes to ${migrateResult.rowCount} author-camp relationships\n`)

    // Step 4: Verification
    console.log('Step 4: Verification...')
    const verifyResult = await pool.query(`
      SELECT
        a.name as author_name,
        COUNT(*) as total_camps,
        COUNT(DISTINCT c.domain_id) as domains,
        SUM(CASE WHEN ca.key_quote IS NOT NULL THEN 1 ELSE 0 END) as camps_with_quotes
      FROM camp_authors ca
      JOIN authors a ON ca.author_id = a.id
      JOIN camps c ON ca.camp_id = c.id
      GROUP BY a.id, a.name
      ORDER BY domains DESC, total_camps DESC
      LIMIT 20
    `)

    console.log('Top 20 authors by domain coverage:')
    console.log('Author                           | Total Camps | Domains | With Quotes')
    console.log('-'.repeat(75))
    verifyResult.rows.forEach(row => {
      console.log(
        `${row.author_name.padEnd(32)} | ${String(row.total_camps).padStart(11)} | ${String(row.domains).padStart(7)} | ${String(row.camps_with_quotes).padStart(11)}`
      )
    })

    console.log('\n✅ Migration complete!')

  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.detail) console.error('Detail:', error.detail)
  } finally {
    await pool.end()
  }
}

migrateQuotes()
