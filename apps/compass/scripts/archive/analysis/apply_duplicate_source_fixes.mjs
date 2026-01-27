#!/usr/bin/env node
/**
 * Apply duplicate source fixes from SQL file to Supabase
 *
 * Usage: node scripts/apply_duplicate_source_fixes.mjs
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env.local
dotenv.config({ path: join(__dirname, '../.env.local') })

// IMPORTANT: Use service role key for write operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function applyDuplicateSourceFixes() {
  console.log('🔄 Applying duplicate source fixes from SQL file...\n')

  try {
    // Read the SQL file
    const sqlFilePath = join(__dirname, '../Docs/data/enrichment/FIX_DUPLICATE_SOURCES_2025.sql')
    const sqlContent = readFileSync(sqlFilePath, 'utf-8')

    // Parse UPDATE statements
    const updatePattern = /UPDATE authors\s+SET sources = '(\[[\s\S]*?\])'::jsonb\s+WHERE id = '([a-f0-9-]+)';/gs
    const updates = []

    let match
    while ((match = updatePattern.exec(sqlContent)) !== null) {
      const [, sourcesJson, authorId] = match
      // Replace escaped quotes back to normal quotes
      const cleanedJson = sourcesJson.replace(/\\'/g, "'").replace(/''/g, "'")

      try {
        const sources = JSON.parse(cleanedJson)
        updates.push({ authorId, sources })
      } catch (e) {
        console.error(`⚠️  Failed to parse JSON for author ${authorId}:`, e.message)
      }
    }

    console.log(`Found ${updates.length} authors to update\n`)

    if (updates.length === 0) {
      console.log('❌ No UPDATE statements found in SQL file')
      return
    }

    // Apply each update
    let successCount = 0
    let errorCount = 0

    for (const { authorId, sources } of updates) {
      try {
        const { data, error } = await supabase
          .from('authors')
          .update({ sources })
          .eq('id', authorId)
          .select('name')
          .single()

        if (error) {
          console.error(`❌ Error updating ${authorId}:`, error.message)
          errorCount++
        } else if (data) {
          console.log(`✅ Updated ${data.name} (${sources.length} sources)`)
          successCount++
        } else {
          console.error(`⚠️  No record found for ID: ${authorId}`)
          errorCount++
        }
      } catch (error) {
        console.error(`❌ Exception updating ${authorId}:`, error.message)
        errorCount++
      }
    }

    // Summary
    console.log('\n' + '='.repeat(80))
    console.log(`\n✅ Successfully updated: ${successCount} authors`)
    if (errorCount > 0) {
      console.log(`❌ Failed updates: ${errorCount} authors`)
    }
    console.log('\n💡 Next step: Run "node scripts/find_duplicate_sources.mjs" to verify')
    console.log('='.repeat(80))

  } catch (error) {
    console.error('\n❌ Error:', error)
    process.exit(1)
  }
}

applyDuplicateSourceFixes()
