import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Authors to check
const authorsToCheck = [
  // New batch
  'Molly Kinder',
  'Anu Madgavkar',
  'Daniel Kahneman',
  'Richard Socher',
  'Nathan Benaich',
  'Shawn Wang',
  'Martha Gimbel',
  'Shaun Maguire',
  // Additional new candidates
  'Michael Osborne',
  'Daniel Susskind',
  'Katja Grace',
  'Lareina Yee',
  'Simon Johnson',
  'Pascale Fung',
  'Max Tegmark',
  'Toby Ord',
  'Andrej Karpathy',
  'Daryl Plummer',
  'Gene Alvarez',
  'Anushree Verma'
];

const { data: existingAuthors } = await supabase
  .from('authors')
  .select('name');

const existingNames = new Set(existingAuthors?.map(a => a.name.toLowerCase()) || []);

console.log('=== AUTHORS ALREADY IN DATABASE ===');
const found = [];
const notFound = [];

authorsToCheck.forEach(name => {
  if (existingNames.has(name.toLowerCase())) {
    found.push(name);
  } else {
    notFound.push(name);
  }
});

found.forEach(n => console.log('✓ ' + n));
console.log('\n=== AUTHORS TO ADD (' + notFound.length + ') ===');
notFound.forEach(n => console.log('+ ' + n));
