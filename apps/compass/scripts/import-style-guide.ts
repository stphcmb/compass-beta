/**
 * Import Style Guide Script
 *
 * Parses a style guide document and creates editor memory guidelines.
 * These are explicit rules that the AI editor should ALWAYS apply.
 *
 * Usage:
 *   npx tsx scripts/import-style-guide.ts --user=user_xxx --file=style-guide.md
 *   npx tsx scripts/import-style-guide.ts --user=user_xxx --text="Always use 'we' not 'I'. Never mention competitors by name."
 *
 * Input format:
 *   - Plain text with rules (one per line, or bulleted)
 *   - Markdown document
 *   - The script will use AI to extract actionable guidelines
 */

import 'dotenv/config'
import { readFile } from 'fs/promises'
import { supabase } from '@/lib/supabase'
import { callGemini } from '@/lib/ai-editor/gemini'

// Parse command line arguments
function parseArgs(): { userId: string; filePath?: string; text?: string; name?: string } {
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
    console.error('Usage: npx tsx scripts/import-style-guide.ts --user=user_xxx --file=style-guide.md')
    process.exit(1)
  }

  if (!parsed.file && !parsed.text) {
    console.error('Error: Either --file or --text argument is required')
    process.exit(1)
  }

  return {
    userId: parsed.user,
    filePath: parsed.file,
    text: parsed.text,
    name: parsed.name || 'Style Guide',
  }
}

interface ParsedGuidelines {
  guidelines: Array<{
    rule: string       // The actionable guideline
    category: string   // tone, vocabulary, structure, forbidden, required
    priority: 'high' | 'medium' | 'low'
  }>
}

/**
 * Use Gemini to parse a style guide into actionable guidelines
 */
async function parseStyleGuide(text: string): Promise<ParsedGuidelines> {
  const prompt = `You are parsing a content style guide to extract actionable editorial guidelines.

STYLE GUIDE:
${text.substring(0, 6000)} ${text.length > 6000 ? '... [truncated]' : ''}

---

Extract specific, actionable guidelines from this style guide. Focus on rules that an AI editor should ALWAYS apply when reviewing content.

Return ONLY valid JSON with this structure:
{
  "guidelines": [
    {
      "rule": "Use 'we' instead of 'I' to maintain brand voice",
      "category": "tone",
      "priority": "high"
    },
    {
      "rule": "Never mention competitor names directly - use 'other solutions' instead",
      "category": "forbidden",
      "priority": "high"
    },
    {
      "rule": "Include at least one data point or statistic in each piece",
      "category": "required",
      "priority": "medium"
    }
  ]
}

Categories:
- "tone": Rules about voice, formality, or style
- "vocabulary": Rules about word choice, terminology, or jargon
- "structure": Rules about formatting, length, or organization
- "forbidden": Things that must NOT appear in content
- "required": Things that MUST appear in content

Guidelines:
- Extract 5-15 specific guidelines
- Make each rule actionable and clear
- Prioritize rules that are most important for content quality
- If the input is just a few simple rules, extract those directly
- If no clear guidelines can be extracted, return an empty array`

  try {
    const response = await callGemini(prompt, 'flash', false)

    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const parsed: ParsedGuidelines = JSON.parse(jsonMatch[0])

    if (!parsed.guidelines || !Array.isArray(parsed.guidelines)) {
      throw new Error('Invalid response structure')
    }

    return parsed
  } catch (error) {
    console.error('Failed to parse style guide:', error)
    return { guidelines: [] }
  }
}

/**
 * Create editor memories from parsed guidelines
 */
async function createMemoriesFromGuidelines(
  userId: string,
  guidelines: ParsedGuidelines['guidelines'],
  source: string
): Promise<number> {
  if (!supabase) {
    console.error('Supabase not configured')
    return 0
  }

  const memories = guidelines.map((g) => ({
    clerk_user_id: userId,
    memory_type: 'guideline',
    content: g.rule,
    source,
    confidence: g.priority === 'high' ? 0.95 : g.priority === 'medium' ? 0.85 : 0.75,
    metadata: {
      category: g.category,
      priority: g.priority,
    },
  }))

  if (memories.length === 0) {
    console.log('No guidelines to create')
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
  const { userId, filePath, text, name } = parseArgs()

  console.log(`\n=== Import Style Guide ===`)
  console.log(`User ID: ${userId}`)
  console.log(`Guide name: ${name}`)

  // Get the style guide content
  let guideText: string

  if (filePath) {
    console.log(`Reading from file: ${filePath}`)
    try {
      guideText = await readFile(filePath, 'utf-8')
    } catch (error) {
      console.error(`Failed to read file: ${error}`)
      process.exit(1)
    }
  } else if (text) {
    guideText = text
  } else {
    console.error('No text provided')
    process.exit(1)
  }

  console.log(`Guide length: ${guideText.length} characters`)
  console.log(`\nParsing style guide...`)

  // Parse the style guide
  const parsed = await parseStyleGuide(guideText)

  console.log(`\n--- Extracted Guidelines (${parsed.guidelines.length}) ---`)

  // Group by category for display
  const byCategory: Record<string, typeof parsed.guidelines> = {}
  for (const g of parsed.guidelines) {
    if (!byCategory[g.category]) {
      byCategory[g.category] = []
    }
    byCategory[g.category].push(g)
  }

  for (const [category, guidelines] of Object.entries(byCategory)) {
    console.log(`\n${category.toUpperCase()}:`)
    guidelines.forEach((g, i) => {
      const priorityEmoji = g.priority === 'high' ? '🔴' : g.priority === 'medium' ? '🟡' : '🟢'
      console.log(`  ${priorityEmoji} ${g.rule}`)
    })
  }

  // Create memories
  console.log(`\nCreating editor memories...`)
  const source = filePath ? `style_guide:${filePath}` : `style_guide:${name}`
  const created = await createMemoriesFromGuidelines(userId, parsed.guidelines, source)

  console.log(`\n=== Complete ===`)
  console.log(`Created ${created} guideline memories for user ${userId}`)

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
