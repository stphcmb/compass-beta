'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import HistoryClient from './HistoryClient'

/**
 * Client Component for history page
 * Uses client-side auth for faster initial load (no server roundtrip)
 */
export default function HistoryPage() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  // Redirect if not signed in (only after loaded to avoid flash)
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  // Show component immediately - let internal loading states handle it
  // This prevents the flash from multiple loading layers
  return <HistoryClient />
}
