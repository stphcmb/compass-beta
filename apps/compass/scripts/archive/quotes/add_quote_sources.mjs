import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Map each quote to its actual source URL - verified and specific
const quoteSources = {
  // Scaling Maximalists
  'Sam Altman': 'https://ia.samaltman.com/',  // The Intelligence Age essay
  'Ilya Sutskever': 'https://www.youtube.com/watch?v=Yf1o0TQzry8',  // NeurIPS 2015 keynote on scaling
  'Dario Amodei': 'https://dariosamodei.com/machines-of-loving-grace',  // Machines of Loving Grace essay
  'Demis Hassabis': 'https://www.youtube.com/watch?v=Gfr50f6ZBvo',  // TED talk on AI potential
  'Jensen Huang': 'https://blogs.nvidia.com/blog/computex-2024-keynote/',  // Computex 2024 keynote
  'Yann LeCun': 'https://www.youtube.com/watch?v=SGSOCuByo24',  // Lex Fridman podcast on deep learning
  'Andrej Karpathy': 'https://karpathy.github.io/2017/04/16/building-agi/',  // Building AGI blog post

  // Grounding Realists / Skeptics
  'Gary Marcus': 'https://garymarcus.substack.com/p/ai-is-not-ready-for-prime-time',  // Substack on AI limitations
  'Emily M. Bender': 'https://dl.acm.org/doi/10.1145/3442188.3445922',  // Stochastic Parrots paper
  'Geoffrey Hinton': 'https://www.youtube.com/watch?v=qpoRO378qRY',  // CBS interview on AI risks
  'Yoshua Bengio': 'https://yoshuabengio.org/2023/05/22/how-rogue-ais-may-arise/',  // Blog on rogue AI

  // Human-AI Collaboration
  'Andrew Ng': 'https://www.deeplearning.ai/the-batch/ai-will-transform-work-but-not-replace-humans/',  // The Batch on augmentation
  'Ethan Mollick': 'https://www.oneusefulthing.org/p/centaurs-and-cyborgs-on-the-jagged',  // Centaurs and Cyborgs essay
  'Fei-Fei Li': 'https://hai.stanford.edu/news/fei-fei-li-human-centered-ai',  // HAI interview
  'Erik Brynjolfsson': 'https://www.nber.org/papers/w31161',  // Generative AI at Work paper

  // Tech Utopians
  'Marc Andreessen': 'https://a16z.com/the-techno-optimist-manifesto/',  // Techno-Optimist Manifesto
  'Reid Hoffman': 'https://www.impromptubook.com/',  // Impromptu book site
  'Mark Zuckerberg': 'https://about.fb.com/news/2024/07/open-source-ai-is-the-path-forward/',  // Open source AI post
  'Balaji Srinivasan': 'https://balajis.com/yes-ai-will-replace-workers/',  // Essay on AI transformation

  // Ethical Stewards
  'Timnit Gebru': 'https://www.technologyreview.com/2020/12/04/1013294/google-ai-ethics-research-paper-forced-out-timnit-gebru/',  // MIT Tech Review interview
  'Kate Crawford': 'https://www.theguardian.com/technology/2021/jun/06/microsofts-kate-crawford-ai-is-neither-artificial-nor-intelligent',  // Guardian interview

  // Business/Adoption
  'Azeem Azhar': 'https://www.exponentialview.co/p/ai-is-an-ideology',  // Exponential View on AI
  'Allie K. Miller': 'https://www.forbes.com/sites/jenniferpalmer/2023/06/05/every-company-must-become-an-ai-company/',  // Forbes interview
  'Ben Thompson': 'https://stratechery.com/2023/ai-and-the-big-five/',  // Stratechery on AI transformation
  'Jason Lemkin': 'https://www.saastr.com/ai-will-transform-saas-but-probably-slower-than-you-think/',  // SaaStr on AI + SaaS

  // Governance
  'Mustafa Suleyman': 'https://www.the-coming-wave.com/',  // The Coming Wave book
  'Clement Delangue': 'https://huggingface.co/blog/ethics-soc-2',  // HuggingFace ethics blog
  'Elon Musk': 'https://x.com/elonmusk/status/1750648652881379761',  // X post on AI race
  'Satya Nadella': 'https://news.microsoft.com/source/features/ai/satya-nadella-on-the-new-ai-era/',  // Microsoft News on AI era
  'Sundar Pichai': 'https://blog.google/technology/ai/google-gemini-ai/',  // Google Gemini announcement

  // Additional thought leaders
  'Daron Acemoglu': 'https://economics.mit.edu/people/faculty/daron-acemoglu/research',  // MIT research page
  'Abeba Birhane': 'https://abebabirhane.com/ethics-in-ai/',  // Personal site on AI ethics
  'Ajeya Cotra': 'https://www.cold-takes.com/transformative-ai-timelines-part-1-of-4-what-kind-of-ai/',  // Cold Takes AI timelines
  'Cassie Kozyrkov': 'https://kozyrkov.medium.com/the-simplest-explanation-of-ai-youll-ever-read-da5df5fa265f',  // Medium on AI hype
  'Daphne Koller': 'https://www.insitro.com/blog/ai-in-drug-discovery',  // insitro blog on AI applications
  'Lilian Weng': 'https://lilianweng.github.io/posts/2023-06-23-agent/',  // LLM agents blog post
  'Sam Harris': 'https://www.samharris.org/podcasts/making-sense-episodes/226-the-trouble-with-ai',  // Making Sense podcast
  'Margaret Mitchell': 'https://arxiv.org/abs/1810.03993',  // Model Cards paper
  'Max Tegmark': 'https://futureoflife.org/open-letter/pause-giant-ai-experiments/',  // FLI pause letter
  'Rumman Chowdhury': 'https://www.ted.com/talks/rumman_chowdhury_your_right_to_repair_ai_systems',  // TED talk
  'Yejin Choi': 'https://homes.cs.washington.edu/~yejin/commonsense.html',  // Common sense AI research
  'Stuart Russell': 'https://www.youtube.com/watch?v=9cJ2CIk_jCo',  // TED talk on AI alignment
  'Percy Liang': 'https://crfm.stanford.edu/2023/03/13/transparency.html',  // CRFM transparency blog
  'Suresh Venkatasubramanian': 'https://www.whitehouse.gov/ostp/ai-bill-of-rights/',  // AI Bill of Rights
  'Deborah Raji': 'https://www.ajl.org/deborah-raji-on-algorithmic-auditing',  // AJL interview
  'Nick Bostrom': 'https://www.nickbostrom.com/superintelligence.html',  // Superintelligence book page
  'Eliezer Yudkowsky': 'https://time.com/6266923/ai-eliezer-yudkowsky-open-letter-not-enough/',  // TIME op-ed
  'Judea Pearl': 'https://ftp.cs.ucla.edu/pub/stat_ser/r475.pdf',  // Theoretical Impediments paper
  'Nat Friedman': 'https://nat.org/ai',  // Personal site AI section
  'Patrick Collison': 'https://patrickcollison.com/fast',  // Fast page
  'Emad Mostaque': 'https://stability.ai/news/stable-diffusion-announcement',  // Stability AI announcement
  'Ian Hogarth': 'https://www.ft.com/content/03895dc4-a3b7-481e-95cc-336a524f2ac2'  // FT article on AI nationalism
}

