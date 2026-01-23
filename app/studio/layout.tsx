'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import {
  FileText,
  FolderOpen,
  PenTool,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

interface StudioLayoutProps {
  children: React.ReactNode
}

export default function StudioLayout({ children }: StudioLayoutProps) {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/studio/projects',
      label: 'Projects',
      icon: FolderOpen,
      description: 'View all projects',
    },
    {
      href: '/studio/builder',
      label: 'New Content',
      icon: FileText,
      description: 'Create from brief',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 z-30 bg-white border-b border-gray-200">
        <div className="h-full px-4 flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <Link
              href="/studio/projects"
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Studio</span>
              <span className="text-xs px-1.5 py-0.5 bg-violet-100 text-violet-700 rounded font-medium">
                Beta
              </span>
            </Link>

            <div className="h-6 w-px bg-gray-200" />

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href ||
                  (item.href === '/studio/projects' && pathname.startsWith('/studio/editor'))

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                      ${isActive
                        ? 'bg-violet-100 text-violet-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Back to Compass
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="fixed top-14 left-0 right-0 h-10 z-20 bg-gray-50 border-b border-gray-200">
        <div className="h-full px-4 flex items-center max-w-7xl mx-auto">
          <Breadcrumb pathname={pathname} />
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-24 pb-8">
        {children}
      </main>
    </div>
  )
}

function Breadcrumb({ pathname }: { pathname: string }) {
  const segments = pathname.split('/').filter(Boolean)

  const breadcrumbItems = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    let label = segment.charAt(0).toUpperCase() + segment.slice(1)

    // Handle special cases
    if (segment === 'studio') label = 'Studio'
    if (segment === 'builder') label = 'Content Builder'
    if (segment === 'projects') label = 'Projects'
    if (segment === 'editor') label = 'Editor'

    return { href, label }
  })

  return (
    <div className="flex items-center gap-1 text-sm">
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
          {index === breadcrumbItems.length - 1 ? (
            <span className="text-gray-900 font-medium">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="text-gray-500 hover:text-gray-700"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  )
}
