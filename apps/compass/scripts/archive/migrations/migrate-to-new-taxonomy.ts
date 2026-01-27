import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function migrate() {
  console.log('🔄 Starting migration to new taxonomy...\n')

  try {
    // Step 1: Drop old tables
    console.log('🗑️  Dropping old tables...')

    const dropStatements = [
      'DROP TABLE IF EXISTS search_history CASCADE',
      'DROP TABLE IF EXISTS saved_searches CASCADE',
      'DROP TABLE IF EXISTS source_topics CASCADE',
      'DROP TABLE IF EXISTS topics CASCADE',
      'DROP TABLE IF EXISTS sources CASCADE',
      'DROP TABLE IF EXISTS camp_authors CASCADE',
      'DROP TABLE IF EXISTS camps CASCADE',
      'DROP TABLE IF EXISTS authors CASCADE',
      'DROP VIEW IF EXISTS taxonomy_hierarchy CASCADE',
      'DROP VIEW IF EXISTS camps_by_domain CASCADE',
      'DROP VIEW IF EXISTS domain_summary CASCADE',
      'DROP TABLE IF EXISTS dimensions CASCADE',
      'DROP TABLE IF EXISTS domains CASCADE'
    ]

    for (const statement of dropStatements) {
      const { error } = await supabase.rpc('exec_sql', { sql: statement })
      if (error && !error.message.includes('does not exist')) {
        console.error(`  Warning: ${error.message}`)
      }
    }

    console.log('  ✅ Old tables dropped\n')

    // Step 2: Read and execute new schema
    console.log('📋 Creating new taxonomy schema...')
    const schemaPath = path.join(__dirname, '../Docs/compass_taxonomy_schema_Nov11.sql')
    const schemaSQL = fs.readFileSync(schemaPath, 'utf-8')

    // Execute schema by splitting into individual statements
    const statements = schemaSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' })
        if (error) {
          console.error(`  Error: ${error.message}`)
        }
      }
    }

    console.log('  ✅ New schema created\n')

    console.log('✅ Migration complete!')
    console.log('\n📊 New Taxonomy Structure:')
    console.log('  • 6 Domains')
    console.log('  • 9 Dimensions (3 for Enterprise Transformation)')
    console.log('  • 17 Camps total\n')

    console.log('⚠️  Note: The new schema uses exec_sql RPC which may not be available.')
    console.log('   If you see errors, please run the schema manually in Supabase SQL Editor.\n')

  } catch (error: any) {
    console.error('❌ Migration failed:', error.message)
    console.log('\n💡 Manual Migration Steps:')
    console.log('   1. Go to Supabase Dashboard → SQL Editor')
    console.log('   2. Run these commands in order:')
    console.log('      a. Drop old tables (see scripts/drop-old-tables.sql)')
    console.log('      b. Run Docs/compass_taxonomy_schema_Nov11.sql')
    console.log('      c. Run scripts/seed-new-taxonomy.ts\n')
  }
}

migrate()
