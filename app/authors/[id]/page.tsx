import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import AuthorProfile from '@/components/AuthorProfile'
import SourcesList from '@/components/SourcesList'

export default async function AuthorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bone)' }}>
      <Sidebar />
      <Header />
      <main
        className="flex-1 ml-64 mt-16 relative"
        style={{ minHeight: 'calc(100vh - 64px)' }}
      >
        {/* Subtle decorative gradient at top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '300px',
            background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.03) 0%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        {/* Decorative orb */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.04) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        <div
          className="relative z-10"
          style={{
            padding: 'var(--space-8)',
            paddingTop: 'var(--space-10)'
          }}
        >
          <div className="max-w-4xl mx-auto">
            <AuthorProfile authorId={id} />
            <SourcesList authorId={id} />
          </div>
        </div>
      </main>
    </div>
  )
}
