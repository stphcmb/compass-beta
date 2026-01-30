'use client'

import { Star, Users } from 'lucide-react'

export interface MiniAuthorCardProps {
  name: string
  affiliation?: string
  isFavorite: boolean
  note?: string
  onClick: () => void
  viewMode?: 'grid' | 'list'
}

export function MiniAuthorCard({
  name,
  affiliation,
  isFavorite,
  note,
  onClick,
  viewMode = 'grid'
}: MiniAuthorCardProps) {
  // List View - Compact row layout
  if (viewMode === 'list') {
    return (
      <div
        onClick={onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 12px',
          borderBottom: '1px solid #f3f4f6',
          background: '#ffffff',
          cursor: 'pointer',
          transition: 'background 0.12s ease-out',
          minHeight: '48px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#f0f9ff'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#ffffff'
        }}
      >
        {/* Avatar */}
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          marginRight: '12px',
          background: isFavorite
            ? 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%)'
            : 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {isFavorite ? (
            <Star size={14} style={{ color: '#f59e0b' }} />
          ) : (
            <Users size={14} style={{ color: '#6366f1' }} />
          )}
        </div>

        {/* Name */}
        <div style={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#1f2937',
          flexShrink: 0,
          minWidth: '150px'
        }}>
          {name}
        </div>

        {/* Affiliation - flex-1 */}
        <div style={{
          flex: 1,
          fontSize: '12px',
          color: '#6b7280',
          marginLeft: '12px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0
        }}>
          {affiliation || '—'}
        </div>

        {/* Favorite badge */}
        {isFavorite && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 6px',
            marginLeft: '12px',
            borderRadius: '4px',
            background: '#fef3c7',
            color: '#f59e0b',
            fontSize: '11px',
            fontWeight: 600,
            flexShrink: 0
          }}>
            <Star size={10} style={{ fill: '#f59e0b' }} />
            Favorite
          </div>
        )}

        {/* Note indicator */}
        {note && (
          <div style={{
            padding: '2px 6px',
            marginLeft: '8px',
            borderRadius: '4px',
            background: '#e0f2fe',
            color: '#0284c7',
            fontSize: '11px',
            fontWeight: 600,
            flexShrink: 0
          }}>
            Note
          </div>
        )}
      </div>
    )
  }

  // Grid View - Card layout (default)
  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        background: 'white',
        cursor: 'pointer',
        transition: 'all 0.12s ease-out'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#059669'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(5, 150, 105, 0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e7eb'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: isFavorite
            ? 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%)'
            : 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {isFavorite ? (
            <Star size={14} style={{ color: '#f59e0b' }} />
          ) : (
            <Users size={14} style={{ color: '#6366f1' }} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <div style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#1f2937',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {name}
            </div>
            {isFavorite && (
              <Star size={12} style={{ color: '#f59e0b', flexShrink: 0 }} />
            )}
          </div>
          {affiliation && (
            <div style={{
              fontSize: '12px',
              color: '#9ca3af',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {affiliation}
            </div>
          )}
          {note && (
            <div style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '8px',
              padding: '8px',
              background: '#f9fafb',
              borderRadius: '4px',
              borderLeft: '2px solid #10b981',
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {note}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
