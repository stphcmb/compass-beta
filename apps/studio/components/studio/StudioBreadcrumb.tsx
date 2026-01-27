'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface StudioBreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

/**
 * Breadcrumb navigation for Studio pages
 * Shows user's location in workflow: Studio > Projects > [Project Title] > Editing
 */
export default function StudioBreadcrumb({ items, className = '' }: StudioBreadcrumbProps) {
  // Always start with Studio as root
  const allItems: BreadcrumbItem[] = [
    { label: 'Studio', href: '/studio' },
    ...items,
  ]

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1 text-sm ${className}`}
    >
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1
        const isFirst = index === 0

        return (
          <div key={index} className="flex items-center gap-1">
            {isFirst && (
              <Home className="w-3.5 h-3.5 text-gray-400 mr-0.5" />
            )}

            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-violet-600 transition-colors truncate max-w-[150px]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`truncate max-w-[200px] ${
                  isLast
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            )}

            {!isLast && (
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
            )}
          </div>
        )
      })}
    </nav>
  )
}
