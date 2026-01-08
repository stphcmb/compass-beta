#!/usr/bin/env node

/**
 * Enrich Remaining 21 Authors with Sources
 * Part 2 of author enrichment
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

console.log('🚀 Enriching remaining 21 authors...\n')

const updates = [
  // Major Voices
  {
    name: 'Ali Ghodsi',
    sources: [
      { url: 'https://www.databricks.com/', type: 'Organization', year: '2024', title: 'Databricks - Co-founder & CEO' },
      { url: 'https://www.youtube.com/@databricks', type: 'YouTube', year: '2024', title: 'Databricks YouTube Channel' },
      { url: 'https://databricks.com/blog/authors/ali-ghodsi', type: 'Blog', year: '2024', title: 'Databricks Blog - Ali Ghodsi' }
    ]
  },
  {
    name: 'Bret Taylor',
    sources: [
      { url: 'https://sierra.ai/', type: 'Organization', year: '2024', title: 'Sierra - Co-founder & CEO' },
      { url: 'https://twitter.com/btaylor', type: 'Blog', year: '2024', title: 'Bret Taylor on Twitter/X' }
    ]
  },
  {
    name: 'Byron Deeter',
    sources: [
      { url: 'https://www.bvp.com/team/byron-deeter', type: 'Organization', year: '2024', title: 'Bessemer Venture Partners' },
      { url: 'https://www.bvp.com/atlas/state-of-the-cloud-2024', type: 'Paper', year: '2024', title: 'State of the Cloud Report' },
      { url: 'https://twitter.com/byrondeeter', type: 'Blog', year: '2024', title: 'Byron Deeter on Twitter/X' }
    ]
  },
  {
    name: 'Charity Majors',
    sources: [
      { url: 'https://www.honeycomb.io/', type: 'Organization', year: '2024', title: 'Honeycomb - Co-founder & CTO' },
      { url: 'https://charity.wtf/', type: 'Blog', year: '2024', title: 'Charity.wtf Blog' }
    ]
  },
  {
    name: 'David Cahn',
    sources: [
      { url: 'https://www.sequoiacap.com/people/david-cahn/', type: 'Organization', year: '2024', title: 'Sequoia Capital' },
      { url: 'https://www.sequoiacap.com/article/data-ai-2024/', type: 'Paper', year: '2024', title: 'Sequoia AI Reports' }
    ]
  },
  {
    name: 'David Shapiro',
    sources: [
      { url: 'https://www.youtube.com/@DaveShap', type: 'YouTube', year: '2024', title: 'David Shapiro YouTube Channel' },
      { url: 'https://github.com/daveshap', type: 'Organization', year: '2024', title: 'David Shapiro GitHub' },
      { url: 'https://daveshap.gumroad.com/', type: 'Website', year: '2024', title: 'David Shapiro Resources' }
    ]
  },
  {
    name: 'Divya Siddarth',
    sources: [
      { url: 'https://cip.org/', type: 'Organization', year: '2024', title: 'Collective Intelligence Project' },
      { url: 'https://www.radicalxchange.org/', type: 'Organization', year: '2024', title: 'RadicalxChange Foundation' },
      { url: 'https://twitter.com/divyasiddarth', type: 'Blog', year: '2024', title: 'Divya Siddarth on Twitter/X' }
    ]
  },
  {
    name: 'Ed Zitron',
    sources: [
      { url: 'https://www.wheresyoured.at/', type: 'Blog', year: '2024', title: 'Where\'s Your Ed At (Newsletter)' },
      { url: 'https://ez.substack.com/', type: 'Blog', year: '2024', title: 'Ed Zitron\'s Substack' }
    ]
  },
  {
    name: 'Elizabeth Kelly',
    sources: [
      { url: 'https://www.nist.gov/artificial-intelligence', type: 'Organization', year: '2024', title: 'NIST AI Program' },
      { url: 'https://airc.nist.gov/', type: 'Organization', year: '2024', title: 'NIST AI Risk Management Framework' }
    ]
  },
  {
    name: 'Janet Haven',
    sources: [
      { url: 'https://datasociety.net/', type: 'Organization', year: '2024', title: 'Data & Society Research Institute' },
      { url: 'https://twitter.com/Janet_Haven', type: 'Blog', year: '2024', title: 'Janet Haven on Twitter/X' }
    ]
  },
  {
    name: 'Jim Covello',
    sources: [
      { url: 'https://www.goldmansachs.com/', type: 'Organization', year: '2024', title: 'Goldman Sachs Research' },
      { url: 'https://www.goldmansachs.com/insights/pages/ai-research.html', type: 'Research', year: '2024', title: 'Goldman Sachs AI Research' }
    ]
  },
  {
    name: 'Leopold Aschenbrenner',
    sources: [
      { url: 'https://situational-awareness.ai/', type: 'Paper', year: '2024', title: 'Situational Awareness: The Decade Ahead' },
      { url: 'https://twitter.com/leopoldaschenbr', type: 'Blog', year: '2024', title: 'Leopold Aschenbrenner on Twitter/X' }
    ]
  },
  {
    name: 'Martin Casado',
    sources: [
      { url: 'https://a16z.com/author/martin-casado/', type: 'Organization', year: '2024', title: 'Andreessen Horowitz' },
      { url: 'https://a16z.com/generative-ai-enterprise/', type: 'Paper', year: '2024', title: 'a16z AI Research' }
    ]
  },
  {
    name: 'Rita Sallam',
    sources: [
      { url: 'https://www.gartner.com/en/experts/rita-sallam', type: 'Organization', year: '2024', title: 'Gartner - VP Analyst' },
      { url: 'https://www.gartner.com/en/topics/artificial-intelligence', type: 'Research', year: '2024', title: 'Gartner AI Research' }
    ]
  },
  {
    name: 'Sarah Guo',
    sources: [
      { url: 'https://www.conviction.com/', type: 'Organization', year: '2024', title: 'Conviction - Founder & Managing Partner' },
      { url: 'https://www.conviction.com/writing', type: 'Blog', year: '2024', title: 'Conviction Blog' }
    ]
  },
  {
    name: 'Sasha Luccioni',
    sources: [
      { url: 'https://huggingface.co/', type: 'Organization', year: '2024', title: 'Hugging Face - Climate Lead' },
      { url: 'https://scholar.google.com/citations?user=1ZJW_EUAAAAJ', type: 'Research', year: '2024', title: 'Google Scholar - Sasha Luccioni' }
    ]
  },
  {
    name: 'Satyen Sangani',
    sources: [
      { url: 'https://www.alation.com/', type: 'Organization', year: '2024', title: 'Alation - Co-founder & CEO' },
      { url: 'https://www.alation.com/blog/author/satyen-sangani/', type: 'Blog', year: '2024', title: 'Alation Blog - Satyen Sangani' }
    ]
  },
  {
    name: 'Seth Lazar',
    sources: [
      { url: 'https://www.sethlazar.xyz/', type: 'Website', year: '2024', title: 'Seth Lazar Personal Site' },
      { url: 'https://philosophy.anu.edu.au/people/academics/seth-lazar', type: 'Research', year: '2024', title: 'Australian National University' },
      { url: 'https://arxiv.org/search/?query=seth+lazar&searchtype=author', type: 'Research', year: '2024', title: 'Research Papers on arXiv' }
    ]
  },
  {
    name: 'Shawn "swyx" Wang',
    sources: [
      { url: 'https://www.latent.space/', type: 'Podcast', year: '2024', title: 'Latent Space Podcast' },
      { url: 'https://www.swyx.io/', type: 'Blog', year: '2024', title: 'swyx.io Blog' }
    ]
  },
  {
    name: 'Simon Willison',
    sources: [
      { url: 'https://simonwillison.net/', type: 'Blog', year: '2024', title: 'Simon Willison\'s Weblog' },
      { url: 'https://github.com/simonw', type: 'Organization', year: '2024', title: 'Simon Willison GitHub' }
    ]
  },
  // Seminal Thinkers
  {
    name: 'Avi Goldfarb',
    sources: [
      { url: 'https://www.rotman.utoronto.ca/FacultyAndResearch/Faculty/FacultyBios/Goldfarb', type: 'Research', year: '2024', title: 'Rotman School of Management' },
      { url: 'https://mitpress.mit.edu/9780262538800/prediction-machines/', type: 'Book', year: '2018', title: 'Prediction Machines: The Simple Economics of AI' }
    ]
  }
]

let successCount = 0
let errorCount = 0
const errors = []

// Process all updates
for (const update of updates) {
  try {
    // Get existing sources
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

    // Merge with existing sources
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

// Final verification - check all authors now
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('🔍 FINAL DATABASE STATE')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

const { data: allAuthors } = await supabase
  .from('authors')
  .select('name, sources, credibility_tier')
  .order('name')

if (allAuthors) {
  const needEnrichment = allAuthors.filter(a => {
    const count = a.sources ? a.sources.length : 0
    return count < 3
  })

  console.log(`Total authors: ${allAuthors.length}`)
  console.log(`✅ With 3+ sources: ${allAuthors.length - needEnrichment.length}`)
  console.log(`⚠️  Still need enrichment: ${needEnrichment.length}`)

  if (needEnrichment.length > 0) {
    console.log('\nAuthors still needing enrichment:')
    needEnrichment.forEach(a => {
      const count = a.sources ? a.sources.length : 0
      console.log(`  - ${a.name}: ${count} sources`)
    })
  } else {
    console.log('\n🎉 ALL AUTHORS NOW HAVE 3+ SOURCES!')
  }
}

console.log('\n✨ Enrichment complete! Check localhost to see updates.\n')
