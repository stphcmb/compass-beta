import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Supabase credentials not found')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Check camps table
const { data: camps, error: campsError } = await supabase
  .from('camps')
  .select('id, label, domain_id')
  .limit(5)

console.log('Camps table:')
if (campsError) {
  console.log('  Error:', campsError.message)
} else {
  console.log('  Count:', camps?.length || 0)
  console.log('  Sample:', JSON.stringify(camps?.slice(0, 2), null, 2))
}

// Check camp_authors table
const { data: campAuthors, error: caError } = await supabase
  .from('camp_authors')
  .select('camp_id, author_id')
  .limit(5)

console.log('\ncamp_authors table:')
if (caError) {
  console.log('  Error:', caError.message)
} else {
  console.log('  Count:', campAuthors?.length || 0)
}

// Check authors table
const { data: authors, error: authorsError } = await supabase
  .from('authors')
  .select('id, name')
  .limit(5)

console.log('\nauthors table:')
if (authorsError) {
  console.log('  Error:', authorsError.message)
} else {
  console.log('  Count:', authors?.length || 0)
  console.log('  Sample:', JSON.stringify(authors?.slice(0, 2), null, 2))
}
