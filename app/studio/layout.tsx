'use client'

interface StudioLayoutProps {
  children: React.ReactNode
}

export default function StudioLayout({ children }: StudioLayoutProps) {
  // Simple pass-through layout - the main Header and page-specific headers
  // handle navigation. No duplicate header/breadcrumb needed.
  return <>{children}</>
}
