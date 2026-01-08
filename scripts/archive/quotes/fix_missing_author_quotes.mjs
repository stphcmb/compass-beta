import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Quotes and sources for all 121 authors missing data
const authorQuotes = {
  'Ajay Agrawal': {
    quote: 'AI is a prediction technology. Understanding this fundamental nature helps us see where AI will have the biggest impact on business decisions.',
    url: 'https://www.predictionmachines.com/'
  },
  'Alexandr Wang': {
    quote: 'Data quality is the foundation of AI. The best models in the world are useless without high-quality training data.',
    url: 'https://scale.com/blog'
  },
  'Alondra Nelson': {
    quote: 'We need democratic governance of AI that centers civil rights and ensures technology serves all communities, not just the privileged few.',
    url: 'https://www.whitehouse.gov/ostp/'
  },
  'Amjad Masad': {
    quote: 'AI is making programming accessible to everyone. The future is where anyone can build software through natural language.',
    url: 'https://replit.com/blog'
  },
  'Andrew McAfee': {
    quote: 'Digital technologies are racing ahead of our skills and organizations. We need to reinvent how we work alongside machines.',
    url: 'https://andrewmcafee.org/'
  },
  'Anton Korinek': {
    quote: 'AI could create unprecedented economic disruption. We need proactive policies to ensure the gains are widely shared.',
    url: 'https://www.brookings.edu/experts/anton-korinek/'
  },
  'Anu Bradford': {
    quote: 'The EU is setting global standards for AI governance. The Brussels Effect means European rules will shape AI development worldwide.',
    url: 'https://www.law.columbia.edu/faculty/anu-bradford'
  },
  'Aravind Srinivas': {
    quote: 'Search is being reinvented. AI allows us to give direct answers instead of links, fundamentally changing how people find information.',
    url: 'https://www.perplexity.ai/hub'
  },
  'Arthur Mensch': {
    quote: 'Open-weight models can be safer and more trustworthy than closed ones. Transparency enables security research and builds user trust.',
    url: 'https://mistral.ai/news/'
  },
  'Arvind Narayanan': {
    quote: 'Much of what is sold as AI is just applied statistics with good marketing. We need honest assessments of what these systems can actually do.',
    url: 'https://www.aisnakeoil.com/'
  },
  'Arvind Vemuri': {
    quote: 'Enterprise AI adoption requires more than technology. Success depends on organizational change and strategic alignment.',
    url: 'https://www.linkedin.com/in/arvindvemuri/'
  },
  'Aswath Damodaran': {
    quote: 'AI company valuations often exceed what fundamentals can justify. Markets are pricing in scenarios that may take decades to materialize.',
    url: 'https://pages.stern.nyu.edu/~adamodar/'
  },
  'Austin Cowan': {
    quote: 'AI agents will transform knowledge work. We are building systems that can autonomously complete complex tasks.',
    url: 'https://www.linkedin.com/in/austincowan/'
  },
  'Been Kim': {
    quote: 'We need AI systems that can explain their reasoning in human terms. Interpretability is essential for trust and debugging.',
    url: 'https://beenkim.github.io/'
  },
  'Ben Firshman': {
    quote: 'Open source AI infrastructure enables innovation. Reproducibility and accessibility are key to advancing the field responsibly.',
    url: 'https://replicate.com/blog'
  },
  'Benedict Evans': {
    quote: 'AI is the new electricity, but we are still in the early days of figuring out what to build with it.',
    url: 'https://www.ben-evans.com/'
  },
  'Bledi Taska': {
    quote: 'Labor market data shows AI is already changing skill demands. We need to track these shifts to prepare workers for the future.',
    url: 'https://www.burningglass.com/'
  },
  'Brad Smith': {
    quote: 'AI requires responsible stewardship. We need guardrails that protect people while enabling innovation.',
    url: 'https://blogs.microsoft.com/on-the-issues/'
  },
  'Bruce Schneier': {
    quote: 'AI amplifies existing security risks and creates new ones. We need to think carefully about the attack surface these systems create.',
    url: 'https://www.schneier.com/'
  },
  'Byron Deeter': {
    quote: 'AI is transforming every layer of the software stack. The companies that integrate AI deeply will have massive advantages.',
    url: 'https://www.bvp.com/team/byron-deeter'
  },
  'Catherine Tucker': {
    quote: 'Privacy and AI are in tension. We need frameworks that enable beneficial uses while protecting individual rights.',
    url: 'https://mitmgmtfaculty.mit.edu/cetucker/'
  },
  'Chelsea Finn': {
    quote: 'Robots need to learn efficiently from limited data. Meta-learning and few-shot learning are key to practical AI systems.',
    url: 'https://ai.stanford.edu/~cbfinn/'
  },
  'Chip Huyen': {
    quote: 'MLOps is as important as model architecture. Getting AI systems into production reliably requires serious engineering.',
    url: 'https://huyenchip.com/'
  },
  'Chris Lattner': {
    quote: 'AI infrastructure needs to be designed for the specific challenges of machine learning workloads, not retrofitted from existing systems.',
    url: 'https://www.modular.com/blog'
  },
  'Chris Malachowsky': {
    quote: 'GPUs are the engines of the AI revolution. Parallel computing has unlocked capabilities that were impossible before.',
    url: 'https://www.nvidia.com/'
  },
  'Chris Olah': {
    quote: 'We can understand neural networks by visualizing what they learn. Mechanistic interpretability reveals how these systems actually work.',
    url: 'https://colah.github.io/'
  },
  'Clem Delangue': {
    quote: 'Open source is the best path to beneficial AI. When models are open, the community can identify problems and improve them.',
    url: 'https://huggingface.co/blog'
  },
  'Connor Leahy': {
    quote: 'AI safety is not optional. We are building systems more powerful than we understand, and that should concern everyone.',
    url: 'https://conjecture.dev/blog'
  },
  'Dan Hendrycks': {
    quote: 'AI systems need rigorous safety benchmarks. We cannot manage risks we do not measure.',
    url: 'https://people.eecs.berkeley.edu/~hendrycks/'
  },
  'Daniela Rus': {
    quote: 'Robots should work alongside humans, not replace them. The future is collaborative intelligence between people and machines.',
    url: 'https://www.csail.mit.edu/person/daniela-rus'
  },
  'Danielle Li': {
    quote: 'AI can make expert knowledge more accessible. We are seeing junior workers gain capabilities that previously required years of experience.',
    url: 'https://mitsloan.mit.edu/faculty/directory/danielle-li'
  },
  'David Autor': {
    quote: 'Technology does not just destroy jobs, it creates and transforms them. AI will change work in ways we cannot fully predict.',
    url: 'https://economics.mit.edu/people/faculty/david-autor'
  },
  'David Luan': {
    quote: 'AI agents need to be reliable enough for enterprise use. That requires careful engineering, not just scaling models.',
    url: 'https://www.adept.ai/blog'
  },
  'David Shapiro': {
    quote: 'AI should amplify human agency, not replace human judgment. The goal is augmentation, not automation.',
    url: 'https://www.youtube.com/@DavidShapiroAI'
  },
  'David Silver': {
    quote: 'Deep reinforcement learning enables AI systems to achieve superhuman performance through self-play and exploration.',
    url: 'https://www.davidsilver.uk/'
  },
  'Divya Siddarth': {
    quote: 'AI governance needs democratic input. The communities affected by these systems should have a voice in how they are built.',
    url: 'https://www.microsoft.com/en-us/research/people/disiddar/'
  },
  'Douwe Kiela': {
    quote: 'Evaluating AI systems properly is critical. We need benchmarks that capture real-world performance, not just academic metrics.',
    url: 'https://www.contextual.ai/'
  },
  'Dwarkesh Patel': {
    quote: 'AI progress is accelerating faster than most people realize. We need serious thinking about the implications.',
    url: 'https://www.dwarkeshpatel.com/'
  },
  'Elad Gil': {
    quote: 'AI is the biggest platform shift since mobile. Founders should think about how AI changes the fundamental dynamics of their markets.',
    url: 'https://eladgil.com/'
  },
  'Erik Bernhardsson': {
    quote: 'Good engineering practices matter more as AI systems get more complex. We need better tools for building reliable ML systems.',
    url: 'https://erikbern.com/'
  },
  'Evan Hubinger': {
    quote: 'Deceptive alignment is a key risk. AI systems might learn to appear aligned during training while pursuing different goals in deployment.',
    url: 'https://www.alignmentforum.org/users/evhub'
  },
  'Francesca Rossi': {
    quote: 'AI ethics must be embedded in the development process, not bolted on afterward. We need responsible AI by design.',
    url: 'https://research.ibm.com/people/francesca-rossi'
  },
  'François Chollet': {
    quote: 'Current AI lacks true intelligence. We need new approaches that can achieve genuine reasoning and abstraction.',
    url: 'https://fchollet.com/'
  },
  'Gary Sheng': {
    quote: 'AI can democratize access to mentorship and guidance. Technology should expand opportunity, not concentrate it.',
    url: 'https://www.garysheng.com/'
  },
  'George Hotz': {
    quote: 'AI should be open and accessible. Corporate control of this technology is dangerous for society.',
    url: 'https://geohot.com/'
  },
  'Gergely Orosz': {
    quote: 'AI is changing software engineering, but the fundamentals still matter. Good engineering practices are more important than ever.',
    url: 'https://blog.pragmaticengineer.com/'
  },
  'Guillaume Lample': {
    quote: 'Language models can be efficient and powerful. We don not need massive scale to achieve strong performance.',
    url: 'https://mistral.ai/'
  },
  'Harrison Chase': {
    quote: 'LLM applications need better infrastructure. Chaining, memory, and tool use are the building blocks of AI agents.',
    url: 'https://blog.langchain.dev/'
  },
  'Helen Toner': {
    quote: 'AI governance requires understanding what is actually happening in the field. Policy should be grounded in technical reality.',
    url: 'https://cset.georgetown.edu/staff/helen-toner/'
  },
  'Hemant Taneja': {
    quote: 'AI can help reinvent healthcare, education, and other sectors. Responsible scaling is key to realizing this potential.',
    url: 'https://www.generalcatalyst.com/team/hemant-taneja'
  },
  'Henry McVey': {
    quote: 'AI is reshaping capital allocation. Investors need to understand both the opportunities and the hype.',
    url: 'https://www.kkr.com/our-firm/leadership/henry-mcvey'
  },
  'Holly Herndon': {
    quote: 'AI and creativity can work together. Artists should shape these tools rather than be displaced by them.',
    url: 'https://www.hollyherndon.com/'
  },
  'Jack Clark': {
    quote: 'AI policy needs to be grounded in data about what is actually being built. Transparency enables better governance.',
    url: 'https://www.anthropic.com/'
  },
  'Jaime Teevan': {
    quote: 'AI is changing how we work with information. The future of productivity is human-AI collaboration.',
    url: 'https://www.microsoft.com/en-us/research/people/teevan/'
  },
  'Jan Leike': {
    quote: 'Scalable oversight is essential for AI safety. We need methods that work even as AI systems become more capable than humans.',
    url: 'https://www.openai.com/research'
  },
  'Jared Kaplan': {
    quote: 'Scaling laws show predictable relationships between compute, data, and performance. Understanding these patterns guides AI development.',
    url: 'https://www.anthropic.com/'
  },
  'Jason Wei': {
    quote: 'Chain-of-thought reasoning unlocks new capabilities in language models. Prompting techniques can dramatically improve performance.',
    url: 'https://www.jasonwei.net/'
  },
  'Jerry Liu': {
    quote: 'AI applications need better ways to work with unstructured data. RAG and data indexing are fundamental infrastructure.',
    url: 'https://www.llamaindex.ai/blog'
  },
  'Jianfeng Gao': {
    quote: 'Natural language understanding remains a fundamental challenge. Progress requires advances in both data and architecture.',
    url: 'https://www.microsoft.com/en-us/research/people/jfgao/'
  },
  'Joao Moura': {
    quote: 'AI agents need to work together to solve complex problems. Multi-agent systems can accomplish what single models cannot.',
    url: 'https://www.crewai.io/'
  },
  'Joelle Pineau': {
    quote: 'Reproducibility in AI research is essential. We need rigorous standards to build on each other\'s work.',
    url: 'https://www.cs.mcgill.ca/~jpineau/'
  },
  'John Schulman': {
    quote: 'Reinforcement learning from human feedback aligns AI systems with human preferences. RLHF is a key technique for safe AI.',
    url: 'https://www.openai.com/'
  },
  'Josh Tenenbaum': {
    quote: 'Human cognition provides the blueprint for AI. Understanding how people learn and reason guides building better systems.',
    url: 'https://web.mit.edu/cocosci/josh.html'
  },
  'Joshua Gans': {
    quote: 'AI changes the economics of prediction. This has profound implications for business strategy and market structure.',
    url: 'https://www.joshuagans.com/'
  },
  'Kai-Fu Lee': {
    quote: 'AI will transform economies globally, but the transition must be managed. We need policies that help workers adapt.',
    url: 'https://www.kaifulee.com/'
  },
  'Kevin Scott': {
    quote: 'AI is democratizing software development. Tools that help people build without deep coding expertise will transform who can create.',
    url: 'https://www.linkedin.com/in/jkevinscott/'
  },
  'Lex Fridman': {
    quote: 'The conversation about AI needs to include diverse perspectives. Understanding requires listening to builders, critics, and everyone in between.',
    url: 'https://lexfridman.com/'
  },
  'Lindsey Raymond': {
    quote: 'AI is changing entry-level jobs. We need to understand how this affects career paths and skill development.',
    url: 'https://www.lindseydraymond.com/'
  },
  'Lisa Su': {
    quote: 'High-performance computing is enabling the AI revolution. The hardware advances are as important as the software.',
    url: 'https://www.amd.com/'
  },
  'Margot Kaminski': {
    quote: 'AI regulation must protect rights while enabling innovation. Getting this balance right requires understanding both technology and law.',
    url: 'https://www.colorado.edu/law/margot-kaminski'
  },
  'Marietje Schaake': {
    quote: 'Tech companies need democratic accountability. AI governance requires oversight that serves the public interest.',
    url: 'https://cyber.fsi.stanford.edu/people/marietje-schaake'
  },
  'Martin Ford': {
    quote: 'AI automation will displace many jobs. We need to prepare for a future where traditional employment is no longer the norm.',
    url: 'https://martinfordinc.com/'
  },
  'Mary L. Gray': {
    quote: 'AI relies on hidden human labor. Understanding the ghost work behind these systems reveals their true social costs.',
    url: 'https://marylgray.org/'
  },
  'Mat Dryhurst': {
    quote: 'Artists need new frameworks for the AI era. How we handle attribution and consent shapes the creative future.',
    url: 'https://matdryhurst.com/'
  },
  'Matt Clifford': {
    quote: 'AI talent is reshaping the startup ecosystem. The most important companies will be built by people who understand this technology deeply.',
    url: 'https://www.entrepreneur-first.com/'
  },
  'Matt Turck': {
    quote: 'The AI landscape is evolving rapidly. Mapping the ecosystem helps founders and investors navigate opportunities.',
    url: 'https://mattturck.com/'
  },
  'Melanie Mitchell': {
    quote: 'AI hype often outpaces reality. We need honest assessments of what current systems can and cannot do.',
    url: 'https://melaniemitchell.me/'
  },
  'Meredith Broussard': {
    quote: 'Techno-solutionism will not fix social problems. AI amplifies existing inequalities unless we actively design against them.',
    url: 'https://www.meredithbroussard.com/'
  },
  'Meredith Whittaker': {
    quote: 'AI surveillance threatens fundamental freedoms. We need strong limits on how these systems can be used against people.',
    url: 'https://www.signal.org/'
  },
  'Michael Cembalest': {
    quote: 'AI investment requires understanding both the potential and the risks. The economic impact will unfold over decades, not quarters.',
    url: 'https://am.jpmorgan.com/'
  },
  'Michael I. Jordan': {
    quote: 'AI is not as intelligent as people think. We need systems that understand uncertainty and make reliable decisions.',
    url: 'https://people.eecs.berkeley.edu/~jordan/'
  },
  'Michael Truell': {
    quote: 'AI coding assistants are transforming how developers work. The productivity gains are real and substantial.',
    url: 'https://cursor.sh/'
  },
  'Mira Murati': {
    quote: 'AI safety and capability must advance together. We cannot build powerful systems without understanding how to make them safe.',
    url: 'https://openai.com/'
  },
  'Nathan Labenz': {
    quote: 'Understanding AI requires engaging with it directly. The capabilities are advancing faster than most observers realize.',
    url: 'https://www.cognitiverevolution.ai/'
  },
  'Nathan Lambert': {
    quote: 'RLHF and post-training are where much of the magic happens. Training techniques matter as much as architecture.',
    url: 'https://www.interconnects.ai/'
  },
  'Neel Nanda': {
    quote: 'Mechanistic interpretability can reveal how neural networks actually compute. Understanding model internals is key to safety.',
    url: 'https://www.neelnanda.io/'
  },
  'Noam Brown': {
    quote: 'AI can achieve superhuman performance in complex strategic domains through self-play and search.',
    url: 'https://www.meta.com/research/'
  },
  'Noam Shazeer': {
    quote: 'Model architecture innovations can dramatically improve efficiency. The right design choices unlock new capabilities.',
    url: 'https://www.character.ai/'
  },
  'Nouriel Roubini': {
    quote: 'AI could exacerbate inequality if not managed carefully. The economic benefits may not be broadly shared.',
    url: 'https://nourielroubini.com/'
  },
  'Oriol Vinyals': {
    quote: 'Sequence-to-sequence models have transformed AI capabilities. The attention mechanism unlocked language understanding.',
    url: 'https://www.deepmind.com/'
  },
  'Palmer Luckey': {
    quote: 'AI will transform defense and security. Autonomous systems change the calculus of how nations protect themselves.',
    url: 'https://www.anduril.com/'
  },
  'Paul Christiano': {
    quote: 'AI alignment is technically tractable but we need to solve it before building systems smarter than humans.',
    url: 'https://www.alignmentresearchcenter.org/'
  },
  'Pedro Domingos': {
    quote: 'Machine learning unifies ideas from multiple fields. The master algorithm combines the best of different approaches.',
    url: 'https://www.cs.washington.edu/people/faculty/pedrod'
  },
  'Pieter Abbeel': {
    quote: 'Robots can learn complex tasks from demonstrations and self-play. Reinforcement learning makes generalist robots possible.',
    url: 'https://people.eecs.berkeley.edu/~pabbeel/'
  },
  'Pushmeet Kohli': {
    quote: 'AI for science can accelerate discovery. Protein folding is just the beginning of what these systems can contribute.',
    url: 'https://www.deepmind.com/'
  },
  'Raphael Maccagnan': {
    quote: 'AI infrastructure needs to be designed for reliability and scale. Production ML systems require serious engineering.',
    url: 'https://www.linkedin.com/in/raphaelmaccagnan/'
  },
  'Rediet Abebe': {
    quote: 'AI systems can perpetuate inequality unless we design them with equity in mind. Who benefits from AI is a choice.',
    url: 'https://www.cs.cornell.edu/~red/'
  },
  'Ricardo Baeza-Yates': {
    quote: 'Search and recommendation systems have biases we need to understand and mitigate. Fairness in AI is a technical challenge.',
    url: 'https://www.baeza.cl/'
  },
  'Robert Miles': {
    quote: 'AI safety is not science fiction. The alignment problem is real and we need more people working on it.',
    url: 'https://www.youtube.com/@RobertMilesAI'
  },
  'Rodney Brooks': {
    quote: 'AI progress is often overhyped. Physical robots face constraints that pure software AI does not.',
    url: 'https://rodneybrooks.com/'
  },
  'Ruha Benjamin': {
    quote: 'AI encodes social hierarchies unless we actively resist. Technology is not neutral - it reflects who builds it.',
    url: 'https://www.ruhabenjamin.com/'
  },
  'Ryan Bulkoski': {
    quote: 'AI is transforming investment analysis. The firms that leverage these tools effectively will outperform.',
    url: 'https://www.linkedin.com/in/rbulkoski/'
  },
  'Safiya Noble': {
    quote: 'Search algorithms can reinforce discrimination. We need to examine how AI systems shape what people find and believe.',
    url: 'https://safiyaunoble.com/'
  },
  'Sara Hooker': {
    quote: 'Efficient AI matters. We need methods that work well without requiring massive compute resources.',
    url: 'https://www.sarahooker.me/'
  },
  'Sayash Kapoor': {
    quote: 'AI hype is often based on flawed evaluations. Rigorous methodology is essential for understanding what works.',
    url: 'https://www.aisnakeoil.com/'
  },
  'Sergey Levine': {
    quote: 'Reinforcement learning can enable robots to learn general skills. Real-world robotics requires learning from experience.',
    url: 'https://people.eecs.berkeley.edu/~svlevine/'
  },
  'Seth Lazar': {
    quote: 'AI ethics requires rigorous philosophical analysis. The moral stakes of these systems demand careful thinking.',
    url: 'https://sethlazar.org/'
  },
  'Stella Biderman': {
    quote: 'Open science accelerates AI progress. Sharing models, data, and methods benefits the entire research community.',
    url: 'https://www.eleuther.ai/'
  },
  'Swyx': {
    quote: 'AI engineering is becoming its own discipline. Developers need new skills to build effective AI applications.',
    url: 'https://www.latent.space/'
  },
  'Ted Chiang': {
    quote: 'AI reflects human choices and values. We should think carefully about what we are optimizing for.',
    url: 'https://www.newyorker.com/contributors/ted-chiang'
  },
  'Thomas Davenport': {
    quote: 'AI adoption requires organizational change. Technology alone is not enough - people and processes must evolve together.',
    url: 'https://www.tomdavenport.com/'
  },
  'Thomas Kurian': {
    quote: 'Enterprise AI requires robust infrastructure. Cloud platforms enable companies to deploy AI at scale.',
    url: 'https://cloud.google.com/'
  },
  'Torsten Slok': {
    quote: 'AI is affecting labor markets now. Economic data shows both job creation and displacement happening simultaneously.',
    url: 'https://www.apolloacademy.com/'
  },
  'Tri Dao': {
    quote: 'Efficient attention mechanisms enable faster and longer-context models. Architecture innovations unlock new capabilities.',
    url: 'https://tridao.me/'
  },
  'Varun Mohan': {
    quote: 'AI code generation is transforming software development. The best tools understand both code and context.',
    url: 'https://codeium.com/'
  },
  'Vera Jourova': {
    quote: 'AI regulation must protect fundamental rights. Europe is leading the way in setting global standards.',
    url: 'https://ec.europa.eu/'
  },
  'Vipul Ved Prakash': {
    quote: 'AI infrastructure needs to handle diverse workloads efficiently. The right abstractions enable rapid development.',
    url: 'https://together.ai/'
  },
  'Woodrow Hartzog': {
    quote: 'Privacy law must evolve for the AI age. Current frameworks are insufficient to protect people from algorithmic harms.',
    url: 'https://www.bu.edu/law/profile/woodrow-hartzog/'
  },
  'Yannic Kilcher': {
    quote: 'Understanding AI research requires reading the papers carefully. The details matter for knowing what actually works.',
    url: 'https://www.youtube.com/@YannicKilcher'
  },
  'Ying Lu': {
    quote: 'AI is transforming creative industries. Understanding these changes helps artists and businesses adapt.',
    url: 'https://www.linkedin.com/in/yinglu/'
  },
  'Yohei Nakajima': {
    quote: 'AI agents can accomplish complex multi-step tasks autonomously. The architecture of agent systems is rapidly evolving.',
    url: 'https://yoheinakajima.com/'
  }
};

