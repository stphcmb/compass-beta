import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function assignNourielRoubini() {
  console.log('Assigning Nouriel Roubini to camps...\n');

  // Get author ID
  const { data: author, error: authorError } = await supabase
    .from('authors')
    .select('id, name')
    .eq('name', 'Nouriel Roubini')
    .single();

  if (authorError || !author) {
    console.log('❌ Author not found:', authorError?.message);
    return;
  }

  console.log(`Found: ${author.name} (${author.id})\n`);

  // Primary: Regulatory Interventionist
  // Roubini is known as "Dr. Doom" - cautious macro-economist who warns about risks
  // Advocates for regulation and oversight of new technologies including AI
  const { error: error1 } = await supabase
    .from('camp_authors')
    .insert({
      author_id: author.id,
      camp_id: 'e8792297-e745-4c9f-a91d-4f87dd05cea2', // Regulatory Interventionist
      relevance: 'strong'
    });

  if (error1) {
    console.log('❌ Primary assignment failed:', error1.message);
  } else {
    console.log('✅ Nouriel Roubini → Regulatory Interventionist (strong)');
  }

  // Secondary: Displacement Realist
  // As economist studying technological disruption and labor markets
  const { error: error2 } = await supabase
    .from('camp_authors')
    .insert({
      author_id: author.id,
      camp_id: '76f0d8c5-c9a8-4a26-ae7e-18f787000e18', // Displacement Realist
      relevance: 'strong'
    });

  if (error2) {
    console.log('❌ Secondary assignment failed:', error2.message);
  } else {
    console.log('✅ Nouriel Roubini → Displacement Realist (strong)');
  }

  // Verify
  const { data: verify } = await supabase
    .from('authors')
    .select(`
      name,
      camp_authors (
        camps (label),
        relevance
      )
    `)
    .eq('id', author.id)
    .single();

  console.log('\nVerification:');
  console.log(`${verify.name}:`);
  verify.camp_authors.forEach(ca => {
    console.log(`  - ${ca.camps.label} (${ca.relevance})`);
  });
}

assignNourielRoubini();
