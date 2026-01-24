'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { VOICE_LAB_BETA_EMAILS } from '@/lib/feature-flags'

interface VoiceLabLayoutProps {
  children: React.ReactNode
}

export default function VoiceLabLayout({ children }: VoiceLabLayoutProps) {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  // Check if current user has access to Voice Lab beta
  const hasVoiceLabAccess = isLoaded && user?.emailAddresses?.some(
    email => VOICE_LAB_BETA_EMAILS.includes(email.emailAddress.toLowerCase())
  )

  useEffect(() => {
    // Redirect if user doesn't have access
    if (isLoaded && !hasVoiceLabAccess) {
      router.replace('/')
    }
  }, [isLoaded, hasVoiceLabAccess, router])

  // Show nothing while checking access
  if (!isLoaded || !hasVoiceLabAccess) {
    return null
  }

  return <>{children}</>
}
