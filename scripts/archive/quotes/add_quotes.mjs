import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function addQuotes() {
  console.log('📝 Adding key quotes to authors...\n')

  // Read the SQL file
  const sql = fs.readFileSync('./Docs/add_key_quotes.sql', 'utf8')

  // Split into individual statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  console.log(`Found ${statements.length} SQL statements to execute\n`)

  // Execute each statement
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]

    // Skip comments
    if (statement.startsWith('--')) continue

    console.log(`Executing statement ${i + 1}/${statements.length}...`)

    const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' })

    if (error) {
      // Try direct query for simpler operations
      if (statement.toLowerCase().includes('alter table')) {
        console.log('  Trying direct query for ALTER TABLE...')
        const { error: altError } = await supabase
          .from('authors')
          .select('key_quote')
          .limit(1)

        if (altError && altError.message.includes('column "key_quote" does not exist')) {
          console.log('  ⚠️  Need to add key_quote column via Supabase dashboard or direct SQL')
        } else {
          console.log('  ✓ Column already exists')
        }
      } else {
        console.error(`  ❌ Error:`, error.message)
      }
    } else {
      console.log('  ✓ Success')
    }
  }

  console.log('\n✅ Finished applying quotes')

  // Verify some quotes were added
  const { data: authors, error } = await supabase
    .from('authors')
    .select('name, key_quote')
    .not('key_quote', 'is', null)
    .limit(5)

  if (authors && authors.length > 0) {
    console.log('\n📊 Sample quotes:')
    authors.forEach(author => {
      console.log(`\n${author.name}:`)
      console.log(`  "${author.key_quote.substring(0, 100)}..."`)
    })
  }
}

addQuotes()
