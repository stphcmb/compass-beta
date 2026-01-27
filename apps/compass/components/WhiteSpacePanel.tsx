'use client'

import { useRouter } from 'next/navigation'

const WHITE_SPACE: Array<{ topic: string; thesis: string; angle: string }> = [
  {
    topic: 'AI-powered knowledge work augmentation',
    thesis: 'AI as a copilot for professionals, not replacement',
    angle: 'Most discourse polarizes on displacement vs. utopia. Missing: practical frameworks for human-AI collaboration in knowledge work.',
  },
  {
    topic: 'Mid-market AI transformation roadmap',
    thesis: 'Enterprise AI beyond the Fortune 500',
    angle: 'Major voices focus on tech giants and startups. Gap: implementation playbooks for mid-market companies with limited resources.',
  },
  {
    topic: 'Reskilling for the AI era in traditional industries',
    thesis: 'Practical upskilling beyond tech workers',
    angle: 'Most examples are tech-heavy. Missing: concrete reskilling frameworks for healthcare, education, manufacturing, and retail workers.',
  },
  {
    topic: 'Open source AI democratization',
    thesis: 'Balancing innovation with safety in open models',
    angle: 'Debate centers on closed vs. open. Gap: nuanced positions on responsible open-source AI development and governance.',
  },
  {
    topic: 'AI regulation that enables innovation',
    thesis: 'Smart governance without stifling progress',
    angle: 'Extremes dominate: full regulation vs. no regulation. Missing: adaptive governance frameworks that protect while enabling innovation.',
  },
  {
    topic: 'Common sense AI and reasoning limitations',
    thesis: 'What current AI fundamentally cannot do',
    angle: 'Hype focuses on capabilities. Gap: rigorous analysis of AI limitations in reasoning, causality, and common sense understanding.',
  },
]

export default function WhiteSpacePanel() {
  const router = useRouter()

  const handleExplore = (topic: string) => {
    const item = WHITE_SPACE.find(ws => ws.topic === topic)
    if (item) {
      const params = new URLSearchParams()
      params.set('topic', topic)
      params.set('thesis', item.thesis)
      params.set('angle', item.angle)
      router.push(`/content-helper?${params.toString()}`)
    }
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
              <blockquote className="text-sm md:text-base text-purple-900 font-semibold">"{item.thesis}"</blockquote>
              <p className="text-xs md:text-sm text-purple-800 mt-1">New content angle for you: {item.angle}</p>
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
