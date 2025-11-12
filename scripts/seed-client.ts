import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  try {
    console.log('🔌 Connecting to Supabase...\n')

    // 1. Insert Camps
    console.log('📊 Inserting camps...')
    const { error: campsError } = await supabase.from('camps').insert([
      { name: 'Scaling Maximalists', domain: 'Technology', position_summary: 'Aggressive scaling of models/compute as primary path to progress' },
      { name: 'Grounding Realists', domain: 'Technology', position_summary: 'Skeptical of pure scaling; emphasize new architectures/world models' },
      { name: 'Capabilities Realist with Safety Focus', domain: 'Technology', position_summary: 'Progress acknowledged with explicit safety emphasis' },
      { name: 'Tech Utopians', domain: 'Society', position_summary: 'Optimistic on AI societal outcomes with minimal focus on harms' },
      { name: 'Tech Realists', domain: 'Society', position_summary: 'Balanced societal view; practical focus on near-term realities' },
      { name: 'Ethical Stewards', domain: 'Society', position_summary: 'Prioritize harms, ethics, and societal impacts of AI' },
      { name: 'Tech-First', domain: 'Business', position_summary: 'Enterprise adoption led by technology and infrastructure scaling' },
      { name: 'Human-Centric', domain: 'Business', position_summary: 'Enterprise adoption centered on augmentation and people/process' },
      { name: 'Platform/Ecosystem', domain: 'Business', position_summary: 'Ecosystem builders and open platform advocates' },
      { name: 'Human-AI Collaboration', domain: 'Workers', position_summary: 'Partnership model between humans and AI in work' },
      { name: 'Displacement Realists', domain: 'Workers', position_summary: 'Expect significant near-term displacement and disruption of labor' },
      { name: 'Regulatory Interventionists', domain: 'Policy & Regulation', position_summary: 'Advocate strong regulation and guardrails' },
      { name: 'Innovation-First', domain: 'Policy & Regulation', position_summary: 'Prefer light-touch regulation; prioritize innovation' },
      { name: 'Adaptive Governance', domain: 'Policy & Regulation', position_summary: 'Balanced, adaptive, international governance approaches' }
    ]).select()

    if (campsError && !campsError.message.includes('duplicate')) {
      throw campsError
    }
    console.log('  ✓ Camps inserted\n')

    // 2. Insert Authors
    console.log('📊 Inserting authors...')
    const { error: authorsError } = await supabase.from('authors').insert([
      { name: 'Sam Altman', affiliation: 'OpenAI', credibility_tier: 'Thought Leader', author_type: 'Industry Leader', position_summary: 'Aggressive AGI optimist; rapid scaling and deployment; safety via iteration' },
      { name: 'Dario Amodei', affiliation: 'Anthropic', credibility_tier: 'Seminal Thinker', author_type: 'Industry Leader', position_summary: 'Safety-focused scaling; dramatic upside and risks; transparent risk policies' },
      { name: 'Ilya Sutskever', affiliation: 'Safe Superintelligence Inc.', credibility_tier: 'Seminal Thinker', author_type: 'Academic', position_summary: 'Monk-mode safety focus; beyond scaling; agentic systems need new paradigms' },
      { name: 'Geoffrey Hinton', affiliation: 'University of Toronto', credibility_tier: 'Seminal Thinker', author_type: 'Academic/Practitioner', position_summary: 'Leading safety advocate; non-trivial extinction risk; compute for safety research' },
      { name: 'Yann LeCun', affiliation: 'Meta / NYU', credibility_tier: 'Seminal Thinker', author_type: 'Industry Leader', position_summary: 'LLMs near end; world models/JEPA next; strong open-source advocate' },
      { name: 'Yoshua Bengio', affiliation: 'Université de Montréal / MILA', credibility_tier: 'Seminal Thinker', author_type: 'Academic', position_summary: 'International AI Safety Report; LawZero; goal misalignment concerns' },
      { name: 'Demis Hassabis', affiliation: 'Google DeepMind', credibility_tier: 'Seminal Thinker', author_type: 'Industry Leader', position_summary: 'AGI 5–10 years; radical abundance; dual risks; adaptive regulation' },
      { name: 'Jensen Huang', affiliation: 'NVIDIA', credibility_tier: 'Thought Leader', author_type: 'Industry Leader', position_summary: 'Accelerated computing; AI factories; physical AI next frontier' },
      { name: 'Satya Nadella', affiliation: 'Microsoft', credibility_tier: 'Thought Leader', author_type: 'Industry Leader', position_summary: 'Copilot philosophy; human augmentation; manage unintended consequences' },
      { name: 'Sundar Pichai', affiliation: 'Google/Alphabet', credibility_tier: 'Thought Leader', author_type: 'Industry Leader', position_summary: 'Gemini era; democratize AI; responsible innovation; move faster 2025' },
      { name: 'Mark Zuckerberg', affiliation: 'Meta', credibility_tier: 'Thought Leader', author_type: 'Industry Leader', position_summary: 'Open source AI as path forward; ecosystem and developer-first strategy' },
      { name: 'Emily M. Bender', affiliation: 'University of Washington', credibility_tier: 'Seminal Thinker', author_type: 'Academic', position_summary: 'Stochastic parrots critique; labor/environment costs; harms-first lens' },
      { name: 'Timnit Gebru', affiliation: 'DAIR', credibility_tier: 'Seminal Thinker', author_type: 'Academic', position_summary: 'Algorithmic bias leader; independent institute; systems-of-power critique' },
      { name: 'Kate Crawford', affiliation: 'USC / Microsoft Research', credibility_tier: 'Seminal Thinker', author_type: 'Academic', position_summary: 'Material infrastructure of AI; extraction, energy, hidden labor' },
      { name: 'Gary Marcus', affiliation: 'NYU Emeritus', credibility_tier: 'Thought Leader', author_type: 'Academic', position_summary: 'LLM limitations; neurosymbolic advocacy; near-term harms focus' },
      { name: 'Ethan Mollick', affiliation: 'Wharton', credibility_tier: 'Thought Leader', author_type: 'Academic/Practitioner', position_summary: 'Co-intelligence adoption; practical near-term transformation' },
      { name: 'Andrew Ng', affiliation: 'DeepLearning.AI / Stanford', credibility_tier: 'Seminal Thinker', author_type: 'Academic/Practitioner', position_summary: 'Democratization; agentic workflows; application-layer opportunity' },
      { name: 'Erik Brynjolfsson', affiliation: 'Stanford', credibility_tier: 'Seminal Thinker', author_type: 'Academic', position_summary: 'Productivity J-curve; skill leveling; task-based augmentation' },
      { name: 'Fei-Fei Li', affiliation: 'Stanford HAI', credibility_tier: 'Seminal Thinker', author_type: 'Academic/Practitioner', position_summary: 'Human-centered AI; policy on science not sci-fi; ecosystem diversity' },
      { name: 'Marc Andreessen', affiliation: 'Andreessen Horowitz', credibility_tier: 'Thought Leader', author_type: 'Practitioner', position_summary: 'Tech utopian; scaling maximalist; innovation-first governance' },
      { name: 'Reid Hoffman', affiliation: 'Greylock', credibility_tier: 'Thought Leader', author_type: 'Practitioner', position_summary: 'Pragmatic optimist; deployment-first with guardrails' },
      { name: 'Elon Musk', affiliation: 'xAI', credibility_tier: 'Thought Leader', author_type: 'Industry Leader', position_summary: 'Paradoxical: risk rhetoric with aggressive building; containment focus' },
      { name: 'Balaji Srinivasan', affiliation: 'Network State', credibility_tier: 'Thought Leader', author_type: 'Practitioner', position_summary: 'Institutional revolutionary; innovation-first, anti-state' },
      { name: 'Andrej Karpathy', affiliation: 'Eureka Labs', credibility_tier: 'Thought Leader', author_type: 'Academic/Practitioner', position_summary: 'Pragmatic realist; open science advocate; ~10y AGI view' },
      { name: 'Mustafa Suleyman', affiliation: 'Microsoft AI', credibility_tier: 'Thought Leader', author_type: 'Industry Leader', position_summary: 'Responsible accelerationist with containment focus' },
      { name: 'Clement Delangue', affiliation: 'Hugging Face', credibility_tier: 'Thought Leader', author_type: 'Industry Leader', position_summary: 'Open-source democratizer; platform enabler' },
      { name: 'Allie K. Miller', affiliation: 'Independent', credibility_tier: 'Thought Leader', author_type: 'Practitioner', position_summary: 'Practical enterprise implementation; balanced oversight' },
      { name: 'Ben Thompson', affiliation: 'Stratechery', credibility_tier: 'Thought Leader', author_type: 'Practitioner', position_summary: 'Platforms matter; incremental progress' },
      { name: 'Azeem Azhar', affiliation: 'Exponential View', credibility_tier: 'Thought Leader', author_type: 'Practitioner', position_summary: 'Transformation realist; steady adoption' },
      { name: 'Jason Lemkin', affiliation: 'SaaStr', credibility_tier: 'Thought Leader', author_type: 'Practitioner', position_summary: 'SaaS parity in 2025; pragmatic/incremental' },
      { name: 'Sam Harris', affiliation: 'Making Sense', credibility_tier: 'Thought Leader', author_type: 'Practitioner', position_summary: 'Alignment risk advocate; pro-regulation' },
      { name: 'Max Tegmark', affiliation: 'MIT/FLI', credibility_tier: 'Seminal Thinker', author_type: 'Academic', position_summary: 'Existential risk focus; strong regulation' }
    ]).select()

    if (authorsError && !authorsError.message.includes('duplicate')) {
      throw authorsError
    }
    console.log('  ✓ Authors inserted\n')

    // 3. Get camps and authors for relationships
    console.log('📊 Creating camp-author relationships...')
    const { data: camps } = await supabase.from('camps').select('id, name')
    const { data: authors } = await supabase.from('authors').select('id, name')

    if (!camps || !authors) {
      throw new Error('Failed to fetch camps or authors')
    }

    // Helper function to get IDs
    const getCampId = (name: string) => camps.find(c => c.name === name)?.id
    const getAuthorIds = (names: string[]) => names.map(name => authors.find(a => a.name === name)?.id).filter(Boolean)

    // Create relationships
    const relationships: any[] = []

    // Scaling Maximalists
    getAuthorIds(['Sam Altman', 'Dario Amodei', 'Jensen Huang', 'Mark Zuckerberg', 'Demis Hassabis']).forEach(authorId => {
      relationships.push({ camp_id: getCampId('Scaling Maximalists'), author_id: authorId, why_it_matters: 'Primary fit per taxonomy', relevance: 'strong' })
    })

    // Grounding Realists
    getAuthorIds(['Yann LeCun', 'Ilya Sutskever', 'Gary Marcus']).forEach(authorId => {
      relationships.push({ camp_id: getCampId('Grounding Realists'), author_id: authorId, why_it_matters: 'Primary fit per taxonomy', relevance: 'strong' })
    })

    // Ethical Stewards
    getAuthorIds(['Emily M. Bender', 'Timnit Gebru', 'Kate Crawford', 'Geoffrey Hinton', 'Yoshua Bengio']).forEach(authorId => {
      relationships.push({ camp_id: getCampId('Ethical Stewards'), author_id: authorId, why_it_matters: 'Primary fit per taxonomy', relevance: 'strong' })
    })

    // Human-AI Collaboration
    getAuthorIds(['Andrew Ng', 'Ethan Mollick', 'Erik Brynjolfsson', 'Satya Nadella', 'Fei-Fei Li']).forEach(authorId => {
      relationships.push({ camp_id: getCampId('Human-AI Collaboration'), author_id: authorId, why_it_matters: 'Primary fit per taxonomy', relevance: 'strong' })
    })

    // Tech-First
    getAuthorIds(['Jensen Huang', 'Sam Altman', 'Dario Amodei']).forEach(authorId => {
      relationships.push({ camp_id: getCampId('Tech-First'), author_id: authorId, why_it_matters: 'Primary fit per taxonomy', relevance: 'strong' })
    })

    // Platform/Ecosystem
    getAuthorIds(['Mark Zuckerberg', 'Clement Delangue']).forEach(authorId => {
      relationships.push({ camp_id: getCampId('Platform/Ecosystem'), author_id: authorId, why_it_matters: 'Primary fit per taxonomy', relevance: 'strong' })
    })

    // Regulatory Interventionists
    getAuthorIds(['Timnit Gebru', 'Emily M. Bender', 'Kate Crawford', 'Gary Marcus', 'Yoshua Bengio', 'Max Tegmark']).forEach(authorId => {
      relationships.push({ camp_id: getCampId('Regulatory Interventionists'), author_id: authorId, why_it_matters: 'Primary fit per taxonomy', relevance: 'strong' })
    })

    // Innovation-First
    getAuthorIds(['Marc Andreessen', 'Balaji Srinivasan', 'Reid Hoffman']).forEach(authorId => {
      relationships.push({ camp_id: getCampId('Innovation-First'), author_id: authorId, why_it_matters: 'Primary fit per taxonomy', relevance: 'strong' })
    })

    const { error: relError } = await supabase.from('camp_authors').insert(relationships)

    if (relError && !relError.message.includes('duplicate')) {
      throw relError
    }
    console.log('  ✓ Relationships created\n')

    // 4. Verify data
    console.log('🔍 Verifying data...')
    const { count: authorsCount } = await supabase.from('authors').select('*', { count: 'exact', head: true })
    const { count: campsCount } = await supabase.from('camps').select('*', { count: 'exact', head: true })
    const { count: relCount } = await supabase.from('camp_authors').select('*', { count: 'exact', head: true })

    console.log(`   ✓ Authors: ${authorsCount}`)
    console.log(`   ✓ Camps: ${campsCount}`)
    console.log(`   ✓ Camp-Author relationships: ${relCount}`)

    console.log('\n🎉 Database seeded successfully!')
    console.log('\n💡 Start your dev server to see the data:')
    console.log('   npm run dev\n')

  } catch (error: any) {
    console.error('❌ Error:', error.message)

    if (error.code === '23505') {
      console.log('\n💡 Data already exists. Tables have been populated!')
      console.log('   Start your dev server: npm run dev\n')
    } else if (error.code === '42P01') {
      console.log('\n💡 Tables don\'t exist yet. Please create the schema first:')
      console.log('   1. Go to Supabase Dashboard → SQL Editor')
      console.log('   2. Copy contents from: Docs/schema.sql')
      console.log('   3. Run the SQL, then run this script again\n')
    } else {
      process.exit(1)
    }
  }
}

seed()
