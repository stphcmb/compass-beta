import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env.local
dotenv.config({ path: join(__dirname, '../.env.local') })

// Use service role key for database writes (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function applyQuotes() {
  console.log('📝 Applying missing quotes to database...\n')

  try {
    // Read the SQL file
    const sqlFile = join(__dirname, '../Docs/data/enrichment/ADD_MISSING_QUOTES_2025.sql')
    const sqlContent = readFileSync(sqlFile, 'utf8')

    // Extract all UPDATE statements (they span multiple lines)
    const updatePattern = /UPDATE camp_authors\s+SET[^;]+;/gs
    const updateStatements = sqlContent.match(updatePattern) || []

    console.log(`Found ${updateStatements.length} UPDATE statements to execute\n`)

    let successCount = 0
    let errorCount = 0

    for (const [index, statement] of updateStatements.entries()) {
      try {
        // Extract the ID from the WHERE clause
        const idMatch = statement.match(/WHERE id = '([^']+)'/)
        if (!idMatch) {
          console.log(`⚠️  Skipping statement ${index + 1}: Could not extract ID`)
          continue
        }

        const id = idMatch[1]

        // Extract key_quote
        const quoteMatch = statement.match(/key_quote = '((?:[^']|'')+)'/)
        if (!quoteMatch) {
          console.log(`⚠️  Skipping statement ${index + 1}: Could not extract quote`)
          continue
        }
        const keyQuote = quoteMatch[1].replace(/''/g, "'") // Unescape single quotes

        // Extract quote_source_url
        const urlMatch = statement.match(/quote_source_url = '([^']+)'/)
        if (!urlMatch) {
          console.log(`⚠️  Skipping statement ${index + 1}: Could not extract URL`)
          continue
        }
        const quoteSourceUrl = urlMatch[1]

        // Perform the update using Supabase
        const { data, error } = await supabase
          .from('camp_authors')
          .update({
            key_quote: keyQuote,
            quote_source_url: quoteSourceUrl
          })
          .eq('id', id)
          .select('*, authors(name), camps(label)')

        if (error) {
          console.log(`❌ Error updating ${id}:`, error.message)
          errorCount++
        } else if (data && data.length > 0) {
          console.log(`✅ Updated: ${data[0].authors?.name} → ${data[0].camps?.label}`)
          successCount++
        } else {
          console.log(`⚠️  No record found for ID: ${id}`)
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))

      } catch (err) {
        console.log(`❌ Error processing statement ${index + 1}:`, err.message)
        errorCount++
      }
    }

    console.log('\n' + '='.repeat(80))
    console.log(`\n📈 Summary:`)
    console.log(`  ✅ Successfully updated: ${successCount}`)
    console.log(`  ❌ Errors: ${errorCount}`)
    console.log(`  📊 Total statements: ${updateStatements.length}`)

  } catch (error) {
    console.error('Error:', error)
  }
}

applyQuotes()
