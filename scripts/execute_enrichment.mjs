#!/usr/bin/env node

/**
 * Execute Author Sources Enrichment on Supabase
 * Adds missing publications for 34 high-priority authors
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

console.log('🚀 Starting author sources enrichment...\n')

const updates = [
  // Seminal Thinkers
  {
    name: 'Alondra Nelson',
    sources: [
      { url: 'https://www.whitehouse.gov/ostp/', type: 'Organization', year: '2024', title: 'Former Deputy Director for Science & Society, White House OSTP' },
      { url: 'https://www.ias.edu/scholars/alondra-nelson', type: 'Research', year: '2024', title: 'Institute for Advanced Study' },
      { url: 'https://en.wikipedia.org/wiki/The_Social_Life_of_DNA', type: 'Book', year: '2016', title: 'The Social Life of DNA: Race, Reparations, and Reconciliation' }
    ]
  },
  {
    name: 'Arvind Narayanan',
    sources: [
      { url: 'https://www.cs.princeton.edu/~arvindn/', type: 'Research', year: '2024', title: 'Princeton Computer Science' },
      { url: 'https://press.princeton.edu/books/hardcover/9780262035668/ai-snake-oil', type: 'Book', year: '2024', title: 'AI Snake Oil: What Artificial Intelligence Can Do, What It Can\'t' },
      { url: 'https://aisnakeoil.substack.com/', type: 'Blog', year: '2024', title: 'AI Snake Oil Substack' }
    ]
  },
  {
    name: 'Benedict Evans',
    sources: [
      { url: 'https://www.ben-evans.com/', type: 'Website', year: '2024', title: 'Benedict Evans' },
      { url: 'https://www.ben-evans.com/newsletter', type: 'Blog', year: '2024', title: 'Benedict Evans Newsletter' },
      { url: 'https://twitter.com/benedictevans', type: 'Blog', year: '2024', title: 'Benedict Evans on Twitter/X' }
    ]
  },
  {
    name: 'Brad Smith',
    sources: [
      { url: 'https://blogs.microsoft.com/on-the-issues/author/brad-smith/', type: 'Blog', year: '2024', title: 'Brad Smith on Microsoft On the Issues' },
      { url: 'https://news.microsoft.com/source/authors/brad-smith/', type: 'Organization', year: '2024', title: 'Microsoft News - Brad Smith' },
      { url: 'https://www.penguinrandomhouse.com/books/600774/tools-and-weapons-by-brad-smith-and-carol-ann-browne/', type: 'Book', year: '2019', title: 'Tools and Weapons: The Promise and the Peril of the Digital Age' }
    ]
  },
  {
    name: 'Dan Hendrycks',
    sources: [
      { url: 'https://www.safe.ai/', type: 'Organization', year: '2024', title: 'Center for AI Safety' },
      { url: 'https://www.safe.ai/work/statement-on-ai-risk', type: 'Paper', year: '2023', title: 'Statement on AI Risk - Signed by AI leaders' },
      { url: 'https://arxiv.org/search/?query=dan+hendrycks&searchtype=author', type: 'Research', year: '2024', title: 'Research Papers on arXiv' }
    ]
  },
  {
    name: 'François Chollet',
    sources: [
      { url: 'https://fchollet.com/', type: 'Website', year: '2024', title: 'François Chollet Personal Site' },
      { url: 'https://www.manning.com/books/deep-learning-with-python-second-edition', type: 'Book', year: '2021', title: 'Deep Learning with Python (2nd Edition)' },
      { url: 'https://github.com/keras-team/keras', type: 'Organization', year: '2024', title: 'Keras - Creator' }
    ]
  },
  {
    name: 'Joshua Gans',
    sources: [
      { url: 'https://www.joshuagans.com/', type: 'Website', year: '2024', title: 'Joshua Gans Personal Site' },
      { url: 'https://mitpress.mit.edu/9780262538800/prediction-machines/', type: 'Book', year: '2018', title: 'Prediction Machines: The Simple Economics of AI' },
      { url: 'https://mitpress.mit.edu/9780262047609/power-and-prediction/', type: 'Book', year: '2022', title: 'Power and Prediction: The Disruptive Economics of Artificial Intelligence' }
    ]
  },
  {
    name: 'Nouriel Roubini',
    sources: [
      { url: 'https://www.stern.nyu.edu/faculty/bio/nouriel-roubini', type: 'Research', year: '2024', title: 'NYU Stern School of Business' },
      { url: 'https://www.penguinrandomhouse.com/books/673919/megathreats-by-nouriel-roubini/', type: 'Book', year: '2022', title: 'MegaThreats: Ten Dangerous Trends That Imperil Our Future' },
      { url: 'https://twitter.com/Nouriel', type: 'Blog', year: '2024', title: 'Nouriel Roubini on Twitter/X' }
    ]
  },
  {
    name: 'Paul Christiano',
    sources: [
      { url: 'https://alignment.org/', type: 'Organization', year: '2024', title: 'Alignment Research Center' },
      { url: 'https://www.lesswrong.com/users/paulfchristiano', type: 'Blog', year: '2024', title: 'LessWrong - Paul Christiano' },
      { url: 'https://ai-alignment.com/', type: 'Website', year: '2024', title: 'AI Alignment Forum' }
    ]
  },
  {
    name: 'Pedro Domingos',
    sources: [
      { url: 'https://homes.cs.washington.edu/~pedrod/', type: 'Research', year: '2024', title: 'University of Washington Computer Science' },
      { url: 'https://www.basicbooks.com/titles/pedro-domingos/the-master-algorithm/9780465094271/', type: 'Book', year: '2015', title: 'The Master Algorithm' },
      { url: 'https://twitter.com/pmddomingos', type: 'Blog', year: '2024', title: 'Pedro Domingos on Twitter/X' }
    ]
  },
  {
    name: 'Rodney Brooks',
    sources: [
      { url: 'https://rodneybrooks.com/', type: 'Website', year: '2024', title: 'Rodney Brooks Personal Site' },
      { url: 'https://www.irobot.com/', type: 'Organization', year: '2024', title: 'iRobot - Co-founder' },
      { url: 'https://mitpress.mit.edu/9780262534147/intelligence-without-representation/', type: 'Paper', year: '1991', title: 'Intelligence Without Representation (Seminal Paper)' }
    ]
  },
  {
    name: 'Ted Chiang',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Ted_Chiang', type: 'Website', year: '2024', title: 'Ted Chiang Bibliography' },
      { url: 'https://www.penguinrandomhouse.com/books/708803/exhalation-by-ted-chiang/', type: 'Book', year: '2019', title: 'Exhalation: Stories' },
      { url: 'https://www.newyorker.com/contributors/ted-chiang', type: 'Blog', year: '2024', title: 'The New Yorker - Ted Chiang' }
    ]
  },
  // Major Voices
  {
    name: 'Anu Bradford',
    sources: [
      { url: 'https://www.law.columbia.edu/faculty/anu-bradford', type: 'Research', year: '2024', title: 'Columbia Law School' },
      { url: 'https://global.oup.com/academic/product/the-brussels-effect-9780190088583', type: 'Book', year: '2020', title: 'The Brussels Effect: How the European Union Rules the World' },
      { url: 'https://global.oup.com/academic/product/digital-empires-9780197649268', type: 'Book', year: '2023', title: 'Digital Empires: The Global Battle to Regulate Technology' }
    ]
  },
  {
    name: 'Chip Huyen',
    sources: [
      { url: 'https://huyenchip.com/', type: 'Website', year: '2024', title: 'Chip Huyen Personal Site' },
      { url: 'https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/', type: 'Book', year: '2022', title: 'Designing Machine Learning Systems' },
      { url: 'https://claypot.ai/', type: 'Organization', year: '2024', title: 'Claypot AI - Founder' }
    ]
  },
  {
    name: 'Connor Leahy',
    sources: [
      { url: 'https://conjecture.dev/', type: 'Organization', year: '2024', title: 'Conjecture - Co-founder & CEO' },
      { url: 'https://twitter.com/NPCollapse', type: 'Blog', year: '2024', title: 'Connor Leahy on Twitter/X' },
      { url: 'https://www.lesswrong.com/users/connor_leahy', type: 'Blog', year: '2024', title: 'LessWrong - Connor Leahy' }
    ]
  },
  {
    name: 'Gergely Orosz',
    sources: [
      { url: 'https://blog.pragmaticengineer.com/', type: 'Blog', year: '2024', title: 'The Pragmatic Engineer' },
      { url: 'https://newsletter.pragmaticengineer.com/', type: 'Blog', year: '2024', title: 'The Pragmatic Engineer Newsletter' },
      { url: 'https://twitter.com/GergelyOrosz', type: 'Blog', year: '2024', title: 'Gergely Orosz on Twitter/X' }
    ]
  },
  {
    name: 'Harrison Chase',
    sources: [
      { url: 'https://www.langchain.com/', type: 'Organization', year: '2024', title: 'LangChain - Co-founder & CEO' },
      { url: 'https://github.com/langchain-ai/langchain', type: 'Organization', year: '2024', title: 'LangChain GitHub' },
      { url: 'https://twitter.com/hwchase17', type: 'Blog', year: '2024', title: 'Harrison Chase on Twitter/X' }
    ]
  },
  {
    name: 'Jack Clark',
    sources: [
      { url: 'https://www.anthropic.com/', type: 'Organization', year: '2024', title: 'Anthropic - Co-founder' },
      { url: 'https://jack-clark.net/', type: 'Blog', year: '2024', title: 'Import AI Newsletter' },
      { url: 'https://twitter.com/jackclarkSF', type: 'Blog', year: '2024', title: 'Jack Clark on Twitter/X' }
    ]
  },
  {
    name: 'Marietje Schaake',
    sources: [
      { url: 'https://hai.stanford.edu/people/marietje-schaake', type: 'Research', year: '2024', title: 'Stanford HAI - International Policy Director' },
      { url: 'https://www.cambridge.org/core/books/tech-coup/2348266FCA4843088E6CD1C51B942FBC', type: 'Book', year: '2024', title: 'The Tech Coup: How to Save Democracy from Silicon Valley' },
      { url: 'https://twitter.com/MarietjeSchaake', type: 'Blog', year: '2024', title: 'Marietje Schaake on Twitter/X' }
    ]
  },
  {
    name: 'Meredith Whittaker',
    sources: [
      { url: 'https://signal.org/', type: 'Organization', year: '2024', title: 'Signal - President' },
      { url: 'https://ainowinstitute.org/', type: 'Organization', year: '2024', title: 'AI Now Institute - Co-founder' },
      { url: 'https://twitter.com/mer__edith', type: 'Blog', year: '2024', title: 'Meredith Whittaker on Twitter/X' }
    ]
  },
  {
    name: 'Palmer Luckey',
    sources: [
      { url: 'https://www.anduril.com/', type: 'Organization', year: '2024', title: 'Anduril Industries - Founder' },
      { url: 'https://en.wikipedia.org/wiki/Palmer_Luckey', type: 'Website', year: '2024', title: 'Palmer Luckey Biography' },
      { url: 'https://twitter.com/PalmerLuckey', type: 'Blog', year: '2024', title: 'Palmer Luckey on Twitter/X' }
    ]
  },
  {
    name: 'Thomas Kurian',
    sources: [
      { url: 'https://cloud.google.com/', type: 'Organization', year: '2024', title: 'Google Cloud - CEO' },
      { url: 'https://cloud.google.com/blog/topics/inside-google-cloud/ceo-thomas-kurian', type: 'Blog', year: '2024', title: 'Google Cloud Blog - Thomas Kurian' },
      { url: 'https://www.linkedin.com/in/thomas-kurian-469b1b2/', type: 'Website', year: '2024', title: 'Thomas Kurian LinkedIn' }
    ]
  },
  {
    name: 'Vera Jourova',
    sources: [
      { url: 'https://ec.europa.eu/commission/commissioners/2019-2024/jourova_en', type: 'Organization', year: '2024', title: 'European Commission - VP for Values & Transparency' },
      { url: 'https://digital-strategy.ec.europa.eu/en/policies/digital-services-act-package', type: 'Organization', year: '2024', title: 'EU Digital Services Act' },
      { url: 'https://twitter.com/VeraJourova', type: 'Blog', year: '2024', title: 'Věra Jourová on Twitter/X' }
    ]
  }
]

// Updates for authors with 1 existing source (append)
const appendUpdates = [
  { name: 'Carl Benedikt Frey', sources: [
    { url: 'https://www.oxfordmartin.ox.ac.uk/people/carl-benedikt-frey/', type: 'Research', year: '2024', title: 'Oxford Martin School' },
    { url: 'https://press.princeton.edu/books/hardcover/9780691179681/the-technology-trap', type: 'Book', year: '2019', title: 'The Technology Trap: Capital, Labor, and Power in the Age of Automation' }
  ]},
  { name: 'Joy Buolamwini', sources: [
    { url: 'https://www.media.mit.edu/people/joyab/overview/', type: 'Research', year: '2024', title: 'MIT Media Lab' },
    { url: 'https://www.penguinrandomhouse.com/books/645999/unmasking-ai-by-joy-buolamwini-phd/', type: 'Book', year: '2023', title: 'Unmasking AI: My Mission to Protect What Is Human in a World of Machines' }
  ]},
  { name: 'Kenneth Stanley', sources: [
    { url: 'https://www.cs.ucf.edu/~kstanley/', type: 'Research', year: '2024', title: 'UCF Computer Science' },
    { url: 'https://www.penguinrandomhouse.com/books/313332/why-greatness-cannot-be-planned-by-kenneth-o-stanley-and-joel-lehman/', type: 'Book', year: '2015', title: 'Why Greatness Cannot Be Planned' }
  ]},
  { name: 'Linus Torvalds', sources: [
    { url: 'https://github.com/torvalds', type: 'Organization', year: '2024', title: 'GitHub - Linux Kernel' },
    { url: 'https://www.linuxfoundation.org/', type: 'Organization', year: '2024', title: 'Linux Foundation' }
  ]},
  { name: 'Margrethe Vestager', sources: [
    { url: 'https://ec.europa.eu/commission/commissioners/2019-2024/vestager_en', type: 'Organization', year: '2024', title: 'European Commission - Executive VP' },
    { url: 'https://digital-strategy.ec.europa.eu/en', type: 'Organization', year: '2024', title: 'EU Digital Strategy' }
  ]},
  { name: 'Subbarao Kambhampati', sources: [
    { url: 'https://rakaposhi.eas.asu.edu/', type: 'Research', year: '2024', title: 'Arizona State University' },
    { url: 'https://arxiv.org/search/?query=subbarao+kambhampati&searchtype=author', type: 'Research', year: '2024', title: 'Research Papers on arXiv' }
  ]},
  { name: 'Vinod Khosla', sources: [
    { url: 'https://www.khoslaventures.com/', type: 'Organization', year: '2024', title: 'Khosla Ventures' },
    { url: 'https://twitter.com/vkhosla', type: 'Blog', year: '2024', title: 'Vinod Khosla on Twitter/X' }
  ]},
  { name: 'Werner Vogels', sources: [
    { url: 'https://www.allthingsdistributed.com/', type: 'Blog', year: '2024', title: 'All Things Distributed (Personal Blog)' },
    { url: 'https://aws.amazon.com/', type: 'Organization', year: '2024', title: 'Amazon Web Services - CTO' }
  ]},
  { name: 'Zvi Mowshowitz', sources: [
    { url: 'https://thezvi.substack.com/', type: 'Blog', year: '2024', title: 'Don\'t Worry About the Vase (Substack)' },
    { url: 'https://www.lesswrong.com/users/zvi-mowshowitz', type: 'Blog', year: '2024', title: 'LessWrong - Zvi' }
  ]},
  { name: 'Amba Kak', sources: [
    { url: 'https://ainowinstitute.org/people/amba-kak', type: 'Organization', year: '2024', title: 'AI Now Institute - Director' },
    { url: 'https://twitter.com/ambaonadventure', type: 'Blog', year: '2024', title: 'Amba Kak on Twitter/X' }
  ]},
  { name: 'Gary Marcus', sources: [
    { url: 'https://garymarcus.substack.com/', type: 'Blog', year: '2024', title: 'Marcus on AI (Substack)' },
    { url: 'https://mitpress.mit.edu/9780262046183/rebooting-ai/', type: 'Book', year: '2019', title: 'Rebooting AI: Building Artificial Intelligence We Can Trust' }
  ]}
]

let successCount = 0
let errorCount = 0
const errors = []

// Replace sources (0 sources → 3)
console.log('📝 Updating authors with 0 sources...\n')
for (const update of updates) {
  try {
    const { error } = await supabase
      .from('authors')
      .update({
        sources: update.sources,
        updated_at: new Date().toISOString()
      })
      .eq('name', update.name)

    if (error) throw error

    console.log(`✅ ${update.name}: 0 → ${update.sources.length} sources`)
    successCount++
  } catch (error) {
    console.error(`❌ ${update.name}: ${error.message}`)
    errorCount++
    errors.push({ name: update.name, error: error.message })
  }
}

// Append sources (1 source → 3)
console.log('\n📝 Appending sources to authors with 1 source...\n')
for (const update of appendUpdates) {
  try {
    // First get existing sources
    const { data: author } = await supabase
      .from('authors')
      .select('sources')
      .eq('name', update.name)
      .single()

    if (!author) {
      console.error(`❌ ${update.name}: Author not found`)
      errorCount++
      continue
    }

    // Append new sources to existing
    const existingSources = author.sources || []
    const newSources = [...existingSources, ...update.sources]

    const { error } = await supabase
      .from('authors')
      .update({
        sources: newSources,
        updated_at: new Date().toISOString()
      })
      .eq('name', update.name)

    if (error) throw error

    console.log(`✅ ${update.name}: ${existingSources.length} → ${newSources.length} sources`)
    successCount++
  } catch (error) {
    console.error(`❌ ${update.name}: ${error.message}`)
    errorCount++
    errors.push({ name: update.name, error: error.message })
  }
}

// Summary
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('📊 ENRICHMENT SUMMARY')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
console.log(`✅ Successful updates: ${successCount}`)
console.log(`❌ Failed updates: ${errorCount}`)

if (errors.length > 0) {
  console.log('\n⚠️  Errors:')
  errors.forEach(e => console.log(`   - ${e.name}: ${e.error}`))
}

// Verification
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('🔍 VERIFICATION')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

const allNames = [
  ...updates.map(u => u.name),
  ...appendUpdates.map(u => u.name)
]

const { data: verifyAuthors } = await supabase
  .from('authors')
  .select('name, header_affiliation, credibility_tier, sources')
  .in('name', allNames)
  .order('credibility_tier', { ascending: true })
  .order('name', { ascending: true })

if (verifyAuthors) {
  verifyAuthors.forEach(author => {
    const sourceCount = author.sources ? author.sources.length : 0
    const status = sourceCount >= 3 ? '✅' : '⚠️'
    console.log(`${status} ${author.name} (${author.header_affiliation}): ${sourceCount} sources`)
  })
}

console.log('\n✨ Enrichment complete! Check your localhost to see the updates.\n')
