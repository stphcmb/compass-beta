'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  FolderOpen,
  Plus,
  Loader2,
  Clock,
  CheckCircle,
  Edit3,
  AlertCircle,
  Trash2,
  FileText,
  Mic,
  ArrowRight,
  Sparkles,
  MoreHorizontal,
  Play,
  Eye,
  ChevronLeft,
} from 'lucide-react'
import type { Project, ProjectStatus } from '@/lib/studio/types'

const STATUS_CONFIG: Record<ProjectStatus, {
  label: string
  color: string
  bgColor: string
  nextAction: string
  nextIcon: typeof Play
  nextHref: (id: string) => string
}> = {
  brief: {
    label: 'Brief Only',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    nextAction: 'Generate Draft',
    nextIcon: Sparkles,
    nextHref: (id) => `/studio/builder?project=${id}`,
  },
  draft: {
    label: 'Draft Ready',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    nextAction: 'Review & Edit',
    nextIcon: Edit3,
    nextHref: (id) => `/studio/editor?project=${id}`,
  },
  editing: {
    label: 'In Progress',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    nextAction: 'Continue',
    nextIcon: ArrowRight,
    nextHref: (id) => `/studio/editor?project=${id}`,
  },
  complete: {
    label: 'Complete',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    nextAction: 'View',
    nextIcon: Eye,
    nextHref: (id) => `/studio/editor?project=${id}`,
  },
}

const FORMAT_LABELS: Record<string, string> = {
  blog: 'Blog',
  linkedin: 'LinkedIn',
  memo: 'Memo',
  byline: 'Byline',
}

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/studio/projects')
        if (!res.ok) throw new Error('Failed to fetch projects')
        const data = await res.json()
        setProjects(data.projects || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects')
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  // Delete project
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project? This cannot be undone.')) return

    setDeletingId(id)
    setMenuOpenId(null)
    try {
      const res = await fetch(`/api/studio/projects/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setProjects(projects.filter(p => p.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  // Filter projects
  const filteredProjects = statusFilter === 'all'
    ? projects
    : projects.filter(p => p.status === statusFilter)

  // Stats
  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'editing' || p.status === 'draft').length,
    complete: projects.filter(p => p.status === 'complete').length,
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Back link */}
      <Link
        href="/studio"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-violet-600 mb-4 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Studio
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">All Projects</h1>
          <p className="text-sm text-gray-500 mt-1">
            {stats.total} total · {stats.inProgress} in progress · {stats.complete} complete
          </p>
        </div>

        <Link
          href="/studio/builder"
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {(['all', 'editing', 'draft', 'complete'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${statusFilter === status
                ? 'bg-violet-100 text-violet-700'
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            {status === 'all' ? 'All' : STATUS_CONFIG[status].label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-medium text-gray-900 mb-1">
            {statusFilter === 'all' ? 'No projects yet' : `No ${STATUS_CONFIG[statusFilter as ProjectStatus]?.label.toLowerCase()} projects`}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Create your first project to get started.
          </p>
          {statusFilter === 'all' && (
            <Link
              href="/studio/builder"
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              New Project
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {filteredProjects.map((project) => {
            const status = STATUS_CONFIG[project.status]
            const NextIcon = status.nextIcon
            const isDeleting = deletingId === project.id

            return (
              <div
                key={project.id}
                className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${isDeleting ? 'opacity-50' : ''}`}
              >
                {/* Status indicator */}
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  project.status === 'complete' ? 'bg-green-500' :
                  project.status === 'editing' ? 'bg-amber-500' :
                  project.status === 'draft' ? 'bg-blue-500' : 'bg-gray-300'
                }`} />

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={status.nextHref(project.id)}
                      className="font-medium text-gray-900 hover:text-violet-600 truncate"
                    >
                      {project.title || 'Untitled'}
                    </Link>
                    {project.voice_profile_id && (
                      <Mic className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className={`px-1.5 py-0.5 rounded ${status.bgColor} ${status.color} font-medium`}>
                      {status.label}
                    </span>
                    {project.format && (
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {FORMAT_LABELS[project.format] || project.format}
                      </span>
                    )}
                    {(project.word_count ?? 0) > 0 && (
                      <span>{project.word_count} words</span>
                    )}
                    {project.last_voice_check && (
                      <span className={`${
                        project.last_voice_check.score >= 80 ? 'text-green-600' :
                        project.last_voice_check.score >= 60 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        Voice: {project.last_voice_check.score}%
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(project.updated_at)}
                    </span>
                  </div>
                </div>

                {/* Next action button */}
                <Link
                  href={status.nextHref(project.id)}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex-shrink-0
                    ${project.status === 'complete'
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                    }
                  `}
                >
                  <NextIcon className="w-3.5 h-3.5" />
                  {status.nextAction}
                </Link>

                {/* Menu */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpenId(menuOpenId === project.id ? null : project.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  {menuOpenId === project.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setMenuOpenId(null)}
                      />
                      <div className="absolute right-0 top-8 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[100px]">
                        <button
                          onClick={() => handleDelete(project.id)}
                          disabled={isDeleting}
                          className="w-full px-3 py-1.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          {isDeleting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
