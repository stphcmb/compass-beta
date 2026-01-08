/**
 * Semantic Query Expansion Provider
 *
 * Local semantic expansion that maps common phrases/concepts to meaningful semantic phrases.
 * This is a fallback when n8n expansion is unavailable.
 *
 * Returns contextual phrases that help users understand what the search is looking for,
 * rather than single keywords.
 */

/**
 * Semantic query expansion - maps common phrases/concepts to meaningful semantic phrases
 * This helps users find results and understand the search context
 *
 * @param query - The search query to expand
 * @returns Array of semantically related phrases (not single words)
 */
export function expandQuerySemantics(query: string): string[] {
  const expansions: string[] = []
  const q = query.toLowerCase()

  // AI skepticism / criticism patterns
  if (q.includes('bubble') || q.includes('hype') || q.includes('overhyped') || q.includes('overrated')) {
    expansions.push(
      'AI skepticism and critical analysis',
      'technology hype cycle concerns',
      'realistic AI assessment'
    )
  }
  if (q.includes('not a bubble') || q.includes('not hype')) {
    expansions.push(
      'AI optimism and potential',
      'technology progress trajectory',
      'transformative AI capabilities'
    )
  }

  // AI optimism patterns
  if (q.includes('optimis') || q.includes('bull') || q.includes('promising') || q.includes('potential')) {
    expansions.push(
      'AI progress and advancement',
      'technological optimism',
      'scaling hypothesis supporters'
    )
  }

  // Safety and risk patterns
  if (q.includes('danger') || q.includes('risk') || q.includes('threat') || q.includes('doom') || q.includes('existential')) {
    expansions.push(
      'AI safety and alignment research',
      'existential risk concerns',
      'responsible AI development'
    )
  }

  // Scaling debate
  if (q.includes('scale') || q.includes('bigger') || q.includes('larger') || q.includes('more data') || q.includes('more compute')) {
    expansions.push(
      'scaling laws and AI progress',
      'compute and data requirements',
      'emergent capabilities debate'
    )
  }

  // Jobs and work
  if (q.includes('job') || q.includes('work') || q.includes('employ') || q.includes('replace') || q.includes('automat')) {
    expansions.push(
      'AI impact on employment',
      'workforce automation effects',
      'human-AI collaboration'
    )
  }

  // Regulation patterns
  if (q.includes('regulat') || q.includes('govern') || q.includes('law') || q.includes('policy') || q.includes('control')) {
    expansions.push(
      'AI governance and policy',
      'technology regulation approaches',
      'innovation vs safety balance'
    )
  }

  // Open source patterns - use word boundaries to avoid matching "opens", "opened", etc.
  if (/\bopen\s+(source|ai|model|weight)/i.test(q) || q.includes('democratiz') || /\baccess\b/i.test(q)) {
    expansions.push(
      'open source AI development',
      'AI democratization efforts',
      'accessible AI technology'
    )
  }

  // Enterprise/business patterns
  if (q.includes('enterprise') || q.includes('business') || q.includes('company') || q.includes('adopt') || q.includes('economic') || q.includes('primitives')) {
    expansions.push(
      'AI economic impact on business',
      'enterprise AI adoption',
      'business transformation through AI'
    )
  }

  // Ethics patterns
  if (q.includes('ethic') || q.includes('bias') || q.includes('fair') || q.includes('discriminat')) {
    expansions.push(
      'AI ethics and fairness',
      'algorithmic bias concerns',
      'responsible AI principles'
    )
  }

  // AGI patterns
  if (q.includes('agi') || q.includes('general intelligence') || q.includes('superintelligen')) {
    expansions.push(
      'artificial general intelligence',
      'AGI timelines and paths',
      'superintelligence scenarios'
    )
  }

  // Vibe coding / AI-assisted development patterns
  if (q.includes('vibe') || q.includes('coding') || q.includes('copilot') || q.includes('cursor') ||
      q.includes('code assistant') || q.includes('ai code') || q.includes('developer') ||
      q.includes('programming') || q.includes('ide') || q.includes('replit') || q.includes('codeium')) {
    expansions.push(
      'human collaboration with AI tools',
      'co-evolution of human and AI capabilities',
      'tech builders democratizing creation'
    )
  }

  // Multi-agent / Agentic AI patterns
  if (q.includes('agent') || q.includes('agentic') || q.includes('multi-agent') || q.includes('autonomous') ||
      q.includes('crewai') || q.includes('autogen') || q.includes('langchain') || q.includes('babyagi') ||
      q.includes('llamaindex') || q.includes('rag') || q.includes('orchestrat')) {
    expansions.push(
      'AI agents and autonomy',
      'agentic AI frameworks',
      'autonomous system design'
    )
  }

  // AI infrastructure patterns
  if (q.includes('infrastructure') || q.includes('compute') || q.includes('gpu') || q.includes('cloud') ||
      q.includes('deploy') || q.includes('serve') || q.includes('modal') || q.includes('replicate') ||
      q.includes('hugging') || q.includes('together') || q.includes('serverless')) {
    expansions.push(
      'AI infrastructure and compute',
      'model deployment platforms',
      'AI cloud services'
    )
  }

  // Workforce displacement patterns (enhanced)
  if (q.includes('workforce') || q.includes('replace') || q.includes('displace') || q.includes('unemploy') ||
      q.includes('layoff') || q.includes('automation') || q.includes('future of work') ||
      q.includes('will ai') || q.includes('ai will')) {
    expansions.push(
      'AI workforce displacement',
      'automation impact on jobs',
      'future of work with AI'
    )
  }

  // AI skepticism / Snake oil patterns
  if (q.includes('snake oil') || q.includes('scam') || q.includes('fake') || q.includes('misleading') ||
      q.includes('exaggerat') || q.includes('doesn\'t work') || q.includes('limitation')) {
    expansions.push(
      'AI limitations and criticism',
      'overpromised AI capabilities',
      'technology skepticism'
    )
  }

  // Podcast / media patterns (for finding public intellectuals)
  if (q.includes('podcast') || q.includes('interview') || q.includes('youtube') || q.includes('media') ||
      q.includes('dwarkesh') || q.includes('lex fridman') || q.includes('cognitive revolution')) {
    expansions.push(
      'AI thought leaders in media',
      'technology podcast discussions',
      'public AI discourse'
    )
  }

  // Translate hype / economic primitives (specific query pattern)
  if (q.includes('translate') || q.includes('primitive') || (q.includes('hype') && q.includes('economic'))) {
    expansions.push(
      'AI economic impact on business',
      'practical AI value assessment',
      'grounded AI adoption strategy'
    )
  }

  // LLM/model-specific queries
  if (q.includes('llm') || q.includes('large language') || q.includes('gpt') ||
      q.includes('claude') || q.includes('chatgpt') || q.includes('gemini') ||
      q.includes('language model')) {
    expansions.push(
      'large language model capabilities',
      'LLM limitations and challenges',
      'AI model performance and evaluation'
    )
  }

  // Overpromise/underdeliver patterns (commonly missed)
  if (q.includes('overpromis') || q.includes('oversold') || q.includes('underdeliver') ||
      q.includes('not living up') || q.includes('failing to')) {
    expansions.push(
      'AI skepticism and critical analysis',
      'technology hype vs reality',
      'realistic AI assessment'
    )
  }

  // Research/academic queries
  if (q.includes('research') || q.includes('paper') || q.includes('study') ||
      q.includes('academic') || q.includes('empirical')) {
    expansions.push(
      'AI research and development',
      'academic AI perspectives',
      'empirical AI findings'
    )
  }

  // Reasoning and capabilities
  if (q.includes('reasoning') || q.includes('think') || q.includes('understand') ||
      q.includes('cognitive') || q.includes('intelligence')) {
    expansions.push(
      'AI reasoning capabilities',
      'machine understanding limitations',
      'artificial intelligence definition'
    )
  }

  // Investment and economics
  if (q.includes('investment') || q.includes('investor') || q.includes('funding') ||
      q.includes('valuation') || q.includes('market')) {
    expansions.push(
      'AI investment trends',
      'technology market dynamics',
      'AI economic impact'
    )
  }

  // Data and training
  if (q.includes('data') || q.includes('training') || q.includes('dataset') ||
      q.includes('corpus') || q.includes('synthetic')) {
    expansions.push(
      'AI training data requirements',
      'data quality and AI performance',
      'synthetic data generation'
    )
  }

  return expansions
}

/**
 * Extract meaningful phrases from a query for phrase matching
 * This helps match multi-word queries like "AI is a bubble" or "AI will replace workers"
 *
 * @param query - The search query
 * @returns Array of phrases extracted from the query
 */
export function extractPhrases(query: string): string[] {
  const phrases: string[] = []

  // Return the full query as a phrase if it's longer than 3 words
  const words = query.trim().split(/\s+/)
  if (words.length >= 3) {
    phrases.push(query)
  }

  // Extract common meaningful phrases (3-6 words)
  for (let i = 0; i < words.length - 2; i++) {
    const phrase3 = words.slice(i, i + 3).join(' ')
    const phrase4 = words.slice(i, i + 4).join(' ')
    const phrase5 = words.slice(i, i + 5).join(' ')

    if (phrase3.length > 8) phrases.push(phrase3)
    if (i < words.length - 3 && phrase4.length > 10) phrases.push(phrase4)
    if (i < words.length - 4 && phrase5.length > 12) phrases.push(phrase5)
  }

  return phrases
}
