import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  console.log('📋 Checking existing camps in database...\n')

  const { data: camps, error } = await supabase
    .from('camps')
    .select('id, domain_id, code, label, description')
    .order('domain_id, label')

  if (error) {
    console.error('❌ Error:', error)
    return
  }

  const DOMAIN_MAP = {
    1: 'AI Technical Capabilities',
    2: 'AI & Society',
    3: 'Enterprise AI Adoption',
    4: 'AI Governance & Oversight',
    5: 'Future of Work'
  }

  // Group by domain
  const campsByDomain = camps.reduce((acc, camp) => {
    const domain = DOMAIN_MAP[camp.domain_id] || 'Unknown'
    if (!acc[domain]) acc[domain] = []
    acc[domain].push(camp)
    return acc
  }, {})

  console.log(`Found ${camps.length} camps across ${Object.keys(campsByDomain).length} domains:\n`)

  Object.entries(campsByDomain).forEach(([domain, domainCamps]) => {
    console.log(`\n🔹 ${domain}`)
    domainCamps.forEach(camp => {
      console.log(`   • ${camp.label}`)
      console.log(`     ${camp.description}`)
    })
  })

  console.log('\n📋 Checking existing authors...\n')

  const { data: authors, error: authError } = await supabase
    .from('authors')
    .select('id, name')
    .order('name')
    .limit(10)

  if (authError) {
    console.error('❌ Error:', authError)
    return
  }

  console.log(`Found ${authors.length} authors (showing first 10):\n`)
  authors.forEach(author => {
    console.log(`  - ${author.name}`)
  })
}

main()
