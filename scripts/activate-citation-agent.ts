// Activate Citation Agent - Run migration and trigger batch check
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env.local')
  console.log('\nTo activate manually:')
  console.log('1. Run the migration SQL in Supabase SQL Editor:')
  console.log('   Docs/database/migrations/001_citation_verification.sql')
  console.log('2. Then run: curl -X POST http://localhost:3000/api/citations/batch')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
})

async function runMigration() {
  console.log('🔧 Running citation status migration...\n')

  // Check if columns already exist
  const { data: existingCols } = await supabase.rpc('get_columns', {
    p_table: 'camp_authors',
    p_pattern: 'citation%'
  }).maybeSingle()

  // Try to add columns using raw SQL via rpc or just test if they exist
  const { data: testData, error: testError } = await supabase
    .from('camp_authors')
    .select('citation_status, citation_last_checked')
    .limit(1)

  if (testError && testError.message.includes('does not exist')) {
    console.log('⚠️  Citation columns do not exist yet.')
    console.log('\n📋 Please run this SQL in Supabase SQL Editor:\n')
    console.log(`
-- Add citation status columns to camp_authors
ALTER TABLE camp_authors
ADD COLUMN IF NOT EXISTS citation_status TEXT
DEFAULT 'unchecked'
CHECK (citation_status IN ('unchecked', 'valid', 'broken', 'timeout', 'checking'));

ALTER TABLE camp_authors
ADD COLUMN IF NOT EXISTS citation_last_checked TIMESTAMPTZ;

ALTER TABLE camp_authors
ADD COLUMN IF NOT EXISTS citation_http_status INTEGER;

ALTER TABLE camp_authors
ADD COLUMN IF NOT EXISTS citation_response_time_ms INTEGER;

CREATE INDEX IF NOT EXISTS idx_camp_authors_citation_status
ON camp_authors(citation_status);
`)
    return false
  }

  console.log('✅ Citation columns exist in database')
  return true
}

async function runBatchCheck() {
  console.log('\n🔍 Starting batch citation check...\n')

  // Get all camp_authors with URLs
  const { data: citations, error: fetchError } = await supabase
    .from('camp_authors')
    .select(`
      id,
      quote_source_url,
      citation_status,
      authors!inner (name),
      camps!inner (label)
    `)
    .not('quote_source_url', 'is', null)
    .or('citation_status.eq.unchecked,citation_status.is.null')
    .limit(100)

  if (fetchError) {
    console.error('❌ Error fetching citations:', fetchError.message)
    return
  }

  if (!citations || citations.length === 0) {
    console.log('✅ No unchecked citations found')
    return
  }

  console.log(`Found ${citations.length} citations to check\n`)

  let valid = 0, broken = 0, timeout = 0, error = 0
  const checkedAt = new Date().toISOString()

  for (let i = 0; i < citations.length; i++) {
    const citation = citations[i]
    const url = citation.quote_source_url
    const authorName = (citation.authors as any)?.name || 'Unknown'
    const campName = (citation.camps as any)?.label || 'Unknown'

    process.stdout.write(`[${i + 1}/${citations.length}] ${authorName} - ${campName}... `)

    if (!url || !url.startsWith('http')) {
      console.log('⏭️  Skipped (invalid URL)')
      continue
    }

    try {
      const startTime = Date.now()
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000)

      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; CompassBot/1.0)',
        },
        redirect: 'follow',
      })

      clearTimeout(timeoutId)
      const responseTimeMs = Date.now() - startTime

      // Try GET if HEAD not supported
      let finalStatus = response.status
      if (response.status === 405) {
        const getResponse = await fetch(url, {
          method: 'GET',
          signal: AbortSignal.timeout(8000),
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CompassBot/1.0)' },
          redirect: 'follow',
        })
        finalStatus = getResponse.status
      }

      const status = finalStatus >= 200 && finalStatus < 400 ? 'valid' : 'broken'

      await supabase
        .from('camp_authors')
        .update({
          citation_status: status,
          citation_last_checked: checkedAt,
          citation_http_status: finalStatus,
          citation_response_time_ms: responseTimeMs,
        })
        .eq('id', citation.id)

      if (status === 'valid') {
        valid++
        console.log(`✅ ${finalStatus} (${responseTimeMs}ms)`)
      } else {
        broken++
        console.log(`❌ ${finalStatus}`)
      }
    } catch (err: any) {
      const isTimeout = err.name === 'AbortError' || err.message?.includes('timeout')
      const status = isTimeout ? 'timeout' : 'broken'

      await supabase
        .from('camp_authors')
        .update({
          citation_status: status,
          citation_last_checked: checkedAt,
        })
        .eq('id', citation.id)

      if (isTimeout) {
        timeout++
        console.log('⏱️  Timeout')
      } else {
        error++
        console.log(`❌ Error: ${err.message?.slice(0, 50)}`)
      }
    }

    // Rate limit: 150ms between requests
    await new Promise(resolve => setTimeout(resolve, 150))
  }

  console.log('\n' + '='.repeat(50))
  console.log('CITATION CHECK COMPLETE')
  console.log('='.repeat(50))
  console.log(`✅ Valid:   ${valid}`)
  console.log(`❌ Broken:  ${broken}`)
  console.log(`⏱️  Timeout: ${timeout}`)
  console.log(`⚠️  Error:   ${error}`)
  console.log(`📊 Total:   ${citations.length}`)
}

async function main() {
  console.log('🚀 ACTIVATING CITATION VERIFICATION AGENT')
  console.log('='.repeat(50) + '\n')

  const migrationOk = await runMigration()

  if (migrationOk) {
    await runBatchCheck()
  }
}

main().catch(console.error)
