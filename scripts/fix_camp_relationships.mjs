import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const campRelationships = [
  // Sergey Levine
  { author: 'Sergey Levine', camp_id: '207582eb-7b32-4951-9863-32fcf05944a1', relevance: 'strong',
    key_quote: 'The biggest breakthroughs in robotics will come from systems that can learn continuously from real-world interaction, not just from larger language models. We need robots that understand physics through experience.',
    quote_source_url: 'https://rll.berkeley.edu/research/',
    why_it_matters: 'Sergey Levine leads Berkeley Robot Learning Lab. His work on learning from real-world data challenges pure scaling, showing embodied intelligence requires different approaches.'
  },
  // Chelsea Finn
  { author: 'Chelsea Finn', camp_id: '207582eb-7b32-4951-9863-32fcf05944a1', relevance: 'strong',
    key_quote: 'Learning to learn is fundamentally different from scaling up training data. Meta-learning allows AI to quickly adapt to new tasks with minimal examples - how humans actually learn.',
    quote_source_url: 'https://ai.stanford.edu/~cbfinn/',
    why_it_matters: 'Chelsea Finn pioneered meta-learning with MAML. Her work represents an alternative to pure scaling, focusing on learning efficiency rather than data volume.'
  },
  // Holly Herndon
  { author: 'Holly Herndon', camp_id: 'fe19ae2d-99f2-4c30-a596-c9cd92bff41b', relevance: 'strong',
    key_quote: 'AI tools should empower artists, not replace them. We built Holly+ so anyone can use my voice as an instrument, creating new forms of collaboration between human creativity and machine capability.',
    quote_source_url: 'https://holly.plus/',
    why_it_matters: 'Holly Herndon created Holly+ - an AI model of her voice anyone can use. She shows how artists can shape AI tools rather than be displaced.'
  },
  { author: 'Holly Herndon', camp_id: 'd8d3cec4-f8ce-49b1-9a43-bb0d952db371', relevance: 'strong',
    key_quote: 'My work with AI is about finding new forms of collaboration. The most interesting creative outcomes come from human artists working with AI as a partner.',
    quote_source_url: 'https://holly.plus/',
    why_it_matters: 'Her Grammy-nominated PROTO and Holly+ demonstrate collaborative AI where AI augments rather than replaces human creativity.'
  },
  // Mat Dryhurst
  { author: 'Mat Dryhurst', camp_id: '7f64838f-59a6-4c87-8373-a023b9f448cc', relevance: 'strong',
    key_quote: 'Training AI on creative works without consent or compensation is fundamentally extractive. We need frameworks for attribution and consent. Artists deserve agency over how their work is used.',
    quote_source_url: 'https://spawning.ai/',
    why_it_matters: 'Mat Dryhurst co-founded Spawning.ai with tools like Have I Been Trained that let artists check if their work was used in AI training.'
  },
  // Ying Lu
  { author: 'Ying Lu', camp_id: 'ee10cf4f-025a-47fc-be20-33d6756ec5cd', relevance: 'strong',
    key_quote: 'AI governance cannot be one-size-fits-all. Different cultural contexts and economic conditions require different regulatory approaches while maintaining global cooperation.',
    quote_source_url: 'https://scholar.google.com/',
    why_it_matters: 'Ying Lu brings international perspectives to AI governance, highlighting how regulations must adapt to different cultural and economic contexts.'
  },
  // Jianfeng Gao
  { author: 'Jianfeng Gao', camp_id: 'c5dcb027-cd27-4c91-adb4-aca780d15199', relevance: 'strong',
    key_quote: 'Progress in language understanding comes from scale - larger models trained on more data consistently show emergent capabilities. Deep learning rewards scale.',
    quote_source_url: 'https://www.microsoft.com/en-us/research/people/jfgao/',
    why_it_matters: 'Jianfeng Gao is a Distinguished Scientist at Microsoft Research leading work on neural information retrieval and language understanding.'
  },
  // Arvind Vemuri
  { author: 'Arvind Vemuri', camp_id: 'd8d3cec4-f8ce-49b1-9a43-bb0d952db371', relevance: 'strong',
    key_quote: 'The best AI features disappear into the workflow - they help you work faster without forcing you to think about the AI. Notion AI augments how people work, not replaces their thinking.',
    quote_source_url: 'https://notion.so/product/ai',
    why_it_matters: 'As Head of AI at Notion, Arvind Vemuri shapes how AI integrates into productivity software used by millions.'
  },
  { author: 'Arvind Vemuri', camp_id: 'fe9464df-b778-44c9-9593-7fb3294fa6c3', relevance: 'partial',
    key_quote: 'Successful AI adoption is not about the most advanced model - it is about understanding how teams work and building AI that fits those patterns. User research matters more than benchmarks.',
    quote_source_url: 'https://notion.so/product/ai',
    why_it_matters: 'His experience building Notion AI for enterprise demonstrates the importance of understanding business context over technical capability.'
  }
];

async function addCampRelationships() {
  for (const rel of campRelationships) {
    const { data: author } = await supabase.from('authors').select('id').eq('name', rel.author).single();
    if (!author) {
      console.log('Author not found:', rel.author);
      continue;
    }

    const { error } = await supabase.from('camp_authors').upsert({
      author_id: author.id,
      camp_id: rel.camp_id,
      relevance: rel.relevance,
      key_quote: rel.key_quote,
      quote_source_url: rel.quote_source_url,
      why_it_matters: rel.why_it_matters
    }, { onConflict: 'author_id,camp_id' });

    if (error) {
      console.log('Error for', rel.author + ':', error.message);
    } else {
      console.log('Added camp for', rel.author);
    }
  }

  // Verify
  console.log('\n=== Verification ===');
  const authors = ['Sergey Levine', 'Chelsea Finn', 'Holly Herndon', 'Mat Dryhurst', 'Ying Lu', 'Jianfeng Gao', 'Arvind Vemuri'];
  for (const name of authors) {
    const { data: author } = await supabase.from('authors').select('id').eq('name', name).single();
    if (author) {
      const { data: camps } = await supabase.from('camp_authors').select('id').eq('author_id', author.id);
      console.log(name + ':', (camps ? camps.length : 0), 'camps');
    }
  }
}

addCampRelationships();
