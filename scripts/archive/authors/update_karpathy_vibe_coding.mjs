import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateKarpathy() {
  console.log('🔄 Updating Andrej Karpathy with vibe coding content...\n');

  // Get author ID
  const { data: author, error: authorError } = await supabase
    .from('authors')
    .select('id, sources')
    .eq('name', 'Andrej Karpathy')
    .single();

  if (authorError || !author) {
    console.error('Error finding Karpathy:', authorError);
    return;
  }

  // 1. Add new vibe coding sources
  const newSources = [
    {
      url: 'https://www.youtube.com/watch?v=LWiM-LuRe6w',
      type: 'Video',
      year: '2025',
      title: 'Vibe Coding - The Future of Programming with AI'
    },
    {
      url: 'https://x.com/karpathy/status/1886192184808149383',
      type: 'Social',
      year: '2025',
      title: 'Vibe Coding Tweet Thread'
    }
  ];

  const updatedSources = [...(author.sources || []), ...newSources];

  // 2. Update author with new sources and vibe-coding-focused quote
  const { error: updateError } = await supabase
    .from('authors')
    .update({
      sources: updatedSources,
      key_quote: 'There is a new kind of coding I call "vibe coding" where you fully give in to the vibes, embrace exponentials, and forget that the code even exists. It\'s not really coding - I just see stuff, say stuff, run stuff, and copy paste stuff, and it mostly works.',
      quote_source_url: 'https://x.com/karpathy/status/1886192184808149383',
      notes: 'Former Director of AI at Tesla and OpenAI founding member. Pioneer of "Software 2.0" and "vibe coding" - the paradigm of AI-assisted programming where developers describe intent and AI generates code.',
      updated_at: new Date().toISOString()
    })
    .eq('id', author.id);

  if (updateError) {
    console.error('Error updating author:', updateError);
    return;
  }
  console.log('✓ Updated author profile with vibe coding sources');

  // 3. Get Human-AI Collaboration camp ID
  const { data: camp } = await supabase
    .from('camps')
    .select('id')
    .eq('label', 'Human–AI Collaboration')
    .single();

  if (!camp) {
    console.error('Human-AI Collaboration camp not found');
    return;
  }

  // 4. Check if relationship already exists
  const { data: existing } = await supabase
    .from('camp_authors')
    .select('id')
    .eq('author_id', author.id)
    .eq('camp_id', camp.id)
    .single();

  if (existing) {
    // Update existing relationship
    const { error } = await supabase
      .from('camp_authors')
      .update({
        key_quote: 'Vibe coding is the new paradigm where humans and AI collaborate on code. You describe what you want, the AI generates it, you iterate together. The human provides intent and judgment, the AI provides implementation speed.',
        quote_source_url: 'https://www.youtube.com/watch?v=LWiM-LuRe6w',
        why_it_matters: 'Karpathy\'s "vibe coding" concept captures a fundamental shift in software development - from humans writing code to humans directing AI that writes code. His influence as former Tesla AI director and OpenAI founding member gives this paradigm legitimacy.',
        relevance: 'strong'
      })
      .eq('id', existing.id);

    if (error) console.error('Error updating camp relationship:', error);
    else console.log('✓ Updated Human-AI Collaboration camp relationship');
  } else {
    // Create new relationship
    const { error } = await supabase
      .from('camp_authors')
      .insert({
        author_id: author.id,
        camp_id: camp.id,
        relevance: 'strong',
        key_quote: 'Vibe coding is the new paradigm where humans and AI collaborate on code. You describe what you want, the AI generates it, you iterate together. The human provides intent and judgment, the AI provides implementation speed.',
        quote_source_url: 'https://www.youtube.com/watch?v=LWiM-LuRe6w',
        why_it_matters: 'Karpathy\'s "vibe coding" concept captures a fundamental shift in software development - from humans writing code to humans directing AI that writes code. His influence as former Tesla AI director and OpenAI founding member gives this paradigm legitimacy.'
      });

    if (error) console.error('Error creating camp relationship:', error);
    else console.log('✓ Added Human-AI Collaboration camp relationship');
  }

  // Verify
  const { data: verify } = await supabase
    .from('authors')
    .select('name, key_quote, sources')
    .eq('id', author.id)
    .single();

  console.log('\n📋 Updated profile:');
  console.log('Quote:', verify.key_quote.substring(0, 100) + '...');
  console.log('Sources:', verify.sources.length, 'total');
  console.log('New sources added:', newSources.map(s => s.title).join(', '));
}

updateKarpathy();
