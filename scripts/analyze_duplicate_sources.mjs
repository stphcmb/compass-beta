import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function analyzeDuplicateSources() {
  // Get all authors with their sources
  const { data: authors, error } = await supabase
    .from('authors')
    .select('id, name, sources')
    .not('sources', 'is', null);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Analyzing duplicate sources in detail...\n');

  const authorsWithRealDuplicates = [];

  authors.forEach(author => {
    if (!author.sources || author.sources.length === 0) return;

    // Group sources by title
    const sourcesByTitle = {};
    author.sources.forEach((source, index) => {
      if (!sourcesByTitle[source.title]) {
        sourcesByTitle[source.title] = [];
      }
      sourcesByTitle[source.title].push({ ...source, index });
    });

    // Find titles that appear more than once
    const duplicateTitles = Object.entries(sourcesByTitle)
      .filter(([title, sources]) => sources.length > 1);

    if (duplicateTitles.length > 0) {
      console.log(`\n========================================`);
      console.log(`Author: ${author.name}`);
      console.log(`Total sources: ${author.sources.length}`);
      console.log(`========================================`);

      duplicateTitles.forEach(([title, sources]) => {
        console.log(`\n  Duplicate title: "${title}"`);
        console.log(`  Appears ${sources.length} times:`);
        sources.forEach(source => {
          console.log(`    - Type: ${source.type || 'N/A'}, Year: ${source.year || 'N/A'}, URL: ${source.url || 'N/A'}`);
        });
      });

      authorsWithRealDuplicates.push({
        name: author.name,
        id: author.id,
        duplicates: duplicateTitles.map(([title, sources]) => ({
          title,
          count: sources.length
        }))
      });
    }
  });

  console.log(`\n\n========================================`);
  console.log(`SUMMARY`);
  console.log(`========================================`);
  console.log(`Authors with duplicate sources: ${authorsWithRealDuplicates.length}`);
  console.log(`Total authors checked: ${authors.length}`);

  return authorsWithRealDuplicates;
}

analyzeDuplicateSources();
