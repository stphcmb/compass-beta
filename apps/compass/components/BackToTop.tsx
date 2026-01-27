'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronUp } from 'lucide-react'

interface BackToTopProps {
  containerRef?: React.RefObject<HTMLElement>
}

export default function BackToTop({ containerRef }: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false)
  const scrollCountRef = useRef(0)
  const lastScrollTopRef = useRef(0)
  const scrollThresholdRef = useRef(50) // Minimum scroll distance to count as a scroll action

  useEffect(() => {
    const container = containerRef?.current

    const handleScroll = () => {
      const scrollTop = container?.scrollTop || window.scrollY

      // Calculate scroll distance from last position
      const scrollDistance = Math.abs(scrollTop - lastScrollTopRef.current)

      // Only count as a scroll action if moved more than threshold
      if (scrollDistance > scrollThresholdRef.current) {
        scrollCountRef.current += 1
        lastScrollTopRef.current = scrollTop
      }

      // Show button after 3 scroll actions AND scrolled down at least 300px
      if (scrollCountRef.current >= 3 && scrollTop > 300) {
        setIsVisible(true)
      } else if (scrollTop <= 100) {
        // Hide and reset when near top
        setIsVisible(false)
        scrollCountRef.current = 0
        lastScrollTopRef.current = 0
      }
    }

    // Add scroll event listener to container or window
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    } else {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [containerRef])

  const scrollToTop = () => {
    const container = containerRef?.current
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label="Back to top"
          title="Back to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </>
  )
}
