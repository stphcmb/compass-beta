'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import SearchBar from '@/components/SearchBar'
import SuggestedTopics from '@/components/SuggestedTopics'
import DiscoverByDomain from '@/components/DiscoverByDomain'
import WhiteSpacePanel from '@/components/WhiteSpacePanel'

const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false })

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleTopicSelect = (topic: string) => {
    setSearchQuery(topic)
  }

  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-bone)' }}>
      <Sidebar />
      <Header />
      <main className="flex-1 ml-64 mt-16 flex flex-col items-center justify-start overflow-y-auto" style={{ padding: 'var(--space-10)' }}>
        {/* Hero Section - Clear "Start Here" Anchor */}
        <div className="max-w-3xl w-full text-center" style={{ marginBottom: 'var(--section-spacing)' }}>
          <h1 style={{ marginBottom: 'var(--space-3)' }}>
            Find Your Position
          </h1>
          <p style={{
            fontSize: 'var(--text-body)',
            color: 'var(--color-charcoal)',
            marginBottom: 'var(--space-10)',
            lineHeight: 'var(--leading-relaxed)'
          }}>
            Validate your thesis and discover where you fit in the AI discourse
          </p>
          <SearchBar initialQuery={searchQuery} onQueryChange={setSearchQuery} />
          <SuggestedTopics onTopicSelect={handleTopicSelect} />
        </div>

        {/* Discovery Section */}
        <div className="w-full max-w-6xl" style={{ marginTop: 'var(--section-spacing)' }}>
          <h2 style={{ marginBottom: 'var(--space-5)' }}>Discovery & Inspiration</h2>
          <DiscoverByDomain />
          <WhiteSpacePanel />
        </div>
      </main>
    </div>
  )
}

