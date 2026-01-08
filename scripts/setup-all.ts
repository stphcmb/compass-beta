// Combined setup: Citation migration + Add new authors + Run citation check
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
})

// Camp UUIDs
const CAMPS = {
  SCALING: 'c5dcb027-cd27-4c91-adb4-aca780d15199',
  NEEDS_NEW: '207582eb-7b32-4951-9863-32fcf05944a1',
  SAFETY_FIRST: '7f64838f-59a6-4c87-8373-a023b9f448cc',
  DEMOCRATIZE: 'fe19ae2d-99f2-4c30-a596-c9cd92bff41b',
  TECH_LEADS: '7e9a2196-71e7-423a-889c-6902bc678eac',
  CO_EVOLUTION: 'f19021ab-a8db-4363-adec-c2228dad6298',
  TECH_BUILDERS: 'a076a4ce-f14c-47b5-ad01-c8c60135a494',
  HUMAN_AI_COLLAB: 'd8d3cec4-f8ce-49b1-9a43-bb0d952db371',
  ADAPTIVE_GOV: 'ee10cf4f-025a-47fc-be20-33d6756ec5cd',
  INNOVATION_FIRST: '331b2b02-7f8d-4751-b583-16255a6feb50',
}

const newAuthors = [
  {
    name: 'Matei Zaharia',
    header_affiliation: 'Databricks',
    primary_affiliation: 'Databricks, Co-founder & CTO; Stanford University',
    author_type: 'Industry Leader',
    credibility_tier: 'Pioneer',
    notes: 'Co-creator of Apache Spark and MLflow. His work on data infrastructure fundamentally changed how ML systems are built at scale.',
    sources: [
      { url: 'https://www.databricks.com/blog/2023/09/13/announcing-dbrx-new-standard-efficient-open-source-ai.html', type: 'Blog', year: '2024', title: 'DBRX' },
      { url: 'https://arxiv.org/abs/2310.08560', type: 'Paper', year: '2023', title: 'Compound AI Systems' },
      { url: 'https://www.databricks.com/', type: 'Organization', year: '2024', title: 'Databricks' },
    ],
    key_quote: 'The future of AI is not just bigger models—it\'s compound AI systems that combine LLMs with retrieval, tools, and traditional code.',
    quote_source_url: 'https://arxiv.org/abs/2310.08560',
    camps: [
      { camp_id: CAMPS.TECH_BUILDERS, relevance: 'strong', key_quote: 'Compound AI systems that combine LLMs with retrieval, tools, and code will outperform monolithic models.', quote_source_url: 'https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/', why_it_matters: 'Zaharia\'s "compound AI systems" thesis shapes how enterprises build production AI.' },
      { camp_id: CAMPS.CO_EVOLUTION, relevance: 'partial', key_quote: 'AI success requires not just models but the entire stack—data engineering, feature management, model serving.', quote_source_url: 'https://www.databricks.com/', why_it_matters: 'His platform approach emphasizes concurrent evolution of infrastructure and capabilities.' },
    ]
  },
  {
    name: 'Tri Dao',
    header_affiliation: 'Together AI',
    primary_affiliation: 'Together AI, Chief Scientist; Princeton University',
    author_type: 'Researcher',
    credibility_tier: 'Field Leader',
    notes: 'Creator of FlashAttention, which revolutionized transformer efficiency. His work enables training longer sequences and faster inference.',
    sources: [
      { url: 'https://arxiv.org/abs/2205.14135', type: 'Paper', year: '2022', title: 'FlashAttention' },
      { url: 'https://arxiv.org/abs/2307.08691', type: 'Paper', year: '2023', title: 'FlashAttention-2' },
      { url: 'https://github.com/Dao-AILab/flash-attention', type: 'Research', year: '2024', title: 'FlashAttention GitHub' },
    ],
    key_quote: 'FlashAttention shows that understanding hardware is as important as understanding algorithms. IO-awareness is the key to making deep learning efficient.',
    quote_source_url: 'https://arxiv.org/abs/2205.14135',
    camps: [
      { camp_id: CAMPS.TECH_BUILDERS, relevance: 'strong', key_quote: 'IO-aware algorithms can provide 2-4x speedups without changing the model architecture.', quote_source_url: 'https://arxiv.org/abs/2205.14135', why_it_matters: 'FlashAttention made training long-context models practical and dramatically reduced inference costs.' },
      { camp_id: CAMPS.DEMOCRATIZE, relevance: 'partial', key_quote: 'By making attention more efficient, we lower the computational barriers to AI.', quote_source_url: 'https://arxiv.org/abs/2307.08691', why_it_matters: 'FlashAttention\'s open-source release democratized efficient transformer training.' },
    ]
  },
  {
    name: 'Chris Ré',
    header_affiliation: 'Stanford',
    primary_affiliation: 'Stanford University; Together AI, Co-founder',
    author_type: 'Academic',
    credibility_tier: 'Field Leader',
    notes: 'MacArthur Fellow pioneering data-centric AI. Created Snorkel for programmatic data labeling. Co-architect of Mamba architecture.',
    sources: [
      { url: 'https://arxiv.org/abs/2212.09720', type: 'Paper', year: '2022', title: 'Data-centric AI Survey' },
      { url: 'https://snorkel.ai/', type: 'Research', year: '2024', title: 'Snorkel AI' },
      { url: 'https://arxiv.org/abs/2312.00752', type: 'Paper', year: '2023', title: 'Mamba' },
    ],
    key_quote: 'The bottleneck in AI is not models—it\'s data. Data programming and weak supervision let us scale data quality.',
    quote_source_url: 'https://arxiv.org/abs/2212.09720',
    camps: [
      { camp_id: CAMPS.NEEDS_NEW, relevance: 'strong', key_quote: 'Data quality is the real bottleneck in AI. The focus should shift from models to data.', quote_source_url: 'https://arxiv.org/abs/2212.09720', why_it_matters: 'Chris Ré\'s data-centric AI perspective challenges the pure scaling paradigm. Mamba shows alternative architectures beyond transformers.' },
    ]
  },
  {
    name: 'Jacob Steinhardt',
    header_affiliation: 'UC Berkeley',
    primary_affiliation: 'UC Berkeley, Assistant Professor',
    author_type: 'Academic',
    credibility_tier: 'Field Leader',
    notes: 'Leading AI safety researcher focusing on robustness and alignment. His ML Safety course has trained hundreds of safety researchers.',
    sources: [
      { url: 'https://bounded-regret.ghost.io/', type: 'Blog', year: '2024', title: 'Bounded Regret Blog' },
      { url: 'https://arxiv.org/abs/2206.13353', type: 'Paper', year: '2022', title: 'AI Risk from Emergence' },
      { url: 'https://course.mlsafety.org/', type: 'Research', year: '2024', title: 'ML Safety Course' },
    ],
    key_quote: 'We need to develop AI systems that remain safe even as they become more capable. Safety must be a core engineering discipline.',
    quote_source_url: 'https://bounded-regret.ghost.io/',
    camps: [
      { camp_id: CAMPS.SAFETY_FIRST, relevance: 'strong', key_quote: 'AI safety is about building robust systems that behave predictably even in novel situations.', quote_source_url: 'https://bounded-regret.ghost.io/', why_it_matters: 'Steinhardt trains the next generation of safety researchers through his ML Safety course.' },
    ]
  },
  {
    name: 'Edo Liberty',
    header_affiliation: 'Pinecone',
    primary_affiliation: 'Pinecone, Founder & CEO',
    author_type: 'Industry Leader',
    credibility_tier: 'Field Leader',
    notes: 'Founded Pinecone, the leading vector database for AI. Former Amazon VP of AI. Pioneered making RAG accessible to developers.',
    sources: [
      { url: 'https://www.pinecone.io/', type: 'Organization', year: '2024', title: 'Pinecone' },
      { url: 'https://www.pinecone.io/blog/', type: 'Blog', year: '2024', title: 'Pinecone Blog' },
      { url: 'https://www.pinecone.io/learn/retrieval-augmented-generation/', type: 'Research', year: '2024', title: 'RAG Guide' },
    ],
    key_quote: 'Vector databases are the memory layer for AI. RAG is how we give LLMs access to current, private, and specialized knowledge.',
    quote_source_url: 'https://www.pinecone.io/learn/retrieval-augmented-generation/',
    camps: [
      { camp_id: CAMPS.TECH_BUILDERS, relevance: 'strong', key_quote: 'RAG architecture lets you combine LLM reasoning with retrieval precision—this is how production AI works.', quote_source_url: 'https://www.pinecone.io/learn/retrieval-augmented-generation/', why_it_matters: 'Pinecone pioneered the vector database category and made RAG accessible to developers.' },
    ]
  },
  {
    name: 'Thomas Wolf',
    header_affiliation: 'Hugging Face',
    primary_affiliation: 'Hugging Face, Co-founder & Chief Science Officer',
    author_type: 'Industry Leader',
    credibility_tier: 'Field Leader',
    notes: 'Co-founded Hugging Face and built the Transformers library that democratized access to state-of-the-art NLP.',
    sources: [
      { url: 'https://huggingface.co/', type: 'Organization', year: '2024', title: 'Hugging Face' },
      { url: 'https://arxiv.org/abs/1910.03771', type: 'Paper', year: '2019', title: 'Transformers Library' },
      { url: 'https://huggingface.co/blog', type: 'Blog', year: '2024', title: 'HF Blog' },
    ],
    key_quote: 'Open-source AI is not just about code—it\'s about democratizing access to the most transformative technology of our time.',
    quote_source_url: 'https://huggingface.co/blog/ethics-soc-2023',
    camps: [
      { camp_id: CAMPS.DEMOCRATIZE, relevance: 'strong', key_quote: 'The Transformers library has been downloaded billions of times because making AI accessible accelerates progress for everyone.', quote_source_url: 'https://huggingface.co/blog/ethics-soc-2023', why_it_matters: 'Hugging Face transformed how developers access AI models. Thomas Wolf\'s vision shapes the open-source AI movement.' },
    ]
  },
  {
    name: 'Hugo Touvron',
    header_affiliation: 'Meta AI',
    primary_affiliation: 'Meta AI, Research Scientist',
    author_type: 'Researcher',
    credibility_tier: 'Field Leader',
    notes: 'Lead author on Llama and Llama 2 papers. Key figure in making powerful open-weight LLMs available to researchers.',
    sources: [
      { url: 'https://arxiv.org/abs/2302.13971', type: 'Paper', year: '2023', title: 'LLaMA' },
      { url: 'https://arxiv.org/abs/2307.09288', type: 'Paper', year: '2023', title: 'Llama 2' },
      { url: 'https://ai.meta.com/llama/', type: 'Research', year: '2024', title: 'Llama at Meta' },
    ],
    key_quote: 'Open foundation models democratize AI research. Llama showed that open weights can achieve competitive performance.',
    quote_source_url: 'https://arxiv.org/abs/2302.13971',
    camps: [
      { camp_id: CAMPS.DEMOCRATIZE, relevance: 'strong', key_quote: 'Releasing Llama as open weights accelerates AI research. When the community can access foundation models, everyone benefits.', quote_source_url: 'https://arxiv.org/abs/2302.13971', why_it_matters: 'Llama\'s release was a watershed moment for open-source AI. Touvron\'s work enabled thousands to build on state-of-the-art models.' },
    ]
  },
  {
    name: 'Sholto Douglas',
    header_affiliation: 'Google DeepMind',
    primary_affiliation: 'Google DeepMind, Research Scientist',
    author_type: 'Researcher',
    credibility_tier: 'Domain Expert',
    notes: 'Co-author of the influential Chinchilla paper that changed how we think about compute-optimal training.',
    sources: [
      { url: 'https://arxiv.org/abs/2203.15556', type: 'Paper', year: '2022', title: 'Chinchilla' },
      { url: 'https://www.dwarkeshpatel.com/p/sholto-douglas-trenton-bricken', type: 'Podcast', year: '2024', title: 'Dwarkesh Interview' },
      { url: 'https://twitter.com/shlomoweiss', type: 'Social', year: '2024', title: 'Twitter' },
    ],
    key_quote: 'Chinchilla showed that most large language models were undertrained. Scaling laws tell us the optimal balance.',
    quote_source_url: 'https://arxiv.org/abs/2203.15556',
    camps: [
      { camp_id: CAMPS.SCALING, relevance: 'strong', key_quote: 'Scaling laws are more nuanced than we thought. The right balance of model size and data is crucial.', quote_source_url: 'https://arxiv.org/abs/2203.15556', why_it_matters: 'The Chinchilla paper reshaped LLM training. Douglas\'s scaling law research influences how labs allocate compute.' },
    ]
  },
  {
    name: 'Yi Tay',
    header_affiliation: 'Reka AI',
    primary_affiliation: 'Reka AI, Co-founder; formerly Google DeepMind',
    author_type: 'Researcher',
    credibility_tier: 'Field Leader',
    notes: 'Prolific researcher on efficient transformers. Key contributor to T5, UL2, and Flan. Co-founded Reka AI.',
    sources: [
      { url: 'https://arxiv.org/abs/2205.05131', type: 'Paper', year: '2022', title: 'UL2' },
      { url: 'https://arxiv.org/abs/2210.11416', type: 'Paper', year: '2022', title: 'Flan' },
      { url: 'https://reka.ai/', type: 'Organization', year: '2024', title: 'Reka AI' },
    ],
    key_quote: 'The best model architectures balance capability with efficiency. Instruction tuning can unlock emergent abilities without massive scale.',
    quote_source_url: 'https://arxiv.org/abs/2205.05131',
    camps: [
      { camp_id: CAMPS.TECH_BUILDERS, relevance: 'strong', key_quote: 'Model architecture innovation remains crucial. Training methodology can unlock capabilities without just throwing more compute.', quote_source_url: 'https://arxiv.org/abs/2205.05131', why_it_matters: 'Yi Tay\'s work on UL2 and Flan influenced how modern LLMs are trained. At Reka, he\'s pushing multimodal innovation.' },
    ]
  },
  {
    name: 'Kanjun Qiu',
    header_affiliation: 'Imbue',
    primary_affiliation: 'Imbue, Co-founder & CEO',
    author_type: 'Industry Leader',
    credibility_tier: 'Domain Expert',
    notes: 'Founded Imbue to build AI systems that reason and code. Focuses on AI systems that can learn to improve themselves.',
    sources: [
      { url: 'https://imbue.com/', type: 'Organization', year: '2024', title: 'Imbue' },
      { url: 'https://imbue.com/research/', type: 'Research', year: '2024', title: 'Imbue Research' },
      { url: 'https://www.youtube.com/watch?v=qBL_oFgQ0zM', type: 'Video', year: '2024', title: 'Building AI that reasons' },
    ],
    key_quote: 'We need AI systems that can reason, not just pattern match. The path to useful AI is building systems that improve their own reasoning.',
    quote_source_url: 'https://imbue.com/',
    camps: [
      { camp_id: CAMPS.HUMAN_AI_COLLAB, relevance: 'strong', key_quote: 'The goal is to build AI that reasons alongside humans, enhancing capability rather than automating away tasks.', quote_source_url: 'https://imbue.com/', why_it_matters: 'Imbue\'s focus on reasoning represents a vision of AI as cognitive augmentation.' },
    ]
  },
]

