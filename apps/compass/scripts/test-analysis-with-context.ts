/**
 * Test Analysis with Editor Context
 *
 * Tests the analysis flow with hardcoded editor context (no DB needed).
 * This verifies the prompt injection and personalization works.
 *
 * Usage: npx tsx scripts/test-analysis-with-context.ts
 */

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { analyzeText } from '@/lib/ai-editor/analyzer'
import { buildEditorContext, EditorMemory } from '@/lib/ai-editor/editor-memory'

// Hardcoded test memories (simulating what would come from DB)
const testMemories: EditorMemory[] = [
  {
    id: '1',
    clerk_user_id: 'test',
    memory_type: 'voice',
    content: 'Writes in a direct, assertive tone. Prefers short punchy sentences over long complex ones.',
    source: 'test',
    confidence: 0.8,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    clerk_user_id: 'test',
    memory_type: 'stance',
    content: 'Generally supportive of AI regulation and government oversight. Skeptical of industry self-regulation.',
    source: 'test',
    confidence: 0.7,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    clerk_user_id: 'test',
    memory_type: 'stance',
    content: 'Values perspectives from Yoshua Bengio and Stuart Russell. Frequently cites academic researchers over industry voices.',
    source: 'test',
    confidence: 0.75,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    clerk_user_id: 'test',
    memory_type: 'guideline',
    content: 'Always include concrete data points to support claims. Avoid vague generalizations.',
    source: 'test',
    confidence: 0.9,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    clerk_user_id: 'test',
    memory_type: 'guideline',
    content: 'When discussing AI risks, acknowledge potential benefits to maintain balance.',
    source: 'test',
    confidence: 0.85,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    clerk_user_id: 'test',
    memory_type: 'sample_insight',
    content: 'Frequently writes about AI governance, policy implications, and international coordination.',
    source: 'test',
    confidence: 0.8,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Test draft
const testDraft = `
AI companies are moving too fast without proper oversight. The recent developments in large language models
show that we need stronger regulations before it's too late. Self-regulation has failed - we've seen this
pattern with social media companies, and AI poses even greater risks.

The EU AI Act is a step in the right direction, but we need international coordination. Individual countries
acting alone won't be enough to address the global nature of AI development. We need binding international
agreements, similar to nuclear non-proliferation treaties.

Some argue that regulation will stifle innovation, but I believe responsible development is more important
than racing to deploy potentially harmful systems. The stakes are too high to prioritize speed over safety.
`

async function main() {
  console.log('\n' + '='.repeat(60))
  console.log('ANALYSIS WITH EDITOR CONTEXT TEST')
  console.log('='.repeat(60))

  // Step 1: Build editor context from memories
  console.log('\n🎭 Step 1: Building editor context from memories...')
  const editorContext = buildEditorContext(testMemories)

  console.log('\n--- EDITOR CONTEXT (will be injected into prompt) ---')
  console.log(editorContext)
  console.log('--- END CONTEXT ---')

  // Step 2: Run analysis
  console.log('\n📝 Step 2: Test draft to analyze:')
  console.log(testDraft.trim().substring(0, 200) + '...')

  console.log('\n🔍 Step 3: Running analysis with personalization...')
  console.log('(This may take 15-30 seconds...)\n')

  try {
    const startTime = Date.now()
    const result = await analyzeText(testDraft, {
      editorContext,
      maxCamps: 3,
    })
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)

    console.log(`✅ Analysis complete in ${elapsed}s!\n`)
    console.log('='.repeat(60))
    console.log('RESULTS')
    console.log('='.repeat(60))

    console.log('\n📋 SUMMARY:')
    console.log(result.summary)

    console.log('\n📊 EXECUTIVE SUMMARY:')
    console.log('\nStrengths:')
    result.executiveSummary.strengths.forEach((s, i) =>
      console.log(`  ${i + 1}. ${s}`)
    )
    console.log('\nAreas for Improvement:')
    result.executiveSummary.improvements.forEach((s, i) =>
      console.log(`  ${i + 1}. ${s}`)
    )

    console.log('\n🏕️ MATCHED CAMPS:')
    result.matchedCamps.forEach((camp, i) => {
      console.log(`\n  ${i + 1}. ${camp.campLabel}`)
      console.log(`     "${camp.explanation.substring(0, 100)}..."`)
      console.log(`     Top authors: ${camp.topAuthors.slice(0, 3).map(a => a.name).join(', ')}`)
    })

    console.log('\n💡 EDITORIAL SUGGESTIONS:')
    console.log('\nPerspectives Present:')
    result.editorialSuggestions.presentPerspectives.slice(0, 2).forEach((p, i) =>
      console.log(`  ${i + 1}. ${p.substring(0, 120)}...`)
    )
    console.log('\nPerspectives Missing:')
    result.editorialSuggestions.missingPerspectives.slice(0, 2).forEach((p, i) =>
      console.log(`  ${i + 1}. ${p.substring(0, 120)}...`)
    )

  } catch (error) {
    console.error('❌ Analysis failed:', error)
    process.exit(1)
  }

  console.log('\n' + '='.repeat(60))
  console.log('TEST COMPLETE - Editor memory context was injected into the prompt!')
  console.log('='.repeat(60) + '\n')
}

main().catch(console.error)
