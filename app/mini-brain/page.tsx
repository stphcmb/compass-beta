'use client'

import dynamic from 'next/dynamic'
import MiniBrain from '@/components/MiniBrain'

const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false })

export default function MiniBrainPage() {
  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-bone)' }}>
      <Sidebar />
      <main className="flex-1 ml-64 overflow-y-auto p-10">
        <MiniBrain />
      </main>
    </div>
  )
}
