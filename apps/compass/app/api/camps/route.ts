import { NextRequest, NextResponse } from 'next/server'
import { getCampsWithAuthors } from '@/lib/api/thought-leaders'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query') || undefined
    const domain = searchParams.get('domain') || undefined

    const result = await getCampsWithAuthors(query, domain)

    return NextResponse.json({
      camps: result.camps,
      expandedQueries: result.expandedQueries,
      expansionMeta: result.expansionMeta
    })
  } catch (error) {
    console.error('Error in /api/camps:', error)
    return NextResponse.json(
      { error: 'Failed to fetch camps' },
      { status: 500 }
    )
  }
}
