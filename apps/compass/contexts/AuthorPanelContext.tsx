'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface AuthorPanelContextType {
  isOpen: boolean
  authorId: string | null
  openPanel: (authorId: string) => void
  closePanel: () => void
}

const AuthorPanelContext = createContext<AuthorPanelContextType | undefined>(undefined)

export function AuthorPanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [authorId, setAuthorId] = useState<string | null>(null)

  const openPanel = (id: string) => {
    setAuthorId(id)
    setIsOpen(true)
  }

  const closePanel = () => {
    setIsOpen(false)
    // Keep authorId for animation, it will be cleared on next open
  }

  return (
    <AuthorPanelContext.Provider value={{ isOpen, authorId, openPanel, closePanel }}>
      {children}
    </AuthorPanelContext.Provider>
  )
}

export function useAuthorPanel() {
  const context = useContext(AuthorPanelContext)
  if (context === undefined) {
    throw new Error('useAuthorPanel must be used within an AuthorPanelProvider')
  }
  return context
}
