import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function seedNewTaxonomy() {
  console.log('🌱 Seeding new taxonomy with authors...\n')

  try {
    // Step 1: Create authors table (using old structure for compatibility)
    console.log('1️⃣ Creating authors table...')
    const { error: createAuthorsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS authors (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          affiliation TEXT,
          credibility_tier TEXT CHECK (credibility_tier IN ('Seminal Thinker', 'Thought Leader', 'Emerging Voice', 'Practitioner')),
          author_type TEXT CHECK (author_type IN ('Academic', 'Practitioner', 'Academic/Practitioner', 'Policy Maker', 'Industry Leader')),
          position_summary TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (createAuthorsError) {
      console.log('  Authors table may already exist, continuing...')
    }

    // Step 2: Insert authors
    console.log('2️⃣ Inserting 37 authors...')
    const authors = [
      { name: 'Sam Altman', affiliation: 'OpenAI', credibility_tier: 'Thought Leader', author_type: 'Industry Leader', position_summary: 'Aggressive AGI optimist; rapid scaling and deployment' },
      { name: 'Dario Amodei', affiliation: 'Anthropic', credibility_tier: 'Seminal Thinker', author_type: 'Industry Leader', position_summary: 'Safety-focused scaling; transparent risk policies' },
      { name: 'Ilya Sutskever', affiliation: 'Safe Superintelligence Inc.', credibility_tier: 'Seminal Thinker', author_type: 'Academic', position_summary: 'Deep safety focus; beyond scaling paradigms' },
      { name: 'Geoffrey Hinton', affiliation: 'University of Toronto', credibility_tier: 'Seminal Thinker', author_type: 'Academic/Practitioner', position_summary: 'Leading safety advocate; extinction risk awareness' },
      { name: 'Yann LeCun', affiliation: 'Meta / NYU', credibility_tier: 'Seminal Thinker', author_type: 'Industry Leader', position_summary: 'World models and embodied AI; open-source advocate' },
      { name: 'Yoshua Bengio', affiliation: 'Université de Montréal / MILA', credibility_tier: 'Seminal Thinker', author_type: 'Academic', position_summary: 'AI safety research; goal misalignment concerns' },
      { name: 'Demis Hassabis', affiliation: 'Google DeepMind', credibility_tier: 'Seminal Thinker', author_type: 'Industry Leader', position_summary: 'AGI timeline optimist; adaptive regulation advocate' },
      { name: 'Jensen Huang', affiliation: 'NVIDIA', credibility_tier: 'Thought Leader', author_type: 'Industry Leader', position_summary: 'Accelerated computing; AI infrastructure focus' },
      { name: 'Satya Nadella', affiliation: 'Microsoft', credibility_tier: 'Thought Leader', author_type: 'Industry Leader', position_summary: 'Copilot philosophy; human augmentation' },
      { name: 'Sundar Pichai', affiliation: 'Google/Alphabet', credibility_tier: 'Thought Leader', author_type: 'Industry Leader', position_summary: 'Democratize AI; responsible innovation' },
      { name: 'Mark Zuckerberg', affiliation: 'Meta', credibility_tier: 'Thought Leader', author_type: 'Industry Leader', position_summary: 'Open source AI advocate; ecosystem strategy' },
      { name: 'Emily M. Bender', affiliation: 'University of Washington', credibility_tier: 'Seminal Thinker', author_type: 'Academic', position_summary: 'Stochastic parrots critique; harms-first lens' },
      { name: 'Timnit Gebru', affiliation: 'DAIR', credibility_tier: 'Seminal Thinker', author_type: 'Academic', position_summary: 'Algorithmic bias leader; systems-of-power critique' },
      { name: 'Kate Crawford', affiliation: 'USC / Microsoft Research', credibility_tier: 'Seminal Thinker', author_type: 'Academic', position_summary: 'Material infrastructure of AI; extraction costs' },
      { name: 'Gary Marcus', affiliation: 'NYU Emeritus', credibility_tier: 'Thought Leader', author_type: 'Academic', position_summary: 'LLM limitations; neurosymbolic advocacy' },
      { name: 'Ethan Mollick', affiliation: 'Wharton', credibility_tier: 'Thought Leader', author_type: 'Academic/Practitioner', position_summary: 'Co-intelligence; practical transformation' },
      { name: 'Andrew Ng', affiliation: 'DeepLearning.AI / Stanford', credibility_tier: 'Seminal Thinker', author_type: 'Academic/Practitioner', position_summary: 'Democratization; agentic workflows' },
      { name: 'Erik Brynjolfsson', affiliation: 'Stanford', credibility_tier: 'Seminal Thinker', author_type: 'Academic', position_summary: 'Productivity J-curve; task-based augmentation' },
      { name: 'Fei-Fei Li', affiliation: 'Stanford HAI', credibility_tier: 'Seminal Thinker', author_type: 'Academic/Practitioner', position_summary: 'Human-centered AI; evidence-based policy' },
      { name: 'Marc Andreessen', affiliation: 'Andreessen Horowitz', credibility_tier: 'Thought Leader', author_type: 'Practitioner', position_summary: 'Tech utopian; innovation-first governance' },
      { name: 'Reid Hoffman', affiliation: 'Greylock', credibility_tier: 'Thought Leader', author_type: 'Practitioner', position_summary: 'Pragmatic optimist; deployment-first' },
      { name: 'Elon Musk', affiliation: 'xAI', credibility_tier: 'Thought Leader', author_type: 'Industry Leader', position_summary: 'Risk rhetoric with aggressive building' },
      { name: 'Balaji Srinivasan', affiliation: 'Network State', credibility_tier: 'Thought Leader', author_type: 'Practitioner', position_summary: 'Institutional revolutionary; anti-regulation' },
      { name: 'Andrej Karpathy', affiliation: 'Eureka Labs', credibility_tier: 'Thought Leader', author_type: 'Academic/Practitioner', position_summary: 'Pragmatic realist; open science' },
      { name: 'Mustafa Suleyman', affiliation: 'Microsoft AI', credibility_tier: 'Thought Leader', author_type: 'Industry Leader', position_summary: 'Responsible accelerationist' },
      { name: 'Clement Delangue', affiliation: 'Hugging Face', credibility_tier: 'Thought Leader', author_type: 'Industry Leader', position_summary: 'Open-source democratizer' },
      { name: 'Allie K. Miller', affiliation: 'Independent', credibility_tier: 'Thought Leader', author_type: 'Practitioner', position_summary: 'Practical enterprise implementation' },
      { name: 'Ben Thompson', affiliation: 'Stratechery', credibility_tier: 'Thought Leader', author_type: 'Practitioner', position_summary: 'Platform strategy; incremental progress' },
      { name: 'Azeem Azhar', affiliation: 'Exponential View', credibility_tier: 'Thought Leader', author_type: 'Practitioner', position_summary: 'Transformation realist' },
      { name: 'Jason Lemkin', affiliation: 'SaaStr', credibility_tier: 'Thought Leader', author_type: 'Practitioner', position_summary: 'SaaS perspective; pragmatic incremental' },
      { name: 'Sam Harris', affiliation: 'Making Sense', credibility_tier: 'Thought Leader', author_type: 'Practitioner', position_summary: 'Alignment risk advocate' },
      { name: 'Max Tegmark', affiliation: 'MIT/FLI', credibility_tier: 'Seminal Thinker', author_type: 'Academic', position_summary: 'Existential risk focus' },
      { name: 'Alin Dobrea', affiliation: 'Independent AI Strategist', credibility_tier: 'Emerging Voice', author_type: 'Practitioner', position_summary: 'Business-AI translation; co-evolution advocate' },
      { name: 'Jaron Lanier', affiliation: 'Microsoft Research', credibility_tier: 'Seminal Thinker', author_type: 'Academic/Practitioner', position_summary: 'Humanistic tech critique; data dignity' },
      { name: 'Stuart Russell', affiliation: 'UC Berkeley', credibility_tier: 'Seminal Thinker', author_type: 'Academic', position_summary: 'AI safety; value alignment research' },
      { name: 'Daniel Kahneman', affiliation: 'Princeton', credibility_tier: 'Seminal Thinker', author_type: 'Academic', position_summary: 'Human judgment; cognitive biases in AI context' },
      { name: 'Francesca Rossi', affiliation: 'IBM Research', credibility_tier: 'Thought Leader', author_type: 'Academic/Practitioner', position_summary: 'AI ethics; value-sensitive design' }
    ]

    const { error: authorsError } = await supabase.from('authors').insert(authors)
    if (authorsError && !authorsError.message.includes('duplicate')) {
      throw authorsError
    }
    console.log(`  ✅ Inserted ${authors.length} authors\n`)

    // Step 3: Get camp and author IDs
    console.log('3️⃣ Fetching camps and authors...')
    const { data: camps } = await supabase.from('camps').select('id, name')
    const { data: authorsData } = await supabase.from('authors').select('id, name')

    if (!camps || !authorsData) {
      throw new Error('Failed to fetch camps or authors')
    }

    const getCampId = (name: string) => camps.find(c => c.name === name)?.id
    const getAuthorIds = (names: string[]) =>
      names.map(name => authorsData.find(a => a.name === name)?.id).filter(Boolean)

    console.log(`  ✅ Found ${camps.length} camps and ${authorsData.length} authors\n`)

    // Step 4: Create camp_authors relationship table
    console.log('4️⃣ Creating camp_authors table...')
    const { error: createCampAuthorsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS camp_authors (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          camp_id UUID REFERENCES camps(id) ON DELETE CASCADE,
          author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
          why_it_matters TEXT,
          relevance TEXT CHECK (relevance IN ('strong', 'partial', 'challenges', 'emerging')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(camp_id, author_id)
        );
      `
    })

    if (createCampAuthorsError) {
      console.log('  camp_authors table may already exist, continuing...')
    }

    // Step 5: Map authors to camps
    console.log('5️⃣ Mapping authors to camps...\n')

    const relationships: any[] = []

    // Society & Ethics - Ethical Stewards
    getAuthorIds(['Emily M. Bender', 'Timnit Gebru', 'Kate Crawford', 'Gary Marcus', 'Jaron Lanier']).forEach(authorId => {
      relationships.push({ camp_id: getCampId('Ethical Stewards'), author_id: authorId, relevance: 'strong', why_it_matters: 'Focus on AI harms, ethics, and social impacts' })
    })

    // Society & Ethics - Tech Realists
    getAuthorIds(['Yann LeCun', 'Andrej Karpathy', 'Yoshua Bengio', 'Fei-Fei Li']).forEach(authorId => {
      relationships.push({ camp_id: getCampId('Tech Realists'), author_id: authorId, relevance: 'strong', why_it_matters: 'Balance technical progress with responsibility' })
    })

    // Society & Ethics - Tech Utopians
    getAuthorIds(['Marc Andreessen', 'Balaji Srinivasan', 'Reid Hoffman', 'Elon Musk']).forEach(authorId => {
      relationships.push({ camp_id: getCampId('Tech Utopians'), author_id: authorId, relevance: 'strong', why_it_matters: 'Optimistic about AI democratization' })
    })

    // Enterprise Transformation - Tech-First
    getAuthorIds(['Sam Altman', 'Jensen Huang', 'Mark Zuckerberg', 'Sundar Pichai']).forEach(authorId => {
      relationships.push({ camp_id: getCampId('Tech-First'), author_id: authorId, relevance: 'strong', why_it_matters: 'Infrastructure-first approach to AI adoption' })
    })

    // Enterprise Transformation - Co-Evolution
    getAuthorIds(['Satya Nadella', 'Andrew Ng', 'Erik Brynjolfsson', 'Alin Dobrea', 'Ethan Mollick', 'Fei-Fei Li']).forEach(authorId => {
      relationships.push({ camp_id: getCampId('Co-Evolution'), author_id: authorId, relevance: 'strong', why_it_matters: 'People, process, and technology evolving together' })
    })

    // Enterprise Transformation - Proof Seekers
    getAuthorIds(['Jason Lemkin', 'Ben Thompson']).forEach(authorId => {
      relationships.push({ camp_id: getCampId('Proof Seekers'), author_id: authorId, relevance: 'strong', why_it_matters: 'Focus on measurable ROI and validation' })
    })

    // Enterprise Transformation - Learning Architects
    getAuthorIds(['Alin Dobrea', 'Ethan Mollick', 'Allie K. Miller']).forEach(authorId => {
      relationships.push({ camp_id: getCampId('Learning Architects'), author_id: authorId, relevance: 'strong', why_it_matters: 'Iterative measurement and learning loops' })
    })

    // Enterprise Transformation - Tech Builders
    getAuthorIds(['Ilya Sutskever', 'Andrej Karpathy', 'Clement Delangue']).forEach(authorId => {
      relationships.push({ camp_id: getCampId('Tech Builders'), author_id: authorId, relevance: 'strong', why_it_matters: 'Technical excellence drives adoption' })
    })

    // Enterprise Transformation - Business Whisperers
    getAuthorIds(['Alin Dobrea', 'Allie K. Miller', 'Ethan Mollick']).forEach(authorId => {
      relationships.push({ camp_id: getCampId('Business Whisperers'), author_id: authorId, relevance: 'strong', why_it_matters: 'Translation between business and AI' })
    })

    // Future of Work - Human-AI Collaboration
    getAuthorIds(['Andrew Ng', 'Ethan Mollick', 'Erik Brynjolfsson', 'Satya Nadella', 'Alin Dobrea']).forEach(authorId => {
      relationships.push({ camp_id: getCampId('Human-AI Collaboration'), author_id: authorId, relevance: 'strong', why_it_matters: 'AI as augmentation tool' })
    })

    // Future of Work - Displacement Realists
    getAuthorIds(['Erik Brynjolfsson', 'Gary Marcus', 'Emily M. Bender', 'Daniel Kahneman']).forEach(authorId => {
      relationships.push({ camp_id: getCampId('Displacement Realists'), author_id: authorId, relevance: 'strong', why_it_matters: 'Acknowledge structural labor displacement' })
    })

    // AI Progress - Scaling Maximalists
    getAuthorIds(['Sam Altman', 'Dario Amodei', 'Demis Hassabis', 'Jensen Huang', 'Mark Zuckerberg']).forEach(authorId => {
      relationships.push({ camp_id: getCampId('Scaling Maximalists'), author_id: authorId, relevance: 'strong', why_it_matters: 'Scaling as path to AGI' })
    })

    // AI Progress - Grounding Realists
    getAuthorIds(['Yann LeCun', 'Gary Marcus', 'Alin Dobrea', 'Stuart Russell']).forEach(authorId => {
      relationships.push({ camp_id: getCampId('Grounding Realists'), author_id: authorId, relevance: 'strong', why_it_matters: 'LLM limits; need for embodiment and world models' })
    })

    // Governance & Oversight - Regulatory Interventionists
    getAuthorIds(['Timnit Gebru', 'Emily M. Bender', 'Max Tegmark', 'Sam Harris', 'Geoffrey Hinton', 'Yoshua Bengio']).forEach(authorId => {
      relationships.push({ camp_id: getCampId('Regulatory Interventionists'), author_id: authorId, relevance: 'strong', why_it_matters: 'Strong oversight needed now' })
    })

    // Governance & Oversight - Innovation-First
    getAuthorIds(['Marc Andreessen', 'Balaji Srinivasan', 'Reid Hoffman']).forEach(authorId => {
      relationships.push({ camp_id: getCampId('Innovation-First'), author_id: authorId, relevance: 'strong', why_it_matters: 'Industry should lead; minimal regulation' })
    })

    // Governance & Oversight - Adaptive Governance
    getAuthorIds(['Demis Hassabis', 'Mustafa Suleyman', 'Fei-Fei Li', 'Francesca Rossi']).forEach(authorId => {
      relationships.push({ camp_id: getCampId('Adaptive Governance'), author_id: authorId, relevance: 'strong', why_it_matters: 'Iterative, co-evolving regulation' })
    })

    // Filter out invalid relationships
    const validRelationships = relationships.filter(rel => rel.camp_id && rel.author_id)

    console.log(`  Creating ${validRelationships.length} author-camp relationships...\n`)

    // Insert relationships
    let addedCount = 0
    let skippedCount = 0

    for (const rel of validRelationships) {
      const { error } = await supabase.from('camp_authors').insert(rel)

      if (error) {
        if (error.code === '23505') {
          skippedCount++
        } else {
          console.error('  Error:', error.message)
        }
      } else {
        addedCount++
      }
    }

    console.log(`  ✅ Added ${addedCount} relationships`)
    console.log(`  ⏭️  Skipped ${skippedCount} duplicates\n`)

    console.log('✨ Seeding complete!\n')
    console.log('📊 Final Summary:')
    console.log(`  • ${authorsData.length} authors`)
    console.log(`  • ${camps.length} camps`)
    console.log(`  • ${addedCount} author-camp relationships\n`)

  } catch (error: any) {
    console.error('❌ Seeding failed:', error.message)
    console.log('\n💡 You may need to run the SQL manually in Supabase Dashboard')
  }
}

seedNewTaxonomy()