async function addAuthors() {
  console.log('\n📚 Adding new trending AI authors...\n')

  let added = 0
  let skipped = 0

  for (const author of newAuthors) {
    // Check if author exists
    const { data: existing } = await supabase
      .from('authors')
      .select('id')
      .eq('name', author.name)
      .single()

    if (existing) {
      console.log(`⏭️  ${author.name} already exists`)
      skipped++
      continue
    }

    // Add author
    const { data: newAuthor, error: authorError } = await supabase
      .from('authors')
      .insert({
        name: author.name,
        header_affiliation: author.header_affiliation,
        primary_affiliation: author.primary_affiliation,
        author_type: author.author_type,
        credibility_tier: author.credibility_tier,
        notes: author.notes,
        sources: author.sources,
        key_quote: author.key_quote,
        quote_source_url: author.quote_source_url,
      })
      .select('id')
      .single()

    if (authorError) {
      console.error(`❌ Failed to add ${author.name}:`, authorError.message)
      continue
    }

    // Add camp relationships
    for (const camp of author.camps) {
      const { error: campError } = await supabase
        .from('camp_authors')
        .insert({
          author_id: newAuthor.id,
          camp_id: camp.camp_id,
          relevance: camp.relevance,
          key_quote: camp.key_quote,
          quote_source_url: camp.quote_source_url,
          why_it_matters: camp.why_it_matters,
        })

      if (campError && !campError.message.includes('duplicate')) {
        console.error(`  ⚠️  Failed to add camp for ${author.name}:`, campError.message)
      }
    }

    console.log(`✅ Added ${author.name} (${author.camps.length} camps)`)
    added++
  }

  console.log(`\n📊 Summary: ${added} added, ${skipped} skipped`)
}

