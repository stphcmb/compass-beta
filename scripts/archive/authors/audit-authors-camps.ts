// Audit script to check author-camp assignments for 42 recently-added authors
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// List of 42 authors added in recent expansion
const recentAuthors = [
  // Enterprise & Business
  'Thomas Davenport', 'Ethan Mollick', 'Azeem Azhar', 'Andrew McAfee',
  'Ajay Agrawal', 'Avi Goldfarb', 'Chip Huyen', 'Cassie Kozyrkov',
  // AI Safety & Alignment
  'Jan Leike', 'Paul Christiano', 'Connor Leahy', 'Chris Olah',
  'Robert Miles', 'Max Tegmark',
  // Policy & Governance
  'Alondra Nelson', 'Amba Kak', 'Woodrow Hartzog', 'Margot Kaminski',
  'Bruce Schneier', 'Marietje Schaake',
  // AI Ethics & Society
  'Joy Buolamwini', 'Meredith Broussard', 'Ruha Benjamin',
  'Kate Crawford', 'Safiya Noble', 'Rumman Chowdhury',
  // Startups & Industry
  'Aravind Srinivas', 'David Luan', 'Noam Shazeer', 'Emad Mostaque',
  'Mira Murati', 'Kevin Scott', 'Lisa Su', 'Douwe Kiela',
  // Research & Academia
  'Yejin Choi', 'Percy Liang', 'Oriol Vinyals', 'John Schulman',
  'Pushmeet Kohli', 'Daphne Koller', 'Chelsea Finn', 'Sergey Levine',
  'David Silver', 'Josh Tenenbaum', 'Daniela Rus', 'Pieter Abbeel',
  'Been Kim', 'Rediet Abebe',
  // International
  'Francesca Rossi', 'Ricardo Baeza-Yates', 'Ying Lu', 'Jianfeng Gao',
  // Creative & Media
  'Holly Herndon', 'Mat Dryhurst', 'Yannic Kilcher'
]

