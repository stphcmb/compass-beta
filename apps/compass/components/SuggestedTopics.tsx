'use client'

import { useState, useEffect } from 'react'

// Comprehensive list of search suggestions organized by domain and viewpoint
const suggestedTopics = [
  // AI Technical Capabilities
  { label: 'Will scaling solve AI?', query: 'scaling' },
  { label: 'AGI timelines', query: 'AGI artificial general intelligence' },
  { label: 'Transformer limitations', query: 'transformer architecture limitations' },
  { label: 'Multimodal AI', query: 'multimodal vision language' },
  { label: 'AI reasoning capabilities', query: 'reasoning logic symbolic' },
  { label: 'Neural scaling laws', query: 'scaling laws compute data' },
  { label: 'AI model interpretability', query: 'interpretability explainability transparency' },
  { label: 'Emergent capabilities', query: 'emergence emergent abilities' },

  // AI Safety & Alignment
  { label: 'AI safety & alignment', query: 'safety alignment' },
  { label: 'AI existential risk', query: 'existential risk x-risk' },
  { label: 'AI control problem', query: 'control alignment robust' },
  { label: 'Value alignment', query: 'values human preferences alignment' },
  { label: 'AI red teaming', query: 'red team adversarial testing' },
  { label: 'Misalignment risks', query: 'misalignment deception mesa optimizer' },

  // AI & Society
  { label: 'AI ethics & bias', query: 'ethics bias fairness' },
  { label: 'AI hype vs reality', query: 'hype bubble limitations' },
  { label: 'AI transparency', query: 'transparency accountability' },
  { label: 'AI concentration of power', query: 'power concentration monopoly' },
  { label: 'Algorithmic fairness', query: 'fairness discrimination algorithmic' },
  { label: 'AI & democracy', query: 'democracy governance public' },
  { label: 'AI misinformation', query: 'misinformation deepfakes synthetic media' },
  { label: 'AI environmental impact', query: 'environment energy carbon emissions' },

  // Enterprise AI Adoption
  { label: 'Enterprise AI adoption', query: 'enterprise adoption transformation' },
  { label: 'AI ROI & metrics', query: 'ROI metrics measurement value' },
  { label: 'AI implementation challenges', query: 'implementation challenges integration' },
  { label: 'AI-first companies', query: 'AI-first native strategy' },
  { label: 'AI product design', query: 'product design UX AI-powered' },
  { label: 'AI infrastructure', query: 'infrastructure MLOps deployment' },
  { label: 'AI talent & skills', query: 'talent skills hiring training' },

  // Developer Tools & Open Source
  { label: 'AI for developers', query: 'developer tools coding' },
  { label: 'Open source AI', query: 'open source hugging face' },
  { label: 'AI coding assistants', query: 'copilot coding assistant developer' },
  { label: 'Open vs closed models', query: 'open closed proprietary models' },
  { label: 'AI model fine-tuning', query: 'fine-tuning customization adaptation' },

  // AI Governance & Policy
  { label: 'AI regulation', query: 'regulation governance policy' },
  { label: 'AI safety institutes', query: 'safety institute evaluation' },
  { label: 'AI liability & accountability', query: 'liability accountability legal' },
  { label: 'AI standards & benchmarks', query: 'standards benchmarks evaluation' },
  { label: 'International AI coordination', query: 'international coordination global' },
  { label: 'AI arms race', query: 'arms race geopolitics competition' },

  // Future of Work
  { label: 'AI & job displacement', query: 'jobs displacement automation workers' },
  { label: 'Human-AI collaboration', query: 'collaboration augmentation reskilling' },
  { label: 'AI & creativity', query: 'creativity artists designers creative' },
  { label: 'AI & education', query: 'education learning teaching' },
  { label: 'AI workplace transformation', query: 'workplace transformation productivity' },
  { label: 'Universal basic income', query: 'UBI basic income automation' },
  { label: 'AI skills gap', query: 'skills gap training workforce' },
]

interface SuggestedTopicsProps {
  onTopicSelect: (topic: string) => void
}

export default function SuggestedTopics({ onTopicSelect }: SuggestedTopicsProps) {
  // Randomly select 8 topics on mount (client-side only to avoid hydration mismatch)
  const [displayTopics, setDisplayTopics] = useState<typeof suggestedTopics>([])

  useEffect(() => {
    const shuffled = [...suggestedTopics].sort(() => Math.random() - 0.5)
    setDisplayTopics(shuffled.slice(0, 8))
  }, [])

  // Don't render until we have topics to avoid hydration mismatch
  if (displayTopics.length === 0) {
    return null
  }

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

