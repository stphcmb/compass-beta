import { Star } from 'lucide-react'

interface SavedBadgeProps {
  saved?: boolean
  variant?: 'small' | 'medium' | 'large'
  showLabel?: boolean
}

export default function SavedBadge({
  saved = false,
  variant = 'medium',
  showLabel = false,
}: SavedBadgeProps) {
  if (!saved) return null

  const sizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5',
  }

  const badgeClasses = {
    small: 'px-1.5 py-0.5 text-xs',
    medium: 'px-2 py-1 text-sm',
    large: 'px-2.5 py-1.5 text-base',
  }

  if (showLabel) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 ${badgeClasses[variant]} bg-yellow-100 text-yellow-800 rounded-full font-medium`}
      >
        <Star className={`${sizeClasses[variant]} fill-yellow-500 text-yellow-500`} />
        Saved
      </span>
    )
  }

  return (
    <Star
      className={`${sizeClasses[variant]} fill-yellow-500 text-yellow-500`}
      aria-label="Saved item"
    />
  )
}
