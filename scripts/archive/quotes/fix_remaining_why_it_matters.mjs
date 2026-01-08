import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const remaining = [
  { author: 'Suresh Venkatasubramanian', camp: 'Regulatory Interventionist',
    why: 'Brown professor and White House OSTP advisor who helped draft AI Bill of Rights. His technical expertise informs regulatory frameworks.' },
  { author: 'Nick Bostrom', camp: 'Regulatory Interventionist',
    why: 'His existential risk framework shapes calls for AI governance. Bostrom argues coordinated international oversight is essential for safety.' },
  { author: 'Rita Sallam', camp: 'Co-Evolution',
    why: 'Gartner analyst emphasizing that AI adoption requires people, process, and technology to evolve together, not just technology deployment.' },
  { author: 'Rumman Chowdhury', camp: 'Safety First',
    why: 'Her work on algorithmic accountability at Twitter and beyond shows how safety concerns apply to deployed systems, not just research.' },
  { author: 'Bret Taylor', camp: 'Technology Leads',
    why: 'His experience building products at Google, Facebook, and Salesforce informs a builder-first approach to AI adoption.' },
  { author: 'Avi Goldfarb', camp: 'Human–AI Collaboration',
    why: 'Toronto economist whose research on AI and productivity shows augmentation often outperforms full automation economically.' },
  { author: 'Carl Benedikt Frey', camp: 'Displacement Realist',
    why: 'Oxford economist whose Future of Employment study estimated 47% of jobs at automation risk. His research grounds displacement concerns in data.' }
];

async function fix() {
  for (const item of remaining) {
    const { data: author } = await supabase.from('authors').select('id').eq('name', item.author).single();
    const { data: camp } = await supabase.from('camps').select('id').eq('label', item.camp).single();
    if (author === null || camp === null) {
      console.log('Not found:', item.author);
      continue;
    }

    const { error } = await supabase.from('camp_authors')
      .update({ why_it_matters: item.why })
      .eq('author_id', author.id).eq('camp_id', camp.id);
    console.log(error ? 'Error: ' + item.author : 'Fixed: ' + item.author);
  }

  const { data: check } = await supabase.from('camp_authors').select('id').is('why_it_matters', null);
  console.log('\nRemaining missing:', check ? check.length : 0);
}

fix();
