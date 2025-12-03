#!/usr/bin/env node

import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load .env.local file
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Thoughtful explanations for each camp-author relationship based on relevance type
const explanations = {
  // AI Technical Capabilities
  SCALING_MAXIMALIST: {
    strong: "Champions the belief that scaling compute, data, and model size is the primary path to AGI",
    partial: "Supports scaling research while acknowledging potential limitations or complementary approaches",
    challenges: "Questions pure scaling approaches, emphasizing fundamental limitations of current architectures",
    emerging: "Represents an evolving perspective on scaling's role in achieving artificial general intelligence"
  },
  GROUNDING_REALIST: {
    strong: "Argues that current LLMs lack true understanding and need grounding in physical/causal reality",
    partial: "Recognizes grounding challenges while seeing value in current statistical learning approaches",
    challenges: "Believes scaling and statistical learning can overcome grounding limitations",
    emerging: "Exploring novel architectural approaches to bridge the gap between statistics and understanding"
  },

  // AI & Society
  ETHICAL_STEWARD: {
    strong: "Prioritizes addressing AI harms, bias, and social impacts as the central concern",
    partial: "Balances ethical considerations with technical progress and innovation goals",
    challenges: "Sees ethical concerns as overstated or secondary to innovation imperatives",
    emerging: "Developing new frameworks for thinking about AI ethics and accountability"
  },
  TECH_REALIST: {
    strong: "Advocates for balanced, evidence-based approach to AI capabilities and limitations",
    partial: "Generally realistic but leans toward either optimism or caution on specific issues",
    challenges: "Takes a more extreme position—either highly optimistic or deeply skeptical",
    emerging: "Formulating nuanced middle-ground perspectives as the field matures"
  },
  TECH_UTOPIAN: {
    strong: "Believes AI will fundamentally solve major human problems and democratize opportunity",
    partial: "Optimistic about AI's potential but acknowledges significant risks or equity concerns",
    challenges: "Emphasizes AI's risks, harms, or tendency to concentrate rather than distribute power",
    emerging: "Exploring conditional optimism—utopian outcomes contingent on specific governance choices"
  },
  DEMOCRATIZE_FAST: {
    strong: "Advocates for rapid, open access to AI tools to distribute power broadly",
    partial: "Supports democratization but with some safeguards or concerns about misuse",
    challenges: "Warns that rapid democratization risks amplifying harms or empowering bad actors",
    emerging: "Developing frameworks for responsible democratization with appropriate guardrails"
  },

  // Enterprise AI Adoption
  ADOPTION_TECH_FIRST: {
    strong: "Believes organizations should prioritize AI infrastructure and capabilities as foundation",
    partial: "Values technical excellence but recognizes need for organizational readiness",
    challenges: "Argues people, culture, and process must lead technological transformation",
    emerging: "Developing integrated models where technology and organization co-evolve"
  },
  ADOPTION_CO_EVOLUTION: {
    strong: "Champions simultaneous evolution of people, processes, and technology for AI adoption",
    partial: "Generally supports co-evolution but may emphasize one element more than others",
    challenges: "Believes clear sequencing (tech-first or people-first) is more effective than parallel evolution",
    emerging: "Exploring new frameworks for orchestrating organizational transformation"
  },
  TRANSLATION_PROOF_SEEKERS: {
    strong: "Demands measurable ROI and concrete validation before enterprise AI investment",
    partial: "Values proof while accepting some experimentation and strategic uncertainty",
    challenges: "Willing to invest based on strategic potential rather than requiring proven ROI",
    emerging: "Developing new metrics and frameworks for evaluating AI business impact"
  },
  TRANSLATION_BUSINESS_WHISPERERS: {
    strong: "Specializes in translating between business needs and AI technical capabilities",
    partial: "Understands both domains but may lean more technical or more business-oriented",
    challenges: "Believes either pure technical or pure business thinking is sufficient without translation",
    emerging: "Creating new hybrid roles and frameworks for business-AI integration"
  },
  TRANSLATION_TECH_BUILDERS: {
    strong: "Believes technical excellence and robust AI implementation drive adoption success",
    partial: "Values strong technical foundation while recognizing organizational factors",
    challenges: "Argues business strategy and change management matter more than technical execution",
    emerging: "Developing new approaches to technical architecture that enable business agility"
  },

  // AI Governance & Oversight
  REGULATORY_INTERVENTIONIST: {
    strong: "Advocates for immediate, comprehensive regulation to prevent AI harms and risks",
    partial: "Supports meaningful regulation but favors gradual or targeted approaches",
    challenges: "Opposes regulation as stifling innovation or empowering incumbents over startups",
    emerging: "Exploring new models for adaptive, effective governance"
  },
  INNOVATION_FIRST: {
    strong: "Prioritizes minimal regulation to maximize innovation velocity and market competition",
    partial: "Generally pro-innovation but accepts some baseline safety or transparency rules",
    challenges: "Believes strong oversight is necessary to prevent catastrophic or harmful outcomes",
    emerging: "Developing frameworks for innovation-compatible governance structures"
  },
  ADAPTIVE_GOVERNANCE: {
    strong: "Advocates for flexible, iterative regulation that evolves with technology",
    partial: "Supports adaptive approaches while leaning toward more or less intervention",
    challenges: "Believes clear, immediate rules (or minimal rules) are superior to adaptive uncertainty",
    emerging: "Pioneering new models for responsive, learning-based governance systems"
  },

  // Future of Work
  HUMAN_AI_COLLAB: {
    strong: "Believes AI will primarily augment human capabilities rather than replace workers",
    partial: "Sees both augmentation and displacement, with balance depending on implementation",
    challenges: "Emphasizes displacement risks and structural unemployment from AI automation",
    emerging: "Developing new models of human-AI collaboration and labor market evolution"
  },
  DISPLACEMENT_REALIST: {
    strong: "Acknowledges significant job displacement and need for social safety nets or reskilling",
    partial: "Recognizes displacement risks while remaining optimistic about job creation",
    challenges: "Believes new jobs and augmentation will offset displacement concerns",
    emerging: "Formulating nuanced views on which jobs face displacement vs transformation"
  }
}

