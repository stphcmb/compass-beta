'use client'

// Organized by domain with descriptive queries that match camp content
const suggestedTopics = [
  // Technology domain
  { label: 'Will scaling solve AI?', query: 'scaling' },
  { label: 'AI safety & alignment', query: 'safety alignment' },
  { label: 'AGI timelines', query: 'AGI artificial general intelligence' },

  // Society domain
  { label: 'AI ethics & bias', query: 'ethics bias fairness' },
  { label: 'AI existential risk', query: 'existential risk x-risk' },
  { label: 'AI hype vs reality', query: 'hype bubble limitations' },

  // Business domain
  { label: 'Enterprise AI adoption', query: 'enterprise adoption transformation' },
  { label: 'AI for developers', query: 'developer tools coding' },
  { label: 'Open source AI', query: 'open source hugging face' },

  // Policy domain
  { label: 'AI regulation', query: 'regulation governance policy' },
  { label: 'AI safety institutes', query: 'safety institute evaluation' },

  // Workers domain
  { label: 'AI & job displacement', query: 'jobs displacement automation workers' },
  { label: 'Human-AI collaboration', query: 'collaboration augmentation reskilling' },
]

interface SuggestedTopicsProps {
  onTopicSelect: (topic: string) => void
}

export default function SuggestedTopics({ onTopicSelect }: SuggestedTopicsProps) {
  // Show a random selection of 6 topics
  const displayTopics = suggestedTopics.slice(0, 8)

  return (
    <div className="text-center">
      <p className="text-sm md:text-base text-gray-500 mb-3">Try searching for:</p>
      <div className="flex flex-wrap justify-center gap-2">
        {displayTopics.map((topic, index) => (
          <button
            key={index}
            onClick={() => onTopicSelect(topic.query)}
            className="px-3 py-1.5 text-sm rounded-full bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition-colors"
          >
            {topic.label}
          </button>
        ))}
      </div>
    </div>
  )
}

