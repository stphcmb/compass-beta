'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import AIEditor from '@/components/AIEditor'

const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false })

export default function AIEditorPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const handleSidebarToggle = (e: Event) => {
      const ev = e as CustomEvent<{ isCollapsed: boolean }>
      setSidebarCollapsed(ev.detail.isCollapsed)
    }

    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState === 'true') {
      setSidebarCollapsed(true)
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
        <AIEditor />
      </main>
    </div>
  )
}
