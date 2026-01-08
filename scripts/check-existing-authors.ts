// Check which trending AI authors already exist
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

const candidateAuthors = [
  // AI Agents
  'Harrison Chase',
  'Yohei Nakajima',
  'Jerry Liu',
  // AI Coding/DevTools
  'Amjad Masad',
  'Swyx',
  'Shawn Wang', // Swyx's real name
  // Open Source AI
  'Stella Biderman',
  'Clem Delangue',
  'Thomas Wolf',
  // AI Infrastructure
  'Matei Zaharia',
  'Ion Stoica',
  // Reasoning/Scaling Research
  'Hyung Won Chung',
  'Barret Zoph',
  'Quoc Le',
  // AI Safety Technical
  'Dan Hendrycks',
  'Jacob Steinhardt',
  // RAG/Vector DB
  'Edo Liberty',
  // Emerging Voices
  'Roon',
  'Nathan Lambert',
  'Sarah Catanzaro',
  'Lilian Weng',
]

async function check() {
  console.log('Checking existing authors...\n')

  const { data: existing } = await supabase
    .from('authors')
    .select('name, header_affiliation')
    .order('name')

  const existingNames = new Set(existing?.map(a => a.name.toLowerCase()) || [])

  console.log('ALREADY IN DATABASE:')
  candidateAuthors.forEach(name => {
    if (existingNames.has(name.toLowerCase())) {
      const author = existing?.find(a => a.name.toLowerCase() === name.toLowerCase())
      console.log(`  ✅ ${name} (${author?.header_affiliation})`)
    }
  })

  console.log('\nNOT IN DATABASE (candidates to add):')
  candidateAuthors.forEach(name => {
    if (!existingNames.has(name.toLowerCase())) {
      console.log(`  ➕ ${name}`)
    }
  })

  console.log(`\nTotal existing: ${existing?.length || 0}`)
}

check().catch(console.error)
