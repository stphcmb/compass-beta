// Verify author names and current assignments
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

async function verify() {
  const names = ['Chip Huyen', 'Joy Buolamwini', 'Andrew McAfee', 'Meredith Broussard']

  console.log('VERIFYING AUTHOR DATA')
  console.log('='.repeat(60))

  for (const name of names) {
    // Try exact match
    const { data: exact } = await supabase
      .from('authors')
      .select('id, name')
      .eq('name', name)

    // Try ilike match
    const { data: ilike } = await supabase
      .from('authors')
      .select('id, name')
      .ilike('name', `%${name.split(' ')[1]}%`)

    console.log(`\n${name}:`)
    console.log(`  Exact match: ${exact?.length ? exact[0].name + ' (id: ' + exact[0].id + ')' : 'NOT FOUND'}`)

    if (ilike && ilike.length > 0) {
      console.log(`  Similar names found:`)
      ilike.forEach(a => console.log(`    - "${a.name}" (id: ${a.id})`))
    }

    // Get current camp assignments if found
    if (exact && exact.length > 0) {
      const { data: assignments } = await supabase
        .from('camp_authors')
        .select('camp_id, relevance')
        .eq('author_id', exact[0].id)

      const { data: camps } = await supabase.from('camps').select('id, label')
      const campsById: Record<string, string> = {}
      camps?.forEach(c => { campsById[c.id] = c.label })

      console.log(`  Current camps:`)
      if (assignments && assignments.length > 0) {
        assignments.forEach(a => {
          console.log(`    - ${campsById[a.camp_id] || a.camp_id} (${a.relevance})`)
        })
      } else {
        console.log(`    - NONE`)
      }
    }
  }
}

verify().catch(console.error)
