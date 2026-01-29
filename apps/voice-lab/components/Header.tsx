'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { UserButton, useUser } from '@clerk/nextjs'
import { Mic, Library, Plus, Home } from 'lucide-react'

interface HeaderProps {
  sidebarCollapsed?: boolean
}

export default function Header({ sidebarCollapsed = false }: HeaderProps) {
  const pathname = usePathname()
  const { isLoaded } = useUser()

  const navItems = [
    { href: '/', label: 'Home', icon: Home, tooltip: 'Voice Lab overview' },
    { href: '/library', label: 'Library', icon: Library, tooltip: 'View and manage your voice profiles' },
    { href: '/new', label: 'New Profile', icon: Plus, tooltip: 'Create a new voice profile' },
  ]

  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 z-30"
      style={{
        background: 'linear-gradient(135deg, rgba(10, 15, 26, 0.95) 0%, rgba(17, 24, 38, 0.92) 50%, rgba(15, 23, 41, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
      }}
    >
      {/* Gradient accent line at top */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: 'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 50%, #7C3AED 100%)'
        }}
      />

      <div className="h-full px-6 flex items-center justify-between max-w-[1800px] mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:outline-none rounded-lg"
          style={{
            background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 50%, #7C3AED 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          aria-label="Voice Lab: Go to home page"
        >
          <Mic className="w-5 h-5 text-violet-400" aria-hidden="true" />
          Voice Lab
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href ||
                  (item.href === '/library' && pathname.startsWith('/library'))
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:outline-none"
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.15) 100%)'
                    : 'transparent',
                  color: isActive ? '#c4b5fd' : '#94a3b8',
                  border: isActive ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    e.currentTarget.style.color = '#ddd6fe'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#94a3b8'
                  }
                }}
                title={item.tooltip}
                aria-label={`${item.label}: ${item.tooltip}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">{item.label}</span>
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
                colorPrimary: '#8B5CF6'
              }
            }}
          />
        </div>
      </div>
    </header>
  )
}
