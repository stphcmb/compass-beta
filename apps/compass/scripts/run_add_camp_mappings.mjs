import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Camp UUIDs
const CAMPS = {
  DISPLACEMENT_REALIST: '76f0d8c5-c9a8-4a26-ae7e-18f787000e18',
  HUMAN_AI_COLLABORATION: 'd8d3cec4-f8ce-49b1-9a43-bb0d952db371',
  SAFETY_FIRST: '7f64838f-59a6-4c87-8373-a023b9f448cc',
  CO_EVOLUTION: 'f19021ab-a8db-4363-adec-c2228dad6298',
  TECH_BUILDERS: 'a076a4ce-f14c-47b5-ad01-c8c60135a494',
  INNOVATION_FIRST: '331b2b02-7f8d-4751-b583-16255a6feb50',
  SCALING_WILL_DELIVER: 'c5dcb027-cd27-4c91-adb4-aca780d15199',
  ADAPTIVE_GOVERNANCE: 'ee10cf4f-025a-47fc-be20-33d6756ec5cd',
  NEEDS_NEW_APPROACHES: '207582eb-7b32-4951-9863-32fcf05944a1',
  TECHNOLOGY_LEADS: '7e9a2196-71e7-423a-889c-6902bc678eac',
  REGULATORY_INTERVENTIONIST: 'e8792297-e745-4c9f-a91d-4f87dd05cea2'
};

async function getAuthorId(name) {
  const { data, error } = await supabase
    .from('authors')
    .select('id')
    .eq('name', name)
    .single();
  if (error) {
    console.log(`Author not found: ${name}`);
    return null;
  }
  return data.id;
}

async function addCampMapping(authorName, campId, mapping) {
  const authorId = await getAuthorId(authorName);
  if (!authorId) return false;

  const { error } = await supabase
    .from('camp_authors')
    .upsert({
      author_id: authorId,
      camp_id: campId,
      relevance: mapping.relevance,
      key_quote: mapping.key_quote,
      quote_source_url: mapping.quote_source_url,
      why_it_matters: mapping.why_it_matters
    }, { onConflict: 'author_id,camp_id' });

  if (error) {
    console.log(`Error adding ${authorName} to camp: ${error.message}`);
    return false;
  }
  return true;
}

