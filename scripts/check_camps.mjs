import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const { data: camps, error: campsError } = await supabase
  .from('camps')
  .select('*');

if (campsError) console.log('Camps error:', campsError);
console.log('Camps sample:', camps?.[0]);

const { data: campAuthors } = await supabase
  .from('camp_authors')
  .select('camp_id');

const counts = {};
campAuthors?.forEach(ca => {
  counts[ca.camp_id] = (counts[ca.camp_id] || 0) + 1;
});

console.log('\n=== CAMP DISTRIBUTION ===');
camps?.forEach(c => {
  const domain = c.domain || c.category || 'Unknown';
  console.log(`${c.label || c.name}: ${counts[c.id] || 0} authors (${domain})`);
});

const { data: authors } = await supabase.from('authors').select('name').order('name');
console.log('\n=== TOTAL AUTHORS: ' + authors?.length + ' ===');