async function runCitationCheck() {
  console.log('\n🔍 Running citation check on new authors...\n')

  // Check if citation columns exist
  const { error: testError } = await supabase
    .from('camp_authors')
    .select('citation_status')
    .limit(1)

  if (testError && testError.message.includes('does not exist')) {
    console.log('⚠️  Citation columns not yet created. Skipping citation check.')
    console.log('   Run the migration SQL first, then call /api/citations/batch')
    return
  }

  // Get unchecked citations
  const { data: citations } = await supabase
    .from('camp_authors')
    .select('id, quote_source_url, authors!inner(name)')
    .not('quote_source_url', 'is', null)
    .or('citation_status.eq.unchecked,citation_status.is.null')
    .limit(50)

  if (!citations || citations.length === 0) {
    console.log('✅ No unchecked citations')
    return
  }

  console.log(`Checking ${citations.length} citations...\n`)

  let valid = 0, broken = 0

  for (const citation of citations) {
    const url = citation.quote_source_url
    if (!url?.startsWith('http')) continue

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000),
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CompassBot/1.0)' },
      })

      const status = response.ok ? 'valid' : 'broken'
      await supabase
        .from('camp_authors')
        .update({ citation_status: status, citation_last_checked: new Date().toISOString() })
        .eq('id', citation.id)

      if (response.ok) valid++
      else broken++
    } catch {
      await supabase
        .from('camp_authors')
        .update({ citation_status: 'timeout', citation_last_checked: new Date().toISOString() })
        .eq('id', citation.id)
    }

    await new Promise(r => setTimeout(r, 100))
  }

  console.log(`✅ Valid: ${valid}, ❌ Broken: ${broken}`)
}

async function main() {
  console.log('🚀 SETUP: Adding Authors + Citation Check')
  console.log('='.repeat(50))

  await addAuthors()
  await runCitationCheck()

  console.log('\n✅ Setup complete!')
}

main().catch(console.error)