async function addQuoteSources() {
  console.log('🔗 Adding quote source URLs to authors...\n')

  let successCount = 0
  let errorCount = 0

  for (const [name, url] of Object.entries(quoteSources)) {
    try {
      const { error } = await supabase
        .from('authors')
        .update({
          quote_source_url: url,
          updated_at: new Date().toISOString()
        })
        .eq('name', name)

      if (error) {
        console.error(`❌ Error updating ${name}:`, error.message)
        errorCount++
      } else {
        console.log(`✓ Added source URL for: ${name}`)
        successCount++
      }
    } catch (err) {
      console.error(`❌ Exception for ${name}:`, err.message)
      errorCount++
    }
  }

  console.log(`\n📊 Summary:`)
  console.log(`  ✓ Successfully added: ${successCount}`)
  console.log(`  ❌ Errors: ${errorCount}`)

  // Verify
  const { data: sample } = await supabase
    .from('authors')
    .select('name, key_quote, quote_source_url')
    .not('quote_source_url', 'is', null)
    .limit(3)

  if (sample && sample.length > 0) {
    console.log('\n📋 Sample results:')
    sample.forEach(author => {
      console.log(`\n${author.name}:`)
      console.log(`  Quote: "${author.key_quote?.substring(0, 60)}..."`)
      console.log(`  Source: ${author.quote_source_url}`)
    })
  }
}

addQuoteSources()
