import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function getCampId(campLabel) {
  const { data, error } = await supabase
    .from('camps')
    .select('id')
    .eq('label', campLabel)
    .single()

  if (error) throw new Error(`Camp not found: ${campLabel}`)
  return data.id
}

async function getAuthorIds(authorNames) {
  const { data, error } = await supabase
    .from('authors')
    .select('id, name')
    .in('name', authorNames)

  if (error) throw error
  return data
}

async function addCampAuthors(campName, authorNames, relevance) {
  try {
    const campId = await getCampId(campName)
    const authors = await getAuthorIds(authorNames)

    console.log(`\n📍 ${campName} (${relevance})`)
    console.log(`   Adding ${authors.length} authors...`)

    for (const author of authors) {
      const { error } = await supabase
        .from('camp_authors')
        .insert({
          camp_id: campId,
          author_id: author.id,
          relevance: relevance
        })

      if (error) {
        // Check if it's a duplicate
        if (error.code === '23505') {
          console.log(`   ⚠️  ${author.name} - already exists, skipping`)
        } else {
          console.error(`   ❌ ${author.name} - Error: ${error.message}`)
        }
      } else {
        console.log(`   ✅ ${author.name}`)
      }
    }
  } catch (error) {
    console.error(`❌ Error processing ${campName}:`, error.message)
  }
}

async function main() {
  console.log('🚀 Adding challenging and emerging perspectives to database...\n')

  // Challenging perspectives
  console.log('=== CHALLENGING PERSPECTIVES ===')

  await addCampAuthors(
    'Scaling Maximalist',
    ['Gary Marcus', 'Yann LeCun', 'Emily M. Bender', 'Timnit Gebru'],
    'challenges'
  )

  await addCampAuthors(
    'Grounding Realist',
    ['Sam Altman', 'Dario Amodei', 'Marc Andreessen'],
    'challenges'
  )

  await addCampAuthors(
    'Tech Utopian',
    ['Emily M. Bender', 'Timnit Gebru', 'Kate Crawford', 'Geoffrey Hinton'],
    'challenges'
  )

  await addCampAuthors(
    'Ethical Steward',
    ['Marc Andreessen', 'Balaji Srinivasan', 'Mark Zuckerberg'],
    'challenges'
  )

  await addCampAuthors(
    'Tech First',
    ['Ethan Mollick', 'Erik Brynjolfsson', 'Fei-Fei Li'],
    'challenges'
  )

  await addCampAuthors(
    'Human–AI Collaboration',
    ['Azeem Azhar', 'Gary Marcus'],
    'challenges'
  )

  await addCampAuthors(
    'Displacement Realist',
    ['Andrew Ng', 'Satya Nadella'],
    'challenges'
  )

  await addCampAuthors(
    'Regulatory Interventionist',
    ['Marc Andreessen', 'Balaji Srinivasan', 'Mark Zuckerberg'],
    'challenges'
  )

  await addCampAuthors(
    'Innovation First',
    ['Max Tegmark', 'Geoffrey Hinton', 'Yoshua Bengio', 'Sam Harris', 'Emily M. Bender'],
    'challenges'
  )

  // Emerging perspectives
  console.log('\n=== EMERGING PERSPECTIVES ===')

  await addCampAuthors(
    'Grounding Realist',
    ['Ilya Sutskever', 'Yann LeCun'],
    'emerging'
  )

  await addCampAuthors(
    'Adaptive Governance',
    ['Mustafa Suleyman', 'Elon Musk'],
    'emerging'
  )

  await addCampAuthors(
    'Tech Utopian',
    ['Andrej Karpathy'],
    'emerging'
  )

  console.log('\n🎉 Done! Check your app to see the updated "Challenge Your View" and "Emerging Views" cards.')
}

main().catch(console.error)