async function audit() {
  console.log('🔍 AUTHOR-CAMP ASSIGNMENT AUDIT')
  console.log('=' .repeat(60))
  console.log(`\nChecking ${recentAuthors.length} recently-added authors...\n`)

  // First, get all authors with their camp assignments
  const { data: authors, error: authorsError } = await supabase
    .from('authors')
    .select(`
      id,
      name,
      author_type,
      credibility_tier,
      primary_affiliation,
      header_affiliation
    `)
    .in('name', recentAuthors)

  if (authorsError) {
    console.error('❌ Error fetching authors:', authorsError.message)
    return
  }

  console.log(`Found ${authors?.length || 0} of ${recentAuthors.length} authors in database\n`)

  // Check which authors are missing from DB
  const foundNames = authors?.map(a => a.name) || []
  const missingFromDB = recentAuthors.filter(name => !foundNames.includes(name))

  if (missingFromDB.length > 0) {
    console.log('⚠️  AUTHORS NOT FOUND IN DATABASE:')
    missingFromDB.forEach(name => console.log(`   - ${name}`))
    console.log()
  }

  // Get camp assignments for found authors
  const authorIds = authors?.map(a => a.id) || []

  // Get camps info with dimension/domain hierarchy
  const { data: camps, error: campsListError } = await supabase
    .from('camps')
    .select('*')

  if (campsListError) {
    console.error('❌ Error fetching camps:', campsListError.message)
    return
  }

  // Debug: Show camps table structure
  if (camps && camps.length > 0) {
    console.log('DEBUG - Camps table columns:', Object.keys(camps[0]).join(', '))
    console.log('DEBUG - Sample camp:', JSON.stringify(camps[0], null, 2))
  }

  // Get domains for lookup (domain_id is numeric in actual schema)
  const { data: domains } = await supabase.from('domains').select('*')

  const domainsById: Record<number, any> = {}
  domains?.forEach(d => { domainsById[d.id] = d })

  console.log('DEBUG - Domains loaded:', domains?.length || 0)

  const campsById: Record<string, any> = {}
  camps?.forEach(c => {
    const domain = domainsById[c.domain_id]
    campsById[c.id] = {
      ...c,
      name: c.label || c.name || 'Unknown', // Use label as name
      domain: domain?.label || domain?.name || 'Unknown'
    }
  })

  const { data: campAssignments, error: campsError } = await supabase
    .from('camp_authors')
    .select('author_id, camp_id, relevance, key_quote, why_it_matters')
    .in('author_id', authorIds)

  if (campsError) {
    console.error('❌ Error fetching camp assignments:', campsError.message)
    return
  }

  // Group assignments by author
  const assignmentsByAuthor: Record<string, any[]> = {}
  campAssignments?.forEach(ca => {
    if (!assignmentsByAuthor[ca.author_id]) {
      assignmentsByAuthor[ca.author_id] = []
    }
    assignmentsByAuthor[ca.author_id].push(ca)
  })

  // AUDIT 1: Authors with NO camp assignments
  console.log('\n' + '='.repeat(60))
  console.log('🚨 AUTHORS WITH NO CAMP ASSIGNMENTS (invisible in app)')
  console.log('='.repeat(60))

  const noCamps: any[] = []
  authors?.forEach(author => {
    if (!assignmentsByAuthor[author.id] || assignmentsByAuthor[author.id].length === 0) {
      noCamps.push(author)
    }
  })

  if (noCamps.length === 0) {
    console.log('✅ All authors have at least one camp assignment')
  } else {
    console.log(`Found ${noCamps.length} authors with NO camp assignments:\n`)
    noCamps.forEach(author => {
      console.log(`   - ${author.name}`)
      console.log(`     Type: ${author.author_type || 'N/A'}`)
      console.log(`     Affiliation: ${author.primary_affiliation || author.header_affiliation || 'N/A'}`)
      console.log()
    })
  }

  // AUDIT 2: Authors with only 1 camp
  console.log('\n' + '='.repeat(60))
  console.log('⚠️  AUTHORS WITH ONLY 1 CAMP (may need more)')
  console.log('='.repeat(60))

  const oneCamp: any[] = []
  authors?.forEach(author => {
    const assignments = assignmentsByAuthor[author.id] || []
    if (assignments.length === 1) {
      oneCamp.push({ author, assignments })
    }
  })

  if (oneCamp.length === 0) {
    console.log('✅ All authors have multiple camp assignments')
  } else {
    console.log(`Found ${oneCamp.length} authors with only 1 camp:\n`)
    oneCamp.forEach(({ author, assignments }) => {
      const camp = campsById[assignments[0].camp_id]
      console.log(`   - ${author.name}`)
      console.log(`     Camp: ${camp?.name || 'Unknown'} (${assignments[0].relevance})`)
      console.log(`     Domain: ${camp?.domain || 'Unknown'}`)
      console.log()
    })
  }

  // AUDIT 3: Full summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 FULL CAMP ASSIGNMENT SUMMARY')
  console.log('='.repeat(60))

  // Sort by camp count (ascending)
  const summary = authors?.map(author => {
    const assignments = assignmentsByAuthor[author.id] || []
    return {
      name: author.name,
      type: author.author_type,
      campCount: assignments.length,
      camps: assignments.map(a => `${campsById[a.camp_id]?.name || 'Unknown'} (${a.relevance})`).join(', ')
    }
  }).sort((a, b) => a.campCount - b.campCount)

  console.log(`\n${'Name'.padEnd(25)} | Count | Camps`)
  console.log('-'.repeat(80))
  summary?.forEach(s => {
    console.log(`${s.name.padEnd(25)} | ${String(s.campCount).padStart(5)} | ${s.camps || 'NONE'}`)
  })

  // AUDIT 4: Check for missing key_quote or why_it_matters
  console.log('\n' + '='.repeat(60))
  console.log('📝 CAMP ASSIGNMENTS MISSING KEY DATA')
  console.log('='.repeat(60))

  const missingData: any[] = []
  campAssignments?.forEach(ca => {
    const author = authors?.find(a => a.id === ca.author_id)
    if (!ca.key_quote || !ca.why_it_matters) {
      missingData.push({
        author: author?.name,
        camp: campsById[ca.camp_id]?.name,
        missingQuote: !ca.key_quote,
        missingWhy: !ca.why_it_matters
      })
    }
  })

  if (missingData.length === 0) {
    console.log('✅ All camp assignments have key_quote and why_it_matters')
  } else {
    console.log(`Found ${missingData.length} assignments missing data:\n`)
    missingData.forEach(m => {
      const missing = []
      if (m.missingQuote) missing.push('key_quote')
      if (m.missingWhy) missing.push('why_it_matters')
      console.log(`   - ${m.author} → ${m.camp}: missing ${missing.join(', ')}`)
    })
  }

  // AUDIT 5: Debug - check for orphaned camp_ids
  console.log('\n' + '='.repeat(60))
  console.log('🔎 DEBUG: CAMP ID INTEGRITY CHECK')
  console.log('='.repeat(60))

  const allCampIds = new Set(camps?.map(c => c.id) || [])
  const usedCampIds = new Set(campAssignments?.map(ca => ca.camp_id) || [])

  const orphanedIds = [...usedCampIds].filter(id => !allCampIds.has(id))

  if (orphanedIds.length > 0) {
    console.log(`\n⚠️  Found ${orphanedIds.length} camp_ids in camp_authors that don't exist in camps table!`)
    console.log('\nOrphaned camp_ids (first 10):')
    orphanedIds.slice(0, 10).forEach(id => console.log(`   ${id}`))

    // Try to check if there's a domain column in camps
    if (camps && camps.length > 0) {
      console.log('\nCamps table structure (sample):')
      console.log('   Columns:', Object.keys(camps[0]).join(', '))
    }

    // Check for possible "domain" column in camp_authors if using older schema
    const { data: sampleCa } = await supabase
      .from('camp_authors')
      .select('*')
      .limit(1)
    if (sampleCa && sampleCa.length > 0) {
      console.log('\ncamp_authors table structure:')
      console.log('   Columns:', Object.keys(sampleCa[0]).join(', '))
    }
  } else {
    console.log('✅ All camp_ids in camp_authors exist in camps table')
  }

  console.log('\n' + '='.repeat(60))
  console.log('AUDIT COMPLETE')
  console.log('='.repeat(60))
}

audit().catch(console.error)
