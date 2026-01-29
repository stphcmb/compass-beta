'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Voice Lab main page - redirects to library
 * The library view is the primary interface for managing voice profiles.
 */
export default function VoiceLabPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/library')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-600">Loading Voice Lab...</div>
    </div>
  )
}
