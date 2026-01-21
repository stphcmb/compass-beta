/**
 * Seed Editor Memory Script
 *
 * Quick script to add sample memories for testing the preference learning system.
 *
 * Usage: npx tsx scripts/seed-editor-memory.ts --user=user_xxx
 */

import 'dotenv/config'
import { supabase } from '@/lib/supabase'

// Parse command line arguments
function parseArgs(): { userId: string; clear?: boolean } {
  const args = process.argv.slice(2)
  const parsed: Record<string, string> = {}

  for (const arg of args) {
    if (arg === '--clear') {
      parsed.clear = 'true'
      continue
    }
    const match = arg.match(/^--(\w+)=(.+)$/)
    if (match) {
      parsed[match[1]] = match[2]
    }
  }

  if (!parsed.user) {
    console.error('Error: --user argument is required')
    console.error('Usage: npx tsx scripts/seed-editor-memory.ts --user=user_xxx')
    console.error('       npx tsx scripts/seed-editor-memory.ts --user=user_xxx --clear')
    process.exit(1)
  }

  return {
    userId: parsed.user,
    clear: parsed.clear === 'true',
  }
}

// Sample memories for testing
const sampleMemories = [
  // Voice memories
  {
    memory_type: 'voice',
    content: 'Writes in a direct, assertive tone with short punchy sentences. Leads with conclusions rather than building up to them.',
    source: 'sample_analysis',
    confidence: 0.8,
  },
  {
    memory_type: 'voice',
    content: 'Uses professional but accessible language. Avoids jargon unless explaining technical concepts to technical audiences.',
    source: 'sample_analysis',
    confidence: 0.75,
  },
  {
    memory_type: 'voice',
    content: 'Prefers active voice and concrete examples over abstract generalizations.',
    source: 'sample_analysis',
    confidence: 0.7,
  },

  // Stance memories
  {
    memory_type: 'stance',
    content: 'Generally skeptical of AI self-regulation. Prefers government oversight and international coordination on AI policy.',
    source: 'sample_analysis',
    confidence: 0.65,
  },
  {
    memory_type: 'stance',
    content: 'Tends to emphasize worker impacts and societal implications of AI over productivity gains and efficiency arguments.',
    source: 'sample_analysis',
    confidence: 0.6,
  },
  {
    memory_type: 'stance',
    content: 'Values academic and research perspectives. Frequently cites Yoshua Bengio and Stuart Russell.',
    source: 'feedback_pattern',
    confidence: 0.7,
  },

  // Guidelines
  {
    memory_type: 'guideline',
    content: 'Always include at least one concrete data point or statistic to support key claims.',
    source: 'style_guide',
    confidence: 0.9,
  },
  {
    memory_type: 'guideline',
    content: 'When discussing AI risks, balance with acknowledgment of potential benefits to avoid appearing one-sided.',
    source: 'style_guide',
    confidence: 0.85,
  },
  {
    memory_type: 'guideline',
    content: 'Cite primary sources when possible. Avoid relying on news summaries of research papers.',
    source: 'style_guide',
    confidence: 0.9,
  },

  // Sample insights
  {
    memory_type: 'sample_insight',
    content: 'Frequently writes about AI governance, policy implications, and international coordination.',
    source: 'sample_analysis',
    confidence: 0.8,
  },
  {
    memory_type: 'sample_insight',
    content: 'Content typically targets policy makers, executives, and educated general public rather than technical researchers.',
    source: 'sample_analysis',
    confidence: 0.75,
  },
]

async function main() {
  const { userId, clear } = parseArgs()

  if (!supabase) {
    console.error('Supabase not configured')
    process.exit(1)
  }

  console.log(`\n=== Seed Editor Memory ===`)
  console.log(`User ID: ${userId}`)

  // Clear existing memories if requested
  if (clear) {
    console.log(`\nClearing existing memories...`)
    const { error } = await supabase
      .from('editor_memory')
      .delete()
      .eq('clerk_user_id', userId)

    if (error) {
      console.error('Failed to clear memories:', error)
    } else {
      console.log('Cleared!')
    }
  }

  // Insert sample memories
  console.log(`\nInserting ${sampleMemories.length} sample memories...`)

  const records = sampleMemories.map((m) => ({
    clerk_user_id: userId,
    memory_type: m.memory_type,
    content: m.content,
    source: m.source,
    confidence: m.confidence,
    metadata: {},
  }))

  const { data, error } = await supabase
    .from('editor_memory')
    .insert(records)
    .select()

  if (error) {
    console.error('Failed to insert memories:', error)
    process.exit(1)
  }

  console.log(`Created ${data?.length || 0} memories`)

  // Show summary
  const { data: all } = await supabase
    .from('editor_memory')
    .select('memory_type')
    .eq('clerk_user_id', userId)

  if (all) {
    const counts: Record<string, number> = {}
    for (const m of all) {
      counts[m.memory_type] = (counts[m.memory_type] || 0) + 1
    }

    console.log(`\n--- Memory Summary ---`)
    for (const [type, count] of Object.entries(counts)) {
      console.log(`  ${type}: ${count}`)
    }
    console.log(`  TOTAL: ${all.length}`)
  }

  console.log(`\n=== Complete ===`)
}

main().catch(console.error)
