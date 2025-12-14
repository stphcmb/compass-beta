import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env.local
dotenv.config({ path: join(__dirname, '../.env.local') })

console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Supabase Key (first 20 chars):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20))

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testConnection() {
  console.log('\n🔍 Testing Supabase connection...\n')

  try {
    // Try to select one specific record
    const testId = '4ebe46dc-05b5-49ce-8894-f2c42ff33c7f'

    const { data, error } = await supabase
      .from('camp_authors')
      .select('*, authors(name), camps(label)')
      .eq('id', testId)

    if (error) {
      console.log('❌ Error:', error)
    } else {
      console.log('✅ Query successful')
      console.log('Data:', JSON.stringify(data, null, 2))
    }

    // Count total camp_authors
    const { count, error: countError } = await supabase
      .from('camp_authors')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.log('❌ Count error:', countError)
    } else {
      console.log(`\n📊 Total camp_authors records: ${count}`)
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

testConnection()
