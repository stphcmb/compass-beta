// Get all camp IDs for reference
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

async function getCamps() {
  const { data: camps } = await supabase
    .from('camps')
    .select('id, domain_id, code, label')
    .order('domain_id')

  console.log('CAMP IDs FOR REFERENCE')
  console.log('='.repeat(80))
  camps?.forEach(c => {
    console.log(`${c.label.padEnd(30)} | ${c.code.padEnd(35)} | ${c.id}`)
  })
}

getCamps()
