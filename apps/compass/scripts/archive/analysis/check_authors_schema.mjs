import 'dotenv/config'
import pkg from 'pg'
const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

async function checkSchema() {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'authors'
      ORDER BY ordinal_position
    `)

    console.log('📋 Authors Table Schema:\n')
    result.rows.forEach(col => {
      console.log(`   ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : 'nullable'}`)
    })

  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await pool.end()
  }
}

checkSchema()
