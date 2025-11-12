'use client'

const suggestedTopics = [
  'AI safety and ethics',
  'scaling',
  'regulation'
]

interface SuggestedTopicsProps {
  onTopicSelect: (topic: string) => void
}

export default function SuggestedTopics({ onTopicSelect }: SuggestedTopicsProps) {
  return (
    <div className="text-center">
      <p className="text-sm md:text-base text-gray-500 mb-3">Suggested topics:</p>
      <div className="flex flex-wrap justify-center gap-3">
        {suggestedTopics.map((topic, index) => (
          <button
            key={index}
            onClick={() => onTopicSelect(topic)}
            className="px-4 py-2 text-sm md:text-base rounded-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 shadow-sm"
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  )
}

