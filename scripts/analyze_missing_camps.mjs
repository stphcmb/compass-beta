import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function analyzeMissingCamps() {
  // Get all authors
  const { data: authors, error: authorsError } = await supabase
    .from('authors')
    .select('id, name, credibility_tier, author_type')
    .order('name');

  if (authorsError) {
    console.error('Error fetching authors:', authorsError);
    return;
  }

  // Get all camps with their authors
  const { data: camps, error: campsError } = await supabase
    .from('camps')
    .select('id, label, domain_id, authors:camp_authors(author_id)');

  if (campsError) {
    console.error('Error fetching camps:', campsError);
    return;
  }

  // Create a set of author IDs that have camps
  const authorsWithCamps = new Set();
  camps.forEach(camp => {
    if (camp.authors) {
      camp.authors.forEach(a => authorsWithCamps.add(a.author_id));
    }
  });

  // Find authors without camps
  const authorsWithoutCamps = authors.filter(author => !authorsWithCamps.has(author.id));

  console.log('========================================');
  console.log('AUTHORS WITHOUT CAMP ASSIGNMENTS');
  console.log('========================================\n');

  console.log(`Total authors: ${authors.length}`);
  console.log(`Authors with camps: ${authorsWithCamps.size}`);
  console.log(`Authors WITHOUT camps: ${authorsWithoutCamps.length}`);
  console.log(`Percentage without camps: ${((authorsWithoutCamps.length / authors.length) * 100).toFixed(1)}%`);

  console.log('\n========================================');
  console.log('AUTHORS WITHOUT CAMPS (Detailed List)');
  console.log('========================================\n');

  // Group by credibility tier
  const byTier = {};
  authorsWithoutCamps.forEach(author => {
    const tier = author.credibility_tier || 'No Tier';
    if (!byTier[tier]) byTier[tier] = [];
    byTier[tier].push(author);
  });

  Object.keys(byTier).sort().forEach(tier => {
    console.log(`\n${tier} (${byTier[tier].length} authors):`);
    console.log('─'.repeat(50));
    byTier[tier].forEach(author => {
      console.log(`  • ${author.name}`);
      if (author.author_type) {
        console.log(`    Type: ${author.author_type}`);
      }
    });
  });

  console.log('\n========================================');
  console.log('RECOMMENDATIONS');
  console.log('========================================\n');

  console.log('1. Review each author without a camp assignment');
  console.log('2. Determine if they should be added to existing camps');
  console.log('3. Consider creating new camps if needed');
  console.log('4. Ensure all credible authors have relevant camp associations\n');

  return authorsWithoutCamps;
}

analyzeMissingCamps();
