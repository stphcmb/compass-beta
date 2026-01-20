import 'dotenv/config'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'
import { readFile, writeFile } from 'fs/promises'
import { callGemini } from '@/lib/ai-editor/gemini'

interface EnrichedSource {
  title: string
  url: string
  type: string
  published_date: string | null
  summary: string
  confidence: 'high' | 'medium' | 'low'
  reasoning: string
}

async function enrichQuoteSource(url: string, authorName: string): Promise<EnrichedSource> {
  const prompt = `Extract metadata from this source URL.
AUTHOR: ${authorName}
URL: ${url}

Return JSON: {"title":"...","type":"Article|Video|Paper|Book|Other","published_date":"YYYY-MM-DD or null","summary":"...","confidence":"high|medium|low","reasoning":"..."}`

  try {
    const response = await callGemini(prompt, 'pro')
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON')
    const enriched = JSON.parse(jsonMatch[0])
    if (!enriched.title || !enriched.type) throw new Error('Missing fields')
    return { title: enriched.title, url, type: enriched.type, published_date: enriched.published_date || null, summary: enriched.summary || '', confidence: enriched.confidence || 'low', reasoning: enriched.reasoning || 'AI' }
  } catch (error) {
    const domain = new URL(url).hostname.replace('www.', '')
    return { title: `Source from ${domain}`, url, type: 'Other', published_date: null, summary: '', confidence: 'low', reasoning: 'Fallback' }
  }
}

async function processAuthor(authorName: string, url: string, index: number, total: number) {
  console.log(`[${index+1}/${total}] ${authorName}`)
  try {
    const enriched = await enrichQuoteSource(url, authorName)
    console.log(`  ✅ ${enriched.title} (${enriched.confidence})`)
    
    const { data: author } = await supabase.from('authors').select('id, sources').eq('name', authorName).single()
    if (!author) throw new Error('Author not found')
    
    const sources = author.sources || []
    sources.push({ title: enriched.title, url: enriched.url, type: enriched.type, published_date: enriched.published_date, summary: enriched.summary })
    
    await supabase.from('authors').update({ sources }).eq('id', author.id)
    return { authorName, enriched, status: 'success' }
  } catch (error) {
    console.error(`  ❌ ${error}`)
    return { authorName, error: String(error), status: 'failed' }
  }
}

async function main() {
  console.log('=== FIX REMAINING 13 QUOTES (PARALLEL) ===\n')
  const data = JSON.parse(await readFile('source-quality-audit-remaining.json', 'utf-8'))
  const mismatches = data.quoteMismatches
  console.log(`Processing ${mismatches.length} authors in parallel...\n`)
  
  const results = await Promise.all(
    mismatches.map((m: any, i: number) => 
      processAuthor(m.authorName, m.quoteSourceUrl, i, mismatches.length)
    )
  )
  
  const successful = results.filter(r => r.status === 'success').length
  console.log(`\n✅ Completed: ${successful}/${mismatches.length}`)
  await writeFile('quote-fix-remaining-results.json', JSON.stringify(results, null, 2))
}

main().catch(console.error)
