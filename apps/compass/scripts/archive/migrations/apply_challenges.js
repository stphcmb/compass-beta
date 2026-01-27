const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function applyChallengesAndEmerging() {
  console.log('🚀 Applying challenges and emerging perspectives...')

  const sql = fs.readFileSync('Docs/add_challenges_and_emerging.sql', 'utf8')

  // Split by INSERT statements and execute each one
  const statements = sql
    .split(/INSERT INTO camp_authors/)
    .filter(s => s.trim())
    .map(s => 'INSERT INTO camp_authors' + s)

  console.log(`📝 Found ${statements.length} INSERT statements to execute`)

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]
    console.log(`\n[${i + 1}/${statements.length}] Executing statement...`)

    const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement })

    if (error) {
      console.error('❌ Error:', error.message)
      console.error('Statement:', statement.substring(0, 200) + '...')
    } else {
      console.log('✅ Success')
    }
  }

  console.log('\n🎉 Done!')
}

applyChallengesAndEmerging().catch(console.error)
