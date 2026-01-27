'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { UserButton, useUser } from '@clerk/nextjs'
import { PenTool, FolderOpen, Plus, Home } from 'lucide-react'

interface HeaderProps {
  sidebarCollapsed?: boolean
}

export default function Header({ sidebarCollapsed = false }: HeaderProps) {
  const pathname = usePathname()
  const { isLoaded } = useUser()

  const navItems = [
    { href: '/', label: 'Home', icon: Home, tooltip: 'Studio overview' },
    { href: '/projects', label: 'Projects', icon: FolderOpen, tooltip: 'Browse all projects' },
    { href: '/builder', label: 'New Project', icon: Plus, tooltip: 'Create a new project' },
  ]

  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 z-30"
      style={{
        background: 'linear-gradient(135deg, rgba(10, 15, 26, 0.95) 0%, rgba(17, 24, 38, 0.92) 50%, rgba(15, 23, 41, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 51, 255, 0.2)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
      }}
    >
      {/* Gradient accent line at top */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: 'linear-gradient(90deg, #3D5FFF 0%, #0033FF 50%, #0028CC 100%)'
        }}
      />

      <div className="h-full px-6 flex items-center justify-between max-w-[1800px] mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold transition-all duration-200 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #3D5FFF 0%, #0033FF 50%, #0028CC 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          <PenTool className="w-5 h-5 text-blue-400" />
          Studio
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href ||
                  (item.href === '/projects' && pathname.startsWith('/projects')) ||
                  (item.href === '/builder' && pathname.startsWith('/builder')) ||
                  (item.href === '/editor' && pathname.startsWith('/editor'))
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(0, 51, 255, 0.2) 0%, rgba(0, 40, 204, 0.15) 100%)'
                    : 'transparent',
                  color: isActive ? '#a5b4fc' : '#94a3b8',
                  border: isActive ? '1px solid rgba(0, 51, 255, 0.3)' : '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    e.currentTarget.style.color = '#d1d9ff'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#94a3b8'
                  }
                }}
                title={item.tooltip}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User Button - fixed width to prevent layout shift during load */}
        <div className="flex items-center justify-end" style={{ minWidth: '36px', width: '36px' }}>
          <UserButton
            afterSignOutUrl="/sign-in"
            appearance={{
              elements: {
                avatarBox: 'w-9 h-9 ring-2 ring-offset-2 ring-offset-transparent',
                userButtonPopoverCard: 'shadow-lg',
              },
              variables: {
                colorPrimary: '#0033FF'
              }
            }}
          />
        </div>
      </div>
    </header>
  )
}
