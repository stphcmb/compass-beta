'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { UserButton, useUser } from '@clerk/nextjs'
import { Compass, Users, Home, BookMarked, Search, Shield } from 'lucide-react'
import { NAVIGATION_ITEMS, ADMIN_NAV_ITEM, type NavItem } from '@/lib/constants/terminology'

// Admin email whitelist
const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS
  ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase())
  : [
    'huongnguyen@anduintransact.com',
    'ngthaohuong@gmail.com',
  ]

// Map icon names to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Search,
  Compass,
  BookMarked,
  Users,
  Shield,
}

interface HeaderProps {
  sidebarCollapsed?: boolean
}

export default function Header({ sidebarCollapsed = false }: HeaderProps) {
  const pathname = usePathname()
  const { user, isLoaded } = useUser()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Check if current user is an admin
  const isAdmin = isLoaded && user?.emailAddresses?.some(
    email => ADMIN_EMAILS.includes(email.emailAddress.toLowerCase())
  )

  // Build nav items array, including admin if applicable
  const navItems: NavItem[] = [
    ...NAVIGATION_ITEMS,
    ...(isAdmin ? [ADMIN_NAV_ITEM] : []),
  ]

  // Check if a nav item is active
  const isActive = (item: NavItem): boolean => {
    if (item.href === '/') {
      return pathname === '/'
    }
    if (item.href === '/authors') {
      return pathname === '/authors' || pathname.startsWith('/authors/')
    }
    if (item.href === '/browse') {
      return pathname === '/browse' || pathname === '/results'
    }
    if (item.href === '/my-library') {
      return pathname === '/my-library' || pathname.startsWith('/my-library')
    }
    if (item.href === '/admin') {
      return pathname === '/admin' || pathname.startsWith('/admin')
    }
    if (item.href === '/check-draft') {
      return pathname === '/check-draft' || pathname.startsWith('/check-draft')
    }
    return pathname === item.href
  }

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
          background: 'linear-gradient(90deg, #0033FF 0%, #3D5FFF 50%, #0028CC 100%)'
        }}
      />

      <div className="h-full px-6 flex items-center justify-between max-w-[1800px] mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold transition-all duration-200 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #3D5FFF 0%, #0033FF 50%, #0028CC 100%)',
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
            const Icon = iconMap[item.icon] || Home
            const active = isActive(item)
            const isHovered = hoveredItem === item.href
            const showTooltip = isHovered && !active

            return (
              <div key={item.href} className="relative">
                <Link
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    background: active
                      ? item.featured
                        ? 'linear-gradient(135deg, rgba(0, 51, 255, 0.25) 0%, rgba(59, 95, 255, 0.2) 100%)'
                        : 'linear-gradient(135deg, rgba(0, 51, 255, 0.2) 0%, rgba(0, 40, 204, 0.15) 100%)'
                      : item.featured && !isHovered
                        ? 'rgba(0, 51, 255, 0.1)'
                        : 'transparent',
                    color: active
                      ? '#a5b4fc'
                      : item.featured
                        ? '#c7d2fe'
                        : '#94a3b8',
                    border: active
                      ? '1px solid rgba(0, 51, 255, 0.3)'
                      : item.featured
                        ? '1px solid rgba(0, 51, 255, 0.2)'
                        : '1px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    setHoveredItem(item.href)
                    if (!active) {
                      e.currentTarget.style.background = item.featured
                        ? 'rgba(0, 51, 255, 0.15)'
                        : 'rgba(255, 255, 255, 0.05)'
                      e.currentTarget.style.color = '#d1d9ff'
                    }
                  }}
                  onMouseLeave={(e) => {
                    setHoveredItem(null)
                    if (!active) {
                      e.currentTarget.style.background = item.featured
                        ? 'rgba(0, 51, 255, 0.1)'
                        : 'transparent'
                      e.currentTarget.style.color = item.featured ? '#c7d2fe' : '#94a3b8'
                    }
                  }}
                  aria-label={item.tooltip}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {/* Badge for featured items */}
                  {item.badge && (
                    <span
                      className="ml-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>

                {/* Tooltip on hover */}
                {showTooltip && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-2 rounded-lg shadow-lg z-50 whitespace-nowrap pointer-events-none"
                    style={{
                      background: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(51, 65, 85, 0.5)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <div className="text-xs font-medium text-white mb-0.5">{item.description}</div>
                    <div className="text-[10px] text-slate-400">{item.tooltip}</div>
                    {/* Tooltip arrow */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 rotate-45"
                      style={{
                        background: 'rgba(15, 23, 42, 0.95)',
                        borderTop: '1px solid rgba(51, 65, 85, 0.5)',
                        borderLeft: '1px solid rgba(51, 65, 85, 0.5)',
                      }}
                    />
                  </div>
                )}
              </div>
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
