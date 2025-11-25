import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  const { data, error } = await supabase
    .from('camp_authors')
    .select('*')
    .limit(1)

  if (error) {
    console.error('❌ Error:', error)
  } else if (data.length > 0) {
    console.log('✅ camp_authors table columns:', Object.keys(data[0]))
    console.log('Sample:', data[0])
  } else {
    console.log('No data in camp_authors table')
  }
}

main()
