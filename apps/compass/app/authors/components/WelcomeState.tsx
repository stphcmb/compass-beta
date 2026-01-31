'use client'

import { getDomainConfig, DOMAIN_LABEL_STYLES } from '@/lib/constants/domains'

interface Author {
  id: string
  name: string
  header_affiliation?: string
  primary_affiliation?: string
  notes?: string
  created_at?: string
}

interface WelcomeStateProps {
  favoriteAuthors: Author[]
  totalFavorites: number
  recentAddedAuthors: Author[]
  totalRecent: number
  onAuthorClick: (authorId: string) => void
  onShowAllFavorites: () => void
  onShowAllRecent: () => void
  getAuthorDomains: (authorId: string) => string[]
  getAuthorCamps: (authorId: string) => string[]
}

// Extracted AuthorCard for reuse and potential further optimization
function AuthorCard({
  author,
  domains,
  camps,
  onClick
}: {
  author: Author
  domains: string[]
  camps: string[]
  onClick: () => void
}) {
  const stance = camps[0]

  return (
    <button
      onClick={onClick}
      style={{
        padding: '16px 20px',
        borderRadius: '10px',
        border: '1px solid var(--color-light-gray)',
        backgroundColor: 'var(--color-air-white)',
        cursor: 'pointer',
        transition: 'all 180ms cubic-bezier(0.4, 0, 0.2, 1)',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '140px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#059669'
        e.currentTarget.style.backgroundColor = '#f0fdf4'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-light-gray)'
        e.currentTarget.style.backgroundColor = 'var(--color-air-white)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{
        fontSize: '16px',
        fontWeight: 600,
        color: 'var(--color-soft-black)',
        lineHeight: 1.3,
        marginBottom: '6px'
      }}>
        {author.name}
      </div>

      <div style={{ marginBottom: '8px' }}>
        {(author.header_affiliation || author.primary_affiliation) && (
          <div style={{
            fontSize: '12px',
            color: 'var(--color-mid-gray)',
            lineHeight: 1.4,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            marginBottom: '6px'
          }}>
            {[author.header_affiliation, author.primary_affiliation].filter(Boolean).join(' at ')}
          </div>
        )}

        {author.notes && (
          <div style={{
            fontSize: '12px',
            color: '#374151',
            lineHeight: 1.5,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            marginBottom: '8px'
          }}>
            {author.notes}
          </div>
        )}

        {stance && (
          <div style={{
            fontSize: '11px',
            color: '#059669',
            fontWeight: 500,
            backgroundColor: '#d1fae5',
            padding: '3px 10px',
            borderRadius: '4px',
            display: 'inline-block',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginBottom: '8px'
          }}>
            {stance}
          </div>
        )}
      </div>

      {domains.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          marginTop: 'auto'
        }}>
          {domains.slice(0, 3).map(domain => {
            const config = getDomainConfig(domain)
            return (
              <span
                key={domain}
                style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  color: DOMAIN_LABEL_STYLES.subdued.text,
                  backgroundColor: DOMAIN_LABEL_STYLES.subdued.bg,
                  padding: '3px 8px',
                  borderRadius: '5px',
                  whiteSpace: 'nowrap'
                }}
              >
                {config.shortName}
              </span>
            )
          })}
          {domains.length > 3 && (
            <span style={{
              fontSize: '10px',
              fontWeight: 500,
              color: 'var(--color-mid-gray)',
              padding: '3px 8px'
            }}>
              +{domains.length - 3}
            </span>
          )}
        </div>
      )}
    </button>
  )
}

export default function WelcomeState({
  favoriteAuthors,
  totalFavorites,
  recentAddedAuthors,
  totalRecent,
  onAuthorClick,
  onShowAllFavorites,
  onShowAllRecent,
  getAuthorDomains,
  getAuthorCamps
}: WelcomeStateProps) {
  return (
    <div
      className="bg-gradient-to-br from-emerald-50 via-white to-teal-50"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 32px'
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px', minHeight: 0, padding: '8px 0' }}>
        {/* Favorites section */}
        {favoriteAuthors.length > 0 && (
          <div>
            <div style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#f59e0b',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              paddingBottom: '8px',
              borderBottom: '2px solid #fef3c7'
            }}>
              <span style={{ fontSize: '16px' }}>★</span> Your Favorites ({totalFavorites})
              {totalFavorites > 8 && (
                <button
                  onClick={onShowAllFavorites}
                  style={{
                    fontWeight: 500,
                    fontSize: '10px',
                    color: '#92400e',
                    backgroundColor: '#fef3c7',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    marginLeft: '4px',
                    border: '1px solid #fcd34d',
                    cursor: 'pointer',
                    transition: 'all 150ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fde68a'
                    e.currentTarget.style.borderColor = '#f59e0b'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef3c7'
                    e.currentTarget.style.borderColor = '#fcd34d'
                  }}
                >
                  View all →
                </button>
              )}
            </div>
            {/* Horizontal scroll container */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                overflowX: 'auto',
                paddingBottom: '8px',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'thin',
                scrollbarColor: '#fcd34d #fef3c7'
              }}
              className="scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-amber-50"
            >
              {favoriteAuthors.map((author) => (
                <div key={author.id} style={{ flexShrink: 0, width: '280px', scrollSnapAlign: 'start' }}>
                  <AuthorCard
                    author={author}
                    domains={getAuthorDomains(author.id)}
                    camps={getAuthorCamps(author.id)}
                    onClick={() => onAuthorClick(author.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent authors section */}
        {recentAddedAuthors.length > 0 && (
          <div>
            <div style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#059669',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              paddingBottom: '8px',
              borderBottom: '2px solid #d1fae5'
            }}>
              <span style={{ fontSize: '16px' }}>✦</span> Recently Added
              {totalRecent > 8 && (
                <button
                  onClick={onShowAllRecent}
                  style={{
                    fontWeight: 500,
                    fontSize: '10px',
                    color: '#047857',
                    backgroundColor: '#d1fae5',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    marginLeft: '4px',
                    border: '1px solid #6ee7b7',
                    cursor: 'pointer',
                    transition: 'all 150ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#a7f3d0'
                    e.currentTarget.style.borderColor = '#059669'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#d1fae5'
                    e.currentTarget.style.borderColor = '#6ee7b7'
                  }}
                >
                  View all →
                </button>
              )}
            </div>
            {/* Horizontal scroll container */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                overflowX: 'auto',
                paddingBottom: '8px',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'thin',
                scrollbarColor: '#6ee7b7 #d1fae5'
              }}
              className="scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-emerald-50"
            >
              {recentAddedAuthors.map((author) => (
                <div key={author.id} style={{ flexShrink: 0, width: '280px', scrollSnapAlign: 'start' }}>
                  <AuthorCard
                    author={author}
                    domains={getAuthorDomains(author.id)}
                    camps={getAuthorCamps(author.id)}
                    onClick={() => onAuthorClick(author.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state when no favorites or recent */}
        {favoriteAuthors.length === 0 && recentAddedAuthors.length === 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 24px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              👋
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--color-soft-black)',
              marginBottom: '8px'
            }}>
              Welcome to Thought Leaders
            </div>
            <div style={{
              fontSize: '14px',
              color: 'var(--color-mid-gray)',
              maxWidth: '300px'
            }}>
              Select an author from the sidebar to view their profile, stances, and sources.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
