// Quick script to check if Supabase tables have data
import { supabase } from '../../../lib/supabase'

async function checkData() {
  if (!supabase) {
    console.log('❌ Supabase client not configured')
    return
  }

  console.log('🔍 Checking Supabase data...\n')

  // Check authors table
  try {
    const { data: authors, error: authorsError } = await supabase
      .from('authors')
      .select('*', { count: 'exact', head: false })
      .limit(3)

    if (authorsError) {
      console.log('❌ Authors table error:', authorsError.message)
    } else {
      console.log(`✅ Authors table: ${authors?.length || 0} rows found`)
      if (authors && authors.length > 0) {
        console.log('   Sample:', authors[0].name)
      }
    }
  } catch (e: any) {
    console.log('❌ Authors table:', e.message)
  }

  // Check camps table
  try {
    const { data: camps, error: campsError } = await supabase
      .from('camps')
      .select('*', { count: 'exact', head: false })
      .limit(3)

    if (campsError) {
      console.log('❌ Camps table error:', campsError.message)
    } else {
      console.log(`✅ Camps table: ${camps?.length || 0} rows found`)
      if (camps && camps.length > 0) {
        console.log('   Sample:', camps[0].name)
      }
    }
  } catch (e: any) {
    console.log('❌ Camps table:', e.message)
  }

  // Check author_camp_mappings table
  try {
    const { data: mappings, error: mappingsError } = await supabase
      .from('author_camp_mappings')
      .select('*', { count: 'exact', head: false })
      .limit(3)

    if (mappingsError) {
      console.log('❌ Author_camp_mappings table error:', mappingsError.message)
    } else {
      console.log(`✅ Author_camp_mappings table: ${mappings?.length || 0} rows found`)
    }
  } catch (e: any) {
    console.log('❌ Author_camp_mappings table:', e.message)
  }
}

checkData()
