'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { Compass, Users, Home } from 'lucide-react'
import { TERMINOLOGY } from '@/lib/constants/terminology'

interface HeaderProps {
  sidebarCollapsed?: boolean
}

export default function Header({ sidebarCollapsed = false }: HeaderProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home', icon: Home, tooltip: 'Go to homepage' },
    { href: '/explore', label: TERMINOLOGY.search, icon: Compass, tooltip: `Browse ${TERMINOLOGY.camps.toLowerCase()} and positions on AI discourse` },
    { href: '/authors', label: TERMINOLOGY.authors, icon: Users, tooltip: 'Browse thought leaders and their viewpoints' },
  ]

  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 z-30"
      style={{
        background: 'linear-gradient(135deg, rgba(15, 15, 26, 0.95) 0%, rgba(26, 26, 46, 0.92) 50%, rgba(22, 33, 62, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
      }}
    >
      {/* Gradient accent line at top */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)'
        }}
      />

      <div className="h-full px-6 flex items-center justify-between max-w-[1800px] mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold transition-all duration-200 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c084fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Compass
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href ||
                  (item.href === '/authors' && pathname.startsWith('/authors/')) ||
                  (item.href === '/explore' && pathname === '/results')
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.2) 100%)'
                    : 'transparent',
                  color: isActive ? '#c4b5fd' : '#94a3b8',
                  border: isActive ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    e.currentTarget.style.color = '#e0e7ff'
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

        {/* User Button */}
        <UserButton
          afterSignOutUrl="/sign-in"
          appearance={{
            elements: {
              avatarBox: 'w-9 h-9 ring-2 ring-violet-500/30 ring-offset-2 ring-offset-transparent',
              userButtonPopoverCard: 'shadow-lg',
            }
          }}
        />
      </div>
    </header>
  )
}
