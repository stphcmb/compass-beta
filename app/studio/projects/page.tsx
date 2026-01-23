'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FolderOpen,
  FileText,
  Plus,
  Loader2,
  Clock,
  CheckCircle,
  Edit3,
  AlertCircle,
  Trash2,
  MoreVertical,
  Mic,
} from 'lucide-react'
import type { Project, ProjectStatus } from '@/lib/studio/types'

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; icon: typeof FileText }> = {
  brief: { label: 'Brief', color: 'text-gray-500 bg-gray-100', icon: FileText },
  draft: { label: 'Draft', color: 'text-blue-600 bg-blue-100', icon: Edit3 },
  editing: { label: 'Editing', color: 'text-amber-600 bg-amber-100', icon: Edit3 },
  complete: { label: 'Complete', color: 'text-green-600 bg-green-100', icon: CheckCircle },
}

const FORMAT_LABELS: Record<string, string> = {
  blog: 'Blog Post',
  linkedin: 'LinkedIn',
  memo: 'Memo',
  byline: 'Byline',
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

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
    if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      return
    }

    setDeletingId(id)
    try {
      const res = await fetch(`/api/studio/projects/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete project')
      setProjects(projects.filter(p => p.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete project')
    } finally {
      setDeletingId(null)
    }
  }

  // Filter projects
  const filteredProjects = statusFilter === 'all'
    ? projects
    : projects.filter(p => p.status === statusFilter)

  // Group by status for stats
  const statusCounts = {
    all: projects.length,
    brief: projects.filter(p => p.status === 'brief').length,
    draft: projects.filter(p => p.status === 'draft').length,
    editing: projects.filter(p => p.status === 'editing').length,
    complete: projects.filter(p => p.status === 'complete').length,
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">My Projects</h1>
            <p className="text-sm text-gray-500">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            </p>
          </div>
        </div>

        <Link
          href="/studio/builder"
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'draft', 'editing', 'complete'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${statusFilter === status
                ? 'bg-violet-100 text-violet-700'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }
            `}
          >
            {status === 'all' ? 'All' : STATUS_CONFIG[status].label}
            <span className="ml-1.5 text-xs opacity-70">
              ({statusCounts[status]})
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-600">{error}</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {statusFilter === 'all' ? 'No projects yet' : `No ${STATUS_CONFIG[statusFilter as ProjectStatus]?.label.toLowerCase()} projects`}
          </h3>
          <p className="text-gray-500 mb-6">
            {statusFilter === 'all'
              ? 'Start creating content by adding a new project.'
              : 'Projects with this status will appear here.'}
          </p>
          {statusFilter === 'all' && (
            <Link
              href="/studio/builder"
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Your First Project
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={() => handleDelete(project.id)}
              deleting={deletingId === project.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ProjectCard({
  project,
  onDelete,
  deleting,
}: {
  project: Project
  onDelete: () => void
  deleting: boolean
}) {
  const [showMenu, setShowMenu] = useState(false)
  const status = STATUS_CONFIG[project.status]
  const StatusIcon = status.icon

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
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors group">
      <Link
        href={`/studio/editor?project=${project.id}`}
        className="block p-5"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
            <span className="flex items-center gap-1">
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </span>
          </div>
          <div
            className="relative"
            onClick={(e) => e.preventDefault()}
          >
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-6 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px]">
                  <button
                    onClick={() => {
                      setShowMenu(false)
                      onDelete()
                    }}
                    disabled={deleting}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    {deleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
          {project.title || 'Untitled Project'}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
          {project.format && (
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              {FORMAT_LABELS[project.format] || project.format}
            </span>
          )}
          {project.word_count && project.word_count > 0 && (
            <span>{project.word_count} words</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            {formatDate(project.updated_at)}
          </div>
          {project.voice_profile_id && (
            <div className="flex items-center gap-1 text-xs text-violet-500">
              <Mic className="w-3.5 h-3.5" />
              Voice
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
