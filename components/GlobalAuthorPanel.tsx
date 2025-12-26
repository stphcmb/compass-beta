'use client'

import { useAuthorPanel } from '@/contexts/AuthorPanelContext'
import AuthorDetailPanel from './AuthorDetailPanel'

export default function GlobalAuthorPanel() {
  const { isOpen, authorId, closePanel } = useAuthorPanel()

  return (
    <AuthorDetailPanel
      authorId={authorId}
      isOpen={isOpen}
      onClose={closePanel}
    />
  )
}
