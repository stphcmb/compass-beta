/**
 * Test script for Mini Brain API endpoint
 *
 * Usage:
 *   node scripts/test-mini-brain.mjs
 *
 * Prerequisites:
 *   - Development server running (npm run dev)
 *   - GEMINI_API_KEY set in .env.local
 *   - Supabase configured
 */

const API_URL = 'http://localhost:3000/api/brain/analyze'

// Sample texts for testing
const testTexts = {
  short: 'AI is transforming industries.',

  medium: `Artificial intelligence is rapidly transforming how businesses operate.
Companies are racing to adopt AI technologies to gain competitive advantages,
improve efficiency, and unlock new revenue streams. However, many organizations
struggle with implementation challenges and lack clear ROI metrics.`,

  long: `The debate around artificial general intelligence (AGI) has intensified as
large language models demonstrate increasingly sophisticated capabilities. Some
researchers believe we're on the cusp of a breakthrough that will lead to human-level
AI within the next decade. They argue that scaling up current architectures with
more compute and data will be sufficient to achieve AGI.

However, skeptics point out fundamental limitations in current approaches. They
argue that today's AI systems, despite their impressive performance on many tasks,
lack true understanding and reasoning capabilities. These critics suggest that
entirely new approaches may be needed to achieve genuine intelligence.

The implications for society are profound regardless of which camp is correct.
If AGI is imminent, we need robust governance frameworks and safety measures in
place. If it's still far off, we should focus on maximizing the benefits of
narrow AI while managing its risks and limitations.`,
}

async function testMiniBrain(text, testName) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`Test: ${testName}`)
  console.log(`${'='.repeat(60)}`)
  console.log(`\nInput text (${text.length} chars):\n${text.substring(0, 200)}${text.length > 200 ? '...' : ''}\n`)

  try {
    const startTime = Date.now()

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    })

    const elapsed = Date.now() - startTime

    if (!response.ok) {
      const error = await response.json()
      console.error(`❌ Error (${response.status}):`, error)
      return false
    }

    const result = await response.json()

    console.log(`✅ Success (${elapsed}ms)\n`)
    console.log('Summary:')
    console.log(`  ${result.summary}\n`)

    console.log(`Matched Camps (${result.matchedCamps.length}):`)
    result.matchedCamps.forEach((camp, i) => {
      console.log(`  ${i + 1}. ${camp.campLabel}`)
      console.log(`     Authors: ${camp.topAuthors.map(a => a.name).join(', ')}`)
    })

    console.log('\nEditorial Suggestions:')
    console.log('  Present Perspectives:')
    result.editorialSuggestions.presentPerspectives.forEach((p) => {
      console.log(`    • ${p}`)
    })

    console.log('  Missing Perspectives:')
    result.editorialSuggestions.missingPerspectives.forEach((p) => {
      console.log(`    • ${p}`)
    })

    return true
  } catch (error) {
    console.error('❌ Network error:', error.message)
    return false
  }
}

async function runTests() {
  console.log('Mini Brain API Test Suite')
  console.log('=========================\n')

  console.log('Testing API endpoint:', API_URL)
  console.log('Make sure:')
  console.log('  1. Development server is running (npm run dev)')
  console.log('  2. GEMINI_API_KEY is set in .env.local')
  console.log('  3. Supabase is configured\n')

  // Test 1: Short text
  await testMiniBrain(testTexts.short, 'Short Text')

  // Wait a bit between tests
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Test 2: Medium text
  await testMiniBrain(testTexts.medium, 'Medium Text (Typical Use Case)')

  // Wait a bit between tests
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Test 3: Long text
  await testMiniBrain(testTexts.long, 'Long Text (Multiple Paragraphs)')

  // Test 4: Error case - empty text
  console.log(`\n${'='.repeat(60)}`)
  console.log('Test: Error Handling - Empty Text')
  console.log(`${'='.repeat(60)}\n`)

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: '' }),
    })

    const result = await response.json()

    if (response.status === 400) {
      console.log('✅ Correctly rejected empty text')
      console.log(`   Error: ${result.error}\n`)
    } else {
      console.log('❌ Should have rejected empty text')
    }
  } catch (error) {
    console.error('❌ Network error:', error.message)
  }

  console.log('\n' + '='.repeat(60))
  console.log('Tests completed!')
  console.log('='.repeat(60))
}

// Run the tests
runTests().catch(console.error)
