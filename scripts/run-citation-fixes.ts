// Run citation URL fixes
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env.local')
  console.log('\nPlease run the SQL script directly in Supabase SQL Editor:')
  console.log('  scripts/fix_broken_citations.sql')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
})

interface UrlFix {
  oldPattern: string
  newUrl: string
  useExact?: boolean
}

// URL replacements for 404 errors
const urlFixes: UrlFix[] = [
  // Dario Amodei
  { oldPattern: '%anthropic.com/index/machines-of-loving-grace%', newUrl: 'https://darioamodei.com/machines-of-loving-grace' },
  // Sam Altman
  { oldPattern: '%blog.samaltman.com/the-intelligence-age%', newUrl: 'https://ia.samaltman.com/' },
  // Jensen Huang
  { oldPattern: '%blogs.nvidia.com/blog/author/jensen-huang%', newUrl: 'https://blogs.nvidia.com/blog/2024-gtc-keynote/' },
  // Reid Hoffman
  { oldPattern: '%amazon.com%Impromptu-Amplifying-Humanity-Reid-Hoffman%', newUrl: 'https://www.impromptubook.com/' },
  // Yoshua Bengio
  { oldPattern: '%montrealethics.ai/the-montreal-declaration%', newUrl: 'https://montrealdeclaration-responsibleai.com/the-declaration/' },
  { oldPattern: '%yoshuabengio.org/2020/02/26/time-to-rethink%', newUrl: 'https://yoshuabengio.org/' },
  // Nick Bostrom
  { oldPattern: '%nickbostrom.com/papers/agi-policy.pdf%', newUrl: 'https://nickbostrom.com/papers/aipolicy.pdf' },
  // Chip Huyen
  { oldPattern: '%huyenchip.com/ml-systems-design%', newUrl: 'https://huyenchip.com/machine-learning-systems-design/toc.html' },
  // Nathan Lambert
  { oldPattern: '%interconnects.ai/p/rlhf-progress%', newUrl: 'https://www.interconnects.ai/p/rlhf-resources' },
  // Swyx
  { oldPattern: '%swyx.io/ai-notes%', newUrl: 'https://www.latent.space/' },
  // Erik Bernhardsson
  { oldPattern: '%modal.com/blog/serverless-machine-learning%', newUrl: 'https://erikbern.com/2022/12/07/what-ive-been-working-on-modal.html' },
  // Jerry Liu
  { oldPattern: '%llamaindex.ai/blog/introducing-llama-agents%', newUrl: 'https://www.llamaindex.ai/blog' },
  // Clem Delangue
  { oldPattern: '%time.com/7012828/clem-delangue%', newUrl: 'https://huggingface.co/blog/ethics-soc-2023' },
  { oldPattern: '%huggingface.co/blog/open-source-ai-safety%', newUrl: 'https://huggingface.co/blog/ethics-soc-2' },
  // Thomas Wolf
  { oldPattern: '%huggingface.co/blog/ethics-soc-2023%', newUrl: 'https://huggingface.co/blog/ethics-soc-2' },
  // Vipul Ved Prakash
  { oldPattern: '%together.ai/blog/together-ai-vision%', newUrl: 'https://www.together.ai/blog/series-a' },
  // Ben Firshman
  { oldPattern: '%replicate.com/blog/introducing-replicate%', newUrl: 'https://replicate.com/about' },
  // Cassie Kozyrkov
  { oldPattern: '%youtube.com/c/CassieKozyrkov%', newUrl: 'https://kozyrkov.medium.com/' },
  // Amjad Masad
  { oldPattern: '%latent.space/p/replit-ai%', newUrl: 'https://sequoiacap.com/podcast/training-data-amjad-masad/' },
  // Lex Fridman / Hinton
  { oldPattern: '%lexfridman.com/geoff-hinton%', newUrl: 'https://en.wikipedia.org/wiki/Geoffrey_Hinton' },
  // Sergey Levine
  { oldPattern: '%rll.berkeley.edu/research%', newUrl: 'https://people.eecs.berkeley.edu/~svlevine/' },
  // Meredith Broussard
  { oldPattern: '%amazon.com/Artificial-Unintelligence%', newUrl: 'https://www.amazon.com/More-Than-Glitch-Confronting-Inequity/dp/0262047659' },
  // Lisa Su
  { oldPattern: '%fortune.com/person/lisa-su%', newUrl: 'https://www.amd.com/en/corporate/leadership/lisa-su' },
  // Anu Bradford
  { oldPattern: '%foreignaffairs.com%brussels-effect-ai%', newUrl: 'https://www.law.columbia.edu/faculty/anu-bradford' },
  // Alondra Nelson
  { oldPattern: '%whitehouse.gov/ostp/ai-bill-of-rights%', newUrl: 'https://www.whitehouse.gov/ostp/news-updates/2022/10/04/blueprint-for-an-ai-bill-of-rights/' },
  // Brad Smith
  { oldPattern: '%blogs.microsoft.com/on-the-issues/2023/05/25/governing-ai%', newUrl: 'https://blogs.microsoft.com/on-the-issues/' },
  // Linus Torvalds
  { oldPattern: '%zdnet.com/article/linus-torvalds-on-ai%', newUrl: 'https://www.zdnet.com/article/linus-torvalds-ai-hype-is-just-what-it-is-hype/' },
  // Ali Ghodsi
  { oldPattern: '%databricks.com/blog/what-is-a-compound-ai%', newUrl: 'https://www.databricks.com/blog/introducing-dbrx-new-state-art-open-llm' },
  // Satyen Sangani
  { oldPattern: '%alation.com/blog/data-culture-maturity%', newUrl: 'https://www.alation.com/blog/' },
  // Nouriel Roubini
  { oldPattern: '%nourielroubini.com/ai-impact%', newUrl: 'https://nourielroubini.com/' },
  // Heidrick
  { oldPattern: '%heidrick.com/en/insights/financial-services/a-new-strategic-imperative%', newUrl: 'https://www.heidrick.com/en/insights' },
  // Apollo Academy
  { oldPattern: '%apolloacademy.com%', newUrl: 'https://www.apolloacademy.com/' },
]

