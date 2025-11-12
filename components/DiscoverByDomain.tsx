'use client'

import { useRouter } from 'next/navigation'

const DOMAINS: Array<{ key: string; label: string; color: string; ring: string }> = [
  { key: 'Business', label: 'Business', color: 'from-blue-50 to-blue-100', ring: 'ring-blue-200' },
  { key: 'Society', label: 'Society', color: 'from-emerald-50 to-emerald-100', ring: 'ring-emerald-200' },
  { key: 'Workers', label: 'Workers', color: 'from-amber-50 to-amber-100', ring: 'ring-amber-200' },
  { key: 'Technology', label: 'Technology', color: 'from-cyan-50 to-cyan-100', ring: 'ring-cyan-200' },
  { key: 'Policy & Regulation', label: 'Policy & Regulation', color: 'from-purple-50 to-purple-100', ring: 'ring-purple-200' },
]

const DOMAIN_METRICS: Record<string, { metric: string; subtext: string }> = {
  'Business': { metric: '5 New Sources This Week', subtext: 'Hottest Camp: Implementation Practitioners' },
  'Society': { metric: '3 New Sources This Week', subtext: 'Hottest Camp: Regulatory Advocates' },
  'Workers': { metric: '7 New Sources This Week', subtext: 'Hottest Camp: Optimistic Transformationalists' },
  'Technology': { metric: '6 New Sources This Week', subtext: 'Hottest Camp: Technology Optimists' },
  'Policy & Regulation': { metric: '4 New Sources This Week', subtext: 'Hottest Camp: Regulatory Advocates' },
}

export default function DiscoverByDomain() {
  const router = useRouter()

  const handleClick = (domain: string) => {
    const params = new URLSearchParams()
    params.set('q', '')
    params.set('domain', domain)
    router.push(`/results?${params.toString()}`)
  }

  return (
    <section className="mt-8">
      <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">Discover by Domain</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {DOMAINS.map((d) => {
          const m = DOMAIN_METRICS[d.key]
          return (
            <button
              key={d.key}
              onClick={() => handleClick(d.key)}
              className={`text-left rounded-xl border border-gray-200 bg-gradient-to-br ${d.color} p-4 hover:shadow-lg transition-all ${d.ring} hover:ring-2 hover:-translate-y-0.5`}
            >
              <div className="font-bold text-base md:text-lg text-gray-900">{d.label}</div>
              <div className="text-sm md:text-base text-gray-800 mt-2">{m.metric}</div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">{m.subtext}</div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
