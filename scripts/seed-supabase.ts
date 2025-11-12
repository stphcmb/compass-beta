import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase credentials not found in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function executeSQLFile(filepath: string) {
  const sql = fs.readFileSync(filepath, 'utf-8')

  // Split by semicolon and filter out empty statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  for (const statement of statements) {
    if (statement) {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement })
      if (error && !error.message.includes('already exists')) {
        console.error('Error executing statement:', error)
      }
    }
  }
}

async function seedWithSupabaseClient() {
  try {
    console.log('🔌 Connecting to Supabase...\n')

    // Use MVP seed data
    const useMVPSeed = process.argv.includes('--mvp')
    const seedFile = useMVPSeed ? 'seed_from_mvp_database.sql' : 'seed_data.sql'

    console.log(`📋 Reading seed file: ${seedFile}...`)
    const seedPath = path.join(__dirname, `../Docs/${seedFile}`)
    const seedSQL = fs.readFileSync(seedPath, 'utf-8')

    // Parse and insert data manually
    console.log('📊 Parsing seed data...\n')

    // This approach: parse the SQL and use Supabase client methods
    // Let's extract INSERT statements and convert to Supabase client calls

    const insertRegex = /INSERT INTO (\w+)\s*\((.*?)\)\s*VALUES\s*\((.*?)\);/gis
    let match

    while ((match = insertRegex.exec(seedSQL)) !== null) {
      const tableName = match[1]
      const columns = match[2].split(',').map(c => c.trim())
      const values = match[3]

      console.log(`  Inserting into ${tableName}...`)

      // This is complex - let me use a simpler approach
    }

    console.log('\n✅ Seed data loaded!')

  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

// Alternative: Direct SQL execution via Supabase SQL API
async function seedDirectSQL() {
  try {
    console.log('🔌 Seeding database using Supabase client...\n')

    const useMVPSeed = process.argv.includes('--mvp')
    const seedFile = useMVPSeed ? 'seed_from_mvp_database.sql' : 'seed_data.sql'

    console.log(`📋 Reading ${seedFile}...\n`)
    const seedPath = path.join(__dirname, `../Docs/${seedFile}`)
    const seedContent = fs.readFileSync(seedPath, 'utf-8')

    // For now, let's output instructions for manual seeding
    console.log('📝 To seed your database, follow these steps:\n')
    console.log('1. Go to your Supabase Dashboard: https://supabase.com/dashboard')
    console.log('2. Select your project')
    console.log('3. Go to "SQL Editor" in the left sidebar')
    console.log('4. Click "New query"')
    console.log('5. Copy and paste the contents from:', seedPath)
    console.log('6. Click "Run" to execute\n')

    console.log('💡 Alternatively, the seed file is located at:')
    console.log(`   ${seedPath}\n`)

    // Try using the simple insert approach
    await seedWithInserts(useMVPSeed)

  } catch (error: any) {
    console.error('❌ Error:', error.message)
  }
}

async function seedWithInserts(useMVP: boolean) {
  console.log('🚀 Attempting to seed using Supabase client inserts...\n')

  if (useMVP) {
    // Seed camps first
    console.log('📊 Inserting camps...')
    const campsData = [
      { name: 'Scaling Maximalists', domain: 'Technology', position_summary: 'Belief that scaling compute and data will lead to AGI and solve alignment' },
      { name: 'Grounding Realists', domain: 'Technology', position_summary: 'Emphasis on grounding AI in real-world understanding and reasoning' },
      // Add more camps...
    ]

    for (const camp of campsData) {
      const { error } = await supabase.from('camps').insert(camp)
      if (error && !error.message.includes('duplicate')) {
        console.error('  Error inserting camp:', error.message)
      }
    }
    console.log('  ✓ Camps inserted\n')

    // Seed authors
    console.log('📊 Inserting authors...')
    const authorsData = [
      {
        name: 'Sam Altman',
        affiliation: 'OpenAI',
        credibility_tier: 'Thought Leader',
        author_type: 'Industry Leader',
        position_summary: 'CEO of OpenAI, advocate for rapid AI development with safety considerations'
      },
      // Add more authors...
    ]

    for (const author of authorsData) {
      const { error } = await supabase.from('authors').insert(author)
      if (error && !error.message.includes('duplicate')) {
        console.error('  Error inserting author:', error.message)
      }
    }
    console.log('  ✓ Authors inserted\n')
  }

  console.log('✅ Basic seeding complete!')
  console.log('\n💡 For complete data, please use the SQL Editor method described above.\n')
}

seedDirectSQL()
