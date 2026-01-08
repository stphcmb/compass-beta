import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function analyzeGaps() {
  console.log('📊 Analyzing data coverage by domain...\n')

  const { data: camps, error } = await supabase
    .from('camps')
    .select(`
      *,
      camp_authors (
        id,
        author_id,
        relevance,
        authors (
          name
        )
      )
    `)
    .order('domain', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error:', error)
    return
  }

  const byDomain: Record<string, any[]> = {}

  camps?.forEach(camp => {
    const domain = camp.domain || 'Unknown'
    if (!byDomain[domain]) {
      byDomain[domain] = []
    }
    byDomain[domain].push(camp)
  })

  Object.entries(byDomain).forEach(([domain, domainCamps]) => {
    console.log(`\n🏷️  ${domain}`)
    console.log('─'.repeat(60))

    domainCamps.forEach((camp: any) => {
      const authorCount = camp.camp_authors?.length || 0
      const icon = authorCount === 0 ? '❌' : '✅'
      console.log(`${icon} ${camp.name.padEnd(40)} ${authorCount} authors`)

      if (authorCount === 0) {
        console.log(`   ⚠️  NEEDS AUTHORS`)
      }
    })

    const totalCamps = domainCamps.length
    const campsWithAuthors = domainCamps.filter((c: any) => c.camp_authors?.length > 0).length
    const emptyCamps = totalCamps - campsWithAuthors

    console.log(`\n   Summary: ${campsWithAuthors}/${totalCamps} camps have authors`)
    if (emptyCamps > 0) {
      console.log(`   ⚠️  ${emptyCamps} camps need authors!`)
    }
  })

  console.log('\n\n📈 Overall Statistics:')
  console.log('─'.repeat(60))

  const totalCamps = camps?.length || 0
  const campsWithAuthors = camps?.filter(c => c.camp_authors?.length > 0).length || 0
  const emptyCamps = totalCamps - campsWithAuthors

  console.log(`Total camps: ${totalCamps}`)
  console.log(`Camps with authors: ${campsWithAuthors}`)
  console.log(`Empty camps: ${emptyCamps}`)

  if (emptyCamps > 0) {
    console.log(`\n⚠️  Action needed: Add authors to ${emptyCamps} camps\n`)
  }
}

analyzeGaps()
