/**
 * Source Quality Validation
 *
 * Validates sources to ensure they are specific, citable content
 * rather than generic references (homepages, channels, profiles).
 *
 * Use in all author addition/update scripts to enforce quality.
 */

export interface SourceInput {
  title: string
  url: string
  type?: string
  published_date?: string | null
  year?: string | number
  summary?: string
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  quality: 'specific' | 'generic' | 'ambiguous'
  qualityReason: string
}

/**
 * Validates a source for quality and specificity
 */
export function validateSource(source: SourceInput): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // ===== URL Quality Check =====
  const urlQuality = classifySourceUrl(source.url)

  if (urlQuality.quality === 'generic') {
    errors.push(`Generic URL not allowed: ${urlQuality.reason}`)
    errors.push(`  URL: ${source.url}`)
    errors.push(`  Must be a specific article, video, episode, or paper`)
  } else if (urlQuality.quality === 'ambiguous') {
    warnings.push(`URL may be generic: ${urlQuality.reason}`)
  }

  // ===== Title Quality Check =====
  const titleQuality = classifySourceTitle(source.title)

  if (titleQuality.quality === 'generic') {
    errors.push(`Generic title not allowed: ${titleQuality.reason}`)
    errors.push(`  Title: "${source.title}"`)
    errors.push(`  Must reference specific content, not a channel/homepage/profile`)
  } else if (titleQuality.quality === 'ambiguous') {
    warnings.push(`Title may be too generic: ${titleQuality.reason}`)
  }

  // ===== Date Validation =====
  if (!source.published_date && !source.year) {
    warnings.push('No date provided - published_date (YYYY-MM-DD) or year recommended')
  } else if (source.published_date) {
    // Validate format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(source.published_date)) {
      errors.push(`published_date must be YYYY-MM-DD format, got: ${source.published_date}`)
    } else {
      // Validate it's a real date
      const date = new Date(source.published_date)
      if (isNaN(date.getTime())) {
        errors.push(`published_date is not a valid date: ${source.published_date}`)
      }
    }
  }

  // ===== Type Validation =====
  const genericTypes = ['Other', 'Website', 'Organization', 'Channel', 'Profile', 'Homepage']
  if (source.type && genericTypes.includes(source.type)) {
    warnings.push(`Type "${source.type}" is vague - prefer: Video, Article, Podcast, Paper, Book, Interview, Talk`)
  }

  // ===== Summary Validation =====
  if (!source.summary || source.summary.length < 20) {
    warnings.push('Summary should describe content (20+ characters recommended)')
  }

  // ===== Determine Overall Quality =====
  const overallQuality =
    urlQuality.quality === 'generic' || titleQuality.quality === 'generic' ? 'generic' :
    urlQuality.quality === 'ambiguous' || titleQuality.quality === 'ambiguous' ? 'ambiguous' :
    'specific'

  const qualityReason =
    overallQuality === 'generic' ? `${urlQuality.reason}; ${titleQuality.reason}` :
    overallQuality === 'ambiguous' ? urlQuality.quality === 'ambiguous' ? urlQuality.reason : titleQuality.reason :
    'Source appears to be specific, citable content'

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    quality: overallQuality,
    qualityReason
  }
}

/**
 * Classifies source quality based on URL patterns
 */
