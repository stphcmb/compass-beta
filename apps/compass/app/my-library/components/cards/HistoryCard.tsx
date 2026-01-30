'use client'

import { useState } from 'react'
import { ChevronRight, MessageSquare, Edit3, X, Check } from 'lucide-react'

export interface HistoryCardProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  meta?: string
  note?: string
  onClick: () => void
  onDelete: () => void
  onUpdateNote?: (note: string) => void
  color: string
  saved?: boolean
}

export function HistoryCard({
  icon,
  title,
  subtitle,
  meta,
  note,
  onClick,
  onDelete,
  onUpdateNote,
  color,
  saved
}: HistoryCardProps) {
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [noteText, setNoteText] = useState(note || '')

  const handleSaveNote = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onUpdateNote) {
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
        borderRadius: '8px',
        border: '1px solid #f3f4f6',
        background: '#fafafa',
        transition: 'all 0.2s',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color
        e.currentTarget.style.background = 'white'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#f3f4f6'
        e.currentTarget.style.background = '#fafafa'
      }}
    >
      {/* Main row */}
      <div
        onClick={onClick}
        style={{
          padding: '12px 16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: '500',
            color: '#1f2937',
            fontSize: '13px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {title}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '4px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '11px', color: '#6b7280' }}>
              {subtitle}
            </span>
            {meta && (
              <>
                <span style={{ fontSize: '11px', color: '#d1d5db' }}>•</span>
                <span style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: `${color}10`,
                  color: color
                }}>
                  {meta}
                </span>
              </>
            )}
            {saved && (
              <span style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                background: '#dcfce7',
                color: '#16a34a'
              }}>
                Saved
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
        {/* Add/Edit Note Button */}
        {onUpdateNote && (
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
              color: note ? '#4f46e5' : '#6b7280',
              transition: 'all 0.2s'
            }}
            title={note ? 'Edit note' : 'Add note'}
          >
            {note ? <Edit3 size={14} /> : <MessageSquare size={14} />}
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          style={{
            padding: '6px',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: '#d1d5db',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ef4444'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#d1d5db'
          }}
        >
          <X size={14} />
        </button>
        <ChevronRight size={16} style={{ color: '#d1d5db', flexShrink: 0 }} />
      </div>

      {/* Note display (when not editing) */}
      {note && !isEditingNote && (
        <div style={{
          padding: '8px 16px 12px 60px',
          borderTop: '1px solid #f3f4f6'
        }}>
          <p style={{
            fontSize: '12px',
            color: '#6b7280',
            margin: 0,
            fontStyle: 'italic',
            lineHeight: '1.4'
          }}>
            &quot;{note}&quot;
          </p>
        </div>
      )}

      {/* Note editor */}
      {isEditingNote && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            padding: '12px 16px',
            borderTop: '1px solid #e0e7ff',
            background: '#f5f3ff'
          }}
        >
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add your note here..."
            autoFocus
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #c7d2fe',
              fontSize: '13px',
              lineHeight: '1.4',
              resize: 'none',
              minHeight: '60px',
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
