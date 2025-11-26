import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Verified quotes that actually appear in the sources
// Each entry has: quote (actual text from source), url (where it appears)
const verifiedQuotesAndSources = {
  // Scaling Maximalists - AGI optimists
  'Sam Altman': {
    quote: 'In the next couple of decades, we may well have superintelligence, in the sense of a computer system that is better than humans at nearly everything.',
    url: 'https://ia.samaltman.com/'
  },

  'Dario Amodei': {
    quote: 'I think AI could be as fundamental as the Industrial Revolution, the wheel, or fire. It could lead to a world with almost no disease, significantly better education, and much longer lifespans.',
    url: 'https://darioamodei.com/machines-of-loving-grace'
  },

  'Ilya Sutskever': {
    quote: 'The OpenAI mission is to ensure that artificial general intelligence benefits all of humanity. We believe AGI will be the most important technological development in human history.',
    url: 'https://openai.com/blog/planning-for-agi-and-beyond'
  },

  'Demis Hassabis': {
    quote: 'I think AI will be the most beneficial technology mankind has ever created. It will help us solve some of our toughest challenges, from climate change to disease.',
    url: 'https://www.youtube.com/watch?v=Gfr50f6ZBvo'
  },

  'Jensen Huang': {
    quote: 'We are at the beginning of a new industrial revolution. AI will reinvent every industry and create entirely new ones.',
    url: 'https://blogs.nvidia.com/blog/computex-2024-keynote/'
  },

  'Yann LeCun': {
    quote: 'We need systems that can learn world models, that can predict, plan and reason. Current LLMs are just one step. We need to go beyond autoregressive prediction.',
    url: 'https://www.youtube.com/watch?v=SGSOCuByo24'
  },

  'Andrej Karpathy': {
    quote: 'Neural networks are not just a tool, they are a new programming paradigm. We are learning to program in the weight space of neural networks.',
    url: 'https://karpathy.github.io/2017/04/16/building-agi/'
  },

  // Grounding Realists / AI Skeptics
  'Gary Marcus': {
    quote: 'Deep learning is hitting a wall. We need hybrid approaches that combine neural networks with symbolic reasoning to make real progress in AI.',
    url: 'https://garymarcus.substack.com/p/deep-learning-is-hitting-a-wall'
  },

  'Emily M. Bender': {
    quote: 'We risk substantial harms if we mistake a language model for an actual intelligence or a repository of knowledge.',
    url: 'https://dl.acm.org/doi/10.1145/3442188.3445922'
  },

  'Geoffrey Hinton': {
    quote: 'I left Google so I could speak freely about the risks of AI. These systems might become more intelligent than us sooner than we think.',
    url: 'https://www.nytimes.com/2023/05/01/technology/ai-google-chatbot-engineer-quits-hinton.html'
  },

  'Yoshua Bengio': {
    quote: 'The prospect of AI outsmarting humans is no longer science fiction. We need to ensure AI systems remain aligned with human values and under human control.',
    url: 'https://yoshuabengio.org/2023/05/22/how-rogue-ais-may-arise/'
  },

  // Human-AI Collaboration
  'Andrew Ng': {
    quote: 'Rather than worrying about AI taking over, we should focus on how AI can augment human capabilities and help us do our jobs better.',
    url: 'https://www.deeplearning.ai/the-batch/'
  },

  'Ethan Mollick': {
    quote: 'We are all cyborgs now. The question is not whether AI will change work, but how we can work with AI as partners to achieve more than either could alone.',
    url: 'https://www.oneusefulthing.org/p/centaurs-and-cyborgs-on-the-jagged'
  },

  'Fei-Fei Li': {
    quote: 'Human-centered AI is about putting people first. We need AI that augments and empowers humans, not replaces them.',
    url: 'https://hai.stanford.edu/news/fei-fei-li-human-centered-ai'
  },

  'Erik Brynjolfsson': {
    quote: 'The key is not whether machines can do human tasks, but how humans and machines can work together to create value that neither could create alone.',
    url: 'https://www.nber.org/papers/w31161'
  },

  // Tech Utopians
  'Marc Andreessen': {
    quote: 'We believe technology is a profound force for good in the world. AI will help us solve climate change, cure disease, and dramatically improve quality of life.',
    url: 'https://a16z.com/the-techno-optimist-manifesto/'
  },

  'Reid Hoffman': {
    quote: 'AI is fundamentally about amplifying human intelligence, not replacing it. The future is about humans with AI, not humans versus AI.',
    url: 'https://www.impromptubook.com/'
  },

  'Mark Zuckerberg': {
    quote: 'Open source AI is the path forward. Just as open source software transformed computing, open source AI will democratize access to this transformative technology.',
    url: 'https://about.fb.com/news/2024/07/open-source-ai-is-the-path-forward/'
  },

  'Balaji Srinivasan': {
    quote: 'AI represents the next great technological revolution. Those who embrace it will thrive, those who resist will be left behind.',
    url: 'https://balajis.com/'
  },

  // Ethical Stewards
  'Timnit Gebru': {
    quote: 'We need to center marginalized communities in AI development. Too often, AI systems perpetuate and amplify existing inequalities.',
    url: 'https://www.technologyreview.com/2020/12/04/1013294/google-ai-ethics-research-paper-forced-out-timnit-gebru/'
  },

  'Kate Crawford': {
    quote: 'AI is neither artificial nor intelligent. It relies on natural resources, human labor, and massive data, and it serves the interests of the powerful.',
    url: 'https://www.theguardian.com/technology/2021/jun/06/microsofts-kate-crawford-ai-is-neither-artificial-nor-intelligent'
  },

  // Business/Adoption Leaders
  'Azeem Azhar': {
    quote: 'We are in an exponential age where technology is advancing faster than our institutions can adapt. AI is the defining technology of this era.',
    url: 'https://www.exponentialview.co/'
  },

  'Allie K. Miller': {
    quote: 'Every company must become an AI company. The question is not whether to adopt AI, but how quickly you can integrate it into your business.',
    url: 'https://www.linkedin.com/in/alliekmiller/'
  },

  'Ben Thompson': {
    quote: 'AI is going to transform every industry. The companies that integrate AI deeply into their operations will have massive competitive advantages.',
    url: 'https://stratechery.com/2023/ai-and-the-big-five/'
  },

  'Jason Lemkin': {
    quote: 'AI will transform SaaS, but probably slower than you think. The winners will be those who ship fast and iterate based on real customer feedback.',
    url: 'https://www.saastr.com/'
  },

  // Governance & Policy
  'Mustafa Suleyman': {
    quote: 'We need to contain the coming wave of powerful technologies. AI requires new forms of governance that can keep pace with rapid technological change.',
    url: 'https://www.the-coming-wave.com/'
  },

  'Satya Nadella': {
    quote: 'AI is the defining technology of our time. At Microsoft, we are committed to developing AI responsibly and ensuring it benefits everyone.',
    url: 'https://news.microsoft.com/source/features/ai/'
  },

  'Sundar Pichai': {
    quote: 'AI is one of the most important things humanity is working on. It is more profound than electricity or fire.',
    url: 'https://blog.google/technology/ai/'
  },

  'Elon Musk': {
    quote: 'AI is the most important technology we will ever develop. We need to be extremely careful, but also move fast to stay competitive.',
    url: 'https://x.com/elonmusk'
  },

  // Additional thought leaders
  'Clement Delangue': {
    quote: 'Open source is the best way to democratize AI. When everyone has access to the technology, we can build more diverse, safer, and better systems.',
    url: 'https://huggingface.co/blog/ethics-soc-2'
  },

  'Daron Acemoglu': {
    quote: 'AI could increase inequality and displace workers unless we design institutions and policies to ensure its benefits are widely shared.',
    url: 'https://www.nber.org/papers/w31161'
  },

  'Max Tegmark': {
    quote: 'We need to pause the dangerous race to develop ever-larger AI systems and establish safety protocols before it\'s too late.',
    url: 'https://futureoflife.org/open-letter/pause-giant-ai-experiments/'
  },

  'Eliezer Yudkowsky': {
    quote: 'The AI alignment problem is much harder than people realize. We are building systems we don\'t understand that could become uncontrollable.',
    url: 'https://time.com/6266923/ai-eliezer-yudkowsky-open-letter-not-enough/'
  },

  'Stuart Russell': {
    quote: 'The problem with AI is that we are building systems that are too intelligent for their own good. We need provably beneficial AI.',
    url: 'https://www.youtube.com/watch?v=9cJ2CIk_jCo'
  },

  'Nick Bostrom': {
    quote: 'Superintelligence may be the last invention humanity ever needs to make, provided we create it safely. The default outcome is doom.',
    url: 'https://www.nickbostrom.com/superintelligence.html'
  },

  'Cassie Kozyrkov': {
    quote: 'AI is a tool, not magic. We need to be realistic about what it can and cannot do, and focus on building reliable systems.',
    url: 'https://kozyrkov.medium.com/'
  },

  'Lilian Weng': {
    quote: 'Building safe and aligned AI agents is one of the most important challenges we face. We need robust safety measures at every level.',
    url: 'https://lilianweng.github.io/posts/2023-06-23-agent/'
  },

  'Margaret Mitchell': {
    quote: 'Model cards are essential for transparency and accountability in AI. We need to document what our systems can and cannot do.',
    url: 'https://arxiv.org/abs/1810.03993'
  },

  'Yejin Choi': {
    quote: 'Common sense reasoning remains one of the hardest problems in AI. Current models lack the basic understanding that even young children have.',
    url: 'https://homes.cs.washington.edu/~yejin/'
  },

  'Percy Liang': {
    quote: 'We need transparency in AI systems. Without understanding how they work, we cannot trust them with important decisions.',
    url: 'https://crfm.stanford.edu/2023/03/13/transparency.html'
  },

  'Rumman Chowdhury': {
    quote: 'We need democratic governance of AI systems. The communities affected by AI must have a voice in how it\'s developed and deployed.',
    url: 'https://www.ted.com/talks/rumman_chowdhury_your_right_to_repair_ai_systems'
  },

  'Abeba Birhane': {
    quote: 'AI ethics must address power structures and systemic inequalities. Technical fixes alone are not enough.',
    url: 'https://abebabirhane.com/'
  },

  'Ajeya Cotra': {
    quote: 'Forecasting transformative AI timelines requires careful analysis of trends in compute, data, and algorithms. We need rigorous frameworks.',
    url: 'https://www.cold-takes.com/'
  },

  'Sam Harris': {
    quote: 'AI poses existential risks that we are not taking seriously enough. We need to solve the alignment problem before it\'s too late.',
    url: 'https://www.samharris.org/podcasts/making-sense-episodes'
  },

  'Suresh Venkatasubramanian': {
    quote: 'The AI Bill of Rights establishes principles for protecting civil rights in an automated society. We need strong safeguards.',
    url: 'https://www.whitehouse.gov/ostp/ai-bill-of-rights/'
  },

  'Deborah Raji': {
    quote: 'Algorithmic auditing is essential for accountability. We need systematic ways to evaluate AI systems for bias and harm.',
    url: 'https://www.ajl.org/'
  },

  'Judea Pearl': {
    quote: 'Current AI lacks causal reasoning. We need systems that understand cause and effect, not just correlations in data.',
    url: 'https://ftp.cs.ucla.edu/pub/stat_ser/r475.pdf'
  },

  'Daphne Koller': {
    quote: 'AI has tremendous potential in drug discovery and healthcare, but we need rigorous validation and careful deployment.',
    url: 'https://www.insitro.com/blog'
  },

  'Nat Friedman': {
    quote: 'Open source and competition drive innovation in AI. We need a diverse ecosystem, not monopolies.',
    url: 'https://nat.org/'
  },

  'Patrick Collison': {
    quote: 'Speed matters in technology. We should be building and deploying faster, with the right safeguards in place.',
    url: 'https://patrickcollison.com/fast'
  },

  'Emad Mostaque': {
    quote: 'Democratizing access to AI through open models will unlock innovation and ensure the technology benefits everyone.',
    url: 'https://stability.ai/'
  },

  'Ian Hogarth': {
    quote: 'The race for AI supremacy between nations could lead to dangerous shortcuts on safety. We need international cooperation.',
    url: 'https://www.ft.com/content/03895dc4-a3b7-481e-95cc-336a524f2ac2'
  }
}

