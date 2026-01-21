'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { UserButton, useUser } from '@clerk/nextjs'
import { Compass, Users, Home, History, Sparkles, Shield } from 'lucide-react'
import { TERMINOLOGY } from '@/lib/constants/terminology'

// Admin email whitelist
const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS
  ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase())
  : [
    'huongnguyen@anduintransact.com',
    'ngthaohuong@gmail.com',
  ]

interface HeaderProps {
  sidebarCollapsed?: boolean
}

export default function Header({ sidebarCollapsed = false }: HeaderProps) {
  const pathname = usePathname()
  const { user, isLoaded } = useUser()

  // Check if current user is an admin
  const isAdmin = isLoaded && user?.emailAddresses?.some(
    email => ADMIN_EMAILS.includes(email.emailAddress.toLowerCase())
  )

  const navItems = [
    { href: '/', label: 'Home', icon: Home, tooltip: 'Go to homepage' },
    { href: '/ai-editor', label: 'AI Editor', icon: Sparkles, tooltip: 'Refine your writing with AI-powered insights' },
    // Voice Lab temporarily hidden - access via /voice-lab directly
    // { href: '/voice-lab', label: 'Voice Lab', icon: Mic, tooltip: 'Capture and apply writing styles' },
    { href: '/explore', label: TERMINOLOGY.search, icon: Compass, tooltip: `Browse ${TERMINOLOGY.camps.toLowerCase()} and positions on AI discourse` },
    { href: '/authors', label: TERMINOLOGY.authors, icon: Users, tooltip: 'Browse thought leaders and their viewpoints' },
    { href: '/history', label: 'History', icon: History, tooltip: 'View your search history, saved analyses, and favorite authors' },
    // Admin link - only added to array if user is admin
    ...(isAdmin ? [{ href: '/admin', label: 'Admin', icon: Shield, tooltip: 'Admin dashboard' }] : []),
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
            const Icon = item.icon
            const isActive = pathname === item.href ||
                  (item.href === '/authors' && pathname.startsWith('/authors/')) ||
                  (item.href === '/explore' && pathname === '/results') ||
                  (item.href === '/history' && pathname.startsWith('/history')) ||
                  (item.href === '/admin' && pathname.startsWith('/admin'))
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
