import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  console.log('📋 All camps in production database:\n')

  const { data: camps, error } = await supabase
    .from('camps')
    .select('id, label, code, description')
    .order('label')

  if (error) {
    console.error('❌ Error:', error)
    return
  }

  camps.forEach((camp, i) => {
    console.log(`${i + 1}. "${camp.label}" (code: ${camp.code})`)
    console.log(`   ${camp.description}\n`)
  })

  console.log(`\nTotal: ${camps.length} camps`)
}

main()
