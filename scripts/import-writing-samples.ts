/**
 * Import Writing Samples Script
 *
 * Analyzes writing samples to extract style signals and create editor memories.
 * This is a one-off script to seed a user's editor memory with their existing work.
 *
 * Usage:
 *   npx tsx scripts/import-writing-samples.ts --user=user_xxx --file=samples.txt
 *   npx tsx scripts/import-writing-samples.ts --user=user_xxx --text="Your writing sample here..."
 *
 * The script will:
 * 1. Read the writing sample(s)
 * 2. Use Gemini to analyze style, tone, and patterns
 * 3. Create editor memories for the user
 */

import 'dotenv/config'
import { readFile } from 'fs/promises'
import { supabase } from '@/lib/supabase'
import { callGemini } from '@/lib/ai-editor/gemini'

// Parse command line arguments
function parseArgs(): { userId: string; filePath?: string; text?: string } {
  const args = process.argv.slice(2)
  const parsed: Record<string, string> = {}

  for (const arg of args) {
    const match = arg.match(/^--(\w+)=(.+)$/)
    if (match) {
      parsed[match[1]] = match[2]
    }
  }

  if (!parsed.user) {
    console.error('Error: --user argument is required')
    console.error('Usage: npx tsx scripts/import-writing-samples.ts --user=user_xxx --file=samples.txt')
    process.exit(1)
  }

  if (!parsed.file && !parsed.text) {
    console.error('Error: Either --file or --text argument is required')
    console.error('Usage: npx tsx scripts/import-writing-samples.ts --user=user_xxx --file=samples.txt')
    process.exit(1)
  }

  return {
    userId: parsed.user,
    filePath: parsed.file,
    text: parsed.text,
  }
}

interface ExtractedInsights {
  voice: string[]      // Writing style observations
  stances: string[]    // Opinions and perspectives detected
  patterns: string[]   // Recurring themes, topics, or habits
}

/**
 * Use Gemini to analyze writing samples and extract style insights
 */
async function analyzeWritingSample(text: string): Promise<ExtractedInsights> {
  const prompt = `You are a senior editor analyzing a writer's work to understand their style and preferences.

WRITING SAMPLE:
${text.substring(0, 8000)} ${text.length > 8000 ? '... [truncated]' : ''}

---

Analyze this writing and extract insights about the writer. Be specific and actionable.

Return ONLY valid JSON with this structure:
{
  "voice": [
    "Observation about their writing voice/style (e.g., 'Writes in a direct, assertive tone with short punchy sentences')",
    "Observation about formality level (e.g., 'Uses professional but accessible language, avoids jargon')",
    "Observation about structure (e.g., 'Prefers to lead with a provocative claim, then support with evidence')"
  ],
  "stances": [
    "Perspective they seem to hold (e.g., 'Generally skeptical of AI self-regulation, prefers government oversight')",
    "Opinion pattern detected (e.g., 'Tends to cite academic sources over industry voices')",
    "Viewpoint they favor (e.g., 'Emphasizes worker impacts of AI over productivity gains')"
  ],
  "patterns": [
    "Recurring theme (e.g., 'Frequently discusses AI governance and policy implications')",
    "Topic they gravitate toward (e.g., 'Returns often to questions of AI safety and alignment')",
    "Content preference (e.g., 'Prefers data-backed arguments with specific citations')"
  ]
}

Guidelines:
- Be specific, not generic. "Uses active voice" is too vague. "Writes punchy, declarative sentences that lead with the conclusion" is better.
- Include 2-4 items in each category
- Focus on patterns that would help personalize AI feedback
- If the sample is too short to detect patterns, note that uncertainty`

  try {
    const response = await callGemini(prompt, 'pro', false)

    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const insights: ExtractedInsights = JSON.parse(jsonMatch[0])

    // Validate structure
    if (!insights.voice || !insights.stances || !insights.patterns) {
      throw new Error('Invalid response structure')
    }

    return insights
  } catch (error) {
    console.error('Failed to analyze writing sample:', error)
    // Return empty insights on failure
    return { voice: [], stances: [], patterns: [] }
  }
}

/**
 * Create editor memories from extracted insights
 */
async function createMemoriesFromInsights(
  userId: string,
  insights: ExtractedInsights,
  source: string
): Promise<number> {
  if (!supabase) {
    console.error('Supabase not configured')
    return 0
  }

  const memories: Array<{
    clerk_user_id: string
    memory_type: string
    content: string
    source: string
    confidence: number
  }> = []

  // Add voice memories
  for (const observation of insights.voice) {
    if (observation && observation.trim()) {
      memories.push({
        clerk_user_id: userId,
        memory_type: 'voice',
        content: observation.trim(),
        source,
        confidence: 0.7,
      })
    }
  }

  // Add stance memories
  for (const stance of insights.stances) {
    if (stance && stance.trim()) {
      memories.push({
        clerk_user_id: userId,
        memory_type: 'stance',
        content: stance.trim(),
        source,
        confidence: 0.6,
      })
    }
  }

  // Add pattern memories as sample_insights
  for (const pattern of insights.patterns) {
    if (pattern && pattern.trim()) {
      memories.push({
        clerk_user_id: userId,
        memory_type: 'sample_insight',
        content: pattern.trim(),
        source,
        confidence: 0.65,
      })
    }
  }

  if (memories.length === 0) {
    console.log('No memories to create')
    return 0
  }

  // Insert all memories
  const { data, error } = await supabase
    .from('editor_memory')
    .insert(memories)
    .select()

  if (error) {
    console.error('Failed to insert memories:', error)
    return 0
  }

  return data?.length || 0
}

/**
 * Main function
 */
async function main() {
  const { userId, filePath, text } = parseArgs()

  console.log(`\n=== Import Writing Samples ===`)
  console.log(`User ID: ${userId}`)

  // Get the writing sample
  let sampleText: string

  if (filePath) {
    console.log(`Reading from file: ${filePath}`)
    try {
      sampleText = await readFile(filePath, 'utf-8')
    } catch (error) {
      console.error(`Failed to read file: ${error}`)
      process.exit(1)
    }
  } else if (text) {
    sampleText = text
  } else {
    console.error('No text provided')
    process.exit(1)
  }

  console.log(`Sample length: ${sampleText.length} characters`)
  console.log(`\nAnalyzing writing sample...`)

  // Analyze the sample
  const insights = await analyzeWritingSample(sampleText)

  console.log(`\n--- Extracted Insights ---`)
  console.log(`\nVoice (${insights.voice.length}):`)
  insights.voice.forEach((v, i) => console.log(`  ${i + 1}. ${v}`))

  console.log(`\nStances (${insights.stances.length}):`)
  insights.stances.forEach((s, i) => console.log(`  ${i + 1}. ${s}`))

  console.log(`\nPatterns (${insights.patterns.length}):`)
  insights.patterns.forEach((p, i) => console.log(`  ${i + 1}. ${p}`))

  // Create memories
  console.log(`\nCreating editor memories...`)
  const source = filePath ? `sample_analysis:${filePath}` : 'sample_analysis:inline'
  const created = await createMemoriesFromInsights(userId, insights, source)

  console.log(`\n=== Complete ===`)
  console.log(`Created ${created} editor memories for user ${userId}`)

  // Show current memory count
  if (supabase) {
    const { count } = await supabase
      .from('editor_memory')
      .select('*', { count: 'exact', head: true })
      .eq('clerk_user_id', userId)

    console.log(`Total memories for user: ${count || 0}`)
  }
}

main().catch(console.error)
