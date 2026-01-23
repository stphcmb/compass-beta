'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { isICPStudioEnabled, STUDIO_BETA_EMAILS } from '@/lib/feature-flags'

interface StudioLayoutProps {
  children: React.ReactNode
}

export default function StudioLayout({ children }: StudioLayoutProps) {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  // Check if current user has access to Studio beta
  const hasStudioAccess = isLoaded && user?.emailAddresses?.some(
    email => STUDIO_BETA_EMAILS.includes(email.emailAddress.toLowerCase())
  )

  useEffect(() => {
    // Redirect if Studio is disabled or user doesn't have access
    if (isLoaded && (!isICPStudioEnabled() || !hasStudioAccess)) {
      router.replace('/')
    }
  }, [isLoaded, hasStudioAccess, router])

  // Show nothing while checking access
  if (!isLoaded || !hasStudioAccess) {
    return null
  }

  return <>{children}</>
}
