import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const { data, error } = await supabase
  .from('camps')
  .select('domain_id, code, label, description')
  .eq('domain_id', 3)
  .order('label')

if (error) {
  console.error(error)
} else {
  console.log('🏢 Enterprise AI Adoption camps in production database:\n')
  data.forEach(camp => {
    console.log(`  ${camp.code}`)
    console.log(`    Label: ${camp.label}`)
    console.log(`    Desc: ${camp.description}\n`)
  })
  console.log(`Total: ${data.length} camps in Enterprise AI Adoption domain`)
}
