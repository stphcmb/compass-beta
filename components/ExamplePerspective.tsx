'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Quote, ExternalLink, Users, BookOpen, ThumbsUp, ThumbsDown } from 'lucide-react'
import { getDomainColor } from './DiscourseMap'

interface ExampleAuthor {
  name: string
  role: string
  quote: string
  work: string
  workUrl?: string
}

interface ExamplePerspectiveProps {
  onExploreClick?: () => void
}

// Curated example data - a rich perspective to teach the hierarchy
const EXAMPLE_DATA = {
  domain: 'Technology',
  perspective: {
    name: 'Scaling Will Deliver',
    blurb: 'Current AI architectures, given sufficient compute and data, will continue improving toward AGI.',
  },
  authors: [
    {
      name: 'Dario Amodei',
      role: 'CEO, Anthropic',
      quote: 'The scaling hypothesis has been remarkably validated. We continue to see improvements that suggest we haven\'t hit fundamental limits.',
      work: 'Anthropic Research',
      workUrl: 'https://www.anthropic.com'
    }
  ],
  supports: ['Sam Altman', 'Demis Hassabis'],
  challenges: ['Gary Marcus', 'Yann LeCun']
}

export default function ExamplePerspective({ onExploreClick }: ExamplePerspectiveProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const colors = getDomainColor(EXAMPLE_DATA.domain)

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-[var(--color-accent)]" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-charcoal)]">
          How Perspectives Work
        </h2>
      </div>

      {/* Teaching Card */}
      <div
        className="bg-white border border-gray-200 rounded-xl overflow-hidden"
        style={{ boxShadow: 'var(--shadow-md)' }}
      >
        {/* Intro Text */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed">
            The discourse is organized as: <strong>Domain</strong> → <strong>Perspective</strong> → <strong>Authors</strong> → <strong>Works & Quotes</strong>.
            Here's one example to show how it all connects:
          </p>
        </div>

        {/* Nested Hierarchy Visualization */}
        <div className="p-4">
          {/* Level 1: Domain */}
          <div className={`border-l-4 ${colors.border} pl-4`}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${colors.bg}`} />
              <span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>
                Domain
              </span>
              <span className="text-sm font-medium text-gray-900">
                {EXAMPLE_DATA.domain}
              </span>
            </div>

            {/* Level 2: Perspective */}
            <div className="ml-4 border-l-2 border-gray-200 pl-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-gray-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Perspective
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {EXAMPLE_DATA.perspective.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {EXAMPLE_DATA.perspective.blurb}
                </p>
              </div>

              {/* Level 3: Authors */}
              <div className="ml-4 border-l-2 border-gray-100 pl-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Authors ({EXAMPLE_DATA.authors.length})
                  </span>
                </div>

                <div className="space-y-3">
                  {EXAMPLE_DATA.authors.map((author, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
                    >
                      {/* Author Header */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-indigo-700">
                            {author.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{author.name}</div>
                          <div className="text-xs text-gray-500">{author.role}</div>
                        </div>
                      </div>

                      {/* Level 4: Quote + Work */}
                      <div className="ml-10 space-y-2">
                        {/* Quote */}
                        <div className="flex items-start gap-2 bg-blue-50 rounded p-2">
                          <Quote className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-gray-700 italic leading-relaxed">
                            "{author.quote}"
                          </p>
                        </div>

                        {/* Work */}
                        {author.workUrl ? (
                          <a
                            href={author.workUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {author.work}
                          </a>
                        ) : (
                          <span className="text-xs text-gray-500">{author.work}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Supports & Challenges */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <ThumbsUp className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                        Supports
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {EXAMPLE_DATA.supports.map((name, idx) => (
                        <span key={idx} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <ThumbsDown className="w-3.5 h-3.5 text-red-600" />
                      <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">
                        Challenges
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {EXAMPLE_DATA.challenges.map((name, idx) => (
                        <span key={idx} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onExploreClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[var(--color-accent)] text-white rounded-lg font-medium text-sm hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            <span>Explore All Perspectives Below</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
