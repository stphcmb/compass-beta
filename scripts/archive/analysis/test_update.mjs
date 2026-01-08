import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env.local
dotenv.config({ path: join(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testUpdate() {
  console.log('🔍 Testing database update...\n')

  try {
    const testId = '4ebe46dc-05b5-49ce-8894-f2c42ff33c7f'
    const testQuote = 'The problem is not that AI systems will become malevolent. It\'s that they will become extremely competent at achieving goals that are not aligned with ours. We need to solve the control problem before advanced AI systems are deployed.'
    const testUrl = 'https://www.amazon.com/Human-Compatible-Artificial-Intelligence-Problem/dp/0525558616'

    const { data, error } = await supabase
      .from('camp_authors')
      .update({
        key_quote: testQuote,
        quote_source_url: testUrl
      })
      .eq('id', testId)
      .select('*, authors(name), camps(label)')

    if (error) {
      console.log('❌ Error:', error)
    } else {
      console.log('✅ Update successful!')
      console.log('Updated record:', JSON.stringify(data, null, 2))
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

testUpdate()
