/**
 * Perspective Relationships
 *
 * Defines which perspectives naturally oppose each other within each domain.
 * Used to show "Challenges" authors from opposing viewpoints in the Browse UI.
 */

// Perspectives that directly oppose each other
export const PERSPECTIVE_OPPOSITES: Record<string, string[]> = {
  // Domain 1: AI Technical Capabilities
  'Scaling Will Deliver': ['Needs New Approaches'],
  'Needs New Approaches': ['Scaling Will Deliver'],

  // Domain 2: AI & Society
  'Safety First': ['Democratize Fast'],
  'Democratize Fast': ['Safety First'],

  // Domain 3: Enterprise AI Adoption (4 perspectives)
  'Co-Evolution': ['Technology Leads'],
  'Technology Leads': ['Co-Evolution', 'Business Whisperers'],
  'Business Whisperers': ['Tech Builders', 'Technology Leads'],
  'Tech Builders': ['Business Whisperers'],

  // Domain 4: AI Governance & Oversight (3 perspectives)
  'Regulatory Interventionist': ['Innovation First'],
  'Innovation First': ['Regulatory Interventionist'],
  'Adaptive Governance': [], // Middle ground - no direct opposite

  // Domain 5: Future of Work
  'Displacement Realist': ['Human–AI Collaboration'],
  'Human–AI Collaboration': ['Displacement Realist'],
}

// Perspectives that tend to align across domains
// (Authors in these perspectives often share similar worldviews)
export const PERSPECTIVE_ALLIES: Record<string, string[]> = {
  // Pro-acceleration cluster
  'Scaling Will Deliver': ['Democratize Fast', 'Technology Leads', 'Innovation First'],
  'Democratize Fast': ['Scaling Will Deliver', 'Innovation First'],
  'Technology Leads': ['Scaling Will Deliver', 'Tech Builders', 'Innovation First'],
  'Innovation First': ['Scaling Will Deliver', 'Democratize Fast', 'Technology Leads'],
  'Tech Builders': ['Technology Leads', 'Scaling Will Deliver'],

  // Caution cluster
  'Safety First': ['Regulatory Interventionist', 'Needs New Approaches'],
  'Regulatory Interventionist': ['Safety First', 'Co-Evolution'],
  'Needs New Approaches': ['Safety First', 'Adaptive Governance'],

  // Human-centered cluster
  'Co-Evolution': ['Human–AI Collaboration', 'Business Whisperers', 'Adaptive Governance'],
  'Business Whisperers': ['Co-Evolution', 'Human–AI Collaboration'],
  'Human–AI Collaboration': ['Co-Evolution', 'Business Whisperers'],
  'Adaptive Governance': ['Co-Evolution', 'Human–AI Collaboration'],

  // Disruption-aware
  'Displacement Realist': ['Safety First', 'Regulatory Interventionist'],
}

/**
 * Get opposing perspectives for a given perspective
 */
export function getOpposingPerspectives(perspectiveName: string): string[] {
  return PERSPECTIVE_OPPOSITES[perspectiveName] || []
}

/**
 * Get allied perspectives for a given perspective
 */
export function getAlliedPerspectives(perspectiveName: string): string[] {
  return PERSPECTIVE_ALLIES[perspectiveName] || []
}
