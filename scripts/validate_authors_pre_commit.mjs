#!/usr/bin/env node
/**
 * Pre-commit validation for author data
 *
 * Usage: Add to .git/hooks/pre-commit or run manually:
 *   node scripts/validate_authors_pre_commit.mjs
 *
 * Returns exit code 1 if validation fails (blocking commit)
 * Returns exit code 0 if validation passes (allowing commit)
 */

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

async function validateAuthors() {
  console.log('🔍 Running pre-commit validation for author data...\n')

  let hasErrors = false

  try {
    // 1. Check for authors missing camp relationships
    console.log('📋 Checking for authors without camps...')

    // Get all authors
    const { data: allAuthors } = await supabase
      .from('authors')
      .select('id, name')

    // Get all authors with camps
    const { data: campsData } = await supabase
      .from('camp_authors')
      .select('author_id')

    const authorsWithCampsIds = new Set(campsData?.map(ca => ca.author_id) || [])
    const authorsWithoutCamps = allAuthors?.filter(a => !authorsWithCampsIds.has(a.id)) || []

    if (authorsWithoutCamps && authorsWithoutCamps.length > 0) {
      console.log(`❌ Found ${authorsWithoutCamps.length} authors without camp relationships:`)
      authorsWithoutCamps.forEach(a => console.log(`   - ${a.name}`))
      hasErrors = true
    } else {
      console.log('✅ All authors have camp relationships')
    }

    // 2. Check for missing quotes
    console.log('\n📋 Checking for missing quotes...')
    const { data: campAuthors, error: error2 } = await supabase
      .from('camp_authors')
      .select(`
        id,
        key_quote,
        quote_source_url,
        authors (name),
        camps (label)
      `)
      .or('key_quote.is.null,quote_source_url.is.null')

    if (campAuthors && campAuthors.length > 0) {
      console.log(`❌ Found ${campAuthors.length} camp relationships missing quotes:`)
      campAuthors.forEach(ca => {
        const missing = []
        if (!ca.key_quote) missing.push('quote')
        if (!ca.quote_source_url) missing.push('source URL')
        console.log(`   - ${ca.authors?.name} → ${ca.camps?.label} (missing: ${missing.join(', ')})`)
      })
      hasErrors = true
    } else {
      console.log('✅ All camp relationships have quotes')
    }

    // 3. Check for authors with insufficient sources
    console.log('\n📋 Checking for authors with < 3 sources...')
    const { data: authorsWithFewSources, error: error3 } = await supabase
      .from('authors')
      .select('name, sources')
      .or('sources.is.null')

    const insufficientSources = authorsWithFewSources?.filter(a => {
      if (!a.sources) return true
      const sourceCount = Array.isArray(a.sources) ? a.sources.length : 0
      return sourceCount < 3
    }) || []

    if (insufficientSources.length > 0) {
      console.log(`⚠️  Found ${insufficientSources.length} authors with < 3 sources:`)
      insufficientSources.forEach(a => {
        const count = a.sources ? (Array.isArray(a.sources) ? a.sources.length : 0) : 0
        console.log(`   - ${a.name} (has ${count} sources, needs 3)`)
      })
      console.log('   Note: This is a warning, not blocking commit')
    } else {
      console.log('✅ All authors have at least 3 sources')
    }

    // 4. Check for duplicate sources
    console.log('\n📋 Checking for duplicate sources...')
    const { data: allAuthorsWithSources } = await supabase
      .from('authors')
      .select('id, name, sources')
      .not('sources', 'is', null)

    const authorsWithDuplicates = []

    allAuthorsWithSources?.forEach(author => {
      const sources = author.sources || []
      if (!Array.isArray(sources) || sources.length === 0) return

      // Check for duplicate URLs
      const urlCounts = {}
      sources.forEach(source => {
        if (!source.url) return
        const normalizedUrl = source.url.toLowerCase().trim()
        urlCounts[normalizedUrl] = (urlCounts[normalizedUrl] || 0) + 1
      })

      const hasDuplicates = Object.values(urlCounts).some(count => count > 1)

      if (hasDuplicates) {
        const duplicateUrls = Object.entries(urlCounts)
          .filter(([_, count]) => count > 1)
          .map(([url]) => url)

        authorsWithDuplicates.push({
          name: author.name,
          duplicates: duplicateUrls
        })
      }
    })

    if (authorsWithDuplicates.length > 0) {
      console.log(`❌ Found ${authorsWithDuplicates.length} authors with duplicate sources:`)
      authorsWithDuplicates.slice(0, 10).forEach(a => {
        console.log(`   - ${a.name} (${a.duplicates.length} duplicate URLs)`)
      })
      if (authorsWithDuplicates.length > 10) {
        console.log(`   ... and ${authorsWithDuplicates.length - 10} more`)
      }
      hasErrors = true
    } else {
      console.log('✅ No duplicate sources found')
    }

    // Summary
    console.log('\n' + '='.repeat(80))
    if (hasErrors) {
      console.log('\n❌ VALIDATION FAILED')
      console.log('\n🚨 Please fix the errors above before committing.')
      console.log('\nQuick fixes:')
      console.log('  1. Add missing quotes: Update camp_authors with key_quote and quote_source_url')
      console.log('  2. Add camp relationships: Insert into camp_authors for authors without camps')
      console.log('  3. Run: node scripts/find_missing_quotes.mjs for detailed quote gaps')
      console.log('\n' + '='.repeat(80))
      process.exit(1)
    } else {
      console.log('\n✅ VALIDATION PASSED')
      console.log('\nAll author data is complete and ready to commit!')
      if (insufficientSources.length > 0) {
        console.log(`\n⚠️  ${insufficientSources.length} author(s) have < 3 sources (recommended to fix)`)
      }
      console.log('\n' + '='.repeat(80))
      process.exit(0)
    }

  } catch (error) {
    console.error('\n❌ Validation error:', error)
    console.log('\n🚨 Could not complete validation. Please check your database connection.')
    process.exit(1)
  }
}

validateAuthors()
