// Database types for AI Thought Leaders & Taxonomy

export interface ThoughtLeader {
  id: string
  name: string
  affiliation?: string
  position_summary?: string
  credibility_tier?: string
  author_type?: string
  sources?: any[]
  created_at?: string
  updated_at?: string
}

export interface TaxonomyCamp {
  id: string
  name: string
  description?: string
  position_summary?: string
  domain?: string
  created_at?: string
  updated_at?: string
}

export interface AuthorCampMapping {
  id: string
  author_id: string
  camp_id: string
  relevance?: string
  created_at?: string
}

export interface Domain {
  id: string
  name: string
  description?: string
  created_at?: string
}
