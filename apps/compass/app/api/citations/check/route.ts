import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

interface CheckResult {
  url: string
  isAccessible: boolean
  status: 'valid' | 'broken' | 'timeout' | 'error'
  httpStatus?: number
  responseTimeMs: number
  error?: string
  checkedAt: string
}

async function checkUrl(url: string, timeoutMs = 10000): Promise<CheckResult> {
  const startTime = Date.now()
  const checkedAt = new Date().toISOString()

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

    // Some servers don't support HEAD, try GET if we get 405
    if (response.status === 405) {
      const getResponse = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(timeoutMs),
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; CompassBot/1.0; +https://compass.app)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        redirect: 'follow',
      })

      return {
        url,
        isAccessible: getResponse.ok,
        status: getResponse.ok ? 'valid' : 'broken',
        httpStatus: getResponse.status,
        responseTimeMs: Date.now() - startTime,
        checkedAt,
      }
    }

    return {
      url,
      isAccessible: response.ok,
      status: response.ok ? 'valid' : 'broken',
      httpStatus: response.status,
      responseTimeMs,
      checkedAt,
    }
  } catch (error) {
    const responseTimeMs = Date.now() - startTime

    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        return {
          url,
          isAccessible: false,
          status: 'timeout',
          responseTimeMs,
          error: 'Request timed out',
          checkedAt,
        }
      }
    }

    return {
      url,
      isAccessible: false,
      status: 'error',
      responseTimeMs,
      error: error instanceof Error ? error.message : 'Unknown error',
      checkedAt,
    }
  }
}

// POST /api/citations/check - Check a single URL
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, campAuthorId } = body

    if (!url) {
      return NextResponse.json(
        { error: 'Missing required field: url' },
        { status: 400 }
      )
    }

    // Check the URL
    const result = await checkUrl(url)

    // If campAuthorId provided, update the database
    if (campAuthorId && supabase) {
      const { error: updateError } = await supabase
        .from('camp_authors')
        .update({
          citation_status: result.status,
          citation_last_checked: result.checkedAt,
          citation_http_status: result.httpStatus || null,
          citation_response_time_ms: result.responseTimeMs,
        })
        .eq('id', campAuthorId)

      if (updateError) {
        console.error('Failed to update camp_authors:', updateError)
      }
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Citation check error:', error)
    return NextResponse.json(
      { error: 'Check failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET /api/citations/check - Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'citation-checker',
    timestamp: new Date().toISOString(),
  })
}
