'use client'

import { useRouter } from 'next/navigation'

const WHITE_SPACE: Array<{ topic: string; why: string }> = [
  {
    topic: 'Enterprise AI adoption of LLMs in the Mid-Market',
    why: 'Major voices cover F500 and startups; little on mid-market implementation challenges.',
  },
  {
    topic: 'Reskilling program playbooks for non-tech sectors',
    why: 'Most examples are tech-heavy; limited practitioner detail for healthcare/education.',
  },
  {
    topic: 'Change management for agentic workflows',
    why: 'Emerging practice area with sparse, practical guidance from operators.',
  },
]

export default function WhiteSpacePanel() {
  const router = useRouter()

  const handleExplore = (topic: string) => {
    const params = new URLSearchParams()
    params.set('q', topic)
    router.push(`/results?${params.toString()}`)
  }

  if (WHITE_SPACE.length === 0) return null

  return (
    <section className="mt-8">
      <div className="rounded-2xl p-6 border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg md:text-xl font-semibold text-purple-900">White Space Opportunities</h3>
        </div>
        <div className="space-y-4">
          {WHITE_SPACE.slice(0, 3).map((item, idx) => (
            <div key={idx}>
              <blockquote className="text-sm md:text-base text-purple-900 font-semibold">“{item.topic}”</blockquote>
              <p className="text-xs md:text-sm text-purple-800 mt-1">Why it's white space: {item.why}</p>
              <button
                onClick={() => handleExplore(item.topic)}
                className="mt-2 text-sm md:text-base text-purple-800 underline hover:no-underline"
              >
                Explore White Space →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>

  )
}
