import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function fillGaps() {
  console.log('🔧 Filling data gaps...\n')

  // Get all camps and authors
  const { data: camps } = await supabase.from('camps').select('id, name')
  const { data: authors } = await supabase.from('authors').select('id, name')

  if (!camps || !authors) {
    console.error('Failed to fetch camps or authors')
    return
  }

  const getCampId = (name: string) => camps.find(c => c.name === name)?.id
  const getAuthorIds = (names: string[]) =>
    names.map(name => authors.find(a => a.name === name)?.id).filter(Boolean)

  const newRelationships: any[] = []

  // Human-Centric (Business) - augmentation focused
  getAuthorIds(['Satya Nadella', 'Ethan Mollick', 'Fei-Fei Li', 'Allie K. Miller']).forEach(authorId => {
    newRelationships.push({
      camp_id: getCampId('Human-Centric'),
      author_id: authorId,
      why_it_matters: 'Advocates for human-centered AI adoption in business',
      relevance: 'strong'
    })
  })

  // Adaptive Governance (Policy & Regulation)
  getAuthorIds(['Demis Hassabis', 'Mustafa Suleyman', 'Fei-Fei Li', 'Sundar Pichai']).forEach(authorId => {
    newRelationships.push({
      camp_id: getCampId('Adaptive Governance'),
      author_id: authorId,
      why_it_matters: 'Supports balanced, adaptive regulatory approaches',
      relevance: 'strong'
    })
  })

  // Regulatory Advocates (Policy & Regulation) - rename existing or map
  getAuthorIds(['Sam Harris', 'Max Tegmark', 'Geoffrey Hinton']).forEach(authorId => {
    newRelationships.push({
      camp_id: getCampId('Regulatory Advocates'),
      author_id: authorId,
      why_it_matters: 'Advocates for regulatory oversight',
      relevance: 'strong'
    })
  })

  // Tech Realists (Society)
  getAuthorIds(['Ben Thompson', 'Azeem Azhar', 'Jason Lemkin', 'Andrej Karpathy']).forEach(authorId => {
    newRelationships.push({
      camp_id: getCampId('Tech Realists'),
      author_id: authorId,
      why_it_matters: 'Practical, balanced view on AI societal impacts',
      relevance: 'strong'
    })
  })

  // Tech Utopians (Society)
  getAuthorIds(['Marc Andreessen', 'Balaji Srinivasan', 'Reid Hoffman', 'Sam Altman']).forEach(authorId => {
    newRelationships.push({
      camp_id: getCampId('Tech Utopians'),
      author_id: authorId,
      why_it_matters: 'Optimistic about AI transforming society positively',
      relevance: 'strong'
    })
  })

  // Capabilities Realist with Safety Focus (Technology)
  getAuthorIds(['Dario Amodei', 'Ilya Sutskever', 'Yoshua Bengio', 'Geoffrey Hinton']).forEach(authorId => {
    newRelationships.push({
      camp_id: getCampId('Capabilities Realist with Safety Focus'),
      author_id: authorId,
      why_it_matters: 'Acknowledges capabilities while prioritizing safety',
      relevance: 'strong'
    })
  })

  // Technology Optimists (Technology)
  getAuthorIds(['Jensen Huang', 'Sundar Pichai', 'Andrew Ng', 'Clement Delangue']).forEach(authorId => {
    newRelationships.push({
      camp_id: getCampId('Technology Optimists'),
      author_id: authorId,
      why_it_matters: 'Optimistic about technology advancement',
      relevance: 'strong'
    })
  })

  // Displacement Realists (Workers)
  getAuthorIds(['Erik Brynjolfsson', 'Gary Marcus', 'Emily M. Bender']).forEach(authorId => {
    newRelationships.push({
      camp_id: getCampId('Displacement Realists'),
      author_id: authorId,
      why_it_matters: 'Acknowledges labor displacement risks',
      relevance: 'strong'
    })
  })

  console.log(`📊 Adding ${newRelationships.length} new relationships...\n`)

  // Filter out any relationships that might already exist or have undefined IDs
  const validRelationships = newRelationships.filter(
    rel => rel.camp_id && rel.author_id
  )

  if (validRelationships.length === 0) {
    console.log('⚠️  No valid relationships to add')
    return
  }

  // Insert in batches to avoid duplicates
  let addedCount = 0
  let skippedCount = 0

  for (const rel of validRelationships) {
    const { error } = await supabase
      .from('camp_authors')
      .insert(rel)

    if (error) {
      if (error.code === '23505') {
        // Duplicate key - skip
        skippedCount++
      } else {
        console.error('Error inserting:', error.message)
      }
    } else {
      addedCount++
    }
  }

  console.log(`✅ Added ${addedCount} new relationships`)
  console.log(`⏭️  Skipped ${skippedCount} duplicates\n`)

  // Verify results
  console.log('🔍 Verifying coverage...\n')

  const { data: updatedCamps } = await supabase
    .from('camps')
    .select(`
      name,
      domain,
      camp_authors (count)
    `)
    .order('domain', { ascending: true })
    .order('name', { ascending: true })

  const byDomain: Record<string, any[]> = {}

  updatedCamps?.forEach(camp => {
    const domain = camp.domain || 'Unknown'
    if (!byDomain[domain]) {
      byDomain[domain] = []
    }
    byDomain[domain].push(camp)
  })

  Object.entries(byDomain).forEach(([domain, domainCamps]) => {
    const emptyCamps = domainCamps.filter((c: any) => c.camp_authors?.[0]?.count === 0).length
    const icon = emptyCamps === 0 ? '✅' : '⚠️'
    console.log(`${icon} ${domain}: ${domainCamps.length - emptyCamps}/${domainCamps.length} camps have authors`)
  })

  console.log('\n✨ Gap filling complete!\n')
}

fillGaps()