function classifySourceUrl(url: string): { quality: 'specific' | 'generic' | 'ambiguous'; reason: string } {
  if (!url) {
    return { quality: 'generic', reason: 'No URL provided' }
  }

  const urlLower = url.toLowerCase()

  // ===== Generic Patterns (BAD) =====

  // YouTube channels
  if (urlLower.includes('youtube.com/@') || urlLower.includes('youtube.com/channel/') || urlLower.includes('youtube.com/user/')) {
    return { quality: 'generic', reason: 'YouTube channel URL (need specific video: youtube.com/watch?v=...)' }
  }

  // Homepage only (no path)
  if (urlLower.match(/^https?:\/\/[^\/]+\/?$/)) {
    return { quality: 'generic', reason: 'Homepage URL with no specific path' }
  }

  // Generic pages
  if (urlLower.match(/\/about\/?$/i)) {
    return { quality: 'generic', reason: 'About page (need specific content)' }
  }

  if (urlLower.match(/\/blog\/?$/i) && !urlLower.includes('/blog/')) {
    return { quality: 'generic', reason: 'Blog homepage (need specific post: /blog/post-title/)' }
  }

  if (urlLower.match(/\/podcast\/?$/i) && !urlLower.includes('/podcast/')) {
    return { quality: 'generic', reason: 'Podcast homepage (need specific episode)' }
  }

  // Social profiles (no specific post)
  if (urlLower.match(/twitter\.com\/[^\/]+\/?$/) || urlLower.match(/x\.com\/[^\/]+\/?$/)) {
    return { quality: 'generic', reason: 'Social media profile (need specific post: /status/...)' }
  }

  if (urlLower.match(/linkedin\.com\/in\/[^\/]+\/?$/)) {
    return { quality: 'generic', reason: 'LinkedIn profile (need specific post: /posts/...)' }
  }

  if (urlLower.match(/github\.com\/[^\/]+\/?$/)) {
    return { quality: 'generic', reason: 'GitHub profile (need specific repo or discussion)' }
  }

  // ===== Specific Patterns (GOOD) =====

  // YouTube videos
  if (urlLower.includes('youtube.com/watch?v=') || urlLower.includes('youtu.be/')) {
    return { quality: 'specific', reason: 'Specific YouTube video' }
  }

  // Articles
  if (urlLower.includes('/article/') || urlLower.includes('/articles/')) {
    return { quality: 'specific', reason: 'Article URL path' }
  }

  // Blog posts (with path)
  if (urlLower.match(/\/blog\/[^\/]+/)) {
    return { quality: 'specific', reason: 'Specific blog post' }
  }

  // Podcast episodes
  if (urlLower.includes('/episode') || urlLower.match(/\/podcast\/[^\/]+/)) {
    return { quality: 'specific', reason: 'Specific podcast episode' }
  }

  // Papers
  if (urlLower.includes('arxiv.org/abs/') || urlLower.includes('arxiv.org/pdf/')) {
    return { quality: 'specific', reason: 'Specific ArXiv paper' }
  }

  if (urlLower.includes('doi.org/') || urlLower.includes('/doi/')) {
    return { quality: 'specific', reason: 'DOI link to specific publication' }
  }

  if (urlLower.endsWith('.pdf')) {
    return { quality: 'specific', reason: 'PDF document' }
  }

  // Posts with date in URL
  if (urlLower.match(/\/\d{4}\/\d{2}\//)) {
    return { quality: 'specific', reason: 'Date in URL path (likely specific post)' }
  }

  // Specific social posts
  if (urlLower.includes('/status/') || urlLower.includes('/posts/')) {
    return { quality: 'specific', reason: 'Specific social media post' }
  }

  // News articles (with specific path)
  if (urlLower.match(/\/(news|press|press-release|releases)\//)) {
    return { quality: 'specific', reason: 'News/press article' }
  }

  // ===== Ambiguous =====
  // Has some path but unclear if specific
  if (urlLower.match(/\/[^\/]+\/[^\/]+/)) {
    return { quality: 'ambiguous', reason: 'URL has path but specificity unclear - verify manually' }
  }

  return { quality: 'ambiguous', reason: 'Cannot determine URL specificity - verify manually' }
}

/**
 * Classifies source quality based on title patterns
 */
function classifySourceTitle(title: string): { quality: 'specific' | 'generic' | 'ambiguous'; reason: string } {
  if (!title || title.length < 3) {
    return { quality: 'generic', reason: 'Title too short or missing' }
  }

  const titleLower = title.toLowerCase()

  // ===== Generic Title Indicators (BAD) =====

  // Channel/Profile indicators
  if (titleLower.includes('channel') && !titleLower.includes('podcast')) {
    return { quality: 'generic', reason: 'Title indicates channel, not specific content' }
  }

  if (titleLower.includes('homepage') || titleLower === 'home') {
    return { quality: 'generic', reason: 'Title indicates homepage' }
  }

  if (titleLower.includes('website')) {
    return { quality: 'generic', reason: 'Title indicates website, not specific content' }
  }

  if (titleLower.includes('profile') && !titleLower.includes('company profile')) {
    return { quality: 'generic', reason: 'Title indicates profile page' }
  }

  // Generic publication venues without specific content
  if (titleLower.match(/^the .+ blog$/i) || titleLower.match(/^.+ blog$/i)) {
    if (!titleLower.includes('post') && !titleLower.includes(':')) {
      return { quality: 'generic', reason: 'Title indicates blog in general, not specific post' }
    }
  }

  if (titleLower === 'blog' || titleLower === 'articles' || titleLower === 'publications') {
    return { quality: 'generic', reason: 'Generic publication category, not specific content' }
  }

  // ===== Specific Title Indicators (GOOD) =====

  // Episode numbers
  if (titleLower.match(/#\d+/) || titleLower.match(/episode \d+/i)) {
    return { quality: 'specific', reason: 'Title includes episode/issue number' }
  }

  // Interview format
  if (titleLower.match(/interview|conversation|podcast.*with|talk.*with/i)) {
    return { quality: 'specific', reason: 'Title indicates specific interview/conversation' }
  }

  // Specific topics (has colon or question mark)
  if (titleLower.includes(':') || titleLower.includes('?')) {
    return { quality: 'specific', reason: 'Title describes specific topic/question' }
  }

  // Paper-like titles (long, descriptive)
  if (title.length > 50 && !titleLower.includes('blog') && !titleLower.includes('channel')) {
    return { quality: 'specific', reason: 'Long descriptive title suggests specific content' }
  }

  // ===== Ambiguous =====
  // Short titles without clear indicators
  if (title.length < 15) {
    return { quality: 'ambiguous', reason: 'Title is short - verify it describes specific content' }
  }

  // Author name only (might be profile or might be collection)
  const namePattern = /^[A-Z][a-z]+ [A-Z][a-z]+$/
  if (namePattern.test(title.trim())) {
    return { quality: 'ambiguous', reason: 'Title appears to be just a name - likely a profile' }
  }

  return { quality: 'specific', reason: 'Title appears to describe specific content' }
}

/**
 * Validates an array of sources
 */
export function validateSources(sources: SourceInput[]): {
  allValid: boolean
  results: Array<{ source: SourceInput; validation: ValidationResult }>
  summary: {
    total: number
    valid: number
    invalid: number
    specific: number
    generic: number
    ambiguous: number
  }
} {
  const results = sources.map(source => ({
    source,
    validation: validateSource(source)
  }))

  const summary = {
    total: results.length,
    valid: results.filter(r => r.validation.valid).length,
    invalid: results.filter(r => !r.validation.valid).length,
    specific: results.filter(r => r.validation.quality === 'specific').length,
    generic: results.filter(r => r.validation.quality === 'generic').length,
    ambiguous: results.filter(r => r.validation.quality === 'ambiguous').length
  }

  return {
    allValid: results.every(r => r.validation.valid),
    results,
    summary
  }
}
