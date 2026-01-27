import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

interface CheckResult {
  campAuthorId: string
  authorName: string
  campName: string
  url: string
  status: 'valid' | 'broken' | 'timeout' | 'error' | 'skipped'
  httpStatus?: number
  responseTimeMs?: number
  error?: string
}

async function checkUrl(url: string, timeoutMs = 8000): Promise<{
  isAccessible: boolean
  status: 'valid' | 'broken' | 'timeout' | 'error'
  httpStatus?: number
  responseTimeMs: number
  error?: string
}> {
  const startTime = Date.now()

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CompassBot/1.0; +https://compass.app)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    })

    clearTimeout(timeoutId)
    const responseTimeMs = Date.now() - startTime

    // Try GET if HEAD not supported
    if (response.status === 405) {
      const getResponse = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(timeoutMs),
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; CompassBot/1.0; +https://compass.app)',
        },
        redirect: 'follow',
      })

      return {
        isAccessible: getResponse.ok,
        status: getResponse.ok ? 'valid' : 'broken',
        httpStatus: getResponse.status,
        responseTimeMs: Date.now() - startTime,
      }
    }

    return {
      isAccessible: response.ok,
      status: response.ok ? 'valid' : 'broken',
      httpStatus: response.status,
      responseTimeMs,
    }
  } catch (error) {
    const responseTimeMs = Date.now() - startTime

    if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('timeout'))) {
      return { isAccessible: false, status: 'timeout', responseTimeMs, error: 'Request timed out' }
    }

    return {
      isAccessible: false,
      status: 'error',
      responseTimeMs,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// POST /api/citations/batch - Check all citations or a subset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { limit = 50, status: filterStatus, forceRecheck = false } = body

    // Fetch citations to check
    let query = supabase
      .from('camp_authors')
      .select(`
        id,
        quote_source_url,
        citation_status,
        authors!inner (name),
        camps!inner (label)
      `)
      .not('quote_source_url', 'is', null)
      .limit(limit)

    // Filter by status if specified
    if (filterStatus) {
      query = query.eq('citation_status', filterStatus)
    } else if (!forceRecheck) {
      // Only check unchecked or old checks (> 7 days)
      query = query.or('citation_status.eq.unchecked,citation_status.is.null')
    }

    const { data: citations, error: fetchError } = await query

    if (fetchError) {
      console.error('Failed to fetch citations:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch citations' }, { status: 500 })
    }

    if (!citations || citations.length === 0) {
      return NextResponse.json({
        message: 'No citations to check',
        checked: 0,
        results: [],
      })
    }

    // Check each URL with rate limiting (100ms between requests)
    const results: CheckResult[] = []
    const checkedAt = new Date().toISOString()

    for (const citation of citations) {
      const url = citation.quote_source_url

      if (!url || !url.startsWith('http')) {
        results.push({
          campAuthorId: citation.id,
          authorName: (citation.authors as any)?.name || 'Unknown',
          campName: (citation.camps as any)?.label || 'Unknown',
          url: url || '',
          status: 'skipped',
          error: 'Invalid URL',
        })
        continue
      }

      // Check the URL
      const checkResult = await checkUrl(url)

      results.push({
        campAuthorId: citation.id,
        authorName: (citation.authors as any)?.name || 'Unknown',
        campName: (citation.camps as any)?.label || 'Unknown',
        url,
        status: checkResult.status,
        httpStatus: checkResult.httpStatus,
        responseTimeMs: checkResult.responseTimeMs,
        error: checkResult.error,
      })

      // Update database
      await supabase
        .from('camp_authors')
        .update({
          citation_status: checkResult.status,
          citation_last_checked: checkedAt,
          citation_http_status: checkResult.httpStatus || null,
          citation_response_time_ms: checkResult.responseTimeMs,
        })
        .eq('id', citation.id)

      // Rate limit: 100ms between requests
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Summary stats
    const summary = {
      total: results.length,
      valid: results.filter(r => r.status === 'valid').length,
      broken: results.filter(r => r.status === 'broken').length,
      timeout: results.filter(r => r.status === 'timeout').length,
      error: results.filter(r => r.status === 'error').length,
      skipped: results.filter(r => r.status === 'skipped').length,
    }

    return NextResponse.json({
      message: `Checked ${results.length} citations`,
      summary,
      checkedAt,
      results,
    })
  } catch (error) {
    console.error('Batch citation check error:', error)
    return NextResponse.json(
      { error: 'Batch check failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET /api/citations/batch - Get current citation status summary
export async function GET() {
  try {
    // Get counts by status
    const { data: statusCounts, error } = await supabase
      .from('camp_authors')
      .select('citation_status')
      .not('quote_source_url', 'is', null)

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 })
    }

    const summary = {
      total: statusCounts?.length || 0,
      valid: statusCounts?.filter(r => r.citation_status === 'valid').length || 0,
      broken: statusCounts?.filter(r => r.citation_status === 'broken').length || 0,
      timeout: statusCounts?.filter(r => r.citation_status === 'timeout').length || 0,
      unchecked: statusCounts?.filter(r => !r.citation_status || r.citation_status === 'unchecked').length || 0,
    }

    return NextResponse.json({
      status: 'ok',
      summary,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get status' }, { status: 500 })
  }
}
