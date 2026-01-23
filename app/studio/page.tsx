'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Plus,
  Loader2,
  Clock,
  AlertCircle,
  FileText,
  Mic,
  ArrowRight,
  Sparkles,
  ChevronRight,
  PenTool,
  X,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react'
import type { Project, ProjectStatus } from '@/lib/studio/types'

const STATUS_CONFIG: Record<ProjectStatus, {
  label: string
  color: string
  bgColor: string
  nextAction: string
  nextHref: (id: string) => string
}> = {
  brief: {
    label: 'Brief Only',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    nextAction: 'Generate',
    nextHref: (id) => `/studio/builder?project=${id}`,
  },
  draft: {
    label: 'Draft Ready',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    nextAction: 'Review',
    nextHref: (id) => `/studio/editor?project=${id}`,
  },
  editing: {
    label: 'In Progress',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    nextAction: 'Continue',
    nextHref: (id) => `/studio/editor?project=${id}`,
  },
  complete: {
    label: 'Complete',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    nextAction: 'View',
    nextHref: (id) => `/studio/editor?project=${id}`,
  },
}

const FORMAT_LABELS: Record<string, string> = {
  blog: 'Blog',
  linkedin: 'LinkedIn',
  memo: 'Memo',
  byline: 'Byline',
}

// Onboarding steps for first-time users
const ONBOARDING_STEPS = [
  {
    icon: FileText,
    title: 'Create a Brief',
    description: 'Start with your topic, key points, and target audience',
  },
  {
    icon: Mic,
    title: 'Choose Your Voice',
    description: 'Select a voice profile or use the default professional style',
  },
  {
    icon: Sparkles,
    title: 'Generate & Refine',
    description: 'AI creates a draft, then you polish it with intelligent suggestions',
  },
]

export default function StudioDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(true)

  // Check localStorage for dismissed state
  useEffect(() => {
    const dismissed = localStorage.getItem('studio-onboarding-dismissed')
    if (dismissed === 'true') {
      setShowOnboarding(false)
    }
  }, [])

  const dismissOnboarding = () => {
    setShowOnboarding(false)
    localStorage.setItem('studio-onboarding-dismissed', 'true')
  }

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

  // Get recent projects (max 5)
  const recentProjects = projects.slice(0, 5)

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
    <div className="max-w-4xl mx-auto px-4">
      {/* Hero Section */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Studio</h1>
        <p className="text-gray-600 mb-8">
          Create voice-consistent content from briefs
        </p>

        {/* Primary CTA */}
        <Link
          href="/studio/builder"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-lg"
        >
          <Sparkles className="w-5 h-5" />
          Start New Content
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Onboarding Card - Show for first-time users or when no projects */}
      {showOnboarding && !loading && projects.length === 0 && (
        <div className="mb-8 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-200 p-6 relative">
          <button
            onClick={dismissOnboarding}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-violet-600" />
            <h3 className="font-semibold text-gray-900">How Studio Works</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ONBOARDING_STEPS.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-violet-200 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-violet-600">Step {index + 1}</span>
                    </div>
                    <p className="font-medium text-gray-900 text-sm">{step.title}</p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-violet-200 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Voice profiles are optional — you can start creating right away!
            </p>
            <Link
              href="/studio/builder"
              className="text-sm font-medium text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {!loading && !error && projects.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-500">Total Projects</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-500">In Progress</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.complete}</div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
        </div>
      )}

      {/* Recent Projects */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
          {projects.length > 5 && (
            <Link
              href="/studio/projects"
              className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        ) : recentProjects.length === 0 ? (
          <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
            <PenTool className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-700 mb-1">
              No projects yet
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Create your first piece of content to get started
            </p>
            <Link
              href="/studio/builder"
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Create Content
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
            {recentProjects.map((project) => {
              const status = STATUS_CONFIG[project.status]
              return (
                <Link
                  key={project.id}
                  href={status.nextHref(project.id)}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
                >
                  {/* Status indicator */}
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    project.status === 'complete' ? 'bg-green-500' :
                    project.status === 'editing' ? 'bg-amber-500' :
                    project.status === 'draft' ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-gray-900 truncate group-hover:text-violet-600 transition-colors">
                        {project.title || 'Untitled'}
                      </span>
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
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(project.updated_at)}
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex items-center gap-2 text-sm text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {status.nextAction}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/studio/projects"
          className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-violet-300 hover:bg-violet-50/50 transition-colors group"
        >
          <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-violet-100 transition-colors">
            <FileText className="w-5 h-5 text-gray-600 group-hover:text-violet-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900 group-hover:text-violet-700">All Projects</div>
            <div className="text-xs text-gray-500">Manage your content library</div>
          </div>
        </Link>
        <Link
          href="/voice-lab"
          className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-violet-300 hover:bg-violet-50/50 transition-colors group"
        >
          <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-violet-100 transition-colors">
            <Mic className="w-5 h-5 text-gray-600 group-hover:text-violet-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900 group-hover:text-violet-700">Voice Profiles</div>
            <div className="text-xs text-gray-500">Manage your writing styles</div>
          </div>
        </Link>
      </div>
    </div>
  )
}