async function populateWhyItMatters() {
  try {
    console.log('📝 Fetching all camp-author relationships...\n')

    // Get all camp_authors with their camp and author info
    const { data: relationships, error } = await supabase
      .from('camp_authors')
      .select(`
        id,
        relevance,
        camps (code),
        authors (name)
      `)

    if (error) {
      console.error('Error fetching relationships:', error)
      return
    }

    console.log(`Found ${relationships.length} relationships\n`)

    let updated = 0
    let skipped = 0

    for (const rel of relationships) {
      const campCode = rel.camps?.code
      const relevance = rel.relevance
      const authorName = rel.authors?.name

      if (!campCode || !relevance) {
        console.log(`⚠️  Skipping ${authorName}: missing camp code or relevance`)
        skipped++
        continue
      }

      const explanation = explanations[campCode]?.[relevance]

      if (!explanation) {
        console.log(`⚠️  No explanation found for ${authorName} -> ${campCode} [${relevance}]`)
        skipped++
        continue
      }

      // Update the why_it_matters field
      const { error: updateError } = await supabase
        .from('camp_authors')
        .update({ why_it_matters: explanation })
        .eq('id', rel.id)

      if (updateError) {
        console.error(`❌ Error updating ${authorName}:`, updateError)
      } else {
        console.log(`✅ ${authorName} -> ${campCode} [${relevance}]`)
        updated++
      }
    }

    console.log(`\n📊 Summary:`)
    console.log(`   ✅ Updated: ${updated}`)
    console.log(`   ⚠️  Skipped: ${skipped}`)
    console.log(`   📝 Total: ${relationships.length}`)

  } catch (error) {
    console.error('Error:', error)
  }
}

populateWhyItMatters()
