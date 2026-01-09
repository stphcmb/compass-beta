import { Client } from 'pg'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in .env.local')
  console.error('\n📝 To get your DATABASE_URL:')
  console.error('   1. Go to your Supabase project dashboard')
  console.error('   2. Click "Project Settings" → "Database"')
  console.error('   3. Under "Connection string", select "URI" and copy the connection string')
  console.error('   4. Add it to .env.local as: DATABASE_URL=your_connection_string')
  console.error('   5. Replace [YOUR-PASSWORD] with your actual database password\n')
  process.exit(1)
}

async function runSeedScript() {
  const client = new Client({
    connectionString: DATABASE_URL,
  })

  try {
    console.log('🔌 Connecting to Supabase database...')
    await client.connect()
    console.log('✅ Connected successfully!\n')

    // Step 1: Apply schema
    console.log('📋 Applying database schema...')
    const schemaPath = path.join(__dirname, '../Docs/schema.sql')
    const schemaSQL = fs.readFileSync(schemaPath, 'utf-8')

    await client.query(schemaSQL)
    console.log('✅ Schema applied successfully!\n')

    // Step 2: Ask which seed data to use
    const useMVPSeed = process.argv.includes('--mvp')

    const seedFile = useMVPSeed
      ? 'seed_from_mvp_database.sql'
      : 'seed_data.sql'

    console.log(`📊 Loading seed data from ${seedFile}...`)
    const seedPath = path.join(__dirname, `../Docs/${seedFile}`)
    const seedSQL = fs.readFileSync(seedPath, 'utf-8')

    await client.query(seedSQL)
    console.log('✅ Seed data loaded successfully!\n')

    // Step 3: Verify data
    console.log('🔍 Verifying data...')

    const authorsResult = await client.query('SELECT COUNT(*) as count FROM authors')
    const campsResult = await client.query('SELECT COUNT(*) as count FROM camps')
    const campAuthorsResult = await client.query('SELECT COUNT(*) as count FROM camp_authors')
    const sourcesResult = await client.query('SELECT COUNT(*) as count FROM sources')

    console.log(`   ✓ Authors: ${authorsResult.rows[0].count}`)
    console.log(`   ✓ Camps: ${campsResult.rows[0].count}`)
    console.log(`   ✓ Camp-Author relationships: ${campAuthorsResult.rows[0].count}`)
    console.log(`   ✓ Sources: ${sourcesResult.rows[0].count}`)

    console.log('\n🎉 Database seeded successfully!')
    console.log('\n💡 Tip: Run with --mvp flag to use the comprehensive seed data:')
    console.log('   npm run seed:mvp\n')

  } catch (error: any) {
    console.error('❌ Error seeding database:', error.message)

    if (error.message.includes('relation') && error.message.includes('already exists')) {
      console.log('\n💡 Tip: Tables already exist. To reset and re-seed:')
      console.log('   1. Drop tables from Supabase Dashboard SQL Editor')
      console.log('   2. Run this seed script again\n')
    } else if (error.message.includes('duplicate key')) {
      console.log('\n💡 Tip: Data already exists. To re-seed:')
      console.log('   1. Clear existing data from Supabase Dashboard')
      console.log('   2. Run this seed script again\n')
    }

    process.exit(1)
  } finally {
    await client.end()
    console.log('🔌 Database connection closed')
  }
}

runSeedScript()
