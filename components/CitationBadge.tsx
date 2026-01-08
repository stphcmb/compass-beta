'use client'

import React from 'react'
import { CheckCircle, XCircle, Clock, HelpCircle, Loader2 } from 'lucide-react'

export type CitationStatus = 'valid' | 'broken' | 'timeout' | 'unchecked' | 'checking' | null

interface CitationBadgeProps {
  status: CitationStatus
  lastChecked?: string | null
  showLabel?: boolean
  size?: 'sm' | 'md'
}

const statusConfig: Record<string, {
  label: string
  color: string
  bg: string
  icon: React.ReactNode
  tooltip: string
}> = {
  valid: {
    label: 'Verified',
    color: '#059669',
    bg: '#d1fae5',
    icon: <CheckCircle size={12} />,
    tooltip: 'Source link verified and accessible',
  },
  broken: {
    label: 'Broken',
    color: '#dc2626',
    bg: '#fee2e2',
    icon: <XCircle size={12} />,
    tooltip: 'Source link is not accessible',
  },
  timeout: {
    label: 'Timeout',
    color: '#d97706',
    bg: '#fef3c7',
    icon: <Clock size={12} />,
    tooltip: 'Source link timed out during check',
  },
  unchecked: {
    label: 'Unverified',
    color: '#6b7280',
    bg: '#f3f4f6',
    icon: <HelpCircle size={12} />,
    tooltip: 'Source link has not been verified yet',
  },
  checking: {
    label: 'Checking',
    color: '#3b82f6',
    bg: '#dbeafe',
    icon: <Loader2 size={12} className="animate-spin" />,
    tooltip: 'Verifying source link...',
  },
}

export function CitationBadge({
  status,
  lastChecked,
  showLabel = false,
  size = 'sm',
}: CitationBadgeProps) {
  const config = statusConfig[status || 'unchecked'] || statusConfig.unchecked

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const sizeStyles = size === 'sm'
    ? { padding: '2px 6px', fontSize: '10px', gap: '3px' }
    : { padding: '3px 8px', fontSize: '11px', gap: '4px' }

  return (
    <span
      title={`${config.tooltip}${lastChecked ? ` (Last checked: ${formatDate(lastChecked)})` : ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sizeStyles.gap,
        padding: sizeStyles.padding,
        borderRadius: '10px',
        backgroundColor: config.bg,
        color: config.color,
        fontSize: sizeStyles.fontSize,
        fontWeight: 600,
        lineHeight: 1,
        cursor: 'help',
        whiteSpace: 'nowrap',
      }}
    >
      {config.icon}
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}

// Hook to check citation status on demand
export function useCitationCheck() {
  const [checking, setChecking] = React.useState(false)

  const checkCitation = async (url: string, campAuthorId?: string) => {
    setChecking(true)
    try {
      const response = await fetch('/api/citations/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, campAuthorId }),
      })

      if (!response.ok) {
        throw new Error('Check failed')
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Citation check error:', error)
      return null
    } finally {
      setChecking(false)
    }
  }

  return { checkCitation, checking }
}
