'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { Compass, Users, Sparkles, Home } from 'lucide-react'
import { TERMINOLOGY } from '@/lib/constants/terminology'

interface HeaderProps {
  sidebarCollapsed?: boolean
}

export default function Header({ sidebarCollapsed = false }: HeaderProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home', icon: Home, tooltip: 'Go to homepage' },
    { href: '/ai-editor', label: TERMINOLOGY.aiEditor, icon: Sparkles, tooltip: 'Get editorial feedback on your writing from diverse perspectives' },
    { href: '/explore', label: TERMINOLOGY.search, icon: Compass, tooltip: `Browse ${TERMINOLOGY.camps.toLowerCase()} and positions on AI discourse` },
    { href: '/authors', label: TERMINOLOGY.authors, icon: Users, tooltip: 'Browse thought leaders and their viewpoints' },
  ]

  return (
    <header
      className="fixed top-0 right-0 h-16 bg-white border-b border-gray-200 z-10 transition-all duration-300"
      style={{
        left: sidebarCollapsed ? '0' : '256px'
      }}
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
          Compass
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href ||
                  (item.href === '/authors' && pathname.startsWith('/author/')) ||
                  (item.href === '/explore' && pathname === '/results')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
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
              avatarBox: 'w-9 h-9',
              userButtonPopoverCard: 'shadow-lg',
            }
          }}
        />
      </div>
    </header>
  )
}
