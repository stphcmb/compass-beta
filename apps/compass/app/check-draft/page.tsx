'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import ResearchAssistantClient from './ResearchAssistantClient'

/**
 * Client Component for research assistant page
 * Uses client-side auth for faster initial load (no server roundtrip)
 */
export default function ResearchAssistantPage() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const analysisId = searchParams.get('analysis') || null

  // Redirect if not signed in (only after loaded to avoid flash)
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  // Show component immediately - let internal loading states handle it
  // This prevents the flash from multiple loading layers
  return <ResearchAssistantClient initialAnalysisId={analysisId} />
}
