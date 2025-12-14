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
    <div className="flex min-h-screen">
      <Sidebar />
      <Header />
      <main className="flex-1 ml-64 mt-16 p-8">
        <div className="max-w-6xl mx-auto">
          <AuthorProfile authorId={id} />
          <SourcesList authorId={id} />
        </div>
      </main>
    </div>
  )
}

