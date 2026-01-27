import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkAuthors() {
  console.log('📊 Fetching all authors with their camps...\n')

  const { data: authors, error } = await supabase
    .from('authors')
    .select(`
      id,
      name,
      header_affiliation,
      notes,
      camp_authors (
        camp_id,
        relevance,
        camps (
          code,
          label
        )
      )
    `)
    .order('name')

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log(`Found ${authors.length} authors:\n`)

  authors.forEach((author, idx) => {
    console.log(`${idx + 1}. ${author.name} (${author.header_affiliation || 'N/A'})`)
    console.log(`   ID: ${author.id}`)

    if (author.camp_authors && author.camp_authors.length > 0) {
      console.log('   Camps:')
      author.camp_authors.forEach(ca => {
        console.log(`     - ${ca.camps.label} (${ca.camps.code}) [${ca.relevance}]`)
      })
    } else {
      console.log('   Camps: None')
    }
    console.log('')
  })
}

checkAuthors()
