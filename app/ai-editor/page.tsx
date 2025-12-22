'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import AIEditor from '@/components/AIEditor'
import { FeatureHint } from '@/components/FeatureHint'

const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false })

export default function AIEditorPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [initialText, setInitialText] = useState('')

  useEffect(() => {
    const handleSidebarToggle = (e: Event) => {
      const ev = e as CustomEvent<{ isCollapsed: boolean }>
      setSidebarCollapsed(ev.detail.isCollapsed)
    }

    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState === 'true') {
      setSidebarCollapsed(true)
    }

    // Check for text from MiniAIEditor
    const miniEditorText = sessionStorage.getItem('miniEditorText')
    if (miniEditorText) {
      setInitialText(miniEditorText)
      sessionStorage.removeItem('miniEditorText')
    }

    window.addEventListener('sidebar-toggle', handleSidebarToggle as EventListener)
    return () => window.removeEventListener('sidebar-toggle', handleSidebarToggle as EventListener)
  }, [])

  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-bone)' }}>
      <Sidebar />
      <Header sidebarCollapsed={sidebarCollapsed} />
      <main
        className="flex-1 mt-16 overflow-y-auto p-10 transition-all duration-300"
        style={{
          marginLeft: sidebarCollapsed ? '0' : '256px'
        }}
      >
        <div className="max-w-4xl mx-auto">
          <FeatureHint featureKey="ai-editor" className="mb-6" />
          <AIEditor initialText={initialText} />
        </div>
      </main>
    </div>
  )
}
