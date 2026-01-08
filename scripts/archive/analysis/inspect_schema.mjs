import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  console.log('🔍 Inspecting database schema...\n')

  // Try to get all camps without specifying columns
  const { data: camps, error } = await supabase
    .from('camps')
    .select('*')
    .limit(3)

  if (error) {
    console.error('❌ Error fetching camps:', error)
  } else {
    console.log('✅ Camps table sample:')
    if (camps.length > 0) {
      console.log('  Columns:', Object.keys(camps[0]))
      console.log('  Sample data:', camps[0])
    } else {
      console.log('  No camps found in database')
    }
  }

  // Try authors
  const { data: authors, error: authError } = await supabase
    .from('authors')
    .select('*')
    .limit(3)

  if (authError) {
    console.error('\n❌ Error fetching authors:', authError)
  } else {
    console.log('\n✅ Authors table sample:')
    if (authors.length > 0) {
      console.log('  Columns:', Object.keys(authors[0]))
      console.log('  Sample data:', authors[0])
    } else {
      console.log('  No authors found in database')
    }
  }
}

main()
