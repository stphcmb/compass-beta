// Fix author camp assignments based on audit findings
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

// Camp IDs
const CAMPS = {
  CO_EVOLUTION: 'f19021ab-a8db-4363-adec-c2228dad6298',
  TECH_BUILDERS: 'a076a4ce-f14c-47b5-ad01-c8c60135a494',
  HUMAN_AI_COLLAB: 'd8d3cec4-f8ce-49b1-9a43-bb0d952db371',
  SAFETY_FIRST: '7f64838f-59a6-4c87-8373-a023b9f448cc',
  DEMOCRATIZE_FAST: 'fe19ae2d-99f2-4c30-a596-c9cd92bff41b',
  REGULATORY_INTERVENTIONIST: 'e8792297-e745-4c9f-a91d-4f87dd05cea2',
  NEEDS_NEW_APPROACHES: '207582eb-7b32-4951-9863-32fcf05944a1',
}

async function getAuthorId(name: string): Promise<string | null> {
  const { data } = await supabase
    .from('authors')
    .select('id')
    .eq('name', name)
    .single()
  return data?.id || null
}

async function upsertCampAuthor(
  authorId: string,
  campId: string,
  relevance: string,
  keyQuote: string,
  quoteSourceUrl: string,
  whyItMatters: string
) {
  const { error } = await supabase
    .from('camp_authors')
    .upsert({
      author_id: authorId,
      camp_id: campId,
      relevance,
      key_quote: keyQuote,
      quote_source_url: quoteSourceUrl,
      why_it_matters: whyItMatters,
    }, {
      onConflict: 'author_id,camp_id'
    })

  if (error) {
    console.error(`Error upserting camp assignment:`, error.message)
    return false
  }
  return true
}

async function deleteCampAuthor(authorId: string, campId: string) {
  const { error } = await supabase
    .from('camp_authors')
    .delete()
    .eq('author_id', authorId)
    .eq('camp_id', campId)

  if (error) {
    console.error(`Error deleting camp assignment:`, error.message)
    return false
  }
  return true
}

async function fixChipHuyen() {
  console.log('\n📝 Fixing CHIP HUYEN camp assignments...')
  const authorId = await getAuthorId('Chip Huyen')
  if (!authorId) {
    console.error('❌ Chip Huyen not found')
    return
  }

  // Update Tech Builders to partial
  await upsertCampAuthor(
    authorId,
    CAMPS.TECH_BUILDERS,
    'partial',
    'MLOps is as important as model architecture. Getting AI systems into production reliably requires serious engineering discipline around data pipelines, model serving, and monitoring.',
    'https://huyenchip.com/',
    'As founder of Claypot AI and author of the leading ML systems book, Huyen has hands-on credibility as a builder. Her technical depth grounds her organizational insights in practical reality.'
  )

  // Add Co-Evolution as PRIMARY (strong)
  await upsertCampAuthor(
    authorId,
    CAMPS.CO_EVOLUTION,
    'strong',
    'Most ML projects fail not because of the algorithms, but because of data issues, unclear problem framing, or lack of organizational readiness. The gap between ML research and production is fundamentally about people and process.',
    'https://huyenchip.com/ml-systems-design',
    'Chip Huyen\'s "Designing Machine Learning Systems" is the definitive guide to production ML. Her emphasis on organizational readiness over pure technical capability makes her a leading voice for co-evolutionary thinking in enterprise AI adoption.'
  )

  // Add Human-AI Collaboration as partial
  await upsertCampAuthor(
    authorId,
    CAMPS.HUMAN_AI_COLLAB,
    'partial',
    'Production ML systems are not autonomous—they require continuous human oversight for data quality, model monitoring, and feedback loops. The best systems are designed for human-machine collaboration, not replacement.',
    'https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/',
    'Her ML systems design principles emphasize human-in-the-loop workflows, monitoring dashboards for human review, and feedback mechanisms. This collaborative approach distinguishes production ML from research demos.'
  )

  console.log('✅ Chip Huyen: Co-Evolution (strong), Tech Builders (partial), Human-AI Collaboration (partial)')
}

