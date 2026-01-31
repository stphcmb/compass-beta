import { CanonHealthMetrics, TopicCoverageData, CurationQueueData } from './types'

// Base URL for internal API calls
const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

export async function getCanonHealthMetrics(): Promise<CanonHealthMetrics> {
  const res = await fetch(`${getBaseUrl()}/api/admin/canon-health`, {
    next: { revalidate: 300 } // 5 minutes cache
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch canon health metrics: ${res.status}`)
  }
  return res.json()
}

export async function getTopicCoverageMetrics(): Promise<TopicCoverageData> {
  const res = await fetch(`${getBaseUrl()}/api/admin/topic-coverage`, {
    next: { revalidate: 300 }
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch topic coverage metrics: ${res.status}`)
  }
  return res.json()
}

export async function getCurationQueueMetrics(): Promise<CurationQueueData> {
  const res = await fetch(`${getBaseUrl()}/api/admin/curation/queue`, {
    next: { revalidate: 300 }
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch curation queue metrics: ${res.status}`)
  }
  return res.json()
}

// Parallel fetch all metrics for initial page load
export interface AdminMetrics {
  canonHealth: CanonHealthMetrics
  topicCoverage: TopicCoverageData
  curationQueue: CurationQueueData
}

export async function getAllAdminMetrics(): Promise<AdminMetrics> {
  const [canonHealth, topicCoverage, curationQueue] = await Promise.all([
    getCanonHealthMetrics(),
    getTopicCoverageMetrics(),
    getCurationQueueMetrics()
  ])

  return { canonHealth, topicCoverage, curationQueue }
}
