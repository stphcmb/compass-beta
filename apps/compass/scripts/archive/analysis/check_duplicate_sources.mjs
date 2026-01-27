import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkDuplicateSources() {
  // Get all authors with their sources
  const { data: authors, error } = await supabase
    .from('authors')
    .select('id, name, sources')
    .not('sources', 'is', null);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Checking for duplicate sources...\n');

  let totalDuplicates = 0;
  const duplicateAuthors = [];

  authors.forEach(author => {
    if (!author.sources || author.sources.length === 0) return;

    const titles = author.sources.map(s => s.title);
    const duplicates = titles.filter((title, index) => titles.indexOf(title) !== index);

    if (duplicates.length > 0) {
      const uniqueDuplicates = [...new Set(duplicates)];
      console.log(`Author: ${author.name}`);
      console.log(`  Duplicate titles: ${uniqueDuplicates.join(', ')}`);
      console.log(`  Total sources: ${author.sources.length}`);
      console.log('');
      totalDuplicates++;
      duplicateAuthors.push({
        name: author.name,
        duplicates: uniqueDuplicates
      });
    }
  });

  console.log(`\nTotal authors with duplicate sources: ${totalDuplicates}`);
  console.log(`Total authors checked: ${authors.length}`);

  return duplicateAuthors;
}

checkDuplicateSources();
