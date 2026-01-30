'use client'

import { useEffect, useRef } from 'react'
import {
  Trash2,
  X,
  Star,
  Search,
  Sparkles,
  MessageSquare,
  ArrowLeft
} from 'lucide-react'
import type { DeletedItem } from '../../lib/types'

export interface RecentlyDeletedModalProps {
  items: DeletedItem[]
  onRestore: (item: DeletedItem) => void
  onDelete: (id: string) => void
  onClearAll: () => void
  onClose: () => void
  timeAgo: (ts: string) => string
}

export function RecentlyDeletedModal({
  items,
  onRestore,
  onDelete,
  onClearAll,
  onClose,
  timeAgo
}: RecentlyDeletedModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Focus trap and keyboard handling
  useEffect(() => {
    closeButtonRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="deleted-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
      />

      <div
        style={{
          position: 'relative',
          maxWidth: '480px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close dialog"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            padding: '8px',
            background: 'rgba(0, 0, 0, 0.05)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#64748b',
            zIndex: 10,
            outline: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = '0 0 0 2px #6366f1'
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <X size={20} />
        </button>

        <div style={{
          padding: '24px 24px 16px',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(to right, #fef2f2, #fff7ed)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Trash2 size={20} style={{ color: '#ef4444' }} />
            <h2 id="deleted-modal-title" style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              Recently Deleted
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
            Items deleted in the last 30 days. Restore them before they're permanently removed.
          </p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {items.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: '#6b7280' }}>
              <Trash2 size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: '14px' }}>No recently deleted items</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {items.map(item => (
                <div
                  key={item.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #f3f4f6',
                    background: '#fafafa',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: item.type === 'favorite' ? '#fef3c7' : item.type === 'search' ? '#dbeafe' : item.type === 'analysis' ? '#ede9fe' : '#e0e7ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {item.type === 'favorite' ? (
                      <Star size={16} style={{ color: '#f59e0b' }} />
                    ) : item.type === 'search' ? (
                      <Search size={16} style={{ color: '#3b82f6' }} />
                    ) : item.type === 'analysis' ? (
                      <Sparkles size={16} style={{ color: '#8b5cf6' }} />
                    ) : (
                      <MessageSquare size={16} style={{ color: '#6366f1' }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        textTransform: 'uppercase',
                        fontSize: '10px',
                        fontWeight: 600,
                        color: item.type === 'favorite' ? '#d97706' : item.type === 'search' ? '#2563eb' : item.type === 'analysis' ? '#7c3aed' : '#6366f1'
                      }}>
                        {item.type === 'favorite' ? 'Favorite' : item.type === 'search' ? (item.data?.wasSaved ? 'Saved Search' : 'Recent Search') : item.type === 'analysis' ? 'Analysis' : 'Note'}
                      </span>
                      <span>·</span>
                      <span>Deleted {timeAgo(item.deletedAt)}</span>
                    </div>
                    {item.type === 'note' && item.data?.note && (
                      <div style={{
                        fontSize: '11px',
                        color: '#6b7280',
                        marginTop: '4px',
                        fontStyle: 'italic',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        "{item.data.note}"
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => onRestore(item)}
                      aria-label={`Restore ${item.name}`}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#10b981',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 0 2px white, 0 0 0 4px #10b981'
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                      title="Restore"
                    >
                      <ArrowLeft size={12} />
                      Restore
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      aria-label={`Permanently delete ${item.name}`}
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#fee2e2',
                        color: '#dc2626',
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 0 2px white, 0 0 0 4px #dc2626'
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                      title="Delete permanently"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          display: 'flex',
          gap: '8px'
        }}>
          {items.length > 0 && (
            <button
              onClick={onClearAll}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 2px white, 0 0 0 4px #dc2626'
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Delete All Permanently
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 2px white, 0 0 0 4px #6366f1'
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
