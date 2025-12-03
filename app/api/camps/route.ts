import { NextRequest, NextResponse } from 'next/server'
import { getCampsWithAuthors, getAllCampsByDomain } from '@/lib/api/thought-leaders'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query') || undefined
    const domain = searchParams.get('domain') || undefined
    const fetchAll = searchParams.get('fetchAll') === 'true'

    if (fetchAll) {
      // Fetch both all camps and filtered camps
      const [allCamps, result] = await Promise.all([
        getAllCampsByDomain(),
        getCampsWithAuthors(query, domain)
      ])

      return NextResponse.json({
        allCamps,
        filteredCamps: result.camps,
        expandedQueries: result.expandedQueries
      })
    } else {
      // Just fetch filtered camps
      const result = await getCampsWithAuthors(query, domain)
      return NextResponse.json({
        camps: result.camps,
        expandedQueries: result.expandedQueries
      })
    }
  } catch (error) {
    console.error('Error in /api/camps:', error)
    return NextResponse.json(
      { error: 'Failed to fetch camps' },
      { status: 500 }
    )
  }
}
