import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const whyItMattersUpdates = [
  // High-priority authors
  { author: 'Stuart Russell', camp: 'Safety First',
    why_it_matters: 'Stuart Russell literally wrote the textbook on AI (Artificial Intelligence: A Modern Approach). His pivot to safety concerns carries exceptional weight given his foundational role in the field.' },
  { author: 'Stuart Russell', camp: 'Regulatory Interventionist',
    why_it_matters: 'As author of Human Compatible and founder of CHAI at Berkeley, Russell advocates for AI systems that are provably beneficial. His regulatory stance is grounded in deep technical understanding.' },
  { author: 'Eliezer Yudkowsky', camp: 'Safety First',
    why_it_matters: 'Yudkowsky founded MIRI and pioneered AI alignment research decades before it was mainstream. His warnings about superintelligence risk shaped the entire AI safety field.' },
  { author: 'Eliezer Yudkowsky', camp: 'Regulatory Interventionist',
    why_it_matters: 'His advocacy for compute governance and training pauses influenced policy discussions globally. TIME magazine featured his call for international AI moratoria.' },
  { author: 'Nick Bostrom', camp: 'Safety First',
    why_it_matters: 'Author of Superintelligence, Bostrom shaped how we think about existential risk from AI. His philosophical frameworks for AI safety are cited in virtually every major AI policy document.' },
  { author: 'Percy Liang', camp: 'Safety First',
    why_it_matters: 'Liang leads Stanford CRFM and created HELM for AI evaluation. His work on measuring AI capabilities and biases provides empirical grounding for safety concerns.' },
  { author: 'Percy Liang', camp: 'Needs New Approaches',
    why_it_matters: 'His research on foundation model limitations and evaluation reveals gaps in current approaches. HELM benchmarks expose where scaling alone falls short.' },
  { author: 'Yejin Choi', camp: 'Needs New Approaches',
    why_it_matters: 'MacArthur Fellow Yejin Choi demonstrated that large models lack common sense. Her work on commonsense reasoning shows fundamental limitations of pure scaling.' },
  { author: 'Rumman Chowdhury', camp: 'Adaptive Governance',
    why_it_matters: 'Former Twitter ML ethics lead, Chowdhury founded Humane Intelligence and advises policymakers globally. She bridges technical AI work with practical governance frameworks.' },
  { author: 'Emad Mostaque', camp: 'Democratize Fast',
    why_it_matters: 'As Stability AI founder, Mostaque released Stable Diffusion openly, democratizing image generation. His approach sparked debate about open vs closed AI development.' },
  { author: 'Bret Taylor', camp: 'Co-Evolution',
    why_it_matters: 'Former Salesforce co-CEO and now OpenAI board chair, Taylor has guided enterprise AI adoption at massive scale. He understands how organizations evolve with new technology.' },
  { author: 'Nat Friedman', camp: 'Technology Leads',
    why_it_matters: 'Former GitHub CEO who launched Copilot. He has seen firsthand how AI tools transform developer workflows and believes great products drive adoption.' },
  { author: 'Patrick Collison', camp: 'Innovation First',
    why_it_matters: 'Stripe CEO Patrick Collison advocates for innovation-friendly policies. His perspective on reducing regulatory barriers influences tech policy discussions.' },
  { author: 'Martin Casado', camp: 'Technology Leads',
    why_it_matters: 'A16z partner Casado brings enterprise infrastructure experience (he created SDN). His investment thesis shapes which AI infrastructure companies get funded.' },
  { author: 'Daphne Koller', camp: 'Technology Leads',
    why_it_matters: 'Stanford professor and Coursera co-founder, Koller now leads Insitro applying ML to drug discovery. She exemplifies the builder mindset in AI applications.' },
  { author: 'Deborah Raji', camp: 'Safety First',
    why_it_matters: 'Raji co-authored Gender Shades exposing facial recognition bias. Her auditing work forced major companies to reconsider AI deployment practices.' },
  { author: 'Margaret Mitchell', camp: 'Safety First',
    why_it_matters: 'Former Google AI ethics lead who co-created Model Cards. Her frameworks for AI documentation are now industry standard for responsible AI development.' },
  { author: 'Abeba Birhane', camp: 'Safety First',
    why_it_matters: 'Her research exposed harmful content in AI training datasets like LAION. Birhane represents critical voices questioning data collection practices.' },
  { author: 'Lilian Weng', camp: 'Safety First',
    why_it_matters: 'OpenAI safety researcher whose blog posts explain complex AI safety concepts. She helps translate technical safety research for broader audiences.' },
  { author: 'Judea Pearl', camp: 'Needs New Approaches',
    why_it_matters: 'Turing Award winner Pearl invented causal inference in AI. He argues current deep learning lacks causal understanding needed for true intelligence.' },
  { author: 'Ajeya Cotra', camp: 'Safety First',
    why_it_matters: 'Open Philanthropy researcher whose compute-based timelines for transformative AI influence safety prioritization and funding decisions.' },
  { author: 'Ian Hogarth', camp: 'Adaptive Governance',
    why_it_matters: 'Chair of UK AI Safety Institute, Hogarth shapes British AI policy. His approach balances innovation with safety, influencing global governance discussions.' },
  { author: 'Rita Sallam', camp: 'Business Whisperers',
    why_it_matters: 'Gartner VP Analyst Sallam advises enterprises on AI strategy. Her frameworks for AI adoption are used by thousands of organizations worldwide.' },
  { author: 'Joshua Gans', camp: 'Innovation First',
    why_it_matters: 'Toronto economist Gans studies AI economics and innovation policy. His research on AI and economic growth informs policy debates.' },
  { author: 'Byron Deeter', camp: 'Technology Leads',
    why_it_matters: 'Bessemer partner Deeter invests in AI infrastructure. His cloud index and market analysis shape how investors view AI infrastructure companies.' },
  { author: 'David Cahn', camp: 'Technology Leads',
    why_it_matters: 'Sequoia partner who coined "AI $200B question" challenging AI valuations. His analysis shapes investor expectations for AI company performance.' },
  { author: 'Ed Zitron', camp: 'Needs New Approaches',
    why_it_matters: 'Tech critic Zitron challenges AI hype cycles. His "AI Snake Oil" perspective provides counterbalance to overinflated AI claims.' },
  { author: 'Jim Covello', camp: 'Needs New Approaches',
    why_it_matters: 'Goldman Sachs analyst questioning AI productivity gains. His skeptical research note on AI ROI influenced Wall Street AI sentiment.' },
  { author: 'Nouriel Roubini', camp: 'Displacement Realist',
    why_it_matters: 'Economist "Dr. Doom" Roubini warns of job displacement from AI. His pessimistic view on labor markets resonates with displacement concerns.' },
  { author: 'Nouriel Roubini', camp: 'Regulatory Interventionist',
    why_it_matters: 'Beyond economic impacts, Roubini advocates for regulatory frameworks to manage AI risks, citing broader systemic concerns.' }
];

async function updateWhyItMatters() {
  let updated = 0;
  let errors = 0;

  for (const item of whyItMattersUpdates) {
    // Get author and camp IDs
    const { data: author } = await supabase.from('authors').select('id').eq('name', item.author).single();
    const { data: camp } = await supabase.from('camps').select('id').eq('label', item.camp).single();

    if (!author || !camp) {
      console.log('Not found:', item.author, '-', item.camp);
      errors++;
      continue;
    }

    const { error } = await supabase
      .from('camp_authors')
      .update({ why_it_matters: item.why_it_matters })
      .eq('author_id', author.id)
      .eq('camp_id', camp.id);

    if (error) {
      console.log('Error updating', item.author + ':', error.message);
      errors++;
    } else {
      console.log('Updated', item.author, '-', item.camp);
      updated++;
    }
  }

  console.log('\n=== Summary ===');
  console.log('Updated:', updated);
  console.log('Errors:', errors);

  // Check remaining
  const { data: remaining } = await supabase
    .from('camp_authors')
    .select('author_id, authors(name)')
    .is('why_it_matters', null);

  console.log('Still missing why_it_matters:', remaining ? remaining.length : 0);
}

updateWhyItMatters();
