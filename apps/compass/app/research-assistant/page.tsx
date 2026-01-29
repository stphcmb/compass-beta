import { Suspense } from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import ResearchAssistantClient from './ResearchAssistantClient'

/**
 * Server Component for research assistant page
 * Handles auth on server-side for faster initial load
 */
export default async function ResearchAssistantPage({
  searchParams,
}: {
  searchParams: Promise<{ analysis?: string }>
}) {
  // Server-side auth check (much faster than middleware)
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Next.js 15: searchParams is a Promise
  const params = await searchParams
  const analysisId = params.analysis || null

  return (
    <Suspense
      fallback={
        <div
          className="h-screen flex items-center justify-center"
          style={{ backgroundColor: 'var(--color-page-bg)' }}
        >
          <div className="text-gray-500">Loading...</div>
        </div>
      }
    >
      <ResearchAssistantClient initialAnalysisId={analysisId} />
    </Suspense>
  )
}
