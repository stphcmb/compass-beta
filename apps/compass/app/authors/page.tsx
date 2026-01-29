import { getAuthorsWithDomains } from '@/lib/api/thought-leaders'
import AuthorsClientView from './AuthorsClientView'

// ISR: Revalidate every 5 minutes for fresh data without blocking
export const revalidate = 300

/**
 * Authors Page - Server Component
 *
 * Architecture:
 * - Fetches data on the server (fast, cached with ISR)
 * - Only fetches minimal data needed for listing (authors + domains)
 * - Passes data to Client Component for interactivity
 * - First load shows data immediately (no loading state)
 * - Subsequent visits use cached data (max 5 min old)
 */
export default async function AuthorsPage() {
  // Fetch authors with their domain associations (optimized query)
  const authorsWithDomains = await getAuthorsWithDomains()

  // Pass server-fetched data to Client Component
  return <AuthorsClientView authorsWithDomains={authorsWithDomains} />
}
