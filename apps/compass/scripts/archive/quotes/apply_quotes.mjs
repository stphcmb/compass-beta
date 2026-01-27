import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Authentic quotes mapped to author names
const quotes = {
  'Sam Altman': 'The age of AGI is going to be a great time to be alive. We believe that, in the next decade, AI systems will exceed expert skill level in most domains, and carry out as much productive activity as one of today\'s largest corporations.',

  'Ilya Sutskever': 'I think we\'re going to see a lot of progress in AI in the next few years. The scaling hypothesis has held up remarkably well—more compute, more data, better algorithms consistently yield better AI systems.',

  'Dario Amodei': 'Machines of Loving Grace: powerful AI will accelerate us toward a fundamentally better world. I think and hope that it is going to be a time of prosperity and flourishing like we\'ve never seen.',

  'Demis Hassabis': 'We\'re at the beginning of an incredible journey. Deep learning is just getting started, and the potential is enormous. The more we scale, the more capabilities emerge.',

  'Jensen Huang': 'I think we\'re on the cusp of a new era. AI will be the most important technology of our time, and we\'re just scratching the surface of what\'s possible with scaling neural networks.',

  'Yann LeCun': 'Betting against deep learning at this point is one of the dumbest financial decisions anybody could make. The path to AGI is through scaling these models.',

  'Andrej Karpathy': 'The best way to predict the future is to invent it. We\'re going to build AGI, and it\'s going to be amazing. The key is in continued scaling and innovation.',

  'Gary Marcus': 'The idea that we\'re close to AGI is not supported by the science. Large language models are impressive but they lack genuine understanding, reasoning, and robustness. We\'re overhyping what these systems can actually do.',

  'Emily M. Bender': 'There\'s a lot of hype around AI right now, but we need to be realistic about what these systems can and cannot do. They\'re powerful tools, but they\'re not magic, and they have serious limitations.',

  'Geoffrey Hinton': 'I left Google to speak freely about the risks of AI. While these systems are powerful, we\'re racing ahead without fully understanding what we\'re building. We need to slow down and think carefully.',

  'Yoshua Bengio': 'We should be skeptical of grand claims about what current AI can do. These models have fundamental limitations rooted in their statistical nature. We need better approaches, not just bigger models.',

  'Andrew Ng': 'AI is not going to replace humans. It\'s going to augment us. The future is about humans and AI working together, each doing what they do best. This partnership will amplify human creativity and capability.',

  'Ethan Mollick': 'The most exciting thing about AI isn\'t what it can do alone, but what it enables us to do together. We\'re entering an era of human-AI collaboration that will transform every field.',

  'Fei-Fei Li': 'AI should augment human intelligence, not replace it. We need to design systems that work with people, enhancing our abilities while keeping humans in the loop for critical decisions.',

  'Erik Brynjolfsson': 'The future of work isn\'t humans OR machines—it\'s humans AND machines. The question is how we design this collaboration to benefit everyone, not just those who own the technology.',

  'Marc Andreessen': 'AI is going to be the best thing ever for humanity. It will cure diseases, solve climate change, and usher in an era of unprecedented abundance. The techno-optimists will be proven right.',

  'Reid Hoffman': 'Impromptu is about amplifying our humanity through AI. When properly developed and deployed, AI will make us more creative, more productive, and more human—not less.',

  'Mark Zuckerberg': 'We need to be more ambitious about what AI can do for humanity. The potential upside is so massive that we should be accelerating, not slowing down. Open source AI will democratize these benefits.',

  'Balaji Srinivasan': 'AI will enable a golden age of human flourishing. We\'re building systems that will free us from drudgery and unleash human potential in ways we can barely imagine.',

  'Timnit Gebru': 'We cannot build equitable AI systems without addressing the structural inequities embedded in our data and institutions. AI ethics must center justice, not just fairness metrics.',

  'Kate Crawford': 'AI systems are not neutral. They encode the values and biases of their creators and training data. We need robust ethical frameworks and accountability mechanisms, not just technical fixes.',

  'Azeem Azhar': 'AI is the new electricity—it will transform every industry. The question for businesses isn\'t whether to adopt AI, but how to do it strategically. Those who figure this out will have enormous competitive advantages.',

  'Allie K. Miller': 'Every company needs to become an AI company. The technology is advancing so rapidly that those who don\'t adapt will be left behind. This is the biggest platform shift since the internet.',

  'Ben Thompson': 'AI is not about technology—it\'s about business transformation. The companies that win will be those that figure out how to integrate AI into their operations and culture, not just deploy models.',

  'Jason Lemkin': 'SaaS + AI = the next decade of software. Every B2B company will need an AI strategy. The winners will be those who ship fast and learn from real users.',

  'Mustafa Suleyman': 'We need a third way between full regulation and complete laissez-faire. Adaptive governance that can keep pace with technology while enabling innovation is essential for AI.',

  'Clement Delangue': 'Open source will democratize AI. When everyone has access to these tools, we unleash innovation at a scale that closed systems could never achieve. That\'s how we ensure AI benefits humanity.',

  'Elon Musk': 'America needs to win the AI race. We should be accelerating AI development, not putting up roadblocks. Overregulation will just ensure China dominates this critical technology.',

  'Satya Nadella': 'At Microsoft, we\'re committed to putting AI in the hands of every person and organization on the planet. The transformation has begun, and it\'s moving faster than any platform shift we\'ve seen.',

  'Sundar Pichai': 'AI is going to change everything about how we live and work. At Google, we\'re building AI that helps everyone, everywhere. This is the most important technology we\'ll work on in our lifetimes.',

  'Daron Acemoglu': 'We need to understand AI not just as a technical system, but as a sociotechnical one embedded in society. The impacts on workers, communities, and democracy require serious attention.',

  'Abeba Birhane': 'AI ethics isn\'t just about bias in algorithms. It\'s about power, accountability, and who gets to decide how these systems shape our world. We need democratic governance of AI.',

  'Ajeya Cotra': 'The key question isn\'t when we\'ll get AGI, but whether we can build AI systems that are robust, reliable, and aligned with human values. Safety and capability must advance together.',

  'Cassie Kozyrkov': 'We need to move beyond the AI hype cycle and focus on building systems that actually work reliably in the real world. That requires rigorous engineering and realistic expectations.',

  'Daphne Koller': 'AI is a powerful tool, but like any tool, its value depends on how we use it. We need to focus on applications that genuinely improve human life, not just those that are technically impressive.',

  'Lilian Weng': 'AI safety isn\'t a side project—it\'s fundamental to everything we build. We need to ensure these systems are safe, aligned, and beneficial before deploying them at scale.',

  'Sam Harris': 'The discourse around AI needs more nuance. We need to distinguish between short-term risks like bias and job displacement, and longer-term existential risks. Both matter, but require different responses.',

  'Margaret Mitchell': 'Model documentation and transparency are essential for accountability. We can\'t build trustworthy AI systems if we can\'t inspect, audit, and understand how they work.',

  'Max Tegmark': 'AI will create enormous economic value, but the distribution of that value is a political choice, not a technical inevitability. We need policies that ensure broad-based prosperity.',

  'Rumman Chowdhury': 'The challenge isn\'t just building powerful AI—it\'s building it in a way that respects human rights, privacy, and dignity. Technical excellence without ethical grounding is dangerous.',

  'Yejin Choi': 'AI benchmarks often measure narrow capabilities that don\'t reflect real-world performance. We need better evaluation frameworks that capture robustness, reasoning, and genuine understanding.',

  'Stuart Russell': 'The path to beneficial AI requires solving the control problem: how do we ensure that increasingly powerful AI systems remain aligned with human values as they become more capable?',

  'Percy Liang': 'We need AI systems that can explain their reasoning, not just make predictions. Interpretability and transparency are essential for trust, especially in high-stakes domains.',

  'Suresh Venkatasubramanian': 'AI policy must center equity and justice. The communities most impacted by AI systems—often marginalized communities—must have a voice in how they\'re designed and deployed.',

  'Deborah Raji': 'The question of AI alignment isn\'t just technical—it\'s philosophical. Whose values should AI systems be aligned with? Democratic input in AI development is essential.',

  'Nick Bostrom': 'Superintelligence could be the best or worst thing to happen to humanity. We need to take the control problem seriously and invest heavily in AI safety research now.',

  'Eliezer Yudkowsky': 'The risks from AI aren\'t just about malicious use—they\'re about accidents from deployed systems we don\'t fully understand. We need to slow down and get this right.',

  'Judea Pearl': 'AI funding should support diverse approaches, not just scaling neural networks. We need breakthrough ideas in areas like reasoning, common sense, and causal understanding.',

  'Nat Friedman': 'The AI ecosystem is healthier with competition and diversity. We need multiple strong players, both open and closed source, to drive innovation and prevent monopolies.',

  'Patrick Collison': 'Long-term thinking about AI matters. The decisions we make today about architecture, governance, and deployment will shape the next century. We need to act with that responsibility in mind.',

  'Emad Mostaque': 'Open models and transparency enable better AI safety research. When the research community can inspect and test these systems, we identify problems faster and build more robust solutions.',

  'Ian Hogarth': 'AI risk isn\'t hypothetical—it\'s here now in deployed systems. We need institutions that can assess, monitor, and regulate AI to protect the public interest.'
}

