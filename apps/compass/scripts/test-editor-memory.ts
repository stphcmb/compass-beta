/**
 * Test Editor Memory Flow
 *
 * Tests the full preference learning flow without requiring auth:
 * 1. Seeds test memories for a test user
 * 2. Builds the editor context
 * 3. Runs an analysis with the context
 * 4. Shows the personalized results
 *
 * Usage: npx tsx scripts/test-editor-memory.ts
 */

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { supabase } from '@/lib/supabase'
import {
  buildEditorContext,
  getEditorMemories,
  EditorMemory,
} from '@/lib/ai-editor/editor-memory'
import { analyzeText } from '@/lib/ai-editor/analyzer'

const TEST_USER_ID = 'test_user_editor_memory_flow'

// Test memories
const testMemories = [
  {
    memory_type: 'voice',
    content: 'Writes in a direct, assertive tone. Prefers short punchy sentences over long complex ones.',
    source: 'test',
    confidence: 0.8,
  },
  {
    memory_type: 'stance',
    content: 'Generally supportive of AI regulation and government oversight. Skeptical of industry self-regulation.',
    source: 'test',
    confidence: 0.7,
  },
  {
    memory_type: 'stance',
    content: 'Values perspectives from Yoshua Bengio and Stuart Russell. Frequently cites academic researchers over industry voices.',
    source: 'test',
    confidence: 0.75,
  },
  {
    memory_type: 'guideline',
    content: 'Always include concrete data points to support claims. Avoid vague generalizations.',
    source: 'test',
    confidence: 0.9,
  },
  {
    memory_type: 'guideline',
    content: 'When discussing AI risks, acknowledge potential benefits to maintain balance.',
    source: 'test',
    confidence: 0.85,
  },
  {
    memory_type: 'sample_insight',
    content: 'Frequently writes about AI governance, policy implications, and international coordination.',
    source: 'test',
    confidence: 0.8,
  },
]

// Test draft to analyze
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

async function seedTestMemories(): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase not configured')
  }

  // Clear existing test memories
  await supabase
    .from('editor_memory')
    .delete()
    .eq('clerk_user_id', TEST_USER_ID)

  // Insert test memories
  const records = testMemories.map((m) => ({
    clerk_user_id: TEST_USER_ID,
    memory_type: m.memory_type,
    content: m.content,
    source: m.source,
    confidence: m.confidence,
    metadata: {},
  }))

  const { error } = await supabase.from('editor_memory').insert(records)

  if (error) {
    throw new Error(`Failed to seed memories: ${error.message}`)
  }
}

async function main() {
  console.log('\n' + '='.repeat(60))
  console.log('EDITOR MEMORY FLOW TEST')
  console.log('='.repeat(60))

  // Step 1: Seed test memories
  console.log('\n📝 Step 1: Seeding test memories...')
  await seedTestMemories()
  console.log(`   Created ${testMemories.length} memories for ${TEST_USER_ID}`)

  // Step 2: Fetch and display memories
  console.log('\n📚 Step 2: Fetching editor memories...')
  const memories = await getEditorMemories(TEST_USER_ID)
  console.log(`   Found ${memories.length} memories:`)

  const byType: Record<string, EditorMemory[]> = {}
  for (const m of memories) {
    if (!byType[m.memory_type]) byType[m.memory_type] = []
    byType[m.memory_type].push(m)
  }

  for (const [type, mems] of Object.entries(byType)) {
    console.log(`   - ${type}: ${mems.length}`)
  }

  // Step 3: Build editor context
  console.log('\n🎭 Step 3: Building editor context...')
  const editorContext = buildEditorContext(memories)
  console.log('\n--- EDITOR CONTEXT (injected into prompt) ---')
  console.log(editorContext)
  console.log('--- END CONTEXT ---\n')

  // Step 4: Run analysis with context
  console.log('🔍 Step 4: Running analysis with personalization...')
  console.log('\n--- TEST DRAFT ---')
  console.log(testDraft.trim())
  console.log('--- END DRAFT ---\n')

  console.log('Analyzing... (this may take 10-20 seconds)\n')

  try {
    const result = await analyzeText(testDraft, {
      editorContext,
      includeDebugInfo: false,
    })

    console.log('✅ Analysis complete!\n')
    console.log('--- RESULTS ---\n')

    console.log('📋 SUMMARY:')
    console.log(result.summary)

    console.log('\n📊 EXECUTIVE SUMMARY:')
    console.log('Strengths:')
    result.executiveSummary.strengths.forEach((s, i) => console.log(`  ${i + 1}. ${s}`))
    console.log('Improvements:')
    result.executiveSummary.improvements.forEach((s, i) => console.log(`  ${i + 1}. ${s}`))

    console.log('\n🏕️ MATCHED CAMPS:')
    result.matchedCamps.forEach((camp, i) => {
      console.log(`\n  ${i + 1}. ${camp.campLabel}`)
      console.log(`     ${camp.explanation}`)
      console.log(`     Authors: ${camp.topAuthors.map(a => a.name).join(', ')}`)
    })

    console.log('\n💡 EDITORIAL SUGGESTIONS:')
    console.log('Present perspectives:')
    result.editorialSuggestions.presentPerspectives.forEach((p, i) =>
      console.log(`  ${i + 1}. ${p}`)
    )
    console.log('Missing perspectives:')
    result.editorialSuggestions.missingPerspectives.forEach((p, i) =>
      console.log(`  ${i + 1}. ${p}`)
    )

    console.log('\n--- END RESULTS ---')

  } catch (error) {
    console.error('❌ Analysis failed:', error)
  }

  // Cleanup
  console.log('\n🧹 Cleaning up test memories...')
  if (supabase) {
    await supabase
      .from('editor_memory')
      .delete()
      .eq('clerk_user_id', TEST_USER_ID)
  }
  console.log('   Done!')

  console.log('\n' + '='.repeat(60))
  console.log('TEST COMPLETE')
  console.log('='.repeat(60) + '\n')
}

main().catch(console.error)
