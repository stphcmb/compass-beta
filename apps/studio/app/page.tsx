'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import {
  Plus,
  Loader2,
  Clock,
  AlertCircle,
  FileText,
  ArrowRight,
  Sparkles,
  ChevronRight,
  PenTool,
  X,
  Lightbulb,
  FolderOpen,
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
    color: 'text-slate-400',
    bgColor: 'bg-slate-800/50',
    nextAction: 'Generate',
    nextHref: (id) => `/studio/builder?project=${id}`,
  },
  draft: {
    label: 'Draft Ready',
    color: 'text-blue-400',
    bgColor: 'bg-blue-900/30',
    nextAction: 'Review',
    nextHref: (id) => `/studio/editor?project=${id}`,
  },
  editing: {
    label: 'In Progress',
    color: 'text-amber-400',
    bgColor: 'bg-amber-900/30',
    nextAction: 'Continue',
    nextHref: (id) => `/studio/editor?project=${id}`,
  },
  complete: {
    label: 'Complete',
    color: 'text-green-400',
    bgColor: 'bg-green-900/30',
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
    description: 'Topic, key points, audience',
  },
  {
    icon: PenTool,
    title: 'Choose Voice',
    description: 'Your style or default',
  },
  {
    icon: Sparkles,
    title: 'Generate & Refine',
    description: 'AI draft, then polish',
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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bone)' }}>
      <Header sidebarCollapsed={true} />

      <main className="flex-1 mt-16">
        {/* Hero Section - Dark */}
        <div className="w-full relative" style={{
          background: 'linear-gradient(135deg, #0a0f1a 0%, #111826 50%, #0f1729 100%)',
        }}>
          {/* Gradient orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
              style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}
            />
            <div
              className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
              style={{ background: 'radial-gradient(circle, #6d28d9 0%, transparent 70%)' }}
            />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10 py-12 px-4">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 mb-4"
              style={{
                padding: '6px 14px',
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(109, 40, 217, 0.2) 100%)',
                borderRadius: '100px',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <PenTool size={14} style={{ color: '#a78bfa' }} />
              <span style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#e9d5ff',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Content Studio
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              marginBottom: '12px',
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: '700',
              letterSpacing: '-0.02em',
              lineHeight: '1.1',
              background: 'linear-gradient(135deg, #ffffff 0%, #e9d5ff 50%, #c4b5fd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Create Voice-Consistent Content
            </h1>

            <p style={{
              color: '#94a3b8',
              fontSize: '16px',
              marginBottom: '24px',
              maxWidth: '400px',
              margin: '0 auto 24px',
            }}>
              From brief to polished draft in minutes
            </p>

            {/* Primary CTA */}
            <Link
              href="/studio/builder"
              className="inline-flex items-center gap-3 px-8 py-4 text-white rounded-xl transition-all font-semibold text-lg"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(124, 58, 237, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(124, 58, 237, 0.4)'
              }}
            >
              <Sparkles className="w-5 h-5" />
              Start New Content
              <ArrowRight className="w-5 h-5" />
            </Link>

            {/* Onboarding - inline in hero for first-time users */}
            {showOnboarding && !loading && projects.length === 0 && (
              <div className="mt-8 relative">
                <button
                  onClick={dismissOnboarding}
                  className="absolute -top-2 -right-2 p-1.5 rounded-full transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: '#94a3b8'
                  }}
                  title="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div
                  className="rounded-xl p-5"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Lightbulb className="w-4 h-4" style={{ color: '#a78bfa' }} />
                    <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '600' }}>
                      How it works
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-6 flex-wrap">
                    {ONBOARDING_STEPS.map((step, index) => {
                      const Icon = step.icon
                      return (
                        <div key={index} className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center"
                            style={{
                              background: 'rgba(124, 58, 237, 0.2)',
                              border: '1px solid rgba(124, 58, 237, 0.3)'
                            }}
                          >
                            <Icon className="w-4 h-4" style={{ color: '#a78bfa' }} />
                          </div>
                          <div className="text-left">
                            <p style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '500' }}>{step.title}</p>
                            <p style={{ color: '#64748b', fontSize: '11px' }}>{step.description}</p>
                          </div>
                          {index < ONBOARDING_STEPS.length - 1 && (
                            <ArrowRight className="w-4 h-4 mx-2 hidden sm:block" style={{ color: '#475569' }} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Recent Projects */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: '#1e293b' }}>Recent Projects</h2>
              {projects.length > 5 && (
                <Link
                  href="/studio/projects"
                  className="text-sm flex items-center gap-1 transition-colors"
                  style={{ color: '#7c3aed' }}
                >
                  View all
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#7c3aed' }} />
              </div>
            ) : error ? (
              <div className="rounded-xl p-4 text-center" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                <AlertCircle className="w-6 h-6 mx-auto mb-2" style={{ color: '#f87171' }} />
                <p className="text-sm" style={{ color: '#dc2626' }}>{error}</p>
              </div>
            ) : recentProjects.length === 0 ? (
              <div
                className="rounded-xl p-8 text-center"
                style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  border: '2px dashed #e2e8f0'
                }}
              >
                <PenTool className="w-10 h-10 mx-auto mb-3" style={{ color: '#cbd5e1' }} />
                <h3 className="text-base font-medium mb-1" style={{ color: '#475569' }}>
                  No projects yet
                </h3>
                <p className="text-sm mb-4" style={{ color: '#94a3b8' }}>
                  Create your first piece of content to get started
                </p>
                <Link
                  href="/studio/builder"
                  className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium"
                  style={{ background: '#7c3aed' }}
                >
                  <Plus className="w-4 h-4" />
                  Create Content
                </Link>
              </div>
            ) : (
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                {recentProjects.map((project, idx) => {
                  const status = STATUS_CONFIG[project.status]
                  return (
                    <Link
                      key={project.id}
                      href={status.nextHref(project.id)}
                      className="flex items-center gap-4 p-4 transition-colors group"
                      style={{
                        borderBottom: idx < recentProjects.length - 1 ? '1px solid #f1f5f9' : 'none',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#faf5ff'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Status indicator */}
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        project.status === 'complete' ? 'bg-green-500' :
                        project.status === 'editing' ? 'bg-amber-500' :
                        project.status === 'draft' ? 'bg-blue-500' : 'bg-slate-300'
                      }`} />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className="font-medium truncate transition-colors"
                            style={{ color: '#1e293b' }}
                          >
                            {project.title || 'Untitled'}
                          </span>
                          {project.voice_profile_id && (
                            <PenTool className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#7c3aed' }} />
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs" style={{ color: '#64748b' }}>
                          <span
                            className="px-1.5 py-0.5 rounded font-medium"
                            style={{
                              background: project.status === 'complete' ? '#dcfce7' :
                                         project.status === 'editing' ? '#fef3c7' :
                                         project.status === 'draft' ? '#dbeafe' : '#f1f5f9',
                              color: project.status === 'complete' ? '#166534' :
                                     project.status === 'editing' ? '#92400e' :
                                     project.status === 'draft' ? '#1e40af' : '#475569'
                            }}
                          >
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
                      <div
                        className="flex items-center gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: '#7c3aed' }}
                      >
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
              className="flex items-center gap-3 p-4 rounded-xl transition-all group"
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#7c3aed'
                e.currentTarget.style.background = '#faf5ff'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0'
                e.currentTarget.style.background = '#ffffff'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <div
                className="p-2.5 rounded-lg transition-colors"
                style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)' }}
              >
                <FolderOpen className="w-5 h-5" style={{ color: '#7c3aed' }} />
              </div>
              <div>
                <div className="font-semibold" style={{ color: '#1e293b' }}>All Projects</div>
                <div className="text-sm" style={{ color: '#64748b' }}>Manage your content library</div>
              </div>
              <ChevronRight className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#7c3aed' }} />
            </Link>
            <Link
              href="/voice-lab"
              className="flex items-center gap-3 p-4 rounded-xl transition-all group"
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#7c3aed'
                e.currentTarget.style.background = '#faf5ff'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0'
                e.currentTarget.style.background = '#ffffff'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <div
                className="p-2.5 rounded-lg transition-colors"
                style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)' }}
              >
                <PenTool className="w-5 h-5" style={{ color: '#7c3aed' }} />
              </div>
              <div>
                <div className="font-semibold" style={{ color: '#1e293b' }}>Voice Profiles</div>
                <div className="text-sm" style={{ color: '#64748b' }}>Manage your writing styles</div>
              </div>
              <ChevronRight className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#7c3aed' }} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