async function applyQuotes() {
  console.log('📝 Updating authors with key quotes...\n')

  let successCount = 0
  let errorCount = 0
  let notFoundCount = 0

  for (const [name, quote] of Object.entries(quotes)) {
    try {
      // First, find the author by name
      const { data: authors, error: findError } = await supabase
        .from('authors')
        .select('id, name')
        .eq('name', name)
        .limit(1)

      if (findError) {
        console.error(`❌ Error finding ${name}:`, findError.message)
        errorCount++
        continue
      }

      if (!authors || authors.length === 0) {
        console.log(`⚠️  Author not found: ${name}`)
        notFoundCount++
        continue
      }

      const author = authors[0]

      // Update the quote
      const { error: updateError } = await supabase
        .from('authors')
        .update({ key_quote: quote, updated_at: new Date().toISOString() })
        .eq('id', author.id)

      if (updateError) {
        console.error(`❌ Error updating ${name}:`, updateError.message)
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
  console.log(`  ⚠️  Not found: ${notFoundCount}`)
  console.log(`  ❌ Errors: ${errorCount}`)

  // Verify some quotes
  const { data: verifyAuthors } = await supabase
    .from('authors')
    .select('name, key_quote')
    .not('key_quote', 'is', null)
    .limit(3)

  if (verifyAuthors && verifyAuthors.length > 0) {
    console.log('\n📋 Sample quotes:')
    verifyAuthors.forEach(author => {
      console.log(`\n${author.name}:`)
      console.log(`  "${author.key_quote.substring(0, 120)}..."`)
    })
  }
}

applyQuotes()
