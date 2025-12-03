import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function getCampIds() {
  console.log('📊 Fetching all camp IDs...\n')

  const { data: camps, error } = await supabase
    .from('camps')
    .select('id, code, label, domain_id')
    .order('domain_id')
    .order('label')

  if (error) {
    console.error('Error:', error)
    return
  }

  const domainMap = {
    1: 'AI Technical Capabilities',
    2: 'AI & Society',
    3: 'Enterprise AI Adoption',
    4: 'AI Governance & Oversight',
    5: 'Future of Work'
  }

  let currentDomain = null

  camps.forEach(camp => {
    const domain = domainMap[camp.domain_id]

    if (domain !== currentDomain) {
      console.log(`\n=== ${domain} ===`)
      currentDomain = domain
    }

    console.log(`${camp.label}`)
    console.log(`  ID: ${camp.id}`)
    console.log(`  Code: ${camp.code}`)
  })

  console.log(`\n\nTotal camps: ${camps.length}`)
}

getCampIds()
