import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function verify() {
  console.log('🔍 Verifying new taxonomy...\n')

  const { data: domains } = await supabase.from('domains').select('*').order('display_order')
  const { data: dimensions } = await supabase.from('dimensions').select('*')
  const { data: camps } = await supabase.from('camps').select('*')
  const { data: authors } = await supabase.from('authors').select('*')
  const { data: campAuthors } = await supabase.from('camp_authors').select('*')

  console.log('📊 Database Counts:')
  console.log(`  ✅ Domains: ${domains?.length || 0}`)
  console.log(`  ✅ Dimensions: ${dimensions?.length || 0}`)
  console.log(`  ✅ Camps: ${camps?.length || 0}`)
  console.log(`  ✅ Authors: ${authors?.length || 0}`)
  console.log(`  ✅ Relationships: ${campAuthors?.length || 0}\n`)

  console.log('🏷️  Domains:')
  domains?.forEach(d => {
    console.log(`  ${d.display_order}. ${d.name}`)
  })

  console.log('\n🎯 Camps by Domain:')
  const { data: hierarchy } = await supabase
    .from('camps')
    .select(`
      id,
      name,
      dimensions (
        name,
        domains (
          name
        )
      )
    `)

  const campsByDomain: Record<string, any[]> = {}
  hierarchy?.forEach((camp: any) => {
    const domainName = camp.dimensions?.domains?.name || 'Unknown'
    if (!campsByDomain[domainName]) {
      campsByDomain[domainName] = []
    }
    campsByDomain[domainName].push({
      name: camp.name,
      dimension: camp.dimensions?.name || '(implicit)'
    })
  })

  Object.entries(campsByDomain).forEach(([domain, camps]) => {
    console.log(`\n  ${domain}:`)
    camps.forEach(camp => {
      console.log(`    • ${camp.name} ${camp.dimension !== '(implicit)' ? `[${camp.dimension}]` : ''}`)
    })
  })

  console.log('\n✅ Migration verification complete!\n')
}

verify()
