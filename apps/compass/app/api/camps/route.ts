import { NextRequest, NextResponse } from 'next/server'
import { getCampsWithAuthors } from '@/lib/api/thought-leaders'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query') || undefined
    const domain = searchParams.get('domain') || undefined

    const result = await getCampsWithAuthors(query, domain)

    // Set cache headers based on request type
    // Browse mode (no query): cache longer, search results: cache shorter
    const cacheControl = query
      ? 'public, s-maxage=60, stale-while-revalidate=120'  // Search: 1 min cache, 2 min stale
      : 'public, s-maxage=300, stale-while-revalidate=600' // Browse: 5 min cache, 10 min stale

    return NextResponse.json(
      {
        camps: result.camps,
        expandedQueries: result.expandedQueries,
        expansionMeta: result.expansionMeta
      },
      {
        headers: {
          'Cache-Control': cacheControl
        }
      }
    )
  } catch (error) {
    console.error('Error in /api/camps:', error)
    return NextResponse.json(
      { error: 'Failed to fetch camps' },
      { status: 500 }
    )
  }
}
