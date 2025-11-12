import Sidebar from '@/components/Sidebar'
import AuthorProfile from '@/components/AuthorProfile'
import SourcesList from '@/components/SourcesList'

export default function AuthorDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <AuthorProfile authorId={params.id} />
          <SourcesList authorId={params.id} />
        </div>
      </main>
    </div>
  )
}

