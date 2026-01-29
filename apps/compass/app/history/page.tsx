import { Suspense } from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import HistoryClient from './HistoryClient'

/**
 * Server Component for history page
 * Handles auth on server-side for faster initial load
 * This replaces the massive client-side page.tsx
 */
export default async function HistoryPage() {
  // Server-side auth check (much faster than middleware)
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <Suspense
      fallback={
        <div
          className="h-screen flex items-center justify-center"
          style={{ backgroundColor: 'var(--color-page-bg)' }}
        >
          <div className="text-gray-500">Loading your library...</div>
        </div>
      }
    >
      <HistoryClient />
    </Suspense>
  )
}
