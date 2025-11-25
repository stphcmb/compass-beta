'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
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
    <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col items-center justify-start p-10 overflow-y-auto">
        <div className="max-w-3xl w-full text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Find Your Position
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-10">
            Validate your thesis and discover where you fit in the AI discourse
          </p>
          <SearchBar initialQuery={searchQuery} onQueryChange={setSearchQuery} />
          <SuggestedTopics onTopicSelect={handleTopicSelect} />
        </div>

        <div className="w-full max-w-6xl mt-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-5 text-gray-800">Discovery & Inspiration</h2>
          <DiscoverByDomain />
          <WhiteSpacePanel />
        </div>
      </main>
    </div>
  )
}