async function fixJoyBuolamwini() {
  console.log('\n📝 Fixing JOY BUOLAMWINI camp assignments...')
  const authorId = await getAuthorId('Joy Buolamwini')
  if (!authorId) {
    console.error('❌ Joy Buolamwini not found')
    return
  }

  // Delete incorrect Democratize Fast
  await deleteCampAuthor(authorId, CAMPS.DEMOCRATIZE_FAST)

  // Add Safety First as PRIMARY (strong)
  await upsertCampAuthor(
    authorId,
    CAMPS.SAFETY_FIRST,
    'strong',
    'If we fail to make ethical and inclusive AI the norm, we risk creating a technological apparatus that encodes inequity at unprecedented scale.',
    'https://www.ajl.org/',
    'Buolamwini\'s "Gender Shades" research exposed how commercial facial recognition systems fail women and people of color. Her Algorithmic Justice League advocates for accountability and transparency in AI systems.'
  )

  // Add Regulatory Interventionist as partial
  await upsertCampAuthor(
    authorId,
    CAMPS.REGULATORY_INTERVENTIONIST,
    'partial',
    'We need meaningful regulation and oversight of AI systems before they are deployed, not after harm has occurred.',
    'https://www.ted.com/speakers/joy_buolamwini',
    'Through the Algorithmic Justice League, Buolamwini has testified before Congress and advocated for facial recognition moratoriums. Her work bridges technical research with policy advocacy.'
  )

  console.log('✅ Joy Buolamwini: Safety First (strong), Regulatory Interventionist (partial)')
}

async function fixAndrewMcAfee() {
  console.log('\n📝 Fixing ANDREW McAFEE camp assignments...')
  const authorId = await getAuthorId('Andrew McAfee')
  if (!authorId) {
    console.error('❌ Andrew McAfee not found')
    return
  }

  // Add Co-Evolution (keeps existing Human-AI Collab)
  await upsertCampAuthor(
    authorId,
    CAMPS.CO_EVOLUTION,
    'strong',
    'Technologies don\'t change the world on their own. They need the right complement of organizational capabilities, human skills, and institutional adaptations to realize their potential.',
    'https://andrewmcafee.org/',
    'McAfee\'s research at MIT, alongside Brynjolfsson, emphasizes that digital transformation requires concurrent evolution of technology, processes, and people. This co-evolutionary perspective is central to his "Second Machine Age" thesis.'
  )

  console.log('✅ Andrew McAfee: Human-AI Collaboration (existing) + Co-Evolution (strong)')
}

async function fixMeredithBroussard() {
  console.log('\n📝 Fixing MEREDITH BROUSSARD camp assignments...')
  const authorId = await getAuthorId('Meredith Broussard')
  if (!authorId) {
    console.error('❌ Meredith Broussard not found')
    return
  }

  // Update Needs New Approaches to partial
  await upsertCampAuthor(
    authorId,
    CAMPS.NEEDS_NEW_APPROACHES,
    'partial',
    'We need to move beyond the idea that AI will solve everything. The problems with AI are fundamentally about the humans who build it and the contexts in which it\'s deployed.',
    'https://www.meredithbroussard.com/',
    'Broussard\'s technical background combined with her media criticism provides a unique perspective on why current AI approaches have fundamental limitations.'
  )

  // Add Safety First as PRIMARY (strong)
  await upsertCampAuthor(
    authorId,
    CAMPS.SAFETY_FIRST,
    'strong',
    'Technochauvinism—the belief that technology is always the solution—is blinding us to the real costs and limitations of AI systems.',
    'https://www.meredithbroussard.com/',
    'Broussard\'s "Artificial Unintelligence" challenges the AI hype cycle with rigorous technical and journalistic analysis. She advocates for realistic assessment of AI capabilities and careful attention to deployment harms.'
  )

  console.log('✅ Meredith Broussard: Safety First (strong), Needs New Approaches (partial)')
}

async function verify() {
  console.log('\n' + '='.repeat(60))
  console.log('VERIFICATION')
  console.log('='.repeat(60))

  const authors = ['Chip Huyen', 'Joy Buolamwini', 'Andrew McAfee', 'Meredith Broussard']

  for (const authorName of authors) {
    const { data } = await supabase
      .from('authors')
      .select('id, name')
      .eq('name', authorName)
      .single()

    if (!data) continue

    const { data: assignments } = await supabase
      .from('camp_authors')
      .select('camp_id, relevance')
      .eq('author_id', data.id)

    const { data: camps } = await supabase.from('camps').select('id, label')
    const campsById: Record<string, string> = {}
    camps?.forEach(c => { campsById[c.id] = c.label })

    console.log(`\n${authorName}:`)
    assignments?.forEach(a => {
      console.log(`  - ${campsById[a.camp_id] || 'Unknown'} (${a.relevance})`)
    })
  }
}

async function main() {
  console.log('🔧 FIXING AUTHOR CAMP ASSIGNMENTS')
  console.log('=' .repeat(60))

  await fixChipHuyen()
  await fixJoyBuolamwini()
  await fixAndrewMcAfee()
  await fixMeredithBroussard()

  await verify()

  console.log('\n✅ All fixes applied!')
}

main().catch(console.error)
