import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Migration mapping:
// Old tier → New tier
const TIER_MAPPING = {
  'Seminal Thinker': 'Pioneer',
  'Major Voice': 'Field Leader',
  'Thought Leader': 'Domain Expert',
  'Emerging Voice': 'Rising Voice'
};

async function migrate() {
  console.log('🔄 Migrating credibility tiers...\n');

  // Get current distribution
  const { data: before } = await supabase.from('authors').select('credibility_tier');
  const beforeCounts = {};
  before.forEach(a => { beforeCounts[a.credibility_tier] = (beforeCounts[a.credibility_tier] || 0) + 1; });

  console.log('Before migration:');
  Object.entries(beforeCounts).forEach(([tier, count]) => console.log(`  ${tier}: ${count}`));
  console.log();

  // Run migrations
  for (const [oldTier, newTier] of Object.entries(TIER_MAPPING)) {
    const { data, error } = await supabase
      .from('authors')
      .update({ credibility_tier: newTier, updated_at: new Date().toISOString() })
      .eq('credibility_tier', oldTier)
      .select('name');

    if (error) {
      console.error(`❌ Error migrating ${oldTier} → ${newTier}:`, error.message);
    } else {
      console.log(`✓ ${oldTier} → ${newTier}: ${data.length} authors updated`);
    }
  }

  // Verify
  console.log();
  const { data: after } = await supabase.from('authors').select('credibility_tier');
  const afterCounts = {};
  after.forEach(a => { afterCounts[a.credibility_tier] = (afterCounts[a.credibility_tier] || 0) + 1; });

  console.log('After migration:');
  Object.entries(afterCounts).forEach(([tier, count]) => console.log(`  ${tier}: ${count}`));
}

migrate();
