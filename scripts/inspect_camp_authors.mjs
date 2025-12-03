import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Supabase credentials not found')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('=== Checking camp_authors table ===\n')

const { data: campAuthors, error } = await supabase
  .from('camp_authors')
  .select('*')
  .limit(5)

if (error) {
  console.log('Error:', error.message)
} else {
  console.log('Total records found:', campAuthors?.length || 0)
  console.log('\nSample records:')
  console.log(JSON.stringify(campAuthors, null, 2))
}

console.log('\n=== Checking camp_authors with authors join ===\n')

const { data: withAuthors, error: joinError } = await supabase
  .from('camp_authors')
  .select(`
    *,
    authors (
      id,
      name,
      header_affiliation
    )
  `)
  .limit(3)

if (joinError) {
  console.log('Error:', joinError.message)
} else {
  console.log('Records with authors:', withAuthors?.length || 0)
  console.log('\nSample:')
  console.log(JSON.stringify(withAuthors, null, 2))
}