// All camp mappings
const mappings = [
  // Simon Johnson: Displacement Realist
  {
    author: 'Simon Johnson',
    camp: CAMPS.DISPLACEMENT_REALIST,
    data: {
      relevance: 'strong',
      key_quote: "We have not generated enough new good jobs, jobs where you actually get paid good money and you can live well, and we have got to do better on that. I think there's a lot we can do on redirecting technological progress and pushing AI towards inventing things that are more useful to people and boost the productivity of particularly people with less education.",
      quote_source_url: 'https://news.mit.edu/news-clip/marketplace-39',
      why_it_matters: "As a 2024 Nobel laureate in economics, Johnson's research on institutions and technology provides rigorous empirical evidence that AI's impact depends on policy choices. His work shows technology can be designed to be pro-worker rather than purely labor-saving."
    }
  },
  // Simon Johnson: Human-AI Collaboration
  {
    author: 'Simon Johnson',
    camp: CAMPS.HUMAN_AI_COLLABORATION,
    data: {
      relevance: 'strong',
      key_quote: "Our reading of history is that technology is neither good nor bad for people - it depends on how you use it. You can have a pro-worker vision of technology, or you can have a vision where only the abbot or people close to the king do well when the water wheel is invented.",
      quote_source_url: 'https://phys.org/news/2024-10-dont-tech-gurus-future-nobel.html',
      why_it_matters: "Johnson's historical analysis demonstrates that periods of greatest prosperity occurred when technology complemented workers rather than replaced them. His Nobel-winning research provides the academic foundation for human-AI collaboration policies."
    }
  },
  // Michael Osborne: Displacement Realist
  {
    author: 'Michael Osborne',
    camp: CAMPS.DISPLACEMENT_REALIST,
    data: {
      relevance: 'strong',
      key_quote: "A key bottleneck to the automation of perception and mobility tasks is that we can't accept mistakes. Yet foundation models based on deep neural networks have the capacity to create plenty of mistakes. For now, deployment of generative AI will be confined to lower stakes activities where engineers can redesign and simplify the environment.",
      quote_source_url: 'https://www.oii.ox.ac.uk/news-events/generative-ai-has-potential-to-disrupt-labour-markets-but-is-not-likely-to-cause-widespread-automation-and-job-displacement-say-oxford-ai-experts/',
      why_it_matters: "Co-author of the landmark 47% automation study, Osborne's 2024 reappraisal provides crucial nuance: generative AI expands automation scope but faces fundamental bottlenecks. His research shows remote jobs face higher risk while in-person skills gain value."
    }
  },
  // Daniel Susskind: Displacement Realist
  {
    author: 'Daniel Susskind',
    camp: CAMPS.DISPLACEMENT_REALIST,
    data: {
      relevance: 'strong',
      key_quote: "Machines no longer need to think like us in order to outperform us. More and more tasks that used to be far beyond the capability of computers - from diagnosing illnesses to drafting legal contracts - are coming within their reach. The substituting force is gathering strength and will at some point overwhelm the complementing force.",
      quote_source_url: 'https://www.danielsusskind.com/',
      why_it_matters: "Susskind challenges the comfortable assumption that humans will always find new work. His argument that machines can excel without human-like cognition forces us to confront the possibility that complementarity may eventually fail as a strategy."
    }
  },
  // Katja Grace: Safety First
  {
    author: 'Katja Grace',
    camp: CAMPS.SAFETY_FIRST,
    data: {
      relevance: 'strong',
      key_quote: "I would be very surprised if it was somehow impossible to have AI that was substantially better than any given human at any given task. Policy decisions are implicitly bets about the future, and on a topic like this one, the stakes might be our lives or livelihoods.",
      quote_source_url: 'https://80000hours.org/podcast/episodes/katja-grace-forecasting-technology/',
      why_it_matters: "Grace's 2024 survey of 2,700+ AI researchers provides the most comprehensive data on expert timelines and risk assessments. Her forecasting work grounds safety discussions in empirical researcher sentiment rather than speculation."
    }
  },
  // Molly Kinder: Displacement Realist
  {
    author: 'Molly Kinder',
    camp: CAMPS.DISPLACEMENT_REALIST,
    data: {
      relevance: 'strong',
      key_quote: "The workers most exposed to AI disruption are often the least prepared for it. We need policies that help workers adapt - not just through retraining programs, but through portable benefits, stronger safety nets, and workplace voice in how AI gets deployed.",
      quote_source_url: 'https://www.brookings.edu/articles/how-ai-will-transform-work/',
      why_it_matters: "Kinder's Brookings research focuses on frontline and low-wage workers who face the greatest AI displacement risk. Her policy-focused approach provides concrete recommendations for protecting vulnerable workers."
    }
  },
  // Anu Madgavkar: Human-AI Collaboration
  {
    author: 'Anu Madgavkar',
    camp: CAMPS.HUMAN_AI_COLLABORATION,
    data: {
      relevance: 'strong',
      key_quote: "Integrating AI will not be a simple technology rollout but a reimagining of work itself. Redesigning processes, roles, skills, culture, and metrics so people, agents, and robots create more value together. Companies that invest in human skills will gain a competitive edge.",
      quote_source_url: 'https://www.mckinsey.com/mgi/our-research/agents-robots-and-us-skill-partnerships-in-the-age-of-ai',
      why_it_matters: "McKinsey's research leader on AI and work, Madgavkar's 'people, agents, and robots' framework captures how 57% of work hours could theoretically be automated but success requires organizational redesign and human skill investment."
    }
  },
  // Anu Madgavkar: Co-Evolution
  {
    author: 'Anu Madgavkar',
    camp: CAMPS.CO_EVOLUTION,
    data: {
      relevance: 'strong',
      key_quote: "Capturing AI's massive potential economic value - about $2.9 trillion in the U.S. by 2030 - depends entirely on human guidance and organizational redesign. Even as AI automates many tasks, companies that invest in human skills will gain a competitive edge.",
      quote_source_url: 'https://fortune.com/2025/11/25/why-ai-wont-take-your-job-partnership-agents-robots-mckinsey/',
      why_it_matters: "Her research provides the business case for co-evolution: companies that treat AI as pure automation will fail to capture value. Success requires simultaneous investment in technology, people, and processes."
    }
  },
  // Lareina Yee: Human-AI Collaboration
  {
    author: 'Lareina Yee',
    camp: CAMPS.HUMAN_AI_COLLABORATION,
    data: {
      relevance: 'partial',
      key_quote: "Women will experience even more dramatic shifts in job opportunities and expectations than men, as AI and automation are set to disrupt the fields where they have greater representation. We need to encourage more girls to choose careers in STEM.",
      quote_source_url: 'https://katiecouric.com/lifestyle/workplace/career-growth-ai-automation-karlie-kloss-lareina-yee/',
      why_it_matters: "Yee brings a crucial equity lens to AI workforce transformation. Her research shows certain demographics face disproportionate disruption, requiring targeted policies and career pathways to ensure inclusive human-AI collaboration."
    }
  },
  // Richard Socher: Tech Builders
  {
    author: 'Richard Socher',
    camp: CAMPS.TECH_BUILDERS,
    data: {
      relevance: 'strong',
      key_quote: "Many companies that started around ChatGPT said 'Oh, it's all in the LLM.' But really, the LLM is this summarization reasoning layer, and you need to have a search engine that feeds it information. We have actually built an accurate search engine, too, and that's half the battle.",
      quote_source_url: 'https://www.fastcompany.com/91230536/you-com-founder-richard-sochers-plan-to-win-the-ai-search-wars',
      why_it_matters: "As the fourth most-cited NLP researcher building You.com, Socher demonstrates that technical excellence matters: reliable AI requires robust retrieval systems, not just better language models. His focus on accuracy over hype defines the Tech Builders ethos."
    }
  },
  // Nathan Benaich: Innovation First
  {
    author: 'Nathan Benaich',
    camp: CAMPS.INNOVATION_FIRST,
    data: {
      relevance: 'strong',
      key_quote: "We're now beginning to see a split among AI-first start-ups. The biggest model builders are now seeing real revenues to match their soaring valuations, while some buzzier start-ups' valuations can seem more vibes-driven. Stripe data shows AI companies are scaling significantly quicker than peers.",
      quote_source_url: 'https://www.stateof.ai/',
      why_it_matters: "The State of AI Report provides the most comprehensive annual analysis of AI progress. Benaich's investor perspective cuts through hype to identify which innovations are delivering real value and which are vapor."
    }
  },
  // Nathan Benaich: Scaling Will Deliver
  {
    author: 'Nathan Benaich',
    camp: CAMPS.SCALING_WILL_DELIVER,
    data: {
      relevance: 'partial',
      key_quote: "If you'd just bought NVDA stock instead of its challengers, you'd be up 12x vs. 2x. All the capital invested in NVIDIA competitors would have performed far better for investors had they invested in NVIDIA itself.",
      quote_source_url: 'https://www.stateof.ai/',
      why_it_matters: "Benaich's analysis shows that scale continues to matter: NVIDIA's dominance reflects how compute scale drives AI progress. His data-driven approach provides empirical grounding for scaling arguments."
    }
  },
  // Toby Ord: Safety First
  {
    author: 'Toby Ord',
    camp: CAMPS.SAFETY_FIRST,
    data: {
      relevance: 'strong',
      key_quote: "We live during the most important era of human history. In the twentieth century, we developed the means to destroy ourselves - without developing the moral framework to ensure we won't. I estimate unaligned AI poses a 1 in 10 existential risk this century - higher than all other sources combined.",
      quote_source_url: 'https://www.nti.org/risky-business/nti-seminar-philosopher-toby-ord-existential-risk-and-future-humanity/',
      why_it_matters: "Ord's quantified risk estimates in 'The Precipice' provide a framework for comparing AI risk to other existential threats. His 10% AI risk estimate is striking because it exceeds all other risks combined, demanding serious attention."
    }
  },
  // Pascale Fung: Safety First
  {
    author: 'Pascale Fung',
    camp: CAMPS.SAFETY_FIRST,
    data: {
      relevance: 'strong',
      key_quote: "We are building algorithms to control algorithms because they are human-built. These language models did not drop to us from some alien being. We built them. We can control them. We need to ask ourselves more about WHY we are creating AI technology not just HOW.",
      quote_source_url: 'https://www.carnegiecouncil.org/media/series/aiei/20220329-code-empathy-pascale-fung',
      why_it_matters: "As a senior AI research leader at Meta and adviser to EU, UAE, Japan, and US on AI governance, Fung bridges technical and policy worlds. Her 'algorithms to control algorithms' framing provides a practical path to AI safety."
    }
  },
  // Pascale Fung: Adaptive Governance
  {
    author: 'Pascale Fung',
    camp: CAMPS.ADAPTIVE_GOVERNANCE,
    data: {
      relevance: 'partial',
      key_quote: "The cultural differences between China and Europe present a unique set of challenges when it comes to aligning AI ethics. We need to ask whether a global framework is possible while respecting local values.",
      quote_source_url: 'https://www.weforum.org/agenda/authors/pascale-fung/',
      why_it_matters: "Fung's cross-cultural research on AI ethics informs adaptive governance approaches. Her work on Confucian vs European ethics shows that effective AI governance must accommodate diverse values while maintaining core principles."
    }
  },
  // James Manyika: Co-Evolution
  {
    author: 'James Manyika',
    camp: CAMPS.CO_EVOLUTION,
    data: {
      relevance: 'strong',
      key_quote: "The productivity gains from AI are not guaranteed. They're going to take a lot of work. We could have a version of the Solow paradox - where we see this technology everywhere, but it's done nothing to transform the economy in that real fundamental way.",
      quote_source_url: 'https://tech.slashdot.org/story/24/09/02/1633202/googles-james-manyika-the-productivity-gains-from-ai-are-not-guaranteed',
      why_it_matters: "Manyika's warning about the AI productivity paradox echoes his former McKinsey work. As Google's SVP for Research, his message is striking: even the leading AI company recognizes that technology alone won't deliver economic transformation."
    }
  },
  // James Manyika: Adaptive Governance
  {
    author: 'James Manyika',
    camp: CAMPS.ADAPTIVE_GOVERNANCE,
    data: {
      relevance: 'strong',
      key_quote: "If we as a society are to set ourselves on the road to fully realizing the societal and economic potential of AI, then 2024 must be a year of action across sectors, disciplines, and geographic borders. Governing AI for Humanity requires international cooperation.",
      quote_source_url: 'https://fortune.com/2024/01/16/google-svp-tech-society-people-ai-disruption-james-manyika/',
      why_it_matters: "As co-chair of the UN High-Level Advisory Body on AI, Manyika shapes global AI governance. His 'Governing AI for Humanity' framework provides a blueprint for adaptive international cooperation on AI policy."
    }
  },
  // Daryl Plummer: Technology Leads
  {
    author: 'Daryl Plummer',
    camp: CAMPS.TECHNOLOGY_LEADS,
    data: {
      relevance: 'strong',
      key_quote: "It is clear that no matter where we go, we cannot avoid the impact of AI. AI is evolving as human use of AI evolves. By 2028, 33% of enterprise software applications will incorporate agentic AI capabilities - up from less than 1% in 2024.",
      quote_source_url: 'https://www.gartner.com/en/newsroom/press-releases/2024-10-22-gartner-unveils-top-predictions-for-it-organizations-and-users-in-2025-and-beyond',
      why_it_matters: "Gartner's Chief of Research provides authoritative enterprise adoption forecasts that shape corporate strategy. His predictions on agentic AI integration set expectations for how technology will lead transformation."
    }
  },
  // Daryl Plummer: Displacement Realist
  {
    author: 'Daryl Plummer',
    camp: CAMPS.DISPLACEMENT_REALIST,
    data: {
      relevance: 'partial',
      key_quote: "Through 2026, 20% of organizations will use AI to flatten their organizational structure, eliminating more than half of current middle management positions.",
      quote_source_url: 'https://www.gartner.com/en/newsroom/press-releases/2024-10-22-gartner-unveils-top-predictions-for-it-organizations-and-users-in-2025-and-beyond',
      why_it_matters: "Plummer's middle management displacement prediction is striking: AI may eliminate entire organizational layers, not just individual jobs. This structural displacement challenges assumptions about white-collar resilience."
    }
  },
  // Shaun Maguire: Innovation First
  {
    author: 'Shaun Maguire',
    camp: CAMPS.INNOVATION_FIRST,
    data: {
      relevance: 'strong',
      key_quote: "I like high-IQ founders. But even more important to me is someone that's just irrationally motivated. For whatever reason, it's their life mission to try to revolutionize the industry they're going after. The future of information warfare is AI.",
      quote_source_url: 'https://www.calcalistech.com/ctechnews/article/skwsxeacxg',
      why_it_matters: "As a Sequoia partner investing in frontier AI, Maguire represents the VC perspective that breakthrough innovation comes from backing exceptional founders with minimal regulatory friction. His defense tech focus shows AI's strategic importance."
    }
  },
  // Shawn Wang: Human-AI Collaboration
  {
    author: 'Shawn Wang',
    camp: CAMPS.HUMAN_AI_COLLABORATION,
    data: {
      relevance: 'strong',
      key_quote: "Even if you don't have a Ph.D., even if you don't have years of experience in machine learning, if you know how to wrangle an API, you should actually start taking a serious look because this is giving you new capabilities.",
      quote_source_url: 'https://redmonk.com/blog/2025/07/23/shawn-swyx-wang-ai-engineer/',
      why_it_matters: "Swyx's 'AI Engineer' concept defines a new role: software engineers who leverage AI tools without ML expertise. This democratization of AI capabilities exemplifies productive human-AI collaboration at the developer level."
    }
  },
  // Shawn Wang: Tech Builders
  {
    author: 'Shawn Wang',
    camp: CAMPS.TECH_BUILDERS,
    data: {
      relevance: 'partial',
      key_quote: "AI engineering feels closer to software engineering than to ML engineering. A big difference is that thanks to LLMs being easy to use, AI engineering is much more about building a product first - and later on, getting around to tweaking the model itself.",
      quote_source_url: 'https://newsletter.pragmaticengineer.com/p/ai-engineering-with-chip-huyen',
      why_it_matters: "The AI Engineer concept shifts focus from model training to application building. This product-first approach makes AI accessible to the broader developer community, accelerating practical deployment."
    }
  },
  // Daniel Kahneman: Human-AI Collaboration
  {
    author: 'Daniel Kahneman',
    camp: CAMPS.HUMAN_AI_COLLABORATION,
    data: {
      relevance: 'strong',
      key_quote: "Algorithms are noise-free. People are not. When you put some data in front of an algorithm, you will always get the same response at the other end. The main characteristic of people is that they're very noisy. You show them the same stimulus twice, they don't give you the same response twice.",
      quote_source_url: 'https://www.aei.org/economics/nobel-laureate-daniel-kahneman-on-a-i-its-very-difficult-to-imagine-that-with-sufficient-data-there-will-remain-things-that-only-humans-can-do/',
      why_it_matters: "Kahneman's research on cognitive biases and noise revolutionized our understanding of human judgment. His insight that algorithms can reduce noise provides the scientific foundation for human-AI collaboration: AI corrects human inconsistency."
    }
  }
];

async function main() {
  console.log('Adding camp mappings for new authors...\n');

  let success = 0;
  let failed = 0;

  for (const mapping of mappings) {
    const result = await addCampMapping(mapping.author, mapping.camp, mapping.data);
    if (result) {
      console.log(`✓ Added ${mapping.author} to camp`);
      success++;
    } else {
      failed++;
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);
}

main().catch(console.error);