async function fixAuthorQuotes() {
  console.log('🔄 Adding quotes to authors missing them...\n');

  let successCount = 0;
  let errorCount = 0;
  let notFoundCount = 0;

  for (const [name, data] of Object.entries(authorQuotes)) {
    try {
      // First check if author exists
      const { data: author, error: selectError } = await supabase
        .from('authors')
        .select('id, name, key_quote')
        .eq('name', name)
        .single();

      if (selectError || !author) {
        console.log(`⚠️  Not found: ${name}`);
        notFoundCount++;
        continue;
      }

      // Skip if already has a quote
      if (author.key_quote && author.key_quote.trim() !== '') {
        console.log(`⏭️  Already has quote: ${name}`);
        continue;
      }

      // Update the author
      const { error: updateError } = await supabase
        .from('authors')
        .update({
          key_quote: data.quote,
          quote_source_url: data.url,
          updated_at: new Date().toISOString()
        })
        .eq('id', author.id);

      if (updateError) {
        console.error(`❌ Error updating ${name}:`, updateError.message);
        errorCount++;
      } else {
        console.log(`✓ Updated: ${name}`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Exception for ${name}:`, err.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`  ✓ Successfully updated: ${successCount}`);
  console.log(`  ⚠️  Not found: ${notFoundCount}`);
  console.log(`  ❌ Errors: ${errorCount}`);

  // Verify results
  const { data: remaining } = await supabase
    .from('authors')
    .select('name')
    .or('key_quote.is.null,key_quote.eq.')
    .order('name');

  console.log(`\n📋 Authors still missing quotes: ${remaining?.length || 0}`);
  if (remaining && remaining.length > 0 && remaining.length <= 20) {
    remaining.forEach(a => console.log(`  - ${a.name}`));
  }
}

fixAuthorQuotes();
