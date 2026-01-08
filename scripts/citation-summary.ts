// Citation verification summary
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

async function getSummary() {
  const { data } = await supabase
    .from('camp_authors')
    .select('citation_status, quote_source_url')

  const stats = { valid: 0, broken: 0, timeout: 0, unchecked: 0, noUrl: 0, total: data?.length || 0 }

  data?.forEach(row => {
    if (!row.quote_source_url) {
      stats.noUrl++
    } else if (row.citation_status === 'valid') {
      stats.valid++
    } else if (row.citation_status === 'broken') {
      stats.broken++
    } else if (row.citation_status === 'timeout') {
      stats.timeout++
    } else {
      stats.unchecked++
    }
  })

  console.log('='.repeat(50))
  console.log('CITATION VERIFICATION SUMMARY')
  console.log('='.repeat(50))
  console.log(`✅ Valid:      ${stats.valid}`)
  console.log(`❌ Broken:     ${stats.broken}`)
  console.log(`⏱️  Timeout:    ${stats.timeout}`)
  console.log(`❓ Unchecked:  ${stats.unchecked}`)
  console.log(`📭 No URL:     ${stats.noUrl}`)
  console.log('─'.repeat(50))
  console.log(`📊 Total:      ${stats.total}`)
  console.log()

  const verified = stats.valid + stats.broken + stats.timeout
  const withUrl = stats.total - stats.noUrl
  console.log(`Verification rate: ${((verified / withUrl) * 100).toFixed(1)}%`)
  console.log(`Link health: ${((stats.valid / verified) * 100).toFixed(1)}% valid`)
}

getSummary().catch(console.error)