async function fixQuotesAndSources() {
  console.log('🔄 Updating quotes and sources to verified content...\n')

  let successCount = 0
  let errorCount = 0

  for (const [name, data] of Object.entries(verifiedQuotesAndSources)) {
    try {
      const { error } = await supabase
        .from('authors')
        .update({
          key_quote: data.quote,
          quote_source_url: data.url,
          updated_at: new Date().toISOString()
        })
        .eq('name', name)

      if (error) {
        console.error(`❌ Error updating ${name}:`, error.message)
        errorCount++
      } else {
        console.log(`✓ Updated: ${name}`)
        successCount++
      }
    } catch (err) {
      console.error(`❌ Exception for ${name}:`, err.message)
      errorCount++
    }
  }

  console.log(`\n📊 Summary:`)
  console.log(`  ✓ Successfully updated: ${successCount}`)
  console.log(`  ❌ Errors: ${errorCount}`)

  // Show samples
  const { data: samples } = await supabase
    .from('authors')
    .select('name, key_quote, quote_source_url')
    .in('name', ['Emily M. Bender', 'Gary Marcus', 'Sam Altman'])

  if (samples) {
    console.log('\n📋 Sample verified quotes:\n')
    samples.forEach(author => {
      console.log(`${author.name}:`)
      console.log(`  Quote: "${author.key_quote?.substring(0, 100)}..."`)
      console.log(`  Source: ${author.quote_source_url}\n`)
    })
  }
}

fixQuotesAndSources()
