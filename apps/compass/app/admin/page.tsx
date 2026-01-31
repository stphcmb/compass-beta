import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Shield } from 'lucide-react'
import Header from '@/components/Header'
import { getAllAdminMetrics } from './data'
import { AdminPageClient } from './AdminPageClient'

// Admin email whitelist (server-only env var - not exposed to client)
const ADMIN_EMAILS = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase())
  : [
    'huongnguyen@anduintransact.com',
    'ngthaohuong@gmail.com',
  ]

// Unauthorized component
function AdminUnauthorized() {
  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-page-bg)' }}>
      <Header sidebarCollapsed={true} />
      <main className="flex-1 mt-16 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don&apos;t have permission to access the admin dashboard.</p>
        </div>
      </main>
    </div>
  )
}

interface PageProps {
  searchParams: Promise<{ tab?: string }>
}

// Page component - Server Component with data fetching
export default async function AdminPage({ searchParams }: PageProps) {
  // Get tab from URL on server to avoid client-side flash
  const params = await searchParams
  const initialTab = params.tab || 'canon-health'

  // Check auth
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase() || ''
  const isDev = process.env.NODE_ENV === 'development'
  const isAdmin = ADMIN_EMAILS.includes(userEmail)

  if (!isDev && !isAdmin) {
    return <AdminUnauthorized />
  }

  // Fetch all metrics in parallel on the server
  const metrics = await getAllAdminMetrics()

  // Pass data and initial tab to client component
  return <AdminPageClient initialMetrics={metrics} initialTab={initialTab} />
}
