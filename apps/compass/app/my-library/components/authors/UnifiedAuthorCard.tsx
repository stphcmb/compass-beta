'use client'

import { useState } from 'react'
import {
  Star,
  Users,
  MessageSquare,
  Edit3,
  Trash2,
  ChevronRight,
  Check
} from 'lucide-react'

export interface UnifiedAuthorCardProps {
  name: string
  affiliation?: string
  isFavorite: boolean
  note?: string
  timestamp: string
  onClick: () => void
  onToggleFavorite: () => void
  onDeleteNote: () => void
  onUpdateNote: (note: string) => void
  timeAgo: (ts: string) => string
}

export function UnifiedAuthorCard({
  name,
  affiliation,
  isFavorite,
  note,
  timestamp,
  onClick,
  onToggleFavorite,
  onDeleteNote,
  onUpdateNote,
  timeAgo
}: UnifiedAuthorCardProps) {
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [noteText, setNoteText] = useState(note || '')

  const handleSaveNote = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (noteText.trim()) {
      onUpdateNote(noteText)
    }
    setIsEditingNote(false)
  }

  const handleCancelNote = (e: React.MouseEvent) => {
    e.stopPropagation()
    setNoteText(note || '')
    setIsEditingNote(false)
  }

  return (
    <div
      style={{
        borderRadius: '10px',
        border: '1px solid #e5e7eb',
        background: 'white',
        overflow: 'hidden',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#6366f1'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e7eb'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Header */}
      <div
        onClick={onClick}
        style={{
          padding: '14px 16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: note || isEditingNote ? '1px solid #f3f4f6' : 'none'
        }}
      >
        <div style={{
          width: '40px',
          height: '40px',
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
            <Star size={18} style={{ color: '#f59e0b' }} />
          ) : (
            <Users size={18} style={{ color: '#6366f1' }} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>
            {name}
          </div>
          {affiliation && (
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
              {affiliation}
            </div>
          )}
          <div style={{
            fontSize: '11px',
            color: '#6b7280',
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <span>{timeAgo(timestamp)}</span>
            {isFavorite && (
              <span style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                background: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Star size={10} />
                Favorite
              </span>
            )}
            {note && !isEditingNote && (
              <span style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                background: '#e0e7ff',
                color: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <MessageSquare size={10} />
                Note
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite()
          }}
          style={{
            padding: '6px',
            borderRadius: '6px',
            border: 'none',
            background: isFavorite ? '#fef3c7' : 'transparent',
            cursor: 'pointer',
            color: isFavorite ? '#f59e0b' : '#6b7280',
            transition: 'all 0.2s'
          }}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star size={16} style={{ fill: isFavorite ? '#f59e0b' : 'none' }} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsEditingNote(true)
          }}
          style={{
            padding: '6px',
            borderRadius: '6px',
            border: 'none',
            background: note ? '#e0e7ff' : 'transparent',
            cursor: 'pointer',
            color: note ? '#6366f1' : '#6b7280',
            transition: 'all 0.2s'
          }}
          title={note ? 'Edit note' : 'Add note'}
        >
          {note ? <Edit3 size={14} /> : <MessageSquare size={14} />}
        </button>
        {note && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDeleteNote()
            }}
            style={{
              padding: '6px',
              borderRadius: '6px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#6b7280'
            }}
            title="Delete note"
          >
            <Trash2 size={14} />
          </button>
        )}
        <ChevronRight size={16} style={{ color: '#d1d5db', flexShrink: 0 }} />
      </div>

      {/* Note display (when not editing) */}
      {note && !isEditingNote && (
        <div
          onClick={onClick}
          style={{
            padding: '10px 16px 12px 68px',
            background: '#fafafa',
            cursor: 'pointer'
          }}
        >
          <p style={{
            fontSize: '12px',
            color: '#6b7280',
            margin: 0,
            fontStyle: 'italic',
            lineHeight: '1.4'
          }}>
            "{note}"
          </p>
        </div>
      )}

      {/* Note editor */}
      {isEditingNote && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            padding: '12px 16px',
            background: '#f5f3ff'
          }}
        >
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add your note about this author..."
            autoFocus
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #c7d2fe',
              fontSize: '13px',
              lineHeight: '1.5',
              resize: 'none',
              minHeight: '80px',
              outline: 'none',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#6366f1'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#c7d2fe'
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
            marginTop: '8px'
          }}>
            <button
              onClick={handleCancelNote}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                background: 'white',
                color: '#6b7280',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNote}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: '#6366f1',
                color: 'white',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Check size={12} />
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
