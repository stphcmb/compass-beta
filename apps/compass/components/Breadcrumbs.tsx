'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { TERMINOLOGY } from '@/lib/constants/terminology'

/**
 * Breadcrumb item structure
 */
interface BreadcrumbItem {
  label: string
  href: string
  current?: boolean
}

/**
 * Route to label mapping with new terminology
 */
const routeLabels: Record<string, string> = {
  '/': 'Home',
  '/research-assistant': TERMINOLOGY.researchAssistant,
  '/browse': TERMINOLOGY.search,
  '/history': TERMINOLOGY.history,
  '/authors': TERMINOLOGY.authors,
  '/admin': 'Admin',
  '/results': 'Results',
}

/**
 * Generate breadcrumb items from pathname
 */
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  // Always start with Home
  breadcrumbs.push({
    label: 'Home',
    href: '/',
    current: pathname === '/',
  })

  // Build path progressively
  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1

    // Check if this is a known route
    const label = routeLabels[currentPath]

    if (label) {
      breadcrumbs.push({
        label,
        href: currentPath,
        current: isLast,
      })
    } else {
      // Handle dynamic segments (e.g., author ID, result ID)
      // For now, just use the segment as-is with capitalization
      // In a real app, you might want to fetch the actual name
      const formattedSegment = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      breadcrumbs.push({
        label: formattedSegment,
        href: currentPath,
        current: isLast,
      })
    }
  })

  return breadcrumbs
}

interface BreadcrumbsProps {
  /**
   * Custom items to override auto-generation
   */
  items?: BreadcrumbItem[]
  /**
   * Additional CSS class names
   */
  className?: string
  /**
   * Show home icon instead of text for first item
   */
  showHomeIcon?: boolean
}

/**
 * Breadcrumbs component for navigation context
 *
 * Automatically generates breadcrumbs from the current path,
 * or accepts custom items for more control.
 *
 * @example
 * // Auto-generated from current path
 * <Breadcrumbs />
 *
 * @example
 * // Custom items
 * <Breadcrumbs items={[
 *   { label: 'Home', href: '/' },
 *   { label: 'Authors', href: '/authors' },
 *   { label: 'John Doe', href: '/authors/john-doe', current: true },
 * ]} />
 */
export default function Breadcrumbs({
  items,
  className = '',
  showHomeIcon = true,
}: BreadcrumbsProps) {
  const pathname = usePathname()
  const breadcrumbs = items || generateBreadcrumbs(pathname)

  // Don't show breadcrumbs on home page or if only one item
  if (pathname === '/' || breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-sm ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1">
        {breadcrumbs.map((item, index) => {
          const isFirst = index === 0
          const isLast = index === breadcrumbs.length - 1

          return (
            <li key={item.href} className="flex items-center">
              {/* Separator (except for first item) */}
              {!isFirst && (
                <ChevronRight
                  className="w-4 h-4 mx-1 flex-shrink-0"
                  style={{ color: 'var(--color-mid-gray)' }}
                  aria-hidden="true"
                />
              )}

              {/* Breadcrumb link or current page */}
              {item.current ? (
                <span
                  className="font-medium truncate max-w-[200px] sm:max-w-none"
                  style={{ color: 'var(--color-quantum-navy)' }}
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center gap-1 transition-colors duration-150 hover:underline truncate max-w-[150px] sm:max-w-none"
                  style={{ color: 'var(--color-mid-gray)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-velocity-blue)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-mid-gray)'
                  }}
                >
                  {isFirst && showHomeIcon ? (
                    <Home className="w-4 h-4" aria-label="Home" />
                  ) : (
                    item.label
                  )}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/**
 * Hook to get current breadcrumb items
 * Useful for components that need breadcrumb data without rendering
 */
export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname()
  return generateBreadcrumbs(pathname)
}
