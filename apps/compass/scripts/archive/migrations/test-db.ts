import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDatabase() {
  console.log('🔍 Testing database connection and data...\n')

  // Test 1: Count camps
  console.log('1. Counting camps...')
  const { data: camps, error: campsError } = await supabase
    .from('camps')
    .select('*')

  if (campsError) {
    console.error('❌ Error fetching camps:', campsError)
  } else {
    console.log(`✅ Found ${camps?.length || 0} camps`)
    camps?.slice(0, 3).forEach(camp => {
      console.log(`   - ${camp.name} (${camp.domain})`)
    })
  }

  // Test 2: Count authors
  console.log('\n2. Counting authors...')
  const { data: authors, error: authorsError } = await supabase
    .from('authors')
    .select('*')

  if (authorsError) {
    console.error('❌ Error fetching authors:', authorsError)
  } else {
    console.log(`✅ Found ${authors?.length || 0} authors`)
    authors?.slice(0, 3).forEach(author => {
      console.log(`   - ${author.name} (${author.affiliation})`)
    })
  }

  // Test 3: Count camp_authors relationships
  console.log('\n3. Counting camp_authors relationships...')
  const { data: relationships, error: relError } = await supabase
    .from('camp_authors')
    .select('*')

  if (relError) {
    console.error('❌ Error fetching camp_authors:', relError)
  } else {
    console.log(`✅ Found ${relationships?.length || 0} relationships`)
  }

  // Test 4: Test the nested query
  console.log('\n4. Testing nested query (camps with authors)...')
  const { data: campsWithAuthors, error: nestedError } = await supabase
    .from('camps')
    .select(`
      *,
      camp_authors (
        author_id,
        relevance,
        authors (
          id,
          name,
          affiliation
        )
      )
    `)

  if (nestedError) {
    console.error('❌ Error with nested query:', nestedError)
  } else {
    console.log(`✅ Nested query successful`)
    const campWithMostAuthors = campsWithAuthors?.sort((a, b) =>
      (b.camp_authors?.length || 0) - (a.camp_authors?.length || 0)
    )[0]

    if (campWithMostAuthors) {
      console.log(`   Top camp: ${campWithMostAuthors.name}`)
      console.log(`   Authors: ${campWithMostAuthors.camp_authors?.length || 0}`)
      campWithMostAuthors.camp_authors?.slice(0, 2).forEach((ca: any) => {
        console.log(`     - ${ca.authors?.name} (${ca.relevance})`)
      })
    }
  }

  // Test 5: Search test
  console.log('\n5. Testing search for "safety"...')
  const { data: searchResults, error: searchError } = await supabase
    .from('camps')
    .select(`
      *,
      camp_authors (
        author_id,
        relevance,
        authors (
          id,
          name,
          affiliation,
          position_summary
        )
      )
    `)

  if (searchError) {
    console.error('❌ Error with search:', searchError)
  } else {
    // Filter for "safety"
    const filtered = searchResults?.filter((camp: any) => {
      const campMatches =
        camp.name.toLowerCase().includes('safety') ||
        (camp.position_summary && camp.position_summary.toLowerCase().includes('safety'))

      const authorMatches = camp.camp_authors?.some((ca: any) =>
        ca.authors?.name?.toLowerCase().includes('safety') ||
        ca.authors?.affiliation?.toLowerCase().includes('safety') ||
        ca.authors?.position_summary?.toLowerCase().includes('safety')
      )

      return campMatches || authorMatches
    })

    console.log(`✅ Found ${filtered?.length || 0} camps matching "safety"`)
    filtered?.slice(0, 3).forEach((camp: any) => {
      console.log(`   - ${camp.name} (${camp.camp_authors?.length || 0} authors)`)
    })
  }

  console.log('\n✅ Database test complete!\n')
}

testDatabase()