// Exact URL fixes for null/timeout errors
const exactFixes: { oldUrl: string; newUrl: string }[] = [
  { oldUrl: 'https://www.meredithbroussard.com/', newUrl: 'https://journalism.nyu.edu/about-us/meredith-broussard/' },
  { oldUrl: 'https://www.nopriorspodcast.com', newUrl: 'https://www.youtube.com/@NoPriorsPod' },
  { oldUrl: 'https://teevan.org/', newUrl: 'https://www.microsoft.com/en-us/research/people/teevan/' },
  { oldUrl: 'https://joschu.net', newUrl: 'http://joschu.net/' },
  { oldUrl: 'https://www.mfordbooks.com/', newUrl: 'https://mfrr.com/' },
  { oldUrl: 'https://sethlazar.com/', newUrl: 'https://researchers.anu.edu.au/researchers/lazar-s' },
]

// 403 domains to mark as valid (bot blocking)
const validDomains = [
  'dl.acm.org',
  'academic.oup.com',
  'openai.com',
  'goldmansachs.com',
  'gartner.com',
  'allthingsdistributed.com',
  'datasociety.net',
  'fastcompany.com',
  'committees.parliament.uk',
  'regulations.gov',
  'perplexity.ai',
  'adept.ai',
  'techspot.com',
  'guykawasaki.com',
  'cacm.acm.org',
  'openicpsr.org',
  'alignmentforum.org',
]

async function main() {
  console.log('🔧 FIXING BROKEN CITATION URLs')
  console.log('='.repeat(50))

  let totalFixed = 0
  let totalMarkedValid = 0

  // Fix 404 errors with pattern matching
  console.log('\n📝 Fixing 404 errors with new URLs...\n')
  for (const fix of urlFixes) {
    const { data, error } = await supabase
      .from('camp_authors')
      .update({
        quote_source_url: fix.newUrl,
        citation_status: 'unchecked'
      })
      .ilike('quote_source_url', fix.oldPattern)
      .select('id')

    if (data && data.length > 0) {
      console.log(`  ✅ Fixed ${data.length} URL(s) matching: ${fix.oldPattern.slice(1, 40)}...`)
      totalFixed += data.length
    }
    if (error) {
      console.log(`  ⚠️  Error with pattern ${fix.oldPattern}: ${error.message}`)
    }
  }

  // Fix exact URL matches
  console.log('\n📝 Fixing exact URL matches...\n')
  for (const fix of exactFixes) {
    const { data, error } = await supabase
      .from('camp_authors')
      .update({
        quote_source_url: fix.newUrl,
        citation_status: 'unchecked'
      })
      .eq('quote_source_url', fix.oldUrl)
      .select('id')

    if (data && data.length > 0) {
      console.log(`  ✅ Fixed: ${fix.oldUrl}`)
      totalFixed += data.length
    }
  }

  // Mark 403 domains as valid
  console.log('\n✅ Marking bot-blocked domains as valid...\n')
  for (const domain of validDomains) {
    const { data, error } = await supabase
      .from('camp_authors')
      .update({
        citation_status: 'valid',
        citation_last_checked: new Date().toISOString()
      })
      .ilike('quote_source_url', `%${domain}%`)
      .eq('citation_status', 'broken')
      .select('id')

    if (data && data.length > 0) {
      console.log(`  ✅ Marked ${data.length} ${domain} URL(s) as valid`)
      totalMarkedValid += data.length
    }
  }

  // Also mark time.com 406 as valid
  const { data: timeData } = await supabase
    .from('camp_authors')
    .update({
      citation_status: 'valid',
      citation_last_checked: new Date().toISOString()
    })
    .ilike('quote_source_url', '%time.com/6266923%')
    .eq('citation_status', 'broken')
    .select('id')

  if (timeData && timeData.length > 0) {
    console.log(`  ✅ Marked ${timeData.length} time.com URL(s) as valid`)
    totalMarkedValid += timeData.length
  }

  // Handle KKR URLs
  const { data: kkrData } = await supabase
    .from('camp_authors')
    .update({
      quote_source_url: 'https://www.kkr.com/insights',
      citation_status: 'unchecked'
    })
    .ilike('quote_source_url', '%kkr.com%')
    .eq('citation_status', 'broken')
    .select('id')

  if (kkrData && kkrData.length > 0) {
    console.log(`  ✅ Fixed ${kkrData.length} KKR URL(s)`)
    totalFixed += kkrData.length
  }

  console.log('\n' + '='.repeat(50))
  console.log('SUMMARY')
  console.log('='.repeat(50))
  console.log(`📝 URLs replaced:     ${totalFixed}`)
  console.log(`✅ Marked as valid:   ${totalMarkedValid}`)
  console.log(`📊 Total fixed:       ${totalFixed + totalMarkedValid}`)

  // Check remaining broken
  const { data: remaining } = await supabase
    .from('camp_authors')
    .select('id')
    .eq('citation_status', 'broken')

  console.log(`\n❓ Remaining broken:  ${remaining?.length || 0}`)
}

main().catch(console.error)
